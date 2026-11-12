#!/usr/bin/env python3
"""Enrich publishers with social links and PR/HR/admin contact emails from their websites."""

from __future__ import annotations

import csv
import json
import re
import ssl
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
INPUT_CSV = ROOT / "publishers-publish.csv"
OUTPUT_CSV = ROOT / "publishers-social-contacts.csv"
PROGRESS_JSON = ROOT / "scripts" / ".publisher-enrich-progress.json"

USER_AGENT = (
    "Mozilla/5.0 (compatible; BooksPlatformResearch/1.0; +https://booksplatform.net)"
)
TIMEOUT_SEC = 12
MAX_WORKERS = 12
MAX_BYTES = 900_000

SOCIAL_PATTERNS = {
    "x": re.compile(
        r"https?://(?:www\.)?(?:twitter\.com|x\.com)/([A-Za-z0-9_]{1,30})(?:/|\?|#|$)",
        re.I,
    ),
    "facebook": re.compile(
        r"https?://(?:www\.)?(?:facebook\.com|fb\.com)/([A-Za-z0-9.%-]{2,120})(?:/|\?|#|$)",
        re.I,
    ),
    "instagram": re.compile(
        r"https?://(?:www\.)?instagram\.com/([A-Za-z0-9._]{1,60})(?:/|\?|#|$)",
        re.I,
    ),
    "linkedin": re.compile(
        r"https?://(?:[a-z]+\.)?linkedin\.com/(?:company|in|school)/([A-Za-z0-9&%-]{2,120})(?:/|\?|#|$)",
        re.I,
    ),
    "telegram": re.compile(
        r"https?://(?:t\.me|telegram\.me)/([A-Za-z0-9_]{3,60})(?:/|\?|#|$)",
        re.I,
    ),
}

SOCIAL_BLOCKLIST = {
    "x": {
        "share",
        "intent",
        "home",
        "search",
        "i",
        "login",
        "signup",
        "explore",
        "settings",
        "privacy",
        "tos",
    },
    "facebook": {
        "sharer",
        "share",
        "dialog",
        "plugins",
        "login",
        "watch",
        "reel",
        "groups",
        "events",
        "marketplace",
        "privacy",
        "help",
        "policies",
        "people",
        "pages",
        "profile.php",
        "tr",
    },
    "instagram": {"p", "reel", "reels", "stories", "explore", "accounts", "about", "legal"},
    "linkedin": {"share", "sharing", "feed", "login", "signup", "jobs", "pulse", "school"},
    "telegram": {"share", "joinchat", "addstickers", "proxy", "iv"},
}

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", re.I)
HREF_RE = re.compile(r"""href\s*=\s*["']([^"']+)["']""", re.I)
CONTACT_ROLE_RE = re.compile(
    r"\b(hr|human[\s._-]?resources|careers?|jobs?|recruit|talent|"
    r"pr|press|publicit(?:y|ies)|public[\s._-]?relations|media|comms?|communications?|"
    r"admin|administrator|office|info|contact|rights|permissions?|permissions?|"
    r"marketing|partnerships?|permissions?)\b",
    re.I,
)
ROLE_PRIORITY = {
    "pr": 100,
    "press": 95,
    "publicity": 95,
    "public relations": 95,
    "media": 90,
    "communications": 85,
    "comms": 85,
    "rights": 80,
    "permissions": 75,
    "marketing": 70,
    "partnerships": 65,
    "hr": 60,
    "human resources": 60,
    "careers": 55,
    "jobs": 55,
    "recruit": 55,
    "talent": 55,
    "admin": 50,
    "administrator": 50,
    "office": 45,
    "info": 40,
    "contact": 35,
}

ROLE_BUCKETS = {
    "pr": {"pr", "press", "publicity", "public relations", "media", "communications", "comms", "marketing"},
    "hr": {"hr", "human resources", "careers", "jobs", "recruit", "talent"},
    "admin": {"admin", "administrator", "office", "info", "contact", "rights", "permissions", "partnerships"},
}


def normalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    if not re.match(r"^https?://", url, re.I):
        url = "http://" + url
    return url


def fetch_html(url: str) -> tuple[str, str]:
    req = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en,ar;q=0.8",
        },
        method="GET",
    )
    ctx = ssl.create_default_context()
    with urlopen(req, timeout=TIMEOUT_SEC, context=ctx) as resp:
        final_url = resp.geturl()
        content_type = (resp.headers.get("Content-Type") or "").lower()
        raw = resp.read(MAX_BYTES)
    if "html" not in content_type and b"<html" not in raw[:2000].lower():
        return final_url, ""
    for enc in ("utf-8", "latin-1", "cp1256"):
        try:
            return final_url, raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return final_url, raw.decode("utf-8", errors="ignore")


