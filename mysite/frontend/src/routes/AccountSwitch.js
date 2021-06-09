import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import GameHistory from '../pages/GameHistory';
import PageNotFound from '../components/errors/PageNotFound';

function AccountSwitch() {
    let { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}/login`} exact component={Login} />
                <Route path={`${path}/signup`} exact component={Signup} />
                <Route path={`${path}/history`} exact component={GameHistory} />
                <Route component={PageNotFound} />
            </Switch>
        </>
    );
}

export { AccountSwitch };
