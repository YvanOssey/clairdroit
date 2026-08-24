/* Conseils de parcours et de carrière pour les métiers du droit. */
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { PageShell } from "@/components/SiteLayout";

const subjects = [
  {
    number: "01",
    title: "Construire son parcours",
    body: "Identifier ses intérêts, comprendre les différentes voies et avancer avec des objectifs réalistes.",
  },
  {
    number: "02",
    title: "Développer ses compétences",
    body: "Méthodes de travail, rédaction, recherche juridique et aisance orale : les fondamentaux qui font la différence.",
  },
  {
    number: "03",
    title: "Entrer dans le monde professionnel",
    body: "Préparer un stage, un entretien ou une candidature avec des repères concrets et une présentation claire.",
  },
];

export default function LegalCareers() {
  return (
    <PageShell>
      <section className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_300px] md:items-end md:py-24">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-12 bg-[#b86e4b]" />
              <span className="eyebrow">Tips carrières juridiques</span>
            </div>
            <h1 className="font-display text-6xl font-semibold leading-[0.84] tracking-[-0.055em] md:text-8xl">
              Trouver sa voie
              <br />
              <em className="font-normal text-[#b86e4b]">dans le droit.</em>
            </h1>
          </div>
          <p className="border-l border-[#b86e4b] pl-5 text-sm leading-7 text-[#536174]">
            Des repères simples et utiles pour mieux comprendre les métiers juridiques, préparer son parcours et progresser avec confiance.
          </p>
        </div>
      </section>

      <section className="container grid gap-12 py-16 md:grid-cols-[minmax(0,1fr)_300px] md:py-24 lg:gap-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">Le carnet de parcours</p>
          <h2 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.045em]">
            Des conseils pour
            <br />
            <em className="font-normal text-[#b86e4b]">avancer concrètement.</em>
          </h2>
          <p className="mt-8 text-base leading-8 text-[#3f4e60]">
            Les carrières juridiques sont nombreuses : avocat, juriste d’entreprise, magistrat, notaire, chercheur ou encore chargé de conformité. Cette page rassemble des clés de lecture pour mieux comparer les parcours et faire des choix informés.
          </p>
        </div>

        <aside className="border-t border-[#b86e4b] pt-4">
          <BriefcaseBusiness size={23} className="mb-5 text-[#b86e4b]" />
          <p className="text-sm leading-7 text-[#536174]">
            Une carrière se construit par étapes. L’important est de comprendre les exigences de chaque voie et de trouver celle qui correspond à ses envies.
          </p>
        </aside>
      </section>

      <section className="border-y border-[rgba(18,36,59,0.13)] bg-[#12243b] text-[#f7f4ee]">
        <div className="container grid gap-6 py-16 md:grid-cols-3 md:gap-8 md:py-20">
          {subjects.map((subject) => (
            <article key={subject.number} className="border-t border-[#53647a] pt-4">
              <span className="font-display text-3xl text-[#d7a187]">{subject.number}</span>
              <h2 className="mt-6 font-display text-3xl font-semibold">{subject.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#c6ccd4]">{subject.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container grid gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-24">
        <div>
          <p className="eyebrow mb-5">Avant de commencer</p>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.04em]">
            Quelques repères utiles.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#536174]">
          {["Clarifier son projet avant de choisir une spécialisation.", "Se renseigner auprès de sources officielles et de professionnels.", "Construire progressivement une expérience et un réseau."].map((item) => (
            <p key={item} className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-1 shrink-0 text-[#b86e4b]" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="container flex flex-col gap-6 pb-16 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-[#667384]">
          Vous souhaitez proposer un sujet ou partager une expérience de parcours ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7f4ee] transition duration-180 hover:bg-[#b86e4b]"
        >
          Nous écrire <ArrowUpRight size={16} />
        </Link>
      </section>
    </PageShell>
  );
}
