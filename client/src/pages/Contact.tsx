/* Direction « Cabinet éditorial » : formulaire bref, ton professionnel et signal cuivre pour guider sans surcharger. */
import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = { ...SITE_SETTINGS_DEFAULTS, ...remoteSettings, pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent };
  const { contact } = settings.pageContent;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    toast.success("Votre message est prêt à être transmis.");
  };

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]"><div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24"><div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">{contact.eyebrow}</span></div><h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">{contact.titleMain}<br /><em className="font-normal text-[#b86e4b]">{contact.titleAccent}</em></h1></div><p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">{contact.description}</p></div></section>
      <section className="container grid gap-14 py-16 md:grid-cols-[minmax(0,1fr)_300px] md:py-24 lg:gap-24"><form onSubmit={handleSubmit} className="max-w-2xl space-y-7"><div className="grid gap-7 sm:grid-cols-2"><label className="block"><span className="eyebrow mb-3 block">Votre nom</span><input required type="text" placeholder="Prénom Nom" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm text-[#12243b] placeholder:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none" /></label><label className="block"><span className="eyebrow mb-3 block">Votre email</span><input required type="email" placeholder="vous@email.fr" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm text-[#12243b] placeholder:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none" /></label></div><label className="block"><span className="eyebrow mb-3 block">Objet</span><input required type="text" placeholder="Une proposition, une question…" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm text-[#12243b] placeholder:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none" /></label><label className="block"><span className="eyebrow mb-3 block">Votre message</span><textarea required rows={6} placeholder="Dites-nous ce qui vous amène ici." className="w-full resize-y border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm leading-6 text-[#12243b] placeholder:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none" /></label><button type="submit" className="inline-flex items-center gap-3 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]">{sent ? "Message enregistré" : "Envoyer le message"} <ArrowUpRight size={16} /></button></form><aside className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">{contact.detailsEyebrow}</p><div className="space-y-5 text-sm leading-6 text-[#536174]"><p className="flex items-start gap-3"><Mail size={16} className="mt-1 shrink-0 text-[#b86e4b]" /><span>{contact.email}<br /><span className="text-xs text-[#8b929b]">{contact.responseNote}</span></span></p><p className="flex items-start gap-3"><MapPin size={16} className="mt-1 shrink-0 text-[#b86e4b]" /><span>{contact.location}<br /><span className="text-xs text-[#8b929b]">{contact.locationNote}</span></span></p></div><div className="mt-10 border-t border-[rgba(18,36,59,0.14)] pt-5"><p className="text-xs leading-5 text-[#667384]">{contact.disclaimer}</p><Link href="/a-propos" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">{contact.aboutLinkLabel} <ArrowUpRight size={15} /></Link></div></aside></section>
    </PageShell>
  );
}
