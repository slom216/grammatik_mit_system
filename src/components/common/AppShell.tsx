import { useMemo } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { selectContinueChapter } from '../../features/chapters/chapterSelectors';
import { chapterPath } from '../../features/chapters/chapterUtils';
import { useProgressStore } from '../../features/progress/progressStore';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/chapters', label: 'Chapters', end: false },
  { to: '/review', label: 'Review', end: false },
  { to: '/progress', label: 'Progress', end: false },
  { to: '/activity', label: 'Activity', end: false },
  { to: '/settings', label: 'Settings', end: false },
  { to: '/about', label: 'About', end: false },
];

const FOOTER_GROUPS = [
  {
    heading: 'Course',
    links: [
      { to: '/chapters', label: 'Chapter catalogue' },
      { to: '/review', label: 'Review queue' },
    ],
  },
  {
    heading: 'Progress',
    links: [
      { to: '/progress', label: 'Your progress' },
      { to: '/activity', label: 'Practice activity' },
    ],
  },
  {
    heading: 'App',
    links: [
      { to: '/settings', label: 'Settings' },
      { to: '/about', label: 'About this app' },
    ],
  },
];

export function AppShell() {
  // Selected off the whole store rather than with a store selector: the
  // selector builds fresh objects, which zustand would see as a new snapshot
  // on every render.
  const progress = useProgressStore();
  const continueChapter = useMemo(() => selectContinueChapter(progress), [progress]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            Grammatik mit System
            <span className="app-brand__subtitle">German grammar, A1–B1</span>
          </NavLink>
          <nav className="app-nav" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="app-nav__link"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {continueChapter && (
            <Link
              className="button button--primary app-header__action"
              to={chapterPath(continueChapter.number)}
            >
              Continue
            </Link>
          )}
        </div>
      </header>

      <main className="app-main" id="main-content" tabIndex={-1}>
        <div className="app-main__inner">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <div className="app-footer__groups">
            {FOOTER_GROUPS.map((group) => (
              <div className="app-footer__group" key={group.heading}>
                <p className="app-footer__heading">{group.heading}</p>
                {group.links.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <p className="app-footer__note">
            An independent study app organised around common A1–B1 German grammar topics.
            All explanations and exercises are original. Progress is stored only in this
            browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
