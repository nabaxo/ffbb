export interface entry {
    id: number,
    requestBeta: boolean,
    ageRating: 'G-T' | 'E-M',
    authorRequestAge: boolean;
    archiveWarnings:
    "creator chose not to use archive warnings" |
    "graphic depictions of violence" |
    "major character death" |
    "no archive warnings apply" |
    "rape/non-con" |
    "underage";
    characters: string[];
    pairings: [pair];
    tags: string[];
    authorWarnings: string[];
    summary: string,
    tier: number;
}

export type pair = {
    a: string;
    b: string;
};
