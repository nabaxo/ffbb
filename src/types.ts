import firebase from 'firebase/app';

export interface Entry {
    uid: string,
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
    modMessage?: string;
    summary: string,
    tier: number;
    isPublished: boolean;
}

export type Pair = {
    a: string;
    b: string;
};

export interface Bang {
    title: string;
    fandom: string;
    summary: string;
    information: string;
    startDate: firebase.firestore.Timestamp;
    endDate: firebase.firestore.Timestamp;
    creatorId: string;
    creatorName: string;
    public: boolean;
    moderators: string[];
    isOpen: boolean;
}

export interface User {
    uid: string;
    displayName: string;
    email: string;
    joinedEvents: string[];
    createdEvents: string[];
}
