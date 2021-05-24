import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import CustomLayout from "./containers/Layout";
import {Home, Games, Account} from "./pages";
import Hello from "./components/Hello";
import Tutorial from './components/Tutorial';


class App extends Component {
  render() {
    return (
        <CustomLayout>
            <Route path="/"  exact component={Home}/>
            <Route path="/games"  component={Games}/>
            <Route path="/account"  component={Account}/>
            <Route path={"/hello/"} exact component={Hello}/>
            <Route path={"/tutorial/"} exact component={Tutorial}/>
        </CustomLayout>
    );
  }
}

export default App;
