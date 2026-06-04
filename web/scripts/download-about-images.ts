import fs from "node:fs";
import path from "node:path";
import { ABOUT_IMAGE_SOURCES, ABOUT_IMAGES } from "../lib/content/image-assets";

const publicAbout = path.join(process.cwd(), "public", "about");

async function download(url: string, dest: string, fallbackSrc?: string) {
  let res = await fetch(url);
  if (!res.ok && url.includes("&fm=webp")) {
    res = await fetch(url.replace("&fm=webp", ""));
  }
  if (!res.ok) {
    if (fallbackSrc && fs.existsSync(fallbackSrc)) {
      fs.copyFileSync(fallbackSrc, dest);
      console.log(`↳ ${path.basename(dest)} (copied fallback)`);
      return;
    }
    throw new Error(`Failed ${url}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`✓ ${path.basename(dest)} (${(buf.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  fs.mkdirSync(publicAbout, { recursive: true });

  const heroFallback = path.join(publicAbout, "hero.webp");

  const entries = Object.entries(ABOUT_IMAGES) as [keyof typeof ABOUT_IMAGES, string][];
  for (const [key, localPath] of entries) {
    const filename = path.basename(localPath);
    const dest = path.join(publicAbout, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`⊘ ${filename} (exists)`);
      continue;
    }
    const url = ABOUT_IMAGE_SOURCES[key];
    await download(url, dest, heroFallback);
  }

  console.log(`\nDownloaded ${entries.length} images to public/about/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
