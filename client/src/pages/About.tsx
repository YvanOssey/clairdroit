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
    pageContent:
      remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent,
  };
  const about = settings.pageContent.about;
  const biography = about.biography
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);
  const photoUrl = about.photoUrl;

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container py-16 md:py-24">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-12 bg-[#b86e4b]" />
            <span className="eyebrow">{about.eyebrow}</span>
          </div>
          <h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">
            {about.titleMain}
            <br />
            <em className="font-normal text-[#b86e4b]">{about.titleAccent}</em>
          </h1>
        </div>
      </section>

      <section className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-start md:py-24 lg:gap-24">
        <div className="max-w-2xl space-y-6 text-base leading-8 text-[#3f4e60]">
          <p className="eyebrow !leading-5">{about.eyebrow}</p>
          {biography.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 2 || index === 5 || index === 8 || index === 11
                  ? "font-display text-2xl leading-[1.25] tracking-[-0.02em] text-[#12243b] md:text-3xl"
                  : undefined
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <figure className="relative overflow-hidden bg-[#ece6da] md:sticky md:top-28">
          <div className="relative border-b border-[#b86e4b]/40 px-5 py-4">
            <p className="eyebrow">Portrait de Corinne Thio</p>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 border border-[#b86e4b]"
              aria-hidden="true"
            />
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Portrait de Corinne Thio"
                className="relative aspect-[3/4] w-full object-cover object-center"
              />
            ) : (
              <div className="relative flex aspect-[3/4] w-full items-center justify-center px-8 text-center text-sm leading-6 text-[#667384]">
                Le portrait de Corinne sera bientôt disponible.
              </div>
            )}
          </div>
          <figcaption className="relative bg-[#12243b] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[#f7f4ee]">
            Corinne Thio · Juriste & blogueuse
          </figcaption>
        </figure>
      </section>

      <section className="container flex flex-col gap-6 border-t border-[rgba(18,36,59,0.14)] py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-3">{about.ctaEyebrow}</p>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            {about.ctaTitle}
          </h2>
        </div>
        <Link
          href="/analyses-juridiques"
          className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]"
        >
          {about.ctaLabel} <ArrowUpRight size={16} />
        </Link>
      </section>
    </PageShell>
  );
}
