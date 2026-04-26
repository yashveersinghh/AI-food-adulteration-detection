import React from "react";
import { format } from "date-fns";
import { ShieldCheck, ShieldAlert, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { AnalysisResult } from "../types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from "../components/Gauge";
import { Heatmap } from "../components/Heatmap";
import { SpectraChart } from "../components/SpectraChart";

export function Results({ result, onNewAnalysis }: { result: AnalysisResult, onNewAnalysis: () => void }) {
  const isPure = !result.isAdulterated;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground font-mono">ID: {result.id} • {format(new Date(result.timestamp), "PP HH:mm:ss")}</p>
          <h1 className="text-3xl font-bold">{result.product} Analysis</h1>
        </div>
        <Button variant="outline" onClick={onNewAnalysis} data-testid="button-new-analysis">
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 mb-8 space-x-6">
          {["Overview", "Grad-CAM", "Attention", "Spectra", "Details"].map(tab => (
            <TabsTrigger 
              key={tab}
              value={tab.toLowerCase()}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-none"
              data-testid={`tab-${tab.toLowerCase()}`}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-300">
          {/* Verdict Banner */}
          <div className={`p-8 rounded-2xl border ${
            isPure 
              ? "bg-green-950/20 border-green-900/50" 
              : "bg-red-950/20 border-red-900/50"
          }`}>
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-full ${isPure ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                {isPure ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${isPure ? "text-green-500" : "text-red-500"}`}>
                  {isPure ? "Sample Authenticated" : "Adulteration Detected"}
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                    <p className="text-3xl font-mono font-bold">{(result.confidence * 100).toFixed(2)}%</p>
                  </div>
                  {!isPure && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Detected Substance</p>
                        <p className="text-xl font-bold text-foreground">{result.adulterantType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Estimated Concentration</p>
                        <p className="text-xl font-bold text-foreground">{result.adulterationPct.toFixed(1)}%</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gauges & Image */}
          <div className="grid md:grid-cols-12 gap-8">
            {result.imageDataUrl && (
              <div className="md:col-span-5 bg-card border border-border rounded-xl p-4 flex flex-col">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">Visual Input</h3>
                <div className="flex-1 bg-black/50 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={result.imageDataUrl} alt="Sample" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
            )}
            
            <div className={`bg-card border border-border rounded-xl p-8 ${result.imageDataUrl ? 'md:col-span-7' : 'md:col-span-12'}`}>
              <h3 className="text-sm font-medium mb-8 text-muted-foreground">Modality Confidences</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Gauge value={result.modalResults.visual} label="Visual" color="text-blue-500" />
                <Gauge value={result.modalResults.spectral} label="Spectral" color="text-purple-500" />
                <Gauge value={result.modalResults.sensor} label="Sensor" color="text-cyan-500" />
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
                  <Gauge value={result.modalResults.fused} label="Fused" color="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grad-cam" className="animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Grad-CAM Localization</h2>
              <p className="text-muted-foreground">Highlights regions in the sample that contributed most heavily to the network's visual decision.</p>
            </div>
            <Heatmap data={result.gradCamData} colorScheme="warm" />
          </div>
        </TabsContent>

        <TabsContent value="attention" className="animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Cross-Modal Attention</h2>
              <p className="text-muted-foreground">Spatial distribution of attention weights during late-stage sensor fusion.</p>
            </div>
            <Heatmap data={result.attentionWeights} colorScheme="cool" />
          </div>
        </TabsContent>

        <TabsContent value="spectra" className="animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Spectral Signatures</h2>
              <p className="text-muted-foreground">Comparison of sample spectrum against the baseline pure reference curve.</p>
            </div>
            <SpectraChart data={result.spectralData} />
          </div>
        </TabsContent>

        <TabsContent value="details" className="animate-in fade-in duration-300">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Raw Inference Output</h3>
              <div className="bg-black rounded-lg p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-xs font-mono text-green-400">
                  {JSON.stringify(result.rawJson, null, 2)}
                </pre>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Model Topology</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">Visual Encoder</span>
                    <span className="font-mono">768d (ResNet)</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">Spectral Encoder</span>
                    <span className="font-mono">512d (1D-CNN)</span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">Sensor Encoder</span>
                    <span className="font-mono">64d (MLP)</span>
                  </li>
                  <li className="flex justify-between items-center pt-2">
                    <span className="font-medium text-primary">Fusion Layer</span>
                    <span className="font-mono font-bold text-primary">1344d → 256d</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Telemetry</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Inference Time</span>
                    <span className="font-mono">{result.detectionTime.toFixed(2)}s</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
