/* Administration éditoriale : test de garde de rôle avant toute opération de persistance. */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const contextFor = (
  role: "admin" | "user",
  address = "203.0.113.10"
): TrpcContext => ({
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
  req: {
    protocol: "https",
    headers: { "x-forwarded-for": address },
  } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("articles administration permissions", () => {
  it("refuses admin article listing for a regular user", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.articles.adminList()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("allows the admin procedure to pass the role guard", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const result = await caller.articles.adminList();
    expect(Array.isArray(result)).toBe(true);
  });

  it("refuses an email outside the administrator allowlist", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(
      caller.auth.login({ email: "unknown@example.com", password: "test" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects an oversized image before storage upload", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    const oversizedData = Buffer.alloc(6_000_001).toString("base64");
    await expect(
      caller.articles.uploadImage({
        fileName: "large.jpg",
        contentType: "image/jpeg",
        data: oversizedData,
      })
    ).rejects.toMatchObject({ code: "PAYLOAD_TOO_LARGE" });
  });

  it("rejects an image whose binary signature does not match its declared type", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(
      caller.articles.uploadImage({
        fileName: "fake.jpg",
        contentType: "image/jpeg",
        data: Buffer.from("not-an-image").toString("base64"),
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("limits repeated login attempts from one address", async () => {
    const address = "198.51.100.44";
    const caller = appRouter.createCaller(contextFor("admin", address));
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        caller.auth.login({
          email: "unknown-rate-limit@example.com",
          password: "wrong-password",
        })
      ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    }
    await expect(
      caller.auth.login({
        email: "unknown-rate-limit@example.com",
        password: "wrong-password",
      })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});
