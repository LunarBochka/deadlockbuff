import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HeroAsset } from '../../PlayerStats';
import HeroIcon from '../HeroIcon';
import {
  asRecord,
  asRecords,
  formatMatchNumber,
  formatMatchTime,
  getItemImage,
  getLatestSnapshot,
  getNumber,
  getPlayerSlot,
  getPlayerSnapshots,
  getText,
} from './matchFormatters';
import type { ItemAsset, MatchRecord } from './types';

type SharedProps = {
  players: MatchRecord[];
  heroesById: ReadonlyMap<number, HeroAsset>;
  itemsById: ReadonlyMap<number, ItemAsset>;
};

function getPlayerName(player: MatchRecord, index: number) {
  return getText(player, 'personaname', 'player_name', 'name')
    || `Игрок ${getNumber(player, 'account_id') ?? index + 1}`;
}

function ItemTimeline({ players, heroesById, itemsById }: SharedProps) {
  const lanes = players.map((player, index) => {
    const heroId = getNumber(player, 'hero_id');
    const hero = heroId === null ? undefined : heroesById.get(heroId);
    const purchases = asRecords(player.items)
      .map((purchase) => ({
        purchase,
        itemId: getNumber(purchase, 'item_id', 'id'),
        time: getNumber(purchase, 'time_s', 'game_time_s', 'purchase_time_s', 'timestamp_s'),
      }))
      .filter((purchase) =>
        purchase.itemId !== null && itemsById.get(purchase.itemId)?.type !== 'ability')
      .sort((left, right) => (left.time ?? 0) - (right.time ?? 0));

    return { player, index, hero, purchases };
  });

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Покупки</span>
          <h4>Таймлайн предметов</h4>
        </div>
      </div>
      {lanes.some((lane) => lane.purchases.length > 0) ? (
        <div className="match-item-timeline">
          {lanes.filter((lane) => lane.purchases.length > 0).map((lane) => (
            <div className="match-item-lane" key={getPlayerSlot(lane.player, lane.index)}>
              <div className="match-item-lane-player">
                <HeroIcon hero={lane.hero} />
                <span>{getPlayerName(lane.player, lane.index)}</span>
              </div>
              <div className="match-item-events">
                {lane.purchases.map(({ purchase, itemId, time }, index) => {
                  if (itemId === null) return null;
                  const item = itemsById.get(itemId);
                  const image = getItemImage(item);
                  const itemName = item?.name || getText(purchase, 'item_name', 'name') || `Предмет ${itemId}`;
                  return (
                    <div
                      className="match-item-event"
                      key={`${itemId}-${time ?? index}-${index}`}
                      title={itemName}
                    >
                      {image ? <img src={image} alt="" /> : <span className="match-item-placeholder">◇</span>}
                      <span className="match-item-event-time">
                        {time === null ? '—' : formatMatchTime(time)}
                      </span>
                      <span className="match-item-event-name">{itemName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : <p className="match-info-muted">Данные о покупках отсутствуют.</p>}
    </section>
  );
}

type CurveEntry = {
  time: number;
  label: string;
  [playerKey: string]: number | string | null;
};

function NetWorthSection({ players }: Pick<SharedProps, 'players'>) {
  const playerSeries = players.map((player, index) => {
    const snapshots = getPlayerSnapshots(player);
    return {
      key: `player-${getPlayerSlot(player, index)}`,
      name: getPlayerName(player, index),
      color: index % 2 === 0 ? '#b798f5' : '#55c6b0',
      snapshots,
      player,
    };
  });
  const curveByTime = new Map<number, CurveEntry>();

  playerSeries.forEach((series) => {
    series.snapshots.forEach((snapshot) => {
      const time = getNumber(snapshot, 'time_stamp_s', 'timestamp_s', 'time_s');
      const netWorth = getNumber(snapshot, 'net_worth', 'networth');
      if (time === null || netWorth === null) return;
      const point = curveByTime.get(time) || { time, label: formatMatchTime(time) };
      point[series.key] = netWorth;
      curveByTime.set(time, point);
    });
  });

  const curve = Array.from(curveByTime.values()).sort((left, right) => left.time - right.time);
  const finalNetWorth = playerSeries.map((series) => {
    const latest = getLatestSnapshot(series.player);
    return {
      name: series.name,
      netWorth: getNumber(latest, 'net_worth', 'networth')
        ?? getNumber(series.player, 'net_worth', 'networth')
        ?? 0,
      color: series.color,
    };
  });

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Экономика</span>
          <h4>Кривая нетворса</h4>
        </div>
        <span className="match-info-muted">
          {curve.length > 0 ? 'По снимкам матча' : 'Финальные значения'}
        </span>
      </div>
      <div className="match-chart">
        <ResponsiveContainer width="100%" height={260}>
          {curve.length > 0 ? (
            <LineChart data={curve} margin={{ top: 8, right: 12, bottom: 4, left: 8 }}>
              <CartesianGrid stroke="#373044" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: '#a69bb4', fontSize: 10 }} minTickGap={24} />
              <YAxis tick={{ fill: '#a69bb4', fontSize: 10 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
              <Tooltip
                labelStyle={{ color: '#f2edf7' }}
                contentStyle={{ background: '#1b1726', border: '1px solid #47385e' }}
                formatter={(value) => formatMatchNumber(Number(value ?? 0))}
              />
              {playerSeries.map((series) => (
                <Line
                  key={series.key}
                  dataKey={series.key}
                  name={series.name}
                  type="monotone"
                  stroke={series.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={finalNetWorth} layout="vertical" margin={{ top: 8, right: 18, bottom: 4, left: 12 }}>
              <CartesianGrid stroke="#373044" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: '#a69bb4', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#d7cce0', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1b1726', border: '1px solid #47385e' }}
                formatter={(value) => formatMatchNumber(Number(value ?? 0))}
              />
              <Bar dataKey="netWorth" name="Нетворс" fill="#b798f5" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function DeathsSection({ players, heroesById }: Pick<SharedProps, 'players' | 'heroesById'>) {
  const slots = new Map(players.map((player, index) => [
    getPlayerSlot(player, index),
    { player, index },
  ]));
  const deaths = players.flatMap((player, playerIndex) => {
    const heroId = getNumber(player, 'hero_id');
    return asRecords(player.death_details).map((death, deathIndex) => {
      const killerSlot = getNumber(death, 'killer_player_slot', 'attacker_player_slot');
      const killer = killerSlot === null ? undefined : slots.get(killerSlot);
      const killedHero = heroId === null ? undefined : heroesById.get(heroId);
      const killerHeroId = getNumber(killer?.player, 'hero_id');
      const killerHero = killerHeroId === null ? undefined : heroesById.get(killerHeroId);
      return {
        death,
        player,
        playerIndex,
        deathIndex,
        killedHero,
        killer,
        killerHero,
        time: getNumber(death, 'game_time_s', 'time_s', 'time_stamp_s') ?? 0,
      };
    });
  }).sort((left, right) => left.time - right.time);

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">События</span>
          <h4>Смерти</h4>
        </div>
        <span className="match-info-muted">{deaths.length}</span>
      </div>
      {deaths.length > 0 ? (
        <div className="match-death-list">
          {deaths.map((entry) => {
            const respawn = getNumber(entry.death, 'respawn_time_s', 'respawn_s', 'respawn_time');
            return (
              <div className="match-death-event" key={`${entry.playerIndex}-${entry.deathIndex}`}>
                <time>{formatMatchTime(entry.time)}</time>
                <HeroIcon hero={entry.killedHero} />
                <span className="match-death-name">{getPlayerName(entry.player, entry.playerIndex)}</span>
                <span className="match-death-separator">убит</span>
                {entry.killer ? (
                  <>
                    <HeroIcon hero={entry.killerHero} />
                    <span className="match-death-name">{getPlayerName(entry.killer.player, entry.killer.index)}</span>
                  </>
                ) : <span className="match-info-muted">неизвестный убийца</span>}
                <span className="match-death-extra">
                  {respawn !== null ? `Респавн ${formatMatchTime(respawn)}` : ''}
                </span>
              </div>
            );
          })}
        </div>
      ) : <p className="match-info-muted">Данные о смертях отсутствуют.</p>}
    </section>
  );
}

function getObjectiveLabel(objective: MatchRecord) {
  const objectiveId = getNumber(objective, 'team_objective_id', 'objective_id');
  if (objectiveId !== null) {
    if (objectiveId === 0) return 'Ядро базы';
    if (objectiveId >= 1 && objectiveId <= 4) return `Страж — линия ${objectiveId}`;
    if (objectiveId >= 5 && objectiveId <= 8) return `Шагоход — линия ${objectiveId - 4}`;
    if (objectiveId === 9) return 'Патрон';
    if (objectiveId === 10 || objectiveId === 11) return `Святилище ${objectiveId - 9}`;
    if (objectiveId >= 12 && objectiveId <= 15) {
      return `Страж базы — линия ${objectiveId - 11}`;
    }
    return 'Объект на карте';
  }

  const objectiveName = getText(objective, 'objective_name', 'name', 'team_objective_id');
  if (!objectiveName) return 'Объект на карте';
  const laneObjective = objectiveName.match(/(?:Tier1|Tier2|BarrackBoss)_?Lane_?(\d+)/i);
  if (laneObjective) {
    const lane = Number(laneObjective[1]);
    if (/Tier1/i.test(objectiveName)) return `Страж — линия ${lane}`;
    if (/Tier2/i.test(objectiveName)) return `Шагоход — линия ${lane}`;
    return `Страж базы — линия ${lane}`;
  }
  if (/TitanShieldGenerator_?1/i.test(objectiveName)) return 'Святилище 1';
  if (/TitanShieldGenerator_?2/i.test(objectiveName)) return 'Святилище 2';
  if (/^Core$/i.test(objectiveName)) return 'Ядро базы';
  if (/^Titan$/i.test(objectiveName)) return 'Патрон';
  return Number.isNaN(Number(objectiveName)) ? objectiveName : 'Объект на карте';
}

function getTeamLabel(team: number | null, playerTeam: number | null) {
  if (team === null) return 'Сторона неизвестна';
  if (playerTeam !== null) {
    return team === playerTeam ? 'Ваша команда' : 'Соперники';
  }
  if (team === 0) return 'Сторона A';
  if (team === 1) return 'Сторона B';
  return 'Сторона неизвестна';
}

function ObjectivesSection({
  metadata,
  players,
  accountId,
}: {
  metadata: MatchRecord;
  players: MatchRecord[];
  accountId: string;
}) {
  const matchInfo = asRecord(metadata.match_info);
  const selectedAccountId = Number(accountId);
  const playerTeam = getNumber(
    players.find((player) => getNumber(player, 'account_id') === selectedAccountId),
    'team',
    'player_team',
  );
  const objectives = asRecords(metadata.objectives ?? matchInfo?.objectives)
    .map((objective) => ({
      objective,
      time: getNumber(objective, 'destroyed_time_s', 'time_s', 'game_time_s'),
    }))
    .filter((entry) => entry.time !== null && entry.time > 0)
    .sort((left, right) => (left.time ?? 0) - (right.time ?? 0));
  const midBoss = asRecords(metadata.mid_boss ?? matchInfo?.mid_boss)
    .map((boss) => ({
      boss,
      time: getNumber(boss, 'destroyed_time_s', 'game_time_s', 'time_s', 'killed_time_s'),
    }))
    .filter((entry) => entry.time !== null && entry.time > 0);
  const events = [
    ...objectives.map(({ objective, time }) => ({
      key: `objective-${getText(objective, 'team_objective_id', 'objective_id')}-${time}`,
      time: time ?? 0,
      label: getObjectiveLabel(objective),
      detail: `Уничтожили: ${getTeamLabel(getNumber(objective, 'team', 'team_id'), playerTeam)}`,
      type: 'objective',
    })),
    ...midBoss.map(({ boss, time }, index) => ({
      key: `boss-${index}`,
      time: time ?? 0,
      label: 'Мид-босс убит',
      detail: `Усиление забрали: ${getTeamLabel(getNumber(boss, 'team_claimed', 'team'), playerTeam)}`,
      type: 'boss',
    })),
  ].sort((left, right) => left.time - right.time);

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Карта</span>
          <h4>Цели и мид-босс</h4>
          <p className="match-info-section-description">
            Какие объекты уничтожили и кто забрал усиление мид-босса.
          </p>
        </div>
      </div>
      {events.length > 0 ? (
        <div className="match-objective-timeline">
          {events.map((event) => (
            <div className={`match-objective-event ${event.type === 'boss' ? 'is-boss' : ''}`} key={event.key}>
              <time>{formatMatchTime(event.time)}</time>
              <strong>{event.label}</strong>
              <span>{event.detail}</span>
            </div>
          ))}
        </div>
      ) : <p className="match-info-muted">Цели или мид-босс не записаны.</p>}
    </section>
  );
}

function DamageSection({ players, metadata }: Pick<SharedProps, 'players'> & { metadata: MatchRecord }) {
  const matrix = asRecord(metadata.damage_matrix);
  const dealers = asRecords(matrix?.damage_dealers);
  const sourceDetails = asRecords(matrix?.source_details);
  const damageBySlot = new Map<number, number>();

  dealers.forEach((dealer, index) => {
    const slot = getNumber(dealer, 'dealer_player_slot', 'player_slot', 'dealer_slot');
    if (slot === null) return;
    let total = 0;
    const sources = asRecords(dealer.damage_sources);
    const entries = sources.length > 0 ? sources : [dealer];
    entries.forEach((source) => {
      const sourceIndex = getNumber(source, 'source_details_index');
      const sourceInfo = sourceIndex === null ? null : sourceDetails[sourceIndex];
      const statType = getNumber(sourceInfo, 'stat_type');
      if (statType !== null && statType !== 0) return;
      const damage = source.damage;
      if (Array.isArray(damage)) {
        const values = damage.filter((value): value is number =>
          typeof value === 'number' && Number.isFinite(value));
        total += values.length > 0 ? values[values.length - 1] : 0;
      } else if (typeof damage === 'number' && Number.isFinite(damage)) {
        total += damage;
      }
    });
    damageBySlot.set(slot, total);
  });

  const data = players.map((player, index) => {
    const slot = getPlayerSlot(player, index);
    return {
      name: getPlayerName(player, index),
      damage: damageBySlot.get(slot)
        ?? getNumber(getLatestSnapshot(player), 'player_damage', 'damage')
        ?? getNumber(player, 'player_damage', 'damage')
        ?? 0,
      team: getNumber(player, 'team', 'player_team'),
    };
  });
  const hasMatrixData = data.some((entry) => entry.damage > 0);

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Урон</span>
          <h4>Урон по игрокам</h4>
        </div>
        <span className="match-info-muted">{hasMatrixData ? 'Матрица урона' : 'Данные игрока'}</span>
      </div>
      {hasMatrixData ? (
        <div className="match-chart">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 8 }}>
              <CartesianGrid stroke="#373044" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#d7cce0', fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={58} />
              <YAxis tick={{ fill: '#a69bb4', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1b1726', border: '1px solid #47385e' }}
                formatter={(value) => formatMatchNumber(Number(value ?? 0))}
              />
              <Bar dataKey="damage" name="Урон" fill="#ed8a9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <p className="match-info-muted">Нет данных о нанесённом уроне.</p>}
    </section>
  );
}

const AWARD_STATS: Array<{ key: string; label: string }> = [
  { key: 'player_damage', label: 'Урон игрокам' },
  { key: 'player_damage_taken', label: 'Получено урона' },
  { key: 'creep_damage', label: 'Урон крипам' },
  { key: 'neutral_damage', label: 'Урон нейтралам' },
  { key: 'boss_damage', label: 'Урон боссам' },
  { key: 'healing', label: 'Лечение' },
  { key: 'crates_broken', label: 'Ящики' },
  { key: 'last_hits', label: 'Добивания' },
  { key: 'denies', label: 'Денаи' },
];

function AwardStats({ players }: Pick<SharedProps, 'players'>) {
  const rows = players.map((player, index) => {
    const snapshot = getLatestSnapshot(player);
    const values = AWARD_STATS.map(({ key, label }) => ({
      key,
      label,
      value: getNumber(snapshot, key) ?? getNumber(player, key),
    })).filter((stat) => stat.value !== null);
    return { player, index, values };
  }).filter((row) => row.values.length > 0);

  return (
    <section className="match-info-section">
      <div className="match-info-section-heading">
        <div>
          <span className="player-section-label">Награды</span>
          <h4>Дополнительная статистика</h4>
        </div>
      </div>
      {rows.length > 0 ? (
        <div className="match-award-grid">
          {rows.map((row) => (
            <div className="match-award-card" key={getPlayerSlot(row.player, row.index)}>
              <strong>{getPlayerName(row.player, row.index)}</strong>
              <div>
                {row.values.map((stat) => (
                  <span key={stat.key}>
                    <small>{stat.label}</small>
                    <b>{formatMatchNumber(stat.value ?? 0)}</b>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : <p className="match-info-muted">Дополнительная статистика отсутствует.</p>}
    </section>
  );
}

type MatchInfoSectionsProps = SharedProps & {
  metadata: MatchRecord;
  accountId: string;
};

function MatchInfoSections({
  metadata,
  players,
  heroesById,
  itemsById,
  accountId,
}: MatchInfoSectionsProps) {
  return (
    <>
      <NetWorthSection players={players} />
      <ItemTimeline players={players} heroesById={heroesById} itemsById={itemsById} />
      <DeathsSection players={players} heroesById={heroesById} />
      <ObjectivesSection metadata={metadata} players={players} accountId={accountId} />
      <DamageSection players={players} metadata={metadata} />
      <AwardStats players={players} />
    </>
  );
}

export { MatchInfoSections };
