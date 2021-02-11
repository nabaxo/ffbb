import React, { useEffect, useState } from 'react';
import './App.css';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import SubmitNewRequests from './SubmitNewRequest';
import Summaries from './Summaries';
import Events from './Events';
import { User } from './types';
import Login from './Login';

function App() {
    const history = createBrowserHistory();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((u) => {
            if (u) {
                const collection = firebase.firestore().collection('users');
                collection.doc(u.uid).onSnapshot(s => {
                    const dbUser: User = s.data() as User;
                    setUser(dbUser);
                });
            } else {
                setUser(undefined);
            }
        });
    }, []);

    return (
        <Router history={history}>
            <header className="App-header">
                <h1>FFic BBang</h1>
                <nav>
                    {/*
                    <ul>
                        <li>
                            <NavLink activeClassName="active" to='/list'>List</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to='/submit-new'>Submit Entry</NavLink>
                        </li>
                    </ul>
                    */}
                </nav>
            </header>
            <main>
                <Switch>
                    {user && (
                        <>
                            <Route exact path='/'>
                                <Redirect to='/list' />
                            </Route>
                            <Route path='/list'>
                                <Events />
                            </Route>
                            <Route path='/event/:id/submit'>
                                <SubmitNewRequests />
                            </Route>
                            <Route path='/event/:id'>
                                <Summaries />
                            </Route>
                        </>
                    )}
                    {!user && (
                        <>
                            <Route exact path='/'>
                                <Redirect to='/login' />
                            </Route>
                            <Route path='/login'>
                                <Login />
                            </Route>
                        </>
                    )}
                </Switch>
            </main>
        </Router>
    );
}

export default App;
