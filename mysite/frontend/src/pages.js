// /src/pages.js

import React from 'react';
import CustomButton from "./components/CustomButton";
import RoomItem from "./components/Room";


/**
 * These are root pages
 */
const Home = () => {
  return <h1 className="py-3">Home</h1>;
};

const Games = () => {
  return <div>
                <CustomButton>新增房間</CustomButton>
                <RoomItem roomName={'PbFTXG'} playerAmount={3}/>
                <RoomItem roomName={'GrTniQ'} playerAmount={2}/>
                <RoomItem roomName={'ib2wbs'} playerAmount={2}/>
                <RoomItem roomName={'Y60qTZ'} playerAmount={1}/>
            </div>;
};

const Profile = () => {
  return<h1 className='py-3'>Profile</h1>
};


export { Home, Games, Profile };