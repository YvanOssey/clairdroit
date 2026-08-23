/* Administration éditoriale : vue d’ensemble compacte, priorisant le statut des textes et l’accès à la rédaction. */
import { ArrowUpRight, FileEdit, FileText, Plus, Send } from "lucide-react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";

export default function AdminOverview() {
  const articlesQuery = trpc.articles.adminList.useQuery();
  const articles = articlesQuery.data ?? [];
  const drafts = articles.filter((article) => article.status === "draft").length;
  const published = articles.filter((article) => article.status === "published").length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f7f4ee] text-[#12243b]">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
          <div className="mb-10 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.14)] pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow mb-3">Espace rédaction</p><h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.045em] md:text-6xl">Bonjour, la rédaction.</h1><p className="mt-4 text-sm leading-6 text-[#536174]">Préparez vos prochains textes, relisez les brouillons et gardez un œil sur les publications.</p></div><Link href="/admin/articles/new" className="inline-flex items-center justify-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee] transition hover:bg-[#b86e4b]"><Plus size={16} /> Nouvel article</Link></div>
          <div className="grid gap-4 md:grid-cols-3"><div className="border-t-2 border-[#b86e4b] bg-[#ece6da] p-5"><FileText size={20} className="text-[#b86e4b]" /><p className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-[#667384]">Tous les textes</p><p className="mt-2 font-display text-5xl font-semibold">{articles.length}</p></div><div className="border-t-2 border-[#b86e4b] bg-[#ece6da] p-5"><FileEdit size={20} className="text-[#b86e4b]" /><p className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-[#667384]">Brouillons</p><p className="mt-2 font-display text-5xl font-semibold">{drafts}</p></div><div className="border-t-2 border-[#b86e4b] bg-[#ece6da] p-5"><Send size={20} className="text-[#b86e4b]" /><p className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-[#667384]">Publiés</p><p className="mt-2 font-display text-5xl font-semibold">{published}</p></div></div>
          <section className="mt-12"><div className="mb-5 flex items-end justify-between border-b border-[rgba(18,36,59,0.14)] pb-4"><div><p className="eyebrow mb-2">Activité récente</p><h2 className="font-display text-3xl font-semibold">Vos derniers textes.</h2></div><Link href="/admin/articles" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">Gérer les articles <ArrowUpRight size={15} /></Link></div>{articlesQuery.isLoading ? <div className="py-10 text-sm text-[#667384]">Chargement des textes…</div> : articlesQuery.isError ? <div className="border-l-2 border-[#b86e4b] bg-[#f3e0d8] px-5 py-4 text-sm text-[#9b5439]">Impossible de charger les articles : {articlesQuery.error.message}</div> : articles.length === 0 ? <div className="border border-dashed border-[rgba(18,36,59,0.22)] px-6 py-12 text-center"><p className="font-display text-3xl">Votre index est vide.</p><p className="mt-3 text-sm text-[#667384]">Commencez par rédiger votre premier article juridique.</p><Link href="/admin/articles/new" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">Créer un article <ArrowUpRight size={15} /></Link></div> : <div className="divide-y divide-[rgba(18,36,59,0.14)] border-y border-[rgba(18,36,59,0.14)]">{articles.slice(0, 5).map((article) => <Link key={article.id} href={`/admin/articles/${article.id}/edit`} className="grid gap-3 py-5 transition-colors hover:bg-[#ece6da] sm:grid-cols-[1fr_130px_100px] sm:items-center sm:px-3"><div><p className="eyebrow">{article.category}</p><h3 className="mt-2 font-display text-2xl font-semibold leading-none">{article.title}</h3></div><span className={`w-fit px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${article.status === "published" ? "bg-[#dfe9df] text-[#3d5d47]" : article.status === "archived" ? "bg-[#ece6da] text-[#667384]" : "bg-[#f3e0d8] text-[#9b5439]"}`}>{article.status === "published" ? "Publié" : article.status === "archived" ? "Archivé" : "Brouillon"}</span><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#b86e4b]">Modifier <ArrowUpRight size={14} /></span></Link>)}</div>}</section>
        </div>
      </div>
    </AdminLayout>
  );
}
