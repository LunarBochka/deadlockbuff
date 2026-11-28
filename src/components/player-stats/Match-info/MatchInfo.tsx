import { useEffect, useState } from 'react';
import { deadlockApi } from '../../API_request';
import type { SteamProfileEntry } from '../../PlayerStats';
import {
  asRecord,
  asRecords,
  getMatchPlayers,
  getNumber,
} from './matchFormatters';
import { MatchInfoSections } from './MatchInfoSections';
import Scoreboard from './Scoreboard';
import type { ItemAsset, MatchInfoProps, MatchRecord } from './types';
import './MatchInfo.css';

function MatchInfo({ accountId, matchId, heroesById }: MatchInfoProps) {
  const [metadata, setMetadata] = useState<MatchRecord | null>(null);
  const [itemsById, setItemsById] = useState<ReadonlyMap<number, ItemAsset>>(new Map());
  const [profilesById, setProfilesById] = useState<ReadonlyMap<number, SteamProfileEntry>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetsWarning, setAssetsWarning] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setAssetsWarning(null);
    setMetadata(null);

    deadlockApi.get(`/v1/matches/${encodeURIComponent(String(matchId))}/metadata`)
      .then(async ({ data }) => {
        const parsedMetadata = asRecord(data);
        if (!parsedMetadata) {
          throw new Error('В ответе API отсутствуют данные матча.');
        }
        if (cancelled) return;
        setMetadata(parsedMetadata);

        const players = getMatchPlayers(parsedMetadata);
        const accountIds = Array.from(new Set(players
          .map((player) => getNumber(player, 'account_id'))
          .filter((id): id is number => id !== null)));
        const [itemsResult, profilesResult] = await Promise.allSettled([
          deadlockApi.get('/v1/assets/items'),
          accountIds.length > 0
            ? deadlockApi.get('/v1/players/steam', { params: { account_ids: accountIds.join(',') } })
            : Promise.resolve({ data: [] as SteamProfileEntry[] }),
        ]);
        if (cancelled) return;

        if (itemsResult.status === 'fulfilled') {
          const itemAssets = asRecords(itemsResult.value.data)
            .map((item) => ({ item, id: getNumber(item, 'id') }))
            .filter((entry): entry is { item: MatchRecord; id: number } => entry.id !== null);
          setItemsById(new Map(itemAssets.map(({ item, id }) => [id, item])));
        } else {
          console.error('Не удалось загрузить предметы матча:', itemsResult.reason);
          setAssetsWarning('Не удалось загрузить названия предметов.');
        }
        if (profilesResult.status === 'fulfilled') {
          const profiles = asRecords(profilesResult.value.data)
            .filter((profile): profile is MatchRecord & { account_id: number } =>
              typeof profile.account_id === 'number');
          setProfilesById(new Map(profiles.map((profile) => [
            profile.account_id,
            {
              account_id: profile.account_id,
              personaname: typeof profile.personaname === 'string' ? profile.personaname : undefined,
              avatarfull: typeof profile.avatarfull === 'string' ? profile.avatarfull : undefined,
            },
          ])));
        } else {
          console.error('Не удалось загрузить профили игроков матча:', profilesResult.reason);
          setAssetsWarning((warning) => [
            warning,
            'Не удалось загрузить имена игроков.',
          ].filter(Boolean).join(' '));
        }
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        console.error(`Не удалось загрузить матч ${matchId}:`, requestError);
        setError('Не удалось загрузить данные матча. Попробуйте открыть матч позже.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  if (loading) {
    return <div className="match-info-panel" role="status">Загружаем подробности матча...</div>;
  }
  if (error) {
    return <div className="match-info-panel match-info-error" role="alert">{error}</div>;
  }
  if (!metadata) return null;

  const players = getMatchPlayers(metadata).map((player) => {
    const accountId = getNumber(player, 'account_id');
    const profile = accountId === null ? undefined : profilesById.get(accountId);
    return profile?.personaname ? { ...player, personaname: profile.personaname } : player;
  });
  const matchInfo = asRecord(metadata.match_info);
  const duration = getNumber(metadata, 'duration_s', 'match_duration_s')
    ?? getNumber(matchInfo, 'duration_s', 'match_duration_s');
  const winner = getNumber(metadata, 'winning_team', 'winner_team')
    ?? getNumber(matchInfo, 'winning_team', 'winner_team');

  return (
    <div className="match-info-panel">
      <header className="match-info-header">
        <div>
          <span className="player-section-label">Матч #{matchId}</span>
          <h3>Подробная статистика</h3>
        </div>
        <div className="match-info-summary">
          {duration !== null && <span>Длительность <strong>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</strong></span>}
          {winner !== null && <span>Победитель <strong>Команда {winner + 1}</strong></span>}
        </div>
      </header>
      {assetsWarning && <p className="match-info-warning" role="status">{assetsWarning}</p>}
      {players.length > 0 ? (
        <>
          <Scoreboard players={players} heroesById={heroesById} itemsById={itemsById} />
          <MatchInfoSections
            metadata={metadata}
            players={players}
            heroesById={heroesById}
            itemsById={itemsById}
            accountId={accountId}
          />
        </>
      ) : <p className="match-info-muted">Список игроков в metadata не найден.</p>}
    </div>
  );
}

export default MatchInfo;
