/* Direction « Cabinet éditorial » : les parcours publics restent éditoriaux, tandis que l’administration adopte une structure de travail persistante. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import AdminArticleEditor from "@/pages/AdminArticleEditor";
import AdminArticles from "@/pages/AdminArticles";
import AdminOverview from "@/pages/AdminOverview";
import AdminSiteSettings from "@/pages/AdminSiteSettings";
import AdminInbox from "@/pages/AdminInbox";
import ArticlePage from "@/pages/ArticlePage";
import CategoryPage from "@/pages/CategoryPage";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import { ActualiteJuridique, AnalysesJuridiques, ArticlesVulgarises, CarrieresJuridiques } from "@/pages/EditorialSections";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/actualite-juridique" component={ActualiteJuridique} />
      <Route path="/articles-juridiques" component={ArticlesVulgarises} />
      <Route path="/analyses-juridiques" component={AnalysesJuridiques} />
      {/* Ancienne URL conservée pour les liens existants ; la navigation publique utilise la page dédiée. */}
      <Route path="/articles" component={() => <Redirect to="/articles-juridiques" />} />
      <Route path="/articles/:slug" component={ArticlePage} />
      <Route path="/rubriques/:category" component={CategoryPage} />
      <Route path="/a-propos" component={About} />
      <Route path="/carrieres-juridiques" component={CarrieresJuridiques} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/settings" component={AdminSiteSettings} />
      <Route path="/admin/inbox" component={AdminInbox} />
      <Route path="/admin/articles/:id/edit" component={AdminArticleEditor} />
      <Route path="/admin/articles/new" component={AdminArticleEditor} />
      <Route path="/admin/articles" component={AdminArticles} />
      <Route path="/admin" component={AdminOverview} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
