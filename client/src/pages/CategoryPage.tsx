/* Rubrique alimentée exclusivement par les publications administrées. */
import { useMemo } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link, useRoute } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { categories, fromRemoteArticle } from "@/lib/content";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function CategoryPage() {
  const [, params] = useRoute("/rubriques/:category");
  const categoryName = decodeURIComponent(params?.category ?? "");
  const publishedQuery = trpc.articles.published.useQuery();
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = { ...SITE_SETTINGS_DEFAULTS, ...remoteSettings, pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent };
  const { rubrics } = settings.pageContent;
  const liveArticles = useMemo(() => (publishedQuery.data ?? []).map(fromRemoteArticle), [publishedQuery.data]);
  const categoryArticles = liveArticles.filter((article) => article.category === categoryName);

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24">
          <div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">{rubrics.eyebrow} · {categoryName}</span></div><h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">{rubrics.titleMain}<br /><em className="font-normal text-[#b86e4b]">{rubrics.titleAccent}</em></h1></div>
          <div className="border-l border-[#b86e4b] pl-5"><p className="font-display text-2xl leading-[1.15] text-[#12243b]">{rubrics.intro}</p><p className="mt-5 text-sm leading-6 text-[#536174]">{categoryArticles.length} publication{categoryArticles.length > 1 ? "s" : ""} actuellement visible{categoryArticles.length > 1 ? "s" : ""}.</p></div>
        </div>
      </section>

      <section className="container grid gap-14 py-16 md:grid-cols-[1fr_230px] lg:py-24">
        <div>
          <div className="mb-8 flex items-end justify-between border-b border-[rgba(18,36,59,0.16)] pb-4"><div><p className="eyebrow mb-2">{rubrics.selectionEyebrow}</p><h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">{rubrics.selectionTitle}</h2></div><span className="text-xs uppercase tracking-[0.12em] text-[#667384]">{categoryArticles.length} texte{categoryArticles.length > 1 ? "s" : ""}</span></div>
          <div className="divide-y divide-[rgba(18,36,59,0.15)]">
            {categoryArticles.length > 0 ? categoryArticles.map((article) => <Link key={article.slug} href={`/articles/${article.slug}`} className="group grid gap-5 py-7 sm:grid-cols-[150px_1fr] md:gap-7"><img src={article.image} alt={article.imageAlt} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.025]" /><div><div className="mb-3 flex items-center gap-3"><span className="eyebrow">{article.eyebrow}</span><span className="text-[#9a8b7d]">•</span><span className="text-[0.68rem] uppercase tracking-[0.12em] text-[#667384]">{article.date}</span></div><h3 className="font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] group-hover:text-[#b86e4b]">{article.title}</h3><p className="mt-3 text-sm leading-6 text-[#536174]">{article.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">Lire l’analyse <ArrowUpRight size={15} /></span></div></Link>) : <div className="border-l-2 border-[#b86e4b] py-10 pl-6"><p className="eyebrow mb-3">{rubrics.emptyEyebrow}</p><p className="font-display text-3xl font-semibold">{rubrics.emptyTitle}</p></div>}
          </div>
        </div>
        <aside className="border-t border-[#b86e4b] pt-4"><p className="eyebrow mb-6">Toutes les rubriques</p><nav className="flex flex-col" aria-label="Toutes les rubriques">{categories.map((item) => <Link key={item.name} href={`/rubriques/${item.name}`} className={`flex items-center justify-between border-b border-[rgba(18,36,59,0.13)] py-3 text-sm transition-colors ${item.name === categoryName ? "font-bold text-[#b86e4b]" : "text-[#536174] hover:text-[#12243b]"}`}>{item.name}<ChevronRight size={15} /></Link>)}</nav></aside>
      </section>
    </PageShell>
  );
}
