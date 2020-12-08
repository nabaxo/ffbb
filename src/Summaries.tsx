import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { entry } from './types';
import ListEntry from './ListEntry';

export default function Summaries() {
    const [list, setList] = useState<{ id: string, entry: entry; }[]>();

    useEffect(() => {
        const collection = firebase.firestore().collection('requests');

        return collection.onSnapshot((snapshot) => {
            const r = snapshot.docs.map(d => {
                return {
                    id: d.id,
                    entry: d.data() as entry
                };
            });
            setList(r);
        });
    }, []);

    return list ?
        <div>
            <input type="text" placeholder="Filter" />
            <table>
                <thead>
                    <tr>
                        <th>#</th>
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
                    {list.map(e => <ListEntry key={e.id} entry={e.entry} />)}
                </tbody>
            </table>
        </div>
        : <div></div>;
}
