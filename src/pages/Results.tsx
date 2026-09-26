import { Link, useNavigate } from "react-router-dom";
import { Disclaimer } from "../components/Disclaimer";
import { ANCESTRY_LABELS } from "../data/labels";
import { buildHandResults } from "../lib/results";
import { useSessionStore } from "../state/sessionStore";

function ordinal(n: number): string {
  const rounded = Math.round(n);
  const s = ["th", "st", "nd", "rd"];
  const v = rounded % 100;
  return rounded + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function Results() {
  const navigate = useNavigate();
  const demographics = useSessionStore((s) => s.demographics);
  const hands = useSessionStore((s) => s.hands);
  const reset = useSessionStore((s) => s.reset);

  const results = buildHandResults(demographics, hands);

  if (results.length === 0) {
    return (
      <div className="stack">
        <h1>No results yet</h1>
        <p>You haven't captured a hand measurement.</p>
        <button className="btn-primary" onClick={() => navigate("/demographics")}>
          Start over
        </button>
      </div>
    );
  }

  const sexUnknown = demographics.sex === "unknown";
  const byHand: Record<string, typeof results> = {};
  for (const r of results) {
    (byHand[r.side] ??= []).push(r);
  }

  return (
    <div className="stack">
      <h1>Your results</h1>
      <p>
        Compared to {demographics.sex === "unknown" ? "male and female" : demographics.sex} adults
        in the closest published reference group to your ancestry inputs.
      </p>

      {Object.entries(byHand).map(([side, sideResults]) => (
        <div className="card stack" key={side}>
          <h2>{side === "right" ? "Right hand" : "Left hand"}</h2>
          {sideResults.map((r) => (
            <div className="result-block" key={r.forSex}>
              {sexUnknown && <span className="badge badge-warn">as {r.forSex}</span>}
              <div className="result-percentile">{ordinal(r.result.percentile)} percentile</div>
              <p>
                2D:4D = {r.result.ratio.toFixed(3)} (reference group mean{" "}
                {r.result.comparedTo.meanRatio.toFixed(3)} ± {r.result.comparedTo.sd.toFixed(3)}, n=
                {r.result.comparedTo.n})
              </p>
              <p>
                {r.result.interpretation === "higher" &&
                  "This is on the lower end for your group, which the literature associates with relatively higher prenatal testosterone exposure."}
                {r.result.interpretation === "lower" &&
                  "This is on the higher end for your group, which the literature associates with relatively lower prenatal testosterone (or relatively higher estrogen) exposure."}
                {r.result.interpretation === "typical" &&
                  "This is close to typical for your comparison group — not a notable signal either way."}
              </p>
            </div>
          ))}
        </div>
      ))}

      <Disclaimer>
        These percentiles describe where your hand proportions fall in a statistical distribution
        — they are not a hormone measurement. The link between 2D:4D and prenatal testosterone
        is real but contested: effect sizes are small, and a direct large-sample replication
        attempt failed to confirm the original amniotic-hormone finding. See{" "}
        <Link to="/methodology">the full methodology and citations</Link>.
      </Disclaimer>

      <div className="card stack">
        <h2>What could make this less accurate</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-dim)" }}>
          <li>Skipped demographic fields widen the comparison group.</li>
          {(demographics.motherAncestry !== demographics.fatherAncestry) && (
            <li>
              Mixed ancestry ({ANCESTRY_LABELS[demographics.motherAncestry]} /{" "}
              {ANCESTRY_LABELS[demographics.fatherAncestry]}) has no dedicated reference group in
              the literature, so you were compared to the pooled overall sample.
            </li>
          )}
          <li>Photo-based measurement has more noise than calipers used in most studies.</li>
          <li>Landmark detection approximates the anatomical crease with the nearest knuckle joint.</li>
        </ul>
      </div>

      <div className="row">
        <button onClick={() => navigate("/capture/right")}>Redo measurements</button>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={() => {
            reset();
            navigate("/");
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
