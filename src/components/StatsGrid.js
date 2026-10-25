import './StatsGrid.css';

function StatsGrid() {
  return (
    <section className="stats-grid" aria-label="Общая статистика">
      <article className="stat-card stat-card-featured">
        <div className="stat-top"><span>АКТИВНЫЕ ИГРОКИ</span><span className="stat-symbol">◉</span></div>
        <strong className="stat-value">24,<span>891</span></strong>
        <div className="stat-foot"><span className="trend-positive">↑ 12.8%</span><span>за последние 7 дней</span></div>
        <div className="mini-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>МАТЧЕЙ СЕГОДНЯ</span><span className="stat-symbol">⌁</span></div>
        <strong className="stat-value">18,<span>204</span></strong>
        <div className="stat-foot"><span className="trend-positive">↑ 8.2%</span><span>к прошлому дню</span></div>
        <div className="stat-bar"><i style={{ width: '72%' }} /></div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>СРЕДНИЙ ВИНРЕЙТ</span><span className="stat-symbol">◒</span></div>
        <strong className="stat-value">50<span>.4%</span></strong>
        <div className="stat-foot"><span className="trend-neutral">± 0.3%</span><span>баланс команд</span></div>
        <div className="stat-bar stat-bar-green"><i style={{ width: '50.4%' }} /></div>
      </article>
      <article className="stat-card stat-card-rank">
        <div className="stat-top"><span>ЛИДЕР СЕЗОНА</span><span className="stat-symbol">✳</span></div>
        <div className="leader-mini">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces" alt="" />
          <div><strong>Marlow</strong><span>Рейтинг <b>8,942</b></span></div>
          <span className="leader-arrow">↗</span>
        </div>
        <div className="stat-foot"><span className="leader-rank">#1</span><span>в мировом рейтинге</span></div>
      </article>
    </section>
  );
}
////////////////////////
export default StatsGrid;
