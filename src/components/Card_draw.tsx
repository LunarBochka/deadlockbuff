// ==========================================
// 3. ФУНКЦИЯ ГЕНЕРАЦИИ HTML (ВМЕСТО ФАЙЛА)
// ==========================================

/*
 * Эта функция берёт массив microcard и превращает его в HTML-строку.
 * Её можно вернуть пользователю через веб-сервер или просто вывести в консоль.
 *
 * @param cards - Массив отформатированных карточек
 * @returns Готовая HTML-строка (целая веб-страница)
*/
import type { microcard } from './types';

function generateMicrocards(cards: microcard[]) {
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