import React, { ChangeEvent, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { User } from './types';
import { FaCrown } from 'react-icons/fa';

interface Moderator {
    uid: string;
    displayName: string;
    email: string;
}

interface IProps {
    creator: string;
    mods: string[];
    addModerator: (uid: string) => void;
    removeModerator: (uid: string) => void;
}

export default function ManageModerators({ creator, mods, addModerator, removeModerator }: IProps) {
    const [moderatorList, setModeratorList] = useState<Moderator[]>();
    const [newMod, setNewMod] = useState<string>('');

    useEffect(() => {
        const collection = firebase.firestore().collection('users').where('uid', 'in', mods);

        const unsubscribe = collection.onSnapshot((snapshot) => {
            setModeratorList(snapshot.docs.map(d => {
                const u = d.data() as User;
                const m: Moderator = {
                    uid: u.uid,
                    displayName: u.displayName,
                    email: u.email
                };

                return m;
            }));
        });

        return unsubscribe;

    }, [mods]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const collection = firebase.firestore().collection('users');

        collection.where('email', '==', newMod).onSnapshot(d => {
            if (!d.empty) {
                d.docs.forEach(u => {
                    const user = u.data() as User;
                    addModerator(user.uid);
                    setNewMod('');
                });
            } else {
                alert("Incorrect email.");
            }
        });
    }

    function handleChange(event: ChangeEvent<any>) {
        const target = event.target;
        setNewMod(target.value);
    }

    return (
        <details className="moderator-box">
            <summary>Manage Moderators</summary>
            {moderatorList && (
                <table>
                    <tbody>
                        {moderatorList.map(m => {
                            return (
                                <tr key={m.uid}>
                                    <td>{m.displayName}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {m.uid !== creator ?
                                            <button className="btn btn-delete" onClick={() => removeModerator(m.uid)}>Remove</button>
                                            :
                                            <span> <FaCrown /></span>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <form action="" onSubmit={(event) => handleSubmit(event)}>
                <fieldset>
                    <legend>Add moderator</legend>
                    <span className="row add-mod-row">
                        <input className="mod-input" type="email" placeholder="email" name="email" value={newMod} onChange={handleChange} />
                        <button className="btn btn-full-height btn-approve" type="submit">Add</button>
                    </span>
                </fieldset>
            </form>
        </details>
    );
}
