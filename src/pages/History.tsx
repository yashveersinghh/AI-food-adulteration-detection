import React from "react";
import { format } from "date-fns";
import { AnalysisResult } from "../types";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

interface HistoryProps {
  history: AnalysisResult[];
  onOpenResult: (res: AnalysisResult) => void;
  onClear: () => void;
}

export function History({ history, onOpenResult, onClear }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl flex flex-col items-center text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-6">
          <Database className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis History</h2>
        <p className="text-muted-foreground max-w-md">Your past analysis runs will appear here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis Log</h1>
          <p className="text-muted-foreground">Review past verification runs.</p>
        </div>
        <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onClear} data-testid="button-clear-history">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Log
        </Button>
      </div>

      <div className="space-y-4">
        {history.sort((a,b) => b.timestamp - a.timestamp).map(run => (
          <div 
            key={run.id}
            onClick={() => onOpenResult(run)}
            className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
            data-testid={`history-item-${run.id}`}
          >
            {run.imageDataUrl ? (
              <div className="w-16 h-16 rounded bg-black/50 overflow-hidden flex-shrink-0 border border-border/50 hidden md:block">
                <img src={run.imageDataUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded bg-muted/50 flex-shrink-0 border border-border/50 hidden md:flex items-center justify-center">
                <span className="text-xs font-mono text-muted-foreground uppercase">{run.product.substring(0,3)}</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold truncate">{run.product}</span>
                <span className="text-xs text-muted-foreground font-mono px-2 py-0.5 bg-muted rounded">#{run.id}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>{format(new Date(run.timestamp), "MMM d, HH:mm")}</span>
                {run.isAdulterated ? (
                  <span className="text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> {run.adulterantType} ({(run.adulterationPct).toFixed(1)}%)</span>
                ) : (
                  <span className="text-green-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Pure</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 md:w-48">
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-0.5">Confidence</div>
                <div className="font-mono font-medium">{(run.confidence * 100).toFixed(1)}%</div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Need Database icon here too since it wasn't imported at top
import { Database } from "lucide-react";
