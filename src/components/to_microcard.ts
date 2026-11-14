import { RawApiResponse, microcard } from "./types";

function toMicrocards(raw: RawApiResponse[]): microcard[] {
    return raw.map(toMicrocard);
}

function toMicrocard(raw: RawApiResponse): microcard {
    return {
        account_id: raw.account_id,
        personaname: raw.personaname,
        avatarfull: raw.avatarfull,
        countrycode: raw.countrycode,
        matches_played_last_30d: raw.matches_played_last_30d,
        profileurl: raw.profileurl,
    };
}

// Если нужно обработать массив

export default toMicrocards;