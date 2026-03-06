# AI Feedback Analyzer

Production-ready POC для анализа пользовательского фидбека с помощью OpenAI.

Приложение принимает текст от пользователя, выполняет AI-анализ, сохраняет результат в SQLite через Prisma и показывает историю анализов в дашборде.

## Возможности

- Анализ фидбека через `POST /api/analyze`
- Определение sentiment: `POSITIVE | NEUTRAL | NEGATIVE`
- Краткое summary (1 предложение)
- Actionable insight
- Сохранение результатов в SQLite
- Просмотр истории через `GET /api/feedbacks`
- Минималистичный B2B UI (Sidebar + Form + Cards)

## Технологии

- Frontend: Next.js (App Router), React, TailwindCSS, Lucide Icons
- Backend: Next.js Route Handlers (`runtime = "nodejs"`)
- Database: SQLite + Prisma ORM
- AI: OpenAI SDK (`gpt-4o-mini` по умолчанию)
- Язык: TypeScript (strict)

## Архитектура

```text
src/
  app/
    api/
      analyze/route.ts       # POST анализ и сохранение
      feedbacks/route.ts     # GET список фидбеков
    page.tsx                 # Входная страница
  components/
    FeedbackDashboard.tsx    # Sidebar + Main layout
    FeedbackForm.tsx         # Форма отправки
    FeedbackList.tsx         # Загрузка и отображение списка
    FeedbackCard.tsx         # Карточка результата
  lib/
    feedback-analysis.ts     # OpenAI вызов + валидация JSON ответа
    prisma.ts                # Singleton Prisma client
  types/
    feedback.ts              # Общие типы и type guards
prisma/
  schema.prisma              # Модель Feedback
```

## Модель данных (Prisma)

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

## Переменные окружения

Файл `.env`:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key_here"
OPENAI_MODEL="gpt-4o-mini"
```

`OPENAI_MODEL` можно заменить, например, на `gpt-3.5-turbo`.

## Запуск локально

1. Установить зависимости:

```bash
npm install
```

2. Подготовить базу данных:

```bash
npm run prisma:push
```

3. Запустить dev-сервер:

```bash
npm run dev
```

4. Открыть:

```text
http://localhost:3000
```

## API

### POST `/api/analyze`

Анализирует текст через OpenAI, сохраняет результат в БД и возвращает созданную запись.

Request body:

```json
{
  "text": "The onboarding was smooth, but billing setup was confusing."
}
```

Response `201` (пример):

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

Ошибки:

- `400`: отсутствует или пустое поле `text`
- `500`: ошибка OpenAI, валидации ответа или БД

### GET `/api/feedbacks`

Возвращает все записи, отсортированные по `createdAt desc`.

Response `200`:

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

## UI-компоненты

- `FeedbackForm`
  - textarea
  - submit-кнопка
  - loading state со spinner
  - отображение ошибок
- `FeedbackList`
  - загрузка `GET /api/feedbacks` при монтировании
  - перезагрузка после нового сабмита
  - обработка пустого состояния и ошибок
- `FeedbackCard`
  - badge по sentiment (`green/gray/red`)
  - блоки summary и insight

## Скрипты

```bash
npm run dev            # запуск в режиме разработки
npm run build          # production build
npm run start          # запуск production сборки
npm run lint           # eslint
npm run prisma:generate
npm run prisma:push
```

## Проверка перед деплоем

```bash
npm run lint
npm run build
```

## Deploy на Vercel

Базовый деплой:

1. Подключить репозиторий к Vercel.
2. Установить Environment Variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (опционально)
   - `DATABASE_URL`
3. Build Command: `npm run build`
4. Install Command: `npm install`

Важно: SQLite-файл не подходит для надежного persistent storage в serverless-среде Vercel.

- Для локальной разработки и demo/PoC SQLite достаточно.
- Для production на Vercel рекомендуется заменить SQLite на managed БД (например, Postgres через Prisma), сохранив текущую архитектуру API и типы.

## Troubleshooting

- `Failed to analyze and save feedback`
  - проверить `OPENAI_API_KEY`
  - проверить доступность OpenAI API
- `Could not load feedback records`
  - проверить `DATABASE_URL`
  - выполнить `npm run prisma:push`

## Лицензия

Внутренний POC-проект. При необходимости добавьте выбранную лицензию в отдельный файл `LICENSE`.