def clean_social_handle(platform: str, handle: str) -> str | None:
    handle = unescape(handle).strip().strip("/")
    if not handle:
        return None
    handle = handle.split("?")[0].split("#")[0].strip("/")
    lower = handle.lower()
    if lower in SOCIAL_BLOCKLIST.get(platform, set()):
        return None
    if platform == "facebook" and lower.startswith(("sharer.php", "share.php", "dialog/")):
        return None
    if any(x in lower for x in ("javascript:", "mailto:", "tel:")):
        return None
    return handle


def extract_socials(html: str, base_url: str) -> dict[str, str]:
    found: dict[str, list[str]] = {k: [] for k in SOCIAL_PATTERNS}
    text = unescape(html)

    candidates: list[str] = []
    for href in HREF_RE.findall(text):
        abs_url = urljoin(base_url, href.strip())
        candidates.append(abs_url)
    # also scan bare URLs in page text / scripts
    candidates.extend(
        re.findall(
            r"https?://(?:www\.)?(?:twitter\.com|x\.com|facebook\.com|fb\.com|instagram\.com|linkedin\.com|t\.me|telegram\.me)/[^\s\"'<>]+",
            text,
            flags=re.I,
        )
    )

    for url in candidates:
        for platform, pattern in SOCIAL_PATTERNS.items():
            m = pattern.search(url)
            if not m:
                continue
            handle = clean_social_handle(platform, m.group(1))
            if not handle:
                continue
            if platform == "x":
                canon = f"https://x.com/{handle}"
            elif platform == "facebook":
                canon = f"https://www.facebook.com/{handle}"
            elif platform == "instagram":
                canon = f"https://www.instagram.com/{handle}"
            elif platform == "linkedin":
                kind = "company"
                if "/in/" in url.lower():
                    kind = "in"
                elif "/school/" in url.lower():
                    kind = "school"
                canon = f"https://www.linkedin.com/{kind}/{handle}"
            else:
                canon = f"https://t.me/{handle}"
            if canon not in found[platform]:
                found[platform].append(canon)

    return {k: v[0] if v else "" for k, v in found.items()}


def classify_email(email: str) -> tuple[str | None, int]:
    local = email.split("@", 1)[0].lower().replace("-", " ").replace("_", " ").replace(".", " ")
    best_role = None
    best_score = -1
    for role, score in ROLE_PRIORITY.items():
        if role in local or any(tok == role for tok in local.split()):
            if score > best_score:
                best_role = role
                best_score = score
    if best_role is None and CONTACT_ROLE_RE.search(local):
        best_role = "contact"
        best_score = 30
    return best_role, best_score


