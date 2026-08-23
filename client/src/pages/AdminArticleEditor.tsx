/* Administration éditoriale : éditeur simple orienté rédaction, avec distinction nette entre sauvegarder et publier. */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, FileText, Save, Send } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";

const categories = ["Droit du travail", "Numérique", "Affaires", "Vie privée", "Droit public"];

type FormState = { title: string; excerpt: string; content: string; category: string; author: string; coverImage: string; status: "draft" | "published" | "archived" };

const emptyForm: FormState = { title: "", excerpt: "", content: "", category: "Droit du travail", author: "", coverImage: "", status: "draft" };

export default function AdminArticleEditor() {
  const [, setLocation] = useLocation();
  const [, editParams] = useRoute("/admin/articles/:id/edit");
  const articleId = editParams?.id ? Number(editParams.id) : undefined;
  const isEditing = Boolean(articleId);
  const existingQuery = trpc.articles.adminById.useQuery({ id: articleId ?? 0 }, { enabled: Boolean(articleId) });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitStatus, setSubmitStatus] = useState<FormState["status"]>("draft");
  const handleSuccess = () => {
    toast.success(submitStatus === "published" ? "Article publié." : submitStatus === "archived" ? "Article archivé." : "Brouillon enregistré.");
    setLocation("/admin/articles");
  };
  const handleError = (error: { message: string }) => toast.error(error.message || "Impossible d’enregistrer l’article.");
  const createMutation = trpc.articles.create.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const updateMutation = trpc.articles.update.useMutation({ onSuccess: handleSuccess, onError: handleError });
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!existingQuery.data) return;
    setForm({ title: existingQuery.data.title, excerpt: existingQuery.data.excerpt, content: existingQuery.data.content, category: existingQuery.data.category, author: existingQuery.data.author, coverImage: existingQuery.data.coverImage ?? "", status: existingQuery.data.status });
  }, [existingQuery.data]);

  const wordCount = useMemo(() => form.content.trim() ? form.content.trim().split(/\s+/).length : 0, [form.content]);
  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>, status: FormState["status"]) => {
    event.preventDefault();
    setSubmitStatus(status);
    const payload = { ...form, status };
    if (isEditing) updateMutation.mutate({ id: articleId as number, ...payload });
    else createMutation.mutate(payload);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12"><div className="mb-8 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.14)] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/admin/articles" className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Mes articles</Link><p className="eyebrow mb-3">{isEditing ? "Modifier un article" : "Nouvelle publication"}</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">{isEditing ? "Relire et ajuster." : "Donner forme à une idée."}</h1></div><div className="flex items-center gap-3 text-xs uppercase tracking-[0.1em] text-[#667384]"><FileText size={16} className="text-[#b86e4b]" /> {wordCount} mot{wordCount > 1 ? "s" : ""}</div></div>
        {existingQuery.isLoading && isEditing ? <div className="py-16 text-sm text-[#667384]">Chargement du texte…</div> : existingQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger cet article : {existingQuery.error.message}</div> : <form className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]" onSubmit={(event) => handleSubmit(event, "draft")}><div className="space-y-7"><label className="block"><span className="eyebrow mb-3 block">Titre</span><input required value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Le titre qui donne l’angle" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 font-display text-4xl font-semibold leading-none text-[#12243b] placeholder:text-[#a2a1a0] focus:border-[#b86e4b] focus:outline-none md:text-5xl" /></label><label className="block"><span className="eyebrow mb-3 block">Chapô</span><textarea required rows={3} value={form.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} placeholder="En deux ou trois phrases, donnez envie de lire et précisez ce que le texte éclaire." className="w-full resize-y border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-base leading-7 text-[#3f4e60] placeholder:text-[#a2a1a0] focus:border-[#b86e4b] focus:outline-none" /></label><label className="block"><span className="eyebrow mb-3 block">Corps de l’article</span><textarea required rows={18} value={form.content} onChange={(event) => updateField("content", event.target.value)} placeholder="Rédigez ici votre analyse. Un paragraphe vide sépare les idées dans la lecture publique." className="w-full resize-y border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-4 py-4 text-base leading-8 text-[#3f4e60] placeholder:text-[#8b929b] focus:border-[#b86e4b] focus:outline-none" /></label><div className="flex flex-wrap gap-3 border-t border-[rgba(18,36,59,0.14)] pt-5"><button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] transition hover:bg-[#b86e4b] disabled:cursor-not-allowed disabled:opacity-60"><Save size={16} /> {isSaving && submitStatus === "draft" ? "Enregistrement…" : "Enregistrer le brouillon"}</button><button type="button" disabled={isSaving} onClick={(event) => handleSubmit(event as unknown as FormEvent<HTMLFormElement>, "published")} className="inline-flex items-center gap-2 border border-[#b86e4b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b] transition hover:bg-[#b86e4b] hover:text-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-60"><Send size={16} /> {isSaving && submitStatus === "published" ? "Publication…" : "Publier"}</button></div></div><aside className="space-y-7"><div className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-5">Références</p><label className="mb-5 block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">Rubrique</span><select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="w-full border border-[rgba(18,36,59,0.18)] bg-[#ece6da] px-3 py-3 text-sm text-[#12243b] focus:border-[#b86e4b] focus:outline-none">{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label className="mb-5 block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">Auteur</span><input required value={form.author} onChange={(event) => updateField("author", event.target.value)} placeholder="Nom affiché" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#667384]">Image de couverture</span><input type="url" value={form.coverImage} onChange={(event) => updateField("coverImage", event.target.value)} placeholder="https://…" className="w-full border-b border-[rgba(18,36,59,0.25)] bg-transparent px-0 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" /><span className="mt-2 block text-xs leading-5 text-[#8b929b]">Optionnel. Utilisez une URL d’image accessible publiquement.</span></label></div><div className="border-t border-[rgba(18,36,59,0.14)] pt-4"><p className="eyebrow mb-4">État actuel</p><p className="flex items-center gap-2 text-sm text-[#536174]"><span className={`h-2 w-2 rounded-full ${form.status === "published" ? "bg-[#5b8a63]" : form.status === "archived" ? "bg-[#9aa1a8]" : "bg-[#b86e4b]"}`} />{form.status === "published" ? "Publié" : form.status === "archived" ? "Archivé" : "Brouillon"}</p><button type="button" disabled={!isEditing || isSaving} onClick={(event) => handleSubmit(event as unknown as FormEvent<HTMLFormElement>, "archived")} className="mt-5 text-xs font-bold uppercase tracking-[0.1em] text-[#667384] underline decoration-[#b86e4b] underline-offset-4 transition hover:text-[#b86e4b] disabled:cursor-not-allowed disabled:opacity-40">Archiver ce texte</button></div><div className="border-t border-[rgba(18,36,59,0.14)] pt-4"><p className="eyebrow mb-4">Conseil de lecture</p><p className="text-xs leading-6 text-[#667384]">Un bon chapô pose l’angle. Le corps développe le raisonnement. La publication rend le texte visible sur l’index public.</p><span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#b86e4b]"><Eye size={15} /> Aperçu public bientôt</span></div></aside></form>}
      </div></div>
    </AdminLayout>
  );
}
