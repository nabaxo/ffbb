import React, { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { entry } from './types';
import ListEntry from './ListEntry';

export default function Summaries() {
    const [rawList, setRawList] = useState<{ id: string, entry: entry; }[]>();
    const [filteredList, setFilteredList] = useState<{ id: string, entry: entry; }[]>();

    useEffect(() => {
        const collection = firebase.firestore().collection('requests');

        return collection.onSnapshot((snapshot) => {
            const r = snapshot.docs.map(d => {
                return {
                    id: d.id,
                    entry: d.data() as entry
                };
            });
            setRawList(r);
        });
    }, []);

    function handleFilter(event: ChangeEvent<HTMLInputElement>) {
        if (rawList) {
            const value = event.target.value.toLowerCase();

            const filterList = rawList.filter(i => (
                i.id.toLowerCase().includes(value) ||
                i.entry.summary.toLowerCase().includes(value) ||
                i.entry.characters.join(' ').toLowerCase().includes(value) ||
                i.entry.tags.join(' ').toLowerCase().includes(value)
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
            <input className="filter" type="text" placeholder="Filter..." onChange={handleFilter} />
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
                    {list && list.map(e => <ListEntry key={e.id} id={e.id} entry={e.entry} />)}
                </tbody>
            </table>
        </div>
    );
}
