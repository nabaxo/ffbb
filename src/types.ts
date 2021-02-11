import firebase from 'firebase/app';

export interface Entry {
    // id: number,
    requestBeta: boolean,
    ageRating: 'G-T' | 'E-M',
    authorRequestAge: boolean;
    archiveWarnings?:
    (
        "creator chose not to use archive warnings" |
        "graphic depictions of violence" |
        "major character death" |
        "no archive warnings apply" |
        "rape/non-con" |
        "underage"
    )[];
    characters: string[];
    pairings: Pair[];
    tags: string[];
    authorWarnings: string;
    summary: string,
    tier: number;
    isPublished: boolean;
}

export type Pair = {
    a: string;
    b: string;
};

export interface Event {
    title: string;
    fandom: string;
    summary: string;
    information: string;
    startDate: firebase.firestore.Timestamp;
    endDate: firebase.firestore.Timestamp;
    creatorId: string;
    creatorName: string;
    public: boolean;
}

export interface User {
    uid: string;
    displayName: string;
    createdEvents?: string[];
    joinedEvents?: string[];
}
