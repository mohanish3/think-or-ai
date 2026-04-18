import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const FACTORS = [
  { key: 'learningGoal',    emoji: '📚', label: 'Learning goal',    bias: 'brain', lo: 'Just get done',  hi: 'Deep skill-build' },
  { key: 'creativity',      emoji: '🎨', label: 'Creativity needed', bias: 'brain', lo: 'Generic is fine', hi: 'Needs my voice'    },
  { key: 'emotionalWeight', emoji: '❤️', label: 'Emotionally personal', bias: 'brain', lo: 'Doesn\'t matter', hi: 'Very personal'    },
  { key: 'complexity',      emoji: '🧩', label: 'Task complexity',   bias: 'ai',    lo: 'Very simple',    hi: 'Extremely complex' },
  { key: 'timeUrgency',     emoji: '⏱️', label: 'Time urgency',     bias: 'ai',    lo: 'No rush',        hi: 'Need it now'       },
  { key: 'repetitive',      emoji: '🔄', label: 'Repetitive work',   bias: 'ai',    lo: 'Totally novel',  hi: 'Pure routine'      },
  { key: 'qualityStakes',   emoji: '🎯', label: 'Stakes / quality',  bias: 'both',  lo: 'Low stakes',     hi: 'Critical stakes'   },
  { key: 'cognitiveLoad',   emoji: '😴', label: 'Mental fatigue',    bias: 'ai',    lo: 'Fully rested',   hi: 'Exhausted'         },
];

const DEFAULTS = { learningGoal: 3, creativity: 3, emotionalWeight: 3, complexity: 3, timeUrgency: 3, repetitive: 2, qualityStakes: 3, cognitiveLoad: 2 };

export default function TaskForm({ onAdd }) {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [ratings, setRatings]   = useState(DEFAULTS);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const set = (key, val) => setRatings(r => ({ ...r, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: desc.trim(), ratings });
    setTitle('');
    setDesc('');
    setRatings(DEFAULTS);
    inputRef.current?.focus();
  };

  const canSubmit = title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0d1a] border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
      {/* Top section */}
      <div className="p-5 border-b border-white/6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Task</p>
        <input
          ref={inputRef}
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-transparent text-white text-[15px] font-medium placeholder-slate-600 outline-none mb-3"
        />
        <textarea
          placeholder="Add context (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          className="w-full bg-transparent text-slate-400 text-sm placeholder-slate-700 outline-none resize-none"
        />
      </div>

      {/* Sliders */}
      <div className="p-5 space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Rate each factor</p>
        {FACTORS.map(f => (
          <SliderRow
            key={f.key}
            factor={f}
            value={ratings[f.key]}
            onChange={v => set(f.key, v)}
          />
        ))}
      </div>

      {/* Submit */}
      <div className="px-5 pb-5">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            bg-gradient-to-r from-violet-600 to-purple-600 text-white
            hover:from-violet-500 hover:to-purple-500
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-purple-600
            shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
        >
          <Sparkles size={14} />
          Get Recommendation
        </button>
      </div>
    </form>
  );
}

function SliderRow({ factor, value, onChange }) {
  const cls = factor.bias === 'brain' ? 'brain-slider' : 'ai-slider';
  const dotColor = factor.bias === 'brain' ? 'bg-emerald-400' : factor.bias === 'ai' ? 'bg-violet-400' : 'bg-amber-400';
  const valColor = factor.bias === 'brain' ? 'text-emerald-400' : factor.bias === 'ai' ? 'text-violet-400' : 'text-amber-400';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none">{factor.emoji}</span>
          <span className="text-slate-300 text-[13px] font-medium">{factor.label}</span>
        </div>
        <span className={`text-xs font-bold tabular-nums ${valColor}`}>{value}/5</span>
      </div>
      <input
        type="range"
        min={1} max={5} step={1}
        value={value}
        style={{ '--val': value }}
        className={`w-full ${cls}`}
        onChange={e => onChange(+e.target.value)}
      />
      <div className="flex justify-between mt-1">
        <span className="text-slate-700 text-[10px] leading-tight">{factor.lo}</span>
        <span className="text-slate-700 text-[10px] leading-tight">{factor.hi}</span>
      </div>
    </div>
  );
}
