import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { LoadingBlock } from '../components/common/LoadingBlock';
import { RouteError } from '../components/common/RouteError';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { chapterRouteLoader } from '../features/chapters/useChapterParam';
import { cumulativeRouteLoader } from '../features/practice/cumulativeRoute';
import { placementRouteLoader } from '../features/practice/placementRoute';

/**
 * Loads a page's chunk on first visit. React Router keeps the previous page
 * mounted until the chunk and the route's loader have both settled, so no
 * Suspense fallback is needed and the layout never flashes.
 */
function page(
  load: () => Promise<Record<string, unknown>>,
  name: string,
): RouteObject['lazy'] {
  return async () => ({ Component: (await load())[name] as ComponentType });
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    // Catches render and loader failures anywhere below, so a thrown error
    // shows a way out instead of a blank page. Most likely in production: a
    // page chunk that 404s because the tab predates the current deploy.
    errorElement: <RouteError />,
    // Shown only on a cold deep link, while the first loader runs.
    HydrateFallback: () => <LoadingBlock />,
    children: [
      // The dashboard is the most common first paint, so it stays in the
      // entry chunk rather than costing an extra round trip.
      { index: true, element: <DashboardPage /> },
      {
        path: 'chapters',
        lazy: page(() => import('../pages/ChaptersPage'), 'ChaptersPage'),
      },
      {
        path: 'chapter/:chapterNumber',
        // `loader` is declared statically so the chapter downloads in parallel
        // with the page chunk instead of waiting for it.
        loader: chapterRouteLoader,
        lazy: page(() => import('../pages/ChapterPage'), 'ChapterPage'),
      },
      {
        path: 'chapter/:chapterNumber/learn',
        loader: chapterRouteLoader,
        lazy: page(() => import('../pages/LearnPage'), 'LearnPage'),
      },
      {
        path: 'chapter/:chapterNumber/practice',
        loader: chapterRouteLoader,
        lazy: page(() => import('../pages/PracticePage'), 'PracticePage'),
      },
      {
        path: 'chapter/:chapterNumber/results',
        loader: chapterRouteLoader,
        lazy: page(() => import('../pages/ResultsPage'), 'ResultsPage'),
      },
      { path: 'review', lazy: page(() => import('../pages/ReviewPage'), 'ReviewPage') },
      {
        path: 'review/:from/:to',
        loader: cumulativeRouteLoader,
        lazy: page(() => import('../pages/CumulativeReviewPage'), 'CumulativeReviewPage'),
      },
      {
        path: 'placement',
        loader: placementRouteLoader,
        lazy: page(() => import('../pages/PlacementPage'), 'PlacementPage'),
      },
      {
        path: 'progress',
        lazy: page(() => import('../pages/ProgressPage'), 'ProgressPage'),
      },
      {
        path: 'activity',
        lazy: page(() => import('../pages/ActivityPage'), 'ActivityPage'),
      },
      {
        path: 'settings',
        lazy: page(() => import('../pages/SettingsPage'), 'SettingsPage'),
      },
      { path: 'about', lazy: page(() => import('../pages/AboutPage'), 'AboutPage') },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
