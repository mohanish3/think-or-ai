import { BookOpen, Brain, Bot } from 'lucide-react';
import { FACTORS } from '../utils/decisionEngine';

export default function EvidencePanel() {
  return (
    <div className="bg-[#13131f] border border-[#2a2a40] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} className="text-slate-400" />
        <h3 className="text-white font-semibold text-sm">Scientific Basis</h3>
      </div>

      <div className="space-y-3">
        {Object.entries(FACTORS).map(([key, factor]) => (
          <div key={key} className="border-b border-[#2a2a40] pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              {factor.brainBias > (factor.aiBias || 0) ? (
                <Brain size={11} className="text-emerald-400" />
              ) : (
                <Bot size={11} className="text-violet-400" />
              )}
              <span className="text-slate-300 text-xs font-medium">{factor.label}</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">{factor.evidence}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