def extract_role_emails(html: str, existing_email: str) -> dict[str, str]:
    emails = set(EMAIL_RE.findall(unescape(html)))
    if existing_email:
        emails.add(existing_email.strip())

    buckets: dict[str, list[tuple[int, str]]] = {"pr": [], "hr": [], "admin": []}
    for email in emails:
        email = email.strip(".,);:>\"'")
        if email.lower().endswith(
            (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js")
        ):
            continue
        role, score = classify_email(email)
        if not role:
            continue
        for bucket, roles in ROLE_BUCKETS.items():
            if role in roles:
                buckets[bucket].append((score, email.lower()))

    result = {}
    for bucket, items in buckets.items():
        if not items:
            result[bucket] = ""
            continue
        items.sort(key=lambda x: (-x[0], x[1]))
        # unique preserve order
        seen = []
        for _, email in items:
            if email not in seen:
                seen.append(email)
        result[bucket] = " | ".join(seen[:3])
    return result


def discover_contact_pages(html: str, base_url: str) -> list[str]:
    keywords = ("contact", "about", "press", "media", "publicity", "rights", "careers", "hr")
    urls: list[str] = []
    for href in HREF_RE.findall(html):
        abs_url = urljoin(base_url, href.strip())
        path = urlparse(abs_url).path.lower()
        if any(k in path for k in keywords):
            if abs_url not in urls:
                urls.append(abs_url)
    return urls[:3]


def enrich_one(row: dict[str, str]) -> dict[str, str]:
    website = normalize_url(row.get("الموقع", ""))
    existing_email = (row.get("البريد") or "").strip()
    result = {
        **row,
        "X": "",
        "Facebook": "",
        "Instagram": "",
        "LinkedIn": "",
        "Telegram": "",
        "PR_Emails": "",
        "HR_Emails": "",
        "Admin_Emails": "",
        "Source_Pages": "",
        "Enrich_Status": "no_website",
        "Enrich_Notes": "",
    }
    if not website:
        return result

    pages_checked: list[str] = []
    combined_html = ""
    notes: list[str] = []
    try:
        final_url, html = fetch_html(website)
        pages_checked.append(final_url or website)
        combined_html += "\n" + html
        for extra in discover_contact_pages(html, final_url or website):
            try:
                _, extra_html = fetch_html(extra)
                pages_checked.append(extra)
                combined_html += "\n" + extra_html
            except Exception as exc:  # noqa: BLE001
                notes.append(f"contact_page_fail:{extra}:{type(exc).__name__}")
    except HTTPError as exc:
        result["Enrich_Status"] = f"http_{exc.code}"
        result["Enrich_Notes"] = str(exc.reason)
        return result
    except (URLError, TimeoutError, ssl.SSLError) as exc:
        result["Enrich_Status"] = "fetch_failed"
        result["Enrich_Notes"] = f"{type(exc).__name__}:{exc}"
        return result
    except Exception as exc:  # noqa: BLE001
        result["Enrich_Status"] = "error"
        result["Enrich_Notes"] = f"{type(exc).__name__}:{exc}"
        return result

    socials = extract_socials(combined_html, pages_checked[0])
    roles = extract_role_emails(combined_html, existing_email)
    result.update(
        {
            "X": socials.get("x", ""),
            "Facebook": socials.get("facebook", ""),
            "Instagram": socials.get("instagram", ""),
            "LinkedIn": socials.get("linkedin", ""),
            "Telegram": socials.get("telegram", ""),
            "PR_Emails": roles.get("pr", ""),
            "HR_Emails": roles.get("hr", ""),
            "Admin_Emails": roles.get("admin", ""),
            "Source_Pages": " | ".join(pages_checked),
            "Enrich_Status": "ok",
            "Enrich_Notes": "; ".join(notes),
        }
    )
    return result


def load_progress() -> dict[str, dict]:
    if PROGRESS_JSON.exists():
        return json.loads(PROGRESS_JSON.read_text(encoding="utf-8"))
    return {}


def save_progress(data: dict[str, dict]) -> None:
    PROGRESS_JSON.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")


def main() -> None:
    with INPUT_CSV.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    progress = load_progress()
    todo = []
    for row in rows:
        key = (row.get("الرابط") or row.get("العنوان") or "").strip()
        if not key:
            continue
        if key in progress and progress[key].get("Enrich_Status") not in {
            "fetch_failed",
            "error",
        }:
            continue
        todo.append((key, row))

    print(f"total={len(rows)} cached={len(progress)} todo={len(todo)}", flush=True)
    done = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(enrich_one, row): key for key, row in todo}
        for fut in as_completed(futures):
            key = futures[fut]
            try:
                progress[key] = fut.result()
            except Exception as exc:  # noqa: BLE001
                progress[key] = {
                    **dict(next(r for k, r in todo if k == key)),
                    "X": "",
                    "Facebook": "",
                    "Instagram": "",
                    "LinkedIn": "",
                    "Telegram": "",
                    "PR_Emails": "",
                    "HR_Emails": "",
                    "Admin_Emails": "",
                    "Source_Pages": "",
                    "Enrich_Status": "error",
                    "Enrich_Notes": f"{type(exc).__name__}:{exc}",
                }
            done += 1
            if done % 25 == 0 or done == len(todo):
                save_progress(progress)
                print(f"progress {done}/{len(todo)}", flush=True)
            time.sleep(0.01)

    save_progress(progress)

    fieldnames = list(rows[0].keys()) + [
        "X",
        "Facebook",
        "Instagram",
        "LinkedIn",
        "Telegram",
        "PR_Emails",
        "HR_Emails",
        "Admin_Emails",
        "Source_Pages",
        "Enrich_Status",
        "Enrich_Notes",
    ]
    with OUTPUT_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            key = (row.get("الرابط") or row.get("العنوان") or "").strip()
            writer.writerow(progress.get(key, {**row, "Enrich_Status": "missing"}))

    # summary
    statuses = {}
    filled = {"X": 0, "Facebook": 0, "Instagram": 0, "LinkedIn": 0, "Telegram": 0, "PR_Emails": 0, "HR_Emails": 0, "Admin_Emails": 0}
    for row in progress.values():
        statuses[row.get("Enrich_Status", "?")] = statuses.get(row.get("Enrich_Status", "?"), 0) + 1
        for col in filled:
            if (row.get(col) or "").strip():
                filled[col] += 1
    print("statuses", statuses)
    print("filled", filled)
    print("output", OUTPUT_CSV)


if __name__ == "__main__":
    main()
