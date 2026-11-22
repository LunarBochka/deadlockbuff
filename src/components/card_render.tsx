import useAPIprofile from './API_request';
import generateMicrocards from './Card_draw'; 
import toMicrocards from './API_workers/API_steaminfo';
import PlayerStatsPanel from './PlayerStatsPanel';
type MicrocardProps = { accountId: string };

function Microcard({ accountId }: MicrocardProps) {
  const { players, loading, error } = useAPIprofile(accountId);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (players.length === 0) return null;

  const cards = toMicrocards(players);

  return (
    <div className="cards">
      {generateMicrocards(cards)}
      {cards.map((card) => (
        <PlayerStatsPanel key={card.account_id} accountId={String(card.account_id)} />
      ))}
    </div>
  );
}
export default Microcard;