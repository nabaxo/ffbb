import React, { useEffect, useState } from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import SubmitNewRequests from './SubmitNewRequest';
import Summaries from './Summaries';
import Events from './Events';
import { User } from './types';
import Login from './Login';
import CreateEvent from './CreateEvent';
import Settings from './Settings';

const history = createBrowserHistory();

function App() {
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
        <Router history={history} >
            <header className="App-header">
                <h1>FFic BBang</h1>
                <nav>

                    <ul>
                        {/* <li>
                            <NavLink activeClassName="active" to='/list'>List</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to='/submit-new'>Submit Entry</NavLink>
                        </li> */}
                        {!user && (
                            <li>
                                <NavLink activeClassName="active" to='/login'>Login</NavLink>
                            </li>
                        )}
                        {user && (
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
                                    Welcome {firebase.auth().currentUser?.displayName}
                                </li>
                                <li>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => {
                                            firebase.auth().signOut();
                                            history.push('/login');
                                        }}>Log out</button>
                                </li>
                            </>
                        )}
                    </ul>

                </nav>
            </header>
            <main>
                {user && (
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
                {!user && (
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
