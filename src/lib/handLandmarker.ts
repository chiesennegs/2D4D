import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { HandLandmarks } from "../types";

let landmarkerPromise: Promise<HandLandmarker> | null = null;

// Model + wasm runtime are fetched from Google's public MediaPipe CDN once
// and cached by the browser. No photo or user data is ever sent anywhere —
// only this (generic, non-personal) model file is downloaded.
const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

async function getLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(WASM_BASE).then((vision) =>
      HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL },
        runningMode: "IMAGE",
        numHands: 1,
      }),
    );
  }
  return landmarkerPromise;
}

export async function preloadHandLandmarker(): Promise<void> {
  await getLandmarker();
}

export async function detectHandLandmarks(
  image: HTMLImageElement | HTMLCanvasElement,
): Promise<HandLandmarks | null> {
  const landmarker = await getLandmarker();
  const result = landmarker.detect(image);
  const hand = result.landmarks?.[0];
  if (!hand) return null;
  return hand.map((p) => ({ x: p.x, y: p.y }));
}

// MediaPipe Hands landmark indices for the base (MCP joint) and tip of each
// finger. We approximate the anatomical "basal crease" used in caliper
// studies with the MCP joint landmark — see methodology page for the caveat
// this introduces.
export const INDEX_BASE = 5;
export const INDEX_TIP = 8;
export const RING_BASE = 13;
export const RING_TIP = 16;
