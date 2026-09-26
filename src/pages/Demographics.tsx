import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProgressSteps } from "../components/ProgressSteps";
import { AGE_RANGE_LABELS, ANCESTRY_LABELS, SEX_LABELS } from "../data/labels";
import { useSessionStore } from "../state/sessionStore";
import type { AgeRange, AncestryGroup, Sex } from "../types";

const SEX_OPTIONS: Sex[] = ["male", "female"];
const ANCESTRY_OPTIONS: AncestryGroup[] = [
  "european",
  "east_asian",
  "south_asian",
  "sub_saharan_african",
  "african_american",
  "hispanic_latino",
  "middle_eastern_north_african",
  "unknown",
];
const AGE_OPTIONS: AgeRange[] = ["under_18", "18_29", "30_49", "50_plus", "unknown"];

function PillSelect<T extends string>({
  options,
  value,
  labels,
  onChange,
}: {
  options: T[];
  value: T;
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="pill"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export function Demographics() {
  const navigate = useNavigate();
  const demographics = useSessionStore((s) => s.demographics);
  const setDemographics = useSessionStore((s) => s.setDemographics);

  const [sex, setSex] = useState<Sex | "unknown">(demographics.sex);
  const [motherAncestry, setMotherAncestry] = useState<AncestryGroup>(demographics.motherAncestry);
  const [fatherAncestry, setFatherAncestry] = useState<AncestryGroup>(demographics.fatherAncestry);
  const [ageRange, setAgeRange] = useState<AgeRange>(demographics.ageRange);

  function next() {
    setDemographics({ sex, motherAncestry, fatherAncestry, ageRange });
    navigate("/calibration");
  }

  return (
    <div className="stack">
      <ProgressSteps step={1} total={4} />
      <h1>About the subject</h1>
      <p>
        Sex and ancestry are used only to pick the right comparison group from published research
        — nothing is uploaded or stored anywhere but this device. Skipping any field is fine; it
        just widens the comparison group and reduces precision.
      </p>

      <div className="card stack">
        <h2>Sex</h2>
        <PillSelect options={SEX_OPTIONS} value={sex} labels={SEX_LABELS} onChange={setSex} />
        <button
          type="button"
          className="pill"
          aria-pressed={sex === "unknown"}
          onClick={() => setSex("unknown")}
        >
          Skip
        </button>
        <p className="skip-note">
          Sex differences are the most consistent, best-replicated finding in this literature —
          skipping this reduces accuracy the most.
        </p>
      </div>

      <div className="card stack">
        <h2>Mother's regional ancestry</h2>
        <PillSelect
          options={ANCESTRY_OPTIONS}
          value={motherAncestry}
          labels={ANCESTRY_LABELS}
          onChange={setMotherAncestry}
        />
      </div>

      <div className="card stack">
        <h2>Father's regional ancestry</h2>
        <PillSelect
          options={ANCESTRY_OPTIONS}
          value={fatherAncestry}
          labels={ANCESTRY_LABELS}
          onChange={setFatherAncestry}
        />
        <p className="skip-note">
          Population-level differences in average digit ratio are reported in the literature, but
          only for broad regional groupings, and with far less consistency than the sex
          difference.
        </p>
      </div>

      <div className="card stack">
        <h2>Current age range</h2>
        <PillSelect options={AGE_OPTIONS} value={ageRange} labels={AGE_RANGE_LABELS} onChange={setAgeRange} />
        <p className="skip-note">
          Digit ratio is set in-utero and considered stable across life, so age mainly helps
          confirm growth is complete rather than calibrate the result. See{" "}
          <Link to="/methodology">Methodology</Link>.
        </p>
      </div>

      <button className="btn-primary btn-block" onClick={next}>
        Continue
      </button>
    </div>
  );
}
