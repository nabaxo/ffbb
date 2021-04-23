import { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { Entry, Bang } from './types';
import RequestEntry from './RequestEntry';
import { useParams } from 'react-router-dom';
import DetailsOverlay from './DetailsOverlay';
import ManageModerators from './ManageModeratosr';

interface ParamTypes {
    id: string;
}

interface listEntry {
    id: string;
    entry: Entry;
    modMessage?: string;
}

export default function Event() {
    const { id: bid } = useParams<ParamTypes>();
    const [event, setEvent] = useState<Bang>();
    const [ageConfirm, setAgeConfirm] = useState<boolean>(false);
    const [rawList, setRawList] = useState<listEntry[]>();
    const [filteredList, setFilteredList] = useState<listEntry[]>();
    const uid = firebase.auth().currentUser?.uid;
    const [isModerator, setIsModerator] = useState<boolean>();
    const [details, setDetails] = useState<string>();

    // Following is needed to force update when getting the modMessages separately
    const [, setForceUpdateHack] = useState<string>();

    if (details) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }

    useEffect(() => {
        const collection = firebase.firestore().collection('events').doc(bid).collection('requests');
        firebase.firestore().collection('events').doc(bid).onSnapshot((doc) => {
            setEvent(doc.data() as Bang);
        });

        if (isModerator) {
            return collection.onSnapshot((snapshot) => {
                setRawList(snapshot.docs.map(d => {
                    const e: listEntry = {
                        id: d.id,
                        entry: d.data() as Entry,
                    };

                    collection.doc(d.id).collection('private').doc('private').get().then((m) => {
                        setForceUpdateHack(m.get('modMessage') as string);
                        e.modMessage = m.get('modMessage') as string;
                    });

                    return e;
                }));
            });
        } else {
            if (ageConfirm) {
                return collection.where('isPublished', '==', true).onSnapshot((snapshot) => {
                    setRawList(snapshot.docs.map(d => {
                        return ({
                            id: d.id,
                            entry: d.data() as Entry
                        });
                    }));
                });
            } else {
                return collection.where('isPublished', '==', true).where('ageRating', '==', 'G-T').onSnapshot((snapshot) => {
                    setRawList(snapshot.docs.map(d => {
                        return ({
                            id: d.id,
                            entry: d.data() as Entry
                        });
                    }));
                });
            }
        }
    }, [bid, isModerator, ageConfirm]);

    useEffect(() => {
        if (event && uid && event.moderators.includes(uid)) {
            setIsModerator(true);
        } else {
            setIsModerator(false);
        }
    }, [uid, event]);

    function handleFilter(event: ChangeEvent<HTMLInputElement>) {
        if (rawList) {
            const value = event.target.value.toLowerCase();

            const filterList = rawList.filter(i => (
                i.id.toLowerCase().includes(value) ||
                i.entry.summary.toLowerCase().includes(value) ||
                i.entry.characters.join(' ').toLowerCase().includes(value) ||
                i.entry.tags.join(' ').toLowerCase().includes(value) ||
                i.entry.archiveWarnings?.join(' ').toLowerCase().includes(value) ||
                i.modMessage?.toLowerCase().includes(value)
            ));
            if (value === '') {
                setFilteredList(undefined);
            } else {
                setFilteredList(filterList);
            }
        }
    }

    const list = (() => {
        if (filteredList) {
            return filteredList;
        }
        else if (rawList) {
            return rawList;
        }
    })();

    function handleAgeCheck(event: ChangeEvent<any>) {
        setAgeConfirm(event.target.checked);
    }

    function addModerator(mod: string) {
        const collection = firebase.firestore().collection('events').doc(bid);

        if (event && !event.moderators.includes(mod)) {
            event.moderators.push(mod);
            const mods = [...event.moderators];
            setEvent({ ...event, moderators: mods });
            collection.set(event, { merge: true });
        }
    }

    function removeModerator(mod: string) {
        const collection = firebase.firestore().collection('events').doc(bid);

        if (event && event.creatorId !== mod) {
            event.moderators.splice(event.moderators.indexOf(mod), 1);
            const mods = [...event.moderators];
            setEvent({ ...event, moderators: mods });
            collection.set(event, { merge: true });
        }
    }

    return (
        <div className="entry-list">
            {event && <>
                <div className="column information-box">
                    {details && <DetailsOverlay text={details} setDetails={setDetails} />}
                    <div className="event-info">{event.information}</div>
                    {isModerator && (
                        <ManageModerators
                            creator={event.creatorId}
                            mods={event.moderators}
                            addModerator={addModerator}
                            removeModerator={removeModerator}
                        />
                    )}
                    <span className="btn-row">
                        <input className="filter" type="text" placeholder="Filter..." onChange={handleFilter} />
                        <a className="btn btn-submit" href={'/event/' + bid + '/submit'} >Submit New!</a>
                    </span>
                    {!isModerator && (
                        <fieldset>
                            <input
                                type="checkbox"
                                name="age-gate"
                                id="age-gate"
                                checked={ageConfirm}
                                onChange={handleAgeCheck}
                            />
                            <label htmlFor="age-gate">&nbsp;Show 18+ fics</label>
                        </fieldset>
                    )}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Wants a beta</th>
                            <th>Rating</th>
                            <th>Archive Warnings</th>
                            <th>Characters</th>
                            <th>Pairings</th>
                            <th>Tags</th>
                            <th>Summary</th>
                            <th>Tier</th>
                            {isModerator && <th>Message to mods</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {list && list.map(e => <RequestEntry
                            key={e.id}
                            entryId={e.id}
                            entry={e.entry}
                            modMessage={isModerator ? e.modMessage : undefined}
                            isModerator={isModerator ? true : false}
                            eventId={bid}
                            setDetails={setDetails}
                        />)}
                    </tbody>
                </table>
            </>}
        </div>
    );
}
