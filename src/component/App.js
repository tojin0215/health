import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, Customer, AddCustomer, AddExercise, Sales, AddSales, Login,Statistics, Inbody, AddInbody, UpdateCustomer, DefaultExercise, AssignExercise, AssignCheckExercise} from '../page';


class App extends Component {
  render() {
    return (
        <div>
            <Route exact path="/" component={Login}/>
            <Route exact path="/home" component={Home}/>
            <Route exact path="/customer" component={Customer}/>
            <Route exact path="/customer/add" component={AddCustomer}/>
            <Route exact path="/customer/update:member_no" component={UpdateCustomer}/>
            <Route exact path="/exercise" component={AddExercise}/>
            <Route exact path="/setting/default" component={DefaultExercise}/>
            <Route exact path="/assign" component={AssignExercise}/>
            <Route exact path="/assign/check:member_no" component={AssignCheckExercise}/>
            <Route exact path="/assign/inbody:member_no" component={Inbody}/>
            <Route exact path="/assign/add:member_no" component={AddInbody}/>
            <Route exact path="/sales" component={Sales}/>
            <Route exact path="/sales/add" component={AddSales}/>
            <Route exact path="/statistics" component={Statistics}/>
        </div>
    );
  }
}

export default App;
