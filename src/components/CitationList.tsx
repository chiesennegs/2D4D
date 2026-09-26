import type { Citation } from "../data/citations";

export function CitationList({ citations }: { citations: Citation[] }) {
  return (
    <ul className="citation-list">
      {citations.map((c) => (
        <li key={c.id}>
          <div>
            {c.authors} ({c.year}). <em>{c.title}</em>. {c.venue}.
          </div>
          <a href={c.url} target="_blank" rel="noreferrer noopener">
            {c.url}
          </a>
          {c.note && <div className="skip-note">{c.note}</div>}
        </li>
      ))}
    </ul>
  );
}
