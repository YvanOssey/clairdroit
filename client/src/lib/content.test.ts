import { describe, expect, it } from "vitest";
import { editorialSectionPaths, filterArticlesByEditorialSection, fromRemoteArticle, searchArticles, type RemoteArticle } from "./content";

const publishedArticle = {
  id: 7,
  slug: "preuve-numerique",
  title: "La preuve numérique devant le juge",
  excerpt: "Les nouveaux repères pour documenter un litige.",
  content: "Un texte publié depuis l’administration.",
  category: "Numérique",
  editorialSection: "analyses",
  author: "La rédaction",
  coverImage: null,
  seoTitle: "La preuve numérique devant le juge",
  seoDescription: "Les nouveaux repères pour documenter un litige.",
  status: "published",
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies RemoteArticle;

describe("editorial sections", () => {
  it("keeps an article in its assigned page only", () => {
    const articles = [
      { slug: "actualite", editorialSection: "actualite" as const } as never,
      { slug: "vulgarisation", editorialSection: "vulgarisation" as const } as never,
      { slug: "analyse", editorialSection: "analyses" as const } as never,
      { slug: "carriere", editorialSection: "carrieres" as const } as never,
    ];

    expect(filterArticlesByEditorialSection(articles, "actualite")).toHaveLength(1);
    expect(filterArticlesByEditorialSection(articles, "vulgarisation")).toHaveLength(1);
    expect(filterArticlesByEditorialSection(articles, "analyses")).toHaveLength(1);
    expect(filterArticlesByEditorialSection(articles, "carrieres")[0]?.slug).toBe("carriere");
    expect(new Set(articles.map((article) => article.editorialSection)).size).toBe(4);
  });

  it("defines one public route for each editorial section", () => {
    expect(Object.keys(editorialSectionPaths)).toEqual([
      "actualite",
      "vulgarisation",
      "analyses",
      "carrieres",
    ]);
    expect(new Set(Object.values(editorialSectionPaths)).size).toBe(4);
  });
});

describe("searchArticles", () => {
  it("maps inserted Markdown images to public image sections", () => {
    const article = fromRemoteArticle({ ...publishedArticle, content: "Premier paragraphe.\n\n![Illustration](https://example.com/illustration.jpg)" });
    expect(article.sections[1]).toMatchObject({ image: "https://example.com/illustration.jpg", body: "" });
  });

  it("includes published articles supplied by the administration", () => {
    expect(searchArticles("preuve numérique", [
      {
        slug: publishedArticle.slug,
        category: publishedArticle.category,
        eyebrow: "Publication · Analyse",
        title: publishedArticle.title,
        excerpt: publishedArticle.excerpt,
        date: "23 août 2026",
        readTime: "3 min",
        image: "https://example.com/article.jpg",
        imageAlt: "Article",
        author: publishedArticle.author,
        sections: [{ heading: "Le point de départ", body: publishedArticle.content }],
      },
    ])).toHaveLength(1);
    expect(searchArticles("travail hybride", [])).toHaveLength(0);
  });
});

describe("selectRelatedArticles", () => {
  const makeArticle = (slug: string, editorialSection: "actualite" | "vulgarisation" | "analyses" | "carrieres") => ({
    slug,
    editorialSection,
    category: "Droit du travail",
    eyebrow: "Publication",
    title: slug,
    excerpt: "Résumé de test suffisamment long.",
    date: "25 août 2026",
    readTime: "3 min",
    image: "/image.jpg",
    imageAlt: "Illustration de test",
    author: "ClairDroit",
    sections: [{ heading: "Repère", body: "Contenu de test suffisamment long." }],
  });

  it("exclut l’article courant et conserve sa section éditoriale", async () => {
    const { selectRelatedArticles } = await import("./content");
    const current = makeArticle("courant", "analyses");
    const candidates = [current, makeArticle("analyse-1", "analyses"), makeArticle("actualite-1", "actualite"), makeArticle("analyse-2", "analyses")];

    expect(selectRelatedArticles(current, candidates).map((item) => item.slug)).toEqual(["analyse-1", "analyse-2"]);
  });

  it("respecte la limite demandée", async () => {
    const { selectRelatedArticles } = await import("./content");
    const current = makeArticle("courant", "carrieres");
    const candidates = [current, makeArticle("carrieres-1", "carrieres"), makeArticle("carrieres-2", "carrieres"), makeArticle("carrieres-3", "carrieres")];

    expect(selectRelatedArticles(current, candidates, 2)).toHaveLength(2);
  });
});
