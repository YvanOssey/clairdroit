/* Direction « Cabinet éditorial » : lecture longue, marge de contexte et typographie de revue pour faire respirer l’analyse. */
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { articles, fromRemoteArticle, getArticle } from "@/lib/content";
import { trpc } from "@/lib/trpc";

export default function ArticlePage() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug ?? "";
  const remoteQuery = trpc.articles.bySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const article = getArticle(slug) ?? (remoteQuery.data ? fromRemoteArticle(remoteQuery.data) : undefined);

  useEffect(() => {
    if (!article) return;
    document.title = remoteQuery.data?.seoTitle || article.title;
    const description = remoteQuery.data?.seoDescription || article.excerpt;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [article, remoteQuery.data]);

  if (remoteQuery.isLoading && !article) {
    return <PageShell><section className="container py-28"><p className="eyebrow">Chargement de l’analyse…</p></section></PageShell>;
  }

  if (!article) {
    return (
      <PageShell>
        <section className="container py-28"><p className="eyebrow mb-4">404 · Texte introuvable</p><h1 className="font-display text-6xl font-semibold">Cette page a quitté l’index.</h1><Link href="/articles" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">Retour aux analyses <ArrowUpRight size={15} /></Link></section>
      </PageShell>
    );
  }

  const relatedArticles = articles.filter((item) => item.slug !== article.slug).slice(0, 2);

  return (
    <PageShell>
      <article>
        <header className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
          <div className="container py-12 md:py-20">
            <Link href="/articles" className="mb-14 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#667384] transition-colors hover:text-[#b86e4b]"><ArrowLeft size={15} /> Retour aux analyses</Link>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-20">
              <div className="max-w-4xl">
                <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2"><span className="eyebrow">{article.category}</span><span className="text-[#9a8b7d]">•</span><span className="text-xs uppercase tracking-[0.12em] text-[#667384]">{article.eyebrow}</span></div>
                <h1 className="font-display text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-[#12243b]">{article.title}</h1>
                <p className="mt-9 max-w-2xl text-lg leading-8 text-[#3a4b60]">{article.excerpt}</p>
              </div>
              <div className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">
                <p className="eyebrow mb-4">Repères</p>
                <div className="flex items-center gap-2"><Clock3 size={15} className="text-[#b86e4b]" /> {article.readTime} de lecture</div>
                <div className="mt-2">Publié le {article.date}</div>
                <div className="mt-2">Par {article.author}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-20">
            <div>
              <img src={article.image} alt={article.imageAlt} className="aspect-[16/9] w-full object-cover" />
              <div className="mt-12 max-w-3xl">
                {article.sections.map((section, index) => (
                  <section key={section.heading} className="mb-12 last:mb-0">
                    <div className="mb-4 flex items-center gap-3"><span className="font-display text-2xl font-semibold text-[#b86e4b]">0{index + 1}</span><span className="h-px w-10 bg-[#b86e4b]" /></div>
                    <h2 className="font-display text-4xl font-semibold leading-[0.95] tracking-[-0.035em] text-[#12243b]">{section.heading}</h2>
                    {section.image ? <img src={section.image} alt="Illustration intégrée à l’article" className="mt-6 max-h-[520px] w-full object-cover" /> : <p className="mt-5 text-base leading-8 text-[#3f4e60]">{section.body}</p>}
                  </section>
                ))}
              </div>
            </div>

            <aside className="lg:pt-2">
              <div className="sticky top-28 border-t border-[#b86e4b] pt-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#12243b]"><BookOpen size={15} className="text-[#b86e4b]" /> Dans cet article</div>
                <ol className="mt-5 space-y-4 text-sm leading-5 text-[#667384]">
                  {article.sections.map((section, index) => <li key={section.heading} className="flex gap-3"><span className="font-bold text-[#b86e4b]">0{index + 1}</span><span>{section.heading}</span></li>)}
                </ol>
                <div className="mt-10 border-t border-[rgba(18,36,59,0.14)] pt-5"><p className="text-xs leading-5 text-[#667384]">Ce texte propose un éclairage général et ne remplace pas l’analyse d’une situation particulière.</p></div>
              </div>
            </aside>
          </div>
        </div>

        <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#f1ede5]">
          <div className="container py-14 md:py-20"><div className="mb-8 flex items-end justify-between border-b border-[rgba(18,36,59,0.14)] pb-4"><div><p className="eyebrow mb-2">À lire ensuite</p><h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">Poursuivre le fil.</h2></div><Link href="/articles" className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b] sm:flex">Tout l’index <ArrowUpRight size={15} /></Link></div><div className="grid gap-8 md:grid-cols-2">{relatedArticles.map((item) => <Link key={item.slug} href={`/articles/${item.slug}`} className="group grid gap-5 border-t border-[rgba(18,36,59,0.14)] pt-5 sm:grid-cols-[140px_1fr]"><img src={item.image} alt={item.imageAlt} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><div><span className="eyebrow">{item.category}</span><h3 className="mt-2 font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] group-hover:text-[#b86e4b]">{item.title}</h3></div></Link>)}</div></div>
        </section>
      </article>
    </PageShell>
  );
}
