import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Analyzer } from "./pages/Analyzer";
import { Results } from "./pages/Results";
import { History } from "./pages/History";
import { About } from "./pages/About";

import { AnalysisResult } from "./types";

const queryClient = new QueryClient();

type ViewState = "dashboard" | "analyzer" | "results" | "history" | "about";

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleAnalysisComplete = (res: AnalysisResult) => {
    setCurrentResult(res);
    setHistory(prev => [res, ...prev]);
    setCurrentView("results");
  };

  const handleOpenResult = (res: AnalysisResult) => {
    setCurrentResult(res);
    setCurrentView("results");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar 
        currentView={currentView} 
        setView={(v) => setCurrentView(v as ViewState)} 
        historyCount={history.length}
      />
      
      <main className="flex-1 overflow-x-hidden">
        {currentView === "dashboard" && (
          <Dashboard onStart={() => setCurrentView("analyzer")} />
        )}
        
        {currentView === "analyzer" && (
          <Analyzer onComplete={handleAnalysisComplete} />
        )}
        
        {currentView === "results" && currentResult && (
          <Results 
            result={currentResult} 
            onNewAnalysis={() => setCurrentView("analyzer")} 
          />
        )}
        
        {currentView === "results" && !currentResult && (
          <div className="p-12 text-center text-muted-foreground">No result selected.</div>
        )}
        
        {currentView === "history" && (
          <History 
            history={history} 
            onOpenResult={handleOpenResult} 
            onClear={() => setHistory([])}
          />
        )}
        
        {currentView === "about" && (
          <About />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
