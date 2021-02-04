import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { event } from './types';
import { useHistory } from 'react-router-dom';


export default function Events() {
    const [list, setList] = useState<{ id: string, event: event; }[]>();
    const history = useHistory();

    useEffect(() => {
        const collection = firebase.firestore().collection('events');

        return collection.onSnapshot((snapshot) => {
            const r = snapshot.docs.map(d => {
                return {
                    id: d.id,
                    event: d.data() as event
                };
            });
            setList(r);
        });
    });

    return (
        <div>
            <div className="information-box">Log in to host your own Big Bang!</div>
            <table>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Fandom</th>
                        <th>Information</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {list && list.map(e => (
                        <tr key={e.id} onClick={() => {
                            history.push('/event/' + e.id);
                            history.go(0);
                        }} >
                            <td>{e.event.title}</td>
                            <td>{e.event.fandom}</td>
                            <td>{e.event.information}</td>
                            <td>{e.event.startDate.toDate().toLocaleDateString()}</td>
                            <td>{e.event.endDate.toDate().toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
