# DEVELOPMENT_INSTRUCTIONS.md

## 1. Project Objective

Build a browser-based German grammar learning application covering **all 85 chapters** listed in this specification.

The application must:

- use **React**, **Vite**, and **TypeScript**;
- provide a dedicated lesson page for every chapter;
- provide an original grammar explanation for every chapter;
- provide at least **24 exercises per chapter**;
- use multiple-choice and text-input exercises as the core exercise formats;
- provide immediate feedback and explanations;
- track progress locally;
- support keyboard navigation and mobile use;
- make it easy to add, review, and revise chapter content without changing UI code.

The chapter structure is inspired by the topic progression of _Grammatik aktiv A1–B1, 2. aktualisierte Ausgabe_. Do **not** copy explanations, examples, exercise wording, answer choices, illustrations, page layouts, or answer keys from the book. All instructional text and exercises must be newly written.

---

## 2. Non-Negotiable Requirements

### 2.1 Technology

Use:

- React 19 or the latest stable React version supported by Vite;
- Vite;
- TypeScript in strict mode;
- React Router;
- Zustand for lightweight client state;
- Zod for content validation;
- Vitest;
- React Testing Library;
- Playwright for end-to-end tests;
- ESLint;
- Prettier.

Optional:

- TanStack Query only if a remote API is added later;
- IndexedDB through Dexie if localStorage becomes insufficient;
- a component library such as Mantine only if it does not make the lesson UI visually heavy.

### 2.2 Content

Every chapter must contain:

- chapter number;
- chapter title;
- CEFR level;
- short lesson objective;
- prerequisite chapter references;
- grammar explanation;
- grammar tables where useful;
- at least 8 original example sentences;
- English translations for examples;
- at least 3 common mistakes;
- a short “Remember” summary;
- at least 24 exercises;
- at least 12 multiple-choice exercises;
- at least 12 text-input exercises;
- answer explanations for all multiple-choice exercises;
- accepted-answer definitions for all text-input exercises;
- capitalization and punctuation rules;
- a mastery threshold.

### 2.3 Minimum Exercise Count

Each chapter must contain **at least 24 graded exercises**.

Recommended fixed structure:

- Exercises 1–4: recognition;
- Exercises 5–8: form identification;
- Exercises 9–12: controlled multiple choice;
- Exercises 13–16: short text input;
- Exercises 17–20: sentence completion;
- Exercises 21–24: mixed review and transfer.

Minimum distribution:

- 12 `singleChoice`;
- 12 `textInput`.

Do not mark an exercise as complete merely because the user has clicked an answer. It is complete only after the answer has been submitted and feedback has been shown.

### 2.4 Originality

The application must not:

- scan or reproduce pages from the source book;
- copy the book’s exercise wording;
- copy the book’s example sentences;
- use screenshots of the book;
- reproduce the book’s visual design;
- claim to be an official Cornelsen product.

A short attribution may state that the curriculum is organized around common A1–B1 German grammar topics. Do not use the publisher’s branding.

---

## 3. Product Scope

### 3.1 Primary User

The initial user is an adult learner studying German independently at levels A1–B1.

The interface language is English. German is used for:

- grammar examples;
- answer choices;
- exercises;
- corrections;
- optional German-language grammar labels.

### 3.2 Main User Journey

1. User opens the application.
2. User sees all chapters grouped by section and level.
3. User opens a chapter.
4. User reads the explanation.
5. User studies examples and common mistakes.
6. User starts the exercise session.
7. User receives immediate feedback.
8. User completes the chapter checkpoint.
9. Progress is saved locally.
10. The next chapter is recommended.

### 3.3 Application Pages

Required routes:

```text
/
 /chapters
 /chapter/:chapterNumber
 /chapter/:chapterNumber/learn
 /chapter/:chapterNumber/practice
 /chapter/:chapterNumber/results
 /review
 /progress
 /settings
 /about
```

Required screens:

- dashboard;
- chapter catalogue;
- lesson explanation;
- practice session;
- result summary;
- review queue;
- progress overview;
- settings;
- about/source disclosure.

---

## 4. Architecture

### 4.1 Recommended Directory Structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    common/
      AppShell.tsx
      Button.tsx
      Card.tsx
      ProgressBar.tsx
      Modal.tsx
    grammar/
      GrammarTable.tsx
      ExampleList.tsx
      CommonMistakes.tsx
      RememberBox.tsx
    exercises/
      ExerciseRenderer.tsx
      SingleChoiceExercise.tsx
      TextInputExercise.tsx
      ExerciseFeedback.tsx
      ExerciseNavigation.tsx
    progress/
      ChapterProgressCard.tsx
      MasteryBadge.tsx
      StreakDisplay.tsx
  content/
    chapters/
      chapter-001.ts
      chapter-002.ts
      ...
      chapter-085.ts
    registry.ts
    sections.ts
  features/
    chapters/
      chapterSelectors.ts
      chapterUtils.ts
    practice/
      practiceStore.ts
      scoring.ts
      answerNormalization.ts
      reviewScheduler.ts
    progress/
      progressStore.ts
      progressPersistence.ts
    settings/
      settingsStore.ts
  pages/
    DashboardPage.tsx
    ChaptersPage.tsx
    ChapterPage.tsx
    LearnPage.tsx
    PracticePage.tsx
    ResultsPage.tsx
    ReviewPage.tsx
    ProgressPage.tsx
    SettingsPage.tsx
    AboutPage.tsx
  schemas/
    chapterSchema.ts
    exerciseSchema.ts
    progressSchema.ts
  styles/
    globals.css
    tokens.css
  test/
    fixtures/
    helpers/
```

### 4.2 Content-Driven Design

All lesson content must live in chapter data files.

UI components must never contain chapter-specific grammar text.

Correct:

```tsx
<GrammarTable rows={chapter.explanation.tables[0].rows} />
```

Incorrect:

```tsx
<p>German verbs normally come in position two.</p>
```

The second example hardcodes lesson content into a UI component and must not be used.

---

## 5. TypeScript Data Model

Use a strongly typed content model.

```ts
export type CefrLevel = 'A1' | 'A2' | 'B1';

export type ChapterSection =
  | 'verbs-1'
  | 'sentences-and-questions'
  | 'pronouns-nouns-articles'
  | 'verbs-2'
  | 'prepositions-1'
  | 'adjectives-1'
  | 'sentence-connections-1'
  | 'words-and-word-formation'
  | 'verbs-3'
  | 'nouns-2'
  | 'sentence-connections-2'
  | 'prepositions-2'
  | 'adjectives-2';

export interface ChapterDefinition {
  id: string;
  number: number;
  slug: string;
  title: string;
  germanTitle?: string;
  level: CefrLevel;
  section: ChapterSection;
  objective: string;
  prerequisites: number[];
  estimatedMinutes: number;
  explanation: GrammarExplanation;
  exercises: Exercise[];
  mastery: MasteryRule;
  tags: string[];
}

export interface GrammarExplanation {
  introduction: string[];
  rules: GrammarRule[];
  tables: GrammarTableDefinition[];
  examples: GrammarExample[];
  commonMistakes: CommonMistake[];
  remember: string[];
}

export interface GrammarRule {
  id: string;
  heading: string;
  paragraphs: string[];
  notes?: string[];
}

