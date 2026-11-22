import type { HeroAsset, HeroStatEntry } from '../PlayerStats';
import { getWinRate } from './formatters';
import HeroIcon from './HeroIcon';

type TopHeroesProps = {
  heroes: HeroStatEntry[];
  heroesById: ReadonlyMap<number, HeroAsset>;
};

function TopHeroes({ heroes, heroesById }: TopHeroesProps) {
  const topHeroes = [...heroes]
    .sort((a, b) => b.matches_played - a.matches_played)
    .slice(0, 6);

  return (
    <section className="player-stat-section" aria-label="Топ героев">
      <div className="player-section-heading">
        <div>
          <span className="player-section-label">Топ героев</span>
          <h3>Чаще всего в игре</h3>
        </div>
      </div>

      {topHeroes.length > 0 ? (
        <div className="hero-grid">
          {topHeroes.map((heroStat) => {
            const hero = heroesById.get(heroStat.hero_id);
            const winrate = getWinRate(heroStat.wins, heroStat.matches_played);

            return (
              <div className="hero-stat" key={heroStat.hero_id}>
                <HeroIcon hero={hero} />
                <div>
                  <strong>{hero?.name || `Герой ${heroStat.hero_id}`}</strong>
                  <span>{heroStat.matches_played} игр • {winrate}% побед</span>
                </div>
                <b>{winrate}%</b>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="player-empty">Статистика героев недоступна.</p>
      )}
    </section>
  );
}

export default TopHeroes;
