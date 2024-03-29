import React, { ChangeEvent, useState } from 'react';
import firebase from 'firebase/app';
import { useHistory, useParams } from 'react-router-dom';
import { BiPlusCircle } from 'react-icons/bi';
import { Pair, Entry } from './types';

interface ParamTypes {
    id: string;
}

export default function SubmitNewRequests(): JSX.Element {
    const { id } = useParams<ParamTypes>();
    const history = useHistory();
    const collection = firebase.firestore().collection('events').doc(id).collection('requests');
    const user = firebase.auth().currentUser;
    const uid = user?.uid;
    const userDocRef = firebase.firestore().collection('users').doc(uid);
    const [characters, setCharacters] = useState<string[]>(['']);
    const [pairings, setPairings] = useState<Pair[]>([{ a: '', b: '' }]);
    const [request, setRequest] = useState<Entry>({
        uid: localStorage.getItem('uid') || firebase.auth().currentUser?.uid || '',
        requestBeta: false,
        ageRating: 'G-T',
        authorRequestAge: false,
        characters: characters,
        pairings: pairings,
        tags: [''],
        summary: '',
        tier: 1,
        isPublished: false,
    });
    const [modMessage, setModMessage] = useState<string>('');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!request.archiveWarnings || request.archiveWarnings.length === 0) {
            request.archiveWarnings = ['creator chose not to use archive warnings'];
        }

        firebase.auth().onAuthStateChanged(u => {
            if (u) {
                request.uid = u.uid;
                localStorage.setItem('uid', u.uid);
            }
        });

        if (request.uid !== '') {
            const docRef = collection.doc();

            const newRequest: Entry = { ...request, summary: addNewLines(request.summary) };

            docRef.set(newRequest);
            docRef.collection('private').doc('private').set({ modMessage: addNewLines(modMessage) });

            userDocRef.update({
                joinedEvents: firebase.firestore.FieldValue.arrayUnion(id)
            });
            history.push('/event/' + id);
        } else {
            alert("Something went wrong, try again!");
        }
    }

    function addNewLines(t: string) {
        return t.replaceAll('\n', '\\n');
    }

    function handleAddCharacter() {
        setCharacters([
            ...characters,
            ''
        ]);
        characters.splice(characters.length, 1);
        setRequest({ ...request, characters: characters });
    }

    function handleAddCharacterOnEnter(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddCharacter();
        }
    }

    function handleRemoveCharacter(index: number) {
        characters.splice(index, 1);
        setCharacters([...characters]);
        setRequest({ ...request, characters: characters });
    }

    function handleChangeCharacter(event: ChangeEvent<HTMLInputElement>) {
        const characterList = [...characters];
        characterList[Number(event.target.name)] = event.target.value;
        setCharacters(characterList);
        setRequest({ ...request, characters: characterList });
    }

    function handleAddPairing() {
        setPairings([
            ...pairings,
            { a: '', b: '' },
        ]);
        pairings.splice(pairings.length, 1);
        setRequest({ ...request, pairings: pairings });
    }

    function handleRemovePairing(index: number) {
        pairings.splice(index, 1);
        setPairings([...pairings]);
    }

    function handleChangePairing(event: ChangeEvent<HTMLInputElement>) {
        const index = +event.target.name.split('-')[0];
        const name = event.target.name.split('-')[1] === 'a' ? 'a' : 'b';
        const pairList = [...pairings];
        pairList[index][name] = event.target.value;
        setPairings(pairList);
    }

    const charactersInputs = characters.map((c, i: number) => {
        let sign: JSX.Element;
        if (i === characters.length - 1) {
            sign = <BiPlusCircle tabIndex={i} onClick={handleAddCharacter} size="1.5rem" className="plus" transform="rotate(0)" color="green" />;
        }
        else {
            sign = <BiPlusCircle tabIndex={i} onClick={() => handleRemoveCharacter(i)} size="1.5rem" className="plus cross" color="red" />;
        }
        return (
            <label key={i} className="align-svg">
                <input
                    className="char-input"
                    autoFocus={i === characters.length - 1}
                    name={String(i)} type="text" value={c}
                    onKeyPress={handleAddCharacterOnEnter}
                    onChange={handleChangeCharacter}
                    required={i === 0}
                />
                {sign}
            </label>
        );
    });

    const pairingsInputs = pairings.map((c, i) => {
        let sign: JSX.Element;
        if (i === pairings.length - 1) {
            sign = <BiPlusCircle tabIndex={i} onClick={handleAddPairing} size="1.5rem" className="plus" transform="rotate(0)" color="green" />;
        }
        else {
            sign = <BiPlusCircle tabIndex={i} onClick={() => handleRemovePairing(i)} size="1.5rem" className="plus cross" color="red" />;
        }
        return (
            <label key={i} className="align-svg pairings">
                <input className="pair-input" name={i + '-a'} type="text" value={c['a']} onChange={handleChangePairing} required={i === 0} />
                <span style={{ padding: '0 .5rem' }}>✖</span>
                <input className="pair-input" name={i + '-b'} type="text" value={c['b']} onChange={handleChangePairing} required={i === 0} />
                {sign}
            </label>
        );

    });

    function handleChange(event: ChangeEvent<any>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === 'requestBeta' || name === 'authorRequestAge') {
            setRequest({ ...request, [name]: target.checked });
        }
        else if (name === 'archiveWarnings') {
            if (request.archiveWarnings && !request.archiveWarnings.includes(value)) {
                setRequest({ ...request, [name]: [...request.archiveWarnings, value] });
            } else if (request.archiveWarnings && request.archiveWarnings.includes(value)) {
                const req = request.archiveWarnings.filter(a => a !== value);
                setRequest({ ...request, archiveWarnings: req });
            }
            else {
                setRequest({ ...request, [name]: [value] });
            }
        }
        else if (name === 'tags') {
            setRequest({ ...request, [name]: value.split(',') });
        }
        else if (name === 'authorWarnings') {
            setModMessage(value);
        }
        else {
            setRequest({ ...request, [name]: value });
        }
    }

    return (
        <form className="column submit-form center" action="" onSubmit={(event) => handleSubmit(event)}>
            <div>
                <strong>Would you like a beta?</strong>
                <label><input name="requestBeta" onChange={handleChange} type="checkbox" />Yes</label>
            </div>
            <div>
                <strong>Rating:</strong>
                <label><input name="ageRating" onChange={handleChange} type="radio" value="G-T" defaultChecked />G-T</label>
                <label><input name="ageRating" onChange={handleChange} type="radio" value="E-M" />E-M</label>
            </div>
            <div>
                <strong>Would you like an 18+ collaborator?</strong>
                <label><input name="authorRequestAge" onChange={handleChange} type="checkbox" />Yes</label>
            </div>
            <div><strong>Archive warnings (select all that apply):</strong>
                <label><input type="checkbox" name="archiveWarnings" value="no archive warnings apply" onChange={handleChange} />Nothing applies</label>
                <label><input type="checkbox" name="archiveWarnings" value="graphic depictions of violence" onChange={handleChange} />Graphic violence</label>
                <label><input type="checkbox" name="archiveWarnings" value="major character death" onChange={handleChange} />Major character death</label>
                <label><input type="checkbox" name="archiveWarnings" value="rape/non-con" onChange={handleChange} />Rape/Non-con</label>
                <label><input type="checkbox" name="archiveWarnings" value="underage" onChange={handleChange} />Underage</label>
            </div>
            <div><strong>Characters:</strong>
                {charactersInputs}
            </div>
            <div><strong>Parings:</strong>
                {pairingsInputs}
            </div>
            <div>
                <strong>Tags (separate by comma)</strong>
                <input
                    className="form-input"
                    type="text" name="tags"
                    value={request.tags.join(',')} onChange={handleChange}
                />
            </div>
            <div>
                <strong>Summary</strong>
                <textarea className="form-input" rows={5} name="summary" value={request?.summary} onChange={handleChange} required />
            </div>
            <div>
                <strong>Tier:</strong>
                <select className="form-input" name="tier" id="tier" onChange={handleChange}>
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                </select>
            </div>
            <div>
                <strong>Anything you'd like the mods to know?</strong>
                <span>(This wont be visible for anyone except the mods of the event.)</span>
                <textarea className="form-input" name="authorWarnings" value={modMessage} onChange={handleChange} />
            </div>
            <div>
                <input className="btn btn-approve" type="submit" value="Submit Request" />
            </div>
        </form>
    );
};
