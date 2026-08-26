import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  AtSign,
  BookOpen,
  BriefcaseBusiness,
  Globe2,
  Home,
  Info,
  LockKeyhole,
  PanelsTopLeft,
  ShieldCheck,
  UserRound,
  Facebook,
  Github,
  ImagePlus,
  Instagram,
  Linkedin,
  Music2,
  Plus,
  Save,
  Trash2,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import {
  SITE_SETTINGS_DEFAULTS,
  type PageContentValues,
  type SiteSettingsValues,
  type SocialLink,
  type SocialPlatform,
} from "@shared/siteSettings";

type TextKey = Exclude<keyof SiteSettingsValues, "socialLinks" | "pageContent">;
type Field = {
  key: TextKey;
  label: string;
  multiline?: boolean;
  help?: string;
  editable?: boolean;
};
type PageField = {
  key: string;
  label: string;
  multiline?: boolean;
  help?: string;
  editable?: boolean;
};
type SettingsSection = {
  title: string;
  description: string;
  icon: LucideIcon;
  fields: Field[];
};
type PageContentGroup =
  | keyof PageContentValues
  | `editorialPages.${keyof PageContentValues["editorialPages"]}`;
type PageSection = {
  title: string;
  description: string;
  icon: LucideIcon;
  group: PageContentGroup;
  fields: PageField[];
};

const sections: SettingsSection[] = [
  {
    title: "Marque",
    description: "Nom, signature et identité visuelle du blog.",
    icon: Globe2,
    fields: [
      { key: "siteName", label: "Nom du site" },
      {
        key: "siteTagline",
        label: "Signature courte",
        help: "Exemple : Revue indépendante",
      },
      {
        key: "logoUrl",
        label: "URL du logo",
        editable: false,
        help: "Lecture seule : utilisez « Téléverser un logo » pour remplacer l’image.",
      },
    ],
  },
  {
    title: "Navigation",
    description: "Libellés des liens visibles dans le menu principal.",
    icon: PanelsTopLeft,
    fields: [
      { key: "navHomeLabel", label: "Lien accueil" },
      { key: "navArticlesLabel", label: "Lien articles" },
      { key: "navCategoriesLabel", label: "Lien analyses juridiques" },
      { key: "navAboutLabel", label: "Lien à propos" },
      { key: "navCareersLabel", label: "Lien carrières juridiques" },
      { key: "navContactLabel", label: "Bouton contact" },
    ],
  },
  {
    title: "Accueil",
    description: "Textes et boutons de la page d’accueil.",
    icon: Home,
    fields: [
      { key: "homeEyebrow", label: "Surtitre" },
      { key: "homeTitleMain", label: "Grand titre — première ligne" },
      { key: "homeTitleAccent", label: "Grand titre — accent" },
      { key: "homeTitleEnd", label: "Grand titre — fin" },
      {
        key: "homeDescription",
        label: "Description d’accueil",
        multiline: true,
      },
      { key: "homePrimaryCta", label: "Bouton principal" },
      { key: "homeSecondaryCta", label: "Lien secondaire" },
    ],
  },
  {
    title: "Pied de page",
    description: "Signature, description et inscription à la newsletter.",
    icon: Info,
    fields: [
      {
        key: "footerDescription",
        label: "Description du footer",
        multiline: true,
      },
      { key: "footerKicker", label: "Signature du footer" },
      { key: "newsletterTitle", label: "Titre newsletter" },
      {
        key: "newsletterDescription",
        label: "Description newsletter",
        multiline: true,
      },
    ],
  },
];

