import './Topbar.css';
import { useState } from 'react';

function Topbar({ onSearch }) {
  const [value, setValue] = useState('');
  const featuredAccountId = '76561198360505563';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <header className="topbar" aria-label="Верхняя панель">
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
