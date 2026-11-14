// Сюда будут приходить данные из поисковой строки
/*import useMicrocard from "./API_request";
import generateMicrocardsHTML from "./Card_draw";
import toMicrocards from "./to_microcard";

function Card_render(query: string) {
  const { players } = useMicrocard(query);
  const Micro = toMicrocards(players);
  const result = generateMicrocardsHTML(Micro);
  console.log(result);
  return result
}

export default Card_render; */
import useMicrocard from './API_request';
import generateMicrocards from './Card_draw'; 
import toMicrocards from './to_microcard';
type MicrocardProps = { accountId: string };

function Microcard({ accountId }: MicrocardProps) {
  const { players, loading, error } = useMicrocard(accountId);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (players.length === 0) return null;

  return <div className="cards">{generateMicrocards(toMicrocards(players))}</div>;
}
export default Microcard;