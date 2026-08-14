import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyGoalProgress } from './DailyGoalProgress';
import { toDayKey } from '../../features/progress/dayKey';

const now = new Date(2026, 2, 10, 12, 0, 0);
const today = toDayKey(now);

describe('DailyGoalProgress', () => {
  it('renders nothing when the goal is switched off', () => {
    const { container } = render(
      <DailyGoalProgress answersByDay={{ [today]: 5 }} goal={0} now={now} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('counts only today towards the goal', () => {
    render(
      <DailyGoalProgress
        answersByDay={{ [today]: 8, '2026-03-09': 40 }}
        goal={20}
        now={now}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '8 / 20 exercises',
    );
    expect(screen.getByText(/12 to go/i)).toBeInTheDocument();
  });

  it('reports a goal that has been reached', () => {
    render(<DailyGoalProgress answersByDay={{ [today]: 25 }} goal={20} now={now} />);

    expect(screen.getByText(/goal reached for today/i)).toBeInTheDocument();
    // The bar is clamped, so overshooting does not overflow it.
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');
  });

  it('starts at zero on a day with no practice', () => {
    render(<DailyGoalProgress answersByDay={{}} goal={20} now={now} />);

    expect(screen.getByText(/20 to go/i)).toBeInTheDocument();
  });
});
