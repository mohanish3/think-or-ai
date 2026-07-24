"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain,
  Bot,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Sun,
  Moon,
  Share2,
  Check,
  History,
  Pencil,
} from "lucide-react";

interface Attribute {
  name: string;
  score: number;
  description: string;
}

interface StrategyStep {
  step: number;
  title: string;
  description: string;
}

interface Analysis {
  verdict: "Use Your Brain" | "Use AI" | "Hybrid";
  confidence: number;
  headline: string;
  summary: string;
  attributes: Attribute[];
  reasons: string[];
  strategy: StrategyStep[];
  science_note: string;
}

interface HistoryEntry {
  task: string;
  analysis: Analysis;
  ts: number;
}

const HISTORY_KEY = "think-or-ai-history";
const HISTORY_LIMIT = 20;

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveToHistory(entry: HistoryEntry) {
  const next = [entry, ...loadHistory()].slice(0, HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

const VERDICT_CONFIG = {
  "Use Your Brain": {
    Icon: Brain,
    light: {
      heroBg: "bg-emerald-50",
      heroBorder: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "text-emerald-600",
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
      stepBg: "bg-emerald-500",
      tag: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    dark: {
      heroBg: "dark:bg-emerald-950/40",
      heroBorder: "dark:border-emerald-800",
      badge: "dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700",
      accent: "dark:text-emerald-400",
      bar: "dark:bg-emerald-400",
      dot: "dark:bg-emerald-400",
      stepBg: "dark:bg-emerald-600",
      tag: "dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300",
    },
  },
  "Use AI": {
    Icon: Bot,
    light: {
      heroBg: "bg-blue-50",
      heroBorder: "border-blue-200",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "text-blue-600",
      bar: "bg-blue-500",
      dot: "bg-blue-500",
      stepBg: "bg-blue-500",
      tag: "bg-blue-50 border-blue-200 text-blue-700",
    },
    dark: {
      heroBg: "dark:bg-blue-950/40",
      heroBorder: "dark:border-blue-800",
      badge: "dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
      accent: "dark:text-blue-400",
      bar: "dark:bg-blue-400",
      dot: "dark:bg-blue-400",
      stepBg: "dark:bg-blue-600",
      tag: "dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
    },
  },
  Hybrid: {
    Icon: Sparkles,
    light: {
      heroBg: "bg-violet-50",
      heroBorder: "border-violet-200",
      badge: "bg-violet-100 text-violet-800 border-violet-200",
      accent: "text-violet-600",
      bar: "bg-violet-500",
      dot: "bg-violet-500",
      stepBg: "bg-violet-500",
      tag: "bg-violet-50 border-violet-200 text-violet-700",
    },
    dark: {
      heroBg: "dark:bg-violet-950/40",
      heroBorder: "dark:border-violet-800",
      badge: "dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-700",
      accent: "dark:text-violet-400",
      bar: "dark:bg-violet-400",
      dot: "dark:bg-violet-400",
      stepBg: "dark:bg-violet-600",
      tag: "dark:bg-violet-900/30 dark:border-violet-800 dark:text-violet-300",
    },
  },
};

function cls(...parts: string[]) {
  return parts.join(" ");
}

export default function Home() {
  const [task, setTask] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const DEMO: Analysis = {
    verdict: "Hybrid", confidence: 78,
    headline: "Your voice matters — let AI handle the scaffolding",
    summary: "This cover letter touches on genuine personal investment. Use AI to draft structure and fix language, but make sure the core reasons you care about this role come entirely from you.",
    attributes: [
      { name: "Learning Value", score: 6, description: "Writing builds self-reflection skills." },
      { name: "Creativity", score: 5, description: "Moderate creativity needed." },
      { name: "Emotional Weight", score: 9, description: "You care deeply about this role." },
      { name: "Repetitiveness", score: 3, description: "Each letter is fairly unique." },
      { name: "Time Sensitivity", score: 4, description: "Deadlines matter but there is time." },
      { name: "Personal Judgment", score: 8, description: "Your story must lead." },
    ],
    reasons: [
      "Emotional authenticity is a key differentiator — AI alone produces generic output.",
      "AI excels at structure and professional language you can then personalize.",
      "Startups value genuine enthusiasm — your personal story should lead.",
    ],
    strategy: [
      { step: 1, title: "Brain-dump first", description: "Write 3-5 raw sentences about why you care about this startup." },
      { step: 2, title: "Use AI to structure", description: "Feed your notes and ask for a professional cover letter draft." },
      { step: 3, title: "Inject your voice", description: "Replace the opening with your original words. These matter most." },
      { step: 4, title: "Final pass", description: "Read aloud. Rewrite anything that sounds robotic." },
    ],
    science_note: "Recruiters spend ~7 seconds on initial scans, but startup hiring managers read cover letters for culture fit — authenticity markers activate different neural responses than templated text.",
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("a");
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(shared));
        if (decoded.task && decoded.analysis) {
          setTask(decoded.task);
          setAnalysis(decoded.analysis);
        }
      } catch {
        // ignore malformed share links
      }
    } else if (params.get("demo") === "1") {
      setTask("Write a cover letter for a startup I care about");
      setAnalysis(DEMO);
    }
    setHistory(loadHistory());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function handleAnalyze() {
    if (!task.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAnalysis(data as Analysis);
      setHistory(saveToHistory({ task: task.trim(), analysis: data as Analysis, ts: Date.now() }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setAnalysis(null);
    setTask("");
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  // Keeps the task text so it can be tweaked before rerunning, unlike handleReset.
  function handleEditAgain() {
    setAnalysis(null);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function loadHistoryEntry(entry: HistoryEntry) {
    setTask(entry.task);
    setAnalysis(entry.analysis);
  }

  async function handleShare() {
    if (!analysis) return;
    const payload = encodeURIComponent(JSON.stringify({ task, analysis }));
    const url = `${window.location.origin}${window.location.pathname}?a=${payload}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const cfg = analysis ? VERDICT_CONFIG[analysis.verdict] : null;
  const VerdictIcon = cfg?.Icon ?? Brain;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white dark:text-gray-900" />
            </div>
            <span className="font-semibold text-sm tracking-tight">think-or-ai</span>
          </div>
          <div className="flex items-center gap-3">
            {analysis && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New analysis
              </button>
            )}
            <button
              onClick={toggleDark}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {!analysis ? (
          /* ── Input State ── */
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Powered by OpenAI
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight mb-4">
              Should you use{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                AI for this?
              </span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
              Describe your task in plain English. We&apos;ll tell you whether to{" "}
              <strong className="text-gray-700 dark:text-gray-300 font-medium">think it through yourself</strong>,{" "}
              <strong className="text-gray-700 dark:text-gray-300 font-medium">delegate to AI</strong>, or{" "}
              <strong className="text-gray-700 dark:text-gray-300 font-medium">do both</strong>.
            </p>

            <div className="w-full max-w-2xl">
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-50 dark:focus-within:ring-violet-950 transition-all">
                <textarea
                  ref={textareaRef}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze();
                  }}
                  placeholder="e.g. Write a cover letter for a software engineering role at a startup I really care about..."
                  className="w-full px-5 pt-4 pb-14 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none outline-none text-base leading-relaxed min-h-[140px]"
                  autoFocus
                />
                <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{task.length > 0 && `${task.length} chars`}</span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!task.trim() || loading}
                    className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white dark:text-gray-900 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Analyze
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2.5">
                Press <kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-500 dark:text-gray-400">⌘ Enter</kbd> to analyze
              </p>
            </div>

            {error && (
              <div className="mt-6 w-full max-w-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="mt-10 w-full max-w-2xl">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Try an example</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Debug a tricky TypeScript error in my codebase",
                  "Write a heartfelt birthday message for my dad",
                  "Summarize 50 customer support tickets",
                  "Decide if I should quit my job",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setTask(example)}
                    className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div className="mt-10 w-full max-w-2xl text-left">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Recent analyses
                </p>
                <div className="flex flex-col gap-2">
                  {history.slice(0, 5).map((entry) => (
                    <button
                      key={entry.ts}
                      onClick={() => loadHistoryEntry(entry)}
                      className="flex items-center justify-between gap-3 text-left text-sm bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{entry.task}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{entry.analysis.verdict}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Results State ── */
          <div className="space-y-5">

            {/* ── Verdict Hero ── */}
            <div className={cls(
              "rounded-2xl border p-6 sm:p-8",
              cfg!.light.heroBg, cfg!.light.heroBorder,
              cfg!.dark.heroBg, cfg!.dark.heroBorder
            )}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex-1">
                  <div className={cls(
                    "inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-semibold mb-4",
                    cfg!.light.badge, cfg!.dark.badge
                  )}>
                    <VerdictIcon className="w-4 h-4" />
                    {analysis.verdict}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold leading-snug mb-3">{analysis.headline}</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{analysis.summary}</p>
                </div>
                <div className="flex-shrink-0 text-center sm:text-right">
                  <div className="text-5xl font-black tabular-nums">{analysis.confidence}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">% confidence</div>
                </div>
              </div>
            </div>

            {/* ── Attributes — Grid of mini-cards ── */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Task Attributes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {analysis.attributes.map((attr) => (
                  <div
                    key={attr.name}
                    className="group relative rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-3 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                    title={attr.description}
                  >
                    <div className={cls("text-2xl font-black tabular-nums mb-1", cfg!.light.accent, cfg!.dark.accent)}>
                      {attr.score}
                      <span className="text-xs font-normal text-gray-400 dark:text-gray-600">/10</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className={cls("h-full rounded-full", cfg!.light.bar, cfg!.dark.bar)}
                        style={{ width: `${attr.score * 10}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{attr.name}</div>
                    {/* Tooltip on hover */}
                    <div className="absolute left-0 bottom-full mb-2 z-10 hidden group-hover:block w-48 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none">
                      {attr.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reasons — Tag/pill style ── */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Why this verdict</h3>
              <div className="flex flex-col gap-2.5">
                {analysis.reasons.map((reason, i) => (
                  <div
                    key={i}
                    className={cls(
                      "flex items-start gap-3 border rounded-xl px-4 py-3 text-sm",
                      cfg!.light.tag, cfg!.dark.tag
                    )}
                  >
                    <span className={cls("font-bold text-base leading-none mt-0.5 flex-shrink-0", cfg!.light.accent, cfg!.dark.accent)}>
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Strategy — Timeline ── */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5">Step-by-step strategy</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-6">
                  {analysis.strategy.map((s, i) => (
                    <div key={s.step} className="relative flex gap-5 pl-1">
                      <div className={cls(
                        "relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        cfg!.light.stepBg, cfg!.dark.stepBg
                      )}>
                        {s.step}
                      </div>
                      <div className={cls("flex-1 pb-1", i < analysis.strategy.length - 1 ? "" : "")}>
                        <div className="font-semibold text-sm mb-1">{s.title}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Science Note — Full-width callout ── */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 p-6 flex gap-4">
              <div className={cls("flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm")}>
                <Lightbulb className={cls("w-4 h-4", cfg!.light.accent, cfg!.dark.accent)} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Science note</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{analysis.science_note}&rdquo;</p>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="text-sm text-gray-400 line-clamp-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Task:</span> {task}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-4 py-2 transition-colors whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
                <button
                  onClick={handleEditAgain}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-4 py-2 transition-colors whitespace-nowrap"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit task
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-4 py-2 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
