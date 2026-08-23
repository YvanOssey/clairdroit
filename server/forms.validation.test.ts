import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const contextFor = (role: "admin" | "user"): TrpcContext => ({
  user: {
    id: 42,
    openId: `forms-${role}`,
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

describe("public forms validation and permissions", () => {
  it("rejects an invalid contact message before persistence", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.contact.submit({ name: "A", email: "invalid", subject: "", message: "short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects an invalid newsletter email before persistence", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.newsletter.subscribe({ email: "invalid" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects collected contact messages and subscribers", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.contact.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.newsletter.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
