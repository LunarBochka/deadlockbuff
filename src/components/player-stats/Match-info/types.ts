import type { HeroAsset } from '../../PlayerStats';

export type MatchRecord = Record<string, unknown>;

export type ItemAsset = MatchRecord & {
  id?: number;
  name?: string;
};

export type MatchInfoProps = {
  accountId: string;
  matchId: number;
  heroesById: ReadonlyMap<number, HeroAsset>;
};
