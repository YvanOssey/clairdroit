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
    photoUrl: string;
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
  /** Legacy compatibility only: no longer editable or rendered in the public site. */
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
  navCareersLabel: string;
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
  siteName: "ClairDroit",
  siteTagline: "Le droit clair pour tous !",
  logoUrl: "/manus-storage/logo-clairdroit_a271f928.jpeg",
  navHomeLabel: "Actualité juridique",
  navArticlesLabel: "Articles juridiques vulgarisés",
  navCategoriesLabel: "Analyses juridiques",
  navAboutLabel: "À propos de moi",
  navCareersLabel: "Tips carrières juridiques",
  navContactLabel: "Nous écrire",
  homeEyebrow: "ClairDroit · Le droit clair pour tous",
  homeTitleMain: "Bienvenue à toi lecteur !",
  homeTitleAccent: "",
  homeTitleEnd: "",
  homeDescription: "ClairDroit est le Blog qui va t'aider à comprendre le droit plus facilement. Il vise à être une source fiable et gratuite aux concepts juridiques qui peuvent te sembler inaccessible. Notre slogan : Le droit clair pour tous !",
  homePrimaryCta: "Explorer les analyses",
  homeSecondaryCta: "Dernière lecture",
  footerDescription: "Analyses juridiques, articles vulgarisés, analyses scientifiques pour comprendre le droit plus aisément.",
  footerKicker: "Le droit clair pour tous !",
  newsletterTitle: "Newsletter",
  newsletterDescription: "Abonnez-vous pour recevoir les nouvelles actualités de ClairDroit.",
  socialLinks: [],
  pageContent: {
    about: {
      eyebrow: "À propos de moi",
      titleMain: "À propos",
      titleAccent: "de moi",
      intro: "Je suis Corinne Thio, juriste et blogueuse. Avec ClairDroit, je souhaite rendre les notions juridiques plus accessibles et aider chacun à mieux comprendre les règles qui l’entourent.",
      intentionEyebrow: "Ma démarche",
      intentionTitleMain: "Rendre le droit",
      intentionTitleAccent: "plus clair.",
      paragraphOne: "ClairDroit est un espace de lecture consacré à la vulgarisation juridique, aux analyses et aux explications utiles au quotidien. Chaque article part d’une question concrète et revient à l’essentiel.",
      paragraphTwo: "Mon objectif est de proposer une information fiable, gratuite et compréhensible, afin que le droit ne soit plus perçu comme un domaine réservé aux initiés.",
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
      photoUrl: "/manus-storage/photo-corinne_f8503683.jpeg",
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
    /** Legacy compatibility only: no longer editable or rendered in the public site. */
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