export interface GrammarTableDefinition {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface GrammarExample {
  german: string;
  english: string;
  explanation?: string;
  highlight?: string[];
}

export interface CommonMistake {
  incorrect: string;
  correct: string;
  explanation: string;
}

export interface MasteryRule {
  passingPercent: number;
  minimumAnswered: number;
  requiredCorrectTextInputs?: number;
}

export type Exercise = SingleChoiceExercise | TextInputExercise;

export interface ExerciseBase {
  id: string;
  chapterNumber: number;
  order: number;
  type: 'singleChoice' | 'textInput';
  prompt: string;
  instruction?: string;
  level: 'recognition' | 'controlled' | 'production' | 'transfer';
  grammarFocus: string[];
  hint?: string;
  explanation: string;
}

export interface SingleChoiceExercise extends ExerciseBase {
  type: 'singleChoice';
  options: Array<{
    id: string;
    text: string;
  }>;
  correctOptionId: string;
}

export interface TextInputExercise extends ExerciseBase {
  type: 'textInput';
  acceptedAnswers: string[];
  answerMode: 'exact' | 'normalized' | 'caseInsensitive' | 'punctuationInsensitive';
  placeholder?: string;
  maxLength?: number;
  requiredTokens?: string[];
}
```

### 5.1 Validation

All chapter files must be validated with Zod at application startup in development mode and in a dedicated content test in CI.

Validation must fail when:

- chapter number is missing;
- chapter numbers are duplicated;
- exercise IDs are duplicated;
- fewer than 24 exercises exist;
- fewer than 12 multiple-choice exercises exist;
- fewer than 12 text-input exercises exist;
- a multiple-choice exercise has fewer than 3 options;
- the correct option does not exist;
- a text-input exercise has no accepted answer;
- examples have no English translation;
- the chapter has fewer than 3 common mistakes.

---

## 6. Exercise Engine

### 6.1 Supported Core Types

#### Single Choice

Requirements:

- 3–5 answer choices;
- exactly one correct answer;
- distractors must be plausible;
- answer order may be shuffled;
- “Submit” button remains disabled until one option is selected;
- feedback must explain why the correct answer is correct;
- when useful, feedback must briefly explain why the selected distractor was wrong.

#### Text Input

Requirements:

- one-line input by default;
- textarea only when the user must write a complete multi-clause sentence;
- support German characters: `ä`, `ö`, `ü`, `Ä`, `Ö`, `Ü`, `ß`;
- include an on-screen character helper on mobile and desktop;
- normalize repeated spaces;
- normalize typographic apostrophes and quotation marks;
- do not silently ignore grammar-relevant capitalization unless the exercise explicitly allows it;
- show the expected answer after the second incorrect attempt;
- keep the learner’s answer visible after submission.

### 6.2 Text Normalization

Create a reusable answer normalization service.

Normalization options must be exercise-specific.

Possible normalization:

```ts
function normalizeBasic(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[’]/g, "'");
}
```

Do not globally lowercase every answer. German noun capitalization is grammatically meaningful.

### 6.3 Attempts

Each exercise supports:

- first attempt;
- second attempt;
- reveal answer;
- optional retry after completing the chapter.

Scoring:

- correct first attempt: 1 point;
- correct second attempt: 0.5 points;
- revealed or still incorrect: 0 points.

Store both:

- raw score;
- first-attempt accuracy.

### 6.4 Mastery

Default mastery threshold:

- at least 80% weighted score;
- all 24 exercises answered;
- at least 8 text-input exercises answered correctly;
- no more than 3 unanswered review flags.

A chapter can have a stricter rule where appropriate.

---

## 7. Progress and Review

### 7.1 Persisted State

Persist:

- completed chapters;
- best score per chapter;
- latest score;
- first-attempt accuracy;
- exercise-level mistake history;
- bookmarked chapters;
- last opened chapter;
- review due dates;
- settings.

Use localStorage in Phase 0.

Create a versioned persistence format:

```ts
interface PersistedProgressV1 {
  schemaVersion: 1;
  chapters: Record<number, ChapterProgress>;
  exerciseHistory: Record<string, ExerciseHistory>;
  lastOpenedChapter?: number;
}
```

### 7.2 Review Queue

An incorrectly answered exercise should enter the review queue.

Suggested intervals:

- first wrong answer: review tomorrow;
- wrong again: review in 1 day;
- correct once: review in 3 days;
- correct twice: review in 7 days;
- correct three times: mark stable.

The review screen must mix chapters while preserving exercise context.

---

## 8. User Interface Requirements

### 8.1 Dashboard

Display:

- current course completion percentage;
- continue-learning card;
- chapters due for review;
- recently completed chapters;
- level progress for A1, A2, and B1.

### 8.2 Chapter Catalogue

Group chapters by the section names in this document.

Each chapter card must show:

- chapter number;
- title;
- level;
- completion state;
- best score;
- mastery badge;
- estimated duration.

Filters:

- all;
- A1;
- A2;
- B1;
- not started;
- in progress;
- mastered;
- review due.

### 8.3 Lesson Screen

Order:

1. chapter header;
2. objective;
3. prerequisites;
4. introduction;
5. rules;
6. tables;
7. examples;
8. common mistakes;
9. remember summary;
10. start-practice button.

### 8.4 Practice Screen

Display:

- exercise number;
- total exercises;
- progress bar;
- exercise instruction;
- prompt;
- input or choices;
- hint;
- submit button;
- feedback;
- next button;
- exit confirmation.

### 8.5 Accessibility

Required:

- semantic HTML;
- visible focus states;
- full keyboard operation;
- `aria-live` for answer feedback;
- labels for all inputs;
- no color-only correctness indicators;
- minimum 44×44 px touch targets;
- sufficient contrast;
- reduced-motion support;
- screen-reader-readable umlaut helper buttons.

---

## 9. Content Writing Standards

### 9.1 Grammar Explanations

Each chapter explanation must:

- use plain English;
- introduce German terminology in parentheses;
- explain form before exceptions;
- use compact paragraphs;
- include tables only when they improve clarity;
- distinguish mandatory rules from tendencies;
- indicate when spoken German differs from formal written German;
- stay within the target level.

### 9.2 Examples

Every chapter needs at least 8 examples.

Examples should:

- use common A1–B1 vocabulary;
- include different persons and contexts;
- avoid culturally narrow assumptions;
- avoid unnecessary proper names;
- include English translations;
- highlight the target form;
- not introduce several unrelated advanced grammar points.

### 9.3 Distractors

Wrong options must be educational.

Use distractors based on:

- wrong conjugation;
- wrong case;
- wrong article;
- wrong word order;
- wrong preposition;
- wrong auxiliary;
- wrong ending;
- confusion between similar connectors.

Avoid random nonsense options.

### 9.4 Text Inputs

Text-input answers must define:

- accepted spelling variants;
- whether punctuation matters;
- whether capitalization matters;
- whether contractions are accepted;
- whether optional pronouns are accepted;
- whether multiple word orders are grammatically valid.

When multiple answers are valid, include all accepted forms or validate by token/rule logic.

---

# 10. Development Phases

## Phase 0 — Web Skeleton and Learning Engine

### Goal

Create a fully navigable application shell and a reusable lesson/exercise engine before adding production chapter content.

### Deliverables

1. Initialize React/Vite/TypeScript project.
2. Enable TypeScript strict mode.
3. Install routing, state, validation, test, lint, and formatting tools.
4. Create application shell.
5. Create all required routes.
6. Create shared design tokens.
7. Create content schemas.
8. Create chapter registry.
9. Create reusable grammar components.
10. Create reusable exercise components.
11. Create progress store.
12. Create persistence layer.
13. Create scoring engine.
14. Create answer-normalization service.
15. Create review scheduling service.
16. Create dashboard placeholder.
17. Create chapter catalogue placeholder.
18. Create progress page placeholder.
19. Create settings page.
20. Add automated tests.
21. Add one non-production demo chapter to verify the system.
22. Configure CI.

### Phase 0 Commands

The project must support:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:e2e
npm run validate:content
```

### Phase 0 Acceptance Criteria

- all routes render;
- no TypeScript errors;
- no lint errors;
- a demo chapter renders from data;
- both exercise types work;
- scoring works;
- chapter progress survives page refresh;
- exercise feedback is keyboard accessible;
- invalid chapter content fails validation;
- Playwright completes one lesson flow;
- production build succeeds.

---

## Phase 1 — Chapters 1–10

### Section: Verbs 1

### Chapter 1 — Personal Pronouns

**Level:** A1

Explanation must cover:

- `ich`, `du`, `er`, `sie`, `es`, `wir`, `ihr`, `sie`, `Sie`;
- singular and plural;
- informal and formal address;
- replacing people and nouns with pronouns;
- capitalization of formal `Sie`.

