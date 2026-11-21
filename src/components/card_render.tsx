import useAPIprofile from './API_request';
import generateMicrocards from './Card_draw'; 
import toMicrocards from './API_workers/API_steaminfo';
type MicrocardProps = { accountId: string };

function Microcard({ accountId }: MicrocardProps) {
  const { players, loading, error } = useAPIprofile(accountId);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (players.length === 0) return null;

  return <div className="cards">{generateMicrocards(toMicrocards(players))}</div>;
}
export default Microcard;