import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insertContactMessage: vi.fn().mockResolvedValue({ id: 11 }),
  insertNewsletterSubscriber: vi.fn().mockResolvedValue({ id: 22 }),
  getSiteSettings: vi.fn().mockResolvedValue({ logoUrl: "/manus-storage/logo-clairdroit.jpeg" }),
  sendNotificationEmail: vi.fn().mockRejectedValue(new Error("Unexpected token '<'")),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return {
    ...actual,
    insertContactMessage: mocks.insertContactMessage,
    insertNewsletterSubscriber: mocks.insertNewsletterSubscriber,
    getSiteSettings: mocks.getSiteSettings,
  };
});

vi.mock("./email", () => ({
  emailText: (value: string) => value,
  sendNotificationEmail: mocks.sendNotificationEmail,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: { host: "clairdroit.example" } } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("formulaires avec notification non bloquante", () => {
  beforeEach(() => {
    mocks.insertContactMessage.mockClear();
    mocks.insertNewsletterSubscriber.mockClear();
    mocks.sendNotificationEmail.mockClear();
    mocks.sendNotificationEmail.mockRejectedValue(new Error("Unexpected token '<'"));
  });

  it("retourne le succès du contact après sauvegarde même si Resend échoue", async () => {
    const result = await appRouter.createCaller(context).contact.submit({
      name: "Corinne Thio",
      email: "corinne@example.com",
      subject: "Question juridique",
      message: "Je souhaite recevoir une orientation générale.",
    });

    expect(result).toEqual({ success: true, id: 11 });
    expect(mocks.insertContactMessage).toHaveBeenCalledOnce();
    expect(mocks.sendNotificationEmail).toHaveBeenCalledOnce();
    expect(mocks.sendNotificationEmail).toHaveBeenCalledWith(expect.objectContaining({
      logoUrl: "https://clairdroit.example/manus-storage/logo-clairdroit.jpeg",
      text: expect.stringContaining("ClairDroit"),
    }));
  });

  it("retourne le succès de la newsletter après sauvegarde même si Resend échoue", async () => {
    const result = await appRouter.createCaller(context).newsletter.subscribe({
      email: "corinne@example.com",
    });

    expect(result).toEqual({ success: true, id: 22 });
    expect(mocks.insertNewsletterSubscriber).toHaveBeenCalledOnce();
    expect(mocks.sendNotificationEmail).toHaveBeenCalledOnce();
    expect(mocks.sendNotificationEmail).toHaveBeenCalledWith(expect.objectContaining({
      logoUrl: "https://clairdroit.example/manus-storage/logo-clairdroit.jpeg",
      subject: expect.stringContaining("ClairDroit"),
      text: expect.stringContaining("ClairDroit"),
    }));
  });
});
