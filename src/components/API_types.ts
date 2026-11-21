// ==========================================
// 1. ИНТЕРФЕЙСЫ (ОПИСАНИЕ ДАННЫХ)
// ==========================================

export interface RawApiProfile {
    account_id: number;
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    countrycode: string | null;
    friends: Array<{ account_id: number; friend_since: string }>;
    last_team_avg_badge: string | null;
    last_updated: string;
    matches_played_last_30d: number;
    personaname: string;
    profileurl: string;
    realname: string | null;
}

export interface Profile {
    account_id: string | number;
    personaname: string;
    avatarfull: string;
    countrycode: string | null;
    matches_played_last_30d: string | number;
    profileurl: string;
}