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
import {
  getSiteSettings,
  getUserByEmail,
  getArticleById,
  getPublishedArticleBySlug,
  insertArticle,
  insertContactMessage,
  insertNewsletterSubscriber,
  listAdminArticles,
  listContactMessages,
  listNewsletterSubscribers,
  listPublishedArticles,
  updateArticle,
  updateContactMessageStatus,
  upsertSiteSettings,
  upsertUser,
} from "./db";
import { hashPassword, verifyPassword } from "./auth/password";
import { storagePut } from "./storage";
import { emailText, sendNotificationEmail } from "./email";

const siteSettingsInput = z.object({
  siteName: z.string().trim().min(1).max(120),
  siteTagline: z.string().trim().min(1).max(180),
  logoUrl: z.string().trim().max(2000),
  navHomeLabel: z.string().trim().min(1).max(80),
  navArticlesLabel: z.string().trim().min(1).max(80),
  navCategoriesLabel: z.string().trim().min(1).max(80),
  navAboutLabel: z.string().trim().min(1).max(80),
  navCareersLabel: z.string().trim().min(1).max(80),
  navContactLabel: z.string().trim().min(1).max(80),
  homeEyebrow: z.string().trim().min(1).max(180),
  homeTitleMain: z.string().trim().min(1).max(180),
  homeTitleAccent: z.string().trim().max(180),
  homeTitleEnd: z.string().trim().max(180),
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
  pageContent: z.object({
    about: z.object({
      eyebrow: z.string().trim().min(1).max(180), titleMain: z.string().trim().min(1).max(180), titleAccent: z.string().trim().min(1).max(180), intro: z.string().trim().min(1).max(1000), intentionEyebrow: z.string().trim().min(1).max(180), intentionTitleMain: z.string().trim().min(1).max(180), intentionTitleAccent: z.string().trim().min(1).max(180), paragraphOne: z.string().trim().min(1).max(5000), paragraphTwo: z.string().trim().min(1).max(5000), quote: z.string().trim().min(1).max(500), quoteAttribution: z.string().trim().min(1).max(180), principlesEyebrow: z.string().trim().min(1).max(180), principleOneTitle: z.string().trim().min(1).max(120), principleOneBody: z.string().trim().min(1).max(1000), principleTwoTitle: z.string().trim().min(1).max(120), principleTwoBody: z.string().trim().min(1).max(1000), principleThreeTitle: z.string().trim().min(1).max(120), principleThreeBody: z.string().trim().min(1).max(1000), ctaEyebrow: z.string().trim().min(1).max(180), ctaTitle: z.string().trim().min(1).max(180), ctaLabel: z.string().trim().min(1).max(120), photoUrl: z.string().trim().max(2000),
    }),
    featured: z.object({
      eyebrow: z.string().trim().min(1).max(180), titleMain: z.string().trim().min(1).max(180), titleEnd: z.string().trim().min(1).max(180), description: z.string().trim().min(1).max(1000), quote: z.string().trim().min(1).max(500), detail: z.string().trim().min(1).max(1000), linkLabel: z.string().trim().min(1).max(120), emptyEyebrow: z.string().trim().min(1).max(180), emptyTitle: z.string().trim().min(1).max(300), emptyDescription: z.string().trim().min(1).max(1000),
    }),
    decryptions: z.object({
      eyebrow: z.string().trim().min(1).max(180), titleMain: z.string().trim().min(1).max(180), titleAccent: z.string().trim().min(1).max(180), description: z.string().trim().min(1).max(1000), filterEyebrow: z.string().trim().min(1).max(180), emptyEyebrow: z.string().trim().min(1).max(180), emptyTitle: z.string().trim().min(1).max(300), emptyDescription: z.string().trim().min(1).max(1000),
    }),
    rubrics: z.object({
      eyebrow: z.string().trim().min(1).max(180), titleMain: z.string().trim().min(1).max(180), titleAccent: z.string().trim().min(1).max(180), intro: z.string().trim().min(1).max(1000), selectionEyebrow: z.string().trim().min(1).max(180), selectionTitle: z.string().trim().min(1).max(180), emptyEyebrow: z.string().trim().min(1).max(180), emptyTitle: z.string().trim().min(1).max(300),
    }),
    contact: z.object({
      eyebrow: z.string().trim().min(1).max(180), titleMain: z.string().trim().min(1).max(180), titleAccent: z.string().trim().min(1).max(180), description: z.string().trim().min(1).max(1200), detailsEyebrow: z.string().trim().min(1).max(180), email: z.string().trim().email().max(180), responseNote: z.string().trim().min(1).max(300), location: z.string().trim().min(1).max(180), locationNote: z.string().trim().min(1).max(300), disclaimer: z.string().trim().min(1).max(1000), aboutLinkLabel: z.string().trim().min(1).max(180),
    }),
  }),
});

