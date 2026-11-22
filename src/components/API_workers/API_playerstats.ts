import { useEffect, useState } from 'react';
import { deadlockApi } from '../API_request';
import type {
  EnemyStatEntry,
  HeroAsset,
  HeroStatEntry,
  MatchHistoryEntry,
  MateStatEntry,
  RankAsset,
  RankData,
  SteamProfileEntry,
} from '../PlayerStats';

export type PlayerStatsData = {
  rank: RankData | null;
  matches: MatchHistoryEntry[];
  heroes: HeroStatEntry[];
  mates: MateStatEntry[];
  enemies: EnemyStatEntry[];
  heroAssets: HeroAsset[];
  rankAssets: RankAsset[];
  playerProfiles: Record<number, SteamProfileEntry>;
};

const emptyData: PlayerStatsData = {
  rank: null,
  matches: [],
  heroes: [],
  mates: [],
  enemies: [],
  heroAssets: [],
  rankAssets: [],
  playerProfiles: {},
};

function getSettledData<T>(
  result: PromiseSettledResult<{ data: T }>,
  fallback: T,
): T {
  return result.status === 'fulfilled' ? result.value.data : fallback;
}

function usePlayerStats(accountId: string) {
  const [data, setData] = useState<PlayerStatsData>(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setData(emptyData);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.allSettled([
      deadlockApi.get(`/v1/players/${encodeURIComponent(accountId)}/rank`),
      deadlockApi.get(`/v1/players/${encodeURIComponent(accountId)}/match-history`),
      deadlockApi.get('/v1/players/hero-stats', { params: { account_ids: accountId } }),
      deadlockApi.get(`/v1/players/${encodeURIComponent(accountId)}/mate-stats`, {
        params: { same_party: false },
      }),
      deadlockApi.get(`/v1/players/${encodeURIComponent(accountId)}/enemy-stats`),
      deadlockApi.get('/v1/assets/heroes'),
      deadlockApi.get('/v1/assets/ranks'),
    ])
      .then(async ([
        rankResult,
        matchesResult,
        heroesResult,
        matesResult,
        enemiesResult,
        heroAssetsResult,
        rankAssetsResult,
      ]) => {
        if (cancelled) return;

        const rank = getSettledData<RankData | null>(rankResult, null);
        const matches = getSettledData<MatchHistoryEntry[]>(matchesResult, []);
        const heroes = getSettledData<HeroStatEntry[]>(heroesResult, []);
        const mates = getSettledData<MateStatEntry[]>(matesResult, []);
        const enemies = getSettledData<EnemyStatEntry[]>(enemiesResult, []);
        const heroAssets = getSettledData<HeroAsset[]>(heroAssetsResult, []);
        const rankAssets = getSettledData<RankAsset[]>(rankAssetsResult, []);

        const relationIds = Array.from(new Set([
          ...mates.map((entry) => entry.mate_id),
          ...enemies.map((entry) => entry.enemy_id),
        ]));

        let playerProfiles: Record<number, SteamProfileEntry> = {};
        if (relationIds.length > 0) {
          try {
            const profileResponse = await deadlockApi.get('/v1/players/steam', {
              params: { account_ids: Array.from(new Set(relationIds)).join(',') },
            });
            const profiles = profileResponse.data as SteamProfileEntry[];
            playerProfiles = Object.fromEntries(profiles.map((profile) => [profile.account_id, profile]));
          } catch (profileError) {
            console.error('Не удалось загрузить профили союзников и врагов:', profileError);
          }
        }

        const allFailed = [
          rankResult,
          matchesResult,
          heroesResult,
          matesResult,
          enemiesResult,
          heroAssetsResult,
          rankAssetsResult,
        ].every((result) => result.status === 'rejected');
        if (allFailed) {
          setError('Не удалось загрузить статистику игрока');
        } else {
          setError(null);
        }

        setData({
          rank,
          matches: matches.slice(0, 20),
          heroes,
          mates,
          enemies,
          heroAssets,
          rankAssets,
          playerProfiles,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return { data, loading, error };
}

export default usePlayerStats;

