import { useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigation } from 'react-router-dom';
import { selectContinueChapter } from '../../features/chapters/chapterSelectors';
import { chapterPath } from '../../features/chapters/chapterUtils';
import { useProgressStore } from '../../features/progress/progressStore';
import { ReloadPrompt } from './ReloadPrompt';
import { ThemeToggle } from './ThemeToggle';

const APP_NAME = 'Grammatik mit System';

/**
 * Five items, per design.md's 5–6 top-level maximum. Activity and About used to
 * sit here too, which pushed the row past the width of a phone and into a
 * scroller with hidden scrollbars — no indication anything was off-screen.
 * Both remain one tap away in the footer, and Activity's headline numbers are
 * already on Progress.
 */
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/chapters', label: 'Chapters', end: false },
  { to: '/review', label: 'Review', end: false },
  { to: '/progress', label: 'Progress', end: false },
  { to: '/settings', label: 'Settings', end: false },
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

  const { pathname } = useLocation();
  const navigation = useNavigation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // A single-page navigation leaves screen-reader focus on the link that was
  // clicked, so the new page is never announced. Moving focus to <main> makes
  // the change audible, and the heading is read from the top.
  // The page's own h1 is its name, so taking the title from there means the tab
  // and the history entry can never drift from what is on screen.
  // navigation.state is a dependency because a cold load renders the route
  // fallback first: the heading only exists once the route's chunk has settled.
  useEffect(() => {
    const heading = mainRef.current?.querySelector('h1')?.textContent?.trim();
    document.title = heading ? `${heading} · ${APP_NAME}` : APP_NAME;
  }, [pathname, navigation.state]);

  useEffect(() => {
    // Not on the first render: focus belongs where the browser put it when the
    // page was opened, and the page was not scrolled by us.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="app-header">
        {navigation.state === 'loading' && (
          <span className="app-header__progress" aria-hidden="true" />
        )}
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
          <ThemeToggle />
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

      <main className="app-main" id="main-content" tabIndex={-1} ref={mainRef}>
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

      <ReloadPrompt />
    </div>
  );
}
