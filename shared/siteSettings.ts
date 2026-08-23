export type SiteSettingsValues = {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  navHomeLabel: string;
  navArticlesLabel: string;
  navCategoriesLabel: string;
  navAboutLabel: string;
  navContactLabel: string;
  homeEyebrow: string;
  homeTitleMain: string;
  homeTitleAccent: string;
  homeTitleEnd: string;
  homeDescription: string;
  homePrimaryCta: string;
  homeSecondaryCta: string;
  footerDescription: string;
  footerKicker: string;
  newsletterTitle: string;
  newsletterDescription: string;
};

export const SITE_SETTINGS_DEFAULTS: SiteSettingsValues = {
  siteName: "Droit de regard",
  siteTagline: "Revue indépendante",
  logoUrl: "/manus-storage/droit-de-regard-mark_63489c0c.png",
  navHomeLabel: "À la une",
  navArticlesLabel: "Décryptages",
  navCategoriesLabel: "Rubriques",
  navAboutLabel: "À propos",
  navContactLabel: "Nous écrire",
  homeEyebrow: "Droit de regard · Revue indépendante",
  homeTitleMain: "Ce que la règle",
  homeTitleAccent: "change,",
  homeTitleEnd: "concrètement.",
  homeDescription: "Analyses, repères et décryptages pour lire le droit dans le monde réel — sans perdre de vue celles et ceux qu’il engage.",
  homePrimaryCta: "Explorer les analyses",
  homeSecondaryCta: "Dernière lecture",
  footerDescription: "Analyses, repères et décryptages pour lire le droit dans le monde réel.",
  footerKicker: "Le droit, avec un angle",
  newsletterTitle: "La lettre de fond",
  newsletterDescription: "Une sélection mensuelle pour prendre du recul sur les règles qui nous entourent.",
};
