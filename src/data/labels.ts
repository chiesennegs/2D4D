import type { AncestryGroup, AgeRange, Sex } from "../types";

export const SEX_LABELS: Record<Sex | "unknown", string> = {
  male: "Male",
  female: "Female",
  unknown: "Prefer not to say / unsure",
};

export const ANCESTRY_LABELS: Record<AncestryGroup, string> = {
  east_asian: "East Asian",
  south_asian: "South Asian",
  european: "European",
  sub_saharan_african: "Sub-Saharan African",
  african_american: "African American",
  hispanic_latino: "Hispanic / Latino",
  middle_eastern_north_african: "Middle Eastern / North African",
  unknown: "Prefer not to say / unsure",
};

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  under_18: "Under 18",
  "18_29": "18–29",
  "30_49": "30–49",
  "50_plus": "50+",
  unknown: "Prefer not to say",
};
