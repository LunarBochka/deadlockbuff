import './Sidebar.css';

const navigation = [
  { label: 'Обзор', icon: '◫' },
  { label: 'Игроки', icon: '◎' },
  { label: 'Матчи', icon: '◷' },
];

function Sidebar({ activeNav, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#overview" aria-label="Deadlock Buff, главная">
        <span className="brand-mark">D</span>
        <span className="brand-name">deadlock<span>buff</span></span>
      </a>

      <div className="sidebar-label">Платформа</div>
      <button className="game-switcher" type="button">
        <span className="game-emblem">D</span>
        <span className="game-copy"><strong>Deadlock</strong><small>Статистика игры</small></span>
        <span className="switch-chevron">⌄</span>
      </button>

      <div className="sidebar-label nav-label">Меню</div>
      <nav className="primary-nav" aria-label="Основная навигация">
        {navigation.map((item) => (
          <button
            className={`nav-item ${activeNav === item.label ? 'is-active' : ''}`}
            key={item.label}
            onClick={() => onNavigate(item.label)}
            type="button"
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'Игроки' && <span className="nav-count">2.4k</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="season-card">
          <div className="season-topline"><span className="live-dot" /> СЕЗОН 04</div>
          <strong>Новый рубеж</strong>
          <span>Обновлено 4 минуты назад</span>
          <div className="season-progress"><i /></div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
