import { describe, expect, it } from "vitest";

describe("admin password configuration", () => {
  it("has both administrator password secrets available", () => {
    expect(process.env.ADMIN_PASSWORD_YVAN).toBeTruthy();
    expect(process.env.ADMIN_PASSWORD_THIO).toBeTruthy();
  });
});
