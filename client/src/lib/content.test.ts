import { describe, expect, it } from "vitest";
import { searchArticles, type RemoteArticle } from "./content";

const publishedArticle = {
  id: 7,
  slug: "preuve-numerique",
  title: "La preuve numérique devant le juge",
  excerpt: "Les nouveaux repères pour documenter un litige.",
  content: "Un texte publié depuis l’administration.",
  category: "Numérique",
  author: "La rédaction",
  coverImage: null,
  status: "published",
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies RemoteArticle;

describe("searchArticles", () => {
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
  });
});
