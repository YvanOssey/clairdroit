import { afterEach, describe, expect, it } from "vitest";
import { jwtVerify } from "jose";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";

const originalCookieSecret = ENV.cookieSecret;

afterEach(() => {
  ENV.cookieSecret = originalCookieSecret;
});

describe("signature de session", () => {
  it("signe et vérifie une session avec Web Crypto", async () => {
    ENV.cookieSecret = "test-session-secret-avec-au-moins-trente-deux-caracteres";

    const token = await sdk.signSession({
      openId: "email:corinnethio52@gmail.com",
      appId: "clairdroit-test",
      name: "Corinne Thio",
    });

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(ENV.cookieSecret),
      { algorithms: ["HS256"] },
    );

    expect(payload.openId).toBe("email:corinnethio52@gmail.com");
    expect(payload.appId).toBe("clairdroit-test");
    expect(payload.name).toBe("Corinne Thio");
  });
});
