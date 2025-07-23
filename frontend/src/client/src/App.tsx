import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CreateEscrow from "@/pages/create-escrow";
import TransactionHistory from "@/pages/history";
import EscrowDetail from "@/pages/escrow-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create" component={CreateEscrow} />
      <Route path="/history" component={TransactionHistory} />
      <Route path="/escrow/:escrowId" component={EscrowDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
