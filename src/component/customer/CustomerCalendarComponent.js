import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAssginExercise, getEnter, getReservation } from '../../api/user';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
moment.locale('ko-KR');
const localizer = momentLocalizer(moment); // or globalizeLocalizer

const events = [
	{
		id: 0,
		title: '[입장] 12:00',
		allDay: true,
		start: new Date(2015, 3, 0),
		end: new Date(2015, 3, 1),
	},
	{
		id: 1,
		title: '[입장] 12:00',
		start: new Date(2015, 3, 7),
		end: new Date(2015, 3, 10),
	},

	{
		id: 2,
		title: 'DTS STARTS',
		start: new Date(2016, 2, 13, 0, 0, 0),
		end: new Date(2016, 2, 20, 0, 0, 0),
	},

	{
		id: 3,
		title: 'DTS ENDS',
		start: new Date(2016, 10, 6, 0, 0, 0),
		end: new Date(2016, 10, 13, 0, 0, 0),
	},

	{
		id: 4,
		title: 'Some Event',
		start: new Date(2015, 3, 9, 0, 0, 0),
		end: new Date(2015, 3, 10, 0, 0, 0),
	},
	{
		id: 5,
		title: 'Conference',
		start: new Date(2015, 3, 11),
		end: new Date(2015, 3, 13),
		desc: 'Big conference for important people',
	},
	{
		id: 6,
		title: 'Meeting',
		start: new Date(2015, 3, 12, 10, 30, 0, 0),
		end: new Date(2015, 3, 12, 12, 30, 0, 0),
		desc: 'Pre-meeting meeting, to prepare for the meeting',
	},
	{
		id: 7,
		title: 'Lunch',
		start: new Date(2015, 3, 12, 12, 0, 0, 0),
		end: new Date(2015, 3, 12, 13, 0, 0, 0),
		desc: 'Power lunch',
	},
	{
		id: 8,
		title: 'Meeting',
		start: new Date(2015, 3, 12, 14, 0, 0, 0),
		end: new Date(2015, 3, 12, 15, 0, 0, 0),
	},
	{
		id: 9,
		title: 'Happy Hour',
		start: new Date(2015, 3, 12, 17, 0, 0, 0),
		end: new Date(2015, 3, 12, 17, 30, 0, 0),
		desc: 'Most important meal of the day',
	},
	{
		id: 10,
		title: 'Dinner',
		start: new Date(2015, 3, 12, 20, 0, 0, 0),
		end: new Date(2015, 3, 12, 21, 0, 0, 0),
	},
	{
		id: 11,
		title: 'Planning Meeting with Paige',
		start: new Date(2015, 3, 13, 8, 0, 0),
		end: new Date(2015, 3, 13, 10, 30, 0),
	},
	{
		id: 11.1,
		title: 'Inconvenient Conference Call',
		start: new Date(2015, 3, 13, 9, 30, 0),
		end: new Date(2015, 3, 13, 12, 0, 0),
	},
	{
		id: 11.2,
		title: "Project Kickoff - Lou's Shoes",
		start: new Date(2015, 3, 13, 11, 30, 0),
		end: new Date(2015, 3, 13, 14, 0, 0),
	},
	{
		id: 11.3,
		title: 'Quote Follow-up - Tea by Tina',
		start: new Date(2015, 3, 13, 15, 30, 0),
		end: new Date(2015, 3, 13, 16, 0, 0),
	},
	{
		id: 12,
		title: 'Late Night Event',
		start: new Date(2015, 3, 17, 19, 30, 0),
		end: new Date(2015, 3, 18, 2, 0, 0),
	},
	{
		id: 12.5,
		title: 'Late Same Night Event',
		start: new Date(2015, 3, 17, 19, 30, 0),
		end: new Date(2015, 3, 17, 23, 30, 0),
	},
	{
		id: 13,
		title: 'Multi-day Event',
		start: new Date(2015, 3, 20, 19, 30, 0),
		end: new Date(2015, 3, 22, 2, 0, 0),
	},
	{
		id: 14,
		title: 'Today',
		start: new Date(new Date().setHours(new Date().getHours() - 3)),
		end: new Date(new Date().setHours(new Date().getHours() + 3)),
	},
	{
		id: 16,
		title: 'Video Record',
		start: new Date(2015, 3, 14, 15, 30, 0),
		end: new Date(2015, 3, 14, 19, 0, 0),
	},
	{
		id: 17,
		title: 'Dutch Song Producing',
		start: new Date(2015, 3, 14, 16, 30, 0),
		end: new Date(2015, 3, 14, 20, 0, 0),
	},
	{
		id: 18,
		title: 'Itaewon Halloween Meeting',
		start: new Date(2015, 3, 14, 16, 30, 0),
		end: new Date(2015, 3, 14, 17, 30, 0),
	},
	{
		id: 19,
		title: 'Online Coding Test',
		start: new Date(2015, 3, 14, 17, 30, 0),
		end: new Date(2015, 3, 14, 20, 30, 0),
	},
	{
		id: 20,
		title: 'An overlapped Event',
		start: new Date(2015, 3, 14, 17, 0, 0),
		end: new Date(2015, 3, 14, 18, 30, 0),
	},
	{
		id: 21,
		title: 'Phone Interview',
		start: new Date(2015, 3, 14, 17, 0, 0),
		end: new Date(2015, 3, 14, 18, 30, 0),
	},
	{
		id: 22,
		title: 'Cooking Class',
		start: new Date(2015, 3, 14, 17, 30, 0),
		end: new Date(2015, 3, 14, 19, 0, 0),
	},
	{
		id: 23,
		title: 'Go to the gym',
		start: new Date(2015, 3, 14, 18, 30, 0),
		end: new Date(2015, 3, 14, 20, 0, 0),
	},
];

