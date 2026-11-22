export type RankData = {
  badge: number;
  rank: number;
  subrank: number;
  last_match?: unknown;
};

export type MatchHistoryEntry = {
  match_id: number;
  hero_id: number;
  start_time: number;
  match_duration_s: number;
  player_kills: number;
  player_deaths: number;
  player_assists: number;
  net_worth: number;
  player_match_outcome: number;
};

export type HeroStatEntry = {
  hero_id: number;
  matches_played: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
};

export type MateStatEntry = {
  mate_id: number;
  matches_played: number;
  wins: number;
};

export type EnemyStatEntry = {
  enemy_id: number;
  matches_played: number;
  wins: number;
};

export type HeroAsset = {
  id: number;
  name: string;
  images?: {
    icon_image_small_webp?: string | null;
    icon_image_small?: string | null;
  };
};

export type RankAsset = {
  tier: number;
  name: string;
  images?: Record<string, string | null | undefined>;
};

export type SteamProfileEntry = {
  account_id: number;
  personaname?: string;
  avatarfull?: string;
};

