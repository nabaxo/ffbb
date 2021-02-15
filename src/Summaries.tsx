import React, { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { Entry, Bang } from './types';
import RequestEntry from './RequestEntry';
import { useParams } from 'react-router-dom';

interface ParamTypes {
    id: string;
}

export default function Summaries() {
    const { id } = useParams<ParamTypes>();
    const [event, setEvent] = useState<Bang>();
    const [rawList, setRawList] = useState<{ id: string, entry: Entry; }[]>();
    const [filteredList, setFilteredList] = useState<{ id: string, entry: Entry; }[]>();

    useEffect(() => {
        const collection = firebase.firestore().collection('events').doc(id).collection('requests');
        firebase.firestore().collection('events').doc(id).get().then((doc) => {
            setEvent(doc.data() as Bang);
        });

        return collection.onSnapshot((snapshot) => {
            setRawList(snapshot.docs.map(d => ({
                id: d.id,
                entry: d.data() as Entry
            })));
        });
    }, [id]);

    function handleFilter(event: ChangeEvent<HTMLInputElement>) {
        if (rawList) {
            const value = event.target.value.toLowerCase();

            const filterList = rawList.filter(i => (
                i.id.toLowerCase().includes(value) ||
                i.entry.summary.toLowerCase().includes(value) ||
                i.entry.characters.join(' ').toLowerCase().includes(value) ||
                i.entry.tags.join(' ').toLowerCase().includes(value) ||
                i.entry.archiveWarnings?.join(' ').toLowerCase().includes(value)
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
                            <th>Would you like a beta?</th>
                            <th>Rating</th>
                            <th>Archive Warnings</th>
                            <th>Characters</th>
                            <th>Pairings</th>
                            <th>Tags</th>
                            <th>Summary</th>
                            <th>Tier</th>
                            <th>Anything you'd like us to know?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list && list.map(e => <RequestEntry
                            key={e.id}
                            entryId={e.id}
                            entry={e.entry}
                            moderators={event?.moderators}
                            eventId={id}
                        />)}
                    </tbody>
                </table>
            </>}
        </div>
    );
}
