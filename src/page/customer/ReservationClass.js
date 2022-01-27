import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);
import { getStatusRequest } from '../../action/authentication';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
import moment from 'moment';
const ip = SERVER_URL;

const ReservationClassItem = ({
	exercise_class,
	no,
	number_of_people,
	reserv_time,
	reservationClassSelect,
	fitness_no,
	hour,
	minute,
	trainer
}) => {
	const reservationClassDelete = (no) => {
		fetch(ip + '/reservationClass/delete?no=' + no, {
			method: 'DELETE',
		}).then((result) => {
			alert('삭제');
			reservationClassSelect();
		});
	};
	const [showResults, setShowResults] = React.useState(false);

	const [exercise_class_err, setExercise_class_err] = useState(false);
	const [number_of_people_err, setNumber_of_people_err] = useState(false);
	const [hour_err, setHour_err] = useState(false);
	const [minute_err, setMinute_err] = useState(false);
	const [trainer_err, setTrainer_err] = useState(false);

	const [exercise_class_input, setExercise_class_input] = useState('');
	const [trainer_input, setTrainer_input] = useState('');
	const [number_of_people_input, setNumber_of_people_input] = useState('');
	const [hour_input, setHour_input] = useState('');
	const [minute_input, setMinute_input] = useState('');
	const updateOnClick = () => {
		setShowResults(true);
		setExercise_class_input(exercise_class);
		setNumber_of_people_input(number_of_people);
		setHour_input(hour);
		setMinute_input(minute);
		setTrainer_input(trainer)
	};
	const updateClose = () => {
		setShowResults(false);
	};
	const updateChange = (e) => {
		setExercise_class_input(e.target.value);
	};
	const updateChange2 = (e) => {
		setNumber_of_people_input(e.target.value);
	};
	const updateChange3 = (e) => {
		setHour_input(e.target.value);
	};
	const updateChange4 = (e) => {
		setMinute_input(e.target.value);
	};
	const updateChange5 = (e) => {
		setTrainer_input(e.target.value);
	};
	const reservationClassUpdate = (no) => {
		if (exercise_class_input == '') {
			setExercise_class_err(true);
			alert('운동명을 써주세요.');
		}
		else if (trainer_input == '') {
			setTrainer_err(true);
			alert('트레이너명을 써주세요.');
		} else if ((number_of_people_input == '', number_of_people_input == 0)) {
			setNumber_of_people_err(true);
			alert('인원을 확인해 주세요.(숫자만, 0입력불가)');
		} else if (hour_input >= 24) {
			setHour_err(true);
			alert('00~23시까지 설정 가능합니다.');
		} else if (minute_input >= 59) {
			setMinute_err(true);
			alert('0~59분까지 설정 가능합니다.');
		} else {
			fetch(ip + '/reservationClass/update?no=' + no, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					fitness_no: fitness_no,
					exercise_class: exercise_class_input,
					number_of_people: number_of_people_input,
					hour: hour_input,
					minute: minute_input,
					trainer: trainer_input
				}),
			})
				.then((result) => result.json())
				.then((result) => {
					console.log(result);
					alert('변경 완료');
					updateClose();
					reservationClassSelect();
				});
		}
	};

	return (
		<tr className='classModifyTable'>
			{showResults ? (
				<td>
					<input
						value={exercise_class_input}
						id='exercise_class'
						onChange={updateChange}
						error={exercise_class_err}
					/>
				</td>
			) : (
				<td>{exercise_class}</td>
			)}
			{showResults ? (
				<td>
					<input
						value={trainer_input}
						id='trainer_input'
						onChange={updateChange5}
						error={trainer_input_err}
					/>
				</td>
			) : (
				<td>{trainer}</td>
			)}
			{showResults ? (
				<td>
					<input
						type='number'
						value={number_of_people_input}
						id='number_of_people'
						onChange={updateChange2}
						error={number_of_people_err}
					/>
				</td>
			) : (
				<td>{number_of_people}</td>
			)}
			{showResults ? (
				<td>
					<input
						value={hour_input == 0 ? '00' : hour_input}
						type='number'
						id='hour'
						onChange={updateChange3}
						error={hour_err}
					/>
					:
					<input
						type='number'
						value={minute_input == 0 ? '00' : minute_input}
						id='minute'
						onChange={updateChange4}
						error={minute_err}
					/>
				</td>
			) : (
				<td>
					{hour == 1
						? '01'
						: hour == 2
							? '02'
							: hour == 3
								? '03'
								: hour == 4
									? '04'
									: hour == 5
										? '05'
										: minute == 6
											? '06'
											: hour == 7
												? '07'
												: hour == 8
													? '09'
													: hour == 0
														? '00'
														: hour}
					:
					{minute == 1
						? '01'
						: minute == 2
							? '02'
							: minute == 3
								? '03'
								: minute == 4
									? '04'
									: minute == 5
										? '05'
										: minute == 6
											? '06'
											: minute == 7
												? '07'
												: minute == 8
													? '09'
													: minute == 0
														? '00'
														: minute}
				</td>
			)}

			<td>
				<button onClick={() => reservationClassDelete(no)}>삭제</button>
			</td>
			{showResults ? (
				<td>
					<button onClick={() => reservationClassUpdate(no)}>변경하기</button>
				</td>
			) : (
				<td>
					<button onClick={() => updateOnClick()}>변경하기</button>
				</td>
			)}
		</tr>
	);
};

