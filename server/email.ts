import { TRPCError } from "@trpc/server";
import { ENV } from "./_core/env";

export type NotificationEmail = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );

export async function sendNotificationEmail(email: NotificationEmail) {
  if (!ENV.resendApiKey || !ENV.emailFrom || !ENV.contactNotificationEmail) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "La configuration email Resend est incomplète.",
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.emailFrom,
      to: [ENV.contactNotificationEmail],
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.warn(`[Email] Resend rejected notification (${response.status})${detail ? `: ${detail}` : ""}`);
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Le message a été enregistré, mais la notification email n’a pas pu être envoyée.",
    });
  }

  return { delivered: true } as const;
}

export const emailText = escapeHtml;
