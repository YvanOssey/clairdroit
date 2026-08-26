import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getArticleById: vi.fn(),
  trashArticle: vi.fn(),
  restoreArticle: vi.fn(),
  purgeArticle: vi.fn(),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    getArticleById: mocks.getArticleById,
    trashArticle: mocks.trashArticle,
    restoreArticle: mocks.restoreArticle,
    purgeArticle: mocks.purgeArticle,
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

const article = { id: 12, title: "Article à protéger", status: "published" as const };

describe("corbeille des articles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("demande la phrase exacte avant de déplacer un article", async () => {
    mocks.getArticleById.mockResolvedValueOnce(article);
    const caller = appRouter.createCaller(adminContext());

    await expect(caller.articles.trash({ id: article.id, confirmation: "SUPPRIMER" as never })).rejects.toThrow();
    expect(mocks.trashArticle).not.toHaveBeenCalled();
  });

  it("déplace un article vers la corbeille avec la confirmation attendue", async () => {
    const trashed = { ...article, status: "trashed" as const, publishedAt: null };
    mocks.getArticleById.mockResolvedValueOnce(article);
    mocks.trashArticle.mockResolvedValueOnce(trashed);
    const caller = appRouter.createCaller(adminContext());

    const result = await caller.articles.trash({ id: article.id, confirmation: "CORBEILLE" });

    expect(result?.status).toBe("trashed");
    expect(mocks.trashArticle).toHaveBeenCalledWith(article.id);
  });

  it("restaure uniquement un article déjà dans la corbeille", async () => {
    const trashed = { ...article, status: "trashed" as const };
    mocks.getArticleById.mockResolvedValueOnce(trashed);
    mocks.restoreArticle.mockResolvedValueOnce({ ...trashed, status: "draft" as const });
    const caller = appRouter.createCaller(adminContext());

    const result = await caller.articles.restore({ id: article.id });

    expect(result?.status).toBe("draft");
    expect(mocks.restoreArticle).toHaveBeenCalledWith(article.id);
  });

  it("refuse la purge d’un article qui n’est pas dans la corbeille", async () => {
    mocks.getArticleById.mockResolvedValueOnce(article);
    const caller = appRouter.createCaller(adminContext());

    await expect(caller.articles.purge({ id: article.id, confirmation: "SUPPRIMER DÉFINITIVEMENT" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(mocks.purgeArticle).not.toHaveBeenCalled();
  });

  it("autorise la purge uniquement depuis la corbeille avec la phrase complète", async () => {
    mocks.getArticleById.mockResolvedValueOnce({ ...article, status: "trashed" as const });
    const caller = appRouter.createCaller(adminContext());

    const result = await caller.articles.purge({ id: article.id, confirmation: "SUPPRIMER DÉFINITIVEMENT" });

    expect(result.success).toBe(true);
    expect(mocks.purgeArticle).toHaveBeenCalledWith(article.id);
  });
});
