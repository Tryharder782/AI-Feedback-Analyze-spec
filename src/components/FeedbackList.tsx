"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedbackCard } from "@/components/FeedbackCard";
import { type FeedbackItem, isSentiment } from "@/types/feedback";

interface FeedbackListProps {
  refreshToken: number;
}

function isFeedbackItem(value: unknown): value is FeedbackItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.originalText === "string" &&
    isSentiment(candidate.sentiment) &&
    typeof candidate.summary === "string" &&
    typeof candidate.insight === "string" &&
    typeof candidate.createdAt === "string"
  );
}

export function FeedbackList({ refreshToken }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/feedbacks", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback records.");
      }

      const payload = (await response.json()) as unknown;

      if (!Array.isArray(payload)) {
        throw new Error("Unexpected API response format.");
      }

      const parsedItems = payload.filter(isFeedbackItem);
      setFeedbacks(parsedItems);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not load feedback records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeedbacks();
  }, [fetchFeedbacks, refreshToken]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Feedbacks</h2>
        <p className="text-sm text-slate-500">{feedbacks.length} total</p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading feedback records...
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && feedbacks.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          No feedback analyzed yet. Submit one to get started.
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
