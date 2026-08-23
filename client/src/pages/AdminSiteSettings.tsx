import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS, type SiteSettingsValues } from "@shared/siteSettings";

const sections: Array<{ title: string; fields: Array<{ key: keyof SiteSettingsValues; label: string; multiline?: boolean; help?: string }> }> = [
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
    if (settingsQuery.data) setForm({ ...SITE_SETTINGS_DEFAULTS, ...settingsQuery.data, logoUrl: settingsQuery.data.logoUrl ?? "" });
  }, [settingsQuery.data]);

  const updateField = <K extends keyof SiteSettingsValues>(key: K, value: SiteSettingsValues[K]) => setForm((current) => ({ ...current, [key]: value }));
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

  return <AdminLayout><div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12"><Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Vue d’ensemble</Link><div className="mb-10 border-b border-[rgba(18,36,59,0.14)] pb-7"><p className="eyebrow mb-3">Réglages éditoriaux</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">Votre signature, partout.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#536174]">Modifiez les mots, la marque et les repères visibles sur le site sans toucher au code.</p></div>{settingsQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les réglages : {settingsQuery.error.message}</div> : <form onSubmit={(event) => { event.preventDefault(); updateMutation.mutate(form); }} className="space-y-10">{sections.map((section) => <section key={section.title} className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">{section.title}</p><div className="grid gap-6 md:grid-cols-2">{section.fields.map((field) => <label key={field.key} className={field.multiline ? "block md:col-span-2" : "block"}><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">{field.label}</span>{field.multiline ? <textarea rows={4} value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)} className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-3 text-sm leading-6 focus:border-[#b86e4b] focus:outline-none" /> : <input value={form[field.key]} onChange={(event) => updateField(field.key, event.target.value)} className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" />}{field.help && <span className="mt-2 block text-xs leading-5 text-[#8b929b]">{field.help}</span>}</label>)}</div>{section.title === "Marque" && <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[rgba(18,36,59,0.12)] pt-5"><div className="flex h-16 w-16 items-center justify-center bg-[#12243b] p-2">{form.logoUrl ? <img src={form.logoUrl} alt="Aperçu du logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-[#f7f4ee]">Logo</span>}</div><label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b] hover:text-[#12243b]"><ImagePlus size={15} /> {uploading ? "Téléversement…" : "Téléverser un logo"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="sr-only" /></label></div>}</section>) }<div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={updateMutation.isPending || uploading} className="inline-flex items-center gap-2 bg-[#12243b] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] shadow-lg transition hover:bg-[#b86e4b] disabled:opacity-60"><Save size={16} /> {updateMutation.isPending ? "Enregistrement…" : "Enregistrer les réglages"}</button></div></form>}</div></div></AdminLayout>;
}
