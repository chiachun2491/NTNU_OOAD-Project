import { Route, Switch, useRouteMatch } from 'react-router-dom';
import GameRoomNotFound from '../components/errors/GameRoomNotFound';
import Game from '../pages/Game';
import Lobby from '../pages/Lobby';
import PageNotFound from '../components/errors/PageNotFound';

function GameSwitch() {
    let { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}/notFound`} exact component={GameRoomNotFound} />
                <Route path={`${path}/:roomName`} exact component={Game} />
                <Route path={path} exact component={Lobby} />
                <Route component={PageNotFound} />
            </Switch>
        </>
    );
}

export { GameSwitch };
