import { useMemo, useState } from 'react';
import './PlayersSection.css';

const players = [];

function PlayersSection() {
  const [activeFilter, setActiveFilter] = useState('Все игроки');
  const [search, setSearch] = useState('');

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return players.filter((player) => {
      const matchesSearch = `${player.name} ${player.tag} ${player.hero}`
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesFilter = activeFilter !== 'В сети' || player.activity === 'online';

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, search]);

  return (
    <section className="players-section" id="players">
      <div className="section-heading">
        <div>
          <div className="eyebrow section-eyebrow">ТАБЛИЦА ЛИДЕРОВ</div>
          <h2>Лучшие игроки <span>сезона</span></h2>
        </div>
        <button className="period-select" type="button">Последние 30 дней <span>⌄</span></button>
      </div>

      <div className="table-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Фильтр игроков">
          {['Все игроки', 'В сети'].map((filter) => (
            <button
              aria-selected={activeFilter === filter}
              className={`filter-tab ${activeFilter === filter ? 'is-selected' : ''}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              role="tab"
              type="button"
            >
              {filter}{filter === 'В сети' && <span className="online-count">3</span>}
            </button>
          ))}
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Поиск игрока"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока или героя"
            value={search}
          />
          <kbd>/</kbd>
        </label>
      </div>

      <div className="table-scroll">
        <table className="players-table">
          <thead>
            <tr>
              <th className="rank-column">#</th>
              <th>ИГРОК</th>
              <th>РЕЙТИНГ <span className="sort-indicator">↓</span></th>
              <th>ВИНРЕЙТ</th>
              <th>МАТЧИ</th>
              <th>ЛУЧШИЙ ГЕРОЙ</th>
              <th>АКТИВНОСТЬ</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => {
              const rank = players.indexOf(player) + 1;

              return (
                <tr key={player.tag}>
                  <td className="rank-cell">{String(rank).padStart(2, '0')}</td>
                  <td>
                    <div className="player-cell">
                      <span className="avatar-wrap">
                        <img src={`https://images.unsplash.com/${player.avatar}?w=96&h=96&fit=crop&crop=faces`} alt="" />
                        <i className={player.activity === 'online' ? 'is-online' : ''} />
                      </span>
                      <span className="player-name"><strong>{player.name}</strong><small>/{player.tag}</small></span>
                    </div>
                  </td>
                  <td><span className="rating-value">{player.rating.toLocaleString('ru-RU')}</span></td>
                  <td>
                    <div className="winrate-cell"><strong>{player.winRate}%</strong><span className="winrate-track"><i style={{ width: `${player.winRate}%` }} /></span></div>
                  </td>
                  <td className="matches-cell">{player.matches.toLocaleString('ru-RU')}</td>
                  <td><span className={`hero-pill ${player.heroClass}`}><i />{player.hero}</span></td>
                  <td><span className={`activity ${player.activity}`}><i />{player.lastSeen}</span></td>
                </tr>
              );
            })}
            {filteredPlayers.length === 0 && (
              <tr><td className="empty-state" colSpan="7">Игроки не найдены. Попробуй изменить запрос.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>Показано <strong>{filteredPlayers.length}</strong> из <strong>2 481</strong> игроков</span>
        <button type="button" className="all-players-button">Все игроки <span>→</span></button>
      </div>
    </section>
  );
}
////////////
export default PlayersSection;
