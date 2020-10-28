import React, { ChangeEvent, useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { entry } from './types';
import { BiPlusCircle } from 'react-icons/bi';

export default function SubmitNewRequests(): JSX.Element {
    // const history = useHistory();
    // const [request, setRequest] = useState<entry | null>(null);
    const [characters, setCharacters] = useState(['']);

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
        const newChar = event.target.value;
        const index = Number(event.target.name);
        const list = [...characters];
        list[index] = newChar;
        setCharacters(list);
    }

    const charInputs = characters.map((c, i: number) => {
        let sign: JSX.Element;
        if (i === characters.length - 1) {
            sign = <BiPlusCircle tabIndex={i} onClick={handleAddCharacter} size="1.5rem" id="plus" transform="rotate(0)" color="green" />;
        } else {
            sign = <BiPlusCircle tabIndex={i} onClick={() => handleRemoveCharacter(i)} size="1.5rem" id="plus" transform="rotate(45)" color="red" />;
        }
        return (
            <label key={i} className="align-svg">
                <input autoFocus={i === characters.length - 1} name={String(i)} type="text" value={characters[i]} onKeyPress={handleAddCharacterOnEnter} onChange={handleChangeCharacter} />
                {sign}
            </label>);
    });

    return (
        <form className="submit-form" action="">
            <div>
                <strong>Would you like a beta?</strong>
                <label>Yes: <input name="requestBeta" type="checkbox" /></label>
            </div>
            <div>
                <strong>Rating:</strong>
                <label>G-T: <input name="rating" type="radio" value="G-T" /></label>
                <label>E-M: <input name="rating" type="radio" value="E-M" /></label>
            </div>
            <div>
                <strong>Would you like an 18+ collaborator?</strong>
                <label>Yes: <input type="checkbox" /></label>
            </div>
            <div><strong>Archive warnings (select all that apply):</strong>
                <label>Nothing applies:<input type="checkbox" value="no archive warnings apply" /></label>
                <label>Graphic violence:<input type="checkbox" value="graphic depictions of violence" /></label>
                <label>Major character death:<input type="checkbox" value="major character death" /></label>
                <label>Rape/Non-con:<input type="checkbox" value="rape/non-con" /></label>
                <label>Underage:<input type="checkbox" value="underage" /></label>
            </div>
            <div ><strong>Characters:</strong>
                {charInputs}
            </div>
            <div><strong>parings</strong>
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
            <div>
                <label><input type="text" /></label>
            </div>
        </form>
    );
};
