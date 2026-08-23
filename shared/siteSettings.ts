export type SocialPlatform = "linkedin" | "facebook" | "instagram" | "youtube" | "x" | "tiktok" | "github";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  icon: SocialPlatform;
  url: string;
  visible: boolean;
};

export type PageContentValues = {
  about: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    intro: string;
    intentionEyebrow: string;
    intentionTitleMain: string;
    intentionTitleAccent: string;
    paragraphOne: string;
    paragraphTwo: string;
    quote: string;
    quoteAttribution: string;
    principlesEyebrow: string;
    principleOneTitle: string;
    principleOneBody: string;
    principleTwoTitle: string;
    principleTwoBody: string;
    principleThreeTitle: string;
    principleThreeBody: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaLabel: string;
  };
  featured: {
    eyebrow: string;
    titleMain: string;
    titleEnd: string;
    description: string;
    quote: string;
    detail: string;
    linkLabel: string;
    emptyEyebrow: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  decryptions: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    filterEyebrow: string;
    emptyEyebrow: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  rubrics: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    intro: string;
    selectionEyebrow: string;
    selectionTitle: string;
    emptyEyebrow: string;
    emptyTitle: string;
  };
  contact: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    detailsEyebrow: string;
    email: string;
    responseNote: string;
    location: string;
    locationNote: string;
    disclaimer: string;
    aboutLinkLabel: string;
  };
};

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
  socialLinks: SocialLink[];
  pageContent: PageContentValues;
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
  socialLinks: [],
  pageContent: {
    about: {
      eyebrow: "À propos de la revue",
      titleMain: "Prendre le droit",
      titleAccent: "au sérieux.",
      intro: "Sans le rendre intimidant. Droit de regard est un espace de lecture pour comprendre ce que les textes produisent dans la vie réelle.",
      intentionEyebrow: "Notre intention",
      intentionTitleMain: "Rendre les règles",
      intentionTitleAccent: "lisibles.",
      paragraphOne: "Le droit accompagne presque chaque décision importante, mais il reste souvent raconté dans une langue qui éloigne celles et ceux qu’il concerne. Droit de regard part du mouvement inverse : partir des situations, donner un contexte, nommer les limites, puis revenir au texte.",
      paragraphTwo: "La revue rassemble des analyses courtes, des décryptages et un lexique pratique. Chaque texte cherche un angle précis plutôt qu’une réponse universelle.",
      quote: "« Expliquer n’est pas simplifier à outrance. C’est choisir le bon point d’entrée. »",
      quoteAttribution: "— La ligne de Droit de regard",
      principlesEyebrow: "Notre méthode",
      principleOneTitle: "Un angle",
      principleOneBody: "Chaque texte commence par une question concrète, pas par une accumulation de références.",
      principleTwoTitle: "Des repères",
      principleTwoBody: "Dates, notions et limites sont visibles pour que la lecture reste vérifiable.",
      principleThreeTitle: "Une distance",
      principleThreeBody: "La revue informe et met en perspective ; elle ne remplace pas un conseil adapté à une situation.",
      ctaEyebrow: "Pour aller plus loin",
      ctaTitle: "Entrer dans les textes.",
      ctaLabel: "Lire les analyses",
    },
    featured: {
      eyebrow: "À la une",
      titleMain: "Le sujet qui mérite",
      titleEnd: "un vrai détour.",
      description: "Une analyse pour prendre le temps de distinguer le mouvement de fond du simple bruit d’actualité.",
      quote: "« La bonne question n’est pas seulement ce que permet la règle, mais ce qu’elle rend visible. »",
      detail: "Cette publication est issue de la rédaction du site et peut être consultée dans son intégralité.",
      linkLabel: "Entrer dans le dossier",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Les premières analyses seront bientôt publiées.",
      emptyDescription: "Le site affichera ici uniquement les articles publiés depuis votre panneau d’administration.",
    },
    decryptions: {
      eyebrow: "Le fil de lecture",
      titleMain: "Toutes les",
      titleAccent: "analyses.",
      description: "Les articles publiés par votre rédaction, accessibles au même endroit.",
      filterEyebrow: "Filtrer l’index",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Les articles publiés apparaîtront ici.",
      emptyDescription: "Publiez votre premier article depuis le panneau d’administration pour alimenter cet index.",
    },
    rubrics: {
      eyebrow: "Rubrique",
      titleMain: "Le droit",
      titleAccent: "en pratique.",
      intro: "Une entrée pour regarder ce domaine sans le réduire à une suite de définitions.",
      selectionEyebrow: "Sélection de lecture",
      selectionTitle: "Les textes de la rubrique.",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Cette rubrique sera alimentée par vos prochains articles.",
    },
    contact: {
      eyebrow: "Écrire à la revue",
      titleMain: "Une question,",
      titleAccent: "un sujet.",
      description: "Vous souhaitez proposer un angle, signaler une précision ou parler d’un partenariat éditorial ? La boîte aux lettres est ouverte.",
      detailsEyebrow: "Coordonnées éditoriales",
      email: "bonjour@droitderegard.fr",
      responseNote: "Réponse sous quelques jours ouvrés",
      location: "Paris · France",
      locationNote: "Revue indépendante",
      disclaimer: "Pour une question qui concerne votre situation personnelle, adressez-vous à un professionnel habilité à vous conseiller.",
      aboutLinkLabel: "Notre ligne éditoriale",
    },
  },
};
