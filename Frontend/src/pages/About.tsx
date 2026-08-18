import React from "react";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Database, 
  ShieldCheck, 
  GitBranch, 
  Activity, 
  Binary 
} from "lucide-react";

const SYSTEM_METRICS = [
  { label: "Target Products", value: "5 Essential Commodities" },
  { label: "Fusion Accuracy", value: "N/A" },
  { label: "Inference Latency", value: "N/A" },
  { label: "Modalities", value: "Visual + Spectral + IoT" },
];

const AI_STACK: { category: string; name: string; description: string }[] = [
  { category: "Visual Encoder", name: "ViT-B/16 & EfficientNet-V2", description: "Processes microscopic spatial structures and surface irregularities." },
  { category: "Spectral Encoder", name: "1D-ConvTransformer", description: "Parses high-dimensional NIR/FTIR absorption spectra." },
  { category: "Sensor Encoder", name: "FT-Transformer", description: "Evaluates tabular physical parameters (pH, density, conductivity)." },
  { category: "Cross-Modal Fusion", name: "CMAFN Module", description: "Cross-Attention Fusion Network for weighted multi-sensor alignment." },
  { category: "Multi-Task Heads", name: "Classification & Quantification", description: "Simultaneously predicts adulterant presence, type, and purity %." },
  { category: "Explainability", name: "Grad-CAM & Attention Maps", description: "Generates spatial heatmaps indicating physical/spectral anomaly regions." },
];

const DATASETS: { name: string; description: string; modality: string; size: string }[] = [
  {
    name: "SaffronNet-1k",
    description: "High-resolution microscopic imagery depicting pure saffron vs. adulterants (marigold, safflower, synthetic dyes).",
    modality: "Visual",
    size: "1,200 Samples",
  },
  {
    name: "VanillaSpec-NIR",
    description: "Near-infrared absorption spectra (900–2500 nm) distinguishing natural vanillin from synthetic coumarin.",
    modality: "Spectral",
    size: "8 Geographic Origins",
  },
  {
    name: "NutAflatox-FTIR",
    description: "FTIR spectroscopy annotated with precise quantitative aflatoxin contamination levels in parts-per-billion (ppb).",
    modality: "Spectral",
    size: "Cashew & Pistachio",
  },
  {
    name: "A2Milk-MultiSensor",
    description: "IoT sensor telemetry tracking physical constants (pH, fat %, SNF, density) against lab ground truth.",
    modality: "Sensor",
    size: "A2 Desi Cow Milk",
  },
  {
    name: "FoodGuard-Fusion",
    description: "Proprietary multimodal corpus aligning physical, spectral, and sensor channels for end-to-end evaluation.",
    modality: "Multimodal",
    size: "Aligned Benchmarks",
  },
];

export function About() {
  return (
    <div className="w-full min-h-[calc(100vh-6rem)] bg-[#FAF8F5] text-[#1A1A1A] pb-24 pt-8">
      <div className="max-w-4xl mx-auto px-6 animate-in fade-in duration-500 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto">        
          <h1 className="font-serif-heading text-4xl sm:text-5xl font-normal text-[#111111] tracking-tight mb-3" data-testid="text-about-title">
            About FoodGuard-AI
          </h1>
          
          <p className="text-sm sm:text-base text-black/60 leading-relaxed font-sans">
            A non-destructive multimodal neural system combining computer vision, infrared spectroscopy, and physical telemetry for food purity auditing.
          </p>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SYSTEM_METRICS.map((m) => (
            <div key={m.label} className="bg-white/80 border border-black/5 rounded-2xl p-4 text-center shadow-xs">
              <div className="font-mono font-bold text-lg sm:text-xl text-[#111111] mb-1">
                {m.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-black/50 font-semibold">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* System Architecture */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#111111]">
            <Layers className="w-5 h-5 text-[#E06D53]" />
            <h2 className="font-serif-heading text-2xl font-normal">
              Tri-Modal Architecture
            </h2>
          </div>

          <div className="bg-white/90 border border-black/5 rounded-2xl p-6 sm:p-8 shadow-xs leading-relaxed space-y-5 text-sm text-black/70">
            <p>
              FoodGuard-AI replaces legacy single-point inspections with a **late-stage cross-modal fusion architecture**. By concurrently evaluating visual features, chemical absorption signatures, and physical properties, the model guards against sophisticated adulteration techniques.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1.5">
                <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs uppercase tracking-wider">
                  <Binary className="w-4 h-4 text-[#E06D53]" />
                  <span>1. Visual Branch</span>
                </div>
                <p className="text-xs text-black/60 leading-normal">
                  Processes microscopic camera feeds to detect structural defects, foreign fiber textures, and artificial dyes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1.5">
                <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-[#E06D53]" />
                  <span>2. Spectral Branch</span>
                </div>
                <p className="text-xs text-black/60 leading-normal">
                  Parses 900–2500 nm absorption profiles to identify synthetic chemical compounds (e.g., urea, melamine, coumarin).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1.5">
                <div className="flex items-center gap-2 text-[#111111] font-semibold text-xs uppercase tracking-wider">
                  <GitBranch className="w-4 h-4 text-[#E06D53]" />
                  <span>3. Sensor Branch</span>
                </div>
                <p className="text-xs text-black/60 leading-normal">
                  Ingests tabular IoT readings (pH, electrical conductivity, density) to ensure standard physical limits.
                </p>
              </div>
            </div>

            <div className="p-4 bg-orange-50/50 border border-orange-200/60 rounded-xl text-xs text-[#B55A30] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#E06D53] shrink-0" />
              <span>
                <strong>Explainability Included:</strong> Grad-CAM heatmap overlays pinpoint the exact visual regions triggering adulteration alerts.
              </span>
            </div>
          </div>
        </section>

        {/* Model Stack */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#111111]">
            <Cpu className="w-5 h-5 text-[#E06D53]" />
            <h2 className="font-serif-heading text-2xl font-normal">
              Neural Network Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {AI_STACK.map((item, idx) => (
              <div
                key={`${item.category}-${item.name}-${idx}`}
                className="bg-white/90 border border-black/5 rounded-2xl p-4 shadow-xs hover:border-[#E06D53]/30 transition-colors"
                data-testid={`card-ai-stack-${idx}`}
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#B55A30] mb-0.5">
                  {item.category}
                </div>
                <div className="font-mono text-sm font-semibold text-[#111111] mb-1">
                  {item.name}
                </div>
                <div className="text-xs text-black/60 font-sans">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Datasets */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#111111]">
            <Database className="w-5 h-5 text-[#E06D53]" />
            <h2 className="font-serif-heading text-2xl font-normal">
              Training Datasets
            </h2>
          </div>

          <div className="space-y-3">
            {DATASETS.map((ds, idx) => (
              <div
                key={ds.name}
                className="bg-white/90 border border-black/5 rounded-2xl p-5 shadow-xs hover:border-[#E06D53]/30 transition-colors"
                data-testid={`card-dataset-${idx}`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="font-semibold text-sm text-[#111111] flex items-center gap-2">
                    <span>{ds.name}</span>
                    <span className="text-[10px] font-mono text-black/40">({ds.size})</span>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-black/5 text-[#B55A30]">
                    {ds.modality}
                  </span>
                </div>
                <p className="text-xs text-black/60 leading-relaxed font-sans">{ds.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default About;