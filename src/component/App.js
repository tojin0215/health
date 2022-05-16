import React, { Component } from "react";
import { Route } from "react-router-dom";
import {
  Home,
  Customer,
  AddCustomer,
  AddExercise,
  Sales,
  AddSales,
  Login,
  Statistics,
  Inbody,
  AddInbody,
  UpdateCustomer,
  DefaultExercise,
  AssignExercise,
  AssignCheckExercise,
  AssignCustomer,
  Admin,
  QRLogin,
  Register,
  CustomerCalendar,
  Reservation,
  ReservationClass,
  ReservationUpdate,
  Trainer,
  AddTrainer,
} from "../page";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/customer" component={Customer} />
        <Route exact path="/customer/add" component={AddCustomer} />
        <Route exact path="/customer/update" component={UpdateCustomer} />
        <Route exact path="/exercise" component={AddExercise} />
        <Route exact path="/setting/default" component={DefaultExercise} />
        <Route exact path="/assign" component={AssignExercise} />
        <Route exact path="/assign/check" component={AssignCheckExercise} />
        <Route exact path="/assign/customer" component={AssignCustomer} />
        <Route exact path="/assign/inbody" component={Inbody} />
        <Route exact path="/assign/add" component={AddInbody} />
        <Route exact path="/sales" component={Sales} />
        <Route exact path="/sales/add" component={AddSales} />
        <Route exact path="/statistics" component={Statistics} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/qr" component={QRLogin} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/test" component={CustomerCalendar} />
        <Route exact path="/reservation" component={Reservation} />
        <Route exact path="/reservationClass" component={ReservationClass} />
        <Route exact path="/reservation/update" component={ReservationUpdate} />
        <Route exact path="/trainer" component={Trainer} />
        <Route exact path="/trainer/add" component={AddTrainer} />
      </div>
    );
  }
}

export default App;
