import { describe, expect, it } from 'vitest';
import {
  AGENT_PREPOSITION_CASE,
  genitiveNounEnding,
  isValidAgentPreposition,
  isValidFuturI,
  isValidGenitiveNoun,
  isValidNameGenitive,
  isValidPassiveParticiple,
  isValidPassivePerfectParticiple,
  isValidPresentPassiveAuxiliary,
  isValidPresentPerfectPassiveAuxiliary,
  isValidPresentWerdenForm,
  isValidSimplePastPassiveAuxiliary,
  isValidWeakNounObliqueSingular,
  isValidWeakNounPlural,
  nameGenitive,
  type Person,
} from './sentenceTransformation';
import { getChapter } from './registry';
import type { GrammarTableDefinition } from '../schemas/chapterSchema';

describe('Futur I and present-passive auxiliary (both use present-tense werden)', () => {
  it('conjugates werden with its irregular du/er stem change', () => {
    expect(isValidPresentWerdenForm('ich', 'werde')).toBe(true);
    expect(isValidPresentWerdenForm('du', 'wirst')).toBe(true);
    expect(isValidPresentWerdenForm('er', 'wird')).toBe(true);
    expect(isValidPresentWerdenForm('wir', 'werden')).toBe(true);
  });

  it('rejects a form that ignores the du/er stem change', () => {
    expect(isValidPresentWerdenForm('du', 'werdst')).toBe(false);
    expect(isValidPresentWerdenForm('er', 'werdet')).toBe(false);
  });

  it('validates Futur I and present-passive auxiliaries the same way', () => {
    expect(isValidFuturI('ich', 'werde')).toBe(true);
    expect(isValidPresentPassiveAuxiliary('ich', 'werde')).toBe(true);
  });
});

describe('simple-past passive auxiliary (wurde)', () => {
  it('conjugates wurde across all persons', () => {
    expect(isValidSimplePastPassiveAuxiliary('ich', 'wurde')).toBe(true);
    expect(isValidSimplePastPassiveAuxiliary('du', 'wurdest')).toBe(true);
    expect(isValidSimplePastPassiveAuxiliary('wir', 'wurden')).toBe(true);
  });

  it('rejects the present-tense form used in the wrong tense', () => {
    expect(isValidSimplePastPassiveAuxiliary('ich', 'werde')).toBe(false);
  });
});

describe('present-perfect passive (sein + participle + worden)', () => {
  it('conjugates the sein auxiliary', () => {
    expect(isValidPresentPerfectPassiveAuxiliary('ich', 'bin')).toBe(true);
    expect(isValidPresentPerfectPassiveAuxiliary('er', 'ist')).toBe(true);
    expect(isValidPresentPerfectPassiveAuxiliary('sie', 'sind')).toBe(true);
  });

  it('requires "worden", not the ordinary participle "geworden"', () => {
    expect(isValidPassivePerfectParticiple('worden')).toBe(true);
    expect(isValidPassivePerfectParticiple('geworden')).toBe(false);
  });

  it('validates the main verb participle via the shared morphology rules', () => {
    expect(isValidPassiveParticiple('kaufen', 'gekauft')).toBe(true);
    expect(isValidPassiveParticiple('schreiben', 'geschrieben')).toBe(true);
    expect(isValidPassiveParticiple('kaufen', 'gekaufen')).toBe(false);
  });
});

describe('agent phrases: von + dative vs. durch + accusative', () => {
  it('recognizes both agent prepositions', () => {
    expect(isValidAgentPreposition('von')).toBe(true);
    expect(isValidAgentPreposition('durch')).toBe(true);
    expect(isValidAgentPreposition('mit')).toBe(false);
  });

  it('assigns the correct case to each', () => {
    expect(AGENT_PREPOSITION_CASE.von).toBe('dative');
    expect(AGENT_PREPOSITION_CASE.durch).toBe('accusative');
  });
});

describe('genitive noun endings', () => {
  it('adds plain -s to a polysyllabic, non-sibilant noun', () => {
    expect(genitiveNounEnding('Auto')).toBe('s');
    expect(genitiveNounEnding('Computer')).toBe('s');
    expect(isValidGenitiveNoun('Auto', 'Autos')).toBe(true);
  });

  it('adds -es to a sibilant-final noun', () => {
    expect(genitiveNounEnding('Haus')).toBe('es');
    expect(genitiveNounEnding('Fluss')).toBe('es');
    expect(isValidGenitiveNoun('Haus', 'Hauses')).toBe(true);
  });

  it('adds -es to the hand-picked monosyllabic nouns', () => {
    expect(genitiveNounEnding('Mann')).toBe('es');
    expect(genitiveNounEnding('Kind')).toBe('es');
    expect(isValidGenitiveNoun('Mann', 'Mannes')).toBe(true);
  });

  it('rejects the wrong ending', () => {
    expect(isValidGenitiveNoun('Auto', 'Autoes')).toBe(false);
    expect(isValidGenitiveNoun('Mann', 'Manns')).toBe(false);
  });
});

