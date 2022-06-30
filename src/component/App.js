import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  Admin,
  AddCustomer,
  Customer,
  Reservation,
  ReservationClass,
  ReservationUpdate,
  CustomerCalendar,
  UpdateCustomer,
  AddInbody,
  AssignCheckExercise,
  AssignCustomer,
  AssignExercise,
  Inbody,
  Home,
  Login,
  // QRLogin,
  Register,
  AddSales,
  Sales,
  AddExercise,
  DefaultExercise,
  Statistics,
  AddTrainer,
  Trainer,
  Client,
  AddClient,
  Introduce,
  AddIntroduce,
  ChoiceLogin,
  Inbodies,
  WorkoutAlloted,
  WorkoutAllotedList,
  WorkoutAdd,
  WorkoutStage,
  WorkoutStageAdd,
} from '../page';

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={Login} />
        <Route exact path='/home' component={Home} />
        <Route exact path='/customer' component={Customer} />
        <Route exact path='/customer/add' component={AddCustomer} />
        <Route exact path='/customer/update' component={UpdateCustomer} />
        <Route exact path='/exercise' component={AddExercise} />
        <Route exact path='/setting/default' component={DefaultExercise} />
        <Route exact path='/assign' component={AssignExercise} />
        <Route exact path='/assign/check' component={AssignCheckExercise} />
        <Route exact path='/assign/customer' component={AssignCustomer} />
        <Route exact path='/assign/inbody' component={Inbody} />
        <Route exact path='/inbodies/add' component={AddInbody} />
        <Route exact path='/sales' component={Sales} />
        <Route exact path='/addSales' component={AddSales} />
        <Route exact path='/statistics' component={Statistics} />
        <Route exact path='/admin' component={Admin} />
        {/* <Route exact path='/qr' component={QRLogin} /> */}
        <Route exact path='/register' component={Register} />
        <Route exact path='/test' component={CustomerCalendar} />
        <Route exact path='/reservation' component={Reservation} />
        <Route exact path='/reservationClass' component={ReservationClass} />
        <Route exact path='/reservation/update' component={ReservationUpdate} />
        <Route exact path='/trainer' component={Trainer} />
        <Route exact path='/trainer/add' component={AddTrainer} />
        <Route exact path='/client' component={Client} />
        <Route exact path='/client/add' component={AddClient} />
        <Route exact path='/introduce' component={Introduce} />
        <Route exact path='/introduce/add' component={AddIntroduce} />
        <Route exact path='/choiceLogin' component={ChoiceLogin} />
        <Route exact path='/inbodies' component={Inbodies} />
        <Route exact path='/workoutAlloted' component={WorkoutAlloted} />
        <Route
          exact
          path='/workoutAllotedList'
          component={WorkoutAllotedList}
        />
        <Route exact path='/workoutAdd' component={WorkoutAdd} />
        <Route exact path='/workoutStage' component={WorkoutStage} />
        <Route exact path='/workoutStageAdd' component={WorkoutStageAdd} />
      </div>
    );
  }
}

export default App;
