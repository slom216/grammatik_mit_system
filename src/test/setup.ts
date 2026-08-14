import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { resetAllStores } from './helpers/resetStores';

/**
 * React Router builds a `Request` for every route loader, passing jsdom's
 * `AbortSignal` — which Node's own `Request` rejects ("Expected signal to be an
 * instance of AbortSignal"), leaving every data route stuck on its fallback.
 * Dropping the signal is harmless here: nothing in these tests aborts a
 * navigation.
 */
const NativeRequest = globalThis.Request;
class RequestWithoutJsdomSignal extends NativeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init ? { ...init, signal: undefined } : init);
  }
}
globalThis.Request = RequestWithoutJsdomSignal;

/** jsdom's Blob/File has no `text()`, which the backup import uses. */
if (typeof Blob.prototype.text !== 'function') {
  Blob.prototype.text = function readAsText(this: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error('read failed'));
      reader.readAsText(this);
    });
  };
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetAllStores();
  // The stores are reset, but the attributes they stamp on <html> are not.
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.classList.remove('reduced-motion');
});