describe('genitive of proper names', () => {
  it('adds plain -s to most names', () => {
    expect(nameGenitive('Anna')).toBe('Annas');
    expect(isValidNameGenitive('Anna', 'Annas')).toBe(true);
  });

  it('adds a bare apostrophe to a sibilant-final name', () => {
    expect(nameGenitive('Max')).toBe("Max'");
    expect(isValidNameGenitive('Max', "Max'")).toBe(true);
  });
});

describe('N-declension (weak masculine nouns)', () => {
  it('adds -n outside the nominative singular for -e nouns', () => {
    expect(isValidWeakNounObliqueSingular('Junge', 'Jungen')).toBe(true);
    expect(isValidWeakNounPlural('Junge', 'Jungen')).toBe(true);
  });

  it('adds -en for consonant-final weak nouns', () => {
    expect(isValidWeakNounObliqueSingular('Student', 'Studenten')).toBe(true);
    expect(isValidWeakNounPlural('Student', 'Studenten')).toBe(true);
  });

  it("Herr: -n in the oblique singular but -en in the plural", () => {
    expect(isValidWeakNounObliqueSingular('Herr', 'Herrn')).toBe(true);
    expect(isValidWeakNounPlural('Herr', 'Herren')).toBe(true);
    expect(isValidWeakNounPlural('Herr', 'Herrn')).toBe(false);
  });

  it('rejects an unknown noun', () => {
    expect(isValidWeakNounObliqueSingular('Tisch', 'Tischen')).toBe(false);
  });
});

/**
 * Cross-checks the generated forms actually shipped in chapters 62-65, 68,
 * and 69 against the derivation rules above, so an authoring slip in a
 * passive-voice, Futur I, genitive, or N-declension form fails the suite
 * instead of shipping silently.
 */
