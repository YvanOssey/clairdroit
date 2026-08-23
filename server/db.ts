/* Administration éditoriale : accès aux articles centralisé ici pour garder les procédures tRPC fines et testables. */
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertArticle, InsertSiteSettings, InsertUser, articles, siteSettings, users } from "../drizzle/schema";
import { SITE_SETTINGS_DEFAULTS, type PageContentValues, type SocialLink } from "../shared/siteSettings";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).where(eq(articles.status, "published")).orderBy(desc(articles.publishedAt), desc(articles.createdAt));
}

export async function getPublishedArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  const article = result[0];
  return article?.status === "published" ? article : undefined;
}

export async function listAdminArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(articles).orderBy(desc(articles.updatedAt), desc(articles.createdAt));
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result[0];
}

export async function insertArticle(article: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(articles).values(article);
  return getArticleById(Number(result[0].insertId));
}

export async function updateArticle(id: number, values: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(articles).set(values).where(eq(articles.id, id));
  return getArticleById(id);
}

function parseSocialLinks(value: string | null | undefined): SocialLink[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => ({ ...item, icon: item.icon ?? item.platform })) as SocialLink[] : [];
  } catch {
    return [];
  }
}

export function serializePageContent(value: PageContentValues): string {
  return JSON.stringify(value);
}

export function parsePageContent(value: string | null | undefined): PageContentValues {
  const fallback = SITE_SETTINGS_DEFAULTS.pageContent;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as Partial<PageContentValues>;
    return {
      ...fallback,
      ...parsed,
      about: { ...fallback.about, ...(parsed.about ?? {}) },
      featured: { ...fallback.featured, ...(parsed.featured ?? {}) },
      decryptions: { ...fallback.decryptions, ...(parsed.decryptions ?? {}) },
      rubrics: { ...fallback.rubrics, ...(parsed.rubrics ?? {}) },
      contact: { ...fallback.contact, ...(parsed.contact ?? {}) },
    };
  } catch {
    return fallback;
  }
}

function formatSettings(row: typeof siteSettings.$inferSelect) {
  return { ...SITE_SETTINGS_DEFAULTS, ...row, logoUrl: row.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl, socialLinks: parseSocialLinks(row.socialLinks), pageContent: parsePageContent(row.pageContent) };
}

export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return { id: 1, ...SITE_SETTINGS_DEFAULTS, updatedAt: new Date() };
  const result = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return result[0] ? formatSettings(result[0]) : { id: 1, ...SITE_SETTINGS_DEFAULTS, updatedAt: new Date() };
}

export async function upsertSiteSettings(values: Omit<InsertSiteSettings, "id" | "updatedAt" | "socialLinks" | "pageContent"> & { socialLinks: SocialLink[]; pageContent: PageContentValues }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const databaseValues = { ...values, socialLinks: JSON.stringify(values.socialLinks), pageContent: serializePageContent(values.pageContent) };
  await db.insert(siteSettings).values({ id: 1, ...databaseValues }).onDuplicateKeyUpdate({ set: databaseValues });
  return getSiteSettings();
}
