import { useState, useEffect } from 'react';
import axios from 'axios';
import './Player.css';

function PlayerCard({ accountId: initialAccountId = '' }) {
  const [accountId, setAccountId] = useState(String(initialAccountId));
  const [requestedAccountId, setRequestedAccountId] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);
  const [player, setPlayer] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestedAccountId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    setLoading(true);
    setError(null);
    setPlayer(null);
    setResponseData(null);

    axios.get('https://api.deadlock-api.com/v1/players/steam', {
      params: { account_ids: requestedAccountId },
    })
      .then(({ data }) => {
        if (!cancelled) {
          setResponseData(data);
          setPlayer(Array.isArray(data) ? data[0] ?? null : data ?? null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [requestedAccountId, requestVersion]);

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedAccountId = accountId.trim();

    if (!/^\d+$/.test(normalizedAccountId)) {
      setError('Введите числовой Steam account ID.');
      setPlayer(null);
      setResponseData(null);
      return;
    }

    setError(null);
    setRequestedAccountId(normalizedAccountId);
    setRequestVersion((version) => version + 1);
  }

  return (
    <section className="player-tool" aria-labelledby="player-tool-title">
      <div className="player-tool-heading">
        <div>
          <p className="player-tool-kicker">DEADLOCK API</p>
          <h2 id="player-tool-title">Данные игрока</h2>
        </div>
        <span className="player-tool-method">GET /players/steam</span>
      </div>

      <form className="player-form" onSubmit={handleSubmit}>
        <label htmlFor="steam-account-id">Steam account ID</label>
        <div className="player-form-controls">
          <input
            id="steam-account-id"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Например, 123456789"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
          />
          <button type="submit" disabled={loading || !accountId.trim()}>
            {loading && requestedAccountId ? 'Загрузка...' : 'Загрузить'}
          </button>
        </div>
      </form>

      {error && <p className="player-message player-error">Ошибка: {error}</p>}
      {!requestedAccountId && !error && (
        <p className="player-message">Введите ID игрока, чтобы запросить его данные.</p>
      )}
      {loading && requestedAccountId && (
        <p className="player-message">Загружаю данные игрока...</p>
      )}
      {!loading && !error && requestedAccountId && !player && (
        <p className="player-message">Игрок не найден.</p>
      )}

      {player && (
        <div className="player-summary">
          {player.avatarfull && (
            <img src={player.avatarfull} alt="" width={56} height={56} />
          )}
          <div>
            <p>Профиль загружен</p>
            <h3>{player.personaname || `ID ${requestedAccountId}`}</h3>
          </div>
        </div>
      )}

      {responseData !== null && (
        <details className="player-json" open>
          <summary>Полный ответ API · JSON</summary>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}

export default PlayerCard;