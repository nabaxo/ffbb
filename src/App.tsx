import React from 'react';
import './App.css';
import { NavLink, Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import SubmitNewRequests from './SubmitNewRequest';
import Summaries from './Summaries';
import Events from './Events';

function App() {
    const history = createBrowserHistory();

    return (
        <Router history={history}>
            <header className="App-header">
                <h1>FanFic BigBang</h1>
                <nav>
                    <ul>
                        <li>
                            <NavLink activeClassName="active" to='/list'>List</NavLink>
                        </li>
                        {/* <li>
                            <NavLink activeClassName="active" to='/submit-new'>Submit Entry</NavLink>
                        </li> */}
                    </ul>
                </nav>
            </header>
            <main>
                <Switch>
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
                </Switch>
            </main>
        </Router>
    );
}

export default App;
