import { Brain, Bot, Zap } from 'lucide-react';

export default function Header({ tasks }) {
  const brainCount = tasks.filter(t => t.result.color === 'brain').length;
  const aiCount = tasks.filter(t => t.result.color === 'ai').length;
  const hybridCount = tasks.filter(t => t.result.color === 'hybrid').length;

  return (
    <header className="text-center py-12 px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-5 uppercase tracking-widest">
        <Zap size={11} />
        AI vs Brain Advisor
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
        Think it or{' '}
        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          prompt it?
        </span>
      </h1>

      <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
        Add your tasks and get a science-backed recommendation on whether to use AI,
        your own brain, or a hybrid approach.
      </p>

      {tasks.length > 0 && (
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Stat icon={<Brain size={14} />} label="Brain" count={brainCount} color="emerald" />
          <Stat icon={<Bot size={14} />} label="AI" count={aiCount} color="violet" />
          <Stat icon={<Zap size={14} />} label="Hybrid" count={hybridCount} color="amber" />
        </div>
      )}
    </header>
  );
}

function Stat({ icon, label, count, color }) {
  const colors = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colors[color]} text-sm font-medium`}>
      {icon}
      <span className="font-bold">{count}</span> {label}
    </div>
  );
}
