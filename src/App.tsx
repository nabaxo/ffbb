import React, { useEffect, useState } from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import SubmitNewRequests from './SubmitNewRequest';
import Summaries from './Summaries';
import Events from './Events';
import Login from './Login';
import CreateEvent from './CreateEvent';
import Settings from './Settings';

const history = createBrowserHistory();

function App() {
    const [isSignedIn, setIsSignedIn] = useState<boolean>();

    useEffect(() => {
        return firebase.auth().onAuthStateChanged((u) => {
            if (u) {
                const collection = firebase.firestore().collection('users');
                collection.doc(u.uid).onSnapshot(() => {
                    setIsSignedIn(true);
                    localStorage.setItem('uid', u.uid);
                });
            } else {
                logOut();
            }
        });
    }, []);

    useEffect(() => {
        setIsSignedIn(localStorage.getItem('uid') ? true : false);
    }, []);

    function logOut() {
        setIsSignedIn(false);
        localStorage.removeItem('uid');
        history.push('/login');
        firebase.auth().signOut();
    }

    return (
        <Router history={history} >
            <header className="App-header">
                <h1>FFic BBang</h1>
                <nav>

                    <ul>
                        {!isSignedIn && (
                            <li>
                                <NavLink activeClassName="active" to='/login'>Login</NavLink>
                            </li>
                        )}
                        {isSignedIn && (
                            <>
                                <li>
                                    <NavLink activeClassName="active" to='/list'>List of Events</NavLink>
                                </li>
                                <li>
                                    <NavLink activeClassName="active" to='/create-event'>Create Event</NavLink>
                                </li>
                                <li>
                                    <NavLink activeClassName="active" to='/settings'>My Events</NavLink>
                                </li>
                                <li>
                                    <button
                                        className="btn btn-warning"
                                        onClick={logOut}>Log out</button>
                                </li>
                            </>
                        )}
                    </ul>

                </nav>
            </header>
            <main>
                {isSignedIn && (
                    <Switch>
                        <Route exact path='/'>
                            <Redirect to='/list' />
                        </Route>
                        <Route path='/list'>
                            <Events />
                        </Route>
                        <Route path='/create-event'>
                            <CreateEvent />
                        </Route>
                        <Route path='/settings'>
                            <Settings />
                        </Route>
                        <Route path='/event/:id/submit'>
                            <SubmitNewRequests />
                        </Route>
                        <Route exact path='/event/:id'>
                            <Summaries />
                        </Route>
                    </Switch>
                )}
                {!isSignedIn && (
                    <Switch>
                        <Route path='/login'>
                            <Login />
                        </Route>
                    </Switch>
                )}
            </main>
            <footer>
                <span>This app is open source, check us out on <a href="https://github.com/nabaxo/ffbb">Github</a>!</span>
            </footer>
        </Router>
    );
}

export default App;
