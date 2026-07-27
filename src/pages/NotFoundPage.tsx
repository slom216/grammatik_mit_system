import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="stack">
      <h1>Page not found</h1>
      <p>This address does not exist in the app.</p>
      <p>
        <Link className="button button--primary" to="/">
          Back to the dashboard
        </Link>
      </p>
    </div>
  );
}
