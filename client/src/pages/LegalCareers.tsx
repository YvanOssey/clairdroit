/* Conseils de parcours et de carrière pour les métiers du droit. */
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function LegalCareers() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const careers = (remoteSettings ?? SITE_SETTINGS_DEFAULTS).pageContent
    .careersPage;
  const subjects = [
    {
      number: "01",
      title: careers.subjectOneTitle,
      body: careers.subjectOneBody,
    },
    {
      number: "02",
      title: careers.subjectTwoTitle,
      body: careers.subjectTwoBody,
    },
    {
      number: "03",
      title: careers.subjectThreeTitle,
      body: careers.subjectThreeBody,
    },
  ];
  const guidanceItems = careers.guidanceItems
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-12 bg-[#b86e4b]" />
              <span className="eyebrow">{careers.eyebrow}</span>
            </div>
            <h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">
              {careers.titleMain}
              <br />
              <em className="font-normal text-[#b86e4b]">
                {careers.titleAccent}
              </em>
            </h1>
          </div>
          <p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">
            {careers.description}
          </p>
        </div>
      </section>

      <section className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_300px] md:py-24 lg:gap-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{careers.overviewEyebrow}</p>
          <h2 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em]">
            {careers.overviewTitleMain}
            <br />
            <em className="font-normal text-[#b86e4b]">
              {careers.overviewTitleAccent}
            </em>
          </h2>
          <p className="mt-8 text-base leading-8 text-[#3f4e60]">
            {careers.overviewBody}
          </p>
        </div>

        <aside className="border-t border-[#b86e4b] pt-4">
          <BriefcaseBusiness size={23} className="mb-5 text-[#b86e4b]" />
          <p className="text-sm leading-7 text-[#536174]">
            {careers.asideBody}
          </p>
        </aside>
      </section>

      <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#12243b] text-[#f7f4ee]">
        <div className="container grid gap-6 py-16 md:grid-cols-3 md:gap-8 md:py-20">
          {subjects.map(subject => (
            <article
              key={subject.number}
              className="border-t border-[#53647a] pt-4"
            >
              <span className="font-display text-3xl text-[#d7a187]">
                {subject.number}
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold">
                {subject.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#c6ccd4]">
                {subject.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-24">
        <div>
          <p className="eyebrow mb-5">{careers.guidanceEyebrow}</p>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            {careers.guidanceTitle}
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#536174]">
          {guidanceItems.map(item => (
            <p key={item} className="flex items-start gap-3">
              <CheckCircle2
                size={17}
                className="mt-1 shrink-0 text-[#b86e4b]"
              />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="container flex flex-col gap-6 pb-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-[#667384]">
          {careers.ctaText}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]"
        >
          {careers.ctaLabel} <ArrowUpRight size={16} />
        </Link>
      </section>
    </PageShell>
  );
}
