//import { useState } from 'react';
import './App.css';
import Topbar from './components/Topbar';
import Search from './components/Search';
import Microcard from './components/card_render';
import { useState } from 'react';




function App() {
  //const [activeNav, setActiveNav] = useState('Игроки');
  const [accountId, setAccountId] = useState('');
  return (
    <div className="dashboard-shell">
      <main className="main-content">
        <Topbar />
        <section className="home-content" id="overview" aria-label="Главная">
          <div className="home-brand" aria-label="Deadlock Buff">
            <span className="home-brand-mark" aria-hidden="true">D</span>
            <h1 className="home-brand-name">deadlock<span>buff</span></h1>
          </div>
      <Search
        onSearch={setAccountId} // ✅ просто setState, никаких хуков
        placeholder="Введите ID игрока"
      />
      {accountId && <Microcard accountId={accountId} />}
        </section>
      </main>
    </div>
  );
}

export default App;
