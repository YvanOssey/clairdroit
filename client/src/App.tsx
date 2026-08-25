/* Direction « Cabinet éditorial » : les parcours publics restent éditoriaux, tandis que l’administration adopte une structure de travail persistante. */
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const About = lazy(() => import("@/pages/About"));
const AdminArticleEditor = lazy(() => import("@/pages/AdminArticleEditor"));
const AdminArticles = lazy(() => import("@/pages/AdminArticles"));
const AdminOverview = lazy(() => import("@/pages/AdminOverview"));
const AdminSiteSettings = lazy(() => import("@/pages/AdminSiteSettings"));
const AdminInbox = lazy(() => import("@/pages/AdminInbox"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const Contact = lazy(() => import("@/pages/Contact"));
const Home = lazy(() => import("@/pages/Home"));
const ActualiteJuridique = lazy(async () => ({ default: (await import("@/pages/EditorialSections")).ActualiteJuridique }));
const ArticlesVulgarises = lazy(async () => ({ default: (await import("@/pages/EditorialSections")).ArticlesVulgarises }));
const AnalysesJuridiques = lazy(async () => ({ default: (await import("@/pages/EditorialSections")).AnalysesJuridiques }));
const CarrieresJuridiques = lazy(async () => ({ default: (await import("@/pages/EditorialSections")).CarrieresJuridiques }));
const LegalNotice = lazy(async () => ({ default: (await import("@/pages/LegalPages")).LegalNotice }));
const PrivacyPolicy = lazy(async () => ({ default: (await import("@/pages/LegalPages")).PrivacyPolicy }));

function RouteFallback() {
  return (
    <div className="container flex min-h-[40vh] items-center py-20">
      <p className="eyebrow">Chargement de la page…</p>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/actualite-juridique" component={ActualiteJuridique} />
        <Route path="/articles-juridiques" component={ArticlesVulgarises} />
        <Route path="/analyses-juridiques" component={AnalysesJuridiques} />
        <Route path="/articles" component={() => <Redirect to="/articles-juridiques" />} />
        <Route path="/articles/:slug" component={ArticlePage} />
        <Route path="/a-propos" component={About} />
        <Route path="/carrieres-juridiques" component={CarrieresJuridiques} />
        <Route path="/contact" component={Contact} />
        <Route path="/mentions-legales" component={LegalNotice} />
        <Route path="/politique-confidentialite" component={PrivacyPolicy} />
        <Route path="/admin/settings" component={AdminSiteSettings} />
        <Route path="/admin/inbox" component={AdminInbox} />
        <Route path="/admin/articles/:id/edit" component={AdminArticleEditor} />
        <Route path="/admin/articles/new" component={AdminArticleEditor} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin" component={AdminOverview} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