Exercises must test:

- matching nouns and names to pronouns;
- choosing `du`, `ihr`, or `Sie`;
- replacing a subject with a pronoun;
- capitalization of `Sie`;
- pronoun-number agreement.

### Chapter 2 — Present-Tense Conjugation

**Level:** A1

Explanation must cover:

- infinitive stem;
- regular endings;
- `-e`, `-st`, `-t`, `-en`, `-t`, `-en`;
- basic sentence formation;
- verbs ending in `-t` or `-d`.

Exercises must test:

- identifying stems;
- adding endings;
- matching subject and verb;
- completing short present-tense sentences;
- spelling with extra `e`.

### Chapter 3 — `sein`, `haben`, and Special Irregular Verbs

**Level:** A1

Explanation must cover:

- complete present forms of `sein`;
- complete present forms of `haben`;
- common irregular high-frequency verbs;
- use of `sein` for identity/state;
- use of `haben` for possession.

Exercises must test:

- choosing between `sein` and `haben`;
- completing conjugation tables;
- correcting incorrect forms;
- writing simple identity and possession sentences.

### Chapter 4 — Verbs with Vowel Changes

**Level:** A1

Explanation must cover:

- vowel change in `du` and `er/sie/es`;
- common patterns `e → i`, `e → ie`, `a → ä`;
- forms without vowel change;
- examples such as `fahren`, `lesen`, `sehen`, `sprechen`, `nehmen`.

Exercises must test:

- identifying affected persons;
- selecting changed stems;
- writing correct `du` and third-person forms;
- distinguishing regular and vowel-changing forms.

### Chapter 5 — Modal Verbs: Conjugation and Sentence Position

**Level:** A1

Explanation must cover:

- `können`, `müssen`, `wollen`, `dürfen`, `sollen`, `mögen`;
- modal verb conjugation;
- infinitive at the end;
- verb bracket;
- omitted infinitive only in clearly explained fixed contexts.

Exercises must test:

- modal conjugation;
- infinitive placement;
- sentence reconstruction;
- choosing a modal based on grammatical form.

### Chapter 6 — Modal Verbs: Usage, Part 1

**Level:** A1

Explanation must cover:

- ability with `können`;
- necessity with `müssen`;
- permission with `dürfen`;
- desire/intention with `wollen`;
- polite preference with `möchten`.

Exercises must test:

- selecting a modal by meaning;
- distinguishing permission and ability;
- making requests;
- completing everyday sentences.

### Chapter 7 — Modal Verbs: Usage, Part 2

**Level:** A1–A2

Explanation must cover:

- advice and obligation with `sollen`;
- liking with `mögen`;
- polite hypothetical forms such as `möchte`;
- negative meanings such as `nicht müssen` versus `nicht dürfen`;
- contextual differences among modal verbs.

Exercises must test:

- `nicht müssen` versus `nicht dürfen`;
- advice versus obligation;
- preference versus intention;
- polite requests;
- choosing modals from short dialogues.

### Chapter 8 — Separable Verbs

**Level:** A1

Explanation must cover:

- separable prefixes;
- prefix position in main clauses;
- infinitive form;
- common prefixes such as `an-`, `auf-`, `ein-`, `mit-`, `vor-`, `zu-`;
- interaction with modal verbs.

Exercises must test:

- splitting verbs;
- placing prefixes;
- recognizing inseparable-looking distractors;
- using separable verbs with modal verbs;
- writing everyday routine sentences.

### Chapter 9 — The Imperative

**Level:** A1

Explanation must cover:

- imperative for `du`;
- imperative for `ihr`;
- formal imperative with `Sie`;
- imperative of `sein`;
- polite softeners such as `bitte`;
- punctuation.

Exercises must test:

- converting statements into commands;
- selecting the correct audience form;
- adding or removing pronouns;
- writing instructions;
- polite versus direct commands.

### Section: Sentences and Questions

### Chapter 10 — Questions with Interrogative Words

**Level:** A1

Explanation must cover:

- `wer`, `was`, `wo`, `wohin`, `woher`, `wann`, `wie`, `warum`, `welcher`;
- question word in position 1;
- finite verb after the question word;
- question marks;
- choosing question words by required information.

Exercises must test:

- choosing question words;
- constructing questions;
- matching questions and answers;
- distinguishing location, direction, and origin;
- writing questions from prompts.

### Phase 1 Acceptance Criteria

- chapters 1–10 are complete;
- every chapter has at least 24 validated exercises;
- every chapter has at least 8 examples;
- chapter navigation from 1 through 10 works;
- section filters work;
- all chapter tests pass;
- learner can complete and master each chapter;
- no demo content remains visible.

---

## Phase 2 — Chapters 11–20

### Chapter 11 — Yes/No Questions and Answers

Cover:

- verb-first word order;
- short and full answers;
- `ja`, `nein`, and `doch`;
- negated questions;
- question intonation as a listening note.

Exercise focus:

- building verb-first questions;
- choosing `ja`, `nein`, or `doch`;
- turning statements into questions;
- answering positive and negative questions.

### Chapter 12 — The Verb in Position 2

Cover:

- finite verb as the second sentence element;
- subjects not always in position 1;
- time/place elements in position 1;
- inversion after a fronted element.

Exercise focus:

- counting sentence elements rather than words;
- rearranging sentences;
- identifying the finite verb;
- correcting word order.

### Chapter 13 — Sentences with Two Fixed Verb Positions

Cover:

- verb bracket;
- modal + infinitive;
- separable verbs;
- perfect tense preview where needed;
- finite element in position 2 and non-finite element at the end.

Exercise focus:

- identifying both verb parts;
- placing infinitives and prefixes;
- reconstructing sentences;
- comparing one-part and two-part predicates.

### Section: Pronouns, Nouns, and Articles

### Chapter 14 — Plural Forms of Nouns

Cover:

- common plural endings;
- umlaut changes;
- unchanged plurals;
- article `die` in plural;
- dictionary notation;
- no universal plural rule.

Exercise focus:

- matching singular and plural;
- identifying plural endings;
- writing frequent plurals;
- choosing articles;
- spotting incorrect plural forms.

### Chapter 15 — Definite, Indefinite, and Zero Articles

Cover:

- `der`, `die`, `das`;
- `ein`, `eine`;
- known versus new information;
- professions, materials, food, and general statements with no article;
- plural with no indefinite article.

Exercise focus:

- choosing article type;
- noun gender recognition;
- known/new context;
- zero article;
- indefinite plural limitations.

### Chapter 16 — Negation with `nicht` and `kein`

Cover:

- `kein` with nouns that could take an indefinite article;
- `nicht` with verbs, adjectives, adverbs, names, and definite nouns;
- basic placement of `nicht`;
- forms of `kein`.

Exercise focus:

- selecting `nicht` or `kein`;
- declining `kein` in basic forms;
- negating sentences;
- meaning differences caused by placement.

### Chapter 17 — The Accusative Case

Cover:

- direct object;
- article changes, especially masculine;
- accusative personal pronouns preview only if needed;
- common accusative verbs;
- asking `wen?` and `was?`.

Exercise focus:

- identifying direct objects;
- article endings;
- converting nominative noun phrases;
- completing common verb-object combinations.

### Chapter 18 — The Dative Case

Cover:

- indirect object;
- dative articles;
- plural `-n` where applicable;
- asking `wem?`;
- common beginner dative contexts.

Exercise focus:

- recognizing dative phrases;
- article changes;
- plural noun endings;
- choosing nominative, accusative, or dative.

### Chapter 19 — Possessive Articles

Cover:

- `mein`, `dein`, `sein`, `ihr`, `unser`, `euer`, `Ihr`;
- owner agreement;
- endings modeled on `ein`;
- ambiguity of `ihr`;
- formal `Ihr`.

Exercise focus:

- identifying the owner;
- choosing stems;
- adding endings;
- distinguishing `ihr` and `Ihr`;
- writing possession sentences.

