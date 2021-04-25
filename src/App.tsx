import React, { useEffect, useState } from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import { ImMenu } from 'react-icons/im';
import SubmitNewRequests from './SubmitNewRequest';
import Event from './Event';
import EventList from './EventList';
import Login from './Login';
import CreateEvent from './CreateEvent';
import Settings from './Settings';

const history = createBrowserHistory();

function App() {
    const [isSignedIn, setIsSignedIn] = useState<boolean>();
    const [showMenu, setShowMenu] = useState<boolean>(false);

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

    function menuButton() {
        setShowMenu(!showMenu);
    }

    return (
        <Router history={history} >
            <div className="column no-padding">
                <header>
                    <h3>FicBang</h3>
                    <nav>
                        <ul>
                            {!isSignedIn && (
                                <li>
                                    <NavLink activeClassName="active" to='/login'>Login</NavLink>
                                </li>
                            )}
                            {isSignedIn && (
                                <>
                                    <li className="burger-menu">
                                        <ImMenu onClick={menuButton} />
                                    </li>
                                    <li className={!showMenu ? 'close-menu' : ''}>
                                        <NavLink activeClassName="active" to='/list'>List of Events</NavLink>
                                    </li>
                                    <li className={!showMenu ? 'close-menu' : ''}>
                                        <NavLink activeClassName="active" to='/create-event'>Create Event</NavLink>
                                    </li>
                                    <li className={!showMenu ? 'close-menu' : ''}>
                                        <NavLink activeClassName="active" to='/settings'>My Events</NavLink>
                                    </li>
                                    <li className={!showMenu ? 'close-menu' : ''}>
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
                                <EventList />
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
                                <Event />
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
            </div>
        </Router>
    );
}

export default App;
