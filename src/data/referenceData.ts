import type { AncestryGroup, PopulationStat, StatGroup, Sex } from "../types";

/**
 * Reference means/SDs, verified against the primary source:
 * Butovskaya M, Burkova V, Apalkova Y, et al. (2021). "Sex, population
 * origin, age and average digit length as predictors of digit ratio in
 * three large world populations." Scientific Reports, 11, 8355.
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC8046776/ (Table 1)
 *
 * This is the largest single-methodology dataset available with a clean
 * sex x population-origin x hand breakdown (n ≈ 7,500). It only covers
 * three broad origin groups, so anyone whose ancestry maps outside those
 * (see mapAncestryToStatGroup) is compared to the pooled "overall" figures.
 */
export const POPULATION_STATS: PopulationStat[] = [
  { group: "overall", sex: "male", hand: "right", meanRatio: 0.961, sd: 0.037, n: 3740, source: "butovskaya2021" },
  { group: "overall", sex: "female", hand: "right", meanRatio: 0.979, sd: 0.036, n: 3751, source: "butovskaya2021" },
  { group: "overall", sex: "male", hand: "left", meanRatio: 0.963, sd: 0.036, n: 3256, source: "butovskaya2021" },
  { group: "overall", sex: "female", hand: "left", meanRatio: 0.978, sd: 0.035, n: 3225, source: "butovskaya2021" },

  { group: "european", sex: "male", hand: "right", meanRatio: 0.973, sd: 0.035, n: 1434, source: "butovskaya2021" },
  { group: "european", sex: "female", hand: "right", meanRatio: 0.991, sd: 0.035, n: 1573, source: "butovskaya2021" },
  { group: "european", sex: "male", hand: "left", meanRatio: 0.974, sd: 0.034, n: 1159, source: "butovskaya2021" },
  { group: "european", sex: "female", hand: "left", meanRatio: 0.988, sd: 0.033, n: 1263, source: "butovskaya2021" },

  { group: "african", sex: "male", hand: "right", meanRatio: 0.952, sd: 0.038, n: 1506, source: "butovskaya2021" },
  { group: "african", sex: "female", hand: "right", meanRatio: 0.968, sd: 0.037, n: 1297, source: "butovskaya2021" },
  { group: "african", sex: "male", hand: "left", meanRatio: 0.962, sd: 0.038, n: 1293, source: "butovskaya2021" },
  { group: "african", sex: "female", hand: "left", meanRatio: 0.974, sd: 0.037, n: 1080, source: "butovskaya2021" },

  { group: "asian", sex: "male", hand: "right", meanRatio: 0.954, sd: 0.032, n: 800, source: "butovskaya2021" },
  { group: "asian", sex: "female", hand: "right", meanRatio: 0.974, sd: 0.031, n: 881, source: "butovskaya2021" },
  { group: "asian", sex: "male", hand: "left", meanRatio: 0.961, sd: 0.033, n: 804, source: "butovskaya2021" },
  { group: "asian", sex: "female", hand: "left", meanRatio: 0.969, sd: 0.031, n: 882, source: "butovskaya2021" },
];

// Self-identified ancestry maps onto the study's broad origin groups.
// Groups the source dataset doesn't cover (Hispanic/Latino, MENA, unknown)
// fall back to the pooled "overall" figures rather than guessing.
const ANCESTRY_TO_STAT_GROUP: Record<AncestryGroup, StatGroup> = {
  european: "european",
  east_asian: "asian",
  south_asian: "asian",
  sub_saharan_african: "african",
  african_american: "african",
  hispanic_latino: "overall",
  middle_eastern_north_african: "overall",
  unknown: "overall",
};

export function mapAncestryToStatGroup(a: AncestryGroup): StatGroup {
  return ANCESTRY_TO_STAT_GROUP[a];
}

/**
 * Combines mother's + father's ancestry into one comparison group. If they
 * map to the same study group, use it; otherwise (mixed ancestry) fall back
 * to the pooled "overall" group since no published norms exist for mixed
 * backgrounds specifically.
 */
export function resolveStatGroup(motherAncestry: AncestryGroup, fatherAncestry: AncestryGroup): StatGroup {
  const m = mapAncestryToStatGroup(motherAncestry);
  const f = mapAncestryToStatGroup(fatherAncestry);
  return m === f ? m : "overall";
}

export function findPopulationStat(
  sex: Sex,
  group: StatGroup,
  hand: "right" | "left",
): PopulationStat {
  return (
    POPULATION_STATS.find((s) => s.sex === sex && s.group === group && s.hand === hand) ??
    POPULATION_STATS.find((s) => s.sex === sex && s.group === "overall" && s.hand === hand)!
  );
}
