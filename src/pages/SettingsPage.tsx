import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { usePracticeStore } from '../features/practice/practiceStore';
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
    key: 'reducedMotion',
    label: 'Reduce motion',
    description: 'Turn off transitions, in addition to your system setting.',
  },
];

export function SettingsPage() {
  const settings = useSettingsStore();
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const exitSession = usePracticeStore((state) => state.exitSession);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = () => {
    resetProgress();
    exitSession();
    setConfirmOpen(false);
    setMessage('All progress has been deleted from this browser.');
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

      <Card title="Your data" titleLevel={2}>
        <p>
          Progress, review dates and settings are saved in this browser using
          localStorage. Nothing is sent anywhere.
        </p>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete all progress
        </Button>
        <p aria-live="polite" className="text-sm text-muted">
          {message}
        </p>
      </Card>

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
