import { useState } from 'react';
import { FACTORS } from '../utils/decisionEngine';
import { Brain, Sparkles, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const SLIDER_LABELS = {
  learningGoal: ['Just get it done', '', 'Somewhat', '', 'Deeply learn this'],
  creativity: ['Generic is fine', '', 'Some voice', '', 'Deeply personal'],
  emotionalWeight: ['Doesn\'t matter', '', 'Somewhat', '', 'Very important'],
  complexity: ['Very simple', '', 'Moderate', '', 'Extremely complex'],
  timeUrgency: ['No rush', '', 'Some urgency', '', 'Urgent now'],
  repetitive: ['Completely novel', '', 'Somewhat routine', '', 'Totally routine'],
  qualityStakes: ['Low stakes', '', 'Moderate', '', 'Critical stakes'],
  cognitiveLoad: ['Fully rested', '', 'A bit tired', '', 'Exhausted'],
};

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [ratings, setRatings] = useState({
    learningGoal: 3,
    creativity: 3,
    emotionalWeight: 3,
    complexity: 3,
    timeUrgency: 3,
    repetitive: 2,
    qualityStakes: 3,
    cognitiveLoad: 2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), ratings });
    setTitle('');
    setDescription('');
    setRatings({ learningGoal: 3, creativity: 3, emotionalWeight: 3, complexity: 3, timeUrgency: 3, repetitive: 2, qualityStakes: 3, cognitiveLoad: 2 });
    setExpanded(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#13131f] border border-[#2a2a40] rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
          <Plus size={16} className="text-violet-400" />
        </div>
        <h2 className="text-white font-semibold text-lg">Add a Task</h2>
      </div>

      <div className="space-y-3 mb-5">
        <input
          type="text"
          placeholder="What's the task? e.g. Write a cover letter"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#0d0d1a] border border-[#2a2a40] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
          required
        />
        <textarea
          placeholder="Add context (optional) — more detail = better recommendation"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full bg-[#0d0d1a] border border-[#2a2a40] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm resize-none"
        />
      </div>

      <div className="space-y-2 mb-5">
        {Object.entries(FACTORS).map(([key, factor]) => (
          <div key={key} className="border border-[#2a2a40] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === key ? null : key)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a1a2e] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div
                      key={v}
                      className={`w-1.5 h-4 rounded-full transition-all ${
                        v <= ratings[key]
                          ? factor.brainBias > (factor.aiBias || 0)
                            ? 'bg-emerald-500'
                            : 'bg-violet-500'
                          : 'bg-[#2a2a40]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-300 text-sm font-medium">{factor.label}</span>
              </div>
              {expanded === key ? (
                <ChevronUp size={14} className="text-slate-500" />
              ) : (
                <ChevronDown size={14} className="text-slate-500" />
              )}
            </button>

            {expanded === key && (
              <div className="px-4 pb-4 bg-[#0d0d1a]">
                <p className="text-slate-500 text-xs mb-3">{factor.description}</p>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={ratings[key]}
                  onChange={(e) => setRatings({ ...ratings, [key]: +e.target.value })}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-slate-600 text-xs">{SLIDER_LABELS[key][0]}</span>
                  <span className="text-slate-400 text-xs font-medium">{ratings[key]} / 5</span>
                  <span className="text-slate-600 text-xs">{SLIDER_LABELS[key][4]}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
      >
        <Sparkles size={15} />
        Analyze Task
      </button>
    </form>
  );
}
