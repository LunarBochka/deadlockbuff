import './App.css';
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import Topbar from './components/Topbar';
import HomePage from './components/HomePage';
import PlayerPage from './components/PlayerPage';

function HomeRoute() {
  const openPlayer = useOutletContext();

  return <HomePage onSearch={openPlayer} />;
}

function PlayerRoute() {
  const { accountId } = useParams();

  return accountId ? <PlayerPage accountId={accountId} /> : null;
}

function AppLayout() {
  const navigate = useNavigate();

  const openPlayer = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    navigate(`/player/${encodeURIComponent(trimmedQuery)}`);
  };

  const goHome = () => navigate('/');

  return (
    <div className="dashboard-shell">
      <main className="main-content">
        <Topbar onSearch={openPlayer} onHome={goHome} />
        <Outlet context={openPlayer} />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="player/:accountId" element={<PlayerRoute />} />
          <Route path="*" element={<HomeRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
