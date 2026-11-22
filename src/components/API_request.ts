import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { RawApiProfile } from './API_types';

export const deadlockApi = axios.create({
  baseURL: 'https://api.deadlock-api.com',
});

function useAPIprofile( accountId = '' ) {
  const [players, setPlayers] = useState<RawApiProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setPlayers([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

	deadlockApi.get('/v1/players/steam', {
				params: {
					account_ids: accountId,
				},
		})
	  .then(({ data }) => {
        if (!cancelled) setPlayers(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Ошибка загрузки:', err);
          setError('Не удалось загрузить данные');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return { players, loading, error };
}

export default useAPIprofile;