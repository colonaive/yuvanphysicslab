import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const brandDir = path.join(publicDir, "brand");
const iconsDir = path.join(publicDir, "icons");

const markLightPath = path.join(brandDir, "yrc-mark-light.svg");
const lockupLightPath = path.join(brandDir, "yrc-lockup-light.svg");
const lockupDarkPath = path.join(brandDir, "yrc-lockup-dark.svg");

const toPng = async (inputPath, outputPath, resizeOptions) => {
  const input = await readFile(inputPath);
  await sharp(input, { density: 1200 })
    .resize(resizeOptions)
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      quality: 100,
    })
    .toFile(outputPath);
};

const run = async () => {
  await mkdir(iconsDir, { recursive: true });

  const iconSizes = [
    { file: "favicon-16.png", size: 16 },
    { file: "favicon-32.png", size: 32 },
    { file: "icon-64.png", size: 64 },
    { file: "icon-128.png", size: 128 },
    { file: "icon-256.png", size: 256 },
    { file: "icon-512.png", size: 512 },
    { file: "android-chrome-192x192.png", size: 192 },
    { file: "android-chrome-512x512.png", size: 512 },
    { file: "apple-touch-icon.png", size: 180 },
  ];

  // PART C: Rebuild Favicons from MARK ONLY
  // Goal: Tighter crop. Diamond should fill 100% of canvas visual area (removing padding).
  // 1. Render SVG at high res.
  // 2. Trim transparent pixels (removes the 512px padding).
  // 3. Resize to final icon size.

  // PART C: Rebuild Favicons from PREMIUM MARK (Navy)
  const premiumMarkPath = path.join(brandDir, "yrc-mark.svg");

  for (const { file, size } of iconSizes) {
    const outPath = path.join(iconsDir, file);
    const input = await readFile(premiumMarkPath);

    // First render at high resolution, trim padding, then resize
    await sharp(input, { density: 400 })
      .trim(10) // Remove transparent padding (10px threshold)
      .resize({
        width: size,
        height: size,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        quality: 100,
      })
      .toFile(outPath);
    console.log(`generated ${path.relative(rootDir, outPath)}`);
  }

  const faviconCandidates = [
    path.join(iconsDir, "favicon-16.png"),
    path.join(iconsDir, "favicon-32.png"),
    path.join(iconsDir, "icon-64.png"),
  ];
  const faviconIco = await pngToIco(faviconCandidates);
  const faviconIcoPath = path.join(publicDir, "favicon.ico");
  await writeFile(faviconIcoPath, faviconIco);
  console.log(`generated ${path.relative(rootDir, faviconIcoPath)}`);

  // OG Image (Dark background, centered Mark)
  const ogPath = path.join(brandDir, "yrc-og.png");
  await toPng(premiumMarkPath, ogPath, {
    width: 630, // Fit the mark within the height
    height: 630,
    fit: "contain",
    background: { r: 11, g: 31, b: 59, alpha: 1 }, // #0B1F3B (Navy)
  });
  // We need to extend the canvas to 1200x630. Sharp resize fit contain does that if we provide both w/h?
  // Actually, to center a 630x630 mark on a 1200x630 canvas, we need "extend" or specific resize options.
  // My helper `toPng` uses `resize(options)`.
  // If I pass { width: 1200, height: 630, fit: 'contain', background: ... } it handles it.

  await toPng(premiumMarkPath, ogPath, {
    width: 1200,
    height: 630,
    fit: "contain",
    background: { r: 11, g: 31, b: 59, alpha: 1 }, // #0B1F3B (Navy)
  });
  console.log(`generated ${path.relative(rootDir, ogPath)}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
