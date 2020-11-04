import React from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import SubmitNewRequests from './SubmitNewRequest';

function App() {
    const history = createBrowserHistory();

    return (
        <Router history={history}>
            <div className="App">
                <header className="App-header">
                    <h1>Test</h1>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to='/list'>List</NavLink>
                            </li>
                            <li>
                                <NavLink to='/submit-new'>Submit new entry</NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>
                <main className="App-body">
                    <Switch>
                        <Route exact path='/'>
                            <Redirect to='/list' />
                        </Route>
                        <Route path='/list'>

                        </Route>
                        <Route path='/submit-new'>
                            <SubmitNewRequests />
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;
