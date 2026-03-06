"use client";

import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { FeedbackList } from "@/components/FeedbackList";

export function FeedbackDashboard() {
  const [refreshToken, setRefreshToken] = useState(0);

  function handleSubmission() {
    setRefreshToken((current) => current + 1);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-900 p-2 text-white">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                AI Feedback Analyzer
              </p>
              <p className="text-xs text-slate-500">POC Dashboard</p>
            </div>
          </div>

          <nav className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Navigation
            </p>
            <a
              href="#"
              className="inline-flex w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Feedbacks
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <header>
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Customer Feedback Intelligence
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Analyze raw comments into sentiment, concise summary, and
                actionable next steps.
              </p>
            </header>

            <FeedbackForm onSubmitted={handleSubmission} />
            <FeedbackList refreshToken={refreshToken} />
          </div>
        </main>
      </div>
    </div>
  );
}
