/* Direction « Cabinet éditorial » : navigation en marge, filets fins, actions explicites et matière papier sans effets criards. */
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, ChevronRight, Menu, Search, X } from "lucide-react";
import { toast } from "sonner";
import { fromRemoteArticle, searchArticles } from "@/lib/content";
import { trpc } from "@/lib/trpc";

const navItems = [
  { label: "À la une", href: "/" },
  { label: "Décryptages", href: "/articles" },
  { label: "Rubriques", href: "/rubriques/Droit du travail" },
  { label: "À propos", href: "/a-propos" },
];

export function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: publishedArticles } = trpc.articles.published.useQuery();
  const liveArticles = useMemo(() => (publishedArticles ?? []).map(fromRemoteArticle), [publishedArticles]);

  const results = useMemo(() => searchArticles(query, liveArticles), [liveArticles, query]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(18,36,59,0.12)] bg-[#f7f4ee]/95 backdrop-blur-md">
        <div className="container flex min-h-[76px] items-center justify-between gap-6">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Droit de regard, accueil">
            <span className="flex h-10 w-10 items-center justify-center bg-[#12243b] shadow-[4px_4px_0_#b86e4b] transition-transform duration-200 group-hover:-translate-y-0.5">
              <img src="/manus-storage/droit-de-regard-mark_63489c0c.png" alt="" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-display text-[1.65rem] font-semibold leading-none tracking-[-0.03em] text-[#12243b]">
              Droit de regard
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors duration-180 ${
                  isActive(item.href) ? "text-[#b86e4b]" : "text-[#3a4b60] hover:text-[#12243b]"
                }`}
              >
                {item.label}
                {isActive(item.href) && <span className="absolute -bottom-1 left-0 h-px w-full bg-[#b86e4b]" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center text-[#12243b] transition-colors duration-180 hover:bg-[#ece6da] hover:text-[#b86e4b]"
              aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={18} strokeWidth={1.8} /> : <Search size={18} strokeWidth={1.8} />}
            </button>
            <Link
              href="/contact"
              className="hidden border border-[#12243b] px-4 py-2.5 text-[0.69rem] font-bold uppercase tracking-[0.13em] text-[#12243b] transition-all duration-180 hover:bg-[#12243b] hover:text-[#f7f4ee] sm:inline-flex"
            >
              Nous écrire
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center text-[#12243b] lg:hidden"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[rgba(18,36,59,0.12)] bg-[#f7f4ee] lg:hidden">
            <nav className="container flex flex-col py-3" aria-label="Navigation mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between border-b border-[rgba(18,36,59,0.1)] py-4 text-sm font-semibold text-[#12243b] last:border-b-0"
                >
                  {item.label}
                  <ChevronRight size={16} className="text-[#b86e4b]" />
                </Link>
              ))}
              <Link href="/contact" onClick={closeMenu} className="mt-3 bg-[#12243b] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee]">
                Nous écrire
              </Link>
            </nav>
          </div>
        )}

        {searchOpen && (
          <div className="border-t border-[rgba(18,36,59,0.12)] bg-[#ece6da] py-5">
            <div className="container">
              <label htmlFor="site-search" className="eyebrow mb-2 block">Rechercher dans les analyses</label>
              <div className="relative max-w-2xl">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b86e4b]" />
                <input
                  id="site-search"
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ex. données personnelles, travail hybride…"
                  className="w-full border border-[rgba(18,36,59,0.22)] bg-[#f7f4ee] px-12 py-3.5 text-sm text-[#12243b] placeholder:text-[#6e7885] focus:border-[#b86e4b] focus:outline-none"
                />
              </div>
              {query.trim() && (
                <div className="mt-4 max-w-2xl">
                  {results.length > 0 ? (
                    <div className="divide-y divide-[rgba(18,36,59,0.12)] border-y border-[rgba(18,36,59,0.12)]">
                      {results.map((article) => (
                        <Link key={article.slug} href={`/articles/${article.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center justify-between gap-4 py-3 text-sm text-[#12243b] transition-colors hover:text-[#b86e4b]">
                          <span>{article.title}</span>
                          <ArrowUpRight size={15} className="shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="border-y border-[rgba(18,36,59,0.12)] py-3 text-sm text-[#536174]">Aucun résultat. Essayez un autre terme ou une rubrique.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Indiquez une adresse email pour vous inscrire.");
      return;
    }
    toast.success("Merci. Votre inscription est enregistrée pour cette démo.");
    setEmail("");
  };

  return (
    <footer className="mt-24 bg-[#12243b] text-[#f7f4ee]">
      <div className="container grid gap-12 py-14 md:grid-cols-[1.2fr_0.8fr_1fr] md:gap-16">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[#f7f4ee]">
              <img src="/manus-storage/droit-de-regard-mark_63489c0c.png" alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="font-display text-2xl font-semibold">Droit de regard</span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#c6ccd4]">Analyses, repères et décryptages pour lire le droit dans le monde réel.</p>
          <p className="mt-8 text-xs uppercase tracking-[0.15em] text-[#b86e4b]">Le droit, avec un angle</p>
        </div>
        <div>
          <p className="eyebrow mb-5">Explorer</p>
          <div className="flex flex-col gap-3 text-sm text-[#dfe3e7]">
            <Link href="/articles" className="transition-colors hover:text-[#d7a187]">Toutes les analyses</Link>
            <Link href="/rubriques/Numérique" className="transition-colors hover:text-[#d7a187]">Numérique</Link>
            <Link href="/rubriques/Droit du travail" className="transition-colors hover:text-[#d7a187]">Droit du travail</Link>
            <Link href="/a-propos" className="transition-colors hover:text-[#d7a187]">À propos</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5">La lettre de fond</p>
          <p className="mb-4 text-sm leading-6 text-[#c6ccd4]">Une sélection mensuelle pour prendre du recul sur les règles qui nous entourent.</p>
          <form onSubmit={handleSubscribe} className="flex border-b border-[#6d7a89] pb-2">
            <label htmlFor="newsletter-email" className="sr-only">Votre email</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="votre@email.fr"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#f7f4ee] placeholder:text-[#8793a0] focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d7a187] transition-colors hover:text-[#f7f4ee]">
              S’inscrire <ArrowUpRight size={15} />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-[#34455b]">
        <div className="container flex flex-col gap-3 py-5 text-[0.68rem] uppercase tracking-[0.12em] text-[#9ca8b5] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Droit de regard</span>
          <span>Un espace éditorial, pas un avis personnalisé</span>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f4ee] text-[#12243b]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
