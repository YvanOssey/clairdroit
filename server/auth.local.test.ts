import { afterEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@shared/const";
import type { TrpcContext } from "./_core/context";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("password authentication", () => {
  it("creates a session cookie that authenticates as admin", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ADMIN_PASSWORD_YVAN", "password-yvan-test");
    vi.stubEnv("ADMIN_PASSWORD_THIO", "password-thio-test");
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

    const result = await appRouter.createCaller(ctx).auth.login({ email: "yvanossey6@gmail.com", password: "password-yvan-test" });
    expect(result).toEqual({ success: true });
    expect(cookies[0]).toMatch(new RegExp(`^${COOKIE_NAME}=`));

    const { sdk } = await import("./_core/sdk");
    const user = await sdk.authenticateRequest({ protocol: "http", headers: { cookie: cookies[0] } } as TrpcContext["req"]);
    expect(user.role).toBe("admin");
    expect(user.loginMethod).toBe("password");
    expect(user.email).toBe("yvanossey6@gmail.com");
  });
});
