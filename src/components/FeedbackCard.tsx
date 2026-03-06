import { Lightbulb, MessageSquareQuote } from "lucide-react";
import { type FeedbackItem, type Sentiment } from "@/types/feedback";

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

const sentimentStyles: Record<Sentiment, string> = {
  POSITIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  NEUTRAL: "bg-slate-100 text-slate-700 border-slate-200",
  NEGATIVE: "bg-red-100 text-red-700 border-red-200",
};

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const createdAt = new Date(feedback.createdAt).toLocaleString();
  const sentiment = feedback.sentiment;
  const badgeClass = sentimentStyles[sentiment] ?? sentimentStyles.NEUTRAL;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${badgeClass}`}
        >
          {sentiment}
        </span>
        <time className="text-xs text-slate-500">{createdAt}</time>
      </div>

      <p className="mb-4 text-sm text-slate-700">{feedback.originalText}</p>

      <div className="space-y-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <MessageSquareQuote className="h-4 w-4" />
            Summary
          </p>
          <p className="text-sm text-slate-800">{feedback.summary}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Lightbulb className="h-4 w-4" />
            Insight
          </p>
          <p className="text-sm text-slate-800">{feedback.insight}</p>
        </div>
      </div>
    </article>
  );
}
