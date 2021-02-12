import React, { ChangeEvent, useState } from 'react';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { Bang } from './types';

export default function CreateEvent() {
    const collection = firebase.firestore().collection('events');
    const history = useHistory();
    const creatorName = firebase.auth().currentUser?.displayName;
    const creatorId = firebase.auth().currentUser?.uid;
    const [bang, setBang] = useState<Bang>({
        title: '',
        fandom: '',
        summary: '',
        information: '',
        startDate: firebase.firestore.Timestamp.fromDate(new Date()),
        endDate: firebase.firestore.Timestamp.fromDate(new Date()),
        creatorId: creatorId ? creatorId : '',
        creatorName: creatorName ? creatorName : '',
        public: false
    });


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(bang);

        collection.add(bang).then((docRef) => {
            history.push('/event/' + docRef.id);
            history.go(0);
        });
    }

    function handleChange(event: ChangeEvent<any>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === 'public') {
            setBang({ ...bang, [name]: target.checked });
        }
        else if (name === 'startDate' || name === 'endDate') {
            setBang({ ...bang, [name]: firebase.firestore.Timestamp.fromDate(new Date(value)) });
        }
        else {
            setBang({ ...bang, [name]: value });
        }
    }

    return (
        <form className="submit-form" action="" onSubmit={(event) => handleSubmit(event)}>
            <div>
                <strong>Name of your event:</strong>
                <label><input
                    onChange={handleChange}
                    className="form-input"
                    name="title"
                    type="text"
                    required
                /></label>
            </div>
            <div>
                <strong>Name of your fan community:</strong>
                <label><input
                    onChange={handleChange}
                    className="form-input"
                    name="fandom"
                    type="text"
                    required
                /></label>
            </div>
            <div>
                <strong>Summary of your event:</strong>
                <label><input
                    onChange={handleChange}
                    className="form-input"
                    name="summary"
                    type="text"
                    required
                /></label>
            </div>
            <div>
                <strong>Information about your event:</strong>
                <label><textarea
                    onChange={handleChange}
                    className="form-input"
                    name="information"
                    rows={5}
                    required
                /></label>
            </div>
            <div>
                <strong>Start Date:</strong>
                <label><input
                    onChange={handleChange}
                    className="date-input"
                    name="startDate"
                    type="date"
                    required
                /></label>
            </div>
            <div>
                <strong>End date:</strong>
                <label><input
                    onChange={handleChange}
                    className="date-input"
                    name="endDate"
                    type="date"
                    required
                /></label>
            </div>
            <div>
                <strong>Do you want this event to be publicly listed?</strong>
                <label><input
                    onChange={handleChange}
                    name="public"
                    type="checkbox" />Yes</label>
            </div>
            <div>
                <input type="submit" value="Create Event" />
            </div>
        </form>
    );
}
