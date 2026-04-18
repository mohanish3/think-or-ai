import { useState } from 'react';
import { analyzeTask } from './utils/decisionEngine';
import TaskForm from './components/TaskForm';
import ResultCard from './components/ResultCard';
import Header from './components/Header';
import EvidencePanel from './components/EvidencePanel';
import { ListTodo } from 'lucide-react';
import './index.css';

const QUICK_EXAMPLES = [
  { title: 'Write a heartfelt birthday message for my dad', ratings: { learningGoal: 2, creativity: 5, emotionalWeight: 5, complexity: 2, timeUrgency: 2, repetitive: 1, qualityStakes: 4, cognitiveLoad: 2 } },
  { title: 'Generate boilerplate CRUD API endpoints', ratings: { learningGoal: 1, creativity: 1, emotionalWeight: 1, complexity: 3, timeUrgency: 4, repetitive: 5, qualityStakes: 3, cognitiveLoad: 3 } },
  { title: 'Decide whether to accept a job offer', ratings: { learningGoal: 3, creativity: 2, emotionalWeight: 5, complexity: 4, timeUrgency: 3, repetitive: 1, qualityStakes: 5, cognitiveLoad: 3 } },
  { title: 'Summarize 50 research papers on climate change', ratings: { learningGoal: 3, creativity: 2, emotionalWeight: 1, complexity: 5, timeUrgency: 4, repetitive: 4, qualityStakes: 3, cognitiveLoad: 4 } },
];

export default function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    const result = analyzeTask(task);
    setTasks((prev) => [{ ...task, id: Date.now(), result }, ...prev]);
  };

  const addExample = (ex) => {
    addTask({ title: ex.title, description: '', ratings: ex.ratings });
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pb-16">
        <Header tasks={tasks} />

        {/* Quick examples */}
        <div className="mb-8">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 text-center">Try an example</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {QUICK_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => addExample(ex)}
                className="text-left px-3 py-2.5 rounded-xl bg-[#13131f] border border-[#2a2a40] hover:border-violet-500/40 transition-all text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form + Evidence */}
          <div className="lg:col-span-1 space-y-5">
            <TaskForm onAdd={addTask} />
            <EvidencePanel />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2">
            {tasks.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center border border-dashed border-[#2a2a40] rounded-2xl p-10">
                <div className="w-16 h-16 rounded-2xl bg-[#13131f] flex items-center justify-center mb-4 text-3xl">
                  🧠
                </div>
                <p className="text-white font-semibold mb-1">No tasks yet</p>
                <p className="text-slate-500 text-sm max-w-xs">
                  Add a task on the left or click one of the examples above to get your first recommendation.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <ListTodo size={14} />
                    <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''} analyzed</span>
                  </div>
                  {tasks.length > 1 && (
                    <button
                      onClick={() => setTasks([])}
                      className="text-xs text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {tasks.map((task) => (
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
