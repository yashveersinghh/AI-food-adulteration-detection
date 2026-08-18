import React from "react";
import { LayoutDashboard, Cpu, History, Info } from "lucide-react";

type ViewState = "dashboard" | "analyzer" | "results" | "history" | "about";

interface MobileBottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export function MobileBottomNav({ currentView, setView }: MobileBottomNavProps) {
  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyzer", label: "Analyzer", icon: Cpu },
    { id: "history", label: "History", icon: History },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="md:hidden fixed bottom-2 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="bg-[#FAF8F5]/95 backdrop-blur-xl border border-[#111111]/10 rounded-full px-5 py-2.5 shadow-xl shadow-black/5 flex items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? "text-[#E06D53]"
                  : "text-[#111111]/60 hover:text-[#111111]"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-[#E06D53]" : "text-[#111111]/70"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}