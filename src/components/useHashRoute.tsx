import { useEffect, useState } from 'react';

function getAccountIdFromHash() {
  const match = window.location.hash.match(/^#\/player\/(.+)$/);
  if (!match) return '';

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return '';
  }
}

function useHashRoute() {
  const [accountId, setAccountId] = useState(getAccountIdFromHash);

  useEffect(() => {
    const handleHashChange = () => setAccountId(getAccountIdFromHash());

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openPlayer = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setAccountId(trimmedQuery);
    window.location.hash = `/player/${encodeURIComponent(trimmedQuery)}`;
  };

  const goHome = () => {
    window.location.hash = '/';
  };

  return { accountId, openPlayer, goHome };
}

export default useHashRoute;
