import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Bang } from './types';

export default function Settings() {
    const [userBangs, setUserBangs] = useState<{
        bid: string,
        bang: Bang;
    }[]>();
    const creatorId = firebase.auth().currentUser?.uid;

    useEffect(() => {
        const eventsCollection = firebase.firestore().collection('events');
        const bangs: {
            bid: string,
            bang: Bang;
        }[] = [];

        eventsCollection.where('creatorId', '==', creatorId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    bangs.push({
                        bid: doc.id,
                        bang: doc.data() as Bang
                    });
                });
            }).then(() => {
                setUserBangs(bangs);
            });
    }, [creatorId]);

    return (
        <div>
            <h4>My events</h4>
            {userBangs && userBangs.length !== 0 ?
                <div>
                    <ul>
                        {userBangs.map(b => {
                            return <li key={b.bid}><a href={'event/' + b.bid}>{b.bang.title}</a></li>;
                        })}
                    </ul>
                </div>
                :
                <div>You haven't created any events!</div>
            }
        </div>
    );
}
