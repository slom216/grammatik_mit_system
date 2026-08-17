import { describe, expect, it } from 'vitest';
import { promptWithoutSentence } from './DragToSlotsExercise';

describe('promptWithoutSentence', () => {
  it('drops a prompt that is only the gapped sentence', () => {
    expect(
      promptWithoutSentence('Er wohnt schon ___ vielen Jahren in Hamburg.', [
        'Er wohnt schon ',
        ' vielen Jahren in Hamburg.',
      ]),
    ).toBeNull();
  });

  it('keeps a trailing grammar hint', () => {
    expect(
      promptWithoutSentence('Der ___ Kaffee ist gut. (Nominativ, maskulin)', [
        'Der ',
        ' Kaffee ist gut.',
      ]),
    ).toBe('(Nominativ, maskulin)');
  });

  it('keeps the situation and drops the quoted restatement', () => {
    expect(
      promptWithoutSentence(
        'Vervollständige den Satz über Toms Zukunftsplan: "Tom ___ nach dem Studium ein eigenes Unternehmen gründen."',
        ['Tom ', ' nach dem Studium ein eigenes Unternehmen gründen.'],
      ),
    ).toBe('Vervollständige den Satz über Toms Zukunftsplan');
  });

  it('leaves a prompt that says something else entirely', () => {
    expect(
      promptWithoutSentence('Wähle das richtige Modalverb.', [
        'Tom ',
        ' schwimmen.',
      ]),
    ).toBe('Wähle das richtige Modalverb.');
  });
});