describe('Phase 7 chapters: generated forms match the sentence-transformation rules', () => {
  const SUBJECT_TO_PERSON: Record<string, Person> = {
    ich: 'ich',
    du: 'du',
    'er/sie/es': 'er',
    wir: 'wir',
    ihr: 'ihr',
    'sie/Sie': 'sie',
  };

  function requireTable(chapterNumber: number, tableId: string): GrammarTableDefinition {
    const chapter = getChapter(chapterNumber);
    if (!chapter) throw new Error(`Chapter ${chapterNumber} has no content`);
    const table = chapter.explanation.tables.find((t) => t.id === tableId);
    if (!table) throw new Error(`Chapter ${chapterNumber} has no table with id "${tableId}"`);
    return table;
  }

  function personFor(subject: string): Person {
    const person = SUBJECT_TO_PERSON[subject];
    if (!person) throw new Error(`Unknown subject label "${subject}"`);
    return person;
  }

  /** Strips a leading der/die/das/den/dem/des article, returning the bare noun. */
  function stripArticle(phrase: string): string {
    return phrase.replace(/^(der|die|das|den|dem|des)\s+/, '');
  }

  it('chapter 62: present-tense werden (passive auxiliary) conjugation table', () => {
    const table = requireTable(62, 'ch62-table-01');
    for (const [subject, form] of table.rows) {
      expect(isValidPresentPassiveAuxiliary(personFor(subject!), form!)).toBe(true);
    }
  });

  it('chapter 62: von/durch agent-phrase case contrast table', () => {
    const table = requireTable(62, 'ch62-table-03');
    expect(table.columnCases).toEqual(['dative', 'accusative']);
    for (const [vonPhrase, durchPhrase] of table.rows) {
      const [vonWord] = vonPhrase!.split(/\s+/);
      const [durchWord] = durchPhrase!.split(/\s+/);
      expect(isValidAgentPreposition(vonWord!)).toBe(true);
      expect(isValidAgentPreposition(durchWord!)).toBe(true);
      expect(AGENT_PREPOSITION_CASE[vonWord as 'von' | 'durch']).toBe('dative');
      expect(AGENT_PREPOSITION_CASE[durchWord as 'von' | 'durch']).toBe('accusative');
    }
  });

  it('chapter 62: past-participle table used across the present passive', () => {
    const table = requireTable(62, 'ch62-table-04');
    for (const [infinitive, participle] of table.rows) {
      expect(isValidPassiveParticiple(infinitive!, participle!)).toBe(true);
    }
  });

  it('chapter 63: wurde (simple-past passive auxiliary) conjugation table', () => {
    const table = requireTable(63, 'ch63-table-01');
    for (const [subject, form] of table.rows) {
      expect(isValidSimplePastPassiveAuxiliary(personFor(subject!), form!)).toBe(true);
    }
  });

  it('chapter 63: sein (present-perfect passive auxiliary) conjugation table', () => {
    const table = requireTable(63, 'ch63-table-02');
    for (const [subject, form] of table.rows) {
      expect(isValidPresentPerfectPassiveAuxiliary(personFor(subject!), form!)).toBe(true);
    }
  });

  it('chapter 63: simple-past passive across verbs (wurde + participle)', () => {
    const table = requireTable(63, 'ch63-table-03');
    for (const [infinitive, form] of table.rows) {
      const [aux, ...participleWords] = form!.split(/\s+/);
      expect(aux).toBe('wurde');
      expect(isValidPassiveParticiple(infinitive!, participleWords.join(' '))).toBe(true);
    }
  });

  it('chapter 63: present-perfect passive across verbs (ist + participle + worden)', () => {
    const table = requireTable(63, 'ch63-table-04');
    for (const [infinitive, form] of table.rows) {
      const words = form!.split(/\s+/);
      const [aux, ...rest] = words;
      const last = rest.pop();
      expect(aux).toBe('ist');
      expect(isValidPassivePerfectParticiple(last!)).toBe(true);
      expect(isValidPassiveParticiple(infinitive!, rest.join(' '))).toBe(true);
    }
  });

  it('chapter 63: worden vs. geworden contrast table', () => {
    const table = requireTable(63, 'ch63-table-05');
    for (const [meaning, participleUsed] of table.rows) {
      const [firstWord] = participleUsed!.split(/\s+/);
      if (meaning!.startsWith('Lexical')) {
        expect(firstWord).toBe('geworden');
      } else {
        expect(firstWord).toBe('worden');
        expect(isValidPassivePerfectParticiple(firstWord!)).toBe(true);
      }
    }
  });

  it('chapter 64: present-tense werden (Futur I auxiliary) conjugation table', () => {
    const table = requireTable(64, 'ch64-table-01');
    for (const [subject, form] of table.rows) {
      expect(isValidFuturI(personFor(subject!), form!)).toBe(true);
    }
  });

  it('chapter 65: present and simple-past werden, shared by all three functions', () => {
    const table = requireTable(65, 'ch65-table-01');
    for (const [subject, present, simplePast] of table.rows) {
      const person = personFor(subject!);
      expect(isValidPresentWerdenForm(person, present!)).toBe(true);
      expect(isValidSimplePastPassiveAuxiliary(person, simplePast!)).toBe(true);
    }
  });

  it('chapter 65: geworden-vs-worden crux table', () => {
    const table = requireTable(65, 'ch65-table-03');
    for (const [functionLabel, , participleColumn] of table.rows) {
      const [firstWord] = participleColumn!.split(/\s+/);
      if (functionLabel === 'Lexical ("become")') {
        expect(firstWord).toBe('geworden');
      } else {
        expect(firstWord).toBe('worden');
        expect(isValidPassivePerfectParticiple(firstWord!)).toBe(true);
      }
    }
  });

  it('chapter 68: masculine/neuter genitive noun endings (-s vs. -es)', () => {
    const table = requireTable(68, 'ch68-table-02');
    for (const [nominative, genitive] of table.rows) {
      const noun = stripArticle(nominative!);
      const genitiveNoun = stripArticle(genitive!);
      expect(isValidGenitiveNoun(noun, genitiveNoun)).toBe(true);
    }
  });

  it('chapter 68: genitiveNounEnding matches the ending column', () => {
    const table = requireTable(68, 'ch68-table-02');
    for (const [nominative, , ending] of table.rows) {
      const noun = stripArticle(nominative!);
      expect(`-${genitiveNounEnding(noun)}`).toBe(ending);
    }
  });

  it('chapter 68: proper names in the genitive', () => {
    const table = requireTable(68, 'ch68-table-04');
    for (const [name, genitive] of table.rows) {
      expect(isValidNameGenitive(name!, genitive!)).toBe(true);
      expect(nameGenitive(name!)).toBe(genitive);
    }
  });

  it('chapter 69: the closed list of weak nouns (oblique singular + plural)', () => {
    const table = requireTable(69, 'ch69-table-05');
    for (const [noun, , obliqueSingular, plural] of table.rows) {
      expect(isValidWeakNounObliqueSingular(noun!, obliqueSingular!)).toBe(true);
      expect(isValidWeakNounPlural(noun!, plural!)).toBe(true);
    }
  });

  it('chapter 69: Herr — oblique singular Herrn vs. plural Herren', () => {
    const table = requireTable(69, 'ch69-table-04');
    for (const [caseName, singular, plural] of table.rows) {
      if (caseName !== 'Nominative') {
        expect(isValidWeakNounObliqueSingular('Herr', stripArticle(singular!))).toBe(true);
      }
      expect(isValidWeakNounPlural('Herr', stripArticle(plural!))).toBe(true);
    }
  });
});
