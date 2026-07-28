/**
 * Rule-based and lookup-based validators for German morphological forms
 * (simple past, past participle, Konjunktiv II, reflexive pronouns,
 * pronominal adverbs). Used by morphologyValidation.test.ts to catch
 * authoring slips in generated word forms across chapters 51-60, and
 * exported for reuse by any future chapter that generates inflected forms.
 */

export type Person = 'ich' | 'du' | 'er' | 'wir' | 'ihr' | 'sie';

type VerbCategory = 'strong' | 'mixed';

interface VerbEntry {
  category: VerbCategory;
  /** Strong verbs: the bare 3sg/1sg simple-past form (e.g. "ging"). */
  /** Mixed verbs: the past stem before the weak -te ending (e.g. "hatt"). */
  pastStem: string;
  participle: string;
  auxiliary: 'haben' | 'sein';
  /** 3sg-minus-e Konjunktiv II stem, e.g. "wär" -> wäre/wärest/... Omit if the
   * verb's synthetic form is archaic/rare and only würde + infinitive should
   * be accepted. */
  k2Stem?: string;
}

const WEAK_PAST_ENDINGS: Record<Person, string> = {
  ich: 'te',
  du: 'test',
  er: 'te',
  wir: 'ten',
  ihr: 'tet',
  sie: 'ten',
};

const K2_ENDINGS: Record<Person, string> = {
  ich: 'e',
  du: 'est',
  er: 'e',
  wir: 'en',
  ihr: 'et',
  sie: 'en',
};

const SIBILANT_END = /[sßzx]$/;
const LINKING_E_STEM = /(t|d|chn|ffn|gn|dn|tm|dm)$/;

