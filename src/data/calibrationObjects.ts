import type { CalibrationObject, CalibrationObjectId } from "../types";

// Real-world dimensions of standard objects, used purely as a physical
// ruler substitute (not literature data — these are manufacturing standards).
export const CALIBRATION_OBJECTS: Record<CalibrationObjectId, CalibrationObject> = {
  card_cr80: {
    id: "card_cr80",
    label: "Credit / debit / ID card",
    referenceLengthMm: 85.6, // ISO/IEC 7810 ID-1 long edge
    description:
      "Almost any bank card, ID card, or driver's license worldwide is this exact size (85.60 × 53.98mm).",
  },
  coin_us_quarter: {
    id: "coin_us_quarter",
    label: "US quarter (25¢)",
    referenceLengthMm: 24.26,
    description: "US quarter-dollar coin diameter.",
  },
  coin_us_penny: {
    id: "coin_us_penny",
    label: "US penny (1¢)",
    referenceLengthMm: 19.05,
    description: "US one-cent coin diameter.",
  },
  coin_eur_1: {
    id: "coin_eur_1",
    label: "1 Euro coin",
    referenceLengthMm: 23.25,
    description: "€1 coin diameter.",
  },
  coin_gbp_1: {
    id: "coin_gbp_1",
    label: "UK £1 coin",
    referenceLengthMm: 23.03,
    description: "12-sided £1 coin, measured across flats-to-flats diameter.",
  },
  printable_sheet: {
    id: "printable_sheet",
    label: "Printable calibration sheet",
    referenceLengthMm: 100.0,
    description:
      "A sheet you print at 100% scale (no \"fit to page\") with a precise 100.00mm reference line and a hand-placement guide.",
  },
};

export const CALIBRATION_OBJECT_LIST = Object.values(CALIBRATION_OBJECTS);
