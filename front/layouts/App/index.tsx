import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router-dom';

const Auth = loadable(() => import('@pages/Auth'));

const App: FC = () => (
    <Switch>
        <Route exact path="/">
            <Redirect to="/auth"/>
        </Route>
        <Route path="/auth" component={Auth} />
    </Switch>
)

export default App;