export const IRREGULAR_VERBS: Record<string, VerbEntry> = {
  sein: { category: 'strong', pastStem: 'war', participle: 'gewesen', auxiliary: 'sein', k2Stem: 'wär' },
  haben: { category: 'mixed', pastStem: 'hatt', participle: 'gehabt', auxiliary: 'haben', k2Stem: 'hätt' },
  werden: { category: 'mixed', pastStem: 'wurd', participle: 'geworden', auxiliary: 'sein', k2Stem: 'würd' },
  gehen: { category: 'strong', pastStem: 'ging', participle: 'gegangen', auxiliary: 'sein', k2Stem: 'ging' },
  kommen: { category: 'strong', pastStem: 'kam', participle: 'gekommen', auxiliary: 'sein', k2Stem: 'käm' },
  sehen: { category: 'strong', pastStem: 'sah', participle: 'gesehen', auxiliary: 'haben', k2Stem: 'säh' },
  geben: { category: 'strong', pastStem: 'gab', participle: 'gegeben', auxiliary: 'haben', k2Stem: 'gäb' },
  nehmen: { category: 'strong', pastStem: 'nahm', participle: 'genommen', auxiliary: 'haben', k2Stem: 'nähm' },
  fahren: { category: 'strong', pastStem: 'fuhr', participle: 'gefahren', auxiliary: 'sein', k2Stem: 'führ' },
  bleiben: { category: 'strong', pastStem: 'blieb', participle: 'geblieben', auxiliary: 'sein', k2Stem: 'blieb' },
  essen: { category: 'strong', pastStem: 'aß', participle: 'gegessen', auxiliary: 'haben', k2Stem: 'äß' },
  trinken: { category: 'strong', pastStem: 'trank', participle: 'getrunken', auxiliary: 'haben', k2Stem: 'tränk' },
  lesen: { category: 'strong', pastStem: 'las', participle: 'gelesen', auxiliary: 'haben', k2Stem: 'läs' },
  schreiben: { category: 'strong', pastStem: 'schrieb', participle: 'geschrieben', auxiliary: 'haben', k2Stem: 'schrieb' },
  sprechen: { category: 'strong', pastStem: 'sprach', participle: 'gesprochen', auxiliary: 'haben', k2Stem: 'spräch' },
  finden: { category: 'strong', pastStem: 'fand', participle: 'gefunden', auxiliary: 'haben', k2Stem: 'fänd' },
  wissen: { category: 'mixed', pastStem: 'wusst', participle: 'gewusst', auxiliary: 'haben', k2Stem: 'wüsst' },
  bringen: { category: 'mixed', pastStem: 'bracht', participle: 'gebracht', auxiliary: 'haben' },
  denken: { category: 'mixed', pastStem: 'dacht', participle: 'gedacht', auxiliary: 'haben' },
  kennen: { category: 'mixed', pastStem: 'kannt', participle: 'gekannt', auxiliary: 'haben' },
  nennen: { category: 'mixed', pastStem: 'nannt', participle: 'genannt', auxiliary: 'haben' },
  stehen: { category: 'strong', pastStem: 'stand', participle: 'gestanden', auxiliary: 'haben', k2Stem: 'stünd' },
  tun: { category: 'strong', pastStem: 'tat', participle: 'getan', auxiliary: 'haben', k2Stem: 'tät' },
  laufen: { category: 'strong', pastStem: 'lief', participle: 'gelaufen', auxiliary: 'sein' },
  tragen: { category: 'strong', pastStem: 'trug', participle: 'getragen', auxiliary: 'haben' },
  schlafen: { category: 'strong', pastStem: 'schlief', participle: 'geschlafen', auxiliary: 'haben' },
  waschen: { category: 'strong', pastStem: 'wusch', participle: 'gewaschen', auxiliary: 'haben', k2Stem: 'wüsch' },
  treffen: { category: 'strong', pastStem: 'traf', participle: 'getroffen', auxiliary: 'haben' },
  beginnen: { category: 'strong', pastStem: 'begann', participle: 'begonnen', auxiliary: 'haben' },
  gewinnen: { category: 'strong', pastStem: 'gewann', participle: 'gewonnen', auxiliary: 'haben' },
  heißen: { category: 'strong', pastStem: 'hieß', participle: 'geheißen', auxiliary: 'haben' },
  fliegen: { category: 'strong', pastStem: 'flog', participle: 'geflogen', auxiliary: 'sein' },
  ziehen: { category: 'strong', pastStem: 'zog', participle: 'gezogen', auxiliary: 'haben' },
  rufen: { category: 'strong', pastStem: 'rief', participle: 'gerufen', auxiliary: 'haben', k2Stem: 'rief' },
  können: { category: 'mixed', pastStem: 'konnt', participle: 'gekonnt', auxiliary: 'haben', k2Stem: 'könnt' },
  müssen: { category: 'mixed', pastStem: 'musst', participle: 'gemusst', auxiliary: 'haben', k2Stem: 'müsst' },
  wollen: { category: 'mixed', pastStem: 'wollt', participle: 'gewollt', auxiliary: 'haben', k2Stem: 'wollt' },
  mögen: { category: 'mixed', pastStem: 'mocht', participle: 'gemocht', auxiliary: 'haben', k2Stem: 'möcht' },
  dürfen: { category: 'mixed', pastStem: 'durft', participle: 'gedurft', auxiliary: 'haben', k2Stem: 'dürft' },
  sollen: { category: 'mixed', pastStem: 'sollt', participle: 'gesollt', auxiliary: 'haben', k2Stem: 'sollt' },
};

export const INSEPARABLE_PREFIXES = ['be', 'ge', 'er', 'ver', 'zer', 'ent', 'emp', 'miss'];
export const SEPARABLE_PREFIXES = [
  'zurück', 'zusammen', 'weiter', 'fest', 'statt', 'teil',
  'ab', 'an', 'auf', 'aus', 'bei', 'ein', 'her', 'hin', 'los', 'mit', 'nach', 'vor', 'weg', 'zu',
].sort((a, b) => b.length - a.length);

function weakStem(infinitive: string): string {
  return infinitive.endsWith('en') ? infinitive.slice(0, -2) : infinitive.slice(0, -1);
}

function needsLinkingE(stem: string): boolean {
  return LINKING_E_STEM.test(stem);
}

