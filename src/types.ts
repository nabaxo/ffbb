export interface entry {
    id: number,
    requestBeta: boolean,
    ageRating: 'G-T' | 'E-M',
    authorRequestAge: boolean;
    archiveWarnings:
    "NO WARNINGS" |
    "NO INDICATION" |
    "GRAPHIC VIOLENCE" |
    "MAJOR DEATH" |
    "RAPE" |
    "UNDERAGE";
    characters: string[];
    pairings: [[string, string]];
    tags: string[];
    authorWarnings: string[];
    summary: string,
    tier: number;
}
