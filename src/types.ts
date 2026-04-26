export type FoodProduct = "Saffron" | "Vanilla" | "Cashews" | "Pistachios" | "A2 Desi Cow Milk";

export interface ModalResults {
  visual: number;   // 0..1
  spectral: number;
  sensor: number;
  fused: number;
}

export interface SpectralPoint {
  wavelength: number;
  pure: number;
  sample: number;
}

export interface AnalysisResult {
  id: string;
  product: FoodProduct;
  isAdulterated: boolean;
  confidence: number;            // 0..1
  adulterantType: string;        // e.g. "Synthetic dye", "None"
  adulterationPct: number;       // 0..100
  detectionTime: number;         // ms or seconds
  timestamp: number;             // Date.now()
  imageDataUrl?: string;
  modalResults: ModalResults;
  gradCamData: number[][];       // 14x14
  attentionWeights: number[][];  // 14x14
  spectralData: SpectralPoint[]; // 200 points
  rawJson: Record<string, unknown>;
}
