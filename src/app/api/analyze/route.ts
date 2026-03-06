import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/feedback-analysis";
import { prisma } from "@/lib/prisma";
import { type AnalyzeRequestBody } from "@/types/feedback";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AnalyzeRequestBody>;
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "The 'text' field is required." },
        { status: 400 },
      );
    }

    const analysis = await analyzeFeedback(text);

    const savedFeedback = await prisma.feedback.create({
      data: {
        originalText: text,
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        insight: analysis.insight,
      },
    });

    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (error) {
    console.error("POST /api/analyze failed", error);

    return NextResponse.json(
      { error: "Failed to analyze and save feedback." },
      { status: 500 },
    );
  }
}
