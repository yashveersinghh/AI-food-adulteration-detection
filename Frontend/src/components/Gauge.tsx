import React from "react";

export function Gauge({ value, label, color = "text-primary" }: { value: number; label: string; color?: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - value * circumference;

  return (
    <div className="flex flex-col items-center justify-center" data-testid={`gauge-${label.toLowerCase()}`}>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth="8"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            className={`stroke-current ${color} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-lg font-bold">{(value * 100).toFixed(1)}%</span>
        </div>
      </div>
      <span className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}
