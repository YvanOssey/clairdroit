import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  insertContactMessage: vi.fn().mockResolvedValue({ id: 101 }),
  insertNewsletterSubscriber: vi.fn().mockResolvedValue({ id: 202 }),
  sendNotificationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    insertContactMessage: mocks.insertContactMessage,
    insertNewsletterSubscriber: mocks.insertNewsletterSubscriber,
  };
});

vi.mock("./email", () => ({
  emailText: (value: string) => value,
  sendNotificationEmail: mocks.sendNotificationEmail,
}));

import { appRouter } from "./routers";

const caller = () => appRouter.createCaller({
  user: null,
  req: { protocol: "https", headers: { host: "clairdroit.example" } } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("protection honeypot des formulaires publics", () => {
  it("ignore un contact dont le champ honeypot est rempli", async () => {
    mocks.insertContactMessage.mockClear();
    mocks.sendNotificationEmail.mockClear();

    const result = await caller().contact.submit({
      name: "Visiteur légitime",
      email: "lecteur@example.com",
      subject: "Une question",
      message: "Voici un message de test suffisamment long.",
      website: "https://robot.example",
    });

    expect(result).toEqual({ success: true, id: undefined });
    expect(mocks.insertContactMessage).not.toHaveBeenCalled();
    expect(mocks.sendNotificationEmail).not.toHaveBeenCalled();
  });

  it("ignore une inscription newsletter dont le champ honeypot est rempli", async () => {
    mocks.insertNewsletterSubscriber.mockClear();
    mocks.sendNotificationEmail.mockClear();

    const result = await caller().newsletter.subscribe({
      email: "lecteur@example.com",
      website: "robot rempli",
    });

    expect(result).toEqual({ success: true, id: undefined });
    expect(mocks.insertNewsletterSubscriber).not.toHaveBeenCalled();
    expect(mocks.sendNotificationEmail).not.toHaveBeenCalled();
  });

  it("conserve l’enregistrement d’un contact légitime", async () => {
    mocks.insertContactMessage.mockClear();
    mocks.sendNotificationEmail.mockClear();

    const result = await caller().contact.submit({
      name: "Visiteur légitime",
      email: "lecteur@example.com",
      subject: "Une question",
      message: "Voici un message de test suffisamment long.",
    });

    expect(result.success).toBe(true);
    expect(mocks.insertContactMessage).toHaveBeenCalledWith({
      name: "Visiteur légitime",
      email: "lecteur@example.com",
      subject: "Une question",
      message: "Voici un message de test suffisamment long.",
    });
  });

  it("conserve l’inscription newsletter légitime", async () => {
    mocks.insertNewsletterSubscriber.mockClear();
    mocks.sendNotificationEmail.mockClear();

    const result = await caller().newsletter.subscribe({ email: "lecteur@example.com" });

    expect(result.success).toBe(true);
    expect(mocks.insertNewsletterSubscriber).toHaveBeenCalledWith("lecteur@example.com");
  });
});