### Chapter 20 — Interrogative and Demonstrative Articles

Cover:

- `welcher`;
- `dieser`;
- case and gender endings;
- selecting versus pointing out;
- common spoken alternatives where appropriate.

Exercise focus:

- declining `welcher` and `dieser`;
- matching questions and answers;
- choosing case from sentence function;
- short shopping and identification dialogues.

### Phase 2 Acceptance Criteria

Same content, validation, accessibility, and testing standards as Phase 1, now applied through chapter 20.

---

## Phase 3 — Chapters 21–30

### Chapter 21 — Personal Pronouns in the Accusative and Dative

Cover:

- complete accusative pronoun set;
- complete dative pronoun set;
- pronoun replacement;
- placement in simple clauses;
- distinction between `mir/mich`, `dir/dich`, and similar pairs.

Exercise focus:

- choosing case;
- replacing noun phrases;
- completing dialogues;
- correcting pronoun confusion.

### Chapter 22 — Verbs Taking Both Accusative and Dative Objects

Cover:

- person commonly in dative;
- thing commonly in accusative;
- common verbs such as `geben`, `zeigen`, `schicken`, `bringen`;
- noun and pronoun order at an introductory level.

Exercise focus:

- labeling objects;
- article endings;
- sentence completion;
- object order;
- pronoun replacement.

### Chapter 23 — Verbs Taking a Dative Object

Cover:

- frequent dative verbs;
- verbs such as `helfen`, `danken`, `gefallen`, `gehören`, `antworten`;
- semantic roles;
- no accusative object with these verbs.

Exercise focus:

- memorizing case government;
- choosing dative articles and pronouns;
- rejecting accusative distractors;
- building short sentences.

### Chapter 24 — Asking About People and Things with the Correct Case

Cover:

- `wer`, `wen`, `wem`;
- `was`;
- case determined by verb/preposition;
- questions about subjects and objects.

Exercise focus:

- selecting question forms;
- writing questions from underlined information;
- identifying case;
- matching questions and answers.

### Section: Verbs 2

### Chapter 25 — Simple Past of `sein` and `haben`

Cover:

- `war` and `hatte` paradigms;
- common use in spoken and written German;
- negation;
- time expressions.

Exercise focus:

- conjugation;
- choosing `war` or `hatte`;
- transforming present to past;
- short narratives.

### Chapter 26 — Present Perfect with `haben`

Cover:

- auxiliary `haben`;
- past participle at sentence end;
- common verbs using `haben`;
- verb bracket;
- negation and questions.

Exercise focus:

- auxiliary conjugation;
- participle placement;
- sentence building;
- short past-event answers.

### Chapter 27 — Present Perfect with `sein`

Cover:

- movement from one place to another;
- change of state;
- `sein`, `bleiben`, and selected verbs;
- contrast with `haben`;
- regional cautions only where useful.

Exercise focus:

- choosing auxiliary;
- completing sentences;
- classifying verb meanings;
- forming questions and answers.

### Chapter 28 — Formation of the Past Participle

Cover:

- regular `ge-...-t`;
- irregular `ge-...-en`;
- separable verbs;
- inseparable prefixes;
- verbs ending in `-ieren`;
- mixed verbs.

Exercise focus:

- forming participles;
- selecting patterns;
- identifying prefixes;
- correcting spelling;
- sorting verb types.

### Chapter 29 — Simple Past of Modal Verbs

Cover:

- `konnte`, `musste`, `wollte`, `durfte`, `sollte`, `mochte`;
- regular-like endings;
- loss of umlaut;
- sentence bracket with infinitive;
- frequent spoken use.

Exercise focus:

- conjugation;
- present-to-past transformation;
- infinitive placement;
- meaning in past situations.

### Chapter 30 — Choosing and Using Past Tenses

Cover:

- present perfect versus simple past;
- conversational versus narrative tendencies;
- common simple-past verbs;
- consistency in short texts;
- no false absolute rule.

Exercise focus:

- selecting tense by context;
- rewriting short passages;
- identifying mixed-tense errors;
- comparing equivalent statements.

### Phase 3 Acceptance Criteria

All chapters through 30 complete and validated. Add a cumulative review session for chapters 21–30.

---

## Phase 4 — Chapters 31–40

### Chapter 31 — Reflexive and Reciprocal Verbs

Cover:

- reflexive pronouns;
- accusative reflexive forms;
- reciprocal meaning with `uns/euch/sich`;
- truly reflexive versus optionally reflexive verbs;
- common daily-routine verbs.

Exercise focus:

- selecting pronouns;
- distinguishing reflexive and reciprocal meaning;
- completing routines;
- correcting missing pronouns.

### Section: Prepositions 1

### Chapter 32 — Basic Temporal Prepositions

Cover:

- `um`, `am`, `im`;
- `von ... bis`;
- `ab`;
- days, months, seasons, clock times;
- contractions.

Exercise focus:

- choosing temporal prepositions;
- forming dates and times;
- contractions;
- schedule sentences.

### Chapter 33 — Prepositions Governing the Dative

Cover:

- `aus`, `bei`, `mit`, `nach`, `seit`, `von`, `zu`;
- dative articles;
- common contractions;
- meanings and typical contexts.

Exercise focus:

- choosing a preposition;
- case endings;
- matching meaning;
- completing travel and social contexts.

### Chapter 34 — Prepositions Governing the Accusative

Cover:

- `durch`, `für`, `gegen`, `ohne`, `um`;
- accusative articles;
- major meanings;
- common fixed phrases.

Exercise focus:

- preposition choice;
- accusative forms;
- phrase completion;
- distinguishing temporal `um` from other uses.

### Chapter 35 — Two-Way Prepositions Used with the Dative

Cover:

- `an`, `auf`, `hinter`, `in`, `neben`, `über`, `unter`, `vor`, `zwischen`;
- location with `wo?`;
- dative forms;
- contractions such as `im`, `am`.

Exercise focus:

- describing static locations;
- choosing dative;
- matching pictures described in text;
- completing room and city descriptions.

### Chapter 36 — Two-Way Prepositions with Dative or Accusative

Cover:

- location versus destination/change of position;
- `wo?` versus `wohin?`;
- dative versus accusative;
- verbs of placement and movement.

Exercise focus:

- case selection;
- question-word cues;
- sentence pairs showing movement/location;
- correcting case errors.

### Chapter 37 — Local Prepositions Answering `Wohin?`

Cover:

- destination expressions;
- `nach`, `in`, `zu`, `auf`, `an`;
- countries with and without articles;
- people, institutions, events, and open spaces.

Exercise focus:

- selecting destination prepositions;
- article contractions;
- country/city rules;
- writing travel plans.

### Chapter 38 — Local Prepositions Answering `Wo?`

Cover:

- location expressions;
- `in`, `bei`, `an`, `auf`;
- countries and institutions;
- being at a person’s place;
- contractions.

Exercise focus:

- location choice;
- distinguishing `in` and `bei`;
- case endings;
- matching destination and location pairs.

### Chapter 39 — Local Prepositions Answering `Woher?`

Cover:

- origin expressions;
- `aus`, `von`;
- countries/cities;
- people, events, surfaces, and institutions;
- paired patterns `zu/von`, `in/aus`.

Exercise focus:

- choosing origin prepositions;
- matching `wohin`, `wo`, and `woher`;
- contractions;
- writing origin statements.

### Section: Adjectives 1

### Chapter 40 — Adjective Endings in the Nominative and Accusative

Cover:

- adjective after definite article;
- adjective after indefinite article;
- nominative and accusative;
- masculine accusative;
- adjective position before nouns.

Exercise focus:

- adding endings;
- choosing article-adjective combinations;
- identifying case;
- completing descriptions.

### Phase 4 Acceptance Criteria

All chapters through 40 complete. Add visual grammar tables for preposition-case relationships.

---

## Phase 5 — Chapters 41–50

### Chapter 41 — Adjective Endings in the Nominative, Accusative, and Dative

Cover:

