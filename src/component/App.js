import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { Home, Customer, AddCustomer, Exercise, Sales, AddSales, Login } from '../page';

class App extends Component {
  render() {
    return (
        <div>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/" component={Home}/>
            <Route exact path="/customer" component={Customer}/>
            <Route exact path="/customer/add" component={AddCustomer}/>
            <Route exact path="/exercise" component={Exercise}/>
            <Route exact path="/sales" component={Sales}/>
            <Route exact path="/sales/add" component={AddSales}/>
        </div>
    );
  }
}

export default App;
