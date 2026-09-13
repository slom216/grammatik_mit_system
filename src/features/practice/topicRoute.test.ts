import { describe, expect, it } from 'vitest';
import { topicExerciseIds } from './topicRoute';
import { makeChapter } from '../../test/fixtures/chapterFixture';

describe('topicExerciseIds', () => {
  it('finds exercises tagged with any spelling of the topic', () => {
    const base = makeChapter();
    const [first, second, third] = base.exercises;
    const chapter = {
      ...base,
      exercises: [
        { ...first!, grammarFocus: ['dragToSlots', 'comma-rules'] },
        { ...second!, grammarFocus: ['comma-rule'] },
        { ...third!, grammarFocus: ['dative'] },
      ],
    };

    expect(topicExerciseIds([chapter], 'comma-rule', {}).sort()).toEqual(
      [first!.id, second!.id].sort(),
    );
  });
});
