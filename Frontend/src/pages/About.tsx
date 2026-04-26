import React from "react";
import { Code2, Cpu, Brain, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AI_STACK: { category: string; name: string }[] = [
  { category: "Visual Encoder", name: "ViT-B/16" },
  { category: "Visual Encoder", name: "EfficientNet-V2" },
  { category: "Spectral Encoder", name: "1D-ConvTransformer" },
  { category: "Sensor Encoder", name: "FT-Transformer" },
  { category: "Cross-Modal Fusion", name: "CMAFN" },
  { category: "Output Heads", name: "Multi-Task Learning" },
  { category: "Explainability", name: "Grad-CAM" },
  { category: "Explainability", name: "Attention Maps" },
];

const DATASETS: { name: string; description: string; modality: string }[] = [
  {
    name: "SaffronNet-1k",
    description: "1,200 high-resolution microscopic images of pure and adulterated saffron threads (marigold, safflower, synthetic colorants).",
    modality: "Visual",
  },
  {
    name: "VanillaSpec-NIR",
    description: "Near-infrared spectra (900–2500 nm) of natural vs. synthetic vanillin / coumarin samples across 8 origins.",
    modality: "Spectral",
  },
  {
    name: "NutAflatox-FTIR",
    description: "FTIR spectra of cashew and pistachio samples annotated with aflatoxin contamination levels (ppb).",
    modality: "Spectral",
  },
  {
    name: "A2Milk-MultiSensor",
    description: "Tabular sensor readings (pH, density, fat %, SNF) from A2 desi cow milk paired with adulteration ground truth.",
    modality: "Sensor",
  },
  {
    name: "FoodGuard-Fusion",
    description: "In-house aligned multimodal corpus combining microscopy, NIR/FTIR spectra, and IoT sensor logs across all 5 supported products.",
    modality: "Multimodal",
  },
];

export function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-about-title">About FoodGuard-AI</h1>
        <p className="text-xl text-muted-foreground">Multimodal AI architecture for next-generation food safety.</p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" />
            The Architecture
          </h2>
          <Card className="bg-card/50">
            <CardContent className="p-6 text-muted-foreground leading-relaxed space-y-4">
              <p>
                FoodGuard-AI demonstrates a theoretical late-stage fusion architecture combining three distinct neural modalities:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                <li><strong className="text-blue-400">Visual Branch:</strong> Transformer and CNN backbones that process microscopic imagery to detect physical anomalies, unexpected structures, or color irregularities.</li>
                <li><strong className="text-purple-400">Spectral Branch:</strong> A 1D Convolutional Transformer designed to parse NIR/FTIR spectroscopic data, identifying chemical signatures of common adulterants (e.g., urea in milk, synthetic dyes in saffron).</li>
                <li><strong className="text-cyan-400">Sensor Data Branch:</strong> A tabular Transformer processing pre-recorded dataset readings (pH, moisture, density).</li>
              </ul>
              <p>
                These modalities are fused via a Cross-Modal Attention Fusion Network, providing a unified confidence score that is significantly more robust than any single-sensor approach.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI/ML Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AI_STACK.map((item, idx) => (
              <div
                key={`${item.category}-${item.name}-${idx}`}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                data-testid={`card-ai-stack-${idx}`}
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {item.category}
                </div>
                <div className="font-mono text-base font-semibold text-foreground">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Datasets Used
          </h2>
          <div className="space-y-3">
            {DATASETS.map((ds, idx) => (
              <div
                key={ds.name}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors"
                data-testid={`card-dataset-${idx}`}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="font-semibold text-foreground">{ds.name}</div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                    {ds.modality}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ds.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Lucide Icons"].map(tech => (
              <div key={tech} className="bg-card border border-border rounded-lg p-4 font-mono text-sm text-center">
                {tech}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
