import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, AtSign, Facebook, Github, ImagePlus, Instagram, Linkedin, Music2, Plus, Save, Trash2, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS, type SiteSettingsValues, type SocialLink, type SocialPlatform } from "@shared/siteSettings";

type TextKey = Exclude<keyof SiteSettingsValues, "socialLinks">;
type Field = { key: TextKey; label: string; multiline?: boolean; help?: string };

const sections: Array<{ title: string; fields: Field[] }> = [
  { title: "Marque", fields: [
    { key: "siteName", label: "Nom du site" },
    { key: "siteTagline", label: "Signature courte", help: "Exemple : Revue indépendante" },
    { key: "logoUrl", label: "URL du logo", help: "Vous pouvez coller une URL ou téléverser un fichier ci-dessous." },
  ] },
  { title: "Navigation", fields: [
    { key: "navHomeLabel", label: "Lien accueil" },
    { key: "navArticlesLabel", label: "Lien articles" },
    { key: "navCategoriesLabel", label: "Lien rubriques" },
    { key: "navAboutLabel", label: "Lien à propos" },
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
    if (settingsQuery.data) setForm({ ...SITE_SETTINGS_DEFAULTS, ...settingsQuery.data, logoUrl: settingsQuery.data.logoUrl ?? "", socialLinks: settingsQuery.data.socialLinks ?? [] });
  }, [settingsQuery.data]);

  const updateField = (key: TextKey, value: string) => setForm((current) => ({ ...current, [key]: value }));
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

  return <AdminLayout><div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-12"><Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Vue d’ensemble</Link><div className="mb-10 border-b border-[rgba(18,36,59,0.14)] pb-7"><p className="eyebrow mb-3">Réglages éditoriaux</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">Votre signature, partout.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#536174]">Modifiez les mots, la marque et les repères visibles sur le site sans toucher au code. L’aperçu à droite se met à jour immédiatement ; rien n’est enregistré avant votre validation.</p></div>{settingsQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les réglages : {settingsQuery.error.message}</div> : <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_420px]"><form onSubmit={(event) => { event.preventDefault(); updateMutation.mutate(form); }} className="space-y-10">{sections.map((section) => <section key={section.title} className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">{section.title}</p><div className="grid gap-6 md:grid-cols-2">{section.fields.map((field) => <label key={field.key} className={field.multiline ? "block md:col-span-2" : "block"}><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">{field.label}</span>{field.multiline ? <textarea rows={4} value={String(form[field.key])} onChange={(event) => updateField(field.key, event.target.value)} className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 focus:border-[#b86e4b] focus:outline-none" /> : <input value={String(form[field.key])} onChange={(event) => updateField(field.key, event.target.value)} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" />}{field.help && <span className="mt-2 block text-xs leading-5 text-[#8b929b]">{field.help}</span>}</label>)}</div>{section.title === "Marque" && <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[rgba(18,36,59,0.12)] pt-5"><div className="flex h-16 w-16 items-center justify-center bg-[#12243b] p-2">{form.logoUrl ? <img src={form.logoUrl} alt="Aperçu du logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-[#f7f4ee]">Logo</span>}</div><label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b] hover:text-[#12243b]"><ImagePlus size={15} /> {uploading ? "Téléversement…" : "Téléverser un logo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="sr-only" /></label></div>}</section>) }<section className="border-t border-[#b86e4b] pt-4"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2">Réseaux sociaux</p><p className="max-w-xl text-sm leading-6 text-[#536174]">Ajoutez les profils à afficher dans le pied de page. Les liens sont vérifiés avant leur enregistrement.</p></div><button type="button" onClick={addSocial} disabled={form.socialLinks.length >= 8} className="inline-flex shrink-0 items-center gap-2 border border-[#12243b] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee] disabled:opacity-40"><Plus size={14} /> Ajouter</button></div><div className="space-y-4">{form.socialLinks.map((social, index) => { const PlatformIcon = socialPlatforms.find((item) => item.value === social.icon)?.icon ?? AtSign; return <div key={`${index}-${social.platform}`} className="grid gap-3 border border-[rgba(18,36,59,0.14)] bg-[#ece6da] p-4 md:grid-cols-[150px_1fr_150px_1fr_auto] md:items-end"><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Réseau</span><select value={social.platform} onChange={(event) => { const platform = event.target.value as SocialPlatform; updateSocial(index, { platform, icon: platform, label: socialPlatforms.find((item) => item.value === platform)?.label ?? social.label }); }} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none">{socialPlatforms.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Icône</span><select value={social.icon} onChange={(event) => updateSocial(index, { icon: event.target.value as SocialPlatform })} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none">{socialPlatforms.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}</select></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">Libellé</span><input value={social.label} onChange={(event) => updateSocial(index, { label: event.target.value })} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><label><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]">URL</span><input type="url" required value={social.url} onChange={(event) => updateSocial(index, { url: event.target.value })} placeholder="https://…" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent py-2 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><div className="flex items-center justify-between gap-3 md:justify-end"><label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#667384]"><input type="checkbox" checked={social.visible} onChange={(event) => updateSocial(index, { visible: event.target.checked })} className="accent-[#b86e4b]" /> Visible</label><button type="button" onClick={() => removeSocial(index)} aria-label={`Supprimer ${social.label}`} className="p-2 text-[#9b5439] transition hover:bg-[#f3e0d8]"><Trash2 size={16} /></button><PlatformIcon className="hidden text-[#b86e4b] md:block" size={18} /></div></div>; })}</div>{form.socialLinks.length === 0 && <p className="border-l-2 border-[#b86e4b] py-3 pl-4 text-sm text-[#667384]">Aucun réseau configuré. L’ajout d’un profil fera apparaître son icône dans le footer.</p>}</section><div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={updateMutation.isPending || uploading} className="inline-flex items-center gap-2 bg-[#12243b] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] shadow-lg transition hover:bg-[#b86e4b] disabled:opacity-60"><Save size={16} /> {updateMutation.isPending ? "Enregistrement…" : "Enregistrer les réglages"}</button></div></form><aside className="xl:sticky xl:top-8"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow mb-1">Aperçu en direct</p><p className="text-xs text-[#667384]">Version non enregistrée</p></div><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#b86e4b]"><span className="h-2 w-2 rounded-full bg-[#b86e4b]" /> Instantané</span></div><Preview settings={form} /><p className="mt-4 text-xs leading-5 text-[#8b929b]">L’aperçu reflète les champs actuellement saisis. Cliquez sur « Enregistrer les réglages » pour les publier sur le site.</p></aside></div>}</div></div></AdminLayout>;
}
