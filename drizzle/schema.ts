import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: text("passwordHash"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const articleStatus = ["draft", "published", "archived"] as const;

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  author: varchar("author", { length: 160 }).notNull(),
  coverImage: text("coverImage"),
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  status: mysqlEnum("status", articleStatus).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  authorId: int("authorId").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").primaryKey(),
  siteName: varchar("siteName", { length: 120 }).notNull(),
  siteTagline: varchar("siteTagline", { length: 180 }).notNull(),
  logoUrl: text("logoUrl"),
  navHomeLabel: varchar("navHomeLabel", { length: 80 }).notNull(),
  navArticlesLabel: varchar("navArticlesLabel", { length: 80 }).notNull(),
  navCategoriesLabel: varchar("navCategoriesLabel", { length: 80 }).notNull(),
  navAboutLabel: varchar("navAboutLabel", { length: 80 }).notNull(),
  navContactLabel: varchar("navContactLabel", { length: 80 }).notNull(),
  homeEyebrow: varchar("homeEyebrow", { length: 180 }).notNull(),
  homeTitleMain: varchar("homeTitleMain", { length: 180 }).notNull(),
  homeTitleAccent: varchar("homeTitleAccent", { length: 180 }).notNull(),
  homeTitleEnd: varchar("homeTitleEnd", { length: 180 }).notNull(),
  homeDescription: text("homeDescription").notNull(),
  homePrimaryCta: varchar("homePrimaryCta", { length: 120 }).notNull(),
  homeSecondaryCta: varchar("homeSecondaryCta", { length: 120 }).notNull(),
  footerDescription: text("footerDescription").notNull(),
  footerKicker: varchar("footerKicker", { length: 180 }).notNull(),
  newsletterTitle: varchar("newsletterTitle", { length: 120 }).notNull(),
  newsletterDescription: text("newsletterDescription").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;