import { RawApiProfile, Topbarprofile } from "../API_types";

function toTopbars(raw: RawApiProfile[]): Topbarprofile[] {
    return raw.map(toTopbar);
}

function toTopbar(raw: RawApiProfile): Topbarprofile {
    return {
        account_id: raw.account_id,
        personaname: raw.personaname,
        avatarfull: raw.avatarfull,
    };
}

export default toTopbars;