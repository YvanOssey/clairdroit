/* Administration éditoriale : procédures publiques limitées aux publications et mutations réservées aux administrateurs. */
import { timingSafeEqual } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getSiteSettings, getUserByEmail, getArticleById, getPublishedArticleBySlug, insertArticle, listAdminArticles, listPublishedArticles, updateArticle, upsertSiteSettings, upsertUser } from "./db";
import { hashPassword, verifyPassword } from "./auth/password";
import { storagePut } from "./storage";

const siteSettingsInput = z.object({
  siteName: z.string().trim().min(1).max(120),
  siteTagline: z.string().trim().min(1).max(180),
  logoUrl: z.string().trim().max(2000),
  navHomeLabel: z.string().trim().min(1).max(80),
  navArticlesLabel: z.string().trim().min(1).max(80),
  navCategoriesLabel: z.string().trim().min(1).max(80),
  navAboutLabel: z.string().trim().min(1).max(80),
  navContactLabel: z.string().trim().min(1).max(80),
  homeEyebrow: z.string().trim().min(1).max(180),
  homeTitleMain: z.string().trim().min(1).max(180),
  homeTitleAccent: z.string().trim().min(1).max(180),
  homeTitleEnd: z.string().trim().min(1).max(180),
  homeDescription: z.string().trim().min(1),
  homePrimaryCta: z.string().trim().min(1).max(120),
  homeSecondaryCta: z.string().trim().min(1).max(120),
  footerDescription: z.string().trim().min(1),
  footerKicker: z.string().trim().min(1).max(180),
  newsletterTitle: z.string().trim().min(1).max(120),
  newsletterDescription: z.string().trim().min(1),
  socialLinks: z.array(z.object({
    platform: z.enum(["linkedin", "facebook", "instagram", "youtube", "x", "tiktok", "github"]),
    label: z.string().trim().min(1).max(80),
    icon: z.enum(["linkedin", "facebook", "instagram", "youtube", "x", "tiktok", "github"]),
    url: z.string().trim().url().max(500),
    visible: z.boolean(),
  })).max(8),
});

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

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, sameSite: cookieOptions.sameSite, maxAge: -1 });
      return { success: true } as const;
    }),
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1) })).mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const configuredPasswords: Record<string, string> = { [ENV.adminEmailYvan]: ENV.adminPasswordYvan, [ENV.adminEmailThio]: ENV.adminPasswordThio };
      const configuredPassword = configuredPasswords[email];
      if (!configuredPassword) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      const existing = await getUserByEmail(email);
      if (existing?.passwordHash) {
        if (!verifyPassword(input.password, existing.passwordHash)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      } else if (!safeEqual(input.password, configuredPassword)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      }
      const passwordHash = existing?.passwordHash ?? hashPassword(configuredPassword);
      const openId = `email:${email}`;
      await upsertUser({ openId, email, name: existing?.name ?? email.split("@")[0], loginMethod: "password", passwordHash, role: "admin", lastSignedIn: new Date() });
      const token = await sdk.signSession({ openId, appId: ENV.appId || "blog-juridique", name: existing?.name ?? email });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, sameSite: "lax", maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),
  }),
  site: router({
    settings: publicProcedure.query(() => getSiteSettings()),
    updateSettings: adminProcedure.input(siteSettingsInput).mutation(({ input }) => upsertSiteSettings(input)),
  }),
  articles: router({
    published: publicProcedure.query(() => listPublishedArticles()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(({ input }) => getPublishedArticleBySlug(input.slug)),
    adminList: adminProcedure.query(() => listAdminArticles()),
    adminById: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getArticleById(input.id)),
    uploadImage: adminProcedure.input(z.object({ fileName: z.string().trim().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]), data: z.string().min(1).max(8_500_000) })).mutation(async ({ input, ctx }) => {
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
