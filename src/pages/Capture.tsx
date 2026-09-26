import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HandGuideOverlay } from "../components/HandGuideOverlay";
import { ProgressSteps } from "../components/ProgressSteps";
import { CALIBRATION_OBJECTS } from "../data/calibrationObjects";
import { detectHandLandmarks, preloadHandLandmarker } from "../lib/handLandmarker";
import { computeHandMeasurement } from "../lib/ratio";
import { useSessionStore } from "../state/sessionStore";
import type { HandLandmarks, HandSide, Point2D } from "../types";

type Phase = "camera" | "detecting" | "calibrate" | "review" | "error";

const LANDMARK_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

export function Capture() {
  const { side } = useParams<{ side: HandSide }>();
  const navigate = useNavigate();
  const calibrationObjectId = useSessionStore((s) => s.calibrationObjectId);
  const setHandCapture = useSessionStore((s) => s.setHandCapture);
  const existing = useSessionStore((s) => (side ? s.hands[side] : undefined));

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [phase, setPhase] = useState<Phase>("camera");
  const [error, setError] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null);
  const [calPoints, setCalPoints] = useState<Point2D[]>([]);

  useEffect(() => {
    preloadHandLandmarker().catch(() => void 0);
  }, []);

  useEffect(() => {
    if (!calibrationObjectId || !side) {
      navigate("/calibration");
      return;
    }
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1440 } } })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => setError("Couldn't access the camera. Check your browser's camera permission for this site."));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side, calibrationObjectId]);

  const drawStillWithOverlay = useCallback(
    (lm: HandLandmarks | null, points: Point2D[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      // Redraw base frame is handled by caller keeping an offscreen copy;
      // here we just draw overlays on top of what's already rasterized.
      if (lm) {
        ctx.fillStyle = "#6ea8fe";
        for (const p of lm) {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = "#6ea8fe";
        ctx.lineWidth = 2;
        for (const [a, b] of LANDMARK_CONNECTIONS) {
          ctx.beginPath();
          ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height);
          ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height);
          ctx.stroke();
        }
      }
      if (points.length > 0) {
        ctx.strokeStyle = "#f2b84b";
        ctx.fillStyle = "#f2b84b";
        ctx.lineWidth = 3;
        if (points.length === 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x * canvas.width, points[0].y * canvas.height);
          ctx.lineTo(points[1].x * canvas.width, points[1].y * canvas.height);
          ctx.stroke();
        }
        for (const p of points) {
          ctx.beginPath();
          ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    },
    [],
  );

  const baseImageRef = useRef<HTMLCanvasElement | null>(null);

  const redraw = useCallback(
    (lm: HandLandmarks | null, points: Point2D[]) => {
      const canvas = canvasRef.current;
      const base = baseImageRef.current;
      if (!canvas || !base) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
      drawStillWithOverlay(lm, points);
    },
    [drawStillWithOverlay],
  );

  async function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth;
    const height = video.videoHeight;

    // The camera stream can still be warming up (dimensions aren't known
    // until its 'loadedmetadata' fires) when the button is tapped, e.g. on
    // a slower phone right after granting permission. Without this guard,
    // drawImage throws on a 0x0 canvas and the tap silently does nothing.
    if (width === 0 || height === 0) {
      setError("Camera is still starting up — wait a second and try again.");
      setPhase("error");
      return;
    }

    try {
      canvas.width = width;
      canvas.height = height;

      const base = document.createElement("canvas");
      base.width = width;
      base.height = height;
      base.getContext("2d")!.drawImage(video, 0, 0, width, height);
      baseImageRef.current = base;

      canvas.getContext("2d")!.drawImage(base, 0, 0, width, height);
      setImgSize({ width, height });

      streamRef.current?.getTracks().forEach((t) => t.stop());
      setPhase("detecting");

      const lm = await detectHandLandmarks(base);
      if (!lm) {
        setError("Couldn't find a hand in that photo. Make sure your whole hand is in frame, well-lit, and try again.");
        setPhase("error");
        return;
      }
      setLandmarks(lm);
      setCalPoints([]);
      redraw(lm, []);
      setPhase("calibrate");
    } catch {
      setError("Something went wrong capturing that photo. Check your connection and try again.");
      setPhase("error");
    }
  }

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (phase !== "calibrate") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const next = calPoints.length >= 2 ? [{ x, y }] : [...calPoints, { x, y }];
    setCalPoints(next);
    redraw(landmarks, next);
    if (next.length === 2) {
      setPhase("review");
    }
  }

  function retake() {
    setPhase("camera");
    setLandmarks(null);
    setCalPoints([]);
    setError(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1440 } } })
      .then((s) => {
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError("Couldn't access the camera."));
  }

  function accept() {
    if (!side || !landmarks || calPoints.length !== 2 || !calibrationObjectId) return;
    const measurement = computeHandMeasurement(
      landmarks,
      { a: calPoints[0], b: calPoints[1], objectId: calibrationObjectId },
      imgSize.width,
      imgSize.height,
    );
    setHandCapture(side, {
      side,
      imageDataUrl: canvasRef.current?.toDataURL("image/jpeg", 0.85) ?? "",
      imageWidth: imgSize.width,
      imageHeight: imgSize.height,
      landmarks,
      calibration: { a: calPoints[0], b: calPoints[1], objectId: calibrationObjectId },
      measurement,
    });
    if (side === "right") {
      navigate("/capture/left");
    } else {
      navigate("/results");
    }
  }

  function skipLeft() {
    navigate("/results");
  }

  if (!side) return null;

  const calObj = calibrationObjectId ? CALIBRATION_OBJECTS[calibrationObjectId] : null;

  return (
    <div className="stack">
      <ProgressSteps step={3} total={4} />
      <h1>{side === "right" ? "Right hand" : "Left hand"}</h1>
      {existing && phase === "camera" && (
        <p className="skip-note">You already captured this hand. Capturing again will replace it.</p>
      )}

      {phase === "camera" && (
        <div className="stack">
          <p>
            Lay your hand flat, palm up, fingers relaxed, next to your{" "}
            {calObj?.label.toLowerCase()}, both flat on the same surface. Fill the frame, keep the
            camera parallel to the surface, and use good lighting.
          </p>
          <div className="capture-frame">
            <video ref={videoRef} autoPlay playsInline muted />
            <HandGuideOverlay side={side} />
          </div>
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          <button className="btn-primary btn-block" onClick={capture}>
            Capture photo
          </button>
        </div>
      )}

      {/* Always mounted (not just once phase leaves "camera") so capture()
          has a real canvas element to draw into the moment it's clicked —
          otherwise canvasRef.current is null on the very click that needs it. */}
      <div className="stack" style={{ display: phase === "camera" || phase === "error" ? "none" : "flex" }}>
        {phase === "detecting" && <p>Finding your hand landmarks…</p>}
        {phase === "calibrate" && calPoints.length === 0 && (
          <p>
            Tap both ends of your {calObj?.label.toLowerCase()}'s long edge (
            {calObj?.referenceLengthMm}mm) in the photo below.
          </p>
        )}
        {phase === "calibrate" && calPoints.length === 1 && <p>Now tap the other end.</p>}
        {phase === "review" && <p>Calibration set. Check the overlay looks right, then continue.</p>}
        <canvas ref={canvasRef} onClick={onCanvasClick} style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius)", cursor: phase === "calibrate" ? "crosshair" : "default" }} />
        <div className="row">
          <button onClick={retake}>Retake photo</button>
          {phase === "review" && (
            <button className="btn-primary" onClick={accept} style={{ flex: 1 }}>
              Use this {side === "right" ? "→ capture left hand" : "→ see results"}
            </button>
          )}
        </div>
      </div>

      {phase === "error" && (
        <div className="stack">
          <p style={{ color: "var(--danger)" }}>{error}</p>
          <button className="btn-primary btn-block" onClick={retake}>
            Try again
          </button>
        </div>
      )}

      {side === "left" && phase === "camera" && (
        <button onClick={skipLeft}>Skip left hand — use right hand only</button>
      )}
    </div>
  );
}
