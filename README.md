# AI Feedback Analyzer

Production-ready Proof of Concept (POC) for analyzing customer feedback with OpenAI.

The app accepts raw feedback text, generates sentiment + summary + actionable insight, stores the result in Postgres via Prisma, and displays analysis history in a clean dashboard.

## Features

- Analyze feedback via `POST /api/analyze`
- Sentiment classification: `POSITIVE | NEUTRAL | NEGATIVE`
- One-sentence summary
- Actionable insight generation
- Persist records in Postgres
- Retrieve all feedback via `GET /api/feedbacks`
- Minimal B2B dashboard UI (sidebar + form + cards)

## Tech Stack

- Frontend: Next.js (App Router), React, TailwindCSS, Lucide Icons
- Backend: Next.js Route Handlers (`runtime = "nodejs"`)
- Database: Postgres + Prisma ORM
- AI: OpenAI SDK (`gpt-4o-mini` by default)
- Language: TypeScript (strict)

## Architecture

```text
src/
  app/
    api/
      analyze/route.ts       # POST: analyze and save feedback
      feedbacks/route.ts     # GET: list feedback records
    page.tsx                 # App entry page
  components/
    FeedbackDashboard.tsx    # Sidebar + main layout
    FeedbackForm.tsx         # Submit form with loading state
    FeedbackList.tsx         # Fetch and render feedback list
    FeedbackCard.tsx         # Single feedback card
  lib/
    feedback-analysis.ts     # OpenAI call + response parsing/validation
    prisma.ts                # Prisma client singleton
  types/
    feedback.ts              # Shared types and type guards
prisma/
  schema.prisma              # Feedback model
```

## Data Model (Prisma)

```prisma
model Feedback {
  id           String   @id @default(uuid())
  originalText String
  sentiment    String
  summary      String
  insight      String
  createdAt    DateTime @default(now())
}
```

## Environment Variables

Create `.env` with:

```env
POSTGRES_PRISMA_URL="postgres://user:password@host:5432/db?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://user:password@host:5432/db"
OPENAI_API_KEY="your_openai_api_key_here"
OPENAI_MODEL="gpt-4o-mini"
```

You can switch `OPENAI_MODEL` to another compatible model, for example `gpt-3.5-turbo`.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Sync database schema:

```bash
npm run prisma:push
```

3. Start development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## API

### POST `/api/analyze`

Analyzes feedback using OpenAI, stores the result in the database, and returns the created record.

Request body:

```json
{
  "text": "The onboarding was smooth, but billing setup was confusing."
}
```

Response `201` example:

```json
{
  "id": "2f69fbd7-5fdf-4abf-a93e-b8ed3f3b1a50",
  "originalText": "The onboarding was smooth, but billing setup was confusing.",
  "sentiment": "NEUTRAL",
  "summary": "Onboarding is positive, but billing setup creates friction.",
  "insight": "Add a guided billing setup checklist with inline hints.",
  "createdAt": "2026-03-06T08:00:00.000Z"
}
```

Errors:

- `400`: missing or empty `text`
- `500`: OpenAI, parsing, or database error

### GET `/api/feedbacks`

Returns all feedback records ordered by `createdAt desc`.

Response `200` example:

```json
[
  {
    "id": "2f69fbd7-5fdf-4abf-a93e-b8ed3f3b1a50",
    "originalText": "The onboarding was smooth, but billing setup was confusing.",
    "sentiment": "NEUTRAL",
    "summary": "Onboarding is positive, but billing setup creates friction.",
    "insight": "Add a guided billing setup checklist with inline hints.",
    "createdAt": "2026-03-06T08:00:00.000Z"
  }
]
```

## UI Components

- `FeedbackForm`: textarea, submit button, loading spinner, error messages
- `FeedbackList`: fetch on mount and refresh after new submission
- `FeedbackCard`: sentiment badge colors (`green/gray/red`) + summary and insight

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:push
```

## Pre-Deploy Check

```bash
npm run lint
npm run build
```

## Deploy on Vercel

1. Connect this repository to Vercel.
2. Add environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
3. Build Command: `npm run build`
4. Install Command: `npm install`

Use Vercel Postgres or any managed Postgres provider. Prisma is configured for pooled and non-pooled connection URLs.

## Troubleshooting

- `Failed to analyze and save feedback`
  - verify `OPENAI_API_KEY`
  - verify OpenAI API access and model permissions
- `Could not load feedback records`
  - verify `POSTGRES_PRISMA_URL`
  - run `npm run prisma:push`

## License

Internal POC project. Add a `LICENSE` file if needed.
