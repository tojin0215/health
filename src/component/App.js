import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, Customer, AddCustomer, Exercise, Sales, AddSales, Login,Statistics, Inbody, AddInbody } from '../page';
import { PackageSetting, AssignExercise } from '../page';

class App extends Component {
  render() {
    return (
        <div>
            <Route exact path="/" component={Login}/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/customer" component={Customer}/>
            <Route exact path="/customer/add" component={AddCustomer}/>
            <Route exact path="/exercise" component={Exercise}/>
            <Route exact path="/setting/package" component={PackageSetting}/>
            <Route exact path="/assign" component={AssignExercise}/>
            <Route exact path="/assign/inbody" component={Inbody}/>
            <Route exact path="/assign/add" component={AddInbody}/>
            <Route exact path="/sales" component={Sales}/>
            <Route exact path="/sales/add" component={AddSales}/>
            <Route exact path="/statistics" component={Statistics}/>
        </div>
    );
  }
}

export default App;
