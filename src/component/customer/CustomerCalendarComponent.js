import React, { Component } from 'react';
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  getAssginExercise,
  getEnter,
  getReservation,
  selectTrainerReservation,
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
    selectTrainerReservation(
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

              const created_hour = value.time;
              const time_h = created_hour.split(':');
              // console.log(time_h[0], ':', time_h[1]);
              // console.log(parseInt(time_h[0]) + 1);

              const start = new Date(
                start_m.get('year'),
                start_m.get('month'),
                start_m.get('date'),
                parseInt(time_h[0]),
                parseInt(time_h[1])
              );
              const end = new Date(
                start_m.get('year'),
                start_m.get('month'),
                start_m.get('date'),
                parseInt(time_h[0]) + 1,
                parseInt(time_h[1])
              );

              console.debug('start::', start, 'end::', end);
              return {
                ...value,
                id: value.res_no,
                date: moment(value.date).format('YYYY-MM-DD'),
                customer_no: Number(value.customer_id),
                start: start,
                end: end,
                // allDay: true,
                title: `${value.exercise_name} [${value.time}]`,
                // title: `[${value.time}] ${value.customer_name} - ${value.exercise_name}`,
              };
            }),
        });
      });
    });
  };

  //안씀
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
        // console.log(result);
      }
    );
  };

  //안씀
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
    // console.log(this.state.enters);
    const complexData = [
      ...this.state.enters,
      ...this.state.assigned_exercise,
      ...this.state.reservations,
    ].filter((value) => value !== undefined);
    const events = complexData.map((value, index) => {
      value['id'] = index;
      return value;
    });
    var todayselect = document.querySelectorAll('.rbc-btn-group button');

    if (todayselect[0]) {
      todayselect[0].textContent = '오늘';
      todayselect[1].textContent = '이전';
      todayselect[2].textContent = '내일';
      todayselect[3].textContent = '월간';
      todayselect[4].textContent = '일간';
      todayselect[5].textContent = '주간';
      todayselect[6].textContent = '목록';
    }
    return (
      <div className='customercalendar' style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={this.state.reservations}
          startAccessor='start'
          endAccessor='end'
          views={['month', 'day', 'week', 'agenda']}
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
