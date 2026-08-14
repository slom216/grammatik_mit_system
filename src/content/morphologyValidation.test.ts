import { describe, expect, it } from 'vitest';
import {
  INSEPARABLE_PREFIXES,
  isValidAccusativeReflexivePronoun,
  isValidDativeReflexivePronoun,
  isValidKonjunktivIIForm,
  isValidPastParticiple,
  isValidPronominalAdverb,
  isValidReflexivePronoun,
  isValidSimplePastForm,
  isWuerdeConstruction,
  SEPARABLE_PREFIXES,
  synthesizePronominalAdverb,
  synthesizeSimplePast,
  synthesizeWeakParticiple,
  synthesizeWeakSimplePast,
  synthesizeWuerdeForm,
  type Person,
} from './morphologyValidation';
import { allChapters } from './allChapters';
import type { GrammarTableDefinition } from '../schemas/chapterSchema';

describe('synthesizeSimplePast / isValidSimplePastForm', () => {
  it('conjugates regular weak verbs across all persons', () => {
    expect(synthesizeSimplePast('machen', 'ich')).toBe('machte');
    expect(synthesizeSimplePast('machen', 'du')).toBe('machtest');
    expect(synthesizeSimplePast('machen', 'wir')).toBe('machten');
    expect(synthesizeSimplePast('spielen', 'sie')).toBe('spielten');
  });

  it('inserts a linking -e- for stems ending in -t/-d or a hard cluster', () => {
    expect(synthesizeSimplePast('arbeiten', 'ich')).toBe('arbeitete');
    expect(synthesizeSimplePast('warten', 'er')).toBe('wartete');
    expect(synthesizeSimplePast('öffnen', 'ich')).toBe('öffnete');
  });

  it('conjugates strong verbs with zero endings for ich/er', () => {
    expect(synthesizeSimplePast('gehen', 'ich')).toBe('ging');
    expect(synthesizeSimplePast('gehen', 'er')).toBe('ging');
    expect(synthesizeSimplePast('gehen', 'du')).toBe('gingst');
    expect(synthesizeSimplePast('gehen', 'wir')).toBe('gingen');
    expect(synthesizeSimplePast('gehen', 'ihr')).toBe('gingt');
    expect(synthesizeSimplePast('gehen', 'sie')).toBe('gingen');
  });

  it('collapses the du-ending after a sibilant-final stem', () => {
    expect(synthesizeSimplePast('lesen', 'du')).toBe('last');
    expect(synthesizeSimplePast('lesen', 'ihr')).toBe('last');
    expect(synthesizeSimplePast('essen', 'du')).toBe('aßt');
    expect(synthesizeSimplePast('heißen', 'du')).toBe('hießt');
  });

  it('inserts a linking -e- before du/ihr endings after a dental-final strong stem', () => {
    expect(synthesizeSimplePast('finden', 'du')).toBe('fandest');
    expect(synthesizeSimplePast('finden', 'ihr')).toBe('fandet');
    expect(synthesizeSimplePast('stehen', 'du')).toBe('standest');
    expect(synthesizeSimplePast('stehen', 'ihr')).toBe('standet');
    expect(synthesizeSimplePast('tun', 'du')).toBe('tatest');
    expect(synthesizeSimplePast('tun', 'ihr')).toBe('tatet');
  });

  it('conjugates mixed verbs with the weak ending on a changed stem', () => {
    expect(synthesizeSimplePast('haben', 'ich')).toBe('hatte');
    expect(synthesizeSimplePast('haben', 'du')).toBe('hattest');
    expect(synthesizeSimplePast('bringen', 'er')).toBe('brachte');
    expect(synthesizeSimplePast('wissen', 'wir')).toBe('wussten');
    expect(synthesizeSimplePast('können', 'ich')).toBe('konnte');
  });

  it('rejects a wrong form', () => {
    expect(isValidSimplePastForm('gehen', 'ich', 'gehte')).toBe(false);
    expect(isValidSimplePastForm('sein', 'du', 'bist')).toBe(false);
  });

  it('accepts the correct form regardless of surrounding whitespace/case', () => {
    expect(isValidSimplePastForm('sein', 'wir', ' Waren ')).toBe(true);
  });
});

