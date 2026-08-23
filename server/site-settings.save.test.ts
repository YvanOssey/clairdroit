import { afterEach, describe, expect, it, vi } from "vitest";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    upsertSiteSettings: vi.fn(async (values: typeof SITE_SETTINGS_DEFAULTS) => ({ id: 1, ...values, updatedAt: new Date() })),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

const adminContext: TrpcContext = {
  user: {
    id: 42,
    openId: "test-admin",
    email: "admin@example.com",
    name: "Rédaction",
    loginMethod: "test",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("site settings editorial content", () => {
  it("accepts and returns all page content through the protected save procedure", async () => {
    const { appRouter } = await import("./routers");
    const input = structuredClone(SITE_SETTINGS_DEFAULTS);
    input.pageContent.about.titleMain = "Comprendre le droit";
    const result = await appRouter.createCaller(adminContext).site.updateSettings(input);

    expect(result.pageContent.about.titleMain).toBe("Comprendre le droit");
    expect(result.pageContent.contact.email).toContain("@");
    expect(result.pageContent.featured.emptyTitle).toBeTruthy();
  });
});
