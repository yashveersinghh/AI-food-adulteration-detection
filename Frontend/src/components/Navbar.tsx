import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, LayoutDashboard, Search, Clock, Info } from "lucide-react";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  historyCount: number;
}

export function Navbar({ currentView, setView, historyCount }: NavbarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyzer", label: "Analyzer", icon: Search },
    { id: "history", label: "History", icon: Clock },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 flex justify-center pointer-events-none">
      {/* Floating Capsule Bar */}
      <div className="pointer-events-auto bg-[#FFF8EE]/90 backdrop-blur-md border border-[#F2E3D0] shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 py-2 flex items-center justify-between gap-6 max-w-5xl w-full">
        
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group pl-2" 
          onClick={() => setView("dashboard")}
          data-testid="link-logo"
        >
          <div className="w-7 h-7 rounded-lg bg-[#E06D53]/15 flex items-center justify-center transition-transform group-hover:scale-105">
            <ShieldCheck className="w-4 h-4 text-[#D96B43]" />
          </div>
          <span className="font-serif text-lg tracking-tight text-[#2B231F] font-medium">
            FoodGuard<span className="text-[#D96B43] font-sans text-xs ml-0.5 font-semibold">.AI</span>
          </span>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive 
                    ? "text-[#2B231F] font-semibold" 
                    : "text-[#7C6F64] hover:text-[#2B231F]"
                }`}
                data-testid={`link-nav-${item.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFloatingTab"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-black/5"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D96B43]" : "text-[#A39587]"}`} />
                  {item.label}
                  {item.id === "history" && historyCount > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#D96B43]/15 text-[#D96B43]">
                      {historyCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Soft Orange Gradient Pill CTA */}
        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={() => setView("analyzer")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E87A4F] to-[#D95B32] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_4px_14px_rgba(217,91,50,0.35)] hover:shadow-[0_6px_20px_rgba(217,91,50,0.45)] hover:opacity-95 transition-all cursor-pointer active:scale-98"
          >
            Run Scan
          </button>
        </div>

      </div>
    </header>
  );
}