describe('past participle formation', () => {
  it('derives weak participles with ge- + stem + t', () => {
    expect(synthesizeWeakParticiple('machen')).toBe('gemacht');
    expect(synthesizeWeakParticiple('kaufen')).toBe('gekauft');
    expect(synthesizeWeakParticiple('arbeiten')).toBe('gearbeitet');
    expect(synthesizeWeakParticiple('öffnen')).toBe('geöffnet');
  });

  it('validates irregular strong/mixed participles from the lookup table', () => {
    expect(isValidPastParticiple('gehen', 'gegangen')).toBe(true);
    expect(isValidPastParticiple('bringen', 'gebracht')).toBe(true);
    expect(isValidPastParticiple('sein', 'gewesen')).toBe(true);
  });

  it('reattaches ge- inside a separable verb', () => {
    expect(isValidPastParticiple('aufstehen', 'aufgestanden')).toBe(true);
    expect(isValidPastParticiple('einkaufen', 'eingekauft')).toBe(true);
    expect(isValidPastParticiple('mitkommen', 'mitgekommen')).toBe(true);
  });

  it('drops ge- for an inseparable-prefix verb', () => {
    expect(isValidPastParticiple('besuchen', 'besucht')).toBe(true);
    expect(isValidPastParticiple('verstehen', 'verstanden')).toBe(true);
    expect(isValidPastParticiple('bekommen', 'bekommen')).toBe(true);
  });

  it('drops ge- for an -ieren verb', () => {
    expect(isValidPastParticiple('studieren', 'studiert')).toBe(true);
    expect(isValidPastParticiple('telefonieren', 'telefoniert')).toBe(true);
  });

  it('rejects a wrong participle', () => {
    expect(isValidPastParticiple('gehen', 'gegeht')).toBe(false);
    expect(isValidPastParticiple('besuchen', 'gebesucht')).toBe(false);
  });
});

describe('Konjunktiv II formation', () => {
  it('accepts the synthetic form for a verb with a common synthetic K2', () => {
    expect(isValidKonjunktivIIForm('sein', 'ich', 'wäre')).toBe(true);
    expect(isValidKonjunktivIIForm('haben', 'du', 'hättest')).toBe(true);
    expect(isValidKonjunktivIIForm('gehen', 'wir', 'gingen')).toBe(true);
    expect(isValidKonjunktivIIForm('können', 'er', 'könnte')).toBe(true);
  });

  it('accepts the würde + infinitive construction for any verb', () => {
    expect(isValidKonjunktivIIForm('kommen', 'ich', 'würde kommen')).toBe(true);
    expect(isValidKonjunktivIIForm('machen', 'sie', 'würden machen')).toBe(true);
    expect(isWuerdeConstruction('würde kommen')).toBe(true);
    expect(isWuerdeConstruction('kommen würde')).toBe(false);
  });

  it('rejects a form that matches neither the synthetic nor the würde pattern', () => {
    expect(isValidKonjunktivIIForm('sein', 'ich', 'bin')).toBe(false);
    expect(isValidKonjunktivIIForm('kommen', 'ich', 'komme')).toBe(false);
  });
});

describe('reflexive pronouns', () => {
  it('accepts every accusative and dative reflexive pronoun', () => {
    for (const word of ['mich', 'mir', 'dich', 'dir', 'sich', 'uns', 'euch']) {
      expect(isValidReflexivePronoun(word)).toBe(true);
    }
  });

  it('rejects a non-reflexive personal pronoun', () => {
    expect(isValidReflexivePronoun('ihn')).toBe(false);
    expect(isValidReflexivePronoun('ihm')).toBe(false);
  });
});

describe('pronominal adverbs', () => {
  it('inserts r before a vowel-initial preposition', () => {
    expect(synthesizePronominalAdverb('da', 'auf')).toBe('darauf');
    expect(synthesizePronominalAdverb('wo', 'an')).toBe('woran');
    expect(synthesizePronominalAdverb('da', 'über')).toBe('darüber');
  });

  it('does not insert r before a consonant-initial preposition', () => {
    expect(synthesizePronominalAdverb('da', 'mit')).toBe('damit');
    expect(synthesizePronominalAdverb('wo', 'von')).toBe('wovon');
    expect(synthesizePronominalAdverb('da', 'für')).toBe('dafür');
  });

  it('validates known da(r)-/wo(r)- forms', () => {
    expect(isValidPronominalAdverb('darauf')).toBe(true);
    expect(isValidPronominalAdverb('worüber')).toBe(true);
    expect(isValidPronominalAdverb('damit')).toBe(true);
  });

  it('rejects a malformed pronominal adverb', () => {
    expect(isValidPronominalAdverb('daauf')).toBe(false);
    expect(isValidPronominalAdverb('wormit')).toBe(false);
    expect(isValidPronominalAdverb('daher')).toBe(false);
  });
});

