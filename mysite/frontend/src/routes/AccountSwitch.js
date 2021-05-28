import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import GameHistory from '../pages/GameHistory';

function AccountSwitch() {
    let { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}/login`} exact component={Login} />
                <Route path={`${path}/signup`} exact component={Signup} />
                <Route path={`${path}/history`} exact component={GameHistory} />
            </Switch>
        </>
    );
}

export { AccountSwitch };
