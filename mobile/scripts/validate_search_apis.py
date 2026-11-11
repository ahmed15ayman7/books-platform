#!/usr/bin/env python3
"""Validate search-related APIs against the Flutter mobile implementation."""

from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from typing import Any

import urllib.error
import urllib.parse
import urllib.request

BASE_URL = "https://booksplatform.ahmed15ayman7.com/api/v1"
TIMEOUT = 30

SEARCH_QUERIES = [
    ("empty", ""),
    ("single_char", "a"),
    ("arabic_philosophy", "فلسفة"),
    ("english_harvard", "Harvard"),
    ("publisher_like", "دار"),
    ("no_results_xyz", "xyznonexistentquery999"),
]

SUGGESTION_QUERIES = [
    ("empty", ""),
    ("single_char", "a"),
    ("arabic", "فلس"),
    ("english", "Har"),
]

PUBLISHER_SEARCH_QUERIES = [
    ("empty", None),
    ("arabic", "دار"),
    ("english", "Press"),
    ("no_results", "xyznonexistent999"),
]


@dataclass
class CheckResult:
    name: str
    passed: bool
    detail: str


@dataclass
class EndpointReport:
    endpoint: str
    status: int | None = None
    error: str | None = None
    checks: list[CheckResult] = field(default_factory=list)
    sample: Any = None


def fetch_json(path: str, params: dict[str, Any] | None = None) -> tuple[int, Any]:
    query = urllib.parse.urlencode({k: v for k, v in (params or {}).items() if v is not None})
    url = f"{BASE_URL}{path}" + (f"?{query}" if query else "")
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "mobile-search-validator/1.0"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        body = resp.read().decode("utf-8")
        return resp.status, json.loads(body)


def add_check(report: EndpointReport, name: str, passed: bool, detail: str) -> None:
    report.checks.append(CheckResult(name=name, passed=passed, detail=detail))


def validate_envelope(payload: Any, report: EndpointReport, expect_data_type: str) -> Any | None:
    if not isinstance(payload, dict):
        add_check(report, "root_is_object", False, f"Expected object, got {type(payload).__name__}")
        return None
    add_check(report, "root_is_object", True, "ok")

    if "success" in payload:
        add_check(report, "has_success_flag", True, f"success={payload.get('success')}")
        if payload.get("success") is not True:
            add_check(report, "success_true", False, "API returned success=false")
            return None
        add_check(report, "success_true", True, "ok")
    else:
        add_check(report, "has_success_flag", False, "Missing success field (mobile ApiEnvelope tolerates data-only)")

    data = payload.get("data")
    if data is None:
        add_check(report, "has_data", False, "data is null/missing")
        return None

    if expect_data_type == "object" and not isinstance(data, dict):
        add_check(report, "data_is_object", False, f"Expected object, got {type(data).__name__}")
        return None
    if expect_data_type == "array" and not isinstance(data, list):
        add_check(report, "data_is_array", False, f"Expected array, got {type(data).__name__}")
        return None

    add_check(report, f"data_is_{expect_data_type}", True, "ok")
    return data


def validate_search_section(section: Any, section_name: str, report: EndpointReport) -> tuple[list, int]:
    """Mobile SearchResponseModel expects {items: [], total: N}."""
    if isinstance(section, dict) and "items" in section:
        items = section.get("items") or []
        total = int(section.get("total") or 0)
        add_check(report, f"{section_name}_nested_shape", True, f"items={len(items)}, total={total}")
        if not isinstance(items, list):
            add_check(report, f"{section_name}_items_list", False, "items is not a list")
            return [], 0
        add_check(report, f"{section_name}_items_list", True, "ok")
        return items, total

    if isinstance(section, list):
        add_check(
            report,
            f"{section_name}_nested_shape",
            False,
            "API returned flat array (mobile expects {items,total} for type=all)",
        )
        return section, len(section)

    add_check(report, f"{section_name}_nested_shape", False, f"Unexpected shape: {type(section).__name__}")
    return [], 0


def validate_book_item(item: dict, report: EndpointReport, prefix: str) -> None:
    slug = item.get("slug")
    title = item.get("nameEn") or item.get("titleEn") or item.get("nameAr") or item.get("titleAr")
    add_check(report, f"{prefix}_has_slug", bool(slug), f"slug={slug!r}")
    add_check(report, f"{prefix}_has_title", bool(title), f"title={title!r}")


def validate_publisher_item(item: dict, report: EndpointReport, prefix: str) -> None:
    slug = item.get("slug")
    name = item.get("name") or item.get("title") or item.get("nameAr")
    add_check(report, f"{prefix}_has_slug", bool(slug), f"slug={slug!r}")
    add_check(report, f"{prefix}_has_name", bool(name), f"name={name!r}")


