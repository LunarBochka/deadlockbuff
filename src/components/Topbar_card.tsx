import { Topbarprofile } from "./API_types";

type Props = {
  player: Topbarprofile | null; 
  accountId: string;             
  onSearch: (id: string) => void;
};

function TopbarPlayerLink({ player, accountId, onSearch }: Props) {
  return (
    <button
      className="topbar-link-placeholder topbar-player-link"
      type="button"
      aria-label={`Открыть игрока ${player?.personaname ?? accountId}`}
      onClick={() => onSearch(accountId)}
    >
      {player ? (
        <>
          <img
            src={player.avatarfull}
            alt={player.personaname}
            className="topbar-player-avatar"
          />
          <span className="topbar-player-name">{player.personaname}</span>
        </>
      ) : (
        <span className="topbar-player-id">{accountId}</span>
      )}
    </button>
  );
}

export default TopbarPlayerLink;