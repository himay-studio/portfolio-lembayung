/* Minimal markdown renderer for the article bodies in src/data/articles.ts.
 *
 * The bodies use only four constructs: blank line separated paragraphs, `## ` subheadings,
 * `**bold**` inline, and the occasional `*italic*`. A full markdown dependency would be dead
 * weight in a static export for that, so this handles exactly those four and nothing else.
 *
 * R11: it never introduces a dash of any kind. It also never uses dangerouslySetInnerHTML, so no
 * content string can inject markup.
 */

import type { ReactNode } from 'react';

/* splits on **bold** and *italic* while keeping the delimiters out of the output */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={`${keyBase}-b${n}`}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<em key={`${keyBase}-i${n}`}>{m[2]}</em>);
    last = m.index + m[0].length;
    n++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Prose({ body }: { body: string }) {
  const blocks = body.split(/\n\s*\n/);
  return (
    <div className="prose">
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith('## ')) {
          return <h2 key={i}>{inline(block.slice(3), `h${i}`)}</h2>;
        }
        if (block.startsWith('### ')) {
          return <h3 key={i}>{inline(block.slice(4), `h${i}`)}</h3>;
        }
        return <p key={i}>{inline(block, `p${i}`)}</p>;
      })}
    </div>
  );
}
