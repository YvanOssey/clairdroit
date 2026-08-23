/* Direction « Cabinet éditorial » : état vide utile, typographie de revue et retour explicite vers le contenu. */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";

export default function NotFound() {
  return (
    <PageShell>
      <section className="container grid min-h-[55vh] items-center py-24 md:grid-cols-[1fr_300px] md:gap-20"><div><p className="eyebrow mb-5">404 · Page introuvable</p><h1 className="font-display text-7xl font-semibold leading-[0.82] tracking-[-0.06em] md:text-9xl">Cette page<br /><em className="font-normal text-[#b86e4b]">a disparu.</em></h1></div><div className="border-l border-[#b86e4b] pl-5"><p className="text-sm leading-7 text-[#536174]">Le lien que vous avez suivi ne figure plus dans l’index. Les textes, eux, sont toujours là.</p><Link href="/articles" className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b86e4b]">Retourner aux analyses <ArrowUpRight size={15} /></Link></div></section>
    </PageShell>
  );
}
