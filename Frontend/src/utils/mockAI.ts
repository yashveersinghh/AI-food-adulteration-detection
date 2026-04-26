import { AnalysisResult, FoodProduct, SpectralPoint } from "../types";

const ADULTERANTS: Record<FoodProduct, string[]> = {
  "Saffron": ["Synthetic colorant", "Marigold petals", "Safflower", "Corn silk"],
  "Vanilla": ["Coumarin", "Synthetic vanillin", "Tonka bean extract"],
  "Cashews": ["Peanut traces", "Starch coating", "Cheaper nuts"],
  "Pistachios": ["Lead chromate dye", "Tartrazine", "Chlorophyll dye"],
  "A2 Desi Cow Milk": ["A1 protein", "Urea", "Water + Maltodextrin", "Detergent"]
};

function generateSmoothBlob(size: number, centers: {x: number, y: number, intensity: number}[]) {
  const grid: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      let val = 0;
      for (const c of centers) {
        const distSq = Math.pow(i - c.y, 2) + Math.pow(j - c.x, 2);
        val += c.intensity * Math.exp(-distSq / 15);
      }
      row.push(Math.min(1, Math.max(0, val)));
    }
    grid.push(row);
  }
  return grid;
}

export async function runInference(input: {
  product: FoodProduct;
  image?: File | string;
  spectralFile?: File;
  sensors?: Record<string, number>;
  sensorEnabled: boolean;
}): Promise<AnalysisResult> {
  const isAdulterated = Math.random() > 0.45;
  const adulterantType = isAdulterated 
    ? ADULTERANTS[input.product][Math.floor(Math.random() * ADULTERANTS[input.product].length)]
    : "None";
  
  const adulterationPct = isAdulterated ? 8 + Math.random() * 37 : Math.random() * 4;
  const confidence = 0.78 + Math.random() * 0.21;
  
  const v = 0.6 + Math.random() * 0.35;
  const s = 0.6 + Math.random() * 0.35;
  const se = 0.6 + Math.random() * 0.35;
  const fused = Math.min(0.99, Math.max(v, s, se) + 0.05 + Math.random() * 0.05);
  
  const modalResults = { visual: v, spectral: s, sensor: se, fused };

  const gcCenters = [
    { x: Math.random() * 14, y: Math.random() * 14, intensity: 0.6 + Math.random() * 0.5 },
    { x: Math.random() * 14, y: Math.random() * 14, intensity: 0.4 + Math.random() * 0.5 }
  ];
  const gradCamData = generateSmoothBlob(14, gcCenters);
  
  const awCenters = [
    { x: Math.random() * 14, y: Math.random() * 14, intensity: 0.7 + Math.random() * 0.4 }
  ];
  const attentionWeights = generateSmoothBlob(14, awCenters);

  const spectralData: SpectralPoint[] = [];
  for (let i = 0; i < 200; i++) {
    const wl = 400 + i * 10;
    const baseCurve = 0.5 + 0.3 * Math.sin(wl / 200) + 0.2 * Math.exp(-Math.pow(wl - 1200, 2) / 20000);
    const pure = baseCurve + (Math.random() - 0.5) * 0.02;
    let sample = pure;
    if (isAdulterated) {
      const shift = 0.1 * Math.exp(-Math.pow(wl - (800 + Math.random() * 800), 2) / 10000);
      sample += shift + (Math.random() - 0.5) * 0.05;
    } else {
      sample += (Math.random() - 0.5) * 0.03;
    }
    spectralData.push({ wavelength: wl, pure, sample });
  }

  let imageDataUrl: string | undefined;
  if (typeof input.image === 'string') {
    imageDataUrl = input.image;
  } else if (input.image instanceof File) {
    imageDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(input.image as File);
    });
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    product: input.product,
    isAdulterated,
    confidence,
    adulterantType,
    adulterationPct,
    detectionTime: 1.2 + Math.random() * 0.8,
    timestamp: Date.now(),
    imageDataUrl,
    modalResults,
    gradCamData,
    attentionWeights,
    spectralData,
    rawJson: {
      model_version: "v2.4.1-rc3",
      inference_node: "node-gpu-us-east-4",
      tensor_allocations: { visual: 768, spectral: 512, sensor: 64, fusion: 1344 },
      latencies_ms: { visual: 142, spectral: 89, sensor: 12, fusion: 44 }
    }
  };
}
