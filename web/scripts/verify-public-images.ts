import fs from "node:fs";
import path from "node:path";
import { VERIFIED_STATIC_IMAGES } from "../lib/content/image-assets";

const publicDir = path.join(process.cwd(), "public");

function main() {
  const missing: string[] = [];

  for (const imgPath of VERIFIED_STATIC_IMAGES) {
    const full = path.join(publicDir, imgPath);
    if (!fs.existsSync(full)) {
      missing.push(imgPath);
    }
  }

  if (missing.length > 0) {
    console.error("Missing static images:\n");
    for (const p of missing) {
      console.error(`  ✗ ${p}`);
    }
    process.exit(1);
  }

  console.log(`✓ All ${VERIFIED_STATIC_IMAGES.length} static images verified.`);
}

main();
