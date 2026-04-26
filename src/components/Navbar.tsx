import React from "react";
import { Link } from "wouter";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  historyCount: number;
}

export function Navbar({ currentView, setView, historyCount }: NavbarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "analyzer", label: "Analyzer" },
    { id: "history", label: "History" },
    { id: "about", label: "About" },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView("dashboard")}
          data-testid="link-logo"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            FG
          </div>
          <span className="font-bold text-lg tracking-tight">FoodGuard<span className="text-muted-foreground">-AI</span></span>
        </div>

        <div className="hidden md:flex space-x-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 rounded-md text-sm cursor-pointer font-medium transition-colors ${
                currentView === item.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-testid={`link-nav-${item.id}`}
            >
              {item.label}
              {item.id === "history" && historyCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {historyCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
