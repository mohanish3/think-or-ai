import { useState } from 'react';
import { analyzeTask } from './utils/decisionEngine';
import TaskForm from './components/TaskForm';
import ResultCard from './components/ResultCard';
import Header from './components/Header';
import { Inbox } from 'lucide-react';
import './index.css';

const EXAMPLES = [
  {
    icon: '💌',
    title: 'Write a heartfelt birthday message',
    subtitle: 'For my dad',
    ratings: { learningGoal: 2, creativity: 5, emotionalWeight: 5, complexity: 2, timeUrgency: 2, repetitive: 1, qualityStakes: 4, cognitiveLoad: 2 },
  },
  {
    icon: '⚙️',
    title: 'Generate CRUD API boilerplate',
    subtitle: 'Repetitive code',
    ratings: { learningGoal: 1, creativity: 1, emotionalWeight: 1, complexity: 3, timeUrgency: 4, repetitive: 5, qualityStakes: 3, cognitiveLoad: 3 },
  },
  {
    icon: '💼',
    title: 'Should I accept this job offer?',
    subtitle: 'Career decision',
    ratings: { learningGoal: 3, creativity: 2, emotionalWeight: 5, complexity: 4, timeUrgency: 3, repetitive: 1, qualityStakes: 5, cognitiveLoad: 3 },
  },
  {
    icon: '📄',
    title: 'Summarize 50 research papers',
    subtitle: 'Climate change',
    ratings: { learningGoal: 3, creativity: 2, emotionalWeight: 1, complexity: 5, timeUrgency: 4, repetitive: 4, qualityStakes: 3, cognitiveLoad: 4 },
  },
];

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    const result = analyzeTask(task);
    setTasks(prev => [{ ...task, id: Date.now(), result }, ...prev]);
  };

  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="min-h-screen bg-[#07070f] relative overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-900/15 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-emerald-900/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[350px] h-[350px] rounded-full bg-blue-900/8 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5">
        <Header tasks={tasks} />

        {/* Examples row */}
        <div className="mb-8">
          <p className="text-center text-xs text-slate-600 font-semibold uppercase tracking-widest mb-4">
            Try an example
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => addTask({ title: ex.title, description: ex.subtitle, ratings: ex.ratings })}
                className="group text-left p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <span className="text-2xl block mb-2">{ex.icon}</span>
                <p className="text-slate-200 text-sm font-medium leading-snug group-hover:text-white transition-colors">{ex.title}</p>
                <p className="text-slate-600 text-xs mt-0.5">{ex.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 pb-20">

          {/* Left: Form */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <TaskForm onAdd={addTask} />
          </div>

          {/* Right: Results */}
          <div>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center border border-dashed border-white/8 rounded-2xl p-12">
                <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
                  <Inbox size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-400 font-semibold mb-1">No tasks yet</p>
                <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                  Fill in the form or click an example above — your recommendation will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <p className="text-slate-600 text-sm">{tasks.length} task{tasks.length !== 1 ? 's' : ''} analyzed</p>
                  {tasks.length > 1 && (
                    <button
                      onClick={() => setTasks([])}
                      className="text-xs text-slate-700 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {tasks.map(task => (
                  <ResultCard
                    key={task.id}
                    task={task}
                    result={task.result}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
