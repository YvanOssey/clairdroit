import { Link } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";
import { PageShell } from "@/components/SiteLayout";

const contactEmail = "corinnethio52@gmail.com";
const location = "Cocody, Abidjan, Côte d’Ivoire";

function LegalHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="border-b border-[rgba(18,36,59,0.14)] bg-[#ece6da]">
      <div className="container max-w-4xl py-16 md:py-24">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#667384] transition hover:text-[#b86e4b]"><ArrowLeft size={15} /> Retour à l’accueil</Link>
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#12243b] md:text-7xl">{title}</h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-[#536174]">{intro}</p>
        <p className="mt-8 border-l-2 border-[#b86e4b] bg-[#f7f4ee] px-5 py-4 text-sm leading-6 text-[#667384]"><strong className="text-[#12243b]">Document de travail :</strong> ces informations sont proposées pour structurer le site et doivent être relues et adaptées avant une utilisation définitive, notamment au regard de votre situation personnelle et des règles applicables.</p>
      </div>
    </header>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-[rgba(18,36,59,0.14)] pt-6"><h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#12243b]">{title}</h2><div className="mt-4 space-y-4 text-sm leading-7 text-[#536174]">{children}</div></section>;
}

export function LegalNotice() {
  return <PageShell><LegalHeader eyebrow="Informations du site" title="Mentions légales" intro="Les informations d’identification et de contact de ClairDroit, blog personnel consacré à la compréhension du droit." /><main className="container max-w-4xl space-y-12 py-14 md:py-20">
    <LegalSection title="Éditeur du site"><p>Le site ClairDroit est un blog personnel édité par <strong className="text-[#12243b]">Corinne Thio</strong>.</p><p>Lieu d’établissement déclaré : <strong className="text-[#12243b]">{location}</strong>.</p><p>Adresse de contact : <a className="font-semibold text-[#9b5439] underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></LegalSection>
    <LegalSection title="Activité du site"><p>ClairDroit propose des articles d’actualité juridique, des articles vulgarisés, des analyses juridiques et des conseils liés aux carrières juridiques.</p><p>Les contenus publiés ont une vocation informative et pédagogique. Ils ne constituent pas un avis juridique personnalisé et ne remplacent pas l’accompagnement d’un professionnel habilité.</p></LegalSection>
    <LegalSection title="Hébergement"><p>Les informations relatives à l’hébergeur et aux modalités techniques d’hébergement seront complétées avant la mise en ligne définitive du site.</p></LegalSection>
    <LegalSection title="Propriété intellectuelle"><p>Sauf mention contraire, les textes, éléments graphiques, logo et contenus originaux de ClairDroit sont protégés par les règles applicables à la propriété intellectuelle. Toute reproduction ou réutilisation substantielle doit faire l’objet d’une autorisation préalable.</p><p>Les liens vers des sources externes restent soumis aux conditions et droits de leurs auteurs respectifs.</p></LegalSection>
    <LegalSection title="Contact"><p>Pour signaler une erreur, demander une précision ou poser une question concernant le site, vous pouvez écrire à <a className="font-semibold text-[#9b5439] underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></LegalSection>
    <div className="flex flex-wrap gap-4 border-t border-[rgba(18,36,59,0.14)] pt-8"><Link href="/politique-confidentialite" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f7f4ee] transition hover:bg-[#b86e4b]">Voir la politique de confidentialité <ArrowLeft className="rotate-180" size={15} /></Link><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 border border-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee]"><Mail size={15} /> Écrire à ClairDroit</a></div>
  </main></PageShell>;
}

export function PrivacyPolicy() {
  return <PageShell><LegalHeader eyebrow="Données et confidentialité" title="Politique de confidentialité" intro="Cette page explique, dans une première version, quelles données sont recueillies par ClairDroit et pourquoi elles sont utilisées." /><main className="container max-w-4xl space-y-12 py-14 md:py-20">
    <LegalSection title="Responsable du traitement"><p>Les traitements liés au site sont réalisés sous la responsabilité de <strong className="text-[#12243b]">Corinne Thio</strong>, à l’adresse de contact <a className="font-semibold text-[#9b5439] underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p></LegalSection>
    <LegalSection title="Données recueillies"><p>Lorsque vous utilisez le formulaire « Nous écrire », ClairDroit peut recueillir votre nom, votre adresse email, l’objet et le contenu de votre message.</p><p>Lorsque vous vous inscrivez à la newsletter, seule l’adresse email nécessaire à l’envoi des actualités est enregistrée. Les données d’administration et de sécurité nécessaires au fonctionnement du site peuvent également être traitées.</p></LegalSection>
    <LegalSection title="Finalités"><p>Ces données sont utilisées pour répondre aux messages reçus, gérer les inscriptions à la newsletter, assurer la sécurité du panneau d’administration et améliorer le fonctionnement éditorial du site.</p><p>Elles ne sont pas vendues et ne sont pas utilisées pour envoyer des communications étrangères à ClairDroit.</p></LegalSection>
    <LegalSection title="Conservation et destinataires"><p>Les messages et inscriptions sont conservés pendant la durée nécessaire à leur traitement et à la gestion de la relation avec les lecteurs, puis supprimés ou archivés selon les besoins du site.</p><p>Les données peuvent être transmises aux prestataires techniques strictement nécessaires à l’hébergement, au stockage et à l’envoi des notifications email. Les durées précises et les prestataires concernés devront être confirmés dans la version définitive.</p></LegalSection>
    <LegalSection title="Vos demandes"><p>Pour demander une correction, une suppression ou une information sur vos données, écrivez à <a className="font-semibold text-[#9b5439] underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a> en précisant l’objet de votre demande.</p></LegalSection>
    <LegalSection title="Cookies et mesure d’audience"><p>Le site peut utiliser des cookies techniques nécessaires à la session d’administration. Toute mesure d’audience ou tout service tiers supplémentaire devra être décrit ici avant son activation publique.</p></LegalSection>
    <div className="flex flex-wrap gap-4 border-t border-[rgba(18,36,59,0.14)] pt-8"><Link href="/mentions-legales" className="inline-flex items-center gap-2 bg-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f7f4ee] transition hover:bg-[#b86e4b]">Voir les mentions légales <ArrowLeft className="rotate-180" size={15} /></Link><a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 border border-[#12243b] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#12243b] transition hover:bg-[#12243b] hover:text-[#f7f4ee]"><Mail size={15} /> Poser une question</a></div>
  </main></PageShell>;
}
