import { RawApiProfile, Profile } from "../API_types";

function toMicrocards(raw: RawApiProfile[]): Profile[] {
    return raw.map(toMicrocard);
}

function toMicrocard(raw: RawApiProfile): Profile {
    return {
        account_id: raw.account_id,
        personaname: raw.personaname,
        avatarfull: raw.avatarfull,
        countrycode: raw.countrycode,
        matches_played_last_30d: raw.matches_played_last_30d,
        profileurl: raw.profileurl,
    };
}

export default toMicrocards;