def validate_suggestion_item(item: dict, report: EndpointReport, prefix: str) -> None:
    for key in ("type", "label", "slug"):
        add_check(report, f"{prefix}_has_{key}", key in item and bool(item.get(key)), f"{key}={item.get(key)!r}")


def test_global_search(label: str, query: str) -> EndpointReport:
    report = EndpointReport(endpoint=f"GET /search?q={query!r} [{label}]")
    try:
        status, payload = fetch_json("/search", {"q": query, "page": 1, "limit": 20})
        report.status = status
        report.sample = payload
        data = validate_envelope(payload, report, "object")
        if data is None:
            return report

        books_items, books_total = validate_search_section(data.get("books"), "books", report)
        articles_items, articles_total = validate_search_section(data.get("articles"), "articles", report)
        publishers_items, publishers_total = validate_search_section(data.get("publishers"), "publishers", report)

        mobile_total = books_total + articles_total + publishers_total
        add_check(
            report,
            "mobile_total_results_formula",
            True,
            f"mobile would compute totalResults={mobile_total}",
        )

        has_results = bool(books_items or articles_items or publishers_items)
        if len(query.strip()) < 2:
            add_check(
                report,
                "short_query_empty_results",
                not has_results,
                f"API returned results for short query: books={len(books_items)}, articles={len(articles_items)}, publishers={len(publishers_items)}",
            )
        elif query == "xyznonexistentquery999":
            add_check(report, "no_results_case", not has_results, f"unexpected hits: {mobile_total}")

        if books_items:
            validate_book_item(books_items[0], report, "first_book")
        if publishers_items:
            validate_publisher_item(publishers_items[0], report, "first_publisher")

        # Mobile gaps
        media = data.get("media")
        authors = data.get("authors")
        if media and isinstance(media, dict) and media.get("total", 0) > 0:
            add_check(report, "mobile_ignores_media", False, f"API has media={media.get('total')} but mobile does not render media")
        else:
            add_check(report, "mobile_ignores_media", True, "no media results or section empty")

        if articles_items:
            add_check(report, "mobile_ignores_articles", False, f"API has {len(articles_items)} articles but mobile UI only shows books+publishers")
        else:
            add_check(report, "mobile_ignores_articles", True, "no article results")

        if authors and isinstance(authors, dict) and authors.get("total", 0) > 0:
            add_check(report, "mobile_ignores_authors", False, f"API has authors={authors.get('total')} but mobile does not render authors")
        else:
            add_check(report, "mobile_ignores_authors", True, "no author results or section empty")

        mode = data.get("mode")
        add_check(report, "api_mode_present", mode in ("preview", "section", None), f"mode={mode!r}")

        unused_params = ["type", "locale", "sort", "category", "status", "country"]
        add_check(
            report,
            "mobile_passes_unused_filters",
            True,
            f"mobile sends optional params but never uses: {', '.join(unused_params)}",
        )

    except urllib.error.HTTPError as exc:
        report.status = exc.code
        report.error = f"HTTP {exc.code}: {exc.reason}"
    except Exception as exc:  # noqa: BLE001
        report.error = str(exc)
    return report


def test_search_suggestions(label: str, query: str) -> EndpointReport:
    report = EndpointReport(endpoint=f"GET /search/suggestions?q={query!r} [{label}]")
    try:
        status, payload = fetch_json("/search/suggestions", {"q": query, "limit": 5})
        report.status = status
        report.sample = payload
        data = validate_envelope(payload, report, "array")
        if data is None:
            return report

        add_check(report, "suggestions_count_within_limit", len(data) <= 5, f"count={len(data)}")
        if len(query.strip()) < 2:
            add_check(report, "short_query_empty_suggestions", len(data) == 0, f"count={len(data)}")
        if data:
            validate_suggestion_item(data[0], report, "first_suggestion")
            types = {item.get("type") for item in data}
            add_check(report, "suggestion_types_known", types.issubset({"book", "publisher", "article"}), f"types={types}")
            if any("labelEn" in item for item in data):
                add_check(report, "api_has_labelEn", True, "API returns labelEn but mobile SearchSuggestionModel ignores it")
        add_check(
            report,
            "mobile_ui_uses_suggestions",
            False,
            "SearchCubit fetches suggestions but SearchScreen never renders them",
        )
    except urllib.error.HTTPError as exc:
        report.status = exc.code
        report.error = f"HTTP {exc.code}: {exc.reason}"
    except Exception as exc:  # noqa: BLE001
        report.error = str(exc)
    return report


