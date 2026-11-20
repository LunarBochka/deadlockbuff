import './App.css';
import Topbar from './components/Topbar';
import HomePage from './components/HomePage';
import PlayerPage from './components/PlayerPage';
import useHashRoute from './components/useHashRoute';

function App() {
  const { accountId, openPlayer, goHome } = useHashRoute();

  return (
    <div className="dashboard-shell">
      <main className="main-content">
        <Topbar onSearch={openPlayer} onHome={goHome} />
        {accountId ? (
          <PlayerPage accountId={accountId} />
        ) : (
          <HomePage onSearch={openPlayer} />
        )}
      </main>
    </div>
  );
}

export default App;