class ReservationClass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exercise_class: '',
			fitness_no: 2,
			number_of_people: '',
			reservationClass: [],
			hour: '',
			minute: '',
			trainer: '',

			hour_err: false,
			minute_err: false,
			exercise_class_err: false,
			number_of_people_err: false,
			trainer_err: false,
			// radioGroup: {
			//     ten: true,
			//     eleven: false,
			//     twelve: false,
			//     thirteen: false,
			// },
		};
		this.reservationClassSelect();
	}

	componentDidMount() {
		//컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
		// get cookie by name
		function getCookie(name) {
			var value = '; ' + document.cookie;
			var parts = value.split('; ' + name + '=');
			if (parts.length == 2) return parts.pop().split(';').shift();
		}

		// get loginData from cookie
		let loginData = getCookie('key');
		// if loginData is undefined, do nothing
		if (typeof loginData === 'undefined') {
			this.props.history.push('/');
			return;
		}

		// decode base64 & parse json
		loginData = JSON.parse(atob(loginData));
		// if not logged in, do nothing
		if (!loginData.isLoggedIn) {
			this.props.history.push('/');
			return;
		}

		// page refreshed & has a session in cookie,
		// check whether this cookie is valid or not
		this.props.getStatusRequest().then(() => {
			// if session is not valid
			if (!this.props.status.valid) {
				// logout the session
				loginData = {
					isLoggedIn: false,
					id: '',
				};

				document.cookie = 'key=' + btoa(JSON.stringify(loginData));

				// and notify
				alert('Your session is expired, please log in again');
			} else {
				this.reservationClassSelect();
			}
		});
	}

	reservationClassSelect = () => {
		fetch(
			ip +
			'/reservationClass/select?fitness_no=' +
			this.props.userinfo.fitness_no,
			{
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
				},
			}
		)
			.then((result) => result.json())
			.then((result) => {
				const items = result.map((data, index, array) => {
					return (
						<ReservationClassItem
							fitness_no={this.props.userinfo.fitness_no}
							reservationClassSelect={this.reservationClassSelect}
							exercise_class={data.exercise_class}
							no={data.no}
							number_of_people={data.number_of_people}
							hour={data.hour}
							minute={data.minute}
							trainer={data.trainer}
						/>
					);
				});
				this.setState({ reservationClass: items });
			});
	};

	handleOnClick = () => {
		this.setState({
			exercise_class_err: false,
			number_of_people_err: false,
			hour_err: false,
			minute_err: false,
			trainer_err: false
		});
		if (this.state.exercise_class == '') {
			this.setState({ exercise_class_err: true });
			alert('운동명을 써주세요.');
		} else if (this.state.trainer == '') {
			this.setState({ trainer_err: true });
			alert('트레이너명을 써주세요.');
		}
		else if (
			(this.state.number_of_people == '', this.state.number_of_people == 0)
		) {
			this.setState({ number_of_people_err: true });
			alert('인원을 확인해 주세요.(숫자만, 0입력불가)');
		} else if (this.state.hour >= 24) {
			this.setState({ hour_err: true });
			alert('00~23시까지 설정 가능합니다.');
		} else if (this.state.minute >= 59) {
			this.setState({ minute_err: true });
			alert('0~59분까지 설정 가능합니다.');
		} else if (this.state.hour == '') {
			this.setState({ hour_err: true });
			alert('시를 확인해 주세요.(0~24)');
		} else if (this.state.minute == '') {
			this.setState({ minute_err: true });
			alert('분을 확인해 주세요.(0~59)');
		} else {
			fetch(ip + '/reservationClass/insert', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					fitness_no: this.props.userinfo.fitness_no,
					exercise_class: this.state.exercise_class,
					number_of_people: this.state.number_of_people,
					hour: this.state.hour,
					minute: this.state.minute,
					trainer: this.state.trainer
					// this.state.radioGroup.ten == true
					//     ? '10'
					//     : this.state.radioGroup.eleven == true
					//         ? '11'
					//         : this.state.radioGroup.twelve == true
					//             ? '12'
					//             : this.state.radioGroup.thirteen == true
					//                 ? '13'
					//                 : '00'
				}),
			})
				.then((result) => result.json())
				.then((result) => {
					if (result.message == 'ok') {
						alert('운동 설정이 완료되었습니다.');
					} else {
						alert(result.message);
					}
					this.reservationClassSelect();
				});
		}
	};
	// handleRadio = (event) => {
	// 	let obj = {
	// 		ten: false,
	// 		eleven: false,
	// 		twelve: false,
	// 		thirteen: false,
	// 	};
	// 	obj[event.target.id] = event.target.checked; // true
	// 	console.debug(obj);
	// 	this.setState({
	// 		radioGroup: obj,
	// 	});
	// };
	handleChange = (e) => {
		this.setState({
			[e.target.id]: e.target.value,
		});
	};

	render() {
		return (
			<div className='reservationClassWrap'>
				<header className='header'>
					<Header />
					<Navigation goLogin={this.goLogin} />
					<MegaMenu />
					<div className='localNavigation'>
						<div className='container'>
							<h2>
								<div className='parallelogram'></div>
								운동 설정하기
								<span>.</span>
							</h2>
							<div className='breadCrumb'>
								<Link to='/home'>HOME</Link>
								<span>&#62;</span>
								<Link to='/reservationClass'>운동 설정하기</Link>
							</div>
							{/*.breadCrumb */}
						</div>
						{/*.container */}
					</div>
					{/*.localNavigation */}
				</header>

				<Container>
					<Row className='pb-5 justify-content-center'>
						<Col className='text-end'>
							<Link to='/reservation'>
								<button>돌아가기</button>
							</Link>
						</Col>
						<table class='table'>
							<thead>
								<tr>
									<th scope='col'>설정된 운동명</th>
									<th scope='col'>배정된 트레이너명</th>
									<th scope='col'>제한 인원</th>
									<th scope='col'>시간</th>
								</tr>
							</thead>
							<tbody>
								{this.state.reservationClass.length == 0 ? (
									<p>'설정된 운동이 없습니다.'</p>
								) : (
									this.state.reservationClass
								)}
							</tbody>
						</table>
						<Col className='classInputRow text-center py-2' xs={12}>
							<TextField
								id='exercise_class'
								value={this.state.exercise_class}
								onChange={this.handleChange}
								InputProps={{ disableUnderline: true }}
								label='운동명'
								error={this.state.exercise_class_err}
							/>
							<TextField
								id='trainer'
								value={this.state.trainer}
								onChange={this.handleChange}
								InputProps={{ disableUnderline: true }}
								label='트레이너명'
								error={this.state.trainer_err}
							/>

							<TextField
								type='number'
								id='number_of_people'
								value={this.state.number_of_people}
								onChange={this.handleChange}
								InputProps={{ disableUnderline: true }}
								label='제한 인원 수'
								error={this.state.number_of_people_err}
							/>
							<TextField
								type='number'
								id='hour'
								value={this.state.hour}
								onChange={this.handleChange}
								InputProps={{ disableUnderline: true }}
								label='시'
								error={this.state.hour_err}
							/>
							<TextField
								type='number'
								id='minute'
								value={this.state.minute}
								onChange={this.handleChange}
								InputProps={{ disableUnderline: true }}
								label='분'
								error={this.state.minute_err}
							/>
							{/* <label className='customerResi'>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='ten'
                                        checked={this.state.radioGroup['ten']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>10:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='eleven'
                                        checked={this.state.radioGroup['eleven']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>11:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='twelve'
                                        checked={this.state.radioGroup['twelve']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>12:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='thirteen'
                                        checked={this.state.radioGroup['thirteen']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>13:00</span>
                                </label>
                            </label> */}
						</Col>
						<button
							className='mx-4 btnSolid'
							type='button'
							onClick={this.handleOnClick}
						>
							운동 설정하기
						</button>
					</Row>
				</Container>
				<div className='footer'>
					<Footer />
				</div>
			</div>
		);
	}
}

const ReservationClassStateToProps = (state) => {
	return {
		userinfo: state.authentication.userinfo,
		status: state.authentication.status,
	};
};

const ReservationClassDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: () => {
			return dispatch(getStatusRequest());
		},
	};
};

export default connect(
	ReservationClassStateToProps,
	ReservationClassDispatchToProps
)(ReservationClass);
