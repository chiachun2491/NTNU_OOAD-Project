import React from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';
import Game from './components/Game';
import Login from './components/Login';
import Signup from './components/Signup';
import Lobby from './components/Lobby';
import History from './components/History';
import GameRoomNotFound from './components/GameRoomNotFound';

/**
 * These are root pages
 */
function Games() {
    let { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}/notFound`} exact component={GameRoomNotFound} />
                <Route path={`${path}/:roomName`} exact component={Game} />
                <Route path={path} exact component={Lobby} />
            </Switch>
        </>
    );
}

const Profile = () => {
    const username = localStorage.getItem('username');
    return <h1 className='py-3'>{username}</h1>;
};

function Account() {
    let { path } = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}`} exact component={Profile} />
                <Route path={`${path}/login`} exact component={Login} />
                <Route path={`${path}/signup`} exact component={Signup} />
                <Route path={`${path}/history`} exact component={History} />
            </Switch>
        </>
    );
}

export { Games, Profile, Account };
