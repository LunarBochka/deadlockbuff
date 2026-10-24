import { useState } from 'react';
import './App.css';
import PlayersSection from './components/PlayersSection';
import Sidebar from './components/Sidebar';
import StatsGrid from './components/StatsGrid';
import Topbar from './components/Topbar';

function App() {
  const [activeNav, setActiveNav] = useState('Игроки');

  return (
    <div className="dashboard-shell">
      <Sidebar activeNav={activeNav} onNavigate={setActiveNav} />

      <main className="main-content">
        <Topbar activeNav={activeNav} />

        <div className="content-wrap">
          <section className="page-heading" id="overview">
            <div>
              <div className="eyebrow"><span /> DEADLOCK / СООБЩЕСТВО</div>
              <h1>Игроки<span>.</span></h1>
              <p>Следи за лидерами. Сравнивай статистику. Играй лучше.</p>
            </div>
            <div className="heading-meta">
              <span className="meta-label">РЕЙТИНГ ОБНОВЛЁН</span>
              <strong>24 окт, 14:32 <span>↻</span></strong>
            </div>
          </section>

          <StatsGrid />
          <PlayersSection />

          <footer className="page-footer">
            <span>© 2026 DEADLOCK BUFF</span>
            <span>НЕОФИЦИАЛЬНЫЙ ФАН-САЙТ</span>
            <span>Данные для примера</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
