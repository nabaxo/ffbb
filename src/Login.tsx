import React from 'react';
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useHistory } from 'react-router-dom';
import { User } from './types';

export default function Login() {
    const history = useHistory();

    const uiConfig = {
        signInFlow: 'redirect',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult: any) => {
                const collection = firebase.firestore().collection('users');
                if (authResult.additionalUserInfo.isNewUser) {
                    const newUser: User = {
                        uid: authResult.user.uid,
                        displayName: authResult.user.displayName,
                        email: authResult.user.email,
                        joinedEvents: []
                    };
                    collection.doc(authResult.user.uid).set(newUser);
                }
                history.goBack();
                return false;
            }
        },
    };

    return (
        <div>
            <div className="information-box">Login to host or participate in a Big Bang!</div>
            <StyledFirebaseAuth className="mt-5" uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
    );

}
