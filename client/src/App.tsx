/* Direction « Cabinet éditorial » : layout public structuré par une marge de référence, fond ivoire et navigation calme. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import ArticleIndex from "@/pages/ArticleIndex";
import ArticlePage from "@/pages/ArticlePage";
import CategoryPage from "@/pages/CategoryPage";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={ArticleIndex} />
      <Route path="/articles/:slug" component={ArticlePage} />
      <Route path="/rubriques/:category" component={CategoryPage} />
      <Route path="/a-propos" component={About} />
      <Route path="/contact" component={Contact} />
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
