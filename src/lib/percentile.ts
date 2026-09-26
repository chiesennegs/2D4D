import type { HandMeasurement, HandSide, PercentileResult, PopulationStat } from "../types";

// Abramowitz & Stegun 7.1.26 approximation of the error function.
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function zScore(value: number, mean: number, sd: number): number {
  return (value - mean) / sd;
}

/**
 * Converts a 2D:4D ratio into a percentile against a population reference.
 * Lower 2D:4D is associated in the literature with higher prenatal
 * testosterone exposure, so the interpretation direction is inverted
 * relative to a "bigger number is more" percentile.
 */
export function computePercentile(
  measurement: HandMeasurement,
  hand: HandSide,
  stat: PopulationStat,
): PercentileResult {
  const z = zScore(measurement.ratio, stat.meanRatio, stat.sd);
  const percentile = normalCdf(z) * 100;

  let interpretation: PercentileResult["interpretation"] = "typical";
  if (percentile <= 40) interpretation = "higher"; // lower ratio -> more T-associated
  if (percentile >= 60) interpretation = "lower";

  return {
    hand,
    ratio: measurement.ratio,
    zScore: z,
    percentile,
    comparedTo: stat,
    interpretation,
  };
}
