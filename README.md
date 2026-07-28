# Grammatik mit System

A browser-based German grammar course for levels A1–B1, built with React, Vite and
TypeScript. Every chapter provides an explanation, examples, common mistakes, a short
summary and at least 24 graded exercises. Progress is stored in the browser.

The build in this repository is at **Phase 3**: the application shell, the lesson and
exercise engine, scoring, review scheduling and persistence are complete, and chapters
1-30 are shipped with full content. Chapters 21-30 also add a cumulative review session
that mixes exercises across a whole ten-chapter block (see "Cumulative review" below).
The remaining course chapters are added phase by phase (see `DEVELOPMENT_INSTRUCTIONS.md`).

## Getting started

```bash
npm install
npm run dev
```

## Commands

| Command                    | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `npm run dev`              | Start the development server                               |
| `npm run build`            | Typecheck and produce the production build in `dist/`      |
| `npm run preview`          | Serve the production build locally                         |
| `npm run lint`             | ESLint over the whole repository                           |
| `npm run typecheck`        | TypeScript project build in strict mode                    |
| `npm run test`             | Unit, content and component tests (Vitest)                 |
| `npm run test:watch`       | Vitest in watch mode                                       |
| `npm run test:e2e`         | Playwright end-to-end tests against the production build   |
| `npm run validate:content` | Validate all chapter files against the schema and registry |
| `npm run format`           | Format the repository with Prettier                        |

Playwright needs its browser once: `npx playwright install chromium`.

## Architecture

```text
src/
  app/          router, providers, App
  components/   common/, grammar/, exercises/, progress/  (no chapter text lives here)
  content/      chapters/, registry.ts, sections.ts, contentValidation.ts
  features/     chapters/, practice/, progress/, settings/  (stores and pure services)
  pages/        one component per route
  schemas/      Zod schemas and the TypeScript content model
  styles/       design tokens and global styles
  test/         fixtures and helpers
e2e/            Playwright specs
scripts/        content validation CLI
```

Two rules hold the design together:

1. **Content lives in data, never in components.** Chapter files export a
   `ChapterDefinition`; UI components only render what they are given.
2. **Scoring, normalisation and scheduling are pure functions.** Stores orchestrate them;
   they hold no React or DOM knowledge, which keeps them directly testable.

### Content model

Chapter files are validated by `src/schemas/chapterSchema.ts` at three points: in
development on startup, in `npm run test`, and in `npm run validate:content` (CI).
Validation fails when a chapter has fewer than 24 exercises, fewer than 12 of either
exercise type, duplicate exercise ids, a multiple-choice exercise with fewer than three
options or an unknown correct option, a text input without accepted answers, an example
without an English translation, or fewer than three common mistakes.

`src/content/registry.ts` is the single source of truth for the 85-chapter outline; chapter
files are checked against it automatically.

### Exercise engine

- Two attempts per exercise, plus an explicit "Show answer".
- Scoring: 1 point for a correct first attempt, 0.5 for a correct second attempt, 0 for a
  revealed or still incorrect answer. Raw score and first-attempt accuracy are both kept.
- An exercise counts as answered only after it has been submitted and feedback was shown.
- Answer checking is exercise-specific (`exact`, `normalized`, `caseInsensitive`,
  `punctuationInsensitive`); nothing is lowercased globally, because German capitalisation
  is grammatically meaningful.
- Wrong answers enter a review queue: 1 day → 3 days → 7 days → stable.

### Cumulative review

Once every chapter in a ten-chapter block has content, `/review` offers a checkpoint for
that block (currently chapters 21-30) at `/review/:from/:to`. The session mixes every
exercise from the range that is due for spaced-repetition review with a shuffled sample
from each chapter, so it stays useful before anything has been marked wrong. Each answer
still updates that exercise's own chapter history and review schedule; the session itself
is not tied to one chapter, so it is never persisted across a page reload and does not
evaluate any single chapter's mastery. Future phases register their own block in
`COURSE_CHECKPOINTS` (`src/features/chapters/chapterSelectors.ts`).

### Persistence

`localStorage`, in versioned formats with schema validation on read and a migration hook
for future versions:

| Key                             | Contents                                          |
| ------------------------------- | ------------------------------------------------- |
| `grammatik-mit-system:progress` | chapter progress and review history               |
| `grammatik-mit-system:session`  | the running practice session (survives a refresh) |
| `grammatik-mit-system:settings` | user settings                                     |

Unreadable data is discarded and reported instead of crashing the app.

## Accessibility

Semantic HTML, a skip link, visible focus states, full keyboard operation, `aria-live`
feedback that also carries an icon and a text label (never colour alone), labelled inputs,
44 × 44 px minimum touch targets, screen-reader-labelled umlaut helper buttons, and support
for reduced motion.

## Originality

The curriculum is organised around common A1–B1 German grammar topics. All explanations,
examples, exercises and translations are written for this app. Nothing is copied from any
published course book, and the app is not affiliated with any textbook publisher.
