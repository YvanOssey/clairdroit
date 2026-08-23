/* Administration éditoriale : liste de travail avec recherche rapide, états lisibles et accès direct à l’éditeur. */
import { useMemo, useState } from "react";
import { ArrowUpRight, FileText, Plus, Search } from "lucide-react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";

const statusLabels = { all: "Tous", draft: "Brouillons", published: "Publiés", archived: "Archivés" } as const;

type StatusFilter = keyof typeof statusLabels;

export default function AdminArticles() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const articlesQuery = trpc.articles.adminList.useQuery();
  const filtered = useMemo(() => (articlesQuery.data ?? []).filter((article) => {
    const matchesStatus = status === "all" || article.status === status;
    const haystack = `${article.title} ${article.category} ${article.author}`.toLowerCase();
    return matchesStatus && haystack.includes(query.trim().toLowerCase());
  }), [articlesQuery.data, query, status]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f7f4ee] text-[#12243b]"><div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12"><div className="mb-9 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.14)] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow mb-3">Espace rédaction</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em]">Mes articles.</h1><p className="mt-4 text-sm text-[#536174]">Retrouvez vos textes, quel que soit leur état de publication.</p></div><Link href="/admin/articles/new" className="inline-flex items-center justify-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] transition hover:bg-[#b86e4b]"><Plus size={16} /> Nouvel article</Link></div><div className="mb-7 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]"><label className="relative block"><span className="sr-only">Rechercher un article</span><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b86e4b]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher par titre, rubrique ou auteur" className="w-full border border-[rgba(18,36,59,0.18)] bg-[#ece6da] py-3.5 pl-11 pr-4 text-sm focus:border-[#b86e4b] focus:outline-none" /></label><div className="flex items-center gap-2 overflow-x-auto border-b border-[rgba(18,36,59,0.14)] md:border-b-0">{(Object.keys(statusLabels) as StatusFilter[]).map((key) => <button key={key} type="button" onClick={() => setStatus(key)} className={`whitespace-nowrap border-b-2 px-2 py-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${status === key ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>{statusLabels[key]}</button>)}</div></div>{articlesQuery.isLoading ? <div className="py-14 text-sm text-[#667384]">Chargement des articles…</div> : articlesQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les articles : {articlesQuery.error.message}</div> : filtered.length === 0 ? <div className="border border-dashed border-[rgba(18,36,59,0.22)] px-6 py-16 text-center"><FileText size={24} className="mx-auto text-[#b86e4b]" /><h2 className="mt-5 font-display text-3xl font-semibold">Aucun article dans cette vue.</h2><p className="mt-3 text-sm text-[#667384]">Modifiez votre recherche ou créez un nouveau texte.</p></div> : <div className="divide-y divide-[rgba(18,36,59,0.14)] border-y border-[rgba(18,36,59,0.14)]">{filtered.map((article) => <Link key={article.id} href={`/admin/articles/${article.id}/edit`} className="grid gap-4 px-2 py-5 transition-colors hover:bg-[#ece6da] sm:grid-cols-[minmax(0,1fr)_130px_90px] sm:items-center"><div><div className="flex flex-wrap items-center gap-3"><span className="eyebrow">{article.category}</span><span className="text-xs text-[#8b929b]">Mis à jour le {new Date(article.updatedAt).toLocaleDateString("fr-FR")}</span></div><h2 className="mt-2 font-display text-2xl font-semibold leading-none">{article.title}</h2><p className="mt-2 text-xs text-[#667384]">Par {article.author}</p></div><span className={`w-fit px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${article.status === "published" ? "bg-[#dfe9df] text-[#3d5d47]" : article.status === "archived" ? "bg-[#ece6da] text-[#667384]" : "bg-[#f3e0d8] text-[#9b5439]"}`}>{statusLabels[article.status]}</span><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b]">Éditer <ArrowUpRight size={14} /></span></Link>)}</div>}</div></div>
    </AdminLayout>
  );
}
