import './Topbar.css';
import { useState, type KeyboardEvent } from 'react';
//жопа
type TopbarProps = {
  onSearch: (query: string) => void;
  onHome: () => void;
};

function Topbar({ onSearch, onHome }: TopbarProps) {
  const [value, setValue] = useState('');
  const featuredAccountId = '76561198360505563';

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };

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
      <div className="topbar-links">
        <button
          className="topbar-link-placeholder topbar-player-link"
          type="button"
          aria-label={`Открыть игрока ${featuredAccountId}`}
          onClick={() => onSearch(featuredAccountId)}
        >
          <span className="topbar-player-id">{featuredAccountId}</span>
        </button>
        <span className="topbar-link-placeholder" />
        <span className="topbar-link-placeholder" />
      </div>
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