- adjective declension across three cases;
- definite and indefinite article patterns;
- plural forms;
- dative plural;
- pattern-recognition strategy.

Exercise focus:

- case/gender/number analysis;
- endings;
- table completion;
- sentence correction;
- mixed-case descriptions.

### Chapter 42 — Comparative Forms and Comparative Sentences

Cover:

- `-er`;
- umlaut where applicable;
- irregular forms;
- `als`;
- equality with `so ... wie`;
- spelling rules.

Exercise focus:

- forming comparatives;
- choosing `als` or `wie`;
- writing comparisons;
- correcting irregular forms.

### Chapter 43 — Superlative Forms

Cover:

- attributive and adverbial superlative;
- `am ...-sten`;
- `der/die/das ...-ste`;
- irregular forms;
- spelling with `-est-`.

Exercise focus:

- forming superlatives;
- selecting construction;
- comparing three or more things;
- adjective endings in simple superlatives.

### Section: Sentences and Sentence Connections 1

### Chapter 44 — Coordinating Conjunctions

Cover:

- `und`, `aber`, `oder`, `denn`, `sondern`;
- normal main-clause word order;
- comma rules;
- `sondern` after negation;
- subject omission when shared.

Exercise focus:

- connector choice;
- punctuation;
- word order;
- contrast between `aber` and `sondern`.

### Chapter 45 — Connectors such as `deshalb`, `sonst`, `dann`, and `danach`

Cover:

- connectors as sentence elements;
- verb remains in position 2;
- cause-result and sequence;
- inversion after connector;
- punctuation between main clauses.

Exercise focus:

- verb position;
- connector meaning;
- sentence combination;
- timeline ordering.

### Chapter 46 — Subordinate Clauses with `weil`, `wenn`, and `dass`

Cover:

- finite verb at end;
- comma;
- causal, conditional/temporal, and content clauses;
- main clause before or after subordinate clause;
- inversion after initial subordinate clause.

Exercise focus:

- verb-final order;
- connector choice;
- clause combination;
- punctuation;
- initial subordinate clauses.

### Section: Words and Word Formation

### Chapter 47 — Compound Nouns

Cover:

- final noun determines gender;
- combining nouns;
- linking elements;
- stress note;
- semantic interpretation.

Exercise focus:

- building compounds;
- choosing article;
- splitting compounds;
- understanding head noun;
- selecting linking letters in common words.

### Chapter 48 — Compound Verbs

Cover:

- prefix and verb combinations;
- separable versus inseparable behavior;
- meaning shifts;
- common productive prefixes;
- dictionary forms.

Exercise focus:

- identifying prefix;
- deciding separability;
- sentence placement;
- matching base verbs and derived meanings.

### Chapter 49 — Rules for Grammatical Gender

Cover:

- semantic groups;
- common suffixes;
- days/months/seasons;
- diminutives;
- exceptions;
- memorization strategy.

Exercise focus:

- predicting gender from suffix;
- choosing articles;
- identifying exception risk;
- sorting nouns.

### Chapter 50 — Modal and Conversational Particles

Cover:

- particles such as `doch`, `mal`, `ja`, `denn`, `eigentlich`, `wohl`;
- pragmatic meaning;
- spoken register;
- particles are often unstressed;
- no one-to-one English translation.

Exercise focus:

- selecting particles in dialogue;
- interpreting tone;
- distinguishing particle use from literal use;
- rewriting overly direct requests.

### Phase 5 Acceptance Criteria

All chapters through 50 complete. Add dialogue-style exercise presentation where pragmatics matter.

---

## Phase 6 — Chapters 51–60

### Chapter 51 — Forming New Words with Prefixes and Suffixes

Cover:

- common noun suffixes;
- adjective suffixes;
- verb-forming prefixes/suffixes;
- changes in word class;
- gender clues from suffixes.

Exercise focus:

- deriving words;
- identifying word class;
- selecting suffixes;
- spelling changes;
- semantic families.

### Chapter 52 — Negation Expressions

Cover:

- `nicht`;
- `nichts`;
- `niemand`;
- `nie`;
- `noch nicht`;
- `nicht mehr`;
- `kein`;
- scope and time contrast.

Exercise focus:

- choosing negative expressions;
- distinguishing “not yet” and “no longer”;
- sentence transformation;
- placement and scope.

### Chapter 53 — Local Adverbs Expressing Position and Direction

Cover:

- `hier`, `da`, `dort`;
- `hin`, `her`;
- compounds such as `dorthin`, `hierher`;
- speaker perspective;
- `drinnen`, `draußen`, `oben`, `unten`.

Exercise focus:

- direction toward/away from speaker;
- location versus direction;
- dialogue completion;
- selecting adverbs from context.

### Section: Verbs 3

### Chapter 54 — Simple Past of Regular and Irregular Verbs

Cover:

- regular `-te` forms;
- irregular stems;
- mixed verbs;
- personal endings;
- narrative use;
- high-frequency forms.

Exercise focus:

- conjugation;
- identifying verb type;
- transforming present/perfect to simple past;
- filling short narratives.

### Chapter 55 — The Past Perfect

Cover:

- `hatte/war` + past participle;
- earlier past event;
- relation to simple past/perfect;
- word order;
- temporal connectors.

Exercise focus:

- forming past perfect;
- ordering events;
- selecting auxiliary;
- completing narratives.

### Chapter 56 — Reflexive Pronouns in the Accusative and Dative

Cover:

- accusative reflexive forms;
- dative reflexive forms;
- body-part and personal-item constructions;
- distinction based on another accusative object;
- common verbs.

Exercise focus:

- selecting `mich/mir`, `dich/dir`, etc.;
- identifying existing accusative object;
- completing routines;
- correcting case.

### Chapter 57 — Separable and Inseparable Verbs

Cover:

- stressed separable prefixes;
- unstressed inseparable prefixes;
- participle formation;
- infinitive with `zu`;
- prefixes that may be either depending on meaning.

Exercise focus:

- classifying verbs;
- present-tense placement;
- participles;
- `zu` placement;
- meaning-based distinction.

### Chapter 58 — Verbs with Fixed Prepositions

Cover:

- learning verb + preposition + case as a unit;
- common accusative combinations;
- common dative combinations;
- questions about people and things;
- no literal translation rule.

Exercise focus:

- matching verbs and prepositions;
- choosing case;
- completing fixed combinations;
- writing short questions and answers.

### Chapter 59 — Pronominal Adverbs and Prepositional Pronouns

Cover:

- `da(r)-` compounds for things;
- `wo(r)-` question forms;
- preposition + personal pronoun for people;
- vowel-triggered `r`;
- clause references.

Exercise focus:

- choosing person versus thing form;
- forming `darauf`, `womit`, etc.;
- replacing phrases;
- answering prepositional questions.

### Chapter 60 — Konjunktiv II: Formation

Cover:

- `würde` + infinitive;
- common synthetic forms;
- `wäre`, `hätte`, modal forms;
- umlaut and endings;
- distinction from simple past.

Exercise focus:

- building forms;
- choosing synthetic or `würde`;
- identifying mood;
- transforming factual statements.

### Phase 6 Acceptance Criteria

All chapters through 60 complete. Add morphology-focused validation tests for generated forms.

---

## Phase 7 — Chapters 61–70

### Chapter 61 — Konjunktiv II: Usage

Cover:

- polite requests;
- wishes;
- hypothetical situations;
- advice with `sollte`;
- unreal conditions;
- `wenn` clauses.

Exercise focus:

- polite reformulation;
- hypothetical answers;
- wish sentences;
- conditional clause order;
- meaning distinctions.

### Chapter 62 — The Passive Voice

Cover:

- `werden` + past participle;
- present passive;
- object becoming subject;
- agent with `von` or means with `durch`;
- when the agent is omitted.

Exercise focus:

- active-to-passive conversion;
- auxiliary conjugation;
- participle placement;
- identifying process focus.

### Chapter 63 — The Passive Voice in the Past

Cover:

