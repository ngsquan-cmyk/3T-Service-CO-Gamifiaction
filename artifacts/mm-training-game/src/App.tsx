import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/game-context";

import Home from "@/pages/home";
import PlayIndex from "@/pages/play/index";
import Results from "@/pages/results";
import Leaderboard from "@/pages/leaderboard";
import ManagerDashboard from "@/pages/manager";
import NotFound from "@/pages/not-found";
import QuickChallenge from "@/pages/quick-challenge";
import SettingsPage from "@/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/play" component={PlayIndex} />
      <Route path="/quick-challenge" component={QuickChallenge} />
      <Route path="/results" component={Results} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/manager" component={ManagerDashboard} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </GameProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
