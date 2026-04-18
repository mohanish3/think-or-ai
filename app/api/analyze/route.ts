import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI();

const analyzeTaskSchema = {
  type: "object" as const,
  properties: {
    verdict: {
      type: "string",
      enum: ["Use Your Brain", "Use AI", "Hybrid"],
    },
    confidence: { type: "number", description: "Integer from 0 to 100, e.g. 85" },
    headline: { type: "string" },
    summary: { type: "string" },
    attributes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          score: { type: "number", description: "Integer from 0 to 10" },
          description: { type: "string" },
        },
        required: ["name", "score", "description"],
        additionalProperties: false,
      },
    },
    reasons: { type: "array", items: { type: "string" } },
    strategy: {
      type: "array",
      items: {
        type: "object",
        properties: {
          step: { type: "number" },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["step", "title", "description"],
        additionalProperties: false,
      },
    },
    science_note: { type: "string" },
  },
  required: [
    "verdict",
    "confidence",
    "headline",
    "summary",
    "attributes",
    "reasons",
    "strategy",
    "science_note",
  ],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  if (!task || typeof task !== "string" || task.trim().length < 3) {
    return NextResponse.json({ error: "Please describe your task." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env.local." },
      { status: 500 }
    );
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You analyze tasks and decide whether the person should do it themselves, use AI, or take a hybrid approach. Consider learning value, creativity, emotional weight, time sensitivity, complexity, personal judgment, and repetitiveness. Be honest and specific.",
      },
      {
        role: "user",
        content: `Analyze this task: "${task.trim()}"`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "task_analysis",
        strict: true,
        schema: analyzeTaskSchema,
      },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "No response from model." }, { status: 500 });
  }

  const result = JSON.parse(content);
  // Normalize confidence: if model returns 0-1 float, convert to 0-100
  if (result.confidence <= 1) result.confidence = Math.round(result.confidence * 100);
  // Normalize attribute scores: if model returns 0-100, scale to 0-10
  if (Array.isArray(result.attributes)) {
    result.attributes = result.attributes.map((a: { name: string; score: number; description: string }) => ({
      ...a,
      score: a.score > 10 ? Math.round(a.score / 10) : a.score,
    }));
  }
  return NextResponse.json(result);
}
