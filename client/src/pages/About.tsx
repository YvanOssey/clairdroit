/* Page personnelle de ClairDroit : présentation de Corinne Thio et de sa démarche éditoriale. */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function About() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = {
    ...SITE_SETTINGS_DEFAULTS,
    ...remoteSettings,
    logoUrl: remoteSettings?.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl,
    socialLinks: remoteSettings?.socialLinks ?? SITE_SETTINGS_DEFAULTS.socialLinks,
    pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent,
  };
  const { about } = settings.pageContent;

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-12 bg-[#b86e4b]" />
              <span className="eyebrow">À propos de moi</span>
            </div>
            <h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">
              À propos
              <br />
              <em className="font-normal text-[#b86e4b]">de moi</em>
            </h1>
          </div>
          <p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">
            {about.intro}
          </p>
        </div>
      </section>

      <section className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-start md:py-24 lg:gap-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">Ma démarche</p>
          <h2 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em]">
            Rendre le droit
            <br />
            <em className="font-normal text-[#b86e4b]">plus clair.</em>
          </h2>
          <div className="mt-8 space-y-6 text-base leading-8 text-[#3f4e60]">
            <p>{about.paragraphOne}</p>
            <p>{about.paragraphTwo}</p>
          </div>
        </div>

        <figure className="relative overflow-hidden bg-[#ece6da]">
          <div className="absolute inset-0 translate-x-3 translate-y-3 border border-[#b86e4b]" aria-hidden="true" />
          <img
            src={about.photoUrl}
            alt="Portrait de Corinne Thio"
            className="relative aspect-[3/4] w-full object-cover object-center"
          />
          <figcaption className="relative bg-[#12243b] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[#f7f4ee]">
            Corinne Thio · Juriste & blogueuse
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#f7f4ee]">
        <div className="container grid gap-8 py-14 md:grid-cols-[180px_1fr] md:py-16">
          <p className="eyebrow">ClairDroit</p>
          <p className="max-w-3xl font-display text-3xl leading-[1.15] tracking-[-0.025em] text-[#12243b] md:text-4xl">
            Une information juridique accessible, exigeante et pensée pour la vie réelle.
          </p>
        </div>
      </section>

      <section className="container flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-3">Pour aller plus loin</p>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            Découvrir les analyses.
          </h2>
        </div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]"
        >
          Lire les articles <ArrowUpRight size={16} />
        </Link>
      </section>
    </PageShell>
  );
}