/**
 * Cross-checks the generated word forms actually shipped in chapters 51 and
 * 54-60 against the derivation rules above, so an authoring slip in a
 * conjugated/derived form fails the suite instead of shipping silently.
 */
describe('Phase 6 chapters: generated forms match the morphology rules', () => {
  const SUBJECT_TO_PERSON: Record<string, Person> = {
    ich: 'ich',
    du: 'du',
    'er/sie/es': 'er',
    wir: 'wir',
    ihr: 'ihr',
    'sie/Sie': 'sie',
  };

  const chapterByNumber = new Map(
    allChapters.map((chapter) => [chapter.number, chapter]),
  );

  function requireTable(chapterNumber: number, tableId: string): GrammarTableDefinition {
    const chapter = chapterByNumber.get(chapterNumber);
    if (!chapter) throw new Error(`Chapter ${chapterNumber} has no content`);
    const table = chapter.explanation.tables.find((t) => t.id === tableId);
    if (!table)
      throw new Error(`Chapter ${chapterNumber} has no table with id "${tableId}"`);
    return table;
  }

  function personFor(subject: string): Person {
    const person = SUBJECT_TO_PERSON[subject];
    if (!person) throw new Error(`Unknown subject label "${subject}"`);
    return person;
  }

  it('chapter 54: regular-verb endings table (machen/arbeiten)', () => {
    const table = requireTable(54, 'ch54-table-01');
    for (const [subject, machenForm, arbeitenForm] of table.rows) {
      const person = personFor(subject!);
      expect(synthesizeWeakSimplePast('machen', person)).toBe(machenForm);
      expect(synthesizeWeakSimplePast('arbeiten', person)).toBe(arbeitenForm);
    }
  });

  it('chapter 54: common irregular verbs table (Infinitive / Simple Past)', () => {
    const table = requireTable(54, 'ch54-table-02');
    for (const [infinitive, simplePast] of table.rows) {
      expect(isValidSimplePastForm(infinitive!, 'er', simplePast!)).toBe(true);
    }
  });

  it('chapter 54: full conjugation table (gehen/lesen, all persons)', () => {
    const table = requireTable(54, 'ch54-table-03');
    const [gehen, lesen] = ['gehen', 'lesen'];
    for (const [subject, gehenForm, lesenForm] of table.rows) {
      const person = personFor(subject!);
      expect(isValidSimplePastForm(gehen, person, gehenForm!)).toBe(true);
      expect(isValidSimplePastForm(lesen, person, lesenForm!)).toBe(true);
    }
  });

  it('chapter 54: mixed-verb table (Infinitive / ich-er / du / wir-sie / ihr)', () => {
    const table = requireTable(54, 'ch54-table-04');
    for (const [infinitive, ichEr, du, wirSie, ihr] of table.rows) {
      expect(isValidSimplePastForm(infinitive!, 'ich', ichEr!)).toBe(true);
      expect(isValidSimplePastForm(infinitive!, 'er', ichEr!)).toBe(true);
      expect(isValidSimplePastForm(infinitive!, 'du', du!)).toBe(true);
      expect(isValidSimplePastForm(infinitive!, 'wir', wirSie!)).toBe(true);
      expect(isValidSimplePastForm(infinitive!, 'sie', wirSie!)).toBe(true);
      expect(isValidSimplePastForm(infinitive!, 'ihr', ihr!)).toBe(true);
    }
  });

  it('chapter 55: hatte/war auxiliary conjugation tables', () => {
    for (const [tableId, auxVerb] of [
      ['ch55-table-01', 'haben'],
      ['ch55-table-02', 'sein'],
    ] as const) {
      const table = requireTable(55, tableId);
      for (const [subject, form] of table.rows) {
        expect(isValidSimplePastForm(auxVerb, personFor(subject!), form!)).toBe(true);
      }
    }
  });

  it('chapter 55: past-perfect worked-examples table', () => {
    const table = requireTable(55, 'ch55-table-03');
    for (const [infinitive, auxiliary, pastPerfect] of table.rows) {
      const [auxWord, ...participleWords] = pastPerfect!.split(' ');
      expect(auxWord).toBe(auxiliary);
      expect(
        isValidSimplePastForm(auxiliary === 'war' ? 'sein' : 'haben', 'er', auxiliary!),
      ).toBe(true);
      expect(isValidPastParticiple(infinitive!, participleWords.join(' '))).toBe(true);
    }
  });

  it('chapter 56: accusative/dative reflexive pronoun table', () => {
    const table = requireTable(56, 'ch56-table-01');
    for (const [subject, accusative, dative] of table.rows) {
      const person = personFor(subject!);
      expect(isValidAccusativeReflexivePronoun(person, accusative!)).toBe(true);
      expect(isValidDativeReflexivePronoun(person, dative!)).toBe(true);
      expect(isValidReflexivePronoun(accusative!)).toBe(true);
      expect(isValidReflexivePronoun(dative!)).toBe(true);
    }
  });

  it('chapter 57: separable/inseparable participle-formation table', () => {
    const table = requireTable(57, 'ch57-table-02');
    for (const [infinitive, , participle] of table.rows) {
      expect(isValidPastParticiple(infinitive!, participle!)).toBe(true);
    }
  });

  it('chapter 57: zu-infinitive table', () => {
    const table = requireTable(57, 'ch57-table-03');
    for (const [infinitive, type, zuInfinitive] of table.rows) {
      if (type === 'inseparable') {
        expect(zuInfinitive).toBe(`zu ${infinitive}`);
        continue;
      }
      const prefix = [...SEPARABLE_PREFIXES, ...INSEPARABLE_PREFIXES]
        .filter((p) => infinitive!.startsWith(p))
        .sort((a, b) => b.length - a.length)[0];
      expect(prefix, `no known prefix for "${infinitive}"`).toBeDefined();
      const base = infinitive!.slice(prefix!.length);
      expect(zuInfinitive).toBe(`${prefix}zu${base}`);
    }
  });

  it('chapter 59: da(r)-/wo(r)- preposition table', () => {
    const table = requireTable(59, 'ch59-table-01');
    for (const [preposition, daForm, woForm] of table.rows) {
      expect(synthesizePronominalAdverb('da', preposition!)).toBe(daForm);
      expect(synthesizePronominalAdverb('wo', preposition!)).toBe(woForm);
      expect(isValidPronominalAdverb(daForm!)).toBe(true);
      expect(isValidPronominalAdverb(woForm!)).toBe(true);
    }
  });

  it('chapter 60: wäre/hätte full conjugation table', () => {
    const table = requireTable(60, 'ch60-table-01');
    for (const [subject, seinForm, habenForm] of table.rows) {
      const person = personFor(subject!);
      expect(isValidKonjunktivIIForm('sein', person, seinForm!)).toBe(true);
      expect(isValidKonjunktivIIForm('haben', person, habenForm!)).toBe(true);
    }
  });

  it('chapter 60: modal verbs Konjunktiv II table', () => {
    const table = requireTable(60, 'ch60-table-02');
    for (const [infinitive, ichEr, du, wirSie] of table.rows) {
      expect(isValidKonjunktivIIForm(infinitive!, 'ich', ichEr!)).toBe(true);
      expect(isValidKonjunktivIIForm(infinitive!, 'er', ichEr!)).toBe(true);
      expect(isValidKonjunktivIIForm(infinitive!, 'du', du!)).toBe(true);
      expect(isValidKonjunktivIIForm(infinitive!, 'wir', wirSie!)).toBe(true);
      expect(isValidKonjunktivIIForm(infinitive!, 'sie', wirSie!)).toBe(true);
    }
  });

  it('chapter 60: strong-verb simple-past vs. Konjunktiv II table', () => {
    const table = requireTable(60, 'ch60-table-03');
    for (const [infinitive, simplePast, konjunktivII] of table.rows) {
      expect(isValidSimplePastForm(infinitive!, 'er', simplePast!)).toBe(true);
      expect(isValidKonjunktivIIForm(infinitive!, 'er', konjunktivII!)).toBe(true);
    }
  });

  it('chapter 60: synthetic vs. würde-construction table', () => {
    const table = requireTable(60, 'ch60-table-04');
    for (const [infinitive, synthetic, wuerdeForm] of table.rows) {
      expect(wuerdeForm).toBe(synthesizeWuerdeForm(infinitive!, 'ich'));
      if (!synthetic!.startsWith('—')) {
        expect(isValidKonjunktivIIForm(infinitive!, 'ich', synthetic!)).toBe(true);
      }
    }
  });
});
