import { useRef, useState, type ChangeEvent } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { loadChapter } from '../content/chapterLoader';
import { chapterRegistry } from '../content/registry';
import { usePracticeStore } from '../features/practice/practiceStore';
import {
  backupFileName,
  createBackup,
  describeBackup,
  parseBackup,
  type ProgressBackup,
} from '../features/progress/backup';
import { SETTINGS_SCHEMA_VERSION } from '../schemas/progressSchema';
import { useProgressStore } from '../features/progress/progressStore';
import {
  useSettingsStore,
  type SettingsToggle,
} from '../features/settings/settingsStore';
import type { Theme } from '../schemas/progressSchema';

interface ToggleDefinition {
  key: SettingsToggle;
  label: string;
  description: string;
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const TOGGLES: ToggleDefinition[] = [
  {
    key: 'shuffleOptions',
    label: 'Shuffle answer options',
    description: 'Present multiple-choice options in a random order.',
  },
  {
    key: 'showHints',
    label: 'Show hints',
    description: 'Offer the "Show hint" button on exercises that have a hint.',
  },
  {
    key: 'showUmlautHelper',
    label: 'Show umlaut helper',
    description: 'Display buttons for ä, ö, ü, ß next to text inputs.',
  },
  {
    key: 'autoAdvance',
    label: 'Move on automatically',
    description: 'Go to the next exercise as soon as an answer is correct.',
  },
  {
    key: 'pronunciationAudio',
    label: 'Pronunciation audio',
    description:
      'Show a listen button on German sentences, read by a voice from your device.',
  },
  {
    key: 'reducedMotion',
    label: 'Reduce motion',
    description: 'Turn off transitions, in addition to your system setting.',
  },
];

export function SettingsPage() {
  const settings = useSettingsStore();
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const replaceProgress = useProgressStore((state) => state.replaceProgress);
  const snapshot = useProgressStore((state) => state.snapshot);
  const replaceSettings = useSettingsStore((state) => state.replaceSettings);
  const exitSession = usePracticeStore((state) => state.exitSession);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<number | null>(null);
  const [pendingBackup, setPendingBackup] = useState<ProgressBackup | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Chapters are fetched as they are opened. This walks the whole course so it
   * is all in the browser's cache before going offline. Sequential on purpose:
   * 85 parallel requests would stall everything else the learner does.
   */
  const downloadAllChapters = async () => {
    setDownloaded(0);
    for (const [index, entry] of chapterRegistry.entries()) {
      await loadChapter(entry.number);
      setDownloaded(index + 1);
    }
  };

  const handleReset = () => {
    resetProgress();
    exitSession();
    setConfirmOpen(false);
    setMessage('All progress has been deleted from this browser.');
  };

  const handleExport = () => {
    const backup = createBackup(snapshot(), {
      schemaVersion: SETTINGS_SCHEMA_VERSION,
      shuffleOptions: settings.shuffleOptions,
      showHints: settings.showHints,
      showUmlautHelper: settings.showUmlautHelper,
      reducedMotion: settings.reducedMotion,
      autoAdvance: settings.autoAdvance,
      defaultAnswerMode: settings.defaultAnswerMode,
      theme: settings.theme,
      pronunciationAudio: settings.pronunciationAudio,
    });

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFileName();
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Backup downloaded.');
  };

  const handleFileChosen = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear the input so choosing the same file twice fires a change event.
    event.target.value = '';
    if (!file) return;

    const result = parseBackup(await file.text());
    if (!result.ok) {
      setPendingBackup(null);
      setMessage(result.error);
      return;
    }
    setMessage(null);
    setPendingBackup(result.backup);
  };

  const handleImport = () => {
    if (!pendingBackup) return;
    replaceProgress(pendingBackup.progress);
    replaceSettings(pendingBackup.settings);
    exitSession();
    setPendingBackup(null);
    setMessage('Progress and settings were restored from the backup.');
  };

  return (
    <div className="stack">
      <header>
        <h1>Settings</h1>
        <p className="text-muted prose">
          Settings are stored in this browser next to your progress.
        </p>
      </header>

      <Card title="Appearance" titleLevel={2}>
        <div className="setting-row">
          <div id="setting-theme-label">
            <strong>Theme</strong>
            <br />
            <span className="text-sm text-muted">
              Follow your system setting, or keep this browser light or dark.
            </span>
          </div>
          <span
            className="segmented"
            role="radiogroup"
            aria-labelledby="setting-theme-label"
          >
            {THEME_OPTIONS.map((option) => (
              <label className="segmented__option" key={option.value}>
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={settings.theme === option.value}
                  onChange={() => settings.setTheme(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </span>
        </div>
      </Card>

      <Card title="Practice" titleLevel={2}>
        <div>
          {TOGGLES.map((toggle) => (
            <div className="setting-row" key={toggle.key}>
              <label htmlFor={`setting-${toggle.key}`}>
                <strong>{toggle.label}</strong>
                <br />
                <span className="text-sm text-muted">{toggle.description}</span>
              </label>
              <span className="setting-row__control">
                <input
                  type="checkbox"
                  id={`setting-${toggle.key}`}
                  checked={settings[toggle.key]}
                  onChange={(event) =>
                    settings.setSetting(toggle.key, event.target.checked)
                  }
                />
              </span>
            </div>
          ))}
        </div>
        <p className="row" style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="secondary" onClick={resetSettings}>
            Restore default settings
          </Button>
        </p>
      </Card>

      <Card title="Offline use" titleLevel={2}>
        <p>
          Each chapter is downloaded the first time you open it. Fetch all{' '}
          {chapterRegistry.length} now to use the whole course without a connection.
        </p>
        <Button
          variant="secondary"
          onClick={() => void downloadAllChapters()}
          disabled={downloaded !== null && downloaded < chapterRegistry.length}
        >
          Download all chapters
        </Button>
        <p aria-live="polite" className="text-sm text-muted">
          {downloaded === null
            ? ''
            : downloaded < chapterRegistry.length
              ? `Downloading ${downloaded} of ${chapterRegistry.length}…`
              : `All ${chapterRegistry.length} chapters are available offline.`}
        </p>
      </Card>

      <Card title="Your data" titleLevel={2}>
        <p>
          Progress, review dates and settings are saved in this browser using
          localStorage, and nothing is sent anywhere. That also means clearing your
          browser data — or studying in a private window — removes them for good. Export
          a backup to keep a copy, or to move your progress to another browser.
        </p>
        <div className="row">
          <Button variant="secondary" onClick={handleExport}>
            Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            aria-label="Backup file to import"
            onChange={(event) => void handleFileChosen(event)}
          />
        </div>
        <p className="row" style={{ marginTop: 'var(--space-4)' }}>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete all progress
          </Button>
        </p>
        <p aria-live="polite" className="text-sm text-muted">
          {message}
        </p>
      </Card>

      <Modal
        open={pendingBackup !== null}
        title="Restore this backup?"
        description={
          pendingBackup
            ? `The backup holds ${describeBackup(pendingBackup)}. It replaces all progress and settings in this browser.`
            : ''
        }
        onClose={() => setPendingBackup(null)}
      >
        <div className="row">
          <Button variant="secondary" onClick={() => setPendingBackup(null)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Restore backup</Button>
        </div>
      </Modal>

      <Modal
        open={confirmOpen}
        title="Delete all progress?"
        description="Scores, review dates and completed chapters will be removed from this browser. This cannot be undone."
        onClose={() => setConfirmOpen(false)}
      >
        <div className="row">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReset}>
            Delete everything
          </Button>
        </div>
      </Modal>
    </div>
  );
}
