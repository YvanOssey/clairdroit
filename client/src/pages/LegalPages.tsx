import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

function LegalHeader({ eyebrow, title, intro, draftNotice }: { eyebrow: string; title: string; intro: string; draftNotice: string }) {
  return <header className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]"><div className="container max-w-4xl py-16 md:py-24"><Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Retour à l’accueil</Link><p className="eyebrow mb-5">{eyebrow}</p><h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#12243b] md:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-base leading-8 text-[#536174]">{intro}</p><p className="mt-8 border-l-2 border-[#b86e4b] bg-[#f7f4ee] px-5 py-4 text-sm leading-6 text-[#667384]"><strong className="text-[#12243b]">À relire avant publication définitive :</strong> {draftNotice}</p></div></header>;
}

function LegalSection({ title, body }: { title: string; body: string }) {
  return <section className="border-t border-[rgba(18,36,59,0.14)] pt-6"><h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#12243b]">{title}</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#536174]">{body}</p></section>;
}

export function LegalNotice() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const content = remoteSettings?.pageContent?.legalNotice ?? SITE_SETTINGS_DEFAULTS.pageContent.legalNotice;
  const contactEmail = remoteSettings?.pageContent?.contact?.email ?? SITE_SETTINGS_DEFAULTS.pageContent.contact.email;
  return <PageShell><LegalHeader eyebrow={content.eyebrow} title={content.title} intro={content.intro} draftNotice={content.draftNotice} /><div className="container max-w-4xl space-y-12 py-14 md:py-20"><LegalSection title={content.editorTitle} body={content.editorBody} /><LegalSection title={content.activityTitle} body={content.activityBody} /><LegalSection title={content.hostingTitle} body={content.hostingBody} /><LegalSection title={content.rightsTitle} body={content.rightsBody} /><LegalSection title={content.contactTitle} body={content.contactBody} /><div className="flex flex-wrap gap-4 border-t border-[rgba(18,36,59,0.14)] pt-8"><Link href="/politique-confidentialite" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f7f4ee] transition hover:bg-[#b86e4b]">Voir la politique de confidentialité <ArrowLeft className="rotate-180" size={15} /></Link><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 border border-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee]"><Mail size={15} /> Écrire à ClairDroit</a></div></div></PageShell>;
}

export function PrivacyPolicy() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const content = remoteSettings?.pageContent?.privacyPolicy ?? SITE_SETTINGS_DEFAULTS.pageContent.privacyPolicy;
  const contactEmail = remoteSettings?.pageContent?.contact?.email ?? SITE_SETTINGS_DEFAULTS.pageContent.contact.email;
  return <PageShell><LegalHeader eyebrow={content.eyebrow} title={content.title} intro={content.intro} draftNotice={content.draftNotice} /><div className="container max-w-4xl space-y-12 py-14 md:py-20"><LegalSection title={content.controllerTitle} body={content.controllerBody} /><LegalSection title={content.dataTitle} body={content.dataBody} /><LegalSection title={content.purposesTitle} body={content.purposesBody} /><LegalSection title={content.retentionTitle} body={content.retentionBody} /><LegalSection title={content.requestsTitle} body={content.requestsBody} /><LegalSection title={content.cookiesTitle} body={content.cookiesBody} /><div className="flex flex-wrap gap-4 border-t border-[rgba(18,36,59,0.14)] pt-8"><Link href="/mentions-legales" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f7f4ee] transition hover:bg-[#b86e4b]">Voir les mentions légales <ArrowLeft className="rotate-180" size={15} /></Link><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 border border-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee]"><Mail size={15} /> Poser une question</a></div></div></PageShell>;
}
