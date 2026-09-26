import { CALIBRATION_OBJECTS } from "../data/calibrationObjects";
import { INDEX_BASE, INDEX_TIP, RING_BASE, RING_TIP } from "./handLandmarker";
import type { CalibrationMarks, HandLandmarks, HandMeasurement, Point2D } from "../types";

function dist(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Landmarks and calibration marks are stored as [0,1]-normalized image
// coordinates, but x is normalized by width and y by height independently —
// so for a non-square photo we must scale back to pixels before measuring
// distances, otherwise the aspect ratio would distort every length.
function toPixels(p: Point2D, width: number, height: number): Point2D {
  return { x: p.x * width, y: p.y * height };
}

export function computeHandMeasurement(
  landmarks: HandLandmarks,
  calibration: CalibrationMarks,
  imageWidth: number,
  imageHeight: number,
): HandMeasurement {
  const a = toPixels(calibration.a, imageWidth, imageHeight);
  const b = toPixels(calibration.b, imageWidth, imageHeight);
  const calibrationLengthPx = dist(a, b);
  const referenceLengthMm = CALIBRATION_OBJECTS[calibration.objectId].referenceLengthMm;
  const scaleMmPerPixel = referenceLengthMm / calibrationLengthPx;

  const indexBase = toPixels(landmarks[INDEX_BASE], imageWidth, imageHeight);
  const indexTip = toPixels(landmarks[INDEX_TIP], imageWidth, imageHeight);
  const ringBase = toPixels(landmarks[RING_BASE], imageWidth, imageHeight);
  const ringTip = toPixels(landmarks[RING_TIP], imageWidth, imageHeight);

  const indexLengthMm = dist(indexBase, indexTip) * scaleMmPerPixel;
  const ringLengthMm = dist(ringBase, ringTip) * scaleMmPerPixel;

  return {
    scaleMmPerPixel,
    indexLengthMm,
    ringLengthMm,
    ratio: indexLengthMm / ringLengthMm,
  };
}
