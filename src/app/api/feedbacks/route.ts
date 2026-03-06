import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET /api/feedbacks failed", error);

    return NextResponse.json(
      { error: "Failed to fetch feedback records." },
      { status: 500 },
    );
  }
}
