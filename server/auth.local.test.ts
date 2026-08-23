import { afterEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@shared/const";
import type { TrpcContext } from "./_core/context";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("local authentication", () => {
  it("creates a session cookie that authenticates as admin", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("LOCAL_AUTH_ENABLED", "true");
    vi.stubEnv("LOCAL_ADMIN_EMAIL", "admin@example.local");
    vi.stubEnv("LOCAL_ADMIN_PASSWORD", "local-secret");
    vi.stubEnv("JWT_SECRET", "test-jwt-secret");
    vi.stubEnv("VITE_APP_ID", "local-test-app");
    vi.resetModules();

    const { appRouter } = await import("./routers");
    const cookies: string[] = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "http", headers: {} } as TrpcContext["req"],
      res: { cookie: (name: string, value: string) => cookies.push(`${name}=${value}`) } as TrpcContext["res"],
    };

    const result = await appRouter.createCaller(ctx).auth.localLogin({ email: "admin@example.local", password: "local-secret" });
    expect(result).toEqual({ success: true });
    expect(cookies[0]).toMatch(new RegExp(`^${COOKIE_NAME}=`));

    const { sdk } = await import("./_core/sdk");
    const user = await sdk.authenticateRequest({ protocol: "http", headers: { cookie: cookies[0] } } as TrpcContext["req"]);
    expect(user.role).toBe("admin");
    expect(user.loginMethod).toBe("local");
  });
});
