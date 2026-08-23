/* Direction « Cabinet éditorial » : données structurées, ton précis et métadonnées visibles avant tout effet décoratif. */

export type Article = {
  slug: string;
  category: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  author: string;
  featured?: boolean;
  sections: { heading: string; body: string }[];
};

export const categories = [
  { name: "Droit du travail", count: "12 articles" },
  { name: "Numérique", count: "09 articles" },
  { name: "Affaires", count: "08 articles" },
  { name: "Vie privée", count: "06 articles" },
  { name: "Droit public", count: "05 articles" },
];

export const articles: Article[] = [
  {
    slug: "travail-hybride-nouvelles-frontieres",
    category: "Droit du travail",
    eyebrow: "À la une · Analyse",
    title: "Travail hybride : les nouvelles frontières du pouvoir de l’employeur",
    excerpt:
      "À mesure que le bureau devient un lieu parmi d’autres, la question n’est plus seulement celle du contrôle : elle devient celle du cadre, de la preuve et de la confiance.",
    date: "20 août 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Dossier de droit du travail posé sur une table de bureau",
    author: "Camille Renaud",
    featured: true,
    sections: [
      {
        heading: "Le lieu de travail n’est plus une évidence",
        body:
          "Le travail hybride a déplacé une partie du débat juridique. Le lieu n’est plus un simple décor organisationnel : il conditionne l’accès aux outils, l’exercice du pouvoir de direction et la capacité à documenter ce qui s’est réellement passé. Une politique claire doit donc préciser les rythmes, les outils et les situations qui justifient un retour sur site.",
      },
      {
        heading: "La preuve se disperse",
        body:
          "Messages instantanés, agendas partagés et historiques de connexion produisent une matière abondante. Leur volume ne garantit pas leur pertinence. La question utile est celle de la finalité : quelles informations sont nécessaires pour établir un fait, pendant combien de temps, et avec quelles garanties d’accès ?",
      },
      {
        heading: "Trois réflexes de méthode",
        body:
          "Commencer par distinguer la règle interne de la pratique réelle. Ensuite, conserver une trace des arbitrages plutôt que seulement des incidents. Enfin, expliquer les critères de contrôle aux équipes avant qu’un désaccord ne transforme un outil de suivi en outil de surveillance.",
      },
    ],
  },
  {
    slug: "donnees-personnelles-et-droit-de-regard",
    category: "Numérique",
    eyebrow: "Décryptage",
    title: "Données personnelles : qui a vraiment le droit de regard ?",
    excerpt:
      "Une lecture concrète des responsabilités qui se cachent derrière les tableaux de bord, les formulaires et les outils de personnalisation.",
    date: "14 août 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Téléphone posé à côté d’un carnet et d’un fil de cuivre",
    author: "Nora Ben Salem",
    sections: [
      {
        heading: "Nommer les rôles avant de compter les données",
        body:
          "Les débats sur la donnée commencent souvent par sa quantité. Ils devraient commencer par la répartition des rôles : qui décide, qui exécute, qui reçoit et qui peut demander une explication ? Cette cartographie évite de traiter une architecture technique comme si elle était juridiquement neutre.",
      },
      {
        heading: "La transparence est une architecture",
        body:
          "Une information compréhensible ne se réduit pas à une longue page de politique de confidentialité. Elle se construit au moment où la donnée est demandée, dans un vocabulaire qui permet de saisir l’usage, la durée et le choix réellement offert.",
      },
    ],
  },
  {
    slug: "gouvernance-responsable-decisions",
    category: "Affaires",
    eyebrow: "Regards · Entreprise",
    title: "Gouverner, c’est aussi rendre les décisions lisibles",
    excerpt:
      "Comités, délégations et procédures ne valent que si l’on peut relire le chemin d’une décision sans en perdre les nuances.",
    date: "7 août 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Dossier et stylo sur une table de réunion",
    author: "Hugo Martin",
    sections: [
      {
        heading: "La gouvernance comme pratique de lecture",
        body:
          "Une bonne gouvernance ne consiste pas seulement à multiplier les validations. Elle permet de comprendre pourquoi une décision a été prise, avec quelles informations et dans quelles limites. Cette lisibilité soutient le contrôle autant qu’elle protège la capacité d’agir.",
      },
      {
        heading: "Laisser une trace qui serve à nouveau",
        body:
          "Procès-verbaux, notes de décision et tableaux de risques sont souvent conçus pour clore une séquence. Ils sont plus utiles lorsqu’ils donnent aussi un point de départ à la suivante : questions ouvertes, hypothèses retenues et conditions de réexamen.",
      },
    ],
  },
  {
    slug: "lexique-clause-de-confidentialite",
    category: "Vie privée",
    eyebrow: "Lexique",
    title: "Clause de confidentialité : ce qu’elle protège, et ce qu’elle ne peut pas faire",
    excerpt:
      "Un repère court pour distinguer l’engagement de discrétion, la protection d’une information et les limites d’une formule trop générale.",
    date: "31 juillet 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1600&q=85",
    imageAlt: "Dossier juridique ouvert avec un stylo sur un bureau en bois",
    author: "Camille Renaud",
    sections: [
      {
        heading: "Une clause n’est pas un rideau",
        body:
          "Une clause de confidentialité identifie un engagement et un périmètre. Elle ne fait pas disparaître les obligations légales qui existent déjà, et elle ne transforme pas toute information interne en secret absolu.",
      },
      {
        heading: "Le bon niveau de précision",
        body:
          "Pour être opérante, la clause doit décrire ce qui est protégé, les personnes concernées, la durée et les exceptions utiles. L’imprécision ne renforce pas automatiquement la protection ; elle rend surtout le désaccord plus probable.",
      },
    ],
  },
];

export type RemoteArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const fromRemoteArticle = (article: RemoteArticle): Article => ({
  slug: article.slug,
  category: article.category,
  eyebrow: "Publication · Analyse",
  title: article.title,
  excerpt: article.excerpt,
  date: new Date(article.publishedAt ?? article.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  readTime: `${Math.max(3, Math.ceil(article.content.trim().split(/\\s+/).length / 190))} min`,
  image: article.coverImage || "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1600&q=85",
  imageAlt: `Illustration éditoriale pour ${article.title}`,
  author: article.author,
  sections: article.content.split(/\\n{2,}/).filter(Boolean).map((body, index) => ({ heading: index === 0 ? "Le point de départ" : `Repère ${String(index + 1).padStart(2, "0")}`, body })),
});

export function searchArticles(query: string, remoteArticles: Article[] = []) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];
  return [...remoteArticles, ...articles].filter((article) => [article.title, article.excerpt, article.category].join(" ").toLowerCase().includes(normalizedQuery));
}

export const featuredArticle = articles.find((article) => article.featured) ?? articles[0];

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
