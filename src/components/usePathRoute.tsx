import { useEffect, useState } from 'react';
//                          НАВИГАЦИЯ
function getAccountIdFromPath() {
  const match = window.location.pathname.match(/^\/player\/([^/]+)\/?$/);
  if (!match) return '';

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return '';
  }
}

function usePathRoute() {
  const [accountId, setAccountId] = useState(getAccountIdFromPath);

  useEffect(() => {
    const handlePopState = () => setAccountId(getAccountIdFromPath());

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openPlayer = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    window.history.pushState(null, '', `/player/${encodeURIComponent(trimmedQuery)}`);
    setAccountId(trimmedQuery);
  };

  const goHome = () => {
    window.history.pushState(null, '', '/');
    setAccountId('');
  };

  return { accountId, openPlayer, goHome };
}

export default usePathRoute;
