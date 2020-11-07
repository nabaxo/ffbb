import React from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import SubmitNewRequests from './SubmitNewRequest';

function App() {
    const history = createBrowserHistory();

    return (
        <Router history={history}>
            <header className="App-header">
                <h1>Fan Fic Big Bang</h1>
                <nav>
                    <ul>
                        <li>
                            <NavLink activeClassName="active" to='/list'>List</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName="active" to='/submit-new'>Submit New Entry</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
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
        </Router>
    );
}

export default App;
