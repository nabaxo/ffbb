import { Fragment as p, useEffect, useState } from 'react';
import { Entry, User } from './types';
import firebase from 'firebase/app';

interface IProps {
    entryId: string;
    entry: Entry;
    modMessage?: string;
    bangId: string;
    isModerator?: boolean;
    setDetails: (text: string) => void;
}

export default function RequestEntry({ entryId, entry, modMessage, isModerator, bangId, setDetails }: IProps) {
    const collection = firebase.firestore().collection('events').doc(bangId).collection('requests');
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
        if (entry.uid && isModerator) {
            const docRef = firebase.firestore().collection('users').doc(entry.uid);

            docRef.get().then((doc) => {
                setRequestUser(doc.data() as User);
            });
        }

    }, [entry.uid, isModerator]);

    function addLineBreaks(t: string) {
        const text = t.replaceAll('\\n', '\n');
        if (text.length > 200) {
            return <p className="pointer preserve-whitespace" onClick={() => setDetails(text)}>{text.slice(0, 200).trimEnd() + '... '}<em className="show-more">(show more)</em></p>;
        }
        return <p className="preserve-whitespace">{text}</p>;
    }

    return (
        <>
            {(isModerator || entry.isPublished || entry.uid === localStorage.getItem('uid')) && (
                <tr className={entry.isPublished ? '' : 'not-approved'}>
                    <td><code>{entryId.substring(0, 3).toUpperCase()}</code></td>
                    <td>{entry.requestBeta ? 'Yes' : 'No'}</td>
                    <td>{entry.ageRating}</td>
                    <td>{entry.archiveWarnings?.join(', ')}</td>
                    <td>{entry.characters.join(', ')}</td>
                    <td>{entry.pairings && entry.pairings.map(p => { return [p.a, p.b].join(' x '); }).map((pair, i) => {
                        return (
                            <p key={i}>
                                {pair}
                            </p>
                        );
                    })}</td>
                    <td>{entry.tags.join(', ')}</td>
                    <td>
                        {addLineBreaks(entry.summary)}
                    </td>
                    <td>{entry.tier}</td>
                    {isModerator && <td>{entry.authorRequestAge ? 'Yes' : 'No'}</td>}
                    {isModerator && modMessage ? <td>{addLineBreaks(modMessage)}</td> : isModerator && <td></td>}
                </tr>)}
            {/* {(!isModerator && entry.uid === localStorage.getItem('uid')) && (
                <tr>
                    <td colSpan={9}>Above is your submission. If it's red, it has not been approved yet.</td>
                </tr>
            )} */}
            {isModerator && (
                <tr className="mod-bar">
                    <td><button className={entry.isPublished ? 'btn btn-warning' : 'btn btn-approve'} onClick={approve} >{entry.isPublished ? 'Deny' : 'Approve'}</button></td>
                    <td><button className="btn btn-delete" onClick={confirmDialog}>Delete</button></td>
                    <td colSpan={9}>Submitted by: {requestUser ? requestUser.displayName : '[Error: Unknown User]'}</td>
                </tr>
            )}
        </>
    );
}
