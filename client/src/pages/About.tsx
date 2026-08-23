/* Direction « Cabinet éditorial » : page manifeste, colonne de texte lisible et détails de marge qui donnent une voix à la revue. */
import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function About() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = { ...SITE_SETTINGS_DEFAULTS, ...remoteSettings, pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent };
  const { about } = settings.pageContent;
  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24"><div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">{about.eyebrow}</span></div><h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">{about.titleMain}<br /><em className="font-normal text-[#b86e4b]">{about.titleAccent}</em></h1></div><p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">{about.intro}</p></div>
      </section>

      <section className="container grid gap-14 py-16 md:grid-cols-[1fr_300px] md:py-24 lg:gap-24"><div className="max-w-2xl"><p className="eyebrow mb-5">{about.intentionEyebrow}</p><h2 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em]">{about.intentionTitleMain}<br />plus <em className="font-normal text-[#b86e4b]">{about.intentionTitleAccent}</em></h2><div className="mt-8 space-y-6 text-base leading-8 text-[#3f4e60]"><p>{about.paragraphOne}</p><p>{about.paragraphTwo}</p></div></div><aside className="border-t border-[#b86e4b] pt-4"><Quote size={23} className="mb-5 text-[#b86e4b]" /><p className="font-display text-2xl leading-[1.15]">{about.quote}</p><p className="mt-5 text-xs uppercase tracking-[0.12em] text-[#667384]">{about.quoteAttribution}</p></aside></section>

      <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#12243b] text-[#f7f4ee]"><div className="container grid gap-10 py-16 md:grid-cols-3 md:gap-8 md:py-20"><p className="sr-only">{about.principlesEyebrow}</p>{[{ number: "01", title: about.principleOneTitle, body: about.principleOneBody }, { number: "02", title: about.principleTwoTitle, body: about.principleTwoBody }, { number: "03", title: about.principleThreeTitle, body: about.principleThreeBody }].map((item) => <div key={item.number} className="border-t border-[#53647a] pt-4"><span className="font-display text-3xl text-[#d7a187]">{item.number}</span><h2 className="mt-6 font-display text-3xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#c6ccd4]">{item.body}</p></div>)}</div></section>

      <section className="container flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow mb-3">{about.ctaEyebrow}</p><h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">{about.ctaTitle}</h2></div><Link href="/articles" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]">{about.ctaLabel} <ArrowUpRight size={16} /></Link></section>
    </PageShell>
  );
}
