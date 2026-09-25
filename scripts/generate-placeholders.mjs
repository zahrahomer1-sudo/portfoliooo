/**
 * Generates the placeholder media in public/media/.
 *
 * No real photography or footage exists yet. Rather than hotlink stock (the
 * build environment has no egress to it) or ship flat colour blocks, this
 * writes smooth duotone fields in the site palette. They are deliberately
 * abstract — nobody could mistake them for Zahrah's work — but they carry real
 * tonal variation, which is what glass blur and parallax need in order to be
 * judged at all.
 *
 * Run: node scripts/generate-placeholders.mjs
 * Delete public/media/* and drop in real files to replace them.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const OUT = join(process.cwd(), "public", "media");
const FFMPEG = "/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux";

// ---------- minimal PNG writer ----------

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function writePng(path, width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none — these compress well as-is
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

// ---------- value noise ----------

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lattice(size, rand) {
  const g = new Float32Array(size * size);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return g;
}

const smooth = (t) => t * t * (3 - 2 * t);

function sample(grid, size, x, y) {
  const gx = x * size, gy = y * size;
  const x0 = Math.floor(gx), y0 = Math.floor(gy);
  const fx = smooth(gx - x0), fy = smooth(gy - y0);
  const at = (i, j) => grid[(((j % size) + size) % size) * size + (((i % size) + size) % size)];
  const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

/**
 * Two ramps, blended per image.
 *
 * NEUTRAL is the base: near-black to near-white with only a warm bias in the
 * shadows, which is what monochrome photography actually looks like. WINE is
 * the atmospheric one, mixed in at low strength on a couple of frames so the
 * red reads as light falling on a scene rather than as a colour wash over
 * everything — the distinction the brief is explicit about.
 */
const NEUTRAL = [
  [6, 5, 6],
  [22, 17, 19],
  [58, 46, 49],
  [112, 98, 99],
  [178, 168, 165],
  [240, 236, 232],
];

const WINE = [
  [7, 4, 5],
  [28, 11, 17],
  [74, 18, 32],
  [138, 34, 53],
  [196, 108, 116],
  [244, 232, 230],
];

function ramp(t, tint) {
  const clamped = Math.min(0.9999, Math.max(0, t));
  const scaled = clamped * (NEUTRAL.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const pick = (table) => {
    const a = table[i], b = table[i + 1];
    return [
      a[0] + (b[0] - a[0]) * f,
      a[1] + (b[1] - a[1]) * f,
      a[2] + (b[2] - a[2]) * f,
    ];
  };
  const n = pick(NEUTRAL);
  const w = pick(WINE);
  return [
    Math.round(n[0] + (w[0] - n[0]) * tint),
    Math.round(n[1] + (w[1] - n[1]) * tint),
    Math.round(n[2] + (w[2] - n[2]) * tint),
  ];
}

function field(width, height, seed, phase = 0, contrast = 1, tint = 0) {
  const rand = mulberry(seed);
  const octaves = [
    { grid: lattice(2, rand), size: 2, amp: 1 },
    { grid: lattice(5, rand), size: 5, amp: 0.7 },
    { grid: lattice(11, rand), size: 11, amp: 0.4 },
    { grid: lattice(23, rand), size: 23, amp: 0.2 },
    { grid: lattice(47, rand), size: 47, amp: 0.08 },
  ];
  const total = octaves.reduce((s, o) => s + o.amp, 0);

  // First pass: raw values, and the range they actually occupy.
  const raw = new Float32Array(width * height);
  let lo = Infinity, hi = -Infinity;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width, v = y / height;
      let n = 0;
      for (const o of octaves) {
        n += sample(o.grid, o.size, u + phase * o.amp, v + phase * 0.35) * o.amp;
      }
      n /= total;
      raw[y * width + x] = n;
      if (n < lo) lo = n;
      if (n > hi) hi = n;
    }
  }

  // Second pass: stretch to the full range, S-curve it, then darken the edges.
  // Stretching is what stops every image coming out the same mid-tone wash.
  const span = hi - lo || 1;
  const buf = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width, v = y / height;
      const stretched = (raw[y * width + x] - lo) / span;
      const curved = Math.pow(smooth(stretched), contrast);
      const dx = u - 0.5, dy = v - 0.5;
      const vignette = 1 - Math.min(0.62, (dx * dx + dy * dy) * 1.25);
      const [r, g, b] = ramp(curved * vignette, tint);
      const i = (y * width + x) * 3;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b;
    }
  }
  return buf;
}

// ---------- outputs ----------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// name, width, height, seed, contrast, wine tint (0 = monochrome)
const stills = [
  ["hero-poster.png", 1280, 720, 11, 1.0, 0.18],
  ["work-01.png", 1200, 675, 21, 0.95, 0],
  ["work-02.png", 880, 1100, 32, 1.1, 0.3],
  ["work-03.png", 880, 1100, 43, 0.9, 0],
  ["work-04.png", 880, 1100, 54, 1.15, 0],
  ["work-05.png", 1200, 675, 65, 1.0, 0.24],
  ["album-01.png", 1000, 1250, 71, 1.05, 0],
  ["album-02.png", 1200, 675, 82, 0.92, 0.34],
  ["album-03.png", 900, 900, 93, 1.12, 0],
  ["album-04.png", 1000, 1250, 104, 0.98, 0],
  ["album-05.png", 1200, 675, 115, 1.08, 0.22],
];

for (const [name, w, h, seed, contrast, tint] of stills) {
  writePng(join(OUT, name), w, h, field(w, h, seed, 0, contrast, tint));
  process.stdout.write(`${name} `);
}
console.log("");

// No video placeholder is generated. The ffmpeg available here is a Playwright
// build with only the matroska demuxer, so it cannot read a PNG sequence back
// in to encode one. The hero falls back to the poster still with a slow drift
// until real footage is dropped at the path in src/content/site.ts.
console.log("stills written to public/media — no placeholder video, see note above");
