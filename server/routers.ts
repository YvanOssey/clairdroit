/* Administration éditoriale : procédures publiques limitées aux publications et mutations réservées aux administrateurs. */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getArticleById, getPublishedArticleBySlug, insertArticle, listAdminArticles, listPublishedArticles, updateArticle } from "./db";
import { storagePut } from "./storage";

const articleInput = z.object({
  title: z.string().trim().min(3).max(255),
  excerpt: z.string().trim().min(10),
  content: z.string().trim().min(20),
  category: z.string().trim().min(2).max(120),
  author: z.string().trim().min(2).max(160),
  coverImage: z.string().trim().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180) || `article-${Date.now()}`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  articles: router({
    published: publicProcedure.query(() => listPublishedArticles()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => getPublishedArticleBySlug(input.slug)),
    adminList: adminProcedure.query(() => listAdminArticles()),
    adminById: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getArticleById(input.id)),
    uploadImage: adminProcedure.input(z.object({ fileName: z.string().trim().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]), data: z.string().min(1).max(8_500_000) })).mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(input.data, "base64");
      if (buffer.byteLength > 6_000_000) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "L’image ne doit pas dépasser 6 Mo." });
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
      return storagePut(`${ctx.user.id}-editorial/${Date.now()}-${safeName}`, buffer, input.contentType);
    }),
    create: adminProcedure.input(articleInput).mutation(async ({ input, ctx }) => {
      const baseSlug = slugify(input.title);
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      const article = await insertArticle({
        ...input,
        slug,
        coverImage: input.coverImage || null,
        publishedAt: input.status === "published" ? new Date() : null,
        authorId: ctx.user.id,
      });
      return article;
    }),
    update: adminProcedure.input(articleInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      const existing = await getArticleById(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Article introuvable" });
      const { id, ...values } = input;
      const nextStatus = values.status;
      const updated = await updateArticle(id, {
        ...values,
        coverImage: values.coverImage || null,
        publishedAt: nextStatus === "published" ? existing.publishedAt ?? new Date() : null,
      });
      return updated;
    }),
  }),
});

export type AppRouter = typeof appRouter;
