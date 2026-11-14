// ==========================================
// 1. ИНТЕРФЕЙСЫ (ОПИСАНИЕ ДАННЫХ)
// ==========================================

// "Сырые" данные из API (то, что приходит в запросе)

export interface RawApiResponse {
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

export interface microcard {
    account_id: string | number;
    personaname: string;
    avatarfull: string;
    countrycode: string | null;
    matches_played_last_30d: string | number;
    profileurl: string;
}

/*
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();


<section className="player-tool" aria-labelledby="player-tool-title">
            <div className="player-tool-heading">
                <p className="player-tool-kicker">DEADLOCK API</p>
                <h2 id="player-tool-title">Данные игрока</h2>
            </div>

            <form className="player-form" onSubmit={handleSubmit}>
                <label htmlFor="steam-account-id">Steam account ID</label>
                <div className="player-form-controls">
                    <input
                        id="steam-account-id"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Например, 123456789"
                        value={initialAccountId}
                        onChange={(e) => setAccountId(e.target.value)}
                    />
                    <button type="submit" disabled={!accountId.trim()}>
                        Загрузить
                    </button>
                </div>
            </form>
        </section>*/