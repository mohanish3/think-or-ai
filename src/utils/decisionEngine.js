// Decision engine: scores a task across multiple dimensions
// and recommends AI, Brain, or Hybrid

export const FACTORS = {
  learningGoal: {
    label: 'Learning / Growth Goal',
    description: 'Do you want to learn or improve a skill from this?',
    brainBias: 1.0,
    evidence: 'Retrieval practice and effortful processing strengthen long-term memory (Roediger & Butler, 2011). Offloading to AI bypasses the encoding phase.',
  },
  creativity: {
    label: 'Personal Creativity Required',
    description: 'Does the output need your unique voice, style, or ideas?',
    brainBias: 0.85,
    evidence: 'Creative flow states (Csikszentmihalyi) are disrupted by tool-switching. Authentic creative identity is built through practice.',
  },
  emotionalWeight: {
    label: 'Emotionally Significant',
    description: 'Is this decision emotionally important to you personally?',
    brainBias: 0.95,
    evidence: 'Somatic marker hypothesis (Damasio): emotions are integral to rational decision-making. AI lacks embodied experience.',
  },
  complexity: {
    label: 'Task Complexity',
    description: 'How complex or multi-faceted is the task?',
    aiBias: 0.7,
    evidence: 'AI excels at synthesizing large information spaces quickly. For extreme complexity, AI reduces cognitive load and decision fatigue (Baumeister, 2016).',
  },
  timeUrgency: {
    label: 'Time Urgency',
    description: 'Is this needed urgently with little time to think?',
    aiBias: 0.75,
    evidence: 'Speed-accuracy tradeoffs (Heitz, 2014): when time is critical and stakes are low, AI can reduce error rates caused by rushed human judgment.',
  },
  repetitive: {
    label: 'Repetitive / Boilerplate',
    description: 'Is this a repetitive task you\'ve done many times before?',
    aiBias: 0.9,
    evidence: 'Automation of routine tasks frees prefrontal cortex for higher-order thinking (Miller & Cohen, 2001). Repetitive tasks show diminishing learning returns.',
  },
  qualityStakes: {
    label: 'Quality Stakes',
    description: 'How critical is top-quality output (consequences of error)?',
    aiBias: 0.5,
    brainBias: 0.5,
    evidence: 'High-stakes outputs need human judgment for nuance, ethics, and accountability. But AI can enhance quality via iteration on human drafts.',
  },
  cognitiveLoad: {
    label: 'Current Mental Fatigue',
    description: 'How mentally drained are you right now?',
    aiBias: 0.65,
    evidence: 'Decision fatigue degrades decision quality (Danziger et al., 2011). Under fatigue, AI acts as a cognitive scaffold without permanent skill atrophy.',
  },
};

export function analyzeTask(task) {
  const {
    learningGoal,
    creativity,
    emotionalWeight,
    complexity,
    timeUrgency,
    repetitive,
    qualityStakes,
    cognitiveLoad,
  } = task.ratings;

  // Normalize 1–5 to 0–1
  const n = (v) => (v - 1) / 4;

  let brainScore = 0;
  let aiScore = 0;

  // Brain-biasing factors
  brainScore += n(learningGoal) * FACTORS.learningGoal.brainBias * 25;
  brainScore += n(creativity) * FACTORS.creativity.brainBias * 20;
  brainScore += n(emotionalWeight) * FACTORS.emotionalWeight.brainBias * 20;

  // AI-biasing factors
  aiScore += n(complexity) * FACTORS.complexity.aiBias * 15;
  aiScore += n(timeUrgency) * FACTORS.timeUrgency.aiBias * 15;
  aiScore += n(repetitive) * FACTORS.repetitive.aiBias * 20;
  aiScore += n(cognitiveLoad) * FACTORS.cognitiveLoad.aiBias * 15;

  // Quality stakes splits both ways
  const qn = n(qualityStakes);
  brainScore += qn * FACTORS.qualityStakes.brainBias * 10;
  aiScore += qn * FACTORS.qualityStakes.aiBias * 10;

  const total = brainScore + aiScore || 1;
  const brainPct = Math.round((brainScore / total) * 100);
  const aiPct = 100 - brainPct;

  let verdict, confidence, color, emoji;

  if (brainPct >= 65) {
    verdict = 'Use Your Brain';
    confidence = brainPct;
    color = 'brain';
    emoji = '🧠';
  } else if (aiPct >= 65) {
    verdict = 'Use AI';
    confidence = aiPct;
    color = 'ai';
    emoji = '🤖';
  } else {
    verdict = 'Hybrid Approach';
    confidence = Math.max(brainPct, aiPct);
    color = 'hybrid';
    emoji = '⚡';
  }

  const reasons = buildReasons(task.ratings, verdict);
  const strategy = buildStrategy(task, verdict);

  return { verdict, confidence, color, emoji, brainPct, aiPct, reasons, strategy };
}

function buildReasons(ratings, verdict) {
  const reasons = [];
  const n = (v) => (v - 1) / 4;

  if (n(ratings.learningGoal) > 0.5) {
    reasons.push({ icon: '📚', text: 'High learning intent — thinking it through yourself builds lasting skill', pro: 'brain' });
  }
  if (n(ratings.creativity) > 0.5) {
    reasons.push({ icon: '🎨', text: 'Requires your personal creative voice — AI output would feel generic', pro: 'brain' });
  }
  if (n(ratings.emotionalWeight) > 0.5) {
    reasons.push({ icon: '❤️', text: 'Emotionally significant — your intuition and values matter here', pro: 'brain' });
  }
  if (n(ratings.repetitive) > 0.5) {
    reasons.push({ icon: '🔄', text: 'Repetitive work — AI handles this fast with no skill sacrifice', pro: 'ai' });
  }
  if (n(ratings.timeUrgency) > 0.5) {
    reasons.push({ icon: '⏱️', text: 'Urgent timeline — AI reduces error risk from rushed thinking', pro: 'ai' });
  }
  if (n(ratings.complexity) > 0.5) {
    reasons.push({ icon: '🧩', text: 'High complexity — AI can synthesize large information spaces quickly', pro: 'ai' });
  }
  if (n(ratings.cognitiveLoad) > 0.5) {
    reasons.push({ icon: '😴', text: 'Mental fatigue degrades decision quality — let AI scaffold your thinking', pro: 'ai' });
  }
  if (n(ratings.qualityStakes) > 0.7) {
    reasons.push({ icon: '🎯', text: 'High stakes — use AI as a draft tool, but apply your judgment at the end', pro: 'hybrid' });
  }

  return reasons.length > 0 ? reasons : [{ icon: '⚖️', text: 'Balanced task — both approaches have roughly equal merit', pro: 'hybrid' }];
}

function buildStrategy(task, verdict) {
  if (verdict === 'Use Your Brain') {
    return [
      'Set a focused 25-min Pomodoro block with no distractions',
      'Write your first draft or solution from memory without looking anything up',
      'Only research after you\'ve made an initial attempt — this deepens encoding',
      'Reflect on what you learned when done',
    ];
  }
  if (verdict === 'Use AI') {
    return [
      'Write a detailed prompt with all context and constraints',
      'Ask for multiple options/variations, not just one answer',
      'Review and verify the output critically before using it',
      'Save time for higher-value thinking elsewhere',
    ];
  }
  return [
    'Start with a 5-min brain dump of your own thoughts first',
    'Then use AI to expand, research, or pressure-test your ideas',
    'Synthesize both: your judgment + AI\'s breadth',
    'You own the final call — AI is the research assistant',
  ];
}
