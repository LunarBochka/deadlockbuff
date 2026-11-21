import toTopbars from './API_workers/API_topbar';
import useAPIprofile from './API_request';

const IDs: string[] = ["1170349783", "1794460896", "78273817"];

function useTopbarmicroprofiles() {
    const accountId = IDs.join(',');
    const { players, loading, error } = useAPIprofile(accountId);
    const player = toTopbars(players);
    console.log('after toTopbars:', toTopbars(players));
  const byId = new Map(
    player.map((p) => [String(p.account_id), p])
    );
  const bratva = IDs.map((id) => byId.get(String(id)) ?? null)  
    return {bratva, loading, error, ids: IDs}
}

export default useTopbarmicroprofiles;
