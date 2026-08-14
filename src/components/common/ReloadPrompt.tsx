import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './Button';

/**
 * Offers the new version when one has been downloaded, instead of swapping it
 * in automatically: an update mid-session would drop the chunks the running
 * practice session still needs.
 */
export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="reload-prompt" role="status">
      <p className="reload-prompt__text">A new version of the app is ready.</p>
      <div className="row">
        <Button onClick={() => void updateServiceWorker(true)}>Reload</Button>
        <Button variant="ghost" onClick={() => setNeedRefresh(false)}>
          Later
        </Button>
      </div>
    </div>
  );
}
