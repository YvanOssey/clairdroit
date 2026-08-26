/* Direction « Cabinet éditorial » : navigation en marge, filets fins, actions explicites et matière papier sans effets criards. */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  AtSign,
  ChevronRight,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Menu,
  Music2,
  Search,
  X,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { fromRemoteArticle, searchArticles } from "@/lib/content";
import { trpc } from "@/lib/trpc";
import {
  SITE_SETTINGS_DEFAULTS,
  type SocialPlatform,
} from "@shared/siteSettings";

const socialIcons: Record<SocialPlatform, typeof AtSign> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: AtSign,
  tiktok: Music2,
  github: Github,
};

export function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: publishedArticles } = trpc.articles.published.useQuery();
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const settings = {
    ...SITE_SETTINGS_DEFAULTS,
    ...remoteSettings,
    logoUrl: remoteSettings?.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl,
    socialLinks:
      remoteSettings?.socialLinks ?? SITE_SETTINGS_DEFAULTS.socialLinks,
    pageContent:
      remoteSettings?.pageContent ?? SITE_SETTINGS_DEFAULTS.pageContent,
  };
  const editorial = settings.pageContent.editorialPages;
  const pageSeo =
    location === "/mentions-legales"
      ? {
          title: settings.pageContent.legalNotice.title,
          description: settings.pageContent.legalNotice.intro,
        }
      : location === "/politique-confidentialite"
        ? {
            title: settings.pageContent.privacyPolicy.title,
            description: settings.pageContent.privacyPolicy.intro,
          }
        : location === "/a-propos"
          ? {
              title: `${settings.pageContent.about.titleMain} ${settings.pageContent.about.titleAccent}`,
              description: settings.pageContent.about.biography,
            }
          : location === "/carrieres-juridiques"
            ? {
                title: `${settings.pageContent.careersPage.titleMain} ${settings.pageContent.careersPage.titleAccent}`,
                description: settings.pageContent.careersPage.description,
              }
            : location === "/actualite-juridique"
              ? {
                  title: `${editorial.actualite.titleMain} ${editorial.actualite.titleAccent}`,
                  description: editorial.actualite.description,
                }
              : location === "/articles-juridiques"
                ? {
                    title: `${editorial.vulgarisation.titleMain} ${editorial.vulgarisation.titleAccent}`,
                    description: editorial.vulgarisation.description,
                  }
                : location === "/analyses-juridiques"
                  ? {
                      title: `${editorial.analyses.titleMain} ${editorial.analyses.titleAccent}`,
                      description: editorial.analyses.description,
                    }
                  : location === "/articles"
                    ? {
                        title: `${editorial.vulgarisation.titleMain} ${editorial.vulgarisation.titleAccent}`,
                        description: editorial.vulgarisation.description,
                      }
                    : location === "/contact"
                      ? {
                          title: `${settings.pageContent.contact.titleMain} ${settings.pageContent.contact.titleAccent}`,
                          description: settings.pageContent.contact.description,
                        }
                      : location === "/"
                        ? {
                            title: `${settings.pageContent.featured.titleMain} ${settings.pageContent.featured.titleEnd}`,
                            description: settings.homeDescription,
                          }
                        : null;
  useEffect(() => {
    document.title = pageSeo
      ? `${pageSeo.title} — ${settings.siteName}`
      : `${settings.siteName} — ${settings.siteTagline}`;
    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = pageSeo?.description ?? settings.homeDescription;
    const canonicalUrl = `${window.location.origin}${location || "/"}`;
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    const title = pageSeo
      ? `${pageSeo.title} — ${settings.siteName}`
      : `${settings.siteName} — ${settings.siteTagline}`;
    const socialMeta = {
      "og:title": title,
      "og:description": pageSeo?.description ?? settings.homeDescription,
      "og:type": "website",
      "og:url": canonicalUrl,
      "og:site_name": settings.siteName,
      "twitter:title": title,
      "twitter:description": pageSeo?.description ?? settings.homeDescription,
    };
    Object.entries(socialMeta).forEach(([property, content]) => {
      const selector = property.startsWith("twitter:")
        ? `meta[name="${property}"]`
        : `meta[property="${property}"]`;
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (property.startsWith("twitter:")) tag.name = property;
        else tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });
  }, [
    location,
    pageSeo?.title,
    pageSeo?.description,
    settings.siteName,
    settings.siteTagline,
    settings.homeDescription,
  ]);
  const navItems = [
    { label: settings.navHomeLabel, href: "/actualite-juridique" },
    { label: settings.navArticlesLabel, href: "/articles-juridiques" },
    { label: settings.navCategoriesLabel, href: "/analyses-juridiques" },
    { label: settings.navCareersLabel, href: "/carrieres-juridiques" },
    { label: settings.navAboutLabel, href: "/a-propos" },
  ];
  const liveArticles = useMemo(
    () => (publishedArticles ?? []).map(fromRemoteArticle),
    [publishedArticles]
  );

  const results = useMemo(
    () => searchArticles(query, liveArticles),
    [liveArticles, query]
  );

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(18,36,59,0.12)] bg-[#f7f4ee]/95 backdrop-blur-md">
        <div className="container flex min-h-[76px] items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${settings.siteName}, accueil`}
          >
            <span className="flex h-10 w-10 items-center justify-center bg-[#12243b] shadow-[4px_4px_0_#b86e4b] transition-transform duration-200 group-hover:-translate-y-0.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  className="h-7 w-7 object-contain"
                />
              ) : (
                <span
                  className="font-display text-sm font-semibold text-[#f7f4ee]"
                  aria-hidden="true"
                >
                  CD
                </span>
              )}
            </span>
            <span className="font-display text-[1.65rem] font-semibold leading-none tracking-[-0.03em] text-[#12243b]">
              {settings.siteName}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Navigation principale"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors duration-180 ${
                  isActive(item.href)
                    ? "text-[#b86e4b]"
                    : "text-[#3a4b60] hover:text-[#12243b]"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-[#b86e4b]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(open => !open)}
              className="flex h-10 items-center justify-center gap-2 px-2 text-[#12243b] transition-colors duration-180 hover:bg-[#ece6da] hover:text-[#b86e4b] sm:px-3"
              aria-label={
                searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
              }
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X size={18} strokeWidth={1.8} />
              ) : (
                <Search size={18} strokeWidth={1.8} />
              )}
              <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.12em] sm:inline">
                {searchOpen ? "Fermer" : "Rechercher"}
              </span>
            </button>
            <Link
              href="/contact"
              className="hidden border border-[#12243b] px-4 py-2.5 text-[0.69rem] font-bold uppercase tracking-[0.13em] text-[#12243b] transition-all duration-180 hover:bg-[#12243b] hover:text-[#f7f4ee] sm:inline-flex"
            >
              {settings.navContactLabel}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
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
            <nav
              className="container flex flex-col py-3"
              aria-label="Navigation mobile"
            >
              {navItems.map(item => (
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
              <Link
                href="/contact"
                onClick={closeMenu}
                className="mt-3 bg-[#12243b] px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#f7f4ee]"
              >
                {settings.navContactLabel}
              </Link>
            </nav>
          </div>
        )}

        {searchOpen && (
          <div className="border-t border-[rgba(18,36,59,0.12)] bg-[#ece6da] py-5">
            <div className="container">
              <label htmlFor="site-search" className="eyebrow mb-2 block">
                Rechercher dans les analyses
              </label>
              <div className="relative max-w-2xl">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b86e4b]"
                />
                <input
                  id="site-search"
                  type="search"
                  autoFocus
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Ex. données personnelles, travail hybride…"
                  className="w-full border border-[rgba(18,36,59,0.22)] bg-[#f7f4ee] px-12 py-3.5 text-sm text-[#12243b] placeholder:text-[#6e7885] focus:border-[#b86e4b] focus:outline-none"
                />
              </div>
              {query.trim() && (
                <div className="mt-4 max-w-2xl">
                  {results.length > 0 ? (
                    <div className="divide-y divide-[rgba(18,36,59,0.12)] border-y border-[rgba(18,36,59,0.12)]">
                      {results.map(article => (
                        <Link
                          key={article.slug}
                          href={`/articles/${article.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between gap-4 py-3 text-sm text-[#12243b] transition-colors hover:text-[#b86e4b]"
                        >
                          <span>{article.title}</span>
                          <ArrowUpRight size={15} className="shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="border-y border-[rgba(18,36,59,0.12)] py-3 text-sm text-[#536174]">
                      Aucun résultat. Essayez un autre terme ou une rubrique.
                    </p>
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
  const [website, setWebsite] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { data: remoteSettings } = trpc.site.settings.useQuery();
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      setWebsite("");
      toast.success("Votre inscription à la newsletter est confirmée.");
    },
    onError: error => toast.error(error.message),
  });
  const settings = {
    ...SITE_SETTINGS_DEFAULTS,
    ...remoteSettings,
    logoUrl: remoteSettings?.logoUrl ?? SITE_SETTINGS_DEFAULTS.logoUrl,
    socialLinks:
      remoteSettings?.socialLinks ?? SITE_SETTINGS_DEFAULTS.socialLinks,
  };
  const footerNavItems = [
    { label: settings.navHomeLabel, href: "/actualite-juridique" },
    { label: settings.navArticlesLabel, href: "/articles-juridiques" },
    { label: settings.navCategoriesLabel, href: "/analyses-juridiques" },
    { label: settings.navCareersLabel, href: "/carrieres-juridiques" },
    { label: settings.navAboutLabel, href: "/a-propos" },
  ];

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(false);
    subscribe.mutate({ email, website });
  };

  return (
    <footer className="mt-24 bg-[#12243b] text-[#f7f4ee]">
      <div className="container grid gap-12 py-14 md:grid-cols-[1.2fr_0.8fr_1fr] md:gap-16">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[#f7f4ee]">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <span
                  className="font-display text-xs font-semibold text-[#12243b]"
                  aria-hidden="true"
                >
                  CD
                </span>
              )}
            </span>
            <span className="font-display text-2xl font-semibold">
              {settings.siteName}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#c6ccd4]">
            {settings.footerDescription}
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.15em] text-[#b86e4b]">
            {settings.footerKicker}
          </p>
          {settings.socialLinks.filter(social => social.visible && social.url)
            .length > 0 && (
            <div
              className="mt-6 flex flex-wrap gap-3"
              aria-label="Réseaux sociaux"
            >
              {settings.socialLinks
                .filter(social => social.visible && social.url)
                .map(social => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <a
                      key={`${social.platform}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex h-9 w-9 items-center justify-center border border-[#526177] text-[#d7a187] transition-colors hover:border-[#d7a187] hover:bg-[#d7a187] hover:text-[#12243b]"
                    >
                      <Icon size={16} strokeWidth={1.7} />
                    </a>
                  );
                })}
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow mb-5">Explorer</p>
          <div className="flex flex-col gap-3 text-sm text-[#dfe3e7]">
            {footerNavItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[#d7a187]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="eyebrow mb-4 mt-8">Informations</p>
          <div className="flex flex-col gap-3 text-sm text-[#dfe3e7]">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-[#d7a187]"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="transition-colors hover:text-[#d7a187]"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5">{settings.newsletterTitle}</p>
          <p className="mb-4 text-sm leading-6 text-[#c6ccd4]">
            {settings.newsletterDescription}
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex border-b border-[#6d7a89] pb-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Votre email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              placeholder="votre@email.fr"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#f7f4ee] placeholder:text-[#8793a0] focus:outline-none"
            />
            <div
              aria-hidden="true"
              className="absolute -left-[10000px] h-px w-px overflow-hidden"
            >
              <label htmlFor="newsletter-website">Site internet</label>
              <input
                id="newsletter-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={event => setWebsite(event.target.value)}
              />
            </div>
            <button
              disabled={subscribe.isPending}
              type="submit"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d7a187] transition-colors hover:text-[#f7f4ee] disabled:cursor-wait disabled:opacity-60"
            >
              {subscribe.isPending ? "Envoi…" : "S’inscrire"}{" "}
              <ArrowUpRight size={15} />
            </button>
          </form>
          {subscribed && (
            <p role="status" className="mt-3 text-xs text-[#d7a187]">
              Vous êtes bien inscrit à la prochaine édition.
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-[#34455b]">
        <div className="container flex flex-col gap-3 py-5 text-[0.68rem] uppercase tracking-[0.12em] text-[#9ca8b5] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {settings.siteName}</span>
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
