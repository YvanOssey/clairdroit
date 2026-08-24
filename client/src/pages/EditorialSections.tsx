import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";
import { fromRemoteArticle } from "@/lib/content";
import { trpc } from "@/lib/trpc";

type SectionKey = "actualite" | "vulgarisation" | "analyses";

const sectionCopy: Record<SectionKey, {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  label: string;
}> = {
  actualite: {
    eyebrow: "Actualité juridique",
    titleMain: "Comprendre ce qui",
    titleAccent: "change.",
    description: "Les évolutions juridiques qui comptent, replacées dans leur contexte et traduites en conséquences concrètes.",
    label: "Dernières actualités",
  },
  vulgarisation: {
    eyebrow: "Articles juridiques vulgarisés",
    titleMain: "Le droit,",
    titleAccent: "sans détour.",
    description: "Des articles pédagogiques pour entrer dans les notions juridiques avec des mots simples, des exemples et des repères utiles.",
    label: "À comprendre",
  },
  analyses: {
    eyebrow: "Analyses juridiques",
    titleMain: "Lire entre",
    titleAccent: "les lignes.",
    description: "Des analyses pour prendre du recul, confronter les textes à la pratique et mieux saisir les enjeux contemporains du droit.",
    label: "Le temps de l’analyse",
  },
};

function SectionPage({ section }: { section: SectionKey }) {
  const copy = sectionCopy[section];
  const { data, isLoading, isError } = trpc.articles.published.useQuery();
  const articles = (data ?? []).map(fromRemoteArticle).sort((a, b) => b.date.localeCompare(a.date));
  const visibleArticles = section === "actualite"
    ? articles.slice(0, 4)
    : section === "vulgarisation"
      ? articles.slice(0, 6)
      : articles.filter((article) => ["Droit du travail", "Droit des affaires", "Droit numérique", "Droit public", "Repères juridiques"].includes(article.category));

  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[220px_minmax(0,1fr)] md:items-end md:py-24 lg:gap-20">
          <aside className="border-t border-[#b86e4b] pt-4">
            <p className="eyebrow mb-3">ClairDroit</p>
            <p className="font-display text-6xl font-semibold leading-none text-[#b86e4b]">{visibleArticles.length.toString().padStart(2, "0")}</p>
            <p className="mt-3 max-w-[180px] text-sm leading-6 text-[#536174]">publication{visibleArticles.length > 1 ? "s" : ""} dans cette sélection.</p>
          </aside>
          <div>
            <div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">{copy.eyebrow}</span></div>
            <h1 className="font-display text-6xl font-semibold leading-[0.86] tracking-[-0.055em] md:text-8xl">{copy.titleMain}<br /><em className="font-normal text-[#b86e4b]">{copy.titleAccent}</em></h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-[#536174]">{copy.description}</p>
          </div>
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="mb-10 flex items-end justify-between border-b border-[rgba(18,36,59,0.16)] pb-5"><div><p className="eyebrow mb-3">{copy.label}</p><h2 className="font-display text-4xl font-semibold tracking-[-0.035em]">Une lecture à la fois.</h2></div><span className="text-xs uppercase tracking-[0.12em] text-[#667384]">{visibleArticles.length} résultat{visibleArticles.length > 1 ? "s" : ""}</span></div>
        {isLoading ? <p className="py-10 text-sm text-[#536174]">Chargement des publications…</p> : isError ? <p className="border-l-2 border-[#b86e4b] py-8 pl-5 text-sm text-[#8f4b3e]">Impossible de charger les publications pour le moment.</p> : visibleArticles.length === 0 ? <div className="border-l-2 border-[#b86e4b] py-10 pl-6"><p className="eyebrow mb-3">Bientôt ici</p><p className="font-display text-3xl font-semibold">Cette sélection sera alimentée par les prochaines publications.</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#536174]">Les articles publiés depuis votre panneau d’administration apparaîtront automatiquement dans cette page.</p></div> : <div className="grid gap-x-9 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{visibleArticles.map((article) => <article key={article.slug} className="group"><Link href={`/articles/${article.slug}`} className="mb-5 block overflow-hidden bg-[#ece6da]"><img src={article.image} alt={article.imageAlt} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.035]" /></Link><div className="mb-3 flex flex-wrap items-center gap-2"><span className="eyebrow">{article.category}</span><span className="text-[#9a8b7d]">•</span><span className="text-[0.68rem] uppercase tracking-[0.12em] text-[#667384]">{article.date}</span></div><Link href={`/articles/${article.slug}`}><h2 className="font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] transition-colors group-hover:text-[#b86e4b]">{article.title}</h2></Link><p className="mt-3 text-sm leading-6 text-[#536174]">{article.excerpt}</p><div className="mt-5 flex items-center justify-between border-t border-[rgba(18,36,59,0.14)] pt-4 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#667384]"><span className="flex items-center gap-2"><Clock3 size={14} />{article.readTime}</span><Link href={`/articles/${article.slug}`} aria-label={`Lire : ${article.title}`} className="flex items-center gap-2 text-[#12243b] hover:text-[#b86e4b]">Lire <ArrowUpRight size={15} /></Link></div></article>)}</div>}
      </section>
    </PageShell>
  );
}

export function ActualiteJuridique() { return <SectionPage section="actualite" />; }
export function ArticlesVulgarises() { return <SectionPage section="vulgarisation" />; }
export function AnalysesJuridiques() { return <SectionPage section="analyses" />; }
