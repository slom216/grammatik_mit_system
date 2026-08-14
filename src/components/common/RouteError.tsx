import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from './Button';

/**
 * A dynamic import that fails because the chunk it points at is no longer on the
 * server. The app updates on prompt rather than automatically, so a session
 * started before a deploy keeps asking for the hashes it booted with — reloading
 * is the actual fix, not a retry.
 */
function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    message,
  );
}

function describe(error: unknown): string | null {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return null;
}

/**
 * The root route's `errorElement`: the last thing between a thrown render or
 * loader error and a blank white page. It replaces the app shell, so it carries
 * its own way back.
 */
export function RouteError() {
  const error = useRouteError();
  const stale = isStaleChunkError(error);
  const detail = describe(error);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-brand">
            Grammatik mit System
            <span className="app-brand__subtitle">German grammar, A1–B1</span>
          </Link>
        </div>
      </header>

      <main className="app-main" id="main-content">
        <div className="app-main__inner">
          <div className="stack">
            <h1>{stale ? 'A new version is available' : 'Something went wrong'}</h1>
            <p className="lead">
              {stale
                ? 'The app was updated while this tab was open, so part of it could not be loaded. Reloading picks up the new version.'
                : 'This page failed to load. Your progress is stored in this browser and has not been affected.'}
            </p>

            <div className="row">
              <Button onClick={() => window.location.reload()}>Reload the page</Button>
              <Link className="button button--ghost" to="/">
                Back to the dashboard
              </Link>
            </div>

            {detail && (
              <details>
                <summary className="text-sm text-muted">Technical details</summary>
                <p className="text-sm text-muted">{detail}</p>
              </details>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
