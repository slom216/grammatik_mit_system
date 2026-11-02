// Post-build: writes static HTML for /chapters and every /chapter/N into dist/.
// Crawlers that do not run JavaScript (ChatGPT search among them) otherwise see an
// empty <div id="root">. React mounts over this markup as before; Cloudflare serves
// dist/chapter/8.html at /chapter/8.
//
// Runs after `vite build`, so these files are not in the service worker's precache
// manifest: offline navigations keep falling back to index.html, as before.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import type { ChapterDefinition } from '../src/schemas/chapterSchema';
import { hasChapter } from '../src/content/registry';

const ORIGIN = 'https://grammatik.deulern.com';
const shell = readFileSync('dist/index.html', 'utf8');

const chapters: ChapterDefinition[] = [];
for (const file of readdirSync('src/content/chapters')) {
  const mod = (await import(`../src/content/chapters/${file}`)) as Record<string, ChapterDefinition>;
  chapters.push(...Object.values(mod));
}
const course = chapters
  .filter((c) => hasChapter(c.number) && !c.isDemo)
  .sort((a, b) => a.number - b.number);

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const p = (xs: string[]) => xs.map((x) => `<p>${esc(x)}</p>`).join('\n');
const name = (c: ChapterDefinition) => (c.germanTitle ? `${c.title} (${c.germanTitle})` : c.title);

function page(path: string, title: string, description: string, main: string) {
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${esc(description)}" />\n    <link rel="canonical" href="${ORIGIN}${path}" />`,
    )
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace('<div id="root"></div>', `<div id="root"><main>\n${main}\n</main></div>`);
}

function write(path: string, html: string) {
  const file = `dist${path}.html`;
  mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  writeFileSync(file, html);
}

const catalogue = course
  .map((c) => `<li><a href="/chapter/${c.number}">${c.number}. ${esc(name(c))}</a> (${c.level})</li>`)
  .join('\n');

write(
  '/chapters',
  page(
    '/chapters',
    'All chapters · DeuLern Grammatik mit System',
    `${course.length} free German grammar chapters from A1 to B1, each with an explanation and exercises. No account needed.`,
    `<h1>All chapters</h1>\n<p>${course.length} German grammar chapters from A1 to B1. Each one explains a rule and lets you practise it in the browser.</p>\n<ol>\n${catalogue}\n</ol>`,
  ),
);

course.forEach((c, i) => {
  const e = c.explanation;
  const neighbours = [course[i - 1], course[i + 1]].filter(Boolean);
  const html = `<p><a href="/chapters">All chapters</a></p>
<h1>${esc(name(c))}</h1>
<p>CEFR level ${c.level} · Chapter ${c.number} · ${c.exercises.length} exercises · about ${c.estimatedMinutes} minutes</p>
<p>${esc(c.objective)}</p>
<p><a href="/chapter/${c.number}/practice">Practise ${esc(c.title)}</a></p>
${p(e.introduction)}
${e.rules
  .map((r) => `<h2>${esc(r.heading)}</h2>\n${p(r.paragraphs)}${r.notes ? `\n<ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}`)
  .join('\n')}
${e.tables
  .map(
    (t) => `<table>
<caption>${esc(t.title)}</caption>
<thead><tr>${t.columns.map((col) => `<th>${esc(col)}</th>`).join('')}</tr></thead>
<tbody>
${t.rows.map((r) => `<tr>${r.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>${t.note ? `\n<p>${esc(t.note)}</p>` : ''}`,
  )
  .join('\n')}
<h2>Examples</h2>
<ul>
${e.examples.map((x) => `<li><span lang="de">${esc(x.german)}</span> — ${esc(x.english)}${x.explanation ? ` ${esc(x.explanation)}` : ''}</li>`).join('\n')}
</ul>
<h2>Common mistakes</h2>
<ul>
${e.commonMistakes.map((m) => `<li><s lang="de">${esc(m.incorrect)}</s> → <span lang="de">${esc(m.correct)}</span>. ${esc(m.explanation)}</li>`).join('\n')}
</ul>
<h2>Remember</h2>
<ul>
${e.remember.map((r) => `<li>${esc(r)}</li>`).join('\n')}
</ul>
<p><a href="/chapter/${c.number}/practice">Practise ${esc(c.title)}: ${c.exercises.length} exercises</a></p>
<ul>
${neighbours.map((n) => `<li><a href="/chapter/${n!.number}">${n!.number}. ${esc(name(n!))}</a></li>`).join('\n')}
</ul>`;
  write(
    `/chapter/${c.number}`,
    page(
      `/chapter/${c.number}`,
      `${c.title}: ${c.level} German grammar · DeuLern Grammatik`,
      `${c.level} German grammar: ${c.title}. Explanation, examples, common mistakes and ${c.exercises.length} exercises. Free, no account.`,
      html,
    ),
  );
});

// The home page doubles as the SPA fallback, so it gets only a link to the catalogue.
writeFileSync(
  'dist/index.html',
  shell.replace(
    '<div id="root"></div>',
    '<div id="root"><main><h1>Grammatik mit System: a German grammar course, A1 to B1</h1><p><a href="/chapters">See all chapters</a></p></main></div>',
  ),
);
console.log(`prerender: /chapters + ${course.length} chapter pages`);
