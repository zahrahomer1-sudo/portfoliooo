/**
 * Compresses everything in public/media in place.
 *
 * Camera JPEGs come off the card at 3–5000px and several megabytes each, which
 * is far more than any layout here asks for. next/image will still resize on
 * demand, but the source files are what get committed, cloned and deployed, so
 * they are worth bringing down at rest too.
 *
 * Videos are NOT touched: the only ffmpeg in this environment is a Playwright
 * build with no H.264 decoder, so it cannot read an MP4 in to re-encode it.
 * Compress those with a real ffmpeg before launch.
 *
 * Run: npm run optimize
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

const DIR = join(process.cwd(), "public", "media");
const MAX_EDGE = 2400;
const JPEG_QUALITY = 80;

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const files = (await readdir(DIR)).filter((f) =>
  [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()),
);

let before = 0;
let after = 0;

for (const name of files) {
  const path = join(DIR, name);
  const original = (await stat(path)).size;
  const meta = await sharp(path).metadata();
  const isPng = extname(name).toLowerCase() === ".png";

  const tmp = `${path}.tmp`;
  let pipeline = sharp(path).rotate(); // honour EXIF orientation, then drop it

  if (Math.max(meta.width ?? 0, meta.height ?? 0) > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // The PNGs here are smooth synthetic fields, which palette-quantise almost
  // losslessly. Photographs stay JPEG so the extension in site.ts still holds.
  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9, palette: true, quality: 90 })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  await pipeline.toFile(tmp);
  const optimised = (await stat(tmp)).size;

  if (optimised < original) {
    await rename(tmp, path);
    after += optimised;
  } else {
    // Never make a file bigger in the name of optimising it.
    await unlink(tmp);
    after += original;
  }

  before += original;
  const now = (await stat(path)).size;
  console.log(
    `${name.padEnd(20)} ${kb(original).padStart(7)} -> ${kb(now).padStart(7)}`,
  );
}

console.log(`\ntotal ${kb(before)} -> ${kb(after)}`);
console.log("videos untouched: no H.264 decoder available here");
