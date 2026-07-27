export interface RememberBoxProps {
  points: readonly string[];
  title?: string;
}

export function RememberBox({ points, title = 'Remember' }: RememberBoxProps) {
  return (
    <aside className="remember-box" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {points.map((point, index) => (
          <li key={`${point}-${index}`}>{point}</li>
        ))}
      </ul>
    </aside>
  );
}