const articleInput = z.object({
  title: z.string().trim().min(3).max(255),
  excerpt: z.string().trim().min(10),
  content: z.string().trim().min(20),
  category: z.string().trim().min(2).max(120),
  editorialSection: z.enum(["actualite", "vulgarisation", "analyses", "carrieres"]),
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

async function notifyWithoutBlocking(payload: Parameters<typeof sendNotificationEmail>[0]) {
  try {
    await sendNotificationEmail(payload);
  } catch (error) {
    console.warn("[Email] Notification non bloquante échouée après sauvegarde :", error);
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, sameSite: "lax", maxAge: -1 });
      return { success: true } as const;
    }),
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1) })).mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const existing = await getUserByEmail(email);
      const configuredPasswords = new Map([
        [ENV.adminEmailYvan, ENV.adminPasswordYvan],
        [ENV.adminEmailThio, ENV.adminPasswordThio],
      ]);
      const isAllowedAdmin =
        email === ENV.adminEmailYvan || email === ENV.adminEmailThio;
      const configuredPassword = configuredPasswords.get(email);

      if (!isAllowedAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email ou mot de passe incorrect.",
        });
      }

      if (existing?.passwordHash) {
        if (!verifyPassword(input.password, existing.passwordHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
        }
      } else {
        if (!configuredPassword || !safeEqual(input.password, configuredPassword)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
        }
      }

      const passwordHash = existing?.passwordHash ?? hashPassword(input.password);
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
  contact: router({
    submit: publicProcedure.input(z.object({
      name: z.string().trim().min(2).max(160),
      email: z.string().trim().email().max(320),
      subject: z.string().trim().min(2).max(255),
      message: z.string().trim().min(10).max(10000),
    })).mutation(async ({ input }) => {
      const saved = await insertContactMessage(input);
      await notifyWithoutBlocking({
        subject: `Nouveau message — ${input.subject}`,
        replyTo: input.email,
        text: `Nouveau message reçu sur Droit de regard.\n\nNom : ${input.name}\nEmail : ${input.email}\nObjet : ${input.subject}\n\n${input.message}`,
        html: `<h2>Nouveau message reçu sur Droit de regard</h2><p><strong>Nom :</strong> ${emailText(input.name)}</p><p><strong>Email :</strong> ${emailText(input.email)}</p><p><strong>Objet :</strong> ${emailText(input.subject)}</p><p>${emailText(input.message).replace(/\n/g, "<br />")}</p>`,
      });
      return { success: true, id: saved?.id } as const;
    }),
    adminList: adminProcedure.query(() => listContactMessages()),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "read", "archived"]) })).mutation(({ input }) => updateContactMessageStatus(input.id, input.status)),
  }),
  newsletter: router({
    subscribe: publicProcedure.input(z.object({ email: z.string().trim().email().max(320) })).mutation(async ({ input }) => {
      const subscriber = await insertNewsletterSubscriber(input.email);
      await notifyWithoutBlocking({
        subject: "Nouvelle inscription à la newsletter",
        replyTo: input.email,
        text: `Nouvelle inscription à la newsletter de Droit de regard.\n\nEmail : ${input.email}`,
        html: `<h2>Nouvelle inscription à la newsletter</h2><p><strong>Email :</strong> ${emailText(input.email)}</p>`,
      });
      return { success: true, id: subscriber?.id } as const;
    }),
    adminList: adminProcedure.query(() => listNewsletterSubscribers()),
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
