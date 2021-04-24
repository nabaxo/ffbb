import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Bang } from './types';
import { useHistory } from 'react-router-dom';


export default function EventList() {
    const [list, setList] = useState<{ id: string, event: Bang; }[]>();
    const history = useHistory();

    useEffect(() => {
        const collection = firebase.firestore().collection('events');

        return collection.where('public', '==', true).onSnapshot((snapshot) => {
            const r = snapshot.docs.map(d => {
                return {
                    id: d.id,
                    event: d.data() as Bang
                };
            });
            setList(r);
        });
    }, []);

    return (
        <div className="event-list">
            <div className="column information-box">
                <a className="btn btn-submit" href={'/create-event'} >Create Bang!</a>
            </div>
            <table>
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
