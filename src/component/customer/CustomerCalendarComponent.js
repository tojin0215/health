import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  getAssginExercise,
  getEnter,
  getReservation,
  selectReservation,
} from '../../api/user';
import { connect } from 'react-redux';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
moment.locale('ko-KR');
const localizer = momentLocalizer(moment); // or globalizeLocalizer

class CustomerCalendarComponent extends Component {
  state = {
    enters: [],
    assigned_exercise: [],
    reservations: [],
    fitness_no: 2,
    customer_no: 2,
  };
  constructor(props) {
    super(props);

    this.state = {
      enters: [],
      assigned_exercise: [],
      reservations: [],
      fitness_no: this.props.userinfo.fitness_no,
      customer_no: props.customer_no,
    };
    // console.log(this.props.userinfo.fitness_no);
    // console.log(props.customer_no);
  }

  componentDidMount() {
    this.fetchEnter();
    this.fetchAssignExercise();
    this.fetchReservation();
  }

  fetchReservation = () => {
    selectReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      getReservation(fitness_no).then((result) => {
        console.debug('fetchReservation::', result);
        this.setState({
          reservations: result
            .filter(
              (value) => Number(value.customer_id) === this.props.customer_no
            )
            .map((value) => {
              if (
                this.state.customer_no !== null &&
                this.state.customer_no !== Number(value.customer_id)
              )
                return;

              const created = moment(value.date);
              const start_m = moment(created.format('YYYY-MM-DD'));
              const ent_m = moment(created.format('YYYY-MM-DD')).add(1, 'day');

              const start = new Date(
                start_m.get('year'),
                start_m.get('month'),
                start_m.get('date')
              );
              const end = new Date(
                ent_m.get('year'),
                ent_m.get('month'),
                ent_m.get('date')
              );

              console.debug('start::', start, 'end::', end);

              return {
                ...value,
                id: value.res_no,
                date: moment(value.date).format('YYYY-MM-DD'),
                customer_no: Number(value.customer_id),
                start: start,
                end: end,
                allDay: true,
                title: `[${value.time}] ${value.customer_name} - ${value.exercise_name}`,
              };
            }),
        });
      });
    });
  };

  fetchAssignExercise = () => {
    getAssginExercise(this.state.fitness_no, this.state.customer_no).then(
      (result) => {
        const added_date = [];
        this.setState({
          assigned_exercise: result
            .map((item) => {
              if (
                this.state.customer_no !== null &&
                this.state.customer_no !== Number(item.customer_id)
              )
                return;

              const created = moment(item.createdAt);
              const start_m = moment(created.format('YYYY-MM-DD'));
              const ent_m = moment(created.format('YYYY-MM-DD')).add(1, 'day');
              const d = created.format('YYYY-MM-DD');

              // console.debug(`start: ${item.createdAt} => ${d} => ${start_m.get("year")}-${start_m.get("month")}-${start_m.get("date")}`);
              // console.debug(`end: ${item.createdAt} => ${d} => ${ent_m.get("year")}-${ent_m.get("month")}-${ent_m.get("date")}`);

              if (added_date.indexOf(d) >= 0) return;
              else added_date.push(d);

              const start = new Date(
                start_m.get('year'),
                start_m.get('month'),
                start_m.get('date')
              );
              const end = new Date(
                ent_m.get('year'),
                ent_m.get('month'),
                ent_m.get('date')
              );

              return {
                id: item.assign_exercise_no,
                assign_exercise_no: item.assign_exercise_no,
                customer_no: item.customer_no,
                created: created,
                start: start,
                end: end,
                allDay: true,
                title: `[헬스 운동배정]`,
              };
            })
            .filter((item) => item != undefined),
        });
        console.log(result);
      }
    );
  };

  fetchEnter = () => {
    getEnter(this.state.fitness_no).then((result) => {
      const added_date = [];
      this.setState({
        enters: result
          .map((item) => {
            if (
              this.state.customer_no !== null &&
              this.state.customer_no !== Number(item.customer_id)
            )
              return;

            const created = moment(item.created);
            const start_m = moment(created.format('YYYY-MM-DD'));
            const ent_m = moment(created.format('YYYY-MM-DD')).add(1, 'day');
            const d = created.format('YYYY-MM-DD');

            console.debug(
              `start: ${item.createdAt} => ${d} => ${start_m.get(
                'year'
              )}-${start_m.get('month')}-${start_m.get('date')}`
            );
            console.debug(
              `end: ${item.createdAt} => ${d} => ${ent_m.get(
                'year'
              )}-${ent_m.get('month')}-${ent_m.get('date')}`
            );
            if (added_date.indexOf(d) >= 0) return;
            else added_date.push(d);

            const start = new Date(
              start_m.get('year'),
              start_m.get('month'),
              start_m.get('date')
            );
            const end = new Date(
              ent_m.get('year'),
              ent_m.get('month'),
              ent_m.get('date')
            );

            return {
              id: item.customer_enter_no,
              customer_enter_no: item.customer_enter_no,
              customer_no: item.customer_no,
              created: created,
              start: start,
              end: end,
              is_checked: item.is_checked,
              allDay: true,
              title: `[입장] ${created.format('hh:mm')}`,
            };
          })
          .filter((item) => item != undefined),
      });
    });
  };

  handleOnSelectEvent = (event) => {
    alert(event.title);
  };

  render() {
    const complexData = [
      ...this.state.enters,
      ...this.state.assigned_exercise,
      ...this.state.reservations,
    ].filter((value) => value !== undefined);
    const events = complexData.map((value, index) => {
      value['id'] = index;
      return value;
    });
    return (
      <div className='customercalendar' style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          views={['month']}
          onSelectEvent={this.handleOnSelectEvent}
          defaultDate={new Date()}
        />
      </div>
    );
  }
}
const CustomerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

export default connect(CustomerStateToProps)(CustomerCalendarComponent);
