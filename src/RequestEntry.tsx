import React, { Fragment, useEffect, useState } from 'react';
import { Entry, User } from './types';
import firebase from 'firebase/app';

interface IProps {
    entryId: string;
    entry: Entry;
    eventId: string;
    isModerator?: boolean;
}

export default function RequestEntry({ entryId, entry, isModerator, eventId }: IProps) {
    const collection = firebase.firestore().collection('events').doc(eventId).collection('requests');
    const [requestUser, setRequestUser] = useState<User>();

    function approve() {
        const e = entry;
        e.isPublished = !e.isPublished;
        collection.doc(entryId).set(e);
    }

    function removeEntry() {
        collection.doc(entryId).delete();
    }

    function confirmDialog() {
        if (window.confirm('Are you sure you want to delete this request?\nThis cannot be undone!')) {
            removeEntry();
        }
    }

    useEffect(() => {
        const docRef = firebase.firestore().collection('users').doc(entry.uid);

        docRef.get().then((doc) => {
            setRequestUser(doc.data() as User);
        });

    }, [entry.uid]);

    return (
        <>
            {(isModerator || entry.isPublished) && (
                <tr className={entry.isPublished ? '' : 'not-approved'}>
                    <td>{entryId.substring(0, 5)}</td>
                    <td>{entry.requestBeta ? 'Yes' : 'No'}</td>
                    <td>{entry.ageRating}</td>
                    <td>{entry.archiveWarnings?.join(', ')}</td>
                    <td>{entry.characters.join(', ')}</td>
                    <td>{entry.pairings.map(p => { return [p.a, p.b].join(' x '); }).map((pair, i) => {
                        return (
                            <Fragment key={i}>
                                {pair}
                                {i < entry.pairings.length - 1 && <br />}
                            </Fragment>
                        );
                    })}</td>
                    <td>{entry.tags.join(', ')}</td>
                    <td><p>
                        {entry.summary}
                    </p></td>
                    <td>{entry.tier}</td>
                    {isModerator && <td>{entry.authorWarnings}</td>}
                </tr>)}
            {isModerator && (
                <tr className="mod-bar">
                    <td><button className={entry.isPublished ? 'btn btn-warning' : 'btn btn-approve'} onClick={approve} >{entry.isPublished ? 'Deny' : 'Approve'}</button></td>
                    <td><button className="btn btn-delete" onClick={confirmDialog}>Delete</button></td>
                    <td colSpan={8}>Submitted by: {requestUser && requestUser.displayName}</td>
                </tr>
            )}
        </>
    );
}
