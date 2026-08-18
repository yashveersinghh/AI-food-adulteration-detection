import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Activity, 
  Cpu, 
  Scan, 
  Database, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const FeatureBento: React.FC = () => {
  // Animated Activity Log Feed
  const [logs, setLogs] = useState([
    { id: 1, text: 'Saffron sample verified (99.2% pure)', time: 'Just now' },
    { id: 2, text: 'Spectral signature matched FTIR-80', time: '2m ago' },
    { id: 3, text: 'Cashew starch adulterant detected', time: '5m ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [
        { 
          id: Date.now(), 
          text: `Batch #${Math.floor(1000 + Math.random() * 9000)} scanned & verified`, 
          time: 'Just now' 
        },
        ...prev.slice(0, 2)
      ]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
      
      {/* 1. Spectral Signatures */}
      <div className="md:col-span-2 bg-white/90 border border-black/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-black/10 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Activity className="w-4.5 h-4.5" />
            </div>
            <h3 className="font-semibold text-lg text-[#111111]">Spectral Signatures</h3>
            <p className="text-xs text-black/60 mt-1 max-w-md leading-relaxed">
              Real-time NIR and FTIR spectroscopy identifying molecular-level chemical anomalies instantly.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium border border-emerald-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Wave Scan
          </span>
        </div>

        {/* Toned Down Waveform */}
        <div className="mt-6 pt-4 border-t border-black/5 h-14 w-full flex items-end justify-between gap-1 px-1">
          {[...Array(32)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full bg-emerald-500/70 rounded-t-sm"
              animate={{
                height: [
                  `${20 + Math.sin(i * 0.5) * 35}%`,
                  `${50 + Math.cos(i * 0.8) * 30}%`,
                  `${20 + Math.sin(i * 0.5) * 35}%`
                ]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Visual Analysis */}
      <div className="bg-white/90 border border-black/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-black/10 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#E06D53] flex items-center justify-center">
              <Fingerprint className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#B55A30] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/40">
              ResNet-50
            </span>
          </div>
          <h3 className="font-semibold text-lg text-[#111111]">Visual Analysis</h3>
          <p className="text-xs text-black/60 mt-1 leading-relaxed">
            Microscopic defect recognition via custom ResNet-50 backbones.
          </p>
        </div>

        {/* Subtle Scanner Bar */}
        <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
          <span className="text-black/40 text-[11px]">Micro-Defect Accuracy</span>
          <span className="font-mono text-xs font-semibold text-[#B55A30]">99.4%</span>
        </div>
      </div>

      {/* 3. Sensor Fusion */}
      <div className="bg-white/90 border border-black/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-black/10 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/40">
              Late Fusion
            </span>
          </div>
          <h3 className="font-semibold text-lg text-[#111111]">Sensor Fusion</h3>
          <p className="text-xs text-black/60 mt-1 leading-relaxed">
            Late-stage neural fusion across optical, chemical, and spectral modalities.
          </p>
        </div>

        {/* Minimal Node Matrix */}
        <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px]">
          {['RGB', 'NIR', 'pH'].map((label, idx) => (
            <div key={label} className="flex items-center gap-1.5">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-purple-500" 
              />
              <span className="font-mono text-black/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Chemical Indicators */}
      <div className="bg-white/90 border border-black/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-black/10 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Database className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/40">
              pH & Moisture
            </span>
          </div>
          <h3 className="font-semibold text-lg text-[#111111]">Chemical Indicators</h3>
          <p className="text-xs text-black/60 mt-1 leading-relaxed">
            Evaluation of pH, moisture, and conductivity against dataset profiles.
          </p>
        </div>

        <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
          <span className="text-black/40 text-[11px]">Dataset Profile</span>
          <span className="font-medium text-amber-700 text-[11px]">Matched</span>
        </div>
      </div>

      {/* 5. Immutable Audit Log */}
      <div className="bg-white/90 border border-black/5 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-black/10 transition-all duration-300">
        <div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-semibold text-lg text-[#111111]">Immutable Audit Log</h3>
          <p className="text-xs text-black/60 mt-1 leading-relaxed">
            Cryptographically signed verification run history for supply chains.
          </p>
        </div>

        {/* Clean Live Feed */}
        <div className="mt-5 pt-3 border-t border-black/5 relative overflow-hidden h-10">
          <AnimatePresence mode="wait">
            {logs.slice(0, 1).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between text-[11px]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate text-black/70 font-medium">{log.text}</span>
                </div>
                <span className="text-[9px] text-black/40 shrink-0 font-mono ml-2">{log.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default FeatureBento;