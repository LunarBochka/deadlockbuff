import type { Profile } from './API_types';

function generateMicrocards(cards: Profile[]) {
  return cards.map((card) => (
    <div className="card" key={card.account_id}>
      <img
        src={card.avatarfull}
        alt={`Аватар ${card.personaname}`}
        className="avatar"
      />
      <div className="info">
        <h2 className="name">{card.personaname}</h2>
        <p><b>ID:</b> {card.account_id}</p>
        <p><b>Страна:</b> {card.countrycode ?? 'Неизвестно'}</p>
        <p><b>Матчей за 30 дней:</b> {card.matches_played_last_30d}</p>
        <a
          href={card.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          Открыть профиль
        </a>
      </div>
    </div>
  ));
}

export default generateMicrocards;