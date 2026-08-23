/* Administration éditoriale : test de garde de rôle avant toute opération de persistance. */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const contextFor = (role: "admin" | "user"): TrpcContext => ({
  user: {
    id: 42,
    openId: `test-${role}`,
    email: `${role}@example.com`,
    name: role === "admin" ? "Rédaction" : "Lecteur",
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("articles administration permissions", () => {
  it("refuses admin article listing for a regular user", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.articles.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows the admin procedure to pass the role guard", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const result = await caller.articles.adminList();
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects an oversized image before storage upload", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const oversizedData = Buffer.alloc(6_000_001).toString("base64");
    await expect(caller.articles.uploadImage({ fileName: "large.jpg", contentType: "image/jpeg", data: oversizedData })).rejects.toMatchObject({ code: "PAYLOAD_TOO_LARGE" });
  });
});
