import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "../components/ProgressSteps";
import { CALIBRATION_OBJECT_LIST } from "../data/calibrationObjects";
import { useSessionStore } from "../state/sessionStore";
import type { CalibrationObjectId } from "../types";

export function Calibration() {
  const navigate = useNavigate();
  const calibrationObjectId = useSessionStore((s) => s.calibrationObjectId);
  const setCalibrationObject = useSessionStore((s) => s.setCalibrationObject);

  function choose(id: CalibrationObjectId) {
    setCalibrationObject(id);
    if (id === "printable_sheet") {
      // BASE_URL (not a hardcoded "/") so this still resolves once the
      // build is served from a subpath like /2D4D/ or a custom domain.
      window.open(`${import.meta.env.BASE_URL}calibration-sheet.html`, "_blank");
    }
    navigate("/capture/right");
  }

  return (
    <div className="stack">
      <ProgressSteps step={2} total={4} />
      <h1>Pick a reference object</h1>
      <p>
        Your camera has no idea how big your hand actually is — we need one object of a known,
        standard size in the photo next to your hand to convert pixels to millimetres. Pick
        whichever of these you have handy.
      </p>

      <div className="stack">
        {CALIBRATION_OBJECT_LIST.map((obj) => (
          <button
            key={obj.id}
            className="card"
            style={{ textAlign: "left" }}
            onClick={() => choose(obj.id)}
          >
            <div style={{ fontWeight: 600 }}>{obj.label}</div>
            <p>{obj.description}</p>
          </button>
        ))}
      </div>

      {calibrationObjectId && (
        <p className="skip-note">
          Selected: {CALIBRATION_OBJECT_LIST.find((o) => o.id === calibrationObjectId)?.label}
        </p>
      )}
    </div>
  );
}
