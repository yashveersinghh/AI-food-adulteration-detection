import React from "react";

export function Heatmap({ data, colorScheme = "warm" }: { data: number[][]; colorScheme?: "warm" | "cool" }) {
  // simple color mapping
  const getColor = (val: number) => {
    if (colorScheme === "warm") {
      // dark blue -> cyan -> green -> yellow -> red
      const h = (1.0 - val) * 240; // 240 is blue, 0 is red
      return `hsl(${h}, 100%, 50%)`;
    } else {
      // purple -> pink -> white
      const l = 20 + val * 80;
      return `hsl(300, 80%, ${l}%)`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div 
        className="grid gap-0 border border-border rounded overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${data[0]?.length || 14}, minmax(0, 1fr))` }}
      >
        {data.map((row, i) => (
          row.map((val, j) => (
            <div 
              key={`${i}-${j}`} 
              className="w-full aspect-square"
              style={{ backgroundColor: getColor(val), opacity: 0.8 }}
              title={(val * 100).toFixed(1) + "%"}
            />
          ))
        ))}
      </div>
      <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
        <span>Low</span>
        <div className="h-2 flex-1 rounded-full bg-gradient-to-r" 
          style={{ 
            backgroundImage: colorScheme === "warm" 
              ? `linear-gradient(to right, hsl(240,100%,50%), hsl(120,100%,50%), hsl(0,100%,50%))` 
              : `linear-gradient(to right, hsl(300,80%,20%), hsl(300,80%,100%))`
          }} 
        />
        <span>High</span>
      </div>
    </div>
  );
}
