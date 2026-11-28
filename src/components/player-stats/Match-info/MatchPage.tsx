import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deadlockApi } from '../../API_request';
import type { HeroAsset } from '../../PlayerStats';
import { asRecord, asRecords, getNumber, getText } from './matchFormatters';
import MatchInfo from './MatchInfo';
import './MatchPage.css';

type MatchPageProps = {
  accountId: string;
  matchId: number;
};

function parseHeroAssets(data: unknown): HeroAsset[] {
  return asRecords(data).flatMap((asset) => {
    const id = getNumber(asset, 'id');
    const name = getText(asset, 'name');
    if (id === null || name === null) return [];

    const images = asRecord(asset.images);
    return [{
      id,
      name,
      images: {
        icon_image_small_webp: getText(images, 'icon_image_small_webp'),
        icon_image_small: getText(images, 'icon_image_small'),
      },
    }];
  });
}

function MatchPage({ accountId, matchId }: MatchPageProps) {
  const [heroAssets, setHeroAssets] = useState<HeroAsset[]>([]);
  const [heroAssetsError, setHeroAssetsError] = useState(false);
  const heroesById = useMemo(
    () => new Map(heroAssets.map((hero) => [hero.id, hero])),
    [heroAssets],
  );

  useEffect(() => {
    let cancelled = false;

    deadlockApi.get('/v1/assets/heroes')
      .then(({ data }) => {
        if (!cancelled) setHeroAssets(parseHeroAssets(data));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Не удалось загрузить героев матча:', error);
        setHeroAssetsError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="match-page">
      <header className="match-page-header">
        <Link className="match-page-back" to={`/player/${encodeURIComponent(accountId)}`}>
          <span aria-hidden="true">←</span> К статистике игрока
        </Link>
        <p>Подробная информация о матче</p>
        <h1>Матч #{matchId}</h1>
      </header>
      {heroAssetsError && (
        <p className="match-page-warning" role="status">
          Не удалось загрузить иконки героев. Остальные данные матча доступны.
        </p>
      )}
      <MatchInfo accountId={accountId} matchId={matchId} heroesById={heroesById} />
    </main>
  );
}

export default MatchPage;
