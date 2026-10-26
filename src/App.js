import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PlayerCard from './components/Player';

function App() {
  const [activeNav, setActiveNav] = useState('Игроки');

  return (
    <div className="dashboard-shell">
      <Sidebar activeNav={activeNav} onNavigate={setActiveNav} />
      <main className="main-content">
        <Topbar />
        <section className="home-content" id="overview" aria-label="Главная">
          <div className="home-brand" aria-label="Deadlock Buff">
            <span className="home-brand-mark" aria-hidden="true">D</span>
            <h1 className="home-brand-name">deadlock<span>buff</span></h1>
          </div>
          <PlayerCard />
        </section>
      </main>
    </div>
  );
}

export default App;
