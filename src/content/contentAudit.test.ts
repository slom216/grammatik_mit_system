import { describe, expect, it } from 'vitest';
import { auditChapter, auditChapters, similarity } from './contentAudit';
import { allChapters } from './allChapters';
import { makeChapter, makeSingleChoice, makeTextInput } from '../test/fixtures/chapterFixture';

describe('similarity', () => {
  it('ignores case and punctuation', () => {
    expect(similarity('Ich gehe heim.', 'ich gehe heim')).toBe(1);
  });

  it('scores unrelated sentences low', () => {
    expect(similarity('Ich gehe heim.', 'Der Hund schläft.')).toBeLessThan(0.2);
  });
});

describe('auditChapter', () => {
  it('flags two exercises that ask for the same answer', () => {
    const chapter = makeChapter({
      exercises: [
        makeTextInput(1, {
          id: 'a',
          instruction: 'Ask your colleague to be patient.',
          prompt: 'sein / geduldig / Sie / bitte',
        }),
        makeTextInput(2, {
          id: 'b',
          instruction: 'Ask your dentist to be patient.',
          prompt: 'sein / geduldig / Sie / bitte',
        }),
      ],
    });

    const findings = auditChapter(chapter);
    expect(findings.map((finding) => finding.kind)).toContain('duplicate-question');
  });

  it('leaves two questions about the same sentence alone', () => {
    // The Satzklammer chapter deliberately asks two things about one sentence.
    const base = makeSingleChoice(1, { id: 'a', instruction: 'Which verb is finite?' });
    const chapter = makeChapter({
      exercises: [
        base,
        {
          ...base,
          id: 'b',
          order: 2,
          instruction: 'Which word closes the bracket?',
          correctOptionId: base.options[1]?.id ?? 'b',
        },
      ],
    });

    expect(auditChapter(chapter)).toEqual([]);
  });

  it('flags stray whitespace in a prompt', () => {
    const chapter = makeChapter({
      exercises: [makeSingleChoice(1, { id: 'a', prompt: 'Wer  ist das?' })],
    });
    expect(auditChapter(chapter)[0]?.kind).toBe('whitespace');
  });
});

describe('the shipped course', () => {
  it('has no duplicated exercises', () => {
    const duplicates = auditChapters(allChapters).filter(
      (finding) =>
        finding.kind === 'duplicate-prompt' || finding.kind === 'duplicate-question',
    );
    expect(duplicates).toEqual([]);
  });

  it('has no stray whitespace in prompts', () => {
    const whitespace = auditChapters(allChapters).filter(
      (finding) => finding.kind === 'whitespace',
    );
    expect(whitespace).toEqual([]);
  });
});
