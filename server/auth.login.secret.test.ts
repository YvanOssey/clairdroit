import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUserByEmail: vi.fn(),
  upsertUser: vi.fn().mockResolvedValue({}),
  signSession: vi.fn().mockResolvedValue("test-session-token"),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    getUserByEmail: mocks.getUserByEmail,
    upsertUser: mocks.upsertUser,
  };
});

vi.mock("./_core/sdk", () => ({
  sdk: {
    signSession: mocks.signSession,
  },
}));

import { appRouter } from "./routers";
import { ENV } from "./_core/env";
import { hashPassword } from "./auth/password";

const createCaller = () => {
  const cookie = vi.fn();
  const caller = appRouter.createCaller({
    req: { headers: {}, protocol: "http" } as never,
    res: { cookie } as never,
    user: null,
  });
  return { caller, cookie };
};

beforeEach(() => {
  mocks.getUserByEmail.mockReset();
  mocks.upsertUser.mockClear();
  mocks.signSession.mockClear();
});

describe("authentification persistante de l’administrateur", () => {
  it("initialise le compte avec le secret configuré", async () => {
    const password = "Initialisation-Test-2026";
    const originalConfiguredPassword = ENV.adminPasswordYvan;
    ENV.adminPasswordYvan = password;
    mocks.getUserByEmail.mockResolvedValueOnce(null);
    const { caller, cookie } = createCaller();

    const result = await caller.auth.login({
      email: ENV.adminEmailYvan,
      password,
    });

    ENV.adminPasswordYvan = originalConfiguredPassword;
    expect(result.success).toBe(true);
    expect(cookie).toHaveBeenCalled();
    expect(mocks.upsertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: ENV.adminEmailYvan,
        passwordHash: expect.any(String),
        role: "admin",
      }),
    );
  });

  it("refuse un email absent de la liste blanche même avec un hachage existant", async () => {
    const password = "MotDePasseNonAutorise-2026";
    mocks.getUserByEmail.mockResolvedValueOnce({
      id: 2,
      email: "lecteur@example.com",
      passwordHash: hashPassword(password),
      role: "user",
      openId: "email:lecteur@example.com",
    });
    const { caller } = createCaller();

    await expect(
      caller.auth.login({
        email: "lecteur@example.com",
        password,
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("autorise la nouvelle adresse administrateur secondaire", async () => {
    const password = "MotDePasseSecondaire-2026";
    const originalConfiguredPassword = ENV.adminPasswordThio;
    ENV.adminPasswordThio = password;
    mocks.getUserByEmail.mockResolvedValueOnce(null);
    const { caller, cookie } = createCaller();

    const result = await caller.auth.login({
      email: "corinnethio52@gmail.com",
      password,
    });

    ENV.adminPasswordThio = originalConfiguredPassword;
    expect(result.success).toBe(true);
    expect(cookie).toHaveBeenCalled();
    expect(mocks.upsertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "corinnethio52@gmail.com",
        openId: "email:corinnethio52@gmail.com",
        role: "admin",
      }),
    );
  });

  it("refuse explicitement l’ancienne adresse secondaire", async () => {
    const { caller } = createCaller();

    await expect(
      caller.auth.login({
        email: "thiocorinne@gmail.com",
        password: "MotDePasseSecondaire-2026",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("utilise le hachage existant sans dépendre du secret d’initialisation", async () => {
    const password = "MotDePassePersistant-2026";
    const originalConfiguredPassword = ENV.adminPasswordYvan;
    ENV.adminPasswordYvan = "";
    mocks.getUserByEmail.mockResolvedValueOnce({
      id: 1,
      email: ENV.adminEmailYvan,
      passwordHash: hashPassword(password),
      role: "admin",
      openId: `email:${ENV.adminEmailYvan}`,
    });
    const { caller, cookie } = createCaller();

    const result = await caller.auth.login({
      email: ENV.adminEmailYvan,
      password,
    });

    ENV.adminPasswordYvan = originalConfiguredPassword;
    expect(result.success).toBe(true);
    expect(cookie).toHaveBeenCalled();
  });
});
