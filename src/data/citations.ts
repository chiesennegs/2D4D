export interface Citation {
  id: string;
  authors: string;
  year: number;
  title: string;
  venue: string;
  url: string;
  note?: string;
}

// Every entry below was verified against a real, checkable source (PubMed,
// DOI, or the journal/preprint page) during a literature review pass — see
// each `note` for what it actually shows and any caveats about sample size
// or replication status. Do not add a citation without a working `url`.
export const CITATIONS: Citation[] = [
  {
    id: "manning1998",
    authors: "Manning JT, Scutt D, Wilson J, Lewis-Jones DI",
    year: 1998,
    title:
      "The ratio of 2nd to 4th digit length: a predictor of sperm numbers and concentrations of testosterone, luteinizing hormone and oestrogen",
    venue: "Human Reproduction, 13(11), 3000-3004",
    url: "https://pubmed.ncbi.nlm.nih.gov/9853845/",
    note: "The original paper proposing 2D:4D as a marker linked to prenatal/adult sex hormones, and defining the standard measurement method.",
  },
  {
    id: "honekopp2010sex",
    authors: "Hönekopp J, Watson S",
    year: 2010,
    title: "Meta-analysis of digit ratio 2D:4D shows greater sex difference in the right hand",
    venue: "American Journal of Human Biology, 22(5), 619-630",
    url: "https://pubmed.ncbi.nlm.nih.gov/20737609/",
    note: "The largest sex-difference meta-analysis (116 samples, ~25,000 people): confirms a real, replicated male < female difference in 2D:4D, larger in the right hand. Also found that methods which distort soft tissue (e.g. pressing the hand flat) inflate the apparent effect.",
  },
  {
    id: "butovskaya2021",
    authors: "Butovskaya M, Burkova V, Apalkova Y, et al.",
    year: 2021,
    title:
      "Sex, population origin, age and average digit length as predictors of digit ratio in three large world populations",
    venue: "Scientific Reports, 11, 8355",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8046776/",
    note: "The reference dataset this app uses for its percentile comparisons (n≈ 7,500 across European-, African-, and Asian-origin samples, both hands, sexes analyzed separately).",
  },
  {
    id: "lippa2003",
    authors: "Lippa RA",
    year: 2003,
    title: "Are 2D:4D finger-length ratios related to sexual orientation? Yes for men, no for women",
    venue: "Journal of Personality and Social Psychology, 85, 179-188",
    url: "https://pubmed.ncbi.nlm.nih.gov/12872893/",
    note: "Large (2,000+, later expanded) international self-measurement study. Found ethnicity had a numerically larger effect on absolute 2D:4D than sex in some analyses — a caveat for treating any single number as precise.",
  },
  {
    id: "manning2004children",
    authors: "Manning JT, Stewart AG, Bundred P, Trivers R",
    year: 2004,
    title: "Sex and ethnic differences in 2nd to 4th digit ratio of children",
    venue: "Early Human Development, 80(2), 161-168",
    url: "https://pubmed.ncbi.nlm.nih.gov/15500996/",
    note: "n=798 children across four ethnic groups; found significant group differences (p=0.0001) but only for broad groupings — finer national/tribal comparisons rest on much smaller samples.",
  },
  {
    id: "malas2006",
    authors: "Malas MA, Dogan S, Evcil EH, Desdicioglu K",
    year: 2006,
    title: "Fetal development of the hand, digits and digit ratio (2D:4D)",
    venue: "Early Human Development",
    url: "https://pubmed.ncbi.nlm.nih.gov/16473482/",
    note: "161 fetuses, 9-40 weeks gestation: 2D:4D itself did not change with gestational age, and the sex difference was already present — evidence the ratio is set very early and is stable, which is why this app doesn't use age to calibrate results.",
  },
  {
    id: "mcintyre2005",
    authors: "McIntyre MH, Ellison PT, Lieberman DE, Demerath E, Towne B",
    year: 2005,
    title: "The development of sex differences in digital formula from infancy",
    venue: "Proceedings of the Royal Society B, 272, 1473-1479",
    url: "https://royalsocietypublishing.org/doi/10.1098/rspb.2005.3100",
    note: "Fels Longitudinal Study: the sex difference in 2D:4D is present from infancy and essentially unaffected by puberty.",
  },
  {
    id: "trivers2006",
    authors: "Trivers R, Manning J, Jacobson A",
    year: 2006,
    title: "A longitudinal study of digit ratio (2D:4D) and other finger ratios in Jamaican children",
    venue: "Hormones and Behavior",
    url: "https://pubmed.ncbi.nlm.nih.gov/16040033/",
    note: "A notable exception to the 'stable ratio' consensus: found a small increase in 2D:4D with age in a Jamaican child/adolescent cohort. Shown here for balance — most other studies (fetal and longitudinal) find stability.",
  },
  {
    id: "zheng2011",
    authors: "Zheng Z, Cohn MJ",
    year: 2011,
    title: "Developmental basis of sexually dimorphic digit ratios",
    venue: "PNAS, 108(39), 16289-16294",
    url: "https://www.pnas.org/doi/full/10.1073/pnas.1108312108",
    note: "Mouse study: shows 2D:4D is directly controlled by the local balance of androgen vs. estrogen receptor signaling during digit development — the strongest mechanistic evidence for the theory, though it's in mice, not direct proof of the same pathway in humans.",
  },
  {
    id: "lutchmaya2004",
    authors: "Lutchmaya S, Baron-Cohen S, Raggatt P, Knickmeyer R, Manning JT",
    year: 2004,
    title: "2nd to 4th digit ratios, fetal testosterone and estradiol",
    venue: "Early Human Development",
    url: "https://pubmed.ncbi.nlm.nih.gov/15113628/",
    note: "The most-cited direct human evidence: amniotic testosterone:estradiol ratio correlated with right-hand (not left-hand) 2D:4D. Small sample (n=29); sexes not analyzed separately.",
  },
  {
    id: "replication2021",
    authors: "Richards G, Browne WV, Constantinescu M",
    year: 2021,
    title:
      "Digit ratio (2D:4D) and amniotic testosterone and estradiol: an attempted replication of Lutchmaya et al. (2004)",
    venue: "Journal of Developmental Origins of Health and Disease",
    url: "https://pubmed.ncbi.nlm.nih.gov/33472723/",
    note: "The direct large-sample replication attempt of the 2004 finding above — published 16 years later, it found no statistically significant correlations between amniotic hormones and any digit-ratio measure. This is the central reason the testosterone link is described as contested, not established, in this app.",
  },
  {
    id: "plos2023",
    authors: "Ernsten L, Körner LM, Schaper ML, Lawrenz J, Richards G, Heil M, Schaal NK",
    year: 2023,
    title:
      "The association of prenatal amniotic sex hormones and digit ratio (2D:4D) in children aged 5 to 70 months: a longitudinal study",
    venue: "PLOS ONE",
    url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0282253",
    note: "Another recent longitudinal study finding null/mixed results linking amniotic hormones to 2D:4D.",
  },
  {
    id: "grimbos2010",
    authors: "Grimbos T, Dawood K, Burriss RP, Zucker KJ, Puts DA",
    year: 2010,
    title: "Sexual orientation and the second to fourth finger length ratio: a meta-analysis in men and women",
    venue: "Archives of Sexual Behavior, 39(2), 278-287",
    url: "https://pubmed.ncbi.nlm.nih.gov/20364887/",
    note: "Meta-analysis (thousands of participants) finding small-to-medium associations between 2D:4D and sexual orientation in women, none in men. Did not include unpublished data, so vulnerable to publication bias — see the 2026 Bayesian reanalysis below.",
  },
  {
    id: "shiramizu2026",
    authors: "Shiramizu V, Bartoš F, Jones BC, Pollet TV",
    year: 2026,
    title: "Little evidence for group differences in 2D:4D ratios based on sexual orientation after adjusting for publication bias",
    venue: "Hormones and Behavior, 180, 105921",
    url: "https://pubmed.ncbi.nlm.nih.gov/41861700/",
    note: "A robust Bayesian reanalysis designed specifically to correct for publication bias: found moderate-to-strong evidence of publication bias in the sexual-orientation literature, and moderate evidence against most of the group differences reported by earlier meta-analyses. A direct, recent example of how effects in this field shrink once bias is corrected for.",
  },
  {
    id: "lippa2006",
    authors: "Lippa RA",
    year: 2006,
    title: "Finger lengths, 2D:4D ratios, and their relation to gender-related personality traits and the Big Five",
    venue: "Biological Psychology, 71, 116-121",
    url: "https://pubmed.ncbi.nlm.nih.gov/16360883/",
    note: "A large study that failed to replicate several previously reported 2D:4D-personality links from smaller studies, finding only weak associations.",
  },
  {
    id: "leslie2019",
    authors: "Leslie M",
    year: 2019,
    title: "The mismeasure of hands?",
    venue: "Science, 364(6444), 923-926",
    url: "https://www.science.org/doi/full/10.1126/science.364.6444.923",
    note: "A science-journalism overview (not a primary study) of replication problems across the 2D:4D field — useful context, cited here as commentary rather than data.",
  },
];
