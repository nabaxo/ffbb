import React, { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { Entry, Bang } from './types';
import RequestEntry from './RequestEntry';
import { useParams } from 'react-router-dom';

interface ParamTypes {
    id: string;
}

interface listEntry {
    id: string;
    entry: Entry;
    modMessage?: string;
}

export default function Summaries() {
    const { id } = useParams<ParamTypes>();
    const [event, setEvent] = useState<Bang>();
    const [rawList, setRawList] = useState<listEntry[]>();
    const [filteredList, setFilteredList] = useState<listEntry[]>();
    const uid = firebase.auth().currentUser?.uid;
    const isModerator = event && uid && event.moderators.includes(uid);

    // Following is needed to force update when getting the modMessages separately
    const [, setForceUpdateHack] = useState<string>();

    useEffect(() => {
        const collection = firebase.firestore().collection('events').doc(id).collection('requests');
        firebase.firestore().collection('events').doc(id).get().then((doc) => {
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
            return collection.where('isPublished', '==', true).onSnapshot((snapshot) => {
                setRawList(snapshot.docs.map(d => {
                    return ({
                        id: d.id,
                        entry: d.data() as Entry
                    });
                }));
            });
        }
    }, [id, isModerator]);

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

    return (
        <div className="entry-list">
            {event && <>
                <div className="information-box">{event.information}</div>
                <span className="btn-row">
                    <input className="filter" type="text" placeholder="Filter..." onChange={handleFilter} />
                    <a className="btn btn-submit" href={'/event/' + id + '/submit'} >Submit New!</a>
                </span>
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
                            eventId={id}
                        />)}
                    </tbody>
                </table>
            </>}
        </div>
    );
}
