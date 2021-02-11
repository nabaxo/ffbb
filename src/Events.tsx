import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Event } from './types';
import { useHistory } from 'react-router-dom';


export default function Events() {
    const [list, setList] = useState<{ id: string, event: Event; }[]>();
    const history = useHistory();

    useEffect(() => {
        const collection = firebase.firestore().collection('events');

        return collection.onSnapshot((snapshot) => {
            const r = snapshot.docs.map(d => {
                return {
                    id: d.id,
                    event: d.data() as Event
                };
            });
            setList(r);
        });
    }, []);

    return (
        <div>
            <a className="submit-btn" href={'/create-event'} >Create Bang!</a>
            <table className="event-list">
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Fandom</th>
                        <th>Summary</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {list && list.map(e => (
                        e.event.public &&
                        <tr className="event-link" key={e.id} onClick={() => {
                            history.push('/event/' + e.id);
                            history.go(0);
                        }} >
                            <td>{e.event.title}</td>
                            <td>{e.event.fandom}</td>
                            <td>{e.event.summary}</td>
                            <td>{e.event.startDate.toDate().toLocaleDateString()}</td>
                            <td>{e.event.endDate.toDate().toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
