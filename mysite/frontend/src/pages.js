import React from 'react';
import {useRouteMatch, Route, Switch} from 'react-router-dom';
import CustomButton from "./components/CustomButton";
import RoomItem from "./components/Room";
import Game from "./components/Game";
import Login from "./components/Login";
import Signup from "./components/Signup";


/**
 * These are root pages
 */
const Home = () => {
    return <h1 className="py-3">Home</h1>;
};

function Games() {
    let {path, url} = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}/:roomName`} exact component={Game}/>
                <Route path={path} exact>
                    <>
                        <CustomButton>新增房間</CustomButton>
                        <RoomItem roomName={'PbFTXG'} playerAmount={3}/>
                        <RoomItem roomName={'GrTniQ'} playerAmount={2}/>
                        <RoomItem roomName={'ib2wbs'} playerAmount={2}/>
                        <RoomItem roomName={'Y60qTZ'} playerAmount={1}/>
                    </>
                </Route>
            </Switch>
        </>
    );
};

const Profile = () => {
    const username = localStorage.getItem('username');
    return <h1 className='py-3'>{username}</h1>
};

function Account() {
    let {path, url} = useRouteMatch();
    return (
        <>
            <Switch>
                <Route path={`${path}`} exact component={Profile}/>
                <Route path={`${path}/login`} exact component={Login}/>
                <Route path={`${path}/signup`} exact component={Signup}/>
            </Switch>
        </>
    );
}


export {Home, Games, Profile, Account};