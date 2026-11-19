import './App.css';
import Topbar from './components/Topbar';
import Search from './components/Search';
import Microcard from './components/card_render';
import { useEffect, useState } from 'react';

function App() {
  const getAccountIdFromHash = () => {
    const match = window.location.hash.match(/^#\/player\/(.+)$/);
    if (!match) return '';

    try {
      return decodeURIComponent(match[1]);
    } catch {
      return '';
    }
  };

  const [accountId, setAccountId] = useState(getAccountIdFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setAccountId(getAccountIdFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openPlayer = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setAccountId(trimmedQuery);
    window.location.hash = `/player/${encodeURIComponent(trimmedQuery)}`;
  };

  const goHome = () => {
    window.location.hash = '/';
  };

  return (
    <div className="dashboard-shell">
      <main className="main-content">
        <Topbar onSearch={openPlayer} />
        {accountId ? (
          <section className="player-page" id="player" aria-label="Страница игрока">
            <button className="player-back" type="button" onClick={goHome}>
              ← На главную
            </button>
            <Microcard accountId={accountId} />
          </section>
        ) : (
          <section className="home-content" id="overview" aria-label="Главная">
            <div className="home-brand" aria-label="Deadlock Buff">
              <span className="home-brand-mark" aria-hidden="true">D</span>
              <h1 className="home-brand-name">deadlock<span>buff</span></h1>
            </div>
            <Search
              onSearch={openPlayer}
              placeholder="Введите ID игрока"
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
