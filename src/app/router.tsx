import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { AboutPage } from '../pages/AboutPage';
import { ChapterPage } from '../pages/ChapterPage';
import { ChaptersPage } from '../pages/ChaptersPage';
import { CumulativeReviewPage } from '../pages/CumulativeReviewPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LearnPage } from '../pages/LearnPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PracticePage } from '../pages/PracticePage';
import { ProgressPage } from '../pages/ProgressPage';
import { ResultsPage } from '../pages/ResultsPage';
import { ReviewPage } from '../pages/ReviewPage';
import { SettingsPage } from '../pages/SettingsPage';

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'chapters', element: <ChaptersPage /> },
      { path: 'chapter/:chapterNumber', element: <ChapterPage /> },
      { path: 'chapter/:chapterNumber/learn', element: <LearnPage /> },
      { path: 'chapter/:chapterNumber/practice', element: <PracticePage /> },
      { path: 'chapter/:chapterNumber/results', element: <ResultsPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'review/:from/:to', element: <CumulativeReviewPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
