import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

const biography = [
  "Passionnée par la transmission du savoir et convaincue que le droit ne doit pas rester enfermé dans les amphithéâtres ou les cabinets, j’ai créé ce blog avec l’idée de rendre le droit clair, accessible et utile au quotidien.",
  "Mon histoire avec le droit commence sur les bancs de l’université, où j’obtiens une licence en droit privé à l’Université Alassane Ouattara de Bouaké, avant d’obtenir par la suite un Master en fiscalité des entreprises à l’Institut Universitaire d’Abidjan. Très tôt, une question m’a interpellée : comment peut-on demander aux citoyens de respecter la loi, partant de l’adage « Nemo censetur ignorare legem », alors que beaucoup ne la comprennent pas ?",
  "C’est de cette réflexion qu’est né ce blog.",
  "À travers ClairDroit, je partage des articles qui expliquent simplement des notions juridiques souvent perçues comme complexes : contrats, procédures, droits du travail, obligations légales pour les entreprises… Mon objectif n’est pas seulement d’informer, mais d’aider chacun à mieux comprendre ses droits pour mieux les défendre.",
  "Le blog propose également des analyses juridiques et des articles scientifiques, destinés à approfondir certaines questions de droit, à analyser l’actualité juridique et à nourrir la réflexion autour des enjeux contemporains du droit.",
  "Mais mon engagement ne s’arrête pas à l’écriture.",
  "En parallèle de mes activités de juriste en entreprise et de consultante, j’accompagne des étudiants en droit dans la compréhension de la pratique juridique à travers des sessions de coaching. J’ai également eu la chance de m’engager dans plusieurs initiatives citoyennes et panafricaines, notamment dans des programmes de formation, de leadership et de mobilisation de la jeunesse.",
  "Au fil de mon parcours, une conviction s’est imposée à moi : le savoir juridique est un levier puissant d’autonomisation. Lorsqu’un citoyen connaît ses droits, il devient plus libre, plus responsable et plus capable de participer à la construction d’une société plus inclusive.",
  "Ce blog est donc plus qu’un simple espace de publication.",
  "C’est un lieu de partage, de transmission et de réflexion pour tous ceux qui veulent comprendre le droit sans jargon inutile, mais aussi pour ceux qui souhaitent aller plus loin dans l’analyse et la compréhension des dynamiques juridiques contemporaines.",
  "Que vous soyez étudiant, jeune professionnel, entrepreneur ou simplement curieux de mieux comprendre les règles qui encadrent notre vie quotidienne, vous êtes ici chez vous.",
  "Bienvenue dans l’univers de ClairDroit avec Corinne THIO.",
];

export default function About() {
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = {
    ...SITE_SETTINGS_DEFAULTS,
    ...remoteSettings,
    logoUrl: remoteSettings?.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl,
    pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent,
  };
  const photoUrl = settings.pageContent.about.photoUrl;

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container py-16 md:py-24">
          <div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">À propos de moi</span></div>
          <h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">À propos<br /><em className="font-normal text-[#b86e4b]">de moi</em></h1>
        </div>
      </section>

      <section className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-start md:py-24 lg:gap-24">
        <div className="max-w-2xl space-y-6 text-base leading-8 text-[#3f4e60]">
          <p className="eyebrow !leading-5">À propos de moi</p>
          {biography.map((paragraph, index) => <p key={index} className={index === 2 || index === 5 || index === 8 || index === 11 ? "font-display text-2xl leading-[1.25] tracking-[-0.02em] text-[#12243b] md:text-3xl" : undefined}>{paragraph}</p>)}
        </div>

        <figure className="relative overflow-hidden bg-[#ece6da] md:sticky md:top-28">
          <div className="absolute inset-0 translate-x-3 translate-y-3 border border-[#b86e4b]" aria-hidden="true" />
          <img src={photoUrl} alt="Portrait de Corinne Thio" className="relative aspect-[3/4] w-full object-cover object-center" />
          <figcaption className="relative bg-[#12243b] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[#f7f4ee]">Corinne Thio · Juriste & blogueuse</figcaption>
        </figure>
      </section>

      <section className="container flex flex-col gap-6 border-t border-[rgba(18,36,59,0.14)] py-16 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="eyebrow mb-3">Pour aller plus loin</p><h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">Découvrir les analyses.</h2></div>
        <Link href="/analyses-juridiques" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]">Lire les analyses <ArrowUpRight size={16} /></Link>
      </section>
    </PageShell>
  );
}
