/**
 * Procedural haze layer for the cover (drawn once to two <canvas> elements).
 *
 * It is deliberately faint: the sky colors live in CSS (#skywrap in style.css);
 * this only adds soft, layered haze on top, strongest in a band near the top.
 * Tweak the numbers marked "TWEAK" to change the look.
 */
import { $ } from './dom.js';

// ---------- tiny noise toolkit ----------
/** Deterministic pseudo-random number in [0, 1) for an integer grid point. */
function hash(x, y) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

/** Smooth value noise: blends the four surrounding grid points. */
function valueNoise(x, y) {
  const i = Math.floor(x),
    j = Math.floor(y);
  const u = x - i,
    v = y - j;
  const sx = u * u * (3 - 2 * u),
    sy = v * v * (3 - 2 * v); // ease curves
  const top = hash(i, j) * (1 - sx) + hash(i + 1, j) * sx;
  const bottom = hash(i, j + 1) * (1 - sx) + hash(i + 1, j + 1) * sx;
  return top * (1 - sy) + bottom * sy;
}

/** Fractal noise: several octaves of value noise added together. */
function fbm(x, y, octaves) {
  let sum = 0,
    gain = 0.5,
    freq = 1;
  for (let k = 0; k < octaves; k++) {
    sum += gain * valueNoise(x * freq + k * 17.3, y * freq + k * 5.1);
    freq *= 2.03;
    gain *= 0.5;
  }
  return sum;
}

/** 0 below `a`, 1 above `b`, smooth in between. */
function smoothstep(a, b, v) {
  v = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return v * v * (3 - 2 * v);
}

// ---------- the haze ----------
export function makeClouds() {
  const W = 620,
    H = 400; // low resolution on purpose: CSS stretches it, which keeps it soft
  const canvasA = $('#cA');
  canvasA.width = W;
  canvasA.height = H;
  const ctx = canvasA.getContext('2d');
  const image = ctx.createImageData(W, H);
  const px = image.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W,
        v = y / H; // 0..1 across / down

      // 1. Noise coordinates, stretched so the haze runs horizontally
      const a = u * 0.55 + 3;
      const b = v * 3.2 + 1 + u * 0.25;

      // 2. Domain warp (bends the pattern so it doesn't look like plain noise)
      const wx = fbm(a + 5.2, b + 1.3, 3);
      const wy = fbm(a + 9.1, b + 3.7, 3);

      // 3. Density = noise + soft horizontal banding. `lit` samples slightly
      //    up-left; comparing the two gives cheap lighting/shading.
      const band = 0.5 + 0.5 * Math.sin(v * 11 + wx * 5 + wy * 2);
      const density = fbm(a + 1.4 * wx, b + 1.4 * wy, 5) * 0.78 + band * 0.22;
      const lit = fbm(a - 0.03 + 1.4 * wx, b - 0.12 + 1.4 * wy, 5) * 0.78 + band * 0.22;

      // 4. A denser "bank" near the top (slightly tilted), thinner lower down
      const vTilted = v + (u - 0.5) * 0.07;
      const bank = smoothstep(0.06, 0.12, vTilted) * (1 - smoothstep(0.38, 0.62, vTilted));
      const threshold =
        0.62 - 0.2 * fbm(u * 1.1 + 20, v + 7, 3) + 0.22 * smoothstep(0.3, 0.85, v) - 0.2 * bank;

      // Fine streaky texture (stretched sideways), so the haze reads as layered cloud, not a flat veil
      const streak = fbm(a * 2.2 + wy * 3, b * 0.5 + wx, 4);

      // 5. Opacity. TWEAK: 0.42 + 0.26 * bank is the overall cloud strength.
      let alpha =
        smoothstep(threshold, threshold + 0.42, density) * (0.42 + 0.26 * bank) * (0.6 + 0.8 * streak);
      alpha *=
        smoothstep(0, 0.15, Math.min(u, 1 - u)) * // fade at the left/right edges
        smoothstep(0, 0.1, 1 - v) *
        smoothstep(0, 0.03, v) *
        (1 - 0.85 * smoothstep(0.55, 0.9, v)); // keep the lower part (under the text) clear

      // 6. Color: white-lavender, shaded by `lit`, a lavender glow mid-height
      const shade = Math.min(1, Math.max(0, 0.62 + (lit - density) * 3));
      const warm = smoothstep(0.25, 0.6, v) * (1 - smoothstep(0.72, 1, v)) * 0.55; // lavender glow mid-height
      let r = 135 + 120 * shade,
        g = 130 + 125 * shade,
        bl = 205 + 50 * shade; // indigo-lavender shadows -> pale lit tops
      r += (226 - r) * warm;
      g += (200 - g) * warm;
      bl += (245 - bl) * warm;

      const i = (y * W + x) * 4;
      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = bl;
      px[i + 3] = alpha * 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  // Second copy (mirrored and scaled in CSS) gives a cheap parallax layer
  const canvasB = $('#cB');
  canvasB.width = W;
  canvasB.height = H;
  canvasB.getContext('2d').drawImage(canvasA, 0, 0);
  canvasA.classList.add('in'); // fades both in
  canvasB.classList.add('in');
}
