import { useState } from 'react';
import { Brain, Bot, Zap, Trash2, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';

const VERDICTS = {
  brain: {
    label: 'Use Your Brain',
    emoji: '🧠',
    from:  'from-emerald-500',
    to:    'to-teal-500',
    glow:  'rgba(16,185,129,0.18)',
    accent:'#10b981',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/20',
    Icon: Brain,
  },
  ai: {
    label: 'Use AI',
    emoji: '🤖',
    from:  'from-violet-500',
    to:    'to-purple-600',
    glow:  'rgba(139,92,246,0.18)',
    accent:'#8b5cf6',
    accentBg: 'bg-violet-500/10',
    accentText: 'text-violet-400',
    accentBorder: 'border-violet-500/20',
    Icon: Bot,
  },
  hybrid: {
    label: 'Hybrid Approach',
    emoji: '⚡',
    from:  'from-amber-500',
    to:    'to-orange-500',
    glow:  'rgba(245,158,11,0.18)',
    accent:'#f59e0b',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
    accentBorder: 'border-amber-500/20',
    Icon: Zap,
  },
};

export default function ResultCard({ task, result, onDelete }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const v = VERDICTS[result.color];

  return (
    <div
      className="animate-slide-up rounded-2xl overflow-hidden border border-white/8"
      style={{ boxShadow: `0 8px 40px ${v.glow}, 0 1px 0 rgba(255,255,255,0.05) inset` }}
    >
      {/* Hero banner */}
      <div className={`bg-gradient-to-r ${v.from} ${v.to} px-6 py-5 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl shadow-lg">
            {v.emoji}
          </div>
          <div>
            <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-0.5">
              Recommendation
            </p>
            <h3 className="text-white text-xl font-bold">{v.label}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-bold text-3xl leading-none">{result.confidence}%</p>
            <p className="text-white/60 text-[11px] mt-0.5">confidence</p>
          </div>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[#0d0d1a] p-6 space-y-5">

        {/* Task title */}
        <div>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-1">Task</p>
          <p className="text-white font-semibold text-[15px]">{task.title}</p>
          {task.description && (
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{task.description}</p>
          )}
        </div>

        {/* Brain vs AI bar */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <Brain size={11} /> Brain
            </span>
            <div className="flex-1 h-2 bg-[#1a1a2e] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 rounded-l-full transition-all duration-700"
                style={{ width: `${result.brainPct}%` }}
              />
              <div
                className="h-full bg-violet-500 rounded-r-full transition-all duration-700"
                style={{ width: `${result.aiPct}%` }}
              />
            </div>
            <span className="text-violet-400 text-xs font-semibold flex items-center gap-1">
              <Bot size={11} /> AI
            </span>
          </div>
          <div className="flex justify-between px-0.5">
            <span className="text-emerald-400 text-xs font-bold">{result.brainPct}%</span>
            <span className="text-violet-400 text-xs font-bold">{result.aiPct}%</span>
          </div>
        </div>

        {/* Why */}
        <div>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-2.5">Why</p>
          <div className="flex flex-wrap gap-2">
            {result.reasons.map((r, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  r.pro === 'brain'  ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300' :
                  r.pro === 'ai'     ? 'bg-violet-500/8  border-violet-500/20  text-violet-300'  :
                                       'bg-amber-500/8   border-amber-500/20   text-amber-300'
                }`}
              >
                <span>{r.icon}</span>
                {r.shortText || r.text.split('—')[0].trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div>
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest mb-2.5">Strategy</p>
          <ol className="space-y-2">
            {result.strategy.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${v.accentBg} ${v.accentText}`}
                >
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Evidence toggle */}
        <button
          onClick={() => setShowEvidence(s => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 transition-colors text-xs text-slate-500 hover:text-slate-300"
        >
          <span className="flex items-center gap-2">
            <FlaskConical size={12} />
            Scientific evidence behind this
          </span>
          {showEvidence ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showEvidence && (
          <div className="space-y-2 animate-fade-in">
            {result.reasons.map((r, i) => (
              <div key={i} className="px-4 py-3 rounded-xl bg-white/3 border border-white/5">
                <p className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  {r.icon}
                  {r.pro === 'brain' ? 'Favors brain' : r.pro === 'ai' ? 'Favors AI' : 'Favors hybrid'}
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