/** Simple past for a regular (weak) verb — no lookup needed, purely rule-based. */
export function synthesizeWeakSimplePast(infinitive: string, person: Person): string {
  const stem = weakStem(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  return stem + e + WEAK_PAST_ENDINGS[person];
}

/** Past participle for a regular (weak) verb. */
export function synthesizeWeakParticiple(infinitive: string): string {
  const stem = weakStem(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  return `ge${stem}${e}t`;
}

const DENTAL_END = /[dt]$/;

function strongDuForm(pastStem: string): string {
  if (SIBILANT_END.test(pastStem)) return `${pastStem}t`;
  if (DENTAL_END.test(pastStem)) return `${pastStem}est`; // fand -> fandest, stand -> standest, tat -> tatest
  return `${pastStem}st`;
}

function strongIhrForm(pastStem: string): string {
  return DENTAL_END.test(pastStem) ? `${pastStem}et` : `${pastStem}t`; // fand -> fandet, stand -> standet, tat -> tatet
}

/** Simple past for any verb, using the irregular table when the infinitive matches it. */
export function synthesizeSimplePast(infinitive: string, person: Person): string {
  const entry = IRREGULAR_VERBS[infinitive];
  if (!entry) return synthesizeWeakSimplePast(infinitive, person);

  if (entry.category === 'strong') {
    const s = entry.pastStem;
    if (person === 'ich' || person === 'er') return s;
    if (person === 'du') return strongDuForm(s);
    if (person === 'wir' || person === 'sie') return `${s}en`;
    return strongIhrForm(s); // ihr
  }

  // Mixed verbs (haben, bringen, wissen, the modals, ...) store pastStem already
  // ending in the changed consonant (hatt-, bracht-, wusst-, konnt-, ...), so the
  // -e/-est/-e/-en/-et/-en family produces hatte, brachte, wusste, konnte, ...
  const m = entry.pastStem;
  return m + K2_ENDINGS[person];
}

/** Synthetic Konjunktiv II for a verb known to have a common synthetic form, else null. */
export function synthesizeKonjunktivII(infinitive: string, person: Person): string | null {
  const entry = IRREGULAR_VERBS[infinitive];
  if (!entry?.k2Stem) return null;
  return entry.k2Stem + K2_ENDINGS[person];
}

const WUERDE_FORMS: Record<Person, string> = {
  ich: 'würde',
  du: 'würdest',
  er: 'würde',
  wir: 'würden',
  ihr: 'würdet',
  sie: 'würden',
};

/** würde + infinitive, e.g. "würde kommen" for person "ich". */
export function synthesizeWuerdeForm(infinitive: string, person: Person): string {
  return `${WUERDE_FORMS[person]} ${infinitive}`;
}

/** Accepts either the würde-construction or a known synthetic Konjunktiv II form. */
export function isValidKonjunktivIIForm(infinitive: string, person: Person, form: string): boolean {
  const normalized = form.trim().toLowerCase();
  const synthetic = synthesizeKonjunktivII(infinitive, person);
  if (synthetic && normalized === synthetic.toLowerCase()) return true;
  return normalized === synthesizeWuerdeForm(infinitive, person).toLowerCase();
}

/** True if the phrase is a well-formed würde + infinitive construction, for any verb. */
export function isWuerdeConstruction(phrase: string): boolean {
  const tokens = phrase.trim().toLowerCase().split(/\s+/);
  if (tokens.length < 2) return false;
  const wuerdeWords = Object.values(WUERDE_FORMS).map((w) => w.toLowerCase());
  const first = tokens[0]?.replace(/[.,!?]$/, '') ?? '';
  const last = tokens[tokens.length - 1]?.replace(/[.,!?]$/, '') ?? '';
  return wuerdeWords.includes(first) && /en$/.test(last);
}

/** Decomposes a compound infinitive into a known separable/inseparable prefix + base verb. */
function decomposePrefix(
  infinitive: string,
): { prefix: string; base: string; type: 'separable' | 'inseparable' } | null {
  for (const prefix of INSEPARABLE_PREFIXES) {
    if (infinitive.startsWith(prefix) && infinitive.length > prefix.length + 2) {
      return { prefix, base: infinitive.slice(prefix.length), type: 'inseparable' };
    }
  }
  for (const prefix of SEPARABLE_PREFIXES) {
    if (infinitive.startsWith(prefix) && infinitive.length > prefix.length + 2) {
      return { prefix, base: infinitive.slice(prefix.length), type: 'separable' };
    }
  }
  return null;
}

function participleOf(infinitive: string): string {
  if (infinitive.endsWith('ieren')) return `${infinitive.slice(0, -2)}t`;
  const entry = IRREGULAR_VERBS[infinitive];
  if (entry) return entry.participle;

  const decomposed = decomposePrefix(infinitive);
  if (decomposed) {
    const baseParticiple = participleOf(decomposed.base);
    if (decomposed.type === 'inseparable') {
      return decomposed.prefix + baseParticiple.replace(/^ge/, '');
    }
    return decomposed.prefix + baseParticiple;
  }

  return synthesizeWeakParticiple(infinitive);
}

/** Validates a past participle against the irregular table, prefix decomposition, or the weak rule. */
export function isValidPastParticiple(infinitive: string, participle: string): boolean {
  return participleOf(infinitive).toLowerCase() === participle.trim().toLowerCase();
}

/** Validates a simple-past form for a given person against the irregular table or the weak rule. */
export function isValidSimplePastForm(infinitive: string, person: Person, form: string): boolean {
  return synthesizeSimplePast(infinitive, person).toLowerCase() === form.trim().toLowerCase();
}

export const ACCUSATIVE_REFLEXIVE_PRONOUNS: Record<Person, string> = {
  ich: 'mich',
  du: 'dich',
  er: 'sich',
  wir: 'uns',
  ihr: 'euch',
  sie: 'sich',
};

export const DATIVE_REFLEXIVE_PRONOUNS: Record<Person, string> = {
  ich: 'mir',
  du: 'dir',
  er: 'sich',
  wir: 'uns',
  ihr: 'euch',
  sie: 'sich',
};

const ALL_REFLEXIVE_PRONOUNS = new Set([
  ...Object.values(ACCUSATIVE_REFLEXIVE_PRONOUNS),
  ...Object.values(DATIVE_REFLEXIVE_PRONOUNS),
]);

/** True for any valid accusative or dative reflexive pronoun (mich, mir, dich, dir, sich, uns, euch). */
export function isValidReflexivePronoun(word: string): boolean {
  return ALL_REFLEXIVE_PRONOUNS.has(word.trim().toLowerCase());
}

export function isValidAccusativeReflexivePronoun(person: Person, word: string): boolean {
  return ACCUSATIVE_REFLEXIVE_PRONOUNS[person] === word.trim().toLowerCase();
}

export function isValidDativeReflexivePronoun(person: Person, word: string): boolean {
  return DATIVE_REFLEXIVE_PRONOUNS[person] === word.trim().toLowerCase();
}

export const PRONOMINAL_ADVERB_PREPOSITIONS = [
  'an', 'auf', 'aus', 'bei', 'durch', 'für', 'gegen', 'hinter', 'in', 'mit',
  'nach', 'neben', 'über', 'um', 'unter', 'von', 'vor', 'zu', 'zwischen',
];

const VOWEL_START = /^[aeiouäöü]/;

/** da(r)-/wo(r)- + preposition, with the linking r inserted before a vowel-initial preposition. */
export function synthesizePronominalAdverb(base: 'da' | 'wo', preposition: string): string {
  const needsR = VOWEL_START.test(preposition);
  return `${base}${needsR ? 'r' : ''}${preposition}`;
}

export function isValidPronominalAdverb(word: string): boolean {
  const lower = word.trim().toLowerCase();
  const base = lower.startsWith('da') ? 'da' : lower.startsWith('wo') ? 'wo' : null;
  if (!base) return false;
  return PRONOMINAL_ADVERB_PREPOSITIONS.some(
    (prep) => synthesizePronominalAdverb(base, prep) === lower,
  );
}
