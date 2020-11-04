import React, { ChangeEvent, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { entry } from './types';
import { BiPlusCircle } from 'react-icons/bi';

import { pair } from './types';

export default function SubmitNewRequests(): JSX.Element {
    // const history = useHistory();
    // const [request, setRequest] = useState<entry | null>(null);
    const [characters, setCharacters] = useState<string[]>(['']);
    const [pairings, setPairings] = useState<pair[]>([{ a: '', b: '' }]);

    function handleAddCharacter() {
        setCharacters([
            ...characters,
            ''
        ]);
    }

    function handleAddCharacterOnEnter(event: any) {
        if (event.key === 'Enter') {
            handleAddCharacter();
        }
    }

    function handleRemoveCharacter(index: number) {
        characters.splice(index, 1);
        setCharacters([...characters]);
    }

    function handleChangeCharacter(event: ChangeEvent<HTMLInputElement>) {
        const list = [...characters];
        list[Number(event.target.name)] = event.target.value;
        setCharacters(list);
    }

    function handleAddPairing() {
        setPairings([
            ...pairings,
            { a: '', b: '' },
        ]);
    }

    function handleRemovePairing(index: number) {
        pairings.splice(index, 1);
        setPairings([...pairings]);
    }

    function handleChangePairing(event: ChangeEvent<HTMLInputElement>) {
        const index = +event.target.name.split(',')[0];
        const name = event.target.name.split(',')[1] === 'a' ? 'a' : 'b';
        const pairList = [...pairings];
        pairList[index][name] = event.target.value;
        setPairings(pairList);
        // console.log(pairings);
    }

    const charactersInputs = characters.map((c, i: number) => {
        let sign: JSX.Element;
        if (i === characters.length - 1) {
            sign = <BiPlusCircle tabIndex={i} onClick={handleAddCharacter} size="1.5rem" className="plus" transform="rotate(0)" color="green" />;
        } else {
            sign = <BiPlusCircle tabIndex={i} onClick={() => handleRemoveCharacter(i)} size="1.5rem" className="plus cross" color="red" />;
        }
        return (
            <label key={i} className="align-svg">
                <input autoFocus={i === characters.length - 1} name={String(i)} type="text" value={c} onKeyPress={handleAddCharacterOnEnter} onChange={handleChangeCharacter} />
                {sign}
            </label>
        );
    });

    const pairingsInputs = pairings.map((c, i) => {
        let sign: JSX.Element;
        // console.log(c);
        if (i === pairings.length - 1) {
            sign = <BiPlusCircle tabIndex={i} onClick={handleAddPairing} size="1.5rem" className="plus" transform="rotate(0)" color="green" />;
        } else {
            sign = <BiPlusCircle tabIndex={i} onClick={() => handleRemovePairing(i)} size="1.5rem" className="plus cross" color="red" />;
        }
        return (
            <label key={i} className="align-svg">
                <input name={i + ',a'} type="text" value={c['a']} onChange={handleChangePairing} />
                x
                <input name={i + ',b'} type="text" value={c['b']} onChange={handleChangePairing} />
                {sign}
            </label>
        );

    });

    return (
        <form className="submit-form" action="">
            <div>
                <strong>Would you like a beta?</strong>
                <label><input name="requestBeta" type="checkbox" />Yes</label>
            </div>
            <div>
                <strong>Rating:</strong>
                <label><input name="rating" type="radio" value="G-T" />G-T</label>
                <label><input name="rating" type="radio" value="E-M" />E-M</label>
            </div>
            <div>
                <strong>Would you like an 18+ collaborator?</strong>
                <label><input type="checkbox" />Yes</label>
            </div>
            <div><strong>Archive warnings (select all that apply):</strong>
                <label><input type="checkbox" value="no archive warnings apply" />Nothing applies</label>
                <label><input type="checkbox" value="graphic depictions of violence" />Graphic violence</label>
                <label><input type="checkbox" value="major character death" />Major character death</label>
                <label><input type="checkbox" value="rape/non-con" />Rape/Non-con</label>
                <label><input type="checkbox" value="underage" />Underage</label>
            </div>
            <div><strong>Characters:</strong>
                {charactersInputs}
            </div>
            <div><strong>parings</strong>
                {pairingsInputs}
            </div>
            <div>
                <label><input type="text" /></label>
            </div>
            <div>
                <label><input type="text" /></label>
            </div>
            <div>
                <label><input type="text" /></label>
            </div>
            <div>
                <label><input type="text" /></label>
            </div>
        </form>
    );
};
