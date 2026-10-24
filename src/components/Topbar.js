import './Topbar.css';

function Topbar({ activeNav }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>DEADLOCK</span><b>/</b><strong>{activeNav.toUpperCase()}</strong></div>
      <div className="topbar-actions">
        <span className="updated-label"><span className="live-dot" /> Данные обновлены</span>
        <button className="icon-button notification-button" type="button" aria-label="Уведомления">♧<i /></button>
        <button className="sign-in-button" type="button">Войти <span>↗</span></button>
      </div>
    </header>
  );
}

export default Topbar;
