import { useNavigate } from 'react-router-dom';
import type { HeroAsset, MatchHistoryEntry } from '../PlayerStats';
import { formatDuration, formatMatchDate, formatNetWorth } from './formatters';
import HeroIcon from './HeroIcon';

type MatchHistoryProps = {
  accountId: string;
  matches: MatchHistoryEntry[];
  heroesById: ReadonlyMap<number, HeroAsset>;
};

function getOutcome(outcome: number) {
  if (outcome === 1) return { label: 'Победа', marker: 'W', className: 'is-win' };
  if (outcome === 2) return { label: 'Поражение', marker: 'L', className: 'is-loss' };
  return { label: 'Другое', marker: '—', className: 'is-other' };
}

function MatchRow({
  match,
  hero,
  onOpen,
}: {
  match: MatchHistoryEntry;
  hero?: HeroAsset;
  onOpen: () => void;
}) {
  const outcome = getOutcome(match.player_match_outcome);

  return (
    <div className="match-row">
      <HeroIcon hero={hero} />
      <div className="match-hero">
        <strong>{hero?.name || `Герой ${match.hero_id}`}</strong>
        <span>{formatDuration(match.match_duration_s)}</span>
        <time>{formatMatchDate(match.start_time)}</time>
      </div>
      <strong className="match-kda">
        {match.player_kills}/{match.player_deaths}/{match.player_assists}
      </strong>
      <span className="match-networth">{formatNetWorth(match.net_worth)}</span>
      <span className={`match-result ${outcome.className}`}>
        {outcome.label}
      </span>
      <button
        className="match-details-toggle"
        type="button"
        onClick={onOpen}
      >
        Подробнее
      </button>
    </div>
  );
}

function MatchHistory({ accountId, matches, heroesById }: MatchHistoryProps) {
  const navigate = useNavigate();

  return (
    <section className="player-stat-section" aria-label="Форма за последние матчи">
      <div className="player-section-heading">
        <div>
          <span className="player-section-label">Форма</span>
          <h3>Последние матчи</h3>
        </div>
        <span className="player-section-count">{matches.length} игр</span>
      </div>

      {matches.length > 0 ? (
        <>
          <div className="recent-form" aria-label="График результатов последних 20 матчей">
            {matches.map((match) => {
              const hero = heroesById.get(match.hero_id);
              const outcome = getOutcome(match.player_match_outcome);
              const heroName = hero?.name || `Герой ${match.hero_id}`;
              return (
                <span
                  key={match.match_id}
                  className={`recent-form-game ${outcome.className}`}
                  title={`${heroName} • ${match.player_kills}/${match.player_deaths}/${match.player_assists}`}
                >
                  {outcome.marker}
                </span>
              );
            })}
          </div>
          <div className="match-list">
            {matches.map((match) => (
              <MatchRow
                key={match.match_id}
                match={match}
                hero={heroesById.get(match.hero_id)}
                onOpen={() => navigate(
                  `/player/${encodeURIComponent(accountId)}/match/${match.match_id}`,
                )}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="player-empty">История матчей недоступна.</p>
      )}
    </section>
  );
}

export default MatchHistory;
