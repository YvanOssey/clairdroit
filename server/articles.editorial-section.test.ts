import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insertArticle: vi.fn(),
  updateArticle: vi.fn(),
  getArticleById: vi.fn(),
  listPublishedArticles: vi.fn(),
  getPublishedArticleBySlug: vi.fn(),
  listAdminArticles: vi.fn(),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    insertArticle: mocks.insertArticle,
    updateArticle: mocks.updateArticle,
    getArticleById: mocks.getArticleById,
    listPublishedArticles: mocks.listPublishedArticles,
    getPublishedArticleBySlug: mocks.getPublishedArticleBySlug,
    listAdminArticles: mocks.listAdminArticles,
  };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const adminContext = (): TrpcContext => ({
  user: {
    id: 7,
    openId: "email:admin@example.com",
    email: "admin@example.com",
    name: "Rédaction",
    loginMethod: "password",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

const articleInput = {
  title: "Comprendre une règle juridique",
  excerpt: "Un article pédagogique pour comprendre une notion importante.",
  content: "Un contenu suffisamment long pour passer la validation de l’éditeur.",
  category: "Repères juridiques",
  editorialSection: "vulgarisation" as const,
  author: "La rédaction",
  coverImage: "",
  status: "published" as const,
};

describe("editorialSection article procedures", () => {
  it("persists the selected section on create and update", async () => {
    const created = { id: 1, ...articleInput, slug: "comprendre-une-regle-juridique-1" };
    const updated = { ...created, editorialSection: "carrieres" as const };
    mocks.insertArticle.mockResolvedValueOnce(created);
    mocks.getArticleById.mockResolvedValueOnce(created).mockResolvedValueOnce(created);
    mocks.updateArticle.mockResolvedValueOnce(updated);

    const caller = appRouter.createCaller(adminContext());
    const createdResult = await caller.articles.create(articleInput);
    const updatedResult = await caller.articles.update({
      ...articleInput,
      id: 1,
      editorialSection: "carrieres",
    });

    expect(createdResult?.editorialSection).toBe("vulgarisation");
    expect(mocks.insertArticle).toHaveBeenCalledWith(
      expect.objectContaining({ editorialSection: "vulgarisation" }),
    );
    expect(updatedResult?.editorialSection).toBe("carrieres");
    expect(mocks.updateArticle).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ editorialSection: "carrieres" }),
    );
  });

  it("returns editorialSection from public published and bySlug procedures", async () => {
    const published = { id: 2, ...articleInput, slug: "article-vulgarise" };
    mocks.listPublishedArticles.mockResolvedValueOnce([published]);
    mocks.getPublishedArticleBySlug.mockResolvedValueOnce(published);

    const caller = appRouter.createCaller(adminContext());
    const list = await caller.articles.published();
    const detail = await caller.articles.bySlug({ slug: published.slug });

    expect(list[0]?.editorialSection).toBe("vulgarisation");
    expect(detail?.editorialSection).toBe("vulgarisation");
  });

  it("returns editorialSection from admin list and detail procedures", async () => {
    const adminArticle = { id: 3, ...articleInput, slug: "article-admin" };
    mocks.listAdminArticles.mockResolvedValueOnce([adminArticle]);
    mocks.getArticleById.mockResolvedValueOnce(adminArticle);

    const caller = appRouter.createCaller(adminContext());
    const list = await caller.articles.adminList();
    const detail = await caller.articles.adminById({ id: adminArticle.id });

    expect(list[0]?.editorialSection).toBe("vulgarisation");
    expect(detail?.editorialSection).toBe("vulgarisation");
  });

  it("maps every allowed section to its public route", () => {
    const paths = {
      actualite: "/actualite-juridique",
      vulgarisation: "/articles-juridiques",
      analyses: "/analyses-juridiques",
      carrieres: "/carrieres-juridiques",
    } as const;

    expect(Object.keys(paths)).toHaveLength(4);
    expect(paths.actualite).toBe("/actualite-juridique");
    expect(paths.vulgarisation).toBe("/articles-juridiques");
    expect(paths.analyses).toBe("/analyses-juridiques");
    expect(paths.carrieres).toBe("/carrieres-juridiques");
  });
});
