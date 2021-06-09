import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Homepage';
import { GameSwitch } from './GameSwitch';
import { AccountSwitch } from './AccountSwitch';
import Rules from '../pages/Rules';
import Tutorial from '../pages/Tutorial';
import NetworkError from '../components/errors/NetworkError';
import PageNotFound from '../components/errors/PageNotFound';

const RootSwitch = () => (
    <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/games' component={GameSwitch} />
        <Route path='/account' component={AccountSwitch} />
        <Route path={'/rules/'} exact component={Rules} />
        <Route path={'/tutorial/'} exact component={Tutorial} />
        <Route path={'/networkError/'} exact component={NetworkError} />
        <Route component={PageNotFound} />
    </Switch>
);

export { RootSwitch };
