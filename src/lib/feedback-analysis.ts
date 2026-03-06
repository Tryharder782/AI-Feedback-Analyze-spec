import OpenAI from "openai";
import { type AnalysisResult, isSentiment } from "@/types/feedback";

const ANALYSIS_SYSTEM_PROMPT =
  "You analyze customer feedback. Return only valid JSON with keys: sentiment, summary, insight. " +
  'Rules: sentiment must be "POSITIVE", "NEUTRAL", or "NEGATIVE". ' +
  "summary must be exactly one sentence. insight must be specific and actionable.";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

function extractJsonPayload(content: string): unknown {
  // Defensive cleanup in case a model wraps JSON in Markdown fences.
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned) as unknown;
}

function toSingleSentence(input: string): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  // Persist only the first sentence to enforce a concise summary field.
  const match = normalized.match(/[^.!?]+[.!?]?/);

  return match ? match[0].trim() : normalized;
}

function parseAnalysisResult(rawContent: string): AnalysisResult {
  const payload = extractJsonPayload(rawContent);

  if (typeof payload !== "object" || payload === null) {
    throw new Error("OpenAI returned a non-object response.");
  }

  const result = payload as Record<string, unknown>;
  const sentiment = result.sentiment;
  const summary = result.summary;
  const insight = result.insight;

  if (!isSentiment(sentiment)) {
    throw new Error("OpenAI returned an invalid sentiment value.");
  }

  if (typeof summary !== "string" || summary.trim().length === 0) {
    throw new Error("OpenAI returned an invalid summary.");
  }

  if (typeof insight !== "string" || insight.trim().length === 0) {
    throw new Error("OpenAI returned an invalid insight.");
  }

  return {
    sentiment,
    summary: toSingleSentence(summary),
    insight: insight.trim(),
  };
}

export async function analyzeFeedback(text: string): Promise<AnalysisResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: text },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return parseAnalysisResult(content);
}
