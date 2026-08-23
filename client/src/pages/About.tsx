/* Direction « Cabinet éditorial » : page manifeste, colonne de texte lisible et détails de marge qui donnent une voix à la revue. */
import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";

export default function About() {
  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24"><div><div className="mb-7 flex items-center gap-3"><span className="h-px w-12 bg-[#b86e4b]" /><span className="eyebrow">À propos de la revue</span></div><h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">Prendre le droit<br /><em className="font-normal text-[#b86e4b]">au sérieux.</em></h1></div><p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">Sans le rendre intimidant. Droit de regard est un espace de lecture pour comprendre ce que les textes produisent dans la vie réelle.</p></div>
      </section>

      <section className="container grid gap-14 py-16 md:grid-cols-[1fr_300px] md:py-24 lg:gap-24"><div className="max-w-2xl"><p className="eyebrow mb-5">Notre intention</p><h2 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em]">Rendre les règles<br />plus <em className="font-normal text-[#b86e4b]">lisibles.</em></h2><div className="mt-8 space-y-6 text-base leading-8 text-[#3f4e60]"><p>Le droit accompagne presque chaque décision importante, mais il reste souvent raconté dans une langue qui éloigne celles et ceux qu’il concerne. Droit de regard part du mouvement inverse : partir des situations, donner un contexte, nommer les limites, puis revenir au texte.</p><p>La revue rassemble des analyses courtes, des décryptages et un lexique pratique. Chaque texte cherche un angle précis plutôt qu’une réponse universelle.</p></div></div><aside className="border-t border-[#b86e4b] pt-4"><Quote size={23} className="mb-5 text-[#b86e4b]" /><p className="font-display text-2xl leading-[1.15]">« Expliquer n’est pas simplifier à outrance. C’est choisir le bon point d’entrée. »</p><p className="mt-5 text-xs uppercase tracking-[0.12em] text-[#667384]">— La ligne de Droit de regard</p></aside></section>

      <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#12243b] text-[#f7f4ee]"><div className="container grid gap-10 py-16 md:grid-cols-3 md:gap-8 md:py-20">{[{ number: "01", title: "Un angle", body: "Chaque texte commence par une question concrète, pas par une accumulation de références." }, { number: "02", title: "Des repères", body: "Dates, notions et limites sont visibles pour que la lecture reste vérifiable." }, { number: "03", title: "Une distance", body: "La revue informe et met en perspective ; elle ne remplace pas un conseil adapté à une situation." }].map((item) => <div key={item.number} className="border-t border-[#53647a] pt-4"><span className="font-display text-3xl text-[#d7a187]">{item.number}</span><h2 className="mt-6 font-display text-3xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#c6ccd4]">{item.body}</p></div>)}</div></section>

      <section className="container flex flex-col gap-6 py-16 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow mb-3">Pour aller plus loin</p><h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">Entrer dans les textes.</h2></div><Link href="/articles" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]">Lire les analyses <ArrowUpRight size={16} /></Link></section>
    </PageShell>
  );
}
