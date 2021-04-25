import { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { FaEdit } from 'react-icons/fa';
import { Entry, Bang } from './types';
import RequestEntry from './RequestEntry';
import { useParams } from 'react-router-dom';
import DetailsOverlay from './DetailsOverlay';
import ManageModerators from './ManageModerator';

interface ParamTypes {
    id: string;
}

interface listEntry {
    id: string;
    entry: Entry;
    modMessage?: string;
}

export default function Event() {
    const { id: bid } = useParams<ParamTypes>();
    const [bang, setBang] = useState<Bang>();
    const [ageConfirm, setAgeConfirm] = useState<boolean>(false);
    const [rawList, setRawList] = useState<listEntry[]>();
    const [filteredList, setFilteredList] = useState<listEntry[]>();
    const uid = firebase.auth().currentUser?.uid;
    const [isModerator, setIsModerator] = useState<boolean>();
    const [details, setDetails] = useState<string>();
    const [openInfo, setOpenInfo] = useState<boolean>();

    // Following is needed to force update when getting the modMessages separately
    const [, setForceUpdateHack] = useState<string>();

    if (details) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }

    useEffect(() => {
        const collection = firebase.firestore().collection('events').doc(bid).collection('requests');
        firebase.firestore().collection('events').doc(bid).onSnapshot((doc) => {
            setBang(doc.data() as Bang);
        });

        if (isModerator) {
            return collection.onSnapshot((snapshot) => {
                setRawList(snapshot.docs.map(d => {
                    const e: listEntry = {
                        id: d.id,
                        entry: d.data() as Entry,
                    };

                    collection.doc(d.id).collection('private').doc('private').get().then((m) => {
                        setForceUpdateHack(m.get('modMessage') as string);
                        e.modMessage = m.get('modMessage') as string;
                    });

                    return e;
                }));
            });
        } else {
            if (ageConfirm) {
                return collection.where('isPublished', '==', true).onSnapshot((snapshot) => {
                    setRawList(snapshot.docs.map(d => {
                        return ({
                            id: d.id,
                            entry: d.data() as Entry
                        });
                    }));
                });
            } else {
                return collection.where('isPublished', '==', true).where('ageRating', '==', 'G-T').onSnapshot((snapshot) => {
                    setRawList(snapshot.docs.map(d => {
                        return ({
                            id: d.id,
                            entry: d.data() as Entry
                        });
                    }));
                });
            }
        }
    }, [bid, isModerator, ageConfirm]);

    useEffect(() => {
        if (bang && uid && bang.moderators.includes(uid)) {
            setIsModerator(true);
        } else {
            setIsModerator(false);
        }
    }, [uid, bang]);

    function handleFilter(event: ChangeEvent<HTMLInputElement>) {
        if (rawList) {
            const value = event.target.value.toLowerCase();

            const filterList = rawList.filter(i => (
                i.id.toLowerCase().includes(value) ||
                i.entry.summary.toLowerCase().includes(value) ||
                i.entry.characters.join(' ').toLowerCase().includes(value) ||
                i.entry.tags.join(' ').toLowerCase().includes(value) ||
                i.entry.archiveWarnings?.join(' ').toLowerCase().includes(value) ||
                i.modMessage?.toLowerCase().includes(value)
            ));
            if (value === '') {
                setFilteredList(undefined);
            } else {
                setFilteredList(filterList);
            }
        }
    }

    const list = (() => {
        if (filteredList) {
            return filteredList;
        }
        else if (rawList) {
            return rawList;
        }
    })();

    function handleAgeCheck(event: ChangeEvent<any>) {
        setAgeConfirm(event.target.checked);
    }

    function addModerator(mod: string) {
        if (bang && !bang.moderators.includes(mod)) {
            const collection = firebase.firestore().collection('events').doc(bid);

            bang.moderators.push(mod);
            const mods = [...bang.moderators];
            setBang({ ...bang, moderators: mods });
            collection.set(bang, { merge: true });
        }
    }

    function removeModerator(mod: string) {
        if (bang && bang.creatorId !== mod) {
            const collection = firebase.firestore().collection('events').doc(bid);

            bang.moderators.splice(bang.moderators.indexOf(mod), 1);
            const mods = [...bang.moderators];
            setBang({ ...bang, moderators: mods });
            collection.set(bang, { merge: true });
        }
    }

    function editInfo() {
        if (bang) {
            return (
                <div className="column overlay">
                    <div className="overlay-bg" onClick={() => setOpenInfo(false)}></div>
                    <div className="column overlay-container" >
                        <h4>No change is saved until you click the update button.</h4>
                        <form className="column" action="" onSubmit={(event) => handleSubmitInfo(event)}>
                            <textarea name="info" rows={10} value={addNewLines(bang.information)} onChange={handleEditInfo}></textarea>
                            <button className="btn btn-submit" type="submit">Update</button>
                        </form>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    function handleEditInfo(event: ChangeEvent<any>) {
        if (bang && event.target.value) {
            const target = event.target;
            const value = target.value;

            setBang({ ...bang, information: addLinebreaks(value) });
        }
    }

    function handleSubmitInfo(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (bang) {
            const collection = firebase.firestore().collection('events').doc(bid);
            collection.set(bang, { merge: true });
        }
    }

    function addNewLines(t: string) {
        return t.replaceAll('\\n', '\n');
    }

    function addLinebreaks(t: string) {
        return t.replaceAll('\n', '\\n');
    }

    return (
        <div className="entry-list">
            {bang && <>
                <div className="column information-box">
                    {details && <DetailsOverlay text={details} setDetails={setDetails} />}
                    {isModerator && openInfo && editInfo()}
                    <div className="event-info preserve-whitespace">
                        <h3>{bang.title}</h3>
                        {addNewLines(bang.information)}
                        {isModerator && <FaEdit className="edit-info" onClick={() => setOpenInfo(true)} />}
                    </div>
                    {isModerator && (
                        <ManageModerators
                            creator={bang.creatorId}
                            mods={bang.moderators}
                            addModerator={addModerator}
                            removeModerator={removeModerator}
                        />
                    )}
                    <span className="btn-row">
                        <input className="filter" type="text" placeholder="Filter..." onChange={handleFilter} />
                        <a className="btn btn-submit" href={'/event/' + bid + '/submit'} >Submit New!</a>
                    </span>
                    {!isModerator && (
                        <fieldset>
                            <input
                                type="checkbox"
                                name="age-gate"
                                id="age-gate"
                                checked={ageConfirm}
                                onChange={handleAgeCheck}
                            />
                            <label htmlFor="age-gate">&nbsp;Show 18+ fics</label>
                        </fieldset>
                    )}
                </div>
                <div className="event-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Wants a beta</th>
                                <th>Rating</th>
                                <th>Archive Warnings</th>
                                <th>Characters</th>
                                <th>Pairings</th>
                                <th>Tags</th>
                                <th>Summary</th>
                                <th>Tier</th>
                                {isModerator && <th>Message to mods</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.map(e => <RequestEntry
                                key={e.id}
                                entryId={e.id}
                                entry={e.entry}
                                modMessage={isModerator ? e.modMessage : undefined}
                                isModerator={isModerator ? true : false}
                                eventId={bid}
                                setDetails={setDetails}
                            />)}
                        </tbody>
                    </table>
                </div>
            </>}
        </div>
    );
}
