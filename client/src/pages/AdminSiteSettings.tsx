import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, AtSign, Facebook, Github, ImagePlus, Instagram, Linkedin, Music2, Plus, Save, Trash2, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS, type PageContentValues, type SiteSettingsValues, type SocialLink, type SocialPlatform } from "@shared/siteSettings";

type TextKey = Exclude<keyof SiteSettingsValues, "socialLinks" | "pageContent">;
type Field = { key: TextKey; label: string; multiline?: boolean; help?: string };
type PageField = { key: string; label: string; multiline?: boolean };
type PageSection = { title: string; group: keyof PageContentValues; fields: PageField[] };

const sections: Array<{ title: string; fields: Field[] }> = [
  { title: "Marque", fields: [
    { key: "siteName", label: "Nom du site" },
    { key: "siteTagline", label: "Signature courte", help: "Exemple : Revue indépendante" },
    { key: "logoUrl", label: "URL du logo", help: "Vous pouvez coller une URL ou téléverser un fichier ci-dessous." },
  ] },
  { title: "Navigation", fields: [
    { key: "navHomeLabel", label: "Lien accueil" },
    { key: "navArticlesLabel", label: "Lien articles" },
    { key: "navCategoriesLabel", label: "Lien analyses juridiques" },
    { key: "navAboutLabel", label: "Lien à propos" },
    { key: "navCareersLabel", label: "Lien carrières juridiques" },
    { key: "navContactLabel", label: "Bouton contact" },
  ] },
  { title: "Accueil", fields: [
    { key: "homeEyebrow", label: "Surtitre" },
    { key: "homeTitleMain", label: "Grand titre — première ligne" },
    { key: "homeTitleAccent", label: "Grand titre — accent" },
    { key: "homeTitleEnd", label: "Grand titre — fin" },
    { key: "homeDescription", label: "Description d’accueil", multiline: true },
    { key: "homePrimaryCta", label: "Bouton principal" },
    { key: "homeSecondaryCta", label: "Lien secondaire" },
  ] },
  { title: "Pied de page", fields: [
    { key: "footerDescription", label: "Description du footer", multiline: true },
    { key: "footerKicker", label: "Signature du footer" },
    { key: "newsletterTitle", label: "Titre newsletter" },
    { key: "newsletterDescription", label: "Description newsletter", multiline: true },
  ] },
];

const pageSections: PageSection[] = [
  { title: "À propos", group: "about", fields: [
    { key: "eyebrow", label: "Surtitre" }, { key: "titleMain", label: "Titre — première ligne" }, { key: "titleAccent", label: "Titre — accent" }, { key: "intro", label: "Introduction", multiline: true }, { key: "intentionEyebrow", label: "Surtitre intention" }, { key: "intentionTitleMain", label: "Titre intention" }, { key: "intentionTitleAccent", label: "Accent intention" }, { key: "paragraphOne", label: "Premier paragraphe", multiline: true }, { key: "paragraphTwo", label: "Deuxième paragraphe", multiline: true }, { key: "quote", label: "Citation", multiline: true }, { key: "quoteAttribution", label: "Attribution" }, { key: "principlesEyebrow", label: "Surtitre méthode" }, { key: "principleOneTitle", label: "Principe 1" }, { key: "principleOneBody", label: "Texte principe 1", multiline: true }, { key: "principleTwoTitle", label: "Principe 2" }, { key: "principleTwoBody", label: "Texte principe 2", multiline: true }, { key: "principleThreeTitle", label: "Principe 3" }, { key: "principleThreeBody", label: "Texte principe 3", multiline: true }, { key: "ctaEyebrow", label: "Surtitre appel à l’action" }, { key: "ctaTitle", label: "Titre appel à l’action" }, { key: "ctaLabel", label: "Libellé du bouton" }, { key: "photoUrl", label: "URL du portrait" },
  ] },
  { title: "À la une", group: "featured", fields: [
    { key: "eyebrow", label: "Surtitre" }, { key: "titleMain", label: "Titre — première ligne" }, { key: "titleEnd", label: "Titre — fin" }, { key: "description", label: "Description", multiline: true }, { key: "quote", label: "Citation", multiline: true }, { key: "detail", label: "Texte complémentaire", multiline: true }, { key: "linkLabel", label: "Lien du dossier" }, { key: "emptyEyebrow", label: "Surtitre sans publication" }, { key: "emptyTitle", label: "Titre sans publication" }, { key: "emptyDescription", label: "Description sans publication", multiline: true },
  ] },
  { title: "Décryptages", group: "decryptions", fields: [
    { key: "eyebrow", label: "Surtitre" }, { key: "titleMain", label: "Titre — première ligne" }, { key: "titleAccent", label: "Titre — accent" }, { key: "description", label: "Description", multiline: true }, { key: "filterEyebrow", label: "Surtitre des filtres" }, { key: "emptyEyebrow", label: "Surtitre sans publication" }, { key: "emptyTitle", label: "Titre sans publication" }, { key: "emptyDescription", label: "Description sans publication", multiline: true },
  ] },
  { title: "Nous écrire", group: "contact", fields: [
    { key: "eyebrow", label: "Surtitre" }, { key: "titleMain", label: "Titre — première ligne" }, { key: "titleAccent", label: "Titre — accent" }, { key: "description", label: "Description", multiline: true }, { key: "detailsEyebrow", label: "Surtitre coordonnées" }, { key: "email", label: "Email" }, { key: "responseNote", label: "Note de réponse" }, { key: "location", label: "Localisation" }, { key: "locationNote", label: "Note localisation" }, { key: "disclaimer", label: "Avertissement", multiline: true }, { key: "aboutLinkLabel", label: "Lien vers À propos" },
  ] },
];

