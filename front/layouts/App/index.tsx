import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Redirect, Route, Switch } from 'react-router-dom';

const Auth = loadable(() => import('@pages/Auth'));
const Board = loadable(() => import('@layouts/Board'));
const Main = loadable(() => import('@layouts/Main'));
const Manage = loadable(() => import('@layouts/Manage'));

const App: FC = () => (
	<Switch>
		<Route exact path="/">
			<Redirect to="/auth"/>
		</Route>
		<Route path="/auth" component={Auth} />
		<Route path="/main" component={Main} />
		<Route path="/board/:board" component={Board} />
		<Route path="/manage" component={Manage} />
	</Switch>
)

export default App;
