import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import MinecraftHosting from "@/pages/minecraft-hosting";
import VpsHosting from "@/pages/vps-hosting";
import RdpHosting from "@/pages/rdp-hosting";
import Docs from "@/pages/docs";
import Admin from "@/pages/admin";
import DDoSPage from "@/pages/ddos";
import ReviewsPage from "@/pages/reviews";

const queryClient = new QueryClient();

// Scroll to top on every route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/minecraft-hosting" component={MinecraftHosting} />
        <Route path="/vps-hosting" component={VpsHosting} />
        <Route path="/rdp-hosting" component={RdpHosting} />
        <Route path="/docs" component={Docs} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/:section" component={Admin} />
        <Route path="/ddos" component={DDoSPage} />
        <Route path="/reviews" component={ReviewsPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
