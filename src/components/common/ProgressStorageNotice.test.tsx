import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useProgressStore } from '../../features/progress/progressStore';
import { ProgressStorageNotice } from './ProgressStorageNotice';

describe('ProgressStorageNotice', () => {
  afterEach(() => {
    act(() => useProgressStore.setState({ readOnly: false, storageUnavailable: false }));
  });

  it('stays hidden while progress saves normally', () => {
    const { container } = render(<ProgressStorageNotice />);
    expect(container).toBeEmptyDOMElement();
  });

  it('says when progress cannot be saved', () => {
    act(() => useProgressStore.setState({ storageUnavailable: true }));
    render(<ProgressStorageNotice />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'can’t be saved in this browser',
    );
  });

  it('names a newer version, not an older one', () => {
    act(() => useProgressStore.setState({ readOnly: true }));
    render(<ProgressStorageNotice />);
    expect(screen.getByRole('status')).toHaveTextContent('newer version');
  });
});
