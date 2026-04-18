import { Brain, Bot, Zap } from 'lucide-react';

export default function Header({ tasks }) {
  const brainCount = tasks.filter(t => t.result.color === 'brain').length;
  const aiCount    = tasks.filter(t => t.result.color === 'ai').length;
  const hybridCount = tasks.filter(t => t.result.color === 'hybrid').length;

  return (
    <header className="text-center pt-16 pb-10 px-4 w-full">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8 text-violet-400 text-[11px] font-semibold tracking-widest uppercase mb-6">
        <Zap size={10} />
        AI vs Brain Advisor
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-[-2px] mb-4">
        Think it or{' '}
        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          prompt it?
        </span>
      </h1>

      <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed mb-10">
        Describe your task. Get a science-backed verdict on whether to use AI,
        trust your brain, or blend both.
      </p>

      {/* Stats pills — only show when tasks exist */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-in">
          <Pill icon={<Brain size={12} />} label="Brain" count={brainCount} cls="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
          <Pill icon={<Bot size={12} />}   label="AI"    count={aiCount}    cls="bg-violet-500/10  border-violet-500/20  text-violet-400" />
          <Pill icon={<Zap size={12} />}   label="Hybrid" count={hybridCount} cls="bg-amber-500/10  border-amber-500/20  text-amber-400" />
        </div>
      )}
    </header>
  );
}

function Pill({ icon, label, count, cls }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium ${cls}`}>
      {icon}
      <span className="font-bold">{count}</span> {label}
    </span>
  );
}
