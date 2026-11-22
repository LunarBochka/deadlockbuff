import type { RankAsset, RankData } from '../PlayerStats';

type PlayerRankProps = {
  rank: RankData | null;
  rankAssets: RankAsset[];
};

function getRankImage(rankAsset?: RankAsset, subrank = 1) {
  if (!rankAsset?.images) return undefined;

  return rankAsset.images[`subrank${subrank}_webp`]
    || rankAsset.images[`subrank${subrank}`]
    || rankAsset.images.large_webp
    || rankAsset.images.large;
}

function PlayerRank({ rank, rankAssets }: PlayerRankProps) {
  const rankAsset = rank
    ? rankAssets.find((asset) => asset.tier === rank.rank)
    : undefined;
  const rankImage = getRankImage(rankAsset, rank?.subrank || 1);

  return (
    <section className="player-rank-card" aria-label="Ранг игрока">
      {rankImage && (
        <img
          className="player-rank-avatar"
          src={rankImage}
          alt={rankAsset?.name || 'Ранг'}
        />
      )}
      <div>
        <span className="player-section-label">Текущий ранг</span>
        <h3>
          {rankAsset?.name || 'Ранг неизвестен'}
          {rank && rank.subrank > 0 ? ` ${rank.subrank}` : ''}
        </h3>
        {rank && rank.badge > 0 && <p>Badge {rank.badge}</p>}
      </div>
    </section>
  );
}

export default PlayerRank;
