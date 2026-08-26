export type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "x"
  | "tiktok"
  | "github";

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
    biography: string;
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
  legalNotice: {
    eyebrow: string;
    title: string;
    intro: string;
    editorTitle: string;
    editorBody: string;
    activityTitle: string;
    activityBody: string;
    hostingTitle: string;
    hostingBody: string;
    rightsTitle: string;
    rightsBody: string;
    contactTitle: string;
    contactBody: string;
    draftNotice: string;
  };
  privacyPolicy: {
    eyebrow: string;
    title: string;
    intro: string;
    controllerTitle: string;
    controllerBody: string;
    dataTitle: string;
    dataBody: string;
    purposesTitle: string;
    purposesBody: string;
    retentionTitle: string;
    retentionBody: string;
    requestsTitle: string;
    requestsBody: string;
    cookiesTitle: string;
    cookiesBody: string;
    draftNotice: string;
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
  logoUrl: "",
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
  homeDescription:
    "ClairDroit est le Blog qui va t'aider à comprendre le droit plus facilement. Il vise à être une source fiable et gratuite aux concepts juridiques qui peuvent te sembler inaccessible. Notre slogan : Le droit clair pour tous !",
  homePrimaryCta: "Explorer les analyses",
  homeSecondaryCta: "Dernière lecture",
  footerDescription:
    "Analyses juridiques, articles vulgarisés, analyses scientifiques pour comprendre le droit plus aisément.",
  footerKicker: "Le droit clair pour tous !",
  newsletterTitle: "Newsletter",
  newsletterDescription:
    "Abonnez-vous pour recevoir les nouvelles actualités de ClairDroit.",
  socialLinks: [],
  pageContent: {
    about: {
      eyebrow: "À propos de moi",
      titleMain: "À propos",
      titleAccent: "de moi",
      intro:
        "Je suis Corinne Thio, juriste et blogueuse. Avec ClairDroit, je souhaite rendre les notions juridiques plus accessibles et aider chacun à mieux comprendre les règles qui l’entourent.",
      intentionEyebrow: "Ma démarche",
      intentionTitleMain: "Rendre le droit",
      intentionTitleAccent: "plus clair.",
      paragraphOne:
        "ClairDroit est un espace de lecture consacré à la vulgarisation juridique, aux analyses et aux explications utiles au quotidien. Chaque article part d’une question concrète et revient à l’essentiel.",
      paragraphTwo:
        "Mon objectif est de proposer une information fiable, gratuite et compréhensible, afin que le droit ne soit plus perçu comme un domaine réservé aux initiés.",
      biography:
        "Passionnée par la transmission du savoir et convaincue que le droit ne doit pas rester enfermé dans les amphithéâtres ou les cabinets, j’ai créé ce blog avec l’idée de rendre le droit clair, accessible et utile au quotidien.\n\nMon histoire avec le droit commence sur les bancs de l’université, où j’obtiens une licence en droit privé à l’Université Alassane Ouattara de Bouaké, avant d’obtenir par la suite un Master en fiscalité des entreprises à l’Institut Universitaire d’Abidjan. Très tôt, une question m’a interpellée : comment peut-on demander aux citoyens de respecter la loi, partant de l’adage « Nemo censetur ignorare legem », alors que beaucoup ne la comprennent pas ?\n\nC’est de cette réflexion qu’est né ce blog.\n\nÀ travers ClairDroit, je partage des articles qui expliquent simplement des notions juridiques souvent perçues comme complexes : contrats, procédures, droits du travail, obligations légales pour les entreprises… Mon objectif n’est pas seulement d’informer, mais d’aider chacun à mieux comprendre ses droits pour mieux les défendre.\n\nLe blog propose également des analyses juridiques et des articles scientifiques, destinés à approfondir certaines questions de droit, à analyser l’actualité juridique et à nourrir la réflexion autour des enjeux contemporains du droit.\n\nMais mon engagement ne s’arrête pas à l’écriture.\n\nEn parallèle de mes activités de juriste en entreprise et de consultante, j’accompagne des étudiants en droit dans la compréhension de la pratique juridique à travers des sessions de coaching. J’ai également eu la chance de m’engager dans plusieurs initiatives citoyennes et panafricaines, notamment dans des programmes de formation, de leadership et de mobilisation de la jeunesse.\n\nAu fil de mon parcours, une conviction s’est imposée à moi : le savoir juridique est un levier puissant d’autonomisation. Lorsqu’un citoyen connaît ses droits, il devient plus libre, plus responsable et plus capable de participer à la construction d’une société plus inclusive.\n\nCe blog est donc plus qu’un simple espace de publication.\n\nC’est un lieu de partage, de transmission et de réflexion pour tous ceux qui veulent comprendre le droit sans jargon inutile, mais aussi pour ceux qui souhaitent aller plus loin dans l’analyse et la compréhension des dynamiques juridiques contemporaines.\n\nQue vous soyez étudiant, jeune professionnel, entrepreneur ou simplement curieux de mieux comprendre les règles qui encadrent notre vie quotidienne, vous êtes ici chez vous.\n\nBienvenue dans l’univers de ClairDroit avec Corinne THIO.",
      quote:
        "« Expliquer n’est pas simplifier à outrance. C’est choisir le bon point d’entrée. »",
      quoteAttribution: "— La ligne de ClairDroit",
      principlesEyebrow: "Notre méthode",
      principleOneTitle: "Un angle",
      principleOneBody:
        "Chaque texte commence par une question concrète, pas par une accumulation de références.",
      principleTwoTitle: "Des repères",
      principleTwoBody:
        "Dates, notions et limites sont visibles pour que la lecture reste vérifiable.",
      principleThreeTitle: "Une distance",
      principleThreeBody:
        "La revue informe et met en perspective ; elle ne remplace pas un conseil adapté à une situation.",
      ctaEyebrow: "Pour aller plus loin",
      ctaTitle: "Entrer dans les textes.",
      ctaLabel: "Lire les analyses",
      photoUrl: "",
    },
    featured: {
      eyebrow: "À la une",
      titleMain: "Le sujet qui mérite",
      titleEnd: "un vrai détour.",
      description:
        "Une analyse pour prendre le temps de distinguer le mouvement de fond du simple bruit d’actualité.",
      quote:
        "« La bonne question n’est pas seulement ce que permet la règle, mais ce qu’elle rend visible. »",
      detail:
        "Cette publication est issue de la rédaction du site et peut être consultée dans son intégralité.",
      linkLabel: "Entrer dans le dossier",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Les premières analyses seront bientôt publiées.",
      emptyDescription:
        "Le site affichera ici uniquement les articles publiés depuis votre panneau d’administration.",
    },
    decryptions: {
      eyebrow: "Le fil de lecture",
      titleMain: "Toutes les",
      titleAccent: "analyses.",
      description:
        "Les articles publiés par votre rédaction, accessibles au même endroit.",
      filterEyebrow: "Filtrer l’index",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Les articles publiés apparaîtront ici.",
      emptyDescription:
        "Publiez votre premier article depuis le panneau d’administration pour alimenter cet index.",
    },
    /** Legacy compatibility only: no longer editable or rendered in the public site. */
    rubrics: {
      eyebrow: "Rubrique",
      titleMain: "Le droit",
      titleAccent: "en pratique.",
      intro:
        "Une entrée pour regarder ce domaine sans le réduire à une suite de définitions.",
      selectionEyebrow: "Sélection de lecture",
      selectionTitle: "Les textes de la rubrique.",
      emptyEyebrow: "Aucune publication",
      emptyTitle: "Cette rubrique sera alimentée par vos prochains articles.",
    },
    contact: {
      eyebrow: "Écrire à ClairDroit",
      titleMain: "Une question,",
      titleAccent: "un sujet.",
      description:
        "Vous souhaitez proposer un angle, signaler une précision ou parler d’un partenariat éditorial ? La boîte aux lettres de ClairDroit est ouverte.",
      detailsEyebrow: "Coordonnées éditoriales",
      email: "corinnethio52@gmail.com",
      responseNote: "Réponse sous quelques jours ouvrés",
      location: "Cocody · Abidjan · Côte d’Ivoire",
      locationNote: "Blog personnel ClairDroit",
      disclaimer:
        "Pour une question qui concerne votre situation personnelle, adressez-vous à un professionnel habilité à vous conseiller.",
      aboutLinkLabel: "Notre ligne éditoriale",
    },
    legalNotice: {
      eyebrow: "Informations du site",
      title: "Mentions légales",
      intro:
        "Les informations d’identification et de contact de ClairDroit, blog personnel consacré à la compréhension du droit.",
      editorTitle: "Éditeur du site",
      editorBody:
        "Le site ClairDroit est un blog personnel édité par Corinne Thio. Lieu d’établissement déclaré : Cocody · Abidjan · Côte d’Ivoire. Adresse de contact : corinnethio52@gmail.com.",
      activityTitle: "Activité du site",
      activityBody:
        "ClairDroit propose des articles d’actualité juridique, des articles vulgarisés, des analyses juridiques et des conseils liés aux carrières juridiques. Les contenus ont une vocation informative et pédagogique et ne constituent pas un avis juridique personnalisé.",
      hostingTitle: "Hébergement",
      hostingBody:
        "Les informations relatives à l’hébergeur et aux modalités techniques d’hébergement seront complétées avant la mise en ligne définitive du site.",
      rightsTitle: "Propriété intellectuelle",
      rightsBody:
        "Sauf mention contraire, les textes, éléments graphiques, logo et contenus originaux de ClairDroit sont protégés par les règles applicables à la propriété intellectuelle. Toute reproduction substantielle doit faire l’objet d’une autorisation préalable.",
      contactTitle: "Contact",
      contactBody:
        "Pour signaler une erreur, demander une précision ou poser une question concernant le site, écrivez à corinnethio52@gmail.com.",
      draftNotice:
        "Document de travail : ces informations doivent être relues et adaptées avant une utilisation définitive.",
    },
    privacyPolicy: {
      eyebrow: "Données et confidentialité",
      title: "Politique de confidentialité",
      intro:
        "Cette page explique quelles données sont recueillies par ClairDroit et pourquoi elles sont utilisées.",
      controllerTitle: "Responsable du traitement",
      controllerBody:
        "Les traitements liés au site sont réalisés sous la responsabilité de Corinne Thio, à Cocody · Abidjan · Côte d’Ivoire. Adresse de contact : corinnethio52@gmail.com.",
      dataTitle: "Données recueillies",
      dataBody:
        "Le formulaire Nous écrire peut recueillir votre nom, votre adresse email, l’objet et le contenu de votre message. La newsletter enregistre l’adresse email nécessaire à l’envoi des actualités.",
      purposesTitle: "Finalités",
      purposesBody:
        "Ces données sont utilisées pour répondre aux messages reçus, gérer les inscriptions à la newsletter, assurer la sécurité du panneau d’administration et améliorer le fonctionnement éditorial du site.",
      retentionTitle: "Conservation et destinataires",
      retentionBody:
        "Les données sont conservées pendant la durée nécessaire à leur traitement et peuvent être transmises aux prestataires techniques strictement nécessaires à l’hébergement, au stockage et à l’envoi des notifications email. Les durées précises devront être confirmées dans la version définitive.",
      requestsTitle: "Vos demandes",
      requestsBody:
        "Pour demander une correction, une suppression ou une information sur vos données, écrivez à corinnethio52@gmail.com en précisant l’objet de votre demande.",
      cookiesTitle: "Cookies et mesure d’audience",
      cookiesBody:
        "Le site peut utiliser des cookies techniques nécessaires à la session d’administration. Tout service tiers supplémentaire devra être décrit ici avant son activation publique.",
      draftNotice:
        "Document de travail : ces informations doivent être relues et adaptées avant une utilisation définitive.",
    },
  },
};
