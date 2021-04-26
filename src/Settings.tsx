import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Bang, User } from './types';

export default function Settings() {
    const userId = localStorage.getItem('uid');
    const [user, setUser] = useState<User>();
    const [createdBangs, setCreatedBangs] = useState<{
        bid: string,
        bang: Bang;
    }[]>();
    const [joinedBangs, setJoinedBangs] = useState<{
        bid: string,
        bang: Bang;
    }[]>();

    useEffect(() => {
        if (user) {
            const eventsCollection = firebase.firestore().collection('events');
            const cBangs: {
                bid: string,
                bang: Bang;
            }[] = [];

            return eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.createdEvents)
                .onSnapshot((snapshot) => {
                    snapshot.forEach((doc) => {
                        cBangs.push({
                            bid: doc.id,
                            bang: doc.data() as Bang
                        });
                    });
                    setCreatedBangs(cBangs);
                });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const eventsCollection = firebase.firestore().collection('events');
            const jBangs: {
                bid: string,
                bang: Bang;
            }[] = [];

            return eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.joinedEvents)
                .onSnapshot((snapshot) => {
                    snapshot.forEach((doc) => {
                        jBangs.push({
                            bid: doc.id,
                            bang: doc.data() as Bang
                        });
                    });
                    setJoinedBangs(jBangs);
                });
        }
    }, [user]);

    useEffect(() => {
        if (userId) {
            const userDocRef = firebase.firestore().collection('users').doc(userId);

            return userDocRef.onSnapshot((doc) => {
                setUser(doc.data() as User);
            });
        }
    }, [userId]);

    function deleteEvent(eventId: string) {
        if (window.confirm('This cannot be undone! Are you sure!?')) {
            const collection = firebase.firestore().collection('events');

            collection.doc(eventId).delete();
        }
    }

    return (
        <div className="column" >
            <h3>Hello {user?.displayName}</h3>
            <h4>My events</h4>
            {createdBangs && createdBangs.length !== 0 ?
                <div>
                    <table>
                        <tbody>
                            {createdBangs.map(b => {
                                return (
                                    <tr key={b.bid}>
                                        <td><a href={'event/' + b.bid}>{b.bang.title}</a></td>
                                        <td><button className="btn btn-delete" onClick={() => deleteEvent(b.bid)}>Delete event</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                :
                <div>You haven't created any events!</div>
            }
            <h4>Joined events</h4>
            {joinedBangs && joinedBangs.length !== 0 ?
                <div>
                    <ul>
                        {joinedBangs.map(j => {
                            return <li key={j.bid}><a href={'event/' + j.bid}>{j.bang.title}</a></li>;
                        })}
                    </ul>
                </div>
                :
                <div>You haven't joined any events!</div>
            }
        </div>
    );
}
