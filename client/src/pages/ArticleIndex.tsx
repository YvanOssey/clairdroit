/* Direction « Cabinet éditorial » : index structuré comme un dossier de revue, avec preuve éditoriale en premier et rail de contexte latéral. */
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { articles, categories, fromRemoteArticle } from "@/lib/content";
import { trpc } from "@/lib/trpc";

export default function ArticleIndex() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const publishedQuery = trpc.articles.published.useQuery();
  const liveArticles = useMemo(() => (publishedQuery.data ?? []).map(fromRemoteArticle), [publishedQuery.data]);
  const allArticles = useMemo(() => [...liveArticles, ...articles], [liveArticles]);
  const filteredArticles = useMemo(
    () => activeCategory === "Toutes" ? allArticles : allArticles.filter((article) => article.category === activeCategory),
    [activeCategory, allArticles],
  );

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-12 py-16 md:grid-cols-[230px_minmax(0,1fr)] md:items-end md:py-24 lg:gap-20">
          <aside className="border-t border-[#b86e4b] pt-4 md:mb-2"><p className="eyebrow mb-6">Dossier de lecture</p><p className="font-display text-6xl font-semibold leading-none text-[#b86e4b]">04</p><p className="mt-3 max-w-[180px] text-sm leading-6 text-[#536174]">rubriques pour replacer chaque analyse dans son contexte.</p><div className="mt-6 h-px w-full bg-[rgba(18,36,59,0.18)]" /><p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#667384]">Édition août 2026</p></aside>
          <div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">Le fil de lecture</span></div><h1 className="font-display text-6xl font-semibold leading-[0.86] tracking-[-0.055em] md:text-8xl">Toutes les<br /><em className="font-normal text-[#b86e4b]">analyses.</em></h1><p className="mt-8 max-w-xl text-base leading-7 text-[#536174]">Des textes courts pour éclairer une règle, une pratique ou une question qui revient dans le monde réel.</p></div>
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.16)] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="eyebrow mb-3">Filtrer l’index</p><div className="flex flex-wrap gap-x-5 gap-y-3" role="group" aria-label="Filtrer les articles par rubrique"><button type="button" onClick={() => setActiveCategory("Toutes")} className={`border-b pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${activeCategory === "Toutes" ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>Toutes</button>{categories.map((category) => <button key={category.name} type="button" onClick={() => setActiveCategory(category.name)} className={`border-b pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${activeCategory === category.name ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>{category.name}</button>)}</div></div><span className="text-xs uppercase tracking-[0.12em] text-[#667384]">{filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}</span>
        </div>

        <div className="grid gap-x-9 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <article key={article.slug} className="group animated-enter" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2"><span className="eyebrow">{article.category}</span><span className="text-[#9a8b7d]">•</span><span className="text-[0.68rem] uppercase tracking-[0.12em] text-[#667384]">{article.date}</span></div>
              <Link href={`/articles/${article.slug}`} className="mb-5 block overflow-hidden bg-[#ece6da]"><img src={article.image} alt={article.imageAlt} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.035]" /></Link>
              <Link href={`/articles/${article.slug}`}><h2 className="font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] text-[#12243b] transition-colors group-hover:text-[#b86e4b]">{article.title}</h2></Link>
              <p className="mt-3 text-sm leading-6 text-[#536174]">{article.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[rgba(18,36,59,0.14)] pt-4 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#667384]"><span>{article.author}</span><span className="flex items-center gap-2"><Clock3 size={14} />{article.readTime}</span><Link href={`/articles/${article.slug}`} aria-label={`Lire : ${article.title}`} className="flex items-center gap-2 text-[#12243b] hover:text-[#b86e4b]">Lire <ArrowUpRight size={15} /></Link></div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
