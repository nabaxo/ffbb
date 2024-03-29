import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Bang, User } from './types';

interface BangEntry {
    bid: string;
    bang: Bang;
}

export default function Settings() {
    const userId = localStorage.getItem('uid');
    const [user, setUser] = useState<User>();
    const [createdBangs, setCreatedBangs] = useState<BangEntry[]>();
    const [joinedBangs, setJoinedBangs] = useState<BangEntry[]>();

    useEffect(() => {
        if (user) {
            if (user.createdEvents.length) {
                const eventsCollection = firebase.firestore().collection('events');

                const unsubscribe = eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.createdEvents)
                    .onSnapshot((snapshot) => {
                        setCreatedBangs(snapshot.docs.map(doc => {
                            const b: BangEntry = {
                                bid: doc.id,
                                bang: doc.data() as Bang
                            };
                            return b;
                        }));
                    });

                return unsubscribe;
            }
            else if (!user.createdEvents.length) {
                setCreatedBangs(undefined);
            }
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            if (user.joinedEvents.length) {
                const eventsCollection = firebase.firestore().collection('events');

                const unsubscribe = eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.joinedEvents)
                    .onSnapshot((snapshot) => {
                        setJoinedBangs(snapshot.docs.map(doc => {
                            const b: BangEntry = {
                                bid: doc.id,
                                bang: doc.data() as Bang
                            };
                            return b;
                        }));
                    });

                return unsubscribe;
            }
            else if (!user.joinedEvents.length) {
                setJoinedBangs(undefined);
            }
        }
    }, [user]);

    useEffect(() => {
        if (userId) {
            const userDocRef = firebase.firestore().collection('users').doc(userId);

            const unsubscribe = userDocRef.onSnapshot((doc) => {
                setUser(doc.data() as User);
            });

            return unsubscribe;
        }
    }, [userId]);

    function deleteEvent(eventId: string) {
        if (window.confirm('This cannot be undone! Are you sure!?')) {
            const collection = firebase.firestore().collection('events');

            collection.doc(eventId).delete();
        }
    }

    function leaveEvent(eventId: string) {
        if (window.confirm('Are you sure?')) {
            if (userId && user) {
                const userDocRef = firebase.firestore().collection('users').doc(userId);

                user.joinedEvents.splice(user.joinedEvents.indexOf(eventId), 1);
                const jbs = [...user.joinedEvents];
                setUser({ ...user, joinedEvents: jbs });
                userDocRef.set(user, { merge: true });
            }
        }
    }

    return (
        <div className="column" >
            <h3>Hello {user?.displayName}</h3>
            <h4>My events</h4>
            {createdBangs && createdBangs.length !== 0 ?
                <table className="settings-table">
                    <tbody>
                        {createdBangs.map(b => {
                            return (
                                <tr key={'created_' + b.bid}>
                                    <td><a href={'event/' + b.bid}>{b.bang.title}</a></td>
                                    <td><button className="btn btn-delete" onClick={() => deleteEvent(b.bid)}>Delete event</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                :
                <div>You haven't created any events!</div>
            }
            <h4>Joined events</h4>
            {joinedBangs && joinedBangs.length !== 0 ?
                <table className="settings-table">
                    <tbody>
                        {joinedBangs.map(j => {
                            return (
                                <tr key={'joined_' + j.bid}>
                                    <td><a href={'event/' + j.bid}>{j.bang.title}</a></td>
                                    <td><button className="btn btn-warning" onClick={() => leaveEvent(j.bid)}>Leave event</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                :
                <div>You haven't joined any events!</div>
            }
        </div>
    );
}
