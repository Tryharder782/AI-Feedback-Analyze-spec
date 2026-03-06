export const SENTIMENT_VALUES = ["POSITIVE", "NEUTRAL", "NEGATIVE"] as const;

export type Sentiment = (typeof SENTIMENT_VALUES)[number];

export interface AnalysisResult {
  sentiment: Sentiment;
  summary: string;
  insight: string;
}

export interface AnalyzeRequestBody {
  text: string;
}

export interface FeedbackItem extends AnalysisResult {
  id: string;
  originalText: string;
  createdAt: string;
}

const sentimentSet = new Set<string>(SENTIMENT_VALUES);

export function isSentiment(value: unknown): value is Sentiment {
  return typeof value === "string" && sentimentSet.has(value);
}
