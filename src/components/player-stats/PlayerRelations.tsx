import type {
  EnemyStatEntry,
  MateStatEntry,
  SteamProfileEntry,
} from '../PlayerStats';
import { getWinRate } from './formatters';

type PlayerRelationsProps = {
  mates: MateStatEntry[];
  enemies: EnemyStatEntry[];
  playerProfiles: Record<number, SteamProfileEntry>;
};

type Relation = {
  id: number;
  matchesPlayed: number;
  wins: number;
};

function RelationSection({
  title,
  entries,
  playerProfiles,
  className,
}: {
  title: string;
  entries: Relation[];
  playerProfiles: Record<number, SteamProfileEntry>;
  className: string;
}) {
  return (
    <section className={`player-stat-section ${className}`}>
      <div className="player-section-heading">
        <div>
          <span className="player-section-label">Статистика</span>
          <h3>{title}</h3>
        </div>
      </div>
      {entries.length > 0 ? (
        <div className="relation-list">
          {entries.slice(0, 5).map((entry) => {
            const profile = playerProfiles[entry.id];
            return (
              <div className="relation-row" key={entry.id}>
                {profile?.avatarfull && <img src={profile.avatarfull} alt="" />}
                <strong>{profile?.personaname || `Игрок ${entry.id}`}</strong>
                <span>
                  {entry.matchesPlayed} игр • {getWinRate(entry.wins, entry.matchesPlayed)}% побед
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="player-empty">Данных пока нет.</p>
      )}
    </section>
  );
}

function PlayerRelations({ mates, enemies, playerProfiles }: PlayerRelationsProps) {
  const mateEntries = mates.map((entry) => ({
    id: entry.mate_id,
    matchesPlayed: entry.matches_played,
    wins: entry.wins,
  }));
  const enemyEntries = enemies.map((entry) => ({
    id: entry.enemy_id,
    matchesPlayed: entry.matches_played,
    wins: entry.wins,
  }));

  return (
    <div className="relation-grid">
      <RelationSection
        title="Чаще с в пати"
        entries={mateEntries}
        playerProfiles={playerProfiles}
        className="player-mates"
      />
      <RelationSection
        title="Чаще против"
        entries={enemyEntries}
        playerProfiles={playerProfiles}
        className="player-enemies"
      />
    </div>
  );
}

export default PlayerRelations;
