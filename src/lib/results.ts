import { findPopulationStat, resolveStatGroup } from "../data/referenceData";
import { computePercentile } from "./percentile";
import type { Demographics, HandCapture, PercentileResult, Sex } from "../types";

export interface HandResult {
  side: "right" | "left";
  forSex: Sex;
  result: PercentileResult;
}

/**
 * Builds one PercentileResult per captured hand. If sex was skipped, we
 * compute results against BOTH male and female reference stats and let the
 * UI show both rather than silently picking one.
 */
export function buildHandResults(
  demographics: Demographics,
  hands: Partial<Record<"right" | "left", HandCapture>>,
): HandResult[] {
  const statGroup = resolveStatGroup(demographics.motherAncestry, demographics.fatherAncestry);
  const sexes: Sex[] = demographics.sex === "unknown" ? ["male", "female"] : [demographics.sex];

  const results: HandResult[] = [];
  for (const side of ["right", "left"] as const) {
    const capture = hands[side];
    if (!capture?.measurement) continue;
    for (const sex of sexes) {
      const stat = findPopulationStat(sex, statGroup, side);
      results.push({ side, forSex: sex, result: computePercentile(capture.measurement, side, stat) });
    }
  }
  return results;
}
