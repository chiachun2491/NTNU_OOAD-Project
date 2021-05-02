import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import CustomLayout from "./containers/Layout";
import {Home, Games, Profile} from "./pages";
import GameDetail from "./containers/GameDetail";



class App extends Component {
  render() {
    return (
        <CustomLayout>
            <Route path="/"  exact component={Home}/>
            <Route path="/games/:roomName/" exact component={GameDetail}/>
            <Route path="/games/" exact component={Games}/>
            <Route path="/profile/" exact component={Profile}/>

        </CustomLayout>
    );
  }
}

export default App;
