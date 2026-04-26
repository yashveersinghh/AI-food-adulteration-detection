import React from "react";
import { ShieldAlert, Microscope, Activity, Cpu, Fingerprint, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Dashboard({ onStart }: { onStart: () => void }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      {/* Hero */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
          <ShieldAlert className="w-4 h-4 mr-2" />
          Research-Grade Adulteration Detection
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance max-w-4xl">
          Secure the food supply chain with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Multimodal AI</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-balance">
          High-precision, multi-sensor analysis for detecting microscopic adulterants in premium agricultural products. Fuse visual, spectral, and chemical data for unparalleled confidence.
        </p>
        <div className="pt-4">
          <Button 
            onClick={onStart} 
            size="lg" 
            className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium text-lg px-8 py-6 h-auto shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            data-testid="button-start-analysis"
          >
            Start Analysis
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: "Analyses Performed", value: "14,208" },
          { label: "Adulterants Found", value: "3,192" },
          { label: "Supported Products", value: "5" },
          { label: "System Uptime", value: "99.99%" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center">
            <span className="text-3xl font-bold text-foreground mb-2">{stat.value}</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">System Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Visual Analysis", icon: <Fingerprint className="w-6 h-6" />, desc: "Microscopic defect detection using advanced computer vision and ResNet-50 backbones." },
            { title: "Spectral Signatures", icon: <Activity className="w-6 h-6" />, desc: "NIR and FTIR spectroscopy to identify chemical anomalies at a molecular level." },
            { title: "Sensor Fusion", icon: <Cpu className="w-6 h-6" />, desc: "Late-stage neural fusion of all modalities to eliminate false positives." },
            { title: "Grad-CAM Explainability", icon: <Microscope className="w-6 h-6" />, desc: "Heatmap generation showing exactly which regions of the sample triggered alerts." },
            { title: "Chemical Sensors", icon: <Database className="w-6 h-6" />, desc: "Real-time integration with pH, moisture, and specialized chemical probes." },
            { title: "Immutable Logging", icon: <ShieldAlert className="w-6 h-6" />, desc: "Cryptographically verifiable run history to ensure supply chain integrity." },
          ].map((cap, i) => (
            <div key={i} className="bg-card/50 border border-border rounded-xl p-6 hover:bg-card hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {cap.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
