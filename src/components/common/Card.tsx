import type { ReactNode } from 'react';

export interface CardProps {
  title?: ReactNode;
  /** Heading level used for the card title, so page outlines stay correct. */
  titleLevel?: 2 | 3 | 4;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, titleLevel = 3, actions, className, children }: CardProps) {
  const Heading = `h${titleLevel}` as const;
  return (
    <section className={['card', className].filter(Boolean).join(' ')}>
      {(title || actions) && (
        <header className="chapter-card__header">
          {title && <Heading className="card__title">{title}</Heading>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
