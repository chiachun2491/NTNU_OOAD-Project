import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import CustomLayout from "./containers/Layout";
import {Home, Games, Profile, Account} from "./pages";
// import GameDetail from "./containers/GameDetail";
import Hello from "./components/Hello";


class App extends Component {
  render() {
    return (
        <CustomLayout>
            <Route path="/"  exact component={Home}/>
            <Route path="/games"  component={Games}/>
            <Route path="/account"  component={Account}/>
            <Route path={"/hello/"} exact component={Hello}/>

        </CustomLayout>
    );
  }
}

export default App;