- simple-past passive with `wurde`;
- present-perfect passive;
- distinction from state passive only as a warning if needed;
- word order;
- tense comparison.

Exercise focus:

- forming past passive;
- selecting tense;
- active-to-passive transformation;
- correcting auxiliary combinations.

### Chapter 64 — Predictions and Future Events with Futur I

Cover:

- `werden` + infinitive;
- predictions;
- intentions;
- future time often expressed with present tense;
- assumptions depending on context.

Exercise focus:

- forming future;
- choosing present versus future;
- making predictions;
- word order.

### Chapter 65 — Different Functions of `werden`

Cover:

- lexical `werden` meaning “become”;
- future auxiliary;
- passive auxiliary;
- conjugation;
- identifying function from sentence structure.

Exercise focus:

- classifying uses;
- completing forms;
- distinguishing infinitive and participle complements;
- rewriting sentences.

### Chapter 66 — The Verb `lassen`

Cover:

- allowing;
- causing/arranging;
- leaving something;
- `sich lassen`;
- infinitive without `zu`;
- present and perfect patterns at B1 level.

Exercise focus:

- meaning selection;
- sentence construction;
- infinitive placement;
- paraphrasing with modal/passive alternatives.

### Chapter 67 — Position and Direction Verbs

Cover:

- `stehen/stellen`;
- `liegen/legen`;
- `sitzen/setzen`;
- position versus placement;
- dative versus accusative with two-way prepositions;
- transitive versus intransitive patterns.

Exercise focus:

- selecting the verb;
- choosing case;
- describing rooms;
- correcting location/direction mismatches.

### Section: Nouns 2

### Chapter 68 — The Genitive Case

Cover:

- genitive articles;
- noun `-s/-es`;
- possession and formal relations;
- names with apostrophe rules;
- common spoken alternatives with `von`.

Exercise focus:

- article endings;
- noun endings;
- transforming `von` phrases;
- possessive relations.

### Chapter 69 — The N-Declension

Cover:

- masculine weak nouns;
- `-n/-en` outside nominative singular;
- common groups and suffixes;
- special nouns such as `Herr`;
- identifying case forms.

Exercise focus:

- adding endings;
- distinguishing nominative singular;
- article and noun combinations;
- sentence correction.

### Chapter 70 — Adjectives Used as Nouns for People

Cover:

- substantivized adjectives;
- capitalization;
- adjective endings;
- gender and number inferred from article/context;
- examples such as `der Deutsche`, `eine Bekannte`.

Exercise focus:

- capitalization;
- endings;
- article agreement;
- converting adjective+noun phrases.

### Phase 7 Acceptance Criteria

All chapters through 70 complete. Add advanced sentence-transformation test fixtures.

---

## Phase 8 — Chapters 71–80

### Chapter 71 — Adjectives Used as Neuter Nouns

Cover:

- `etwas Neues`;
- `nichts Wichtiges`;
- `das Gute`;
- capitalization;
- adjective endings after indefinite pronouns;
- abstract meanings.

Exercise focus:

- capitalization;
- endings;
- selecting quantifier;
- sentence completion.

### Section: Sentences and Sentence Connections 2

### Chapter 72 — Indirect Questions

Cover:

- introductory clauses;
- question word retained;
- `ob` for yes/no questions;
- verb-final order;
- punctuation;
- politeness.

Exercise focus:

- converting direct to indirect questions;
- choosing `ob`;
- word order;
- polite requests for information.

### Chapter 73 — Infinitive Constructions with `zu`

Cover:

- `zu` + infinitive;
- comma usage;
- shared subject;
- common verbs, adjectives, and nouns;
- placement with separable verbs.

Exercise focus:

- adding `zu`;
- placing `zu` in separable verbs;
- combining clauses;
- identifying when subjects match.

### Chapter 74 — Infinitive Constructions without `zu`

Cover:

- modal verbs;
- `lassen`;
- movement verbs in selected constructions;
- perception verbs;
- learning/teaching verbs where appropriate;
- contrast with `zu`.

Exercise focus:

- choosing with/without `zu`;
- sentence completion;
- identifying governing verbs;
- correcting infinitive constructions.

### Chapter 75 — Relative Clauses, Part 1

Cover:

- relative pronouns in nominative and accusative;
- gender/number from antecedent;
- case from relative-clause function;
- verb-final order;
- commas.

Exercise focus:

- selecting relative pronouns;
- combining sentences;
- identifying antecedent;
- word order.

### Chapter 76 — Relative Clauses, Part 2

Cover:

- dative and genitive relative pronouns;
- relative pronouns after prepositions;
- `wo` in appropriate contexts;
- more complex clause combinations;
- punctuation.

Exercise focus:

- case selection;
- preposition + relative pronoun;
- sentence combination;
- correcting advanced forms.

### Chapter 77 — Temporal Clauses with `wenn` and `als`

Cover:

- repeated/present/future events with `wenn`;
- one-time past events with `als`;
- verb-final order;
- clause order;
- distinction from conditional `wenn`.

Exercise focus:

- choosing connector;
- timeline interpretation;
- combining clauses;
- word order.

### Chapter 78 — Temporal Clauses with `während`, `bevor`, `nachdem`, and `seit`

Cover:

- simultaneous events;
- earlier/later sequence;
- tense relations;
- `seit/seitdem`;
- past perfect where needed;
- clause order.

Exercise focus:

- connector choice;
- event ordering;
- tense choice;
- sentence combination.

### Chapter 79 — Purpose Clauses with `um ... zu` and `damit`

Cover:

- same subject with `um ... zu`;
- different subject with `damit`;
- verb placement;
- comma;
- negated purpose.

Exercise focus:

- selecting construction;
- combining sentences;
- placing `zu`;
- identifying subject relationships.

### Chapter 80 — Paired Conjunctions

Cover:

- `entweder ... oder`;
- `weder ... noch`;
- `sowohl ... als auch`;
- `nicht nur ... sondern auch`;
- parallel structure;
- agreement and word order.

Exercise focus:

- selecting conjunction pair;
- completing both parts;
- maintaining parallel grammar;
- correcting mismatched pairs.

### Phase 8 Acceptance Criteria

All chapters through 80 complete. Add cumulative B1 clause-connection review.

---

## Phase 9 — Chapters 81–85

### Chapter 81 — Comparative Constructions with `je ... desto`

**Level:** B1

Cover:

- proportional comparison;
- comparative forms in both clauses;
- verb-final order after `je`;
- verb-second order after `desto/umso`;
- punctuation.

Exercise focus:

- comparative formation;
- clause order;
- sentence pairing;
- writing proportional statements.

### Section: Prepositions 2

### Chapter 82 — Prepositions Governing the Genitive

**Level:** B1

Cover:

- common genitive prepositions;
- examples such as `trotz`, `während`, `wegen`, `statt/anstatt`;
- genitive forms;
- common spoken dative variation as a usage note;
- formal written preference.

Exercise focus:

- selecting prepositions;
- genitive articles and noun endings;
- register awareness;
- sentence transformation.

### Chapter 83 — Advanced Temporal Prepositions and Expressions

**Level:** B1

Cover:

- expressions such as `innerhalb`, `außerhalb`, `während`, `seit`, `ab`, `bis zu`, `von ... an`;
- duration, deadline, starting point, and time span;
- case government;
- nuanced timeline meaning.

Exercise focus:

- selecting temporal expressions;
- case forms;
- interpreting deadlines;
- rewriting schedules and notices.

### Section: Adjectives 2

### Chapter 84 — Adjective Declension with and without an Article

**Level:** B1

Cover:

- strong, weak, and mixed adjective endings;
- no-article patterns;
- definite and indefinite article patterns;
- plural quantifiers;
- systematic decision process.

Exercise focus:

- full declension analysis;
- endings without articles;
- endings after quantifiers;
- mixed-case paragraphs;
- error correction.

### Chapter 85 — Present Participles Used as Adjectives

**Level:** B1

Cover:

