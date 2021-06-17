import { useState, useEffect, ChangeEvent } from 'react';
import firebase from 'firebase/app';
import { FaEdit } from 'react-icons/fa';
import { Entry, Bang, User } from './types';
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
    const [isModerator, setIsModerator] = useState<boolean>();
    const [ageConfirm, setAgeConfirm] = useState<'G-T' | 'E-M' | 'show-all'>('G-T');
    const [requestBeta, setRequestBeta] = useState<boolean>(false);
    const [onlyUnpublished, setOnlyUnpublished] = useState<boolean>(false);
    // TODO: Experimental stuff
    // const [userList, setUserList] = useState<listEntry[]>();
    const [rawList, setRawList] = useState<listEntry[]>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const uid = firebase.auth().currentUser?.uid;
    const [details, setDetails] = useState<string>();
    const [openInfo, setOpenInfo] = useState<boolean>();
    const userDocRef = firebase.firestore().collection('users').doc(uid);
    const [joinedBangs, setJoinedBangs] = useState<string[]>();

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
            setAgeConfirm('show-all');
            const unsubscribe = collection.onSnapshot((snapshot) => {
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

            return unsubscribe;
        }
        else {
            const unsubscribe = collection.where('isPublished', '==', true).onSnapshot((snapshot) => {
                setRawList(snapshot.docs.map(d => {
                    return ({
                        id: d.id,
                        entry: d.data() as Entry
                    });
                }));
            });

            return unsubscribe;
        }
    }, [bid, isModerator]);

    // TODO: Experimental stuff
    // useEffect(() => {
    //     if (uid && bid && !isModerator) {
    //         const collection = firebase.firestore().collection('events').doc(bid).collection('requests');

    //         const unsubscribe = collection.where('uid', '==', uid).where('isPublished', '==', false).onSnapshot((snapshot) => {
    //             setUserList(snapshot.docs.map(d => {
    //                 return ({
    //                     id: d.id,
    //                     entry: d.data() as Entry
    //                 });
    //             }));
    //         });

    //         return unsubscribe;
    //     }
    // }, [uid, bid, isModerator]);

    useEffect(() => {
        if (bang && uid && bang.moderators.includes(uid)) {
            setIsModerator(true);
        } else {
            setIsModerator(false);
        }
    }, [uid, bang]);

    useEffect(() => {
        if (uid) {
            const unsubscribe = userDocRef.onSnapshot((doc) => {
                const u = doc.data() as User;

                u && setJoinedBangs(u.joinedEvents);
            });

            return unsubscribe;
        }
    }, [uid, userDocRef]);

    useEffect(() => {
        return () => { };
    }, []);

    function handleFilter(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value.toLowerCase());
    }

    const list = rawList?.filter(i => (
        i.id.toLowerCase().includes(searchQuery) ||
        i.entry.summary.toLowerCase().includes(searchQuery) ||
        i.entry.characters.join(' ').toLowerCase().includes(searchQuery) ||
        i.entry.tags.join(' ').toLowerCase().includes(searchQuery) ||
        i.entry.archiveWarnings?.join(' ').toLowerCase().includes(searchQuery) ||
        i.modMessage?.toLowerCase().includes(searchQuery)
    )).filter(i => {
        if (ageConfirm === 'G-T') {
            return i.entry.ageRating === 'G-T';
        }
        else if (ageConfirm === 'E-M') {
            return i.entry.ageRating === 'E-M';
        }
        return i;
    }).filter(i => {
        if (requestBeta) {
            return i.entry.requestBeta;
        }
        return i;
    }).filter(i => {
        if (onlyUnpublished) {
            return !i.entry.isPublished;
        }
        return i;
    });

    // TODO: Experimental stuff
    // if (userList && l && !filteredList) {
    //     l = [...l, ...userList];
    // }

    function handleWantsBeta(event: ChangeEvent<any>) {
        setRequestBeta(event.target.checked);
    }

    function handleOnlyUnpublished(event: ChangeEvent<any>) {
        setOnlyUnpublished(event.target.checked);
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

    function joinBang() {
        userDocRef.update({
            joinedEvents: firebase.firestore.FieldValue.arrayUnion(bid)
        });
    }

    function editInfo() {
        if (bang) {
            return (
                <div className="column overlay">
                    <div className="overlay-bg" onClick={() => setOpenInfo(false)}></div>
                    <div className="column overlay-container" >
                        <div className="info">No change is saved until you click the update button.</div>
                        <form className="column" action="" onSubmit={(event) => handleSubmitInfo(event)}>
                            <textarea name="info" rows={10} value={addNewLines(bang.information)} onChange={handleEditInfo}></textarea>
                            <button className="btn btn-submit btn-update" type="submit">Update</button>
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

    function handleCloseEvent() {
        if (bang) {
            const collection = firebase.firestore().collection('events').doc(bid);

            const open = !bang.isOpen;

            setBang({ ...bang, isOpen: open });
            collection.update({
                isOpen: open
            });
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
                        {isModerator && (
                            <span className="event-edit-row" >
                                <button onClick={handleCloseEvent} className={bang.isOpen ? 'btn btn-warning' : 'btn btn-approve'}>{bang.isOpen ? 'Close Event' : 'Open Event'}</button>
                                <FaEdit onClick={() => setOpenInfo(true)} className="edit-info" />
                            </span>
                        )}
                    </div>
                    {isModerator && (
                        <ManageModerators
                            creator={bang.creatorId}
                            mods={bang.moderators}
                            addModerator={addModerator}
                            removeModerator={removeModerator}
                        />
                    )}
                    <div className="btn-row">
                        <input className="filter" type="text" placeholder="Filter..." onChange={handleFilter} />
                        {uid && bang.isOpen && <a className="btn btn-submit btn-new-summary" href={'/event/' + bid + '/submit'} >Submit New!</a>}
                        {joinedBangs && !joinedBangs.includes(bid) && <button className="btn btn-approve" onClick={joinBang}>Join event</button>}
                    </div>
                    {!uid && <div><span>Login (or refresh if you're already logged in) to submit!</span></div>}
                    <fieldset className="column gap">
                        <form className="row gap" action="">
                            <span>
                                <input type="radio" id="G-T" name="age-filter" checked={ageConfirm === 'G-T'} onChange={() => setAgeConfirm('G-T')} />
                                <label htmlFor="G-T">Show only G-T submissions</label>
                            </span>
                            <span>
                                <input type="radio" id="E-M" name="age-filter" checked={ageConfirm === 'E-M'} onChange={() => setAgeConfirm('E-M')} />
                                <label htmlFor="E-M">Show only E-M submissions</label>
                            </span>
                            <span>
                                <input type="radio" id="all" name="age-filter" checked={ageConfirm === 'show-all'} onChange={() => setAgeConfirm('show-all')} />
                                <label htmlFor="all">Show all submissions</label>
                            </span>
                        </form>
                        <div className="row gap">
                            <span>
                                <input
                                    type="checkbox"
                                    name="wants-beta"
                                    id="wants-beta"
                                    checked={requestBeta}
                                    onChange={handleWantsBeta}
                                />
                                <label htmlFor="wants-beta">&nbsp;Wants a beta</label>
                            </span>
                            {isModerator && <span>
                                <input
                                    type="checkbox"
                                    name="only-unpublished"
                                    id="only-unpublished"
                                    checked={onlyUnpublished}
                                    onChange={handleOnlyUnpublished}
                                />
                                <label htmlFor="only-unpublished">&nbsp;[Mods] Show only unpublished</label>
                            </span>}
                        </div>
                    </fieldset>
                </div>
                <div className="event-table">
                    {list && list.length ? (
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
                                    bangId={bid}
                                    setDetails={setDetails}
                                />)}
                            </tbody>
                            {isModerator && list && <tfoot>
                                <tr>
                                    <td colSpan={5}>Total number of sumbission are: {list.length}</td>
                                </tr>
                            </tfoot>}
                        </table>
                    )
                        :
                        <div className="center">
                            <h3>There are no submissions yet!</h3>
                        </div>}
                </div>
            </>}
        </div>
    );
}
