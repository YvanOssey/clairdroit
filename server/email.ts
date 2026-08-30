import { TRPCError } from "@trpc/server";
import { ENV } from "./_core/env";

export type NotificationEmail = {
  subject: string;
  text: string;
  html: string;
  logoUrl?: string;
  replyTo?: string;
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    character =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character
  );

export async function sendNotificationEmail(email: NotificationEmail) {
  if (!ENV.resendApiKey || !ENV.emailFrom || !ENV.contactNotificationEmail) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "La configuration email Resend est incomplète.",
    });
  }

  const sender = ENV.emailFrom.includes("<")
    ? ENV.emailFrom
    : `ClairDroit <${ENV.emailFrom}>`;
  const logoBlock = email.logoUrl
    ? `<img src="${escapeHtml(email.logoUrl)}" alt="ClairDroit" width="112" style="display:block;width:112px;height:auto;border:0;outline:none;text-decoration:none;" />`
    : `<div style="font-family:Georgia,serif;font-size:28px;line-height:1;color:#14243d;">ClairDroit</div>`;
  const brandedHtml = `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f0e7;color:#14243d;font-family:Arial,Helvetica,sans-serif;"><div style="padding:32px 16px;"><div style="max-width:620px;margin:0 auto;background:#fffdf8;border:1px solid #ddd5c8;"><div style="padding:24px 28px;border-bottom:1px solid #ddd5c8;">${logoBlock}<p style="margin:14px 0 0;color:#9b654f;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Le droit clair pour tous !</p></div><div style="padding:28px;">${email.html}</div><div style="padding:20px 28px;border-top:1px solid #ddd5c8;color:#6f7480;font-size:12px;line-height:1.6;">Notification envoyée par ClairDroit.<br />Le droit clair pour tous !</div></div></div></body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [ENV.contactNotificationEmail],
      subject: email.subject,
      text: email.text,
      html: brandedHtml,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    await response.text().catch(() => "");
    console.warn(`[Email] Resend rejected notification (${response.status})`);
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message:
        "Le message a été enregistré, mais la notification email n’a pas pu être envoyée.",
    });
  }

  return { delivered: true } as const;
}

export const emailText = escapeHtml;
