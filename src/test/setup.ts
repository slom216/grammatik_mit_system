import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { resetAllStores } from './helpers/resetStores';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  resetAllStores();
});