const demo_reservation = [{
	res_no: 0,
	date: moment().format("YYYY-MM-DD"),
	time: moment().format("hh:mm:ss"),
	exercise_name: "PT기구",
	customer_name: "이회원",
	customer_id: 6,
	isCancel: null,
	cancelComment: null,
}]

class CustomerCalendarComponent extends Component {
    state = {
        enters: [],
        assigned_exercise: [],
        reservations: [],
        fitness_no: 2,
        customer_no: 2,
    }
    constructor(props) {
        super(props);
		
        this.state = {
            enters: [],
            assigned_exercise: [],
			reservations: [],
            fitness_no: props.fitness_no? props.fitness_no : 2,
            customer_no: props.customer_no? props.customer_no : null,
        }
    }

    componentDidMount() {
        this.fetchEnter();
        this.fetchAssignExercise();
		this.fetchReservation();
    }

	fetchReservation = () => {
		getReservation(this.state.fitness_no)
		.then(result => {
			console.log("fetchReservation::", result);
			this.setState({
				reservations: result.map(value => {
					if (this.state.customer_no !== null && this.state.customer_no !== Number(value.customer_id)) return

					const created = moment(value.date);
					const start_m = moment(created.format("YYYY-MM-DD"));
					const ent_m = moment(created.format("YYYY-MM-DD")).add(1, "day");

					const start = new Date(start_m.get("year"), start_m.get("month"), start_m.get("date"));
					const end = new Date(ent_m.get("year"), ent_m.get("month"), ent_m.get("date"));

					console.log("start::", start, "end::", end)

					return {
						...value,
						id: value.res_no,
						date: moment(value.date).format("YYYY-MM-DD"),
						customer_no: Number(value.customer_id),
						start: start,
						end: end,
						allDay: true,
						title: `[${value.time}] ${value.customer_name} - ${value.exercise_name}`
					}
				})
			})
		})
	}

    fetchAssignExercise = () => {
        getAssginExercise(this.state.fitness_no, this.state.customer_no)
        .then(result => {
            const added_date = [];
            this.setState({
                assigned_exercise: result.map(item => {
					if (this.state.customer_no !== null && this.state.customer_no !== Number(item.customer_id)) return

                    const created = moment(item.createdAt);
					const start_m = moment(created.format("YYYY-MM-DD"));
					const ent_m = moment(created.format("YYYY-MM-DD")).add(1, "day");
                    const d = created.format("YYYY-MM-DD");
					
                    // console.debug(`start: ${item.createdAt} => ${d} => ${start_m.get("year")}-${start_m.get("month")}-${start_m.get("date")}`);
                    // console.debug(`end: ${item.createdAt} => ${d} => ${ent_m.get("year")}-${ent_m.get("month")}-${ent_m.get("date")}`);

                    if (added_date.indexOf(d) >= 0) return;
                    else added_date.push(d);

                    const start = new Date(start_m.get("year"), start_m.get("month"), start_m.get("date"));
                    const end = new Date(ent_m.get("year"), ent_m.get("month"), ent_m.get("date"));

                    return {
                        id: item.assign_exercise_no,
                        assign_exercise_no: item.assign_exercise_no,
                        customer_no: item.customer_no,
                        created: created,
                        start: start,
                        end: end,
                        allDay: true,
                        title: `[헬스 운동배정]`,
                    }
                }).filter(item => item != undefined)
            })
        })

    }

    fetchEnter = () => {
        getEnter(this.state.fitness_no)
        .then(result => {
            const added_date = [];
            this.setState({
                enters: result.map(item => {
					if (this.state.customer_no !== null && this.state.customer_no !== Number(item.customer_id)) return

                    const created = moment(item.created);
					const start_m = moment(created.format("YYYY-MM-DD"));
					const ent_m = moment(created.format("YYYY-MM-DD")).add(1, "day");
                    const d = created.format("YYYY-MM-DD");
					
                    console.debug(`start: ${item.createdAt} => ${d} => ${start_m.get("year")}-${start_m.get("month")}-${start_m.get("date")}`);
                    console.debug(`end: ${item.createdAt} => ${d} => ${ent_m.get("year")}-${ent_m.get("month")}-${ent_m.get("date")}`);
                    if (added_date.indexOf(d) >= 0) return;
                    else added_date.push(d);

                    const start = new Date(start_m.get("year"), start_m.get("month"), start_m.get("date"));
                    const end = new Date(ent_m.get("year"), ent_m.get("month"), ent_m.get("date"));

                    return {
                        id: item.customer_enter_no,
                        customer_enter_no: item.customer_enter_no,
                        customer_no: item.customer_no,
                        created: created,
                        start: start,
                        end: end,
                        is_checked: item.is_checked,
                        allDay: true,
                        title: `[입장] ${created.format("hh:mm")}`,
                    }
                }).filter(item => item != undefined)
            })
        })
    }

	handleOnSelectEvent = event => {
		alert(event.title)
	}

	render() {
        const complexData = [...this.state.enters, ...this.state.assigned_exercise, ...this.state.reservations].filter(value => value !== undefined)
        const events = complexData.map((value, index) => {
            value['id'] = index;
            return value;
        })
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

export default CustomerCalendarComponent;
