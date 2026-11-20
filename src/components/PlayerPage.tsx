import Microcard from './card_render';

type PlayerPageProps = {
  accountId: string;
};

function PlayerPage({ accountId }: PlayerPageProps) {
  return (
    <section className="player-page" id="player" aria-label="Страница игрока">
      <Microcard accountId={accountId} />
    </section>
  );
}

export default PlayerPage;
