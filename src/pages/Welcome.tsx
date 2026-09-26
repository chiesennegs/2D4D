import { Link, useNavigate } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import { useSessionStore } from "../state/sessionStore";

export function Welcome() {
  const navigate = useNavigate();
  const reset = useSessionStore((s) => s.reset);

  function start() {
    reset();
    navigate("/demographics");
  }

  return (
    <div className="stack">
      <div className="stack">
        <h1>2D4D</h1>
        <p>
          Estimate your 2D:4D digit ratio — the relative length of your index (2nd) and ring
          (4th) fingers — and see how it compares to published population data.
        </p>
      </div>

      <div className="card stack">
        <h2>What this is</h2>
        <p>
          Digit ratio is one of the most-studied physical markers researchers have used to
          estimate relative prenatal (in-utero) testosterone exposure. It's measured entirely
          from your hands, calibrated against an everyday object like a card or coin, using your
          camera. Nothing you capture leaves this device.
        </p>
      </div>

      <div className="card stack">
        <h2>What this isn't</h2>
        <p>
          This is not a diagnosis, a hormone test, or a determinant of gender, orientation, or
          personality. The scientific link between digit ratio and prenatal hormones is real but
          contested — effect sizes are small and some large studies found weak or no correlation.
          We show you the uncertainty, not just a number.
        </p>
      </div>

      <button className="btn-primary btn-block" onClick={start}>
        Get started
      </button>
      <Link to="/methodology" className="nav-link" style={{ textAlign: "center" }}>
        How does this work, and what does the research actually say?
      </Link>

      <Disclaimer>
        This tool is for educational and self-exploration purposes only. It cannot tell you your
        actual prenatal hormone exposure — only how your hand proportions compare statistically to
        published samples.
      </Disclaimer>
    </div>
  );
}
