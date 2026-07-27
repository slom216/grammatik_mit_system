import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/chapters', label: 'Chapters', end: false },
  { to: '/review', label: 'Review', end: false },
  { to: '/progress', label: 'Progress', end: false },
  { to: '/settings', label: 'Settings', end: false },
  { to: '/about', label: 'About', end: false },
];

export function AppShell() {
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
        </div>
      </header>

      <main className="app-main" id="main-content" tabIndex={-1}>
        <div className="app-main__inner">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <p>
            An independent study app organised around common A1–B1 German grammar topics.
            All explanations and exercises are original. Progress is stored only in this
            browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
