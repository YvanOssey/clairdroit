/* Administration éditoriale : liste de travail avec corbeille et actions destructives protégées. */
import { useMemo, useState } from "react";
import { Archive, ArrowUpRight, FileText, Plus, RotateCcw, Search, ShieldAlert, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";

const statusLabels = { all: "Tous", draft: "Brouillons", published: "Publiés", archived: "Archivés", trashed: "Corbeille" } as const;
type StatusFilter = keyof typeof statusLabels;
type ArticleStatus = "draft" | "published" | "archived" | "trashed";
type Action = "trash" | "restore" | "purge";
const TRASH_CONFIRMATION = "CORBEILLE";
const PURGE_CONFIRMATION = "SUPPRIMER DÉFINITIVEMENT";

type PendingAction = { id: number; title: string; action: Action };

export default function AdminArticles() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const articlesQuery = trpc.articles.adminList.useQuery();
  const utils = trpc.useUtils();
  const finish = (message: string) => {
    toast.success(message);
    setPending(null);
    setConfirmation("");
    utils.articles.adminList.invalidate();
  };
  const fail = (error: { message: string }) => toast.error(error.message || "Action impossible.");
  const trashMutation = trpc.articles.trash.useMutation({ onSuccess: () => finish("Article déplacé dans la corbeille."), onError: fail });
  const restoreMutation = trpc.articles.restore.useMutation({ onSuccess: () => finish("Article restauré comme brouillon."), onError: fail });
  const purgeMutation = trpc.articles.purge.useMutation({ onSuccess: () => finish("Article supprimé définitivement."), onError: fail });
  const isMutating = trashMutation.isPending || restoreMutation.isPending || purgeMutation.isPending;
  const filtered = useMemo(() => (articlesQuery.data ?? []).filter((article) => {
    const matchesStatus = status === "all" || article.status === status;
    const haystack = `${article.title} ${article.category} ${article.author}`.toLowerCase();
    return matchesStatus && haystack.includes(query.trim().toLowerCase());
  }), [articlesQuery.data, query, status]);
  const openAction = (article: { id: number; title: string }, action: Action) => {
    setConfirmation("");
    setPending({ id: article.id, title: article.title, action });
  };
  const runAction = () => {
    if (!pending) return;
    if (pending.action === "trash") {
      if (confirmation !== TRASH_CONFIRMATION) return;
      trashMutation.mutate({ id: pending.id, confirmation: TRASH_CONFIRMATION });
    } else if (pending.action === "restore") {
      restoreMutation.mutate({ id: pending.id });
    } else {
      if (confirmation !== PURGE_CONFIRMATION) return;
      purgeMutation.mutate({ id: pending.id, confirmation: PURGE_CONFIRMATION });
    }
  };
  const actionTitle = pending?.action === "trash" ? "Déplacer dans la corbeille ?" : pending?.action === "restore" ? "Restaurer cet article ?" : "Supprimer définitivement ?";
  const actionDescription = pending?.action === "trash" ? `L’article « ${pending.title} » ne sera plus public. Il restera récupérable depuis la corbeille.` : pending?.action === "restore" ? `L’article « ${pending.title} » redeviendra un brouillon modifiable.` : `L’article « ${pending?.title} » et son contenu seront supprimés définitivement. Cette action est irréversible.`;
  const requiredPhrase = pending?.action === "trash" ? TRASH_CONFIRMATION : pending?.action === "purge" ? PURGE_CONFIRMATION : "";

  return <AdminLayout>
    <div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      <div className="mb-9 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.14)] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow mb-3">Espace rédaction</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">Mes articles.</h1><p className="mt-4 text-sm text-[#536174]">Retrouvez vos textes, y compris ceux mis en corbeille.</p></div><Link href="/admin/articles/new" className="inline-flex items-center justify-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] transition hover:bg-[#b86e4b]"><Plus size={16} /> Nouvel article</Link></div>
      <div className="mb-7 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"><label className="relative block"><span className="sr-only">Rechercher un article</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b86e4b]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher par titre, rubrique ou auteur" className="w-full border border-[rgba(18,36,59,0.18)] bg-[#ece6da] py-3.5 pl-11 pr-4 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><div className="flex items-center gap-2 overflow-x-auto border-b border-[rgba(18,36,59,0.14)] md:border-b-0">{(Object.keys(statusLabels) as StatusFilter[]).map((key) => <button key={key} type="button" onClick={() => setStatus(key)} className={`whitespace-nowrap border-b-2 px-2 py-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${status === key ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>{statusLabels[key]}</button>)}</div></div>
      {articlesQuery.isLoading ? <div className="py-14 text-sm text-[#667384]">Chargement des articles…</div> : articlesQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les articles : {articlesQuery.error.message}</div> : filtered.length === 0 ? <div className="border border-dashed border-[rgba(18,36,59,0.22)] px-6 py-16 text-center"><FileText size={24} className="mx-auto text-[#b86e4b]" /><h2 className="mt-5 font-display text-3xl font-semibold">Aucun article dans cette vue.</h2><p className="mt-3 text-sm text-[#667384]">Modifiez votre recherche ou créez un nouveau texte.</p></div> : <div className="divide-y divide-[rgba(18,36,59,0.14)] border-y border-[rgba(18,36,59,0.14)]">{filtered.map((article) => <div key={article.id} className="grid gap-4 px-2 py-5 transition-colors hover:bg-[#ece6da] sm:grid-cols-[minmax(0,1fr)_130px_auto] sm:items-center"><Link href={`/admin/articles/${article.id}/edit`} className="min-w-0"><div className="flex flex-wrap items-center gap-3"><span className="eyebrow">{article.category}</span><span className="text-xs text-[#8b929b]">Mis à jour le {new Date(article.updatedAt).toLocaleDateString("fr-FR")}</span></div><h2 className="mt-2 font-display text-2xl font-semibold leading-none">{article.title}</h2><p className="mt-2 text-xs text-[#667384]">Par {article.author}</p></Link><span className={`w-fit px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${article.status === "published" ? "bg-[#dfe9df] text-[#3d5d47]" : article.status === "trashed" ? "bg-[#f3e0d8] text-[#9b5439]" : article.status === "archived" ? "bg-[#ece6da] text-[#667384]" : "bg-[#f3e0d8] text-[#9b5439]"}`}>{statusLabels[article.status as ArticleStatus]}</span><div className="flex flex-wrap items-center gap-3 sm:justify-end">{article.status === "trashed" ? <><button type="button" onClick={() => openAction(article, "restore")} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#3d5d47] hover:text-[#12243b]"><RotateCcw size={14} /> Restaurer</button><button type="button" onClick={() => openAction(article, "purge")} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#9b5439] hover:text-[#12243b]"><Trash2 size={14} /> Purger</button></> : <><Link href={`/admin/articles/${article.id}/edit`} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#b86e4b]"><ArrowUpRight size={14} /> Éditer</Link><button type="button" onClick={() => openAction(article, "trash")} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#9b5439] hover:text-[#12243b]"><Archive size={14} /> Corbeille</button></>}</div></div>)}</div>}
    </div></div>
    {pending && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12243b]/45 p-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="article-action-title" className="w-full max-w-lg bg-[#f7f4ee] p-7 text-[#12243b] shadow-2xl md:p-9"><div className="flex items-start justify-between gap-4"><div className="flex gap-4"><ShieldAlert className="mt-1 shrink-0 text-[#b86e4b]" size={24} /><div><h2 id="article-action-title" className="font-display text-3xl font-semibold leading-tight">{actionTitle}</h2><p className="mt-4 text-sm leading-6 text-[#536174]">{actionDescription}</p></div></div><button type="button" onClick={() => setPending(null)} aria-label="Fermer" className="text-[#667384] hover:text-[#b86e4b]"><X size={20} /></button></div>{requiredPhrase && <label className="mt-6 block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em]">Pour confirmer, saisissez : <strong>{requiredPhrase}</strong></span><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="w-full border border-[rgba(18,36,59,0.2)] bg-[#ece6da] px-3 py-3 text-sm focus:border-[#b86e4b] focus:outline-none" autoFocus /></label>}<div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setPending(null)} className="border border-[rgba(18,36,59,0.2)] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#536174]">Annuler</button><button type="button" disabled={isMutating || (Boolean(requiredPhrase) && confirmation !== requiredPhrase)} onClick={runAction} className="bg-[#9b5439] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-40">{isMutating ? "Traitement…" : pending.action === "trash" ? "Déplacer" : pending.action === "restore" ? "Restaurer" : "Supprimer définitivement"}</button></div></div></div>}
  </AdminLayout>;
}
