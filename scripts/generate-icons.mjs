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
  // Use light mark (Gold/Navy) as it often has better contrast on tabs, or Dark mark if preferred.
  // User requested "ensure good contrast... if needed use light mark".
  // Let's use yrc-mark-light.svg (Gold Diamond, Navy Text) which is distinct.
  // Important: Add padding so it doesn't touch edges.
  for (const { file, size } of iconSizes) {
    const outPath = path.join(iconsDir, file);
    // Padding logic: input SVG is 512x512 with some padding built-in (diamond is 300 wide).
    // so we can resize directly to 'fit: contain' and it should be safe.
    // If we want EXTRA padding for rounded icon styles (android/apple), we might want margin.
    // For now, standard fit is likely okay as the SVG itself has padding.
    await toPng(markLightPath, outPath, {
      width: size,
      height: size,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
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

  // PART B: Export Clean PNGs for Header
  // Height 120 is maybe too small for high-res displays.
  // User asked for width ~1200-1600px.
  // Let's set width to 1400px.
  const lockupLightPngPath = path.join(brandDir, "yrc-lockup-header-light.png");
  await toPng(lockupLightPath, lockupLightPngPath, {
    width: 1400,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  console.log(`generated ${path.relative(rootDir, lockupLightPngPath)}`);

  const lockupDarkPngPath = path.join(brandDir, "yrc-lockup-header-dark.png");
  await toPng(lockupDarkPath, lockupDarkPngPath, {
    width: 1400,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  console.log(`generated ${path.relative(rootDir, lockupDarkPngPath)}`);

  // OG Image (Dark background, centered lockup)
  const ogPath = path.join(brandDir, "yrc-og.png");
  await toPng(lockupDarkPath, ogPath, {
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
