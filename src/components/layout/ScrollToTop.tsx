import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll the window to the top whenever the path changes. React Router does not
 * do this by default, so navigating from one screen to another would otherwise
 * leave the user mid-page on the destination.
 *
 * Renders nothing.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use 'auto' so we don't show a long smooth scroll on every route change.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}
