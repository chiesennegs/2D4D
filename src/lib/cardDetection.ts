import type { Point2D } from "../types";

export interface DetectedCard {
  /** Normalized [0,1] endpoints of the card's long edge. */
  a: Point2D;
  b: Point2D;
  /** Normalized [0,1] bounding box, for drawing the full rectangle overlay. */
  box: { minX: number; minY: number; maxX: number; maxY: number };
  /** How closely the detected box's aspect ratio matches a real card (85.6:53.98 ≈ 1.585). */
  confidence: "high" | "low";
}

interface NormBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const CARD_ASPECT = 85.6 / 53.98; // ≈ 1.585
const WORK_SIZE = 320; // downscale target (longest side) — keeps this fast on a full-res phone photo

// Standard Otsu threshold selection: finds the brightness cutoff that best
// separates a bimodal histogram (background vs. foreground) into two
// classes by maximizing between-class variance.
function otsuThreshold(hist: Float64Array, total: number): number {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let weightB = 0;
  let best = 0;
  let bestVariance = -1;
  for (let t = 0; t < 256; t++) {
    weightB += hist[t];
    if (weightB === 0) continue;
    const weightF = total - weightB;
    if (weightF === 0) break;
    sumB += t * hist[t];
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;
    const variance = weightB * weightF * (meanB - meanF) * (meanB - meanF);
    if (variance > bestVariance) {
      bestVariance = variance;
      best = t;
    }
  }
  return best;
}

/**
 * Attempts to find a credit-card-sized rectangle in the photo, so the user
 * doesn't have to manually tap its corners. Assumes the card contrasts
 * against its background (stated as a precondition in the capture
 * instructions) and isn't touching the frame edge. Returns null rather than
 * guessing when the result doesn't look card-shaped, so the caller can fall
 * back to manual calibration instead of silently trusting a bad detection.
 */
export function detectCardEdge(
  source: HTMLCanvasElement,
  handBoxNorm: NormBox | null,
): DetectedCard | null {
  const scale = WORK_SIZE / Math.max(source.width, source.height);
  const w = Math.max(1, Math.round(source.width * scale));
  const h = Math.max(1, Math.round(source.height * scale));

  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const ctx = work.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  const hand = handBoxNorm
    ? {
        minX: Math.floor(handBoxNorm.minX * w),
        minY: Math.floor(handBoxNorm.minY * h),
        maxX: Math.ceil(handBoxNorm.maxX * w),
        maxY: Math.ceil(handBoxNorm.maxY * h),
      }
    : null;
  const inHand = (x: number, y: number) =>
    !!hand && x >= hand.minX && x <= hand.maxX && y >= hand.minY && y <= hand.maxY;

  // Threshold from pixels outside the hand region only, so skin tone can't
  // skew where the background/foreground split falls.
  const hist = new Float64Array(256);
  let counted = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inHand(x, y)) continue;
      hist[gray[y * w + x]]++;
      counted++;
    }
  }
  if (counted === 0) return null;
  const threshold = otsuThreshold(hist, counted);
  const classOf = (x: number, y: number) => (gray[y * w + x] > threshold ? 1 : 0);

  // The background is whichever class dominates the image border.
  let borderClass0 = 0;
  let borderClass1 = 0;
  for (let x = 0; x < w; x++) {
    if (classOf(x, 0) === 0) borderClass0++;
    else borderClass1++;
    if (classOf(x, h - 1) === 0) borderClass0++;
    else borderClass1++;
  }
  for (let y = 0; y < h; y++) {
    if (classOf(0, y) === 0) borderClass0++;
    else borderClass1++;
    if (classOf(w - 1, y) === 0) borderClass0++;
    else borderClass1++;
  }
  const backgroundClass = borderClass0 >= borderClass1 ? 0 : 1;

  // Foreground mask, excluding the hand region — what's left should be
  // dominated by the card (plus whatever background-contrast noise exists).
  const foreground = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inHand(x, y)) continue;
      if (classOf(x, y) !== backgroundClass) foreground[y * w + x] = 1;
    }
  }

  // Connected-component labeling (iterative flood fill, 4-connected).
  // Collect every component rather than just the largest one — the
  // largest foreground blob in frame is often background texture noise or
  // a stray shadow, not the card, so we score every plausibly-sized blob
  // by how closely it matches a real card's aspect ratio and take the best
  // match instead of just the biggest.
  const visited = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const imageArea = w * h;
  let bestBox: NormBox | null = null;
  let bestScore = Infinity;

  for (let start = 0; start < w * h; start++) {
    if (foreground[start] !== 1 || visited[start] === 1) continue;
    let sp = 0;
    stack[sp++] = start;
    visited[start] = 1;
    let area = 0;
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    while (sp > 0) {
      const idx = stack[--sp];
      const x = idx % w;
      const y = (idx - x) / w;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const candidates: number[] = [idx - w, idx + w]; // up, down (bounds check below is sufficient)
      if (x > 0) candidates.push(idx - 1); // left
      if (x < w - 1) candidates.push(idx + 1); // right
      for (const n of candidates) {
        if (n < 0 || n >= w * h) continue;
        if (foreground[n] === 1 && visited[n] === 0) {
          visited[n] = 1;
          stack[sp++] = n;
        }
      }
    }

    const boxW = maxX - minX;
    const boxH = maxY - minY;
    const boxArea = boxW * boxH;
    if (boxArea < imageArea * 0.005 || boxArea > imageArea * 0.6) continue;
    // A real blob should mostly fill its own bounding box; a sparse,
    // scattered set of foreground pixels (e.g. noisy background texture)
    // spread across a big box isn't a solid rectangle.
    if (area < boxArea * 0.5) continue;
    const long = Math.max(boxW, boxH);
    const short = Math.min(boxW, boxH);
    const aspect = long / Math.max(short, 1);
    if (aspect < 1.15 || aspect > 2.3) continue; // doesn't look card-shaped at all
    const score = Math.abs(aspect - CARD_ASPECT);
    if (score < bestScore) {
      bestScore = score;
      bestBox = { minX, minY, maxX, maxY };
    }
  }

  if (!bestBox) return null;

  const boxW = bestBox.maxX - bestBox.minX;
  const boxH = bestBox.maxY - bestBox.minY;
  const confidence: DetectedCard["confidence"] = bestScore < 0.25 ? "high" : "low";

  const box: NormBox = {
    minX: bestBox.minX / w,
    minY: bestBox.minY / h,
    maxX: bestBox.maxX / w,
    maxY: bestBox.maxY / h,
  };
  const centerX = (box.minX + box.maxX) / 2;
  const centerY = (box.minY + box.maxY) / 2;

  const a: Point2D = boxW >= boxH ? { x: box.minX, y: centerY } : { x: centerX, y: box.minY };
  const b: Point2D = boxW >= boxH ? { x: box.maxX, y: centerY } : { x: centerX, y: box.maxY };

  return { a, b, box, confidence };
}
