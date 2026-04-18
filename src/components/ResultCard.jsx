import { Brain, Bot, Zap, ChevronDown, ChevronUp, BookOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CONFIG = {
  brain: {
    label: 'Use Your Brain',
    emoji: '🧠',
    gradient: 'from-emerald-600 to-teal-600',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.25)]',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    Icon: Brain,
  },
  ai: {
    label: 'Use AI',
    emoji: '🤖',
    gradient: 'from-violet-600 to-purple-600',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    bar: 'bg-violet-500',
    Icon: Bot,
  },
  hybrid: {
    label: 'Hybrid Approach',
    emoji: '⚡',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-violet-500',
    Icon: Zap,
  },
};

function CircleProgress({ brainPct, aiPct, color }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const brainDash = (brainPct / 100) * circ;
  const aiDash = (aiPct / 100) * circ;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1e1e30" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color === 'brain' ? '#10b981' : color === 'ai' ? '#8b5cf6' : '#10b981'}
        strokeWidth="12"
        strokeDasharray={`${brainDash} ${circ - brainDash}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      {color === 'hybrid' && (
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke="#8b5cf6"
          strokeWidth="12"
          strokeDasharray={`${aiDash} ${circ - aiDash}`}
          strokeDashoffset={-brainDash}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      )}
    </svg>
  );
}

export default function ResultCard({ task, result, onDelete }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const cfg = CONFIG[result.color];
  const { Icon } = cfg;

  return (
    <div className={`animate-fade-in bg-[#13131f] border ${cfg.border} rounded-2xl overflow-hidden ${cfg.glow} transition-all`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${cfg.gradient} p-4 flex items-center justify-between`}>
        <div>
          <p className="text-white/70 text-xs uppercase tracking-widest font-medium mb-0.5">Recommendation</p>
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            {cfg.emoji} {cfg.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full bg-white/20 text-white font-bold text-sm`}>
            {result.confidence}% confident
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Task title */}
        <div className="mb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Task</p>
          <p className="text-white font-semibold">{task.title}</p>
          {task.description && <p className="text-slate-400 text-sm mt-1">{task.description}</p>}
        </div>

        {/* Score bars */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                <Brain size={11} /> Brain
              </span>
              <span className="text-emerald-400 text-xs font-bold">{result.brainPct}%</span>
            </div>
            <div className="h-2 bg-[#1e1e30] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${result.brainPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-violet-400 text-xs font-medium flex items-center gap-1">
                <Bot size={11} /> AI
              </span>
              <span className="text-violet-400 text-xs font-bold">{result.aiPct}%</span>
            </div>
            <div className="h-2 bg-[#1e1e30] rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${result.aiPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Why this recommendation</p>
          <div className="space-y-1.5">
            {result.reasons.map((r, i) => (
              <div key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm ${
                r.pro === 'brain' ? 'bg-emerald-500/10 text-emerald-300' :
                r.pro === 'ai' ? 'bg-violet-500/10 text-violet-300' :
                'bg-amber-500/10 text-amber-300'
              }`}>
                <span className="text-base leading-none mt-0.5">{r.icon}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div className="mb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Recommended Strategy</p>
          <ol className="space-y-1.5">
            {result.strategy.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full ${cfg.bg} ${cfg.text} text-xs flex items-center justify-center font-bold mt-0.5`}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Evidence toggle */}
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0d0d1a] hover:bg-[#1a1a2e] transition-colors text-xs text-slate-400"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={12} />
            Medical / Scientific Evidence
          </span>
          {showEvidence ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showEvidence && (
          <div className="mt-2 space-y-2">
            {result.reasons.map((r, i) => (
              <div key={i} className="px-3 py-2 rounded-lg bg-[#0d0d1a] text-xs text-slate-500">
                <span className="mr-1">{r.icon}</span>
                {r.pro === 'brain' && 'Brain: '}
                {r.pro === 'ai' && 'AI: '}
                {r.pro === 'hybrid' && 'Hybrid: '}
                <span className="text-slate-400">{r.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
