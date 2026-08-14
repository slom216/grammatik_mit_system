import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { resetAllStores } from './helpers/resetStores';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetAllStores();
  // The stores are reset, but the attributes they stamp on <html> are not.
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.classList.remove('reduced-motion');
});
