import { describe, expect, it } from "vitest";

const resendApiKey = process.env.RESEND_API_KEY;

describe("Resend credentials", () => {
  it.skipIf(!resendApiKey || process.env.RUN_RESEND_E2E !== "1")("accepts the configured API key", async () => {
    const response = await fetch("https://api.resend.com/domains", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type") ?? "").toContain("application/json");
  }, 15000);
});