const pageSections: PageSection[] = [
  {
    title: "À propos de moi",
    description:
      "Textes, titres et repères de la page personnelle de Corinne Thio.",
    icon: UserRound,
    group: "about",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      {
        key: "biography",
        label: "Biographie complète",
        multiline: true,
        help: "Un paragraphe vide sépare chaque partie sur la page publique.",
      },
      { key: "ctaEyebrow", label: "Surtitre appel à l’action" },
      { key: "ctaTitle", label: "Titre appel à l’action" },
      { key: "ctaLabel", label: "Libellé du bouton" },
    ],
  },
  {
    title: "Actualité juridique",
    description:
      "Titres, présentation et état vide de la page Actualité juridique.",
    icon: BookOpen,
    group: "editorialPages.actualite",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "label", label: "Libellé de sélection" },
      { key: "resultsTitle", label: "Titre de la liste" },
      { key: "emptyEyebrow", label: "Surtitre sans publication" },
      { key: "emptyTitle", label: "Titre sans publication" },
      {
        key: "emptyDescription",
        label: "Description sans publication",
        multiline: true,
      },
    ],
  },
  {
    title: "Articles juridiques vulgarisés",
    description:
      "Titres, présentation et état vide de la page de vulgarisation.",
    icon: PanelsTopLeft,
    group: "editorialPages.vulgarisation",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "label", label: "Libellé de sélection" },
      { key: "resultsTitle", label: "Titre de la liste" },
      { key: "emptyEyebrow", label: "Surtitre sans publication" },
      { key: "emptyTitle", label: "Titre sans publication" },
      {
        key: "emptyDescription",
        label: "Description sans publication",
        multiline: true,
      },
    ],
  },
  {
    title: "Analyses juridiques",
    description: "Titres, présentation et état vide de la page des analyses.",
    icon: ShieldCheck,
    group: "editorialPages.analyses",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "label", label: "Libellé de sélection" },
      { key: "resultsTitle", label: "Titre de la liste" },
      { key: "emptyEyebrow", label: "Surtitre sans publication" },
      { key: "emptyTitle", label: "Titre sans publication" },
      {
        key: "emptyDescription",
        label: "Description sans publication",
        multiline: true,
      },
    ],
  },
  {
    title: "Tips carrières juridiques",
    description: "Titres, présentation et état vide de la page Carrières.",
    icon: UserRound,
    group: "editorialPages.carrieres",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "label", label: "Libellé de sélection" },
      { key: "resultsTitle", label: "Titre de la liste" },
      { key: "emptyEyebrow", label: "Surtitre sans publication" },
      { key: "emptyTitle", label: "Titre sans publication" },
      {
        key: "emptyDescription",
        label: "Description sans publication",
        multiline: true,
      },
    ],
  },
  {
    title: "Contenu de la page Carrières",
    description:
      "Tous les textes affichés dans la page Tips carrières juridiques.",
    icon: BriefcaseBusiness,
    group: "careersPage",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "overviewEyebrow", label: "Surtitre présentation" },
      { key: "overviewTitleMain", label: "Titre présentation" },
      { key: "overviewTitleAccent", label: "Accent présentation" },
      { key: "overviewBody", label: "Texte présentation", multiline: true },
      { key: "asideBody", label: "Texte latéral", multiline: true },
      { key: "subjectOneTitle", label: "Repère 1" },
      { key: "subjectOneBody", label: "Texte repère 1", multiline: true },
      { key: "subjectTwoTitle", label: "Repère 2" },
      { key: "subjectTwoBody", label: "Texte repère 2", multiline: true },
      { key: "subjectThreeTitle", label: "Repère 3" },
      { key: "subjectThreeBody", label: "Texte repère 3", multiline: true },
      { key: "guidanceEyebrow", label: "Surtitre conseils" },
      { key: "guidanceTitle", label: "Titre conseils" },
      {
        key: "guidanceItems",
        label: "Conseils (un par ligne)",
        multiline: true,
      },
      { key: "ctaText", label: "Texte appel", multiline: true },
      { key: "ctaLabel", label: "Libellé bouton" },
    ],
  },
  {
    title: "À la une",
    description: "Le texte d’introduction et l’état vide de l’accueil.",
    icon: BookOpen,
    group: "featured",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleEnd", label: "Titre — fin" },
      { key: "description", label: "Description", multiline: true },
      { key: "quote", label: "Citation", multiline: true },
      { key: "detail", label: "Texte complémentaire", multiline: true },
      { key: "linkLabel", label: "Lien du dossier" },
      { key: "emptyEyebrow", label: "Surtitre sans publication" },
      { key: "emptyTitle", label: "Titre sans publication" },
      {
        key: "emptyDescription",
        label: "Description sans publication",
        multiline: true,
      },
    ],
  },
  {
    title: "Nous écrire",
    description: "Les coordonnées et les textes du formulaire de contact.",
    icon: Info,
    group: "contact",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "titleMain", label: "Titre — première ligne" },
      { key: "titleAccent", label: "Titre — accent" },
      { key: "description", label: "Description", multiline: true },
      { key: "detailsEyebrow", label: "Surtitre coordonnées" },
      { key: "email", label: "Email" },
      { key: "responseNote", label: "Note de réponse" },
      { key: "location", label: "Localisation" },
      { key: "locationNote", label: "Note localisation" },
      { key: "disclaimer", label: "Avertissement", multiline: true },
      { key: "aboutLinkLabel", label: "Lien vers À propos" },
    ],
  },
  {
    title: "Mentions légales",
    description: "Les informations légales affichées au public.",
    icon: ShieldCheck,
    group: "legalNotice",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "title", label: "Titre" },
      { key: "intro", label: "Introduction", multiline: true },
      { key: "editorTitle", label: "Titre éditeur" },
      { key: "editorBody", label: "Texte éditeur", multiline: true },
      { key: "activityTitle", label: "Titre activité" },
      { key: "activityBody", label: "Texte activité", multiline: true },
      { key: "hostingTitle", label: "Titre hébergement" },
      { key: "hostingBody", label: "Texte hébergement", multiline: true },
      { key: "rightsTitle", label: "Titre propriété intellectuelle" },
      {
        key: "rightsBody",
        label: "Texte propriété intellectuelle",
        multiline: true,
      },
      { key: "contactTitle", label: "Titre contact" },
      { key: "contactBody", label: "Texte contact", multiline: true },
      {
        key: "draftNotice",
        label: "Avertissement de relecture",
        multiline: true,
      },
    ],
  },
  {
    title: "Politique de confidentialité",
    description:
      "Les informations relatives aux données et à la confidentialité.",
    icon: LockKeyhole,
    group: "privacyPolicy",
    fields: [
      { key: "eyebrow", label: "Surtitre" },
      { key: "title", label: "Titre" },
      { key: "intro", label: "Introduction", multiline: true },
      { key: "controllerTitle", label: "Titre responsable" },
      { key: "controllerBody", label: "Texte responsable", multiline: true },
      { key: "dataTitle", label: "Titre données" },
      { key: "dataBody", label: "Texte données", multiline: true },
      { key: "purposesTitle", label: "Titre finalités" },
      { key: "purposesBody", label: "Texte finalités", multiline: true },
      { key: "retentionTitle", label: "Titre conservation" },
      { key: "retentionBody", label: "Texte conservation", multiline: true },
      { key: "requestsTitle", label: "Titre demandes" },
      { key: "requestsBody", label: "Texte demandes", multiline: true },
      { key: "cookiesTitle", label: "Titre cookies" },
      { key: "cookiesBody", label: "Texte cookies", multiline: true },
      {
        key: "draftNotice",
        label: "Avertissement de relecture",
        multiline: true,
      },
    ],
  },
];