const socialPlatforms: Array<{ value: SocialPlatform; label: string; icon: LucideIcon }> = [
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "x", label: "X", icon: AtSign },
  { value: "tiktok", label: "TikTok", icon: Music2 },
  { value: "github", label: "GitHub", icon: Github },
];

function Preview({ settings }: { settings: SiteSettingsValues }) {
  const visibleSocials = settings.socialLinks.filter((social) => social.visible && social.url);
  return <div className="overflow-hidden border border-[rgba(18,36,59,0.16)] bg-[#f7f4ee] shadow-[0_14px_45px_rgba(18,36,59,0.09)]"><div className="border-b border-[rgba(18,36,59,0.12)] bg-[#f7f4ee] px-5 py-4"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-2"><span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#12243b] p-1">{settings.logoUrl ? <img src={settings.logoUrl} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-[8px] text-white">Logo</span>}</span><span className="truncate font-display text-lg font-semibold text-[#12243b]">{settings.siteName}</span></div><span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b86e4b]">{settings.navHomeLabel}</span></div></div><div className="bg-[#ece6da] px-5 py-10"><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#b86e4b]">{settings.homeEyebrow}</p><h3 className="font-display text-4xl font-semibold leading-[0.86] tracking-[-0.055em] text-[#12243b]">{settings.homeTitleMain}<br /><em className="font-normal text-[#b86e4b]">{settings.homeTitleAccent}</em> {settings.homeTitleEnd}</h3><p className="mt-5 text-xs leading-5 text-[#536174]">{settings.homeDescription}</p><div className="mt-6 flex flex-wrap items-center gap-3"><span className="bg-[#12243b] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#f7f4ee]">{settings.homePrimaryCta}</span><span className="border-b border-[#b86e4b] pb-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#12243b]">{settings.homeSecondaryCta} <ArrowDownRight className="inline" size={11} /></span></div></div><div className="bg-[#12243b] px-5 py-6 text-[#f7f4ee]"><div className="flex items-center justify-between gap-4"><div><p className="font-display text-lg font-semibold">{settings.siteName}</p><p className="mt-2 max-w-[220px] text-[10px] leading-4 text-[#c6ccd4]">{settings.footerDescription}</p></div><div className="flex gap-2">{visibleSocials.length > 0 ? visibleSocials.map((social) => { const Icon = socialPlatforms.find((item) => item.value === social.icon)?.icon ?? AtSign; return <span key={`${social.platform}-${social.url}`} className="text-[#d7a187]" title={social.label}><Icon size={14} /></span>; }) : <span className="text-[9px] text-[#8793a0]">Réseaux sociaux</span>}</div></div></div></div>;
}

function PageContentPreview({ settings }: { settings: SiteSettingsValues }) {
  const { about, featured, decryptions, contact } = settings.pageContent;
  const previews = [
    [settings.navHomeLabel, "/actualite-juridique", "Publications d’actualité juridique"],
    [settings.navArticlesLabel, "/articles-juridiques", "Articles juridiques vulgarisés"],
    [settings.navCategoriesLabel, "/analyses-juridiques", "Analyses juridiques"],
    [settings.navCareersLabel, "/carrieres-juridiques", "Tips carrières juridiques"],
    [settings.navAboutLabel, "/a-propos", `${about.titleMain} ${about.titleAccent}`],
    ["À la une", "/", `${featured.titleMain} ${featured.titleEnd}`],
    ["Décryptages", "/articles", `${decryptions.titleMain} ${decryptions.titleAccent}`],
    [settings.navContactLabel, "/contact", `${contact.titleMain} ${contact.titleAccent}`],
  ];
  return <div className="mt-4 grid gap-2"><p className="eyebrow mb-1">Pages de navigation</p>{previews.map(([label, href, description]) => <Link key={href} href={href} className="border-l-2 border-[#b86e4b] bg-[#ece6da] px-3 py-2 transition hover:bg-[#e2d7c9]"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#b86e4b]">{label}</p><p className="mt-1 font-display text-base font-semibold text-[#12243b]">{description}</p><p className="mt-1 text-[10px] text-[#667384]">{href}</p></Link>)}</div>;
}

function EditorialNavigationSection({ settings }: { settings: SiteSettingsValues }) {
  const pages = [
    { label: settings.navHomeLabel, href: "/actualite-juridique", description: "Actualités juridiques" },
    { label: settings.navArticlesLabel, href: "/articles-juridiques", description: "Articles juridiques vulgarisés" },
    { label: settings.navCategoriesLabel, href: "/analyses-juridiques", description: "Analyses juridiques" },
    { label: settings.navCareersLabel, href: "/carrieres-juridiques", description: "Tips carrières juridiques" },
  ];
  return <section className="border-t border-[#b86e4b] pt-4"><div className="mb-6"><p className="eyebrow mb-2">Pages éditoriales</p><p className="max-w-2xl text-sm leading-6 text-[#667384]">Les articles sont publiés exclusivement dans l’une de ces quatre pages. Les libellés se modifient dans le bloc « Navigation » ci-dessus.</p></div><div className="grid gap-3 sm:grid-cols-2">{pages.map((page, index) => <Link key={page.href} href={page.href} className="group border border-[rgba(18,36,59,0.14)] bg-[#ece6da] p-4 transition hover:border-[#b86e4b] hover:bg-[#e2d7c9]"><div className="flex items-start justify-between gap-3"><span className="font-display text-2xl text-[#b86e4b]">0{index + 1}</span><ArrowUpRight size={16} className="text-[#b86e4b] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b]">{page.label}</p><p className="mt-2 text-xs leading-5 text-[#667384]">{page.description}</p><p className="mt-3 text-[10px] text-[#8b929b]">{page.href}</p></Link>)}</div></section>;
}

function PageEditorSection({ section, pageContent, onChange }: { section: PageSection; pageContent: PageContentValues; onChange: (group: keyof PageContentValues, key: string, value: string) => void }) {
  const values = pageContent[section.group] as unknown as Record<string, string>;
  return <section className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">{section.title}</p><div className="grid gap-6 md:grid-cols-2">{section.fields.map((field) => <label key={field.key} className={field.multiline ? "block md:col-span-2" : "block"}><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">{field.label}</span>{field.multiline ? <textarea rows={4} value={values[field.key] ?? ""} onChange={(event) => onChange(section.group, field.key, event.target.value)} className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 focus:border-[#b86e4b] focus:outline-none" /> : <input value={values[field.key] ?? ""} onChange={(event) => onChange(section.group, field.key, event.target.value)} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" />}</label>)}</div></section>;
}

export default function AdminSiteSettings() {
  const settingsQuery = trpc.site.settings.useQuery();
  const [form, setForm] = useState<SiteSettingsValues>(SITE_SETTINGS_DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const utils = trpc.useUtils();
  const updateMutation = trpc.site.updateSettings.useMutation({
    onSuccess: async () => { await utils.site.settings.invalidate(); toast.success("Identité du site enregistrée."); },
    onError: (error) => toast.error(error.message || "Impossible d’enregistrer les réglages."),
  });
  const uploadMutation = trpc.articles.uploadImage.useMutation({
    onSuccess: ({ url }) => { setForm((current) => ({ ...current, logoUrl: url })); setUploading(false); toast.success("Logo téléversé."); },
    onError: (error) => { setUploading(false); toast.error(error.message || "Impossible de téléverser le logo."); },
  });

  useEffect(() => {
    if (settingsQuery.data) setForm({ ...SITE_SETTINGS_DEFAULTS, ...settingsQuery.data, logoUrl: settingsQuery.data.logoUrl ?? "", socialLinks: settingsQuery.data.socialLinks ?? [], pageContent: settingsQuery.data.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent });
  }, [settingsQuery.data]);

  const updateField = (key: TextKey, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const updatePageField = (group: keyof PageContentValues, key: string, value: string) => setForm((current) => ({ ...current, pageContent: { ...current.pageContent, [group]: { ...current.pageContent[group], [key]: value } } }));
  const updateSocial = (index: number, changes: Partial<SocialLink>) => setForm((current) => ({ ...current, socialLinks: current.socialLinks.map((social, socialIndex) => socialIndex === index ? { ...social, ...changes } : social) }));
  const addSocial = () => setForm((current) => ({ ...current, socialLinks: [...current.socialLinks, { platform: "linkedin", label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/", visible: true }] }));
  const removeSocial = (index: number) => setForm((current) => ({ ...current, socialLinks: current.socialLinks.filter((_, socialIndex) => socialIndex !== index) }));
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"].includes(file.type)) { toast.error("Formats acceptés : JPG, PNG, WebP, GIF ou SVG."); return; }
    if (file.size > 6_000_000) { toast.error("Le logo ne doit pas dépasser 6 Mo."); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => { const encoded = String(reader.result).split(",")[1]; uploadMutation.mutate({ fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "image/svg+xml", data: encoded }); };
    reader.onerror = () => { setUploading(false); toast.error("Lecture du logo impossible."); };
    reader.readAsDataURL(file);
  };

  return <AdminLayout><div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12"><Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Vue d’ensemble</Link><div className="mb-10 border-b border-[rgba(18,36,59,0.14)] pb-7"><p className="eyebrow mb-3">Réglages éditoriaux</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">Votre signature, partout.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#536174]">Modifiez les mots, la marque et les repères visibles sur le site sans toucher au code. L’aperçu à droite se met à jour immédiatement ; rien n’est enregistré avant votre validation.</p></div>{settingsQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les réglages : {settingsQuery.error.message}</div> : <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_420px]"><form onSubmit={(event) => { event.preventDefault(); updateMutation.mutate(form); }} className="space-y-10">{sections.map((section) => <section key={section.title} className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">{section.title}</p><div className="grid gap-6 md:grid-cols-2">{section.fields.map((field) => <label key={field.key} className={field.multiline ? "block md:col-span-2" : "block"}><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">{field.label}</span>{field.multiline ? <textarea rows={4} value={String(form[field.key])} onChange={(event) => updateField(field.key, event.target.value)} className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 focus:border-[#b86e4b] focus:outline-none" /> : <input value={String(form[field.key])} onChange={(event) => updateField(field.key, event.target.value)} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" />}{field.help && <span className="mt-2 block text-xs leading-5 text-[#8b929b]">{field.help}</span>}</label>)}</div>{section.title === "Marque" && <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[rgba(18,36,59,0.12)] pt-5"><div className="flex h-16 w-16 items-center justify-center bg-[#12243b] p-2">{form.logoUrl ? <img src={form.logoUrl} alt="Aperçu du logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-[#f7f4ee]">Logo</span>}</div><label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b] hover:text-[#12243b]"><ImagePlus size={15} /> {uploading ? "Téléversement…" : "Téléverser un logo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="sr-only" /></label></div>}</section>) }<EditorialNavigationSection settings={form} /><section className="border-t border-[#b86e4b] pt-4"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">Réseaux sociaux</p><p className="max-w-xl text-sm leading-6 text-[#536174]">Ajoutez les profils à afficher dans le pied de page. Les liens sont vérifiés avant leur enregistrement.</p></div><button type="button" onClick={addSocial} disabled={form.socialLinks.length >= 8} className="inline-flex shrink-0 items-center gap-2 border border-[#12243b] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee] disabled:opacity-40"><Plus size={14} /> Ajouter</button></div><div className="space-y-4">{form.socialLinks.map((social, index) => { const PlatformIcon = socialPlatforms.find((item) => item.value === social.icon)?.icon ?? AtSign; return <div key={`${index}-${social.platform}`} className="grid gap-3 border border-[rgba(18,36,59,0.14)] bg-[#ece6da] p-4 md:grid-cols-[150px_1fr_150px_1fr_auto] md:items-end"><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Réseau</span><select value={social.platform} onChange={(event) => { const platform = event.target.value as SocialPlatform; updateSocial(index, { platform, icon: platform, label: socialPlatforms.find((item) => item.value === platform)?.label ?? social.label }); }} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none">{socialPlatforms.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Icône</span><select value={social.icon} onChange={(event) => updateSocial(index, { icon: event.target.value as SocialPlatform })} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none">{socialPlatforms.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Libellé</span><input value={social.label} onChange={(event) => updateSocial(index, { label: event.target.value })} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">URL</span><input type="url" required value={social.url} onChange={(event) => updateSocial(index, { url: event.target.value })} placeholder="https://…" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><div className="flex items-center justify-between gap-3 md:justify-end"><label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]"><input type="checkbox" checked={social.visible} onChange={(event) => updateSocial(index, { visible: event.target.checked })} className="accent-[#b86e4b]" /> Visible</label><button type="button" onClick={() => removeSocial(index)} aria-label={`Supprimer ${social.label}`} className="p-2 text-[#9b5439] transition hover:bg-[#f3e0d8]"><Trash2 size={16} /></button><PlatformIcon className="hidden text-[#b86e4b] md:block" size={18} /></div></div>; })}</div>{form.socialLinks.length === 0 && <p className="border-l-2 border-[#b86e4b] py-3 pl-4 text-sm text-[#667384]">Aucun réseau configuré. L’ajout d’un profil fera apparaître son icône dans le footer.</p>}</section><div className="space-y-10">{pageSections.map((section) => <PageEditorSection key={section.title} section={section} pageContent={form.pageContent} onChange={updatePageField} />)}</div><div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={updateMutation.isPending || uploading} className="inline-flex items-center gap-2 bg-[#12243b] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] shadow-lg transition hover:bg-[#b86e4b] disabled:opacity-60"><Save size={16} /> {updateMutation.isPending ? "Enregistrement…" : "Enregistrer les réglages"}</button></div></form><aside className="xl:sticky xl:top-8"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow mb-1">Aperçu en direct</p><p className="text-xs text-[#667384]">Version non enregistrée</p></div><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#b86e4b]"><span className="h-2 w-2 rounded-full bg-[#b86e4b]" /> Instantané</span></div><Preview settings={form} /><PageContentPreview settings={form} /><p className="mt-4 text-xs leading-5 text-[#8b929b]">L’aperçu reflète les champs actuellement saisis. Cliquez sur « Enregistrer les réglages » pour les publier sur le site.</p></aside></div>}</div></div></AdminLayout>;
}
