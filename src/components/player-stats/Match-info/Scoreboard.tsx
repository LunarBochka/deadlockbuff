import type { HeroAsset } from '../../PlayerStats';
import HeroIcon from '../HeroIcon';
import { asRecords, formatMatchNumber, getItemImage, getNumber } from './matchFormatters';
import type { ItemAsset, MatchRecord } from './types';

type ScoreboardProps = {
  players: MatchRecord[];
  heroesById: ReadonlyMap<number, HeroAsset>;
  itemsById: ReadonlyMap<number, ItemAsset>;
};

function getPlayerItems(
  player: MatchRecord,
  itemsById: ReadonlyMap<number, ItemAsset>,
) {
  return asRecords(player.items)
    .filter((item) => {
      const soldTime = getNumber(item, 'sold_time_s', 'sold_time');
      return soldTime === null || soldTime === 0;
    })
    .map((item) => getNumber(item, 'item_id', 'id'))
    .filter((itemId): itemId is number =>
      itemId !== null && itemsById.get(itemId)?.type !== 'ability');
}

function Scoreboard({ players, heroesById, itemsById }: ScoreboardProps) {
  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Табло</span>
          <h4>Статистика игроков</h4>
        </div>
      </div>
      <div className="match-table-scroll">
        <table className="match-scoreboard">
          <thead>
            <tr>
              <th>Игрок</th>
              <th>K / D / A</th>
              <th>Нетворс</th>
              <th>Финальные предметы</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const heroId = getNumber(player, 'hero_id');
              const hero = heroId === null ? undefined : heroesById.get(heroId);
              const accountId = getNumber(player, 'account_id');
              const playerName = typeof player.personaname === 'string'
                ? player.personaname
                : accountId === null ? `Игрок ${index + 1}` : `Игрок ${accountId}`;
              const itemIds = getPlayerItems(player, itemsById);

              return (
                <tr key={`${accountId ?? 'player'}-${index}`}>
                  <td>
                    <div className="match-scoreboard-player">
                      <HeroIcon hero={hero} />
                      <div>
                        <strong>{playerName}</strong>
                        <span>{hero?.name || (heroId === null ? 'Герой неизвестен' : `Герой ${heroId}`)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="match-scoreboard-kda">
                    {getNumber(player, 'player_kills', 'kills') ?? 0}
                    {' / '}
                    {getNumber(player, 'player_deaths', 'deaths') ?? 0}
                    {' / '}
                    {getNumber(player, 'player_assists', 'assists') ?? 0}
                  </td>
                  <td className="match-scoreboard-networth">
                    {formatMatchNumber(getNumber(player, 'net_worth', 'networth') ?? 0)}
                  </td>
                  <td>
                    {itemIds.length > 0 ? (
                      <div className="match-final-items">
                        {itemIds.map((itemId, itemIndex) => {
                          const item = itemsById.get(itemId);
                          const image = getItemImage(item);
                          return (
                            <span
                              className="match-item-chip"
                              key={`${itemId}-${itemIndex}`}
                              title={item?.name || `Предмет ${itemId}`}
                            >
                              {image && <img src={image} alt="" />}
                              {item?.name || `#${itemId}`}
                            </span>
                          );
                        })}
                      </div>
                    ) : <span className="match-info-muted">Нет данных</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Scoreboard;
