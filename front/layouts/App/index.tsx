import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router-dom';

const Auth = loadable(() => import('@pages/Auth'));
const Board = loadable(() => import('@layouts/Board'));

const App: FC = () => (
    <Switch>
        <Route exact path="/">
            <Redirect to="/auth"/>
        </Route>
        <Route path="/auth" component={Auth} />
        <Route path="/board/:board" component={Board} />
    </Switch>
)

export default App;
