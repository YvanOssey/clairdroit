/* Page d’accueil de ClairDroit : présentation de la ligne éditoriale, accès aux sélections et dernières publications. */
import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Clock3, FileText } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { Article, fromRemoteArticle } from "@/lib/content";
import { trpc } from "@/lib/trpc";
import { SITE_SETTINGS_DEFAULTS } from "@shared/siteSettings";

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group grid gap-5 border-t border-[rgba(18,36,59,0.16)] py-7 md:grid-cols-[150px_1fr] md:gap-7" style={{ animationDelay: `${index * 70}ms` }}>
      <Link href={`/articles/${article.slug}`} className="block overflow-hidden bg-[#ece6da]">
        <img src={article.image} alt={article.imageAlt} className="aspect-[4/3] h-full w-full object-cover grayscale-[12%] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0" />
      </Link>
      <div className="flex flex-col justify-between gap-5">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="eyebrow">{article.category}</span>
            <span className="text-[#9a8b7d]">•</span>
            <span className="text-[0.68rem] uppercase tracking-[0.12em] text-[#667384]">{article.date}</span>
          </div>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="font-display text-[1.75rem] font-semibold leading-[0.98] tracking-[-0.025em] text-[#12243b] transition-colors duration-180 group-hover:text-[#b86e4b] md:text-[2rem]">{article.title}</h3>
          </Link>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#536174]">{article.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#667384]">
          <span className="flex items-center gap-2"><Clock3 size={14} strokeWidth={1.8} /> {article.readTime} de lecture</span>
          <Link href={`/articles/${article.slug}`} className="flex items-center gap-2 text-[#12243b] transition-colors hover:text-[#b86e4b]">Lire <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const publishedQuery = trpc.articles.published.useQuery();
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = { ...SITE_SETTINGS_DEFAULTS, ...remoteSettings, logoUrl: remoteSettings?.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl, pageContent: remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent };
  const { featured } = settings.pageContent;
  const liveArticles = useMemo(() => (publishedQuery.data ?? []).map(fromRemoteArticle), [publishedQuery.data]);
  const featuredArticle = liveArticles[0];
  const latestArticles = liveArticles.slice(1);
  const totalReadMinutes = liveArticles.reduce((sum, article) => sum + Number.parseInt(article.readTime, 10), 0);

  return (
    <PageShell>
      <section className="paper-grain filigrane border-b border-[rgba(18,36,59,0.13)] bg-[#ece6da]">
        <div className="container grid min-h-[580px] gap-12 py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:gap-20 lg:py-24">
          <div className="relative z-10 max-w-3xl animated-enter">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-12 bg-[#b86e4b]" />
              <span className="eyebrow">{settings.homeEyebrow}</span>
            </div>
            <h1 className="font-display text-[clamp(3.8rem,8vw,7.8rem)] font-semibold leading-[0.78] tracking-[-0.065em] text-[#12243b]">
              {settings.homeTitleMain}<br /><em className="font-normal text-[#b86e4b]">{settings.homeTitleAccent}</em> {settings.homeTitleEnd}
            </h1>
            <p className="mt-10 max-w-xl text-[1.05rem] leading-8 text-[#3a4b60] md:text-lg">{settings.homeDescription}</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/actualite-juridique" className="group inline-flex items-center gap-3 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]">
                {settings.homePrimaryCta} <ArrowUpRight size={16} className="transition-transform duration-180 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#derniere-lecture"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById("derniere-lecture")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", "#derniere-lecture");
                }}
                className="inline-flex items-center gap-2 border-b border-[#b86e4b] pb-1 text-xs font-bold uppercase tracking-[0.13em] text-[#12243b] transition-colors hover:text-[#b86e4b]"
              >
                {settings.homeSecondaryCta} <ArrowDownRight size={15} />
              </a>
            </div>
          </div>

          <aside className="relative z-10 border-l border-[#b86e4b] pl-6 pt-2 lg:mt-20" aria-label="Repères de la revue">
            <p className="eyebrow mb-8">Le numéro du moment</p>
            <div className="space-y-7">
              <div>
                <span className="font-display text-5xl font-semibold text-[#b86e4b]">{liveArticles.length.toString().padStart(2, "0")}</span>
                <p className="mt-1 text-sm leading-6 text-[#536174]">publication{liveArticles.length > 1 ? "s" : ""} actuellement disponible{liveArticles.length > 1 ? "s" : ""}.</p>
              </div>
              <div className="editorial-rule" />
              <div>
                <span className="font-display text-5xl font-semibold text-[#b86e4b]">{totalReadMinutes}</span>
                <p className="mt-1 text-sm leading-6 text-[#536174]">minutes de lecture dans vos publications.</p>
              </div>
              <div className="editorial-rule" />
              <div className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#12243b]"><FileText size={16} className="text-[#b86e4b]" /> Édition en cours</div>
            </div>
          </aside>
        </div>
      </section>

      <section id="derniere-lecture" className="container scroll-mt-24 py-20 lg:py-28">
        <div className="mb-10 flex flex-col gap-4 border-b border-[rgba(18,36,59,0.16)] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">{featured.eyebrow}</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-[#12243b] md:text-5xl">{featured.titleMain}<br className="hidden sm:block" /> {featured.titleEnd}</h2>
          </div>
          <span className="max-w-xs text-sm leading-6 text-[#667384] sm:text-right">{featured.description}</span>
        </div>
        {featuredArticle ? <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
          <Link href={`/articles/${featuredArticle.slug}`} className="group relative block overflow-hidden bg-[#12243b]">
            <img src={featuredArticle.image} alt={featuredArticle.imageAlt} className="aspect-[16/10] w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12243b]/90 via-[#12243b]/10 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-2xl p-6 text-[#f7f4ee] sm:p-9">
              <span className="eyebrow text-[#d7a187]">{featuredArticle.eyebrow}</span>
              <h3 className="mt-3 font-display text-4xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-5xl">{featuredArticle.title}</h3>
              <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[#d7dadd]">{featuredArticle.date} <span className="text-[#d7a187]">•</span> {featuredArticle.readTime} de lecture <ArrowUpRight size={15} className="text-[#d7a187]" /></div>
            </div>
          </Link>
          <div className="border-l border-[#b86e4b] pl-6 lg:pl-8">
            <p className="font-display text-2xl leading-[1.15] text-[#12243b]">{featured.quote}</p>
            <p className="mt-6 text-sm leading-7 text-[#536174]">{featured.detail}</p>
            <Link href={`/articles/${featuredArticle.slug}`} className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b] hover:text-[#12243b]">{featured.linkLabel} <ArrowUpRight size={15} /></Link>
          </div>
        </div> : <div className="border-l border-[#b86e4b] py-10 pl-6"><p className="eyebrow mb-3">{featured.emptyEyebrow}</p><p className="font-display text-3xl font-semibold">{featured.emptyTitle}</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#536174]">{featured.emptyDescription}</p></div>}
      </section>


      <section className="container py-20 lg:py-28">
        <div className="mb-4 flex items-center justify-between border-b border-[rgba(18,36,59,0.16)] pb-4">
          <div>
            <p className="eyebrow mb-2">Le fil de lecture</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">À garder sous la main.</h2>
          </div>
          <span className="hidden text-xs font-bold uppercase tracking-[0.12em] text-[#667384] sm:block">Dernières publications</span>
        </div>
        <div>
          {latestArticles.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
        </div>
      </section>
    </PageShell>
  );
}
