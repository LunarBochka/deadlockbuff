import usePlayerStats from './API_workers/API_playerstats';
import MatchHistory from './player-stats/MatchHistory';
import PlayerRank from './player-stats/PlayerRank';
import PlayerRelations from './player-stats/PlayerRelations';
import TopHeroes from './player-stats/TopHeroes';

type PlayerStatsPanelProps = {
  accountId: string;
};

function PlayerStatsPanel({ accountId }: PlayerStatsPanelProps) {
  const { data, loading, error } = usePlayerStats(accountId);
  const heroesById = new Map(data.heroAssets.map((hero) => [hero.id, hero]));

  if (loading) {
    return <p className="player-message">Загрузка статистики игрока...</p>;
  }

  if (error) {
    return <p className="player-message player-error">{error}</p>;
  }

  return (
    <div className="player-stats">
      <PlayerRank rank={data.rank} rankAssets={data.rankAssets} />
      <MatchHistory accountId={accountId} matches={data.matches} heroesById={heroesById} />
      <TopHeroes heroes={data.heroes} heroesById={heroesById} />
      <PlayerRelations
        mates={data.mates}
        enemies={data.enemies}
        playerProfiles={data.playerProfiles}
      />
    </div>
  );
}

export default PlayerStatsPanel;
