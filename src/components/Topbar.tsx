import './Topbar.css';
import { useState, type KeyboardEvent } from 'react';
import useTopbarmicroprofiles from './Topbar_magic';
import TopbarPlayerLink from './Topbar_card';

//жопа
type TopbarProps = {
  onSearch: (query: string) => void;
  onHome: () => void;
};

function Topbar({ onSearch, onHome }: TopbarProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };

  const { bratva, loading, error, ids: IDs } = useTopbarmicroprofiles();

  return (
    <header className="topbar" aria-label="Верхняя панель">
      <button
        className="topbar-home-logo"
        type="button"
        aria-label="На главную"
        title="На главную"
        onClick={onHome}
      >
        <span aria-hidden="true">D</span>
      </button>
      {loading && (
        <div className="topbar-players">
          {IDs.map((id) => (
            <div key={id} className="topbar-player-link topbar-player-link--skeleton" />
          ))}
        </div>
      )}

      {error && <span className="topbar-error">⚠ {error}</span>}

      {!loading && !error && (
        <div className="topbar-players">
          {bratva.map((player, i) => (
            <TopbarPlayerLink
              key={IDs[i]}
              player={player}
              accountId={IDs[i]}
              onSearch={onSearch}
            />
          ))}
        </div>
      )}
      <label className="player-search">
        <span className="player-search-icon" aria-hidden="true">⌕</span>
        <input
          aria-label="Поиск игрока по ID"
          placeholder="Поиск игрока по ID"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>
    </header>
  );
}

export default Topbar;