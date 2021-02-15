import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Bang, User } from './types';

export default function Settings() {
    const userId = firebase.auth().currentUser?.uid;
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
            const jBangs: {
                bid: string,
                bang: Bang;
            }[] = [];

            eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.createdEvents)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        cBangs.push({
                            bid: doc.id,
                            bang: doc.data() as Bang
                        });
                    });
                }).then(() => {
                    setCreatedBangs(cBangs);
                });
            eventsCollection.where(firebase.firestore.FieldPath.documentId(), 'in', user.joinedEvents)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        jBangs.push({
                            bid: doc.id,
                            bang: doc.data() as Bang
                        });
                    });
                }).then(() => {
                    setJoinedBangs(jBangs);
                });
        }
    }, [user]);

    useEffect(() => {
        const userDocRef = firebase.firestore().collection('users').doc(userId);

        userDocRef.get().then((doc) => {
            setUser(doc.data() as User);
        });
    }, [userId]);

    return (
        <div>
            <h4>My events</h4>
            {createdBangs && createdBangs.length !== 0 ?
                <div>
                    <ul>
                        {createdBangs.map(b => {
                            return <li key={b.bid}><a href={'event/' + b.bid}>{b.bang.title}</a></li>;
                        })}
                    </ul>
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