- formation with infinitive + `-d`;
- adjective endings;
- active/contemporaneous meaning;
- distinction from past participles used adjectivally;
- expanded participial phrases only at an introductory B1 level.

Exercise focus:

- forming participles;
- adding adjective endings;
- distinguishing present and past participles;
- paraphrasing relative clauses;
- completing descriptive sentences.

### Phase 9 Acceptance Criteria

- all 85 chapters exist;
- all chapter files pass content validation;
- total exercise count is at least 2,040;
- total multiple-choice count is at least 1,020;
- total text-input count is at least 1,020;
- all chapter routes work;
- all chapter sections appear in the catalogue;
- learner can complete the full course;
- progress page reports A1, A2, and B1 completion;
- cumulative review can draw exercises from all chapters.

---

## Phase 10 — Course-Wide Quality, Review, and Release

### Goal

Prepare the complete application for production use.

### Deliverables

1. Review all grammar explanations for accuracy.
2. Review all German examples for naturalness.
3. Review all English translations.
4. Remove ambiguous exercises.
5. Verify all accepted text-input answers.
6. Check capitalization-sensitive exercises.
7. Check punctuation-sensitive exercises.
8. Run duplicate-content detection.
9. Run duplicate-exercise detection.
10. Verify chapter prerequisites.
11. Add cumulative tests for every ten-chapter block.
12. Add A1 checkpoint.
13. Add A2 checkpoint.
14. Add B1 checkpoint.
15. Add final mixed review.
16. Audit accessibility.
17. Audit responsive layout.
18. Audit performance.
19. Add error boundary.
20. Add content-load failure UI.
21. Add progress export/import.
22. Add reset-progress confirmation.
23. Add privacy statement.
24. Add source/originality disclosure.
25. Deploy production build.

### Production Acceptance Criteria

- Lighthouse accessibility score at least 95;
- Lighthouse performance score at least 90 on a typical desktop run;
- no critical axe violations;
- no TypeScript errors;
- no lint errors;
- all unit tests pass;
- all content validation tests pass;
- all end-to-end tests pass;
- no missing chapter numbers;
- no duplicate chapter numbers;
- no duplicate exercise IDs;
- no chapter has fewer than 24 exercises;
- application works at 320 px width;
- application works with keyboard only;
- progress can be exported and re-imported;
- production build deploys as a static site.

---

## 11. Chapter Registry

Create a single source of truth.

```ts
export const chapterRegistry = [
  { number: 1, title: 'Personal Pronouns', section: 'verbs-1', level: 'A1' },
  { number: 2, title: 'Present-Tense Conjugation', section: 'verbs-1', level: 'A1' },
  {
    number: 3,
    title: 'sein, haben, and Special Irregular Verbs',
    section: 'verbs-1',
    level: 'A1',
  },
  { number: 4, title: 'Verbs with Vowel Changes', section: 'verbs-1', level: 'A1' },
  {
    number: 5,
    title: 'Modal Verbs: Conjugation and Sentence Position',
    section: 'verbs-1',
    level: 'A1',
  },
  { number: 6, title: 'Modal Verbs: Usage, Part 1', section: 'verbs-1', level: 'A1' },
  { number: 7, title: 'Modal Verbs: Usage, Part 2', section: 'verbs-1', level: 'A1' },
  { number: 8, title: 'Separable Verbs', section: 'verbs-1', level: 'A1' },
  { number: 9, title: 'The Imperative', section: 'verbs-1', level: 'A1' },
  {
    number: 10,
    title: 'Questions with Interrogative Words',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 11,
    title: 'Yes/No Questions and Answers',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 12,
    title: 'The Verb in Position 2',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 13,
    title: 'Sentences with Two Fixed Verb Positions',
    section: 'sentences-and-questions',
    level: 'A1',
  },
  {
    number: 14,
    title: 'Plural Forms of Nouns',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 15,
    title: 'Definite, Indefinite, and Zero Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 16,
    title: 'Negation with nicht and kein',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 17,
    title: 'The Accusative Case',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 18,
    title: 'The Dative Case',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 19,
    title: 'Possessive Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 20,
    title: 'Interrogative and Demonstrative Articles',
    section: 'pronouns-nouns-articles',
    level: 'A1',
  },
  {
    number: 21,
    title: 'Personal Pronouns in the Accusative and Dative',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 22,
    title: 'Verbs Taking Both Accusative and Dative Objects',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 23,
    title: 'Verbs Taking a Dative Object',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  {
    number: 24,
    title: 'Asking About People and Things with the Correct Case',
    section: 'pronouns-nouns-articles',
    level: 'A2',
  },
  { number: 25, title: 'Simple Past of sein and haben', section: 'verbs-2', level: 'A1' },
  { number: 26, title: 'Present Perfect with haben', section: 'verbs-2', level: 'A1' },
  { number: 27, title: 'Present Perfect with sein', section: 'verbs-2', level: 'A1' },
  {
    number: 28,
    title: 'Formation of the Past Participle',
    section: 'verbs-2',
    level: 'A2',
  },
  { number: 29, title: 'Simple Past of Modal Verbs', section: 'verbs-2', level: 'A2' },
  {
    number: 30,
    title: 'Choosing and Using Past Tenses',
    section: 'verbs-2',
    level: 'A2',
  },
  {
    number: 31,
    title: 'Reflexive and Reciprocal Verbs',
    section: 'verbs-2',
    level: 'A2',
  },
  {
    number: 32,
    title: 'Basic Temporal Prepositions',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 33,
    title: 'Prepositions Governing the Dative',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 34,
    title: 'Prepositions Governing the Accusative',
    section: 'prepositions-1',
    level: 'A1',
  },
  {
    number: 35,
    title: 'Two-Way Prepositions Used with the Dative',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 36,
    title: 'Two-Way Prepositions with Dative or Accusative',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 37,
    title: 'Local Prepositions Answering Wohin?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 38,
    title: 'Local Prepositions Answering Wo?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 39,
    title: 'Local Prepositions Answering Woher?',
    section: 'prepositions-1',
    level: 'A2',
  },
  {
    number: 40,
    title: 'Adjective Endings in the Nominative and Accusative',
    section: 'adjectives-1',
    level: 'A2',
  },
  {
    number: 41,
    title: 'Adjective Endings in the Nominative, Accusative, and Dative',
    section: 'adjectives-1',
    level: 'A2',
  },
  {
    number: 42,
    title: 'Comparative Forms and Comparative Sentences',
    section: 'adjectives-1',
    level: 'A2',
  },
  { number: 43, title: 'Superlative Forms', section: 'adjectives-1', level: 'A2' },
  {
    number: 44,
    title: 'Coordinating Conjunctions',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 45,
    title: 'Connectors: deshalb, sonst, dann, danach',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 46,
    title: 'Subordinate Clauses with weil, wenn, and dass',
    section: 'sentence-connections-1',
    level: 'A2',
  },
  {
    number: 47,
    title: 'Compound Nouns',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 48,
    title: 'Compound Verbs',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 49,
    title: 'Rules for Grammatical Gender',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 50,
    title: 'Modal and Conversational Particles',
    section: 'words-and-word-formation',
    level: 'B1',
  },
  {
    number: 51,
    title: 'Forming New Words with Prefixes and Suffixes',
    section: 'words-and-word-formation',
    level: 'B1',
  },
  {
    number: 52,
    title: 'Negation Expressions',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 53,
    title: 'Local Adverbs Expressing Position and Direction',
    section: 'words-and-word-formation',
    level: 'A2',
  },
  {
    number: 54,
    title: 'Simple Past of Regular and Irregular Verbs',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 55, title: 'The Past Perfect', section: 'verbs-3', level: 'B1' },
  {
    number: 56,
    title: 'Reflexive Pronouns in the Accusative and Dative',
    section: 'verbs-3',
    level: 'B1',
  },
  {
    number: 57,
    title: 'Separable and Inseparable Verbs',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 58, title: 'Verbs with Fixed Prepositions', section: 'verbs-3', level: 'B1' },
  {
    number: 59,
    title: 'Pronominal Adverbs and Prepositional Pronouns',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 60, title: 'Konjunktiv II: Formation', section: 'verbs-3', level: 'B1' },
  { number: 61, title: 'Konjunktiv II: Usage', section: 'verbs-3', level: 'B1' },
  { number: 62, title: 'The Passive Voice', section: 'verbs-3', level: 'B1' },
  { number: 63, title: 'The Passive Voice in the Past', section: 'verbs-3', level: 'B1' },
  {
    number: 64,
    title: 'Predictions and Future Events with Futur I',
    section: 'verbs-3',
    level: 'B1',
  },
  { number: 65, title: 'Different Functions of werden', section: 'verbs-3', level: 'B1' },
  { number: 66, title: 'The Verb lassen', section: 'verbs-3', level: 'B1' },
  { number: 67, title: 'Position and Direction Verbs', section: 'verbs-3', level: 'B1' },
  { number: 68, title: 'The Genitive Case', section: 'nouns-2', level: 'B1' },
  { number: 69, title: 'The N-Declension', section: 'nouns-2', level: 'B1' },
  {
    number: 70,
    title: 'Adjectives Used as Nouns for People',
    section: 'nouns-2',
    level: 'B1',
  },
  {
    number: 71,
    title: 'Adjectives Used as Neuter Nouns',
    section: 'nouns-2',
    level: 'B1',
  },
  {
    number: 72,
    title: 'Indirect Questions',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 73,
    title: 'Infinitive Constructions with zu',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 74,
    title: 'Infinitive Constructions without zu',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 75,
    title: 'Relative Clauses, Part 1',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 76,
    title: 'Relative Clauses, Part 2',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 77,
    title: 'Temporal Clauses with wenn and als',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 78,
    title: 'Temporal Clauses with während, bevor, nachdem, and seit',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 79,
    title: 'Purpose Clauses with um ... zu and damit',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 80,
    title: 'Paired Conjunctions',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 81,
    title: 'Comparative Constructions with je ... desto',
    section: 'sentence-connections-2',
    level: 'B1',
  },
  {
    number: 82,
    title: 'Prepositions Governing the Genitive',
    section: 'prepositions-2',
    level: 'B1',
  },
  {
    number: 83,
    title: 'Advanced Temporal Prepositions and Expressions',
    section: 'prepositions-2',
    level: 'B1',
  },
  {
    number: 84,
    title: 'Adjective Declension with and without an Article',
    section: 'adjectives-2',
    level: 'B1',
  },
  {
    number: 85,
    title: 'Present Participles Used as Adjectives',
    section: 'adjectives-2',
    level: 'B1',
  },
] as const;
```

