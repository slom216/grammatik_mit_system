import { usePracticeStore } from '../../features/practice/practiceStore';
import { useProgressStore } from '../../features/progress/progressStore';
import { useSettingsStore } from '../../features/settings/settingsStore';
import { createEmptyProgress } from '../../features/progress/progressPersistence';
import { defaultSettings } from '../../features/settings/settingsStore';

/** Puts every store back into its initial state between tests. */
export function resetAllStores(): void {
  useProgressStore.setState({
    ...createEmptyProgress(),
    lastOpenedChapter: undefined,
    hydrated: false,
  });
  useSettingsStore.setState({ ...defaultSettings, hydrated: false });
  usePracticeStore.setState({
    status: 'idle',
    mode: 'chapter',
    chapterNumber: null,
    exerciseIds: [],
    optionOrder: {},
    currentIndex: 0,
    results: {},
    attempts: {},
    feedback: null,
    startedAt: null,
    summary: null,
  });
}
