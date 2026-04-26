import React, { useState, useEffect } from "react";
import { UploadCloud, FileType, CheckCircle2, Play, Loader2, Activity, Cpu, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { runInference } from "../utils/mockAI";
import { FoodProduct, AnalysisResult } from "../types";

const PRODUCTS: FoodProduct[] = ["Saffron", "Vanilla", "Cashews", "Pistachios", "A2 Desi Cow Milk"];

const STEPS = [
  "Preprocessing image",
  "Applying SNV to spectra",
  "Normalizing sensor data",
  "Running modality encoders",
  "Fusing modalities",
  "Generating Grad-CAM & attention",
  "Finalizing verdict"
];

export function Analyzer({ onComplete }: { onComplete: (res: AnalysisResult) => void }) {
  const [product, setProduct] = useState<FoodProduct>("Saffron");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [spectralFile, setSpectralFile] = useState<File | null>(null);
  const [sensorFile, setSensorFile] = useState<File | null>(null);
  const [sensors, setSensors] = useState<Record<string, number>>({});
  const [sensorParseError, setSensorParseError] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState(STEPS[0]);

  const sensorEnabled = Boolean(sensorFile) && sensorParseError == null;
  const canRun = Boolean(image) || Boolean(spectralFile) || sensorEnabled;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSpectralUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpectralFile(e.target.files[0]);
    }
  };

  const handleSensorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setSensorFile(file);
    setSensorParseError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const ext = file.name.split(".").pop()?.toLowerCase();

        // Accept either:
        // - JSON: { "pH": 6.7, "Moisture %": 12.3 }
        // - CSV/TXT: each line "key,value" (header allowed)
        let parsed: Record<string, number> = {};

        if (ext === "json") {
          const obj = JSON.parse(text) as unknown;
          if (obj && typeof obj === "object" && !Array.isArray(obj)) {
            for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
              const num = typeof v === "number" ? v : Number(v);
              if (Number.isFinite(num)) parsed[k] = num;
            }
          }
        } else {
          const lines = text
            .split(/\r?\n/g)
            .map(l => l.trim())
            .filter(Boolean);

          for (const line of lines) {
            // skip header-ish lines
            if (/^(key|name)\s*,\s*(value|val)$/i.test(line)) continue;
            const parts = line.split(",");
            if (parts.length < 2) continue;
            const key = parts[0].trim();
            const value = Number(parts.slice(1).join(",").trim());
            if (key && Number.isFinite(value)) parsed[key] = value;
          }
        }

        if (Object.keys(parsed).length === 0) {
          setSensors({});
          setSensorParseError("Could not read any numeric sensor values from this file.");
          return;
        }

        setSensors(parsed);
        setSensorParseError(null);
      } catch {
        setSensors({});
        setSensorParseError("Failed to parse sensor file. Try CSV (key,value) or JSON.");
      }
    };
    reader.onerror = () => {
      setSensors({});
      setSensorParseError("Failed to read sensor file.");
    };
    reader.readAsText(file);
  };

  const startAnalysis = async () => {
    setAnalyzing(true);
    setProgress(0);
    setStepLabel(STEPS[0]);

    // Simulate progress
    const totalTime = 1500 + Math.random() * 1000;
    const intervalTime = totalTime / 100;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      const stepIndex = Math.min(
        STEPS.length - 1, 
        Math.floor((currentProgress / 100) * STEPS.length)
      );
      setStepLabel(STEPS[stepIndex]);

      if (currentProgress >= 100) {
        clearInterval(timer);
      }
    }, intervalTime);

    try {
      const result = await runInference({
        product,
        image: imagePreview || undefined,
        spectralFile: spectralFile || undefined,
        sensors,
        sensorEnabled
      });
      
      // ensure we wait at least as long as the simulation
      setTimeout(() => {
        setAnalyzing(false);
        onComplete(result);
      }, totalTime + 100);
      
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
      clearInterval(timer);
    }
  };

  if (analyzing) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
          <Cpu className="w-10 h-10 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Analyzing Sample</h2>
        <p className="text-muted-foreground mb-12 text-lg h-8">{stepLabel}...</p>
        
        <div className="w-full max-w-md space-y-2">
          <Progress value={progress} className="h-3" data-testid="progress-analysis" />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configure Analysis</h1>
        <p className="text-muted-foreground">Select the product type and provide available sensor data.</p>
      </div>

      {/* Step 1: Product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Select Target Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PRODUCTS.map(p => (
              <Button
                key={p}
                variant={product === p ? "default" : "outline"}
                className={`${product === p ? "bg-primary" : "bg-transparent"} cursor-pointer`}
                onClick={() => { setProduct(p); setSensors({}); }}
                data-testid={`button-product-${p.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {p}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Modalities */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Visual Data (Optional)
            </CardTitle>
            <CardDescription>Upload microscopic or macro imagery.</CardDescription>
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-border group bg-black/50 aspect-video flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="destructive" size="sm" onClick={() => { setImage(null); setImagePreview(null); }}>Remove</Button>
                </div>
              </div>
            ) : (
              <Label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-card transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
                <Input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} data-testid="input-image" />
              </Label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Spectral Data (Optional)
            </CardTitle>
            <CardDescription>Upload NIR/FTIR spectral file.</CardDescription>
          </CardHeader>
          <CardContent>
            {spectralFile ? (
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card/50">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                  <FileType className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{spectralFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(spectralFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSpectralFile(null)}>
                  &times;
                </Button>
              </div>
            ) : (
              <Label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-card transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Activity className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">CSV, TXT, SPC, DX</p>
                </div>
                <Input type="file" accept=".csv,.txt,.xlsx,.spc,.dx" className="hidden" onChange={handleSpectralUpload} data-testid="input-spectral" />
              </Label>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Sensor Data (Optional)
            </CardTitle>
            <CardDescription>Upload CSV/JSON sensor data file.</CardDescription>
          </CardHeader>

          <CardContent>
            {sensorFile ? (
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card/50">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                  <FileType className="w-5 h-5" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{sensorFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(sensorFile.size / 1024).toFixed(1)} KB
                  </p>
                  {sensorParseError ? (
                    <p className="text-xs text-destructive mt-1">{sensorParseError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Parsed {Object.keys(sensors).length} value{Object.keys(sensors).length === 1 ? "" : "s"}.
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSensorFile(null);
                    setSensors({});
                    setSensorParseError(null);
                  }}
                >
                  &times;
                </Button>
              </div>
            ) : (
              <Label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-card transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Activity className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV, TXT, JSON
                  </p>
                </div>

                <Input
                  type="file"
                  accept=".csv,.txt,.json"
                  className="hidden"
                  onChange={handleSensorUpload}
                  data-testid="input-sensors"
                />
              </Label>
            )}
          </CardContent>
</Card>
      </div>

      {/* Action */}
      <div className="pt-6 border-t border-border flex justify-end">
        <Button
          size="lg"
          disabled={!canRun}
          onClick={startAnalysis}
          className="w-full md:w-auto bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium text-lg px-12 py-6 h-auto"
          data-testid="button-run-analysis"
        >
          {canRun ? <Play className="w-5 h-5 mr-2 fill-current" /> : null}
          Run FoodGuard-AI
        </Button>
      </div>
      {!canRun && (
        <p className="text-center text-sm text-destructive mt-2">
          Provide at least one input modality (Image, Spectral, or Sensor file) to run analysis.
        </p>
      )}
    </div>
  );
}
