import './Topbar.css';

function Topbar() {
  return (
    <header className="topbar" aria-label="Верхняя панель">
      <div className="topbar-links" aria-hidden="true">
        <span className="topbar-link-placeholder" />
        <span className="topbar-link-placeholder" />
        <span className="topbar-link-placeholder" />
      </div>
      <label className="player-search">
        <span className="player-search-icon" aria-hidden="true">⌕</span>
        <input aria-label="Поиск игрока по ID" placeholder="Поиск игрока по ID" type="search" />
      </label>
    </header>
  );
}

export default Topbar;
