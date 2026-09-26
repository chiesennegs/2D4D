// Shared types for the 2D4D app.

export type Sex = "male" | "female";

/**
 * Broad regional/ancestry groupings. Kept deliberately coarse: these are the
 * groupings that actually have multi-study support in the digit-ratio
 * literature (see src/data/referenceData.ts for citations). Finer
 * ethnic/national self-identification would imply precision the reference
 * data doesn't have.
 */
export type AncestryGroup =
  | "east_asian"
  | "south_asian"
  | "european"
  | "sub_saharan_african"
  | "african_american"
  | "hispanic_latino"
  | "middle_eastern_north_african"
  | "unknown";

export type AgeRange = "under_18" | "18_29" | "30_49" | "50_plus" | "unknown";

export interface Demographics {
  sex: Sex | "unknown";
  motherAncestry: AncestryGroup;
  fatherAncestry: AncestryGroup;
  ageRange: AgeRange;
}

export const UNKNOWN_DEMOGRAPHICS: Demographics = {
  sex: "unknown",
  motherAncestry: "unknown",
  fatherAncestry: "unknown",
  ageRange: "unknown",
};

/** A known-size physical object used to convert pixel measurements to mm. */
export type CalibrationObjectId =
  | "card_cr80"
  | "coin_us_quarter"
  | "coin_us_penny"
  | "coin_eur_1"
  | "coin_gbp_1"
  | "printable_sheet";

export interface CalibrationObject {
  id: CalibrationObjectId;
  label: string;
  /** The real-world length, in millimetres, of the edge the user will mark. */
  referenceLengthMm: number;
  description: string;
}

export type HandSide = "right" | "left";

/** x/y are normalized [0,1] image-space coordinates, matching MediaPipe output. */
export interface Point2D {
  x: number;
  y: number;
}

/** The 21 MediaPipe Hands landmarks for one hand. */
export type HandLandmarks = Point2D[];

export interface CalibrationMarks {
  a: Point2D;
  b: Point2D;
  objectId: CalibrationObjectId;
}

export interface HandCapture {
  side: HandSide;
  imageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  landmarks: HandLandmarks | null;
  calibration: CalibrationMarks | null;
  /** Derived once calibration + landmarks are both present. */
  measurement: HandMeasurement | null;
}

export interface HandMeasurement {
  scaleMmPerPixel: number;
  indexLengthMm: number;
  ringLengthMm: number;
  ratio: number; // index / ring, i.e. 2D:4D
}

/**
 * The broad groupings that actually have published mean/SD data behind
 * them (see src/data/referenceData.ts). AncestryGroup (self-identification)
 * maps down onto these via mapAncestryToStatGroup.
 */
export type StatGroup = "overall" | "european" | "african" | "asian";

export interface PopulationStat {
  group: StatGroup;
  sex: Sex;
  hand: "right" | "left";
  meanRatio: number;
  sd: number;
  n: number;
  source: string; // key into citations.ts
}

export interface PercentileResult {
  hand: HandSide;
  ratio: number;
  zScore: number;
  percentile: number; // 0-100
  comparedTo: PopulationStat;
  interpretation: "lower" | "higher" | "typical";
}