const socialPlatforms: Array<{
  value: SocialPlatform;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "x", label: "X", icon: AtSign },
  { value: "tiktok", label: "TikTok", icon: Music2 },
  { value: "github", label: "GitHub", icon: Github },
];

function SectionHeading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#b86e4b]/40 bg-[#f3e0d8] text-[#b86e4b]">
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-[#12243b]">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#667384]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ReadOnlyNote() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 align-middle text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8b929b]">
      <LockKeyhole size={11} aria-hidden="true" /> Lecture seule
    </span>
  );
}

function Preview({ settings }: { settings: SiteSettingsValues }) {
  const visibleSocials = settings.socialLinks.filter(
    social => social.visible && social.url
  );
  return (
    <div className="overflow-hidden border border-[rgba(18,36,59,0.16)] bg-[#f7f4ee] shadow-[0_14px_45px_rgba(18,36,59,0.09)]">
      <div className="border-b border-[rgba(18,36,59,0.12)] bg-[#f7f4ee] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#12243b] p-1">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-[8px] text-white">Logo</span>
              )}
            </span>
            <span className="truncate font-display text-lg font-semibold text-[#12243b]">
              {settings.siteName}
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b86e4b]">
            {settings.navHomeLabel}
          </span>
        </div>
      </div>
      <div className="bg-[#ece6da] px-5 py-10">
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#b86e4b]">
          {settings.homeEyebrow}
        </p>
        <h3 className="font-display text-4xl font-semibold leading-[0.86] tracking-[-0.055em] text-[#12243b]">
          {settings.homeTitleMain}
          <br />
          <em className="font-normal text-[#b86e4b]">
            {settings.homeTitleAccent}
          </em>{" "}
          {settings.homeTitleEnd}
        </h3>
        <p className="mt-5 text-xs leading-5 text-[#536174]">
          {settings.homeDescription}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="bg-[#12243b] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#f7f4ee]">
            {settings.homePrimaryCta}
          </span>
          <span className="border-b border-[#b86e4b] pb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#12243b]">
            {settings.homeSecondaryCta}{" "}
            <ArrowDownRight className="inline" size={11} />
          </span>
        </div>
      </div>
      <div className="bg-[#12243b] px-5 py-6 text-[#f7f4ee]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-semibold">
              {settings.siteName}
            </p>
            <p className="mt-2 max-w-[220px] text-[10px] leading-4 text-[#c6ccd4]">
              {settings.footerDescription}
            </p>
          </div>
          <div className="flex gap-2">
            {visibleSocials.length > 0 ? (
              visibleSocials.map(social => {
                const Icon =
                  socialPlatforms.find(item => item.value === social.icon)
                    ?.icon ?? AtSign;
                return (
                  <span
                    key={`${social.platform}-${social.url}`}
                    className="text-[#d7a187]"
                    title={social.label}
                  >
                    <Icon size={14} />
                  </span>
                );
              })
            ) : (
              <span className="text-[9px] text-[#8793a0]">Réseaux sociaux</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageContentPreview({ settings }: { settings: SiteSettingsValues }) {
  const { featured, contact, legalNotice, privacyPolicy } =
    settings.pageContent;
  const previews = [
    [
      settings.navHomeLabel,
      "/actualite-juridique",
      "Publications d’actualité juridique",
    ],
    [
      settings.navArticlesLabel,
      "/articles-juridiques",
      "Articles juridiques vulgarisés",
    ],
    [
      settings.navCategoriesLabel,
      "/analyses-juridiques",
      "Analyses juridiques",
    ],
    [
      settings.navCareersLabel,
      "/carrieres-juridiques",
      "Tips carrières juridiques",
    ],
    [
      settings.navAboutLabel,
      "/a-propos",
      "Biographie et portrait de Corinne Thio",
    ],
    ["À la une", "/", `${featured.titleMain} ${featured.titleEnd}`],
    [
      settings.navContactLabel,
      "/contact",
      `${contact.titleMain} ${contact.titleAccent}`,
    ],
    ["Mentions légales", "/mentions-legales", legalNotice.title],
    [
      "Politique de confidentialité",
      "/politique-confidentialite",
      privacyPolicy.title,
    ],
  ];
  return (
    <div className="mt-6 grid gap-2">
      <div className="mb-2 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#d5d1c8] bg-[#e8e5de] text-[#9b9a96]">
          <PanelsTopLeft size={17} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-[#667384]">
            Pages accessibles
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#8b929b]">
            Aperçu des pages publiques · lecture seule
          </p>
        </div>
      </div>
      {previews.map(([label, href, description]) => (
        <Link
          key={href}
          href={href}
          className="border-l-2 border-[#b5afa5] bg-[#e8e5de] px-3 py-2 transition hover:bg-[#e3e0d9]"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8b929b]">
            {label}
          </p>
          <p className="mt-1 font-display text-base font-semibold text-[#667384]">
            {description}
          </p>
          <p className="mt-1 text-[10px] text-[#9b9a96]">{href}</p>
        </Link>
      ))}
    </div>
  );
}

function EditorialNavigationSection({
  settings,
}: {
  settings: SiteSettingsValues;
}) {
  const pages = [
    {
      label: settings.navHomeLabel,
      href: "/actualite-juridique",
      description: "Actualités juridiques",
    },
    {
      label: settings.navArticlesLabel,
      href: "/articles-juridiques",
      description: "Articles juridiques vulgarisés",
    },
    {
      label: settings.navCategoriesLabel,
      href: "/analyses-juridiques",
      description: "Analyses juridiques",
    },
    {
      label: settings.navCareersLabel,
      href: "/carrieres-juridiques",
      description: "Tips carrières juridiques",
    },
  ];
  return (
    <section className="border-t border-[#b86e4b] pt-6">
      <SectionHeading
        title="Pages éditoriales"
        description="Les articles sont publiés exclusivement dans l’une de ces quatre pages. Les libellés se modifient dans le bloc « Navigation » ci-dessus."
        icon={PanelsTopLeft}
      />
      <p className="mb-5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b929b]">
        <LockKeyhole size={12} aria-hidden="true" /> Repères de navigation ·
        lecture seule
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((page, index) => (
          <Link
            key={page.href}
            href={page.href}
            className="group border border-[#d5d1c8] bg-[#e8e5de] p-4 transition hover:border-[#b5afa5] hover:bg-[#e3e0d9]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-2xl text-[#b86e4b]">
                0{index + 1}
              </span>
              <ArrowUpRight
                size={16}
                className="text-[#9b9a96] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b]">
              {page.label}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#667384]">
              {page.description}
            </p>
            <p className="mt-3 text-[10px] text-[#8b929b]">{page.href}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PageEditorSection({
  section,
  pageContent,
  onChange,
}: {
  section: PageSection;
  pageContent: PageContentValues;
  onChange: (group: PageContentGroup, key: string, value: string) => void;
}) {
  const values = (section.group.startsWith("editorialPages.")
    ? pageContent.editorialPages[
        section.group.split(".")[1] as keyof PageContentValues["editorialPages"]
      ]
    : pageContent[
        section.group as keyof PageContentValues
      ]) as unknown as Record<string, string>;
  return (
    <section className="border-t border-[#b86e4b] pt-6">
      <SectionHeading
        title={section.title}
        description={section.description}
        icon={section.icon}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {section.fields.map(field => (
          <label
            key={field.key}
            className={`${field.multiline ? "block md:col-span-2" : "block"} ${field.editable === false ? "opacity-60" : ""}`}
          >
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">
              {field.label}
              {field.editable === false && <ReadOnlyNote />}
            </span>
            {field.multiline ? (
              <textarea
                rows={4}
                value={values[field.key] ?? ""}
                disabled={field.editable === false}
                onChange={event =>
                  onChange(section.group, field.key, event.target.value)
                }
                className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 disabled:cursor-not-allowed disabled:bg-[#e1ddd4] disabled:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none"
              />
            ) : (
              <input
                value={values[field.key] ?? ""}
                disabled={field.editable === false}
                onChange={event =>
                  onChange(section.group, field.key, event.target.value)
                }
                className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm disabled:cursor-not-allowed disabled:border-[#b5b1a8] disabled:bg-[#e1ddd4] disabled:px-3 disabled:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none"
              />
            )}
            {field.help && (
              <span className="mt-2 block text-xs leading-5 text-[#8b929b]">
                {field.help}
              </span>
            )}
          </label>
        ))}
      </div>
    </section>
  );
}

export default function AdminSiteSettings() {
  const settingsQuery = trpc.site.settings.useQuery();
  const [form, setForm] = useState<SiteSettingsValues>(SITE_SETTINGS_DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<"logo" | "photo">("logo");
  const uploadTargetRef = useRef<"logo" | "photo">("logo");
  const utils = trpc.useUtils();
  const updateMutation = trpc.site.updateSettings.useMutation({
    onSuccess: async () => {
      await utils.site.settings.invalidate();
      toast.success("Identité du site enregistrée.");
    },
    onError: error =>
      toast.error(error.message || "Impossible d’enregistrer les réglages."),
  });
  const uploadMutation = trpc.articles.uploadImage.useMutation({
    onSuccess: ({ url }) => {
      const target = uploadTargetRef.current;
      setForm(current =>
        target === "logo"
          ? { ...current, logoUrl: url }
          : {
              ...current,
              pageContent: {
                ...current.pageContent,
                about: { ...current.pageContent.about, photoUrl: url },
              },
            }
      );
      setUploading(false);
      toast.success(
        target === "logo" ? "Logo téléversé." : "Portrait téléversé."
      );
    },
    onError: error => {
      const target = uploadTargetRef.current;
      setUploading(false);
      toast.error(
        error.message ||
          `Impossible de téléverser le ${target === "logo" ? "logo" : "portrait"}.`
      );
    },
  });

  useEffect(() => {
    if (settingsQuery.data)
      setForm({
        ...SITE_SETTINGS_DEFAULTS,
        ...settingsQuery.data,
        logoUrl: settingsQuery.data.logoUrl ?? "",
        socialLinks: settingsQuery.data.socialLinks ?? [],
        pageContent:
          settingsQuery.data.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent,
      });
  }, [settingsQuery.data]);

  const updateField = (key: TextKey, value: string) =>
    setForm(current => ({ ...current, [key]: value }));
  const updatePageField = (
    group: PageContentGroup,
    key: string,
    value: string
  ) =>
    setForm(current => {
      if (group.startsWith("editorialPages.")) {
        const page = group.split(
          "."
        )[1] as keyof PageContentValues["editorialPages"];
        return {
          ...current,
          pageContent: {
            ...current.pageContent,
            editorialPages: {
              ...current.pageContent.editorialPages,
              [page]: {
                ...current.pageContent.editorialPages[page],
                [key]: value,
              },
            },
          },
        };
      }
      const contentGroup = group as keyof PageContentValues;
      return {
        ...current,
        pageContent: {
          ...current.pageContent,
          [contentGroup]: {
            ...(current.pageContent[contentGroup] as Record<string, string>),
            [key]: value,
          },
        },
      };
    });
  const updateSocial = (index: number, changes: Partial<SocialLink>) =>
    setForm(current => ({
      ...current,
      socialLinks: current.socialLinks.map((social, socialIndex) =>
        socialIndex === index ? { ...social, ...changes } : social
      ),
    }));
  const addSocial = () =>
    setForm(current => ({
      ...current,
      socialLinks: [
        ...current.socialLinks,
        {
          platform: "linkedin",
          label: "LinkedIn",
          icon: "linkedin",
          url: "https://www.linkedin.com/",
          visible: true,
        },
      ],
    }));
  const removeSocial = (index: number) =>
    setForm(current => ({
      ...current,
      socialLinks: current.socialLinks.filter(
        (_, socialIndex) => socialIndex !== index
      ),
    }));
  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "logo" | "photo"
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ].includes(file.type)
    ) {
      toast.error("Formats acceptés : JPG, PNG, WebP, GIF ou SVG.");
      return;
    }
    if (file.size > 6_000_000) {
      toast.error("L’image ne doit pas dépasser 6 Mo.");
      return;
    }
    uploadTargetRef.current = target;
    setUploadTarget(target);
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const encoded = String(reader.result).split(",")[1];
      uploadMutation.mutate({
        fileName: file.name,
        contentType: file.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif"
          | "image/svg+xml",
        data: encoded,
      });
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Lecture du logo impossible.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f7f4ee] text-[#12243b]">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12">
          <Link
            href="/admin"
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] transition hover:text-[#b86e4b]"
          >
            <ArrowLeft size={15} /> Vue d’ensemble
          </Link>
          <div className="mb-10 border-b border-[rgba(18,36,59,0.14)] pb-7">
            <p className="eyebrow mb-3">Réglages éditoriaux</p>
            <h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">
              Votre signature, partout.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#536174]">
              Modifiez les mots, la marque et les repères visibles sur le site
              sans toucher au code. L’aperçu à droite se met à jour
              immédiatement ; rien n’est enregistré avant votre validation.
            </p>
          </div>
          {settingsQuery.isError ? (
            <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">
              Impossible de charger les réglages : {settingsQuery.error.message}
            </div>
          ) : (
            <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
              <form
                onSubmit={event => {
                  event.preventDefault();
                  updateMutation.mutate(form);
                }}
                className="space-y-10"
              >
                {sections.map(section => (
                  <section
                    key={section.title}
                    className="border-t border-[#b86e4b] pt-6"
                  >
                    <SectionHeading
                      title={section.title}
                      description={section.description}
                      icon={section.icon}
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                      {section.fields.map(field => (
                        <label
                          key={field.key}
                          className={`${field.multiline ? "block md:col-span-2" : "block"} ${field.editable === false ? "opacity-60" : ""}`}
                        >
                          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">
                            {field.label}
                            {field.editable === false && <ReadOnlyNote />}
                          </span>
                          {field.multiline ? (
                            <textarea
                              rows={4}
                              value={String(form[field.key])}
                              disabled={field.editable === false}
                              onChange={event =>
                                updateField(field.key, event.target.value)
                              }
                              className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 disabled:cursor-not-allowed disabled:bg-[#e1ddd4] disabled:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none"
                            />
                          ) : (
                            <input
                              value={String(form[field.key])}
                              disabled={field.editable === false}
                              onChange={event =>
                                updateField(field.key, event.target.value)
                              }
                              className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm disabled:cursor-not-allowed disabled:border-[#b5b1a8] disabled:bg-[#e1ddd4] disabled:px-3 disabled:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none"
                            />
                          )}
                          {field.help && (
                            <span className="mt-2 block text-xs leading-5 text-[#8b929b]">
                              {field.help}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    {section.title === "Marque" && (
                      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[rgba(18,36,59,0.12)] pt-5">
                        <div className="flex h-16 w-16 items-center justify-center bg-[#12243b] p-2">
                          {form.logoUrl ? (
                            <img
                              src={form.logoUrl}
                              alt="Aperçu du logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-[#f7f4ee]">Logo</span>
                          )}
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b] hover:text-[#12243b]">
                          <ImagePlus size={15} />{" "}
                          {uploading ? "Téléversement…" : "Téléverser un logo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                            onChange={event => handleUpload(event, "logo")}
                            disabled={uploading}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    )}
                  </section>
                ))}
                <EditorialNavigationSection settings={form} />
                <section className="border-t border-[#b86e4b] pt-6">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <SectionHeading
                      title="Réseaux sociaux"
                      description="Ajoutez les profils à afficher dans le pied de page. Les liens sont vérifiés avant leur enregistrement."
                      icon={AtSign}
                    />
                    <button
                      type="button"
                      onClick={addSocial}
                      disabled={form.socialLinks.length >= 8}
                      className="inline-flex shrink-0 items-center gap-2 border border-[#12243b] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee] disabled:opacity-40"
                    >
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.socialLinks.map((social, index) => {
                      const PlatformIcon =
                        socialPlatforms.find(item => item.value === social.icon)
                          ?.icon ?? AtSign;
                      return (
                        <div
                          key={`${index}-${social.platform}`}
                          className="grid gap-3 border border-[rgba(18,36,59,0.14)] bg-[#ece6da] p-4 md:grid-cols-[150px_1fr_150px_1fr_auto] md:items-end"
                        >
                          <label>
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">
                              Réseau
                            </span>
                            <select
                              value={social.platform}
                              onChange={event => {
                                const platform = event.target
                                  .value as SocialPlatform;
                                updateSocial(index, {
                                  platform,
                                  icon: platform,
                                  label:
                                    socialPlatforms.find(
                                      item => item.value === platform
                                    )?.label ?? social.label,
                                });
                              }}
                              className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none"
                            >
                              {socialPlatforms.map(platform => (
                                <option
                                  key={platform.value}
                                  value={platform.value}
                                >
                                  {platform.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">
                              Icône
                            </span>
                            <select
                              value={social.icon}
                              onChange={event =>
                                updateSocial(index, {
                                  icon: event.target.value as SocialPlatform,
                                })
                              }
                              className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none"
                            >
                              {socialPlatforms.map(platform => (
                                <option
                                  key={platform.value}
                                  value={platform.value}
                                >
                                  {platform.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">
                              Libellé
                            </span>
                            <input
                              value={social.label}
                              onChange={event =>
                                updateSocial(index, {
                                  label: event.target.value,
                                })
                              }
                              className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none"
                            />
                          </label>
                          <label>
                            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">
                              URL
                            </span>
                            <input
                              type="url"
                              required
                              value={social.url}
                              onChange={event =>
                                updateSocial(index, { url: event.target.value })
                              }
                              placeholder="https://…"
                              className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none"
                            />
                          </label>
                          <div className="flex items-center justify-between gap-3 md:justify-end">
                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">
                              <input
                                type="checkbox"
                                checked={social.visible}
                                onChange={event =>
                                  updateSocial(index, {
                                    visible: event.target.checked,
                                  })
                                }
                                className="accent-[#b86e4b]"
                              />{" "}
                              Visible
                            </label>
                            <button
                              type="button"
                              onClick={() => removeSocial(index)}
                              aria-label={`Supprimer ${social.label}`}
                              className="p-2 text-[#9b5439] transition hover:bg-[#f3e0d8]"
                            >
                              <Trash2 size={16} />
                            </button>
                            <PlatformIcon
                              className="hidden text-[#b86e4b] md:block"
                              size={18}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {form.socialLinks.length === 0 && (
                    <p className="border-l-2 border-[#b86e4b] py-3 pl-4 text-sm text-[#667384]">
                      Aucun réseau configuré. L’ajout d’un profil fera
                      apparaître son icône dans le footer.
                    </p>
                  )}
                </section>
                <div className="space-y-10">
                  {pageSections.map(section => (
                    <PageEditorSection
                      key={section.title}
                      section={section}
                      pageContent={form.pageContent}
                      onChange={updatePageField}
                    />
                  ))}
                </div>
                <section className="border-t border-[#b86e4b] pt-6">
                  <SectionHeading
                    title="Photo de la page À propos"
                    description="Image affichée à côté de la biographie de Corinne Thio."
                    icon={ImagePlus}
                  />
                  <div className="flex flex-wrap items-center gap-5">
                    <div className="flex h-48 w-36 items-center justify-center overflow-hidden bg-[#e8e5de] text-center text-xs leading-5 text-[#8b929b]">
                      {form.pageContent.about.photoUrl ? (
                        <img
                          src={form.pageContent.about.photoUrl}
                          alt="Aperçu du portrait de Corinne Thio"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="px-4">Aucun portrait téléversé</span>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b] hover:text-[#12243b]">
                      <ImagePlus size={15} />{" "}
                      {uploading && uploadTarget === "photo"
                        ? "Téléversement…"
                        : "Téléverser le portrait"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={event => handleUpload(event, "photo")}
                        disabled={uploading}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#8b929b]">
                    Le portrait est enregistré dans le stockage indépendant R2
                    avec les autres images du site.
                  </p>
                </section>
                <div className="sticky bottom-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending || uploading}
                    className="inline-flex items-center gap-2 bg-[#12243b] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] shadow-lg transition hover:bg-[#b86e4b] disabled:opacity-60"
                  >
                    <Save size={16} />{" "}
                    {updateMutation.isPending
                      ? "Enregistrement…"
                      : "Enregistrer les réglages"}
                  </button>
                </div>
              </form>
              <aside className="xl:sticky xl:top-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="eyebrow mb-1">Aperçu en direct</p>
                    <p className="text-xs text-[#667384]">
                      Version non enregistrée
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#b86e4b]">
                    <span className="h-2 w-2 rounded-full bg-[#b86e4b]" />{" "}
                    Instantané
                  </span>
                </div>
                <Preview settings={form} />
                <PageContentPreview settings={form} />
                <p className="mt-4 text-xs leading-5 text-[#8b929b]">
                  L’aperçu reflète les champs actuellement saisis. Cliquez sur «
                  Enregistrer les réglages » pour les publier sur le site.
                </p>
              </aside>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