The chapter registry and chapter files must be checked against each other in an automated test.

---

## 12. Chapter File Template

Every new chapter must begin from this template.

```ts
import type { ChapterDefinition } from '../../schemas/chapterSchema';

export const chapter001: ChapterDefinition = {
  id: 'chapter-001',
  number: 1,
  slug: 'personal-pronouns',
  title: 'Personal Pronouns',
  germanTitle: 'Personalpronomen',
  level: 'A1',
  section: 'verbs-1',
  objective:
    'Recognize and use German subject pronouns in informal and formal situations.',
  prerequisites: [],
  estimatedMinutes: 25,
  tags: ['pronouns', 'subject', 'formal-address'],
  explanation: {
    introduction: [
      'German subject pronouns replace the person or thing performing an action.',
    ],
    rules: [
      {
        id: 'chapter-001-rule-01',
        heading: 'Singular pronouns',
        paragraphs: [
          'Use ich for the speaker and du for one person addressed informally.',
        ],
      },
    ],
    tables: [],
    examples: [],
    commonMistakes: [],
    remember: [],
  },
  exercises: [],
  mastery: {
    passingPercent: 80,
    minimumAnswered: 24,
    requiredCorrectTextInputs: 8,
  },
};
```

The template is incomplete by design. A chapter cannot pass validation until all required content is added.

---

## 13. Testing Strategy

### 13.1 Unit Tests

Test:

- answer normalization;
- capitalization rules;
- punctuation rules;
- scoring;
- mastery calculation;
- review scheduling;
- progress migration;
- chapter registry lookup;
- exercise shuffling;
- answer reveal logic.

### 13.2 Content Tests

For every chapter:

- validate schema;
- validate exercise count;
- validate type distribution;
- validate unique IDs;
- validate all correct option IDs;
- validate accepted answers;
- validate example count;
- validate common-mistake count;
- validate registry metadata;
- verify chapter number in each exercise.

### 13.3 Component Tests

Test:

- selecting an answer;
- submitting an answer;
- seeing feedback;
- retrying a text answer;
- revealing an answer;
- progressing to next exercise;
- leaving and resuming a session;
- keyboard-only use.

### 13.4 End-to-End Tests

Required flows:

1. Complete a chapter successfully.
2. Fail a chapter and retry.
3. Refresh during practice and resume.
4. Complete a review item.
5. Filter the chapter catalogue.
6. Export and import progress.
7. Navigate entire app with keyboard.
8. Complete a text-input exercise using umlauts.

---

## 14. Content Production Workflow

For every phase:

1. Create empty chapter files.
2. Add metadata.
3. Write explanation.
4. Add grammar tables.
5. Add examples.
6. Add common mistakes.
7. Add remember summary.
8. Write 12 multiple-choice exercises.
9. Write 12 text-input exercises.
10. Validate chapter.
11. Review German accuracy.
12. Review English clarity.
13. Review distractor quality.
14. Test accepted answers.
15. Add chapter-specific unit tests.
16. Mark chapter complete only after review.

Do not create all exercises through mechanical word substitution. Each chapter must contain varied contexts.

Suggested context rotation:

- home;
- family;
- work;
- school;
- shopping;
- travel;
- doctor;
- public transport;
- appointments;
- restaurants;
- housing;
- telephone calls;
- official communication;
- hobbies;
- weather;
- daily routine.

---

## 15. Definition of Done for a Chapter

A chapter is done only when:

- metadata is complete;
- explanation is accurate;
- at least 8 translated examples exist;
- at least 3 common mistakes exist;
- remember summary exists;
- at least 24 exercises exist;
- at least 12 exercises are multiple choice;
- at least 12 exercises are text input;
- all answers are validated;
- answer explanations exist;
- capitalization behavior is intentional;
- punctuation behavior is intentional;
- chapter renders correctly;
- mobile layout works;
- keyboard navigation works;
- content tests pass;
- manual language review is complete.

---

## 16. Definition of Done for a Phase

A phase is done only when:

- all assigned chapters meet the chapter definition of done;
- the chapter catalogue includes them;
- previous chapter content still passes tests;
- phase-specific cumulative review exists;
- navigation between chapters works;
- progress statistics include the new chapters;
- CI passes;
- production build succeeds.

---

## 17. AI-Agent Implementation Rules

The development agent must:

- complete phases in order;
- not skip validation;
- not fabricate a chapter as “complete” with placeholder exercises;
- not copy source-book wording;
- preserve chapter numbers and titles;
- keep chapter content separate from rendering components;
- use strict TypeScript;
- write tests with every feature;
- avoid `any`;
- avoid giant components;
- avoid storing derived values unnecessarily;
- use pure functions for scoring and normalization;
- keep exercise IDs stable after release;
- add migrations when persisted state changes;
- report exact files changed at the end of each phase;
- report test commands and results;
- document unresolved linguistic ambiguities.

The agent must not start the next phase until the current phase passes all acceptance criteria.

---

## 18. Optional Later Enhancements

These are outside the initial required scope:

- user accounts;
- cloud synchronization;
- audio pronunciation;
- speech recognition;
- teacher dashboard;
- printable worksheets;
- daily goals;
- streaks;
- achievements;
- adaptive difficulty;
- exercise generation with human review;
- German UI translation;
- Serbian UI translation;
- classroom groups;
- partner-speaking activities;
- placement test;
- downloadable course completion report.

Do not implement optional enhancements before all 85 required chapters are complete.
