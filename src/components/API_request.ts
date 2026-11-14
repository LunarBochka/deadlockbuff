import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { RawApiResponse } from './types';

function useMicrocard( accountId = '' ) {
  const [players, setPlayers] = useState<RawApiResponse[]>([]);
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

	axios.get('https://api.deadlock-api.com/v1/players/steam', {
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

export default useMicrocard;