import { Link } from "react-router-dom";
import { CitationList } from "../components/CitationList";
import { CITATIONS } from "../data/citations";

function cite(...ids: string[]) {
  return CITATIONS.filter((c) => ids.includes(c.id));
}

export function Methodology() {
  return (
    <div className="stack">
      <Link to="/" className="nav-link">
        ← Back
      </Link>
      <h1>How this works, and what the evidence actually says</h1>

      <div className="card stack">
        <h2>What 2D:4D is</h2>
        <p>
          2D:4D is the ratio of the length of your index finger (2nd digit) to your ring finger
          (4th digit), measured on the palm side from the base crease to the fingertip. On
          average, men have a slightly lower ratio (ring longer relative to index) than women.
          This sex difference is one of the most consistently replicated findings in this field.
        </p>
        <CitationList citations={cite("manning1998", "honekopp2010sex")} />
      </div>

      <div className="card stack">
        <h2 id="mechanism">Why it might reflect prenatal hormones</h2>
        <p>
          The genes that pattern your fingers during fetal development (the Hox gene family) also
          help pattern the reproductive organs, and digit growth is directly sensitive to the
          local balance of androgen (testosterone-driven) versus estrogen receptor signalling
          during a specific developmental window. That's been shown experimentally in mice. It's
          the mechanistic reason a hand-proportion measurement could plausibly carry information
          about prenatal hormone exposure at all.
        </p>
        <CitationList citations={cite("zheng2011")} />
      </div>

      <div className="card stack">
        <h2 id="controversy">Why we call the testosterone link "contested"</h2>
        <p>
          The direct evidence connecting 2D:4D to measured prenatal testosterone in humans is
          thin and inconsistent. The original, most-cited human study found a correlation with
          amniotic hormone levels in only 29 children, in one hand only. A direct attempt to
          replicate that finding in a larger, independent sample — published 16 years later —
          found no significant correlation at all, with the direction of effects inconsistent
          across measures. A separate longitudinal study of amniotic hormones and children's
          2D:4D likewise found null/mixed results.
        </p>
        <p>
          The same pattern shows up in studies linking 2D:4D to behavior and psychology (sexual
          orientation, personality, athleticism): small early studies report effects, and
          larger studies or bias-corrected re-analyses shrink or eliminate them. A 2026 Bayesian
          reanalysis explicitly designed to correct for publication bias found moderate-to-strong
          evidence of publication bias in the 2D:4D/sexual-orientation literature specifically.
        </p>
        <p>
          <strong>What that means for this app:</strong> the percentile we show you is a real,
          honestly-computed statistic about your hand proportions relative to a published sample.
          Whether that number says anything reliable about your own prenatal hormone exposure is
          a genuinely open scientific question — treat it as a data point about a contested
          hypothesis, not a settled fact about your biology.
        </p>
        <CitationList
          citations={cite(
            "lutchmaya2004",
            "replication2021",
            "plos2023",
            "grimbos2010",
            "shiramizu2026",
            "lippa2006",
            "leslie2019",
          )}
        />
      </div>

      <div className="card stack">
        <h2>Population and ancestry comparisons</h2>
        <p>
          Published studies find real average differences in 2D:4D between broad regional
          ancestry groups, on top of the sex difference. This app compares you against the
          largest available single-methodology dataset covering European-, African-, and
          Asian-origin samples (~7,500 people). If your ancestry inputs don't map cleanly onto
          one of those groups — including mixed ancestry — you're compared against the pooled
          overall sample instead of a guess.
        </p>
        <CitationList citations={cite("butovskaya2021", "lippa2003", "manning2004children")} />
      </div>

      <div className="card stack">
        <h2 id="age">Why we don't use age to calibrate your result</h2>
        <p>
          Multiple studies — including measurements taken directly on fetuses — find that 2D:4D
          is established very early and stays stable in its sex difference from infancy through
          adulthood. One longitudinal study in Jamaican children found a small increase with age
          during adolescence, which we mention for balance, but it's an exception rather than the
          rule. We ask your age range only to confirm you're past the age where growth is
          essentially complete, not to adjust the math.
        </p>
        <CitationList citations={cite("malas2006", "mcintyre2005", "trivers2006")} />
      </div>

      <div className="card stack">
        <h2>Measurement accuracy on a phone camera</h2>
        <p>
          Studies comparing measurement methods (calipers, photocopies, digital photos, X-ray)
          find they're not perfectly interchangeable — direct hand measurement tends to run
          higher than photo-based measurement, and the choice of method can itself shrink or
          inflate the apparent sex difference. This app uses your camera plus a hand-landmark
          model, calibrated against an everyday object of known size, which is closest to the
          "digital photograph + software" category in the literature — one of the more reliable
          indirect methods, but still noisier than a caliper on your actual hand. We approximate
          the anatomical base crease with the nearest knuckle joint, which introduces some
          additional, unquantified error.
        </p>
      </div>

      <div className="card stack">
        <h2>Why percentiles, and where the numbers come from</h2>
        <p>
          2D:4D is approximately normally distributed within a given sex and population group in
          the studies that have checked, so converting your ratio to a z-score and then a
          percentile against a published mean and standard deviation is standard practice in this
          literature — not something this app invented.
        </p>
      </div>

      <div className="card stack">
        <h2>Privacy</h2>
        <p>
          Every photo, measurement, and answer stays on your device. There's no server, no
          account, and nothing is uploaded. Closing or reloading the page clears your session.
        </p>
      </div>

      <div className="card stack">
        <h2>All citations</h2>
        <CitationList citations={CITATIONS} />
      </div>
    </div>
  );
}
