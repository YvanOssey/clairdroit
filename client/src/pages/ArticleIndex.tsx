/* Index public alimenté exclusivement par les articles publiés depuis l’administration. */
import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { filterArticlesByEditorialSection, fromRemoteArticle, type EditorialSection } from "@/lib/content";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

export default function ArticleIndex() {
  const [activeSection, setActiveSection] = useState<"Toutes" | EditorialSection>("Toutes");
  const publishedQuery = trpc.articles.published.useQuery();
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = { ...SITE_SETTINGS_DEFAULTS, ...remoteSettings, pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent };
  const { decryptions } = settings.pageContent;
  const liveArticles = useMemo(() => (publishedQuery.data ?? []).map(fromRemoteArticle), [publishedQuery.data]);
  const filteredArticles = useMemo(
    () => activeSection === "Toutes" ? liveArticles : filterArticlesByEditorialSection(liveArticles, activeSection),
    [activeSection, liveArticles],
  );

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-12 py-16 md:grid-cols-[230px_minmax(0,1fr)] md:items-end md:py-24 lg:gap-20">
          <aside className="border-t border-[#b86e4b] pt-4 md:mb-2"><p className="eyebrow mb-3">{decryptions.filterEyebrow}</p><p className="font-display text-6xl font-semibold leading-none text-[#b86e4b]">{liveArticles.length.toString().padStart(2, "0")}</p><p className="mt-3 max-w-[180px] text-sm leading-6 text-[#536174]">publication{liveArticles.length > 1 ? "s" : ""} actuellement disponible{liveArticles.length > 1 ? "s" : ""}.</p><div className="mt-6 h-px w-full bg-[rgba(18,36,59,0.18)]" /><p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#667384]">Index éditorial</p></aside>
          <div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">{decryptions.eyebrow}</span></div><h1 className="font-display text-6xl font-semibold leading-[0.86] tracking-[-0.055em] md:text-8xl">{decryptions.titleMain}<br /><em className="font-normal text-[#b86e4b]">{decryptions.titleAccent}</em></h1><p className="mt-8 max-w-xl text-base leading-7 text-[#536174]">{decryptions.description}</p></div>
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="mb-10 flex flex-col gap-5 border-b border-[rgba(18,36,59,0.16)] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="eyebrow mb-3">{decryptions.filterEyebrow}</p><div className="flex flex-wrap gap-x-5 gap-y-3" role="group" aria-label="Filtrer les articles par page éditoriale"><button type="button" onClick={() => setActiveSection("Toutes")} className={`border-b pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${activeSection === "Toutes" ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>Toutes</button>{([ ["actualite", "Actualités juridiques"], ["vulgarisation", "Articles vulgarisés"], ["analyses", "Analyses juridiques"], ["carrieres", "Tips carrières" ] ] as const).map(([section, label]) => <button key={section} type="button" onClick={() => setActiveSection(section)} className={`border-b pb-1 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${activeSection === section ? "border-[#b86e4b] text-[#b86e4b]" : "border-transparent text-[#667384] hover:text-[#12243b]"}`}>{label}</button>)}</div></div><span className="text-xs uppercase tracking-[0.12em] text-[#667384]">{filteredArticles.length} résultat{filteredArticles.length > 1 ? "s" : ""}</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="border-l-2 border-[#b86e4b] py-10 pl-6"><p className="eyebrow mb-3">{decryptions.emptyEyebrow}</p><p className="font-display text-3xl font-semibold">{decryptions.emptyTitle}</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#536174]">{decryptions.emptyDescription}</p></div>
        ) : (
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
        )}
      </section>
    </PageShell>
  );
}