def test_publishers_search(label: str, search: str | None) -> EndpointReport:
    report = EndpointReport(endpoint=f"GET /publishers?search={search!r} [{label}]")
    try:
        params: dict[str, Any] = {"page": 1, "limit": 20}
        if search is not None:
            params["search"] = search
        status, payload = fetch_json("/publishers", params)
        report.status = status
        report.sample = payload

        if not isinstance(payload, dict):
            add_check(report, "root_is_object", False, f"got {type(payload).__name__}")
            return report
        add_check(report, "root_is_object", True, "ok")

        data = payload.get("data")
        pagination = payload.get("pagination")
        add_check(report, "has_data_array", isinstance(data, list), f"type={type(data).__name__}")
        add_check(report, "has_pagination", isinstance(pagination, dict), f"type={type(pagination).__name__}")

        if isinstance(data, list) and data:
            first = data[0]
            validate_publisher_item(first, report, "first_publisher")
            for key in ("slug", "name", "nameAr", "booksCount", "countries"):
                add_check(report, f"publisher_field_{key}", key in first, f"present={key in first}")

        if search == "xyznonexistent999" and isinstance(data, list):
            add_check(report, "no_results_case", len(data) == 0, f"count={len(data)}")

        add_check(
            report,
            "publishers_search_no_debounce",
            True,
            "mobile PublishersListCubit.search fires on every keystroke (no debounce)",
        )
    except urllib.error.HTTPError as exc:
        report.status = exc.code
        report.error = f"HTTP {exc.code}: {exc.reason}"
    except Exception as exc:  # noqa: BLE001
        report.error = str(exc)
    return report


def test_search_type_filter() -> EndpointReport:
    report = EndpointReport(endpoint="GET /search?q=Harvard&type=books")
    try:
        status, payload = fetch_json("/search", {"q": "Harvard", "type": "books", "page": 1, "limit": 10})
        report.status = status
        report.sample = payload
        data = validate_envelope(payload, report, "object")
        if data is None:
            return report

        books = data.get("books")
        if isinstance(books, list):
            add_check(report, "section_mode_flat_books_array", True, f"books count={len(books)}")
            add_check(
                report,
                "mobile_supports_type_filter",
                False,
                "mobile SearchRemoteDataSource accepts type param but SearchCubit never passes it; no tabs in UI",
            )
        elif isinstance(books, dict):
            add_check(report, "preview_mode_nested_books", True, "type=all still used?")
        add_check(report, "api_supports_type_filter", True, "backend supports type=books|articles|publishers|...")
    except Exception as exc:  # noqa: BLE001
        report.error = str(exc)
    return report


def print_report(report: EndpointReport) -> tuple[int, int]:
    print(f"\n{'=' * 72}")
    print(report.endpoint)
    if report.error:
        print(f"ERROR: {report.error}")
        return 0, 1
    print(f"HTTP {report.status}")
    passed = sum(1 for c in report.checks if c.passed)
    failed = sum(1 for c in report.checks if not c.passed)
    for check in report.checks:
        mark = "PASS" if check.passed else "FAIL"
        print(f"  [{mark}] {check.name}: {check.detail}")
    if report.sample is not None and not report.error:
        sample_str = json.dumps(report.sample, ensure_ascii=False, indent=2)
        if len(sample_str) > 1200:
            sample_str = sample_str[:1200] + "\n  ... truncated ..."
        print("  Sample:")
        for line in sample_str.splitlines():
            print(f"    {line}")
    return passed, failed


def main() -> int:
    print(f"Base URL: {BASE_URL}")
    all_passed = 0
    all_failed = 0
    reports: list[EndpointReport] = []

    for label, query in SEARCH_QUERIES:
        reports.append(test_global_search(label, query))
    for label, query in SUGGESTION_QUERIES:
        reports.append(test_search_suggestions(label, query))
    for label, search in PUBLISHER_SEARCH_QUERIES:
        reports.append(test_publishers_search(label, search))
    reports.append(test_search_type_filter())

    for report in reports:
        p, f = print_report(report)
        all_passed += p
        all_failed += f

    print(f"\n{'=' * 72}")
    print(f"TOTAL CHECKS: {all_passed} passed, {all_failed} failed")

    print("\nMOBILE ENHANCEMENT SUMMARY")
    enhancements = [
        "1. Render live autocomplete suggestions from /search/suggestions (already fetched in SearchCubit).",
        "2. Show article (and optionally media/author) results — API returns them but UI only lists books + publishers.",
        "3. Add result tabs/filters (All, Books, Articles, Publishers) using API type= param.",
        "4. Replace hardcoded recent/popular chips with local recent-search storage + server popular terms.",
        "5. Wire pagination (page/limit) for global search — API supports it, mobile always uses page=1.",
        "6. Pass locale to /search for localized labels where API supports it.",
        "7. Add debounce to Publishers screen search (global search already debounces at 300ms).",
        "8. Use API labelEn in suggestions for English UI instead of Arabic-only label.",
        "9. Consider unifying publishers inline search with global search to avoid duplicate UX/API paths.",
    ]
    for item in enhancements:
        print(f"  - {item}")

    return 0 if all_failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
