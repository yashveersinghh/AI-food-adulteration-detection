import React from "react";
import { SpectralPoint } from "../types";

export function SpectraChart({ data }: { data: SpectralPoint[] }) {
  const width = 600;
  const height = 300;
  const padding = 40;

  const minWl = data[0]?.wavelength || 400;
  const maxWl = data[data.length - 1]?.wavelength || 2400;
  
  let maxVal = 0;
  let minVal = 1;
  data.forEach(d => {
    if (d.pure > maxVal) maxVal = d.pure;
    if (d.sample > maxVal) maxVal = d.sample;
    if (d.pure < minVal) minVal = d.pure;
    if (d.sample < minVal) minVal = d.sample;
  });

  // pad Y axis
  maxVal += 0.1;
  minVal = Math.max(0, minVal - 0.1);

  const getX = (wl: number) => padding + ((wl - minWl) / (maxWl - minWl)) * (width - padding * 2);
  const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);

  const purePoints = data.map(d => `${getX(d.wavelength)},${getY(d.pure)}`).join(" ");
  const samplePoints = data.map(d => `${getX(d.wavelength)},${getY(d.sample)}`).join(" ");

  return (
    <div className="w-full overflow-x-auto bg-card rounded-lg border border-border p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[400px]">
        {/* Grid */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-border" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-border" />
        
        {/* Axes Labels */}
        <text x={width / 2} y={height - 5} fill="currentColor" fontSize="12" textAnchor="middle" className="text-muted-foreground">Wavelength (nm)</text>
        <text x={15} y={height / 2} fill="currentColor" fontSize="12" textAnchor="middle" transform={`rotate(-90, 15, ${height/2})`} className="text-muted-foreground">Intensity / Absorbance</text>

        {/* Lines */}
        <polyline points={purePoints} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
        <polyline points={samplePoints} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" />

        {/* Legend */}
        <rect x={width - 120} y={padding} width="10" height="10" fill="#3b82f6" />
        <text x={width - 100} y={padding + 9} fill="currentColor" fontSize="12" className="text-muted-foreground">Pure Ref</text>
        
        <rect x={width - 120} y={padding + 20} width="10" height="10" fill="#a855f7" />
        <text x={width - 100} y={padding + 29} fill="currentColor" fontSize="12" className="text-muted-foreground">Sample</text>
      </svg>
    </div>
  );
}
