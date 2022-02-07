import React, { Component, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';

import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);
import { getStatusRequest } from '../../action/authentication';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';
import styles from '../../styles/customer/reservation.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import ReservationPresetList from '../../component/reservation/ReservationPresetList';
import ReservationList from '../../component/reservation/ReservationList';
import UserSearch from '../../component/customer/UserSearch';

const ip = SERVER_URL;

const dateFormat = (reserv_date) => {
	let month = reserv_date.getMonth() + 1;
	let day = reserv_date.getDate();
	let hour = reserv_date.getHours();
	let minute = reserv_date.getMinutes();
	let second = reserv_date.getSeconds();

	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;
	second = second >= 10 ? second : '0' + second;

	return (
		reserv_date.getFullYear() +
		'-' +
		month +
		'-' +
		day +
		'T' +
		hour +
		':' +
		minute +
		':' +
		second
	);
};

const ReservationClassItem = ({
	exercise_class,
	number_of_people,
	hour,
	minute,
	handleClick,
	canRegist,
	trainer,
	reservationSelect,
}) => {
	const [input, setInput] = useState('');
	const [input2, setInput2] = useState('');
	const [input3, setInput3] = useState('');
	const [input4, setInput4] = useState('');
	const [input5, setInput5] = useState('');
	const handleClick2 = () => {
		setInput(exercise_class);
		setInput2(number_of_people);
		setInput3(hour);
		setInput4(minute);
		setInput5(trainer);
		handleClick(exercise_class, hour, minute, number_of_people, trainer);
	};

	return (
		<tr>
			<td>{exercise_class}</td>
			<td>{trainer}</td>
			<td>
				{canRegist}/{number_of_people}
			</td>
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
					? '08'
					: hour == 9
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
					? '08'
					: minute == 9
					? '09'
					: minute == 0
					? '00'
					: minute}
			</td>
			<td>
				<button className='selectButton btnSolid fs-4' onClick={handleClick2}>
					선택
				</button>
			</td>
		</tr>
	);
};

const ReservationItem = ({
	res_no,
	date,
	exercise_name,
	fitness_no,
	customer_name,
	isCancel,
	cancelComment,
	number_of_people,
	time,
	date2,
	exercise_length,
	customer_id,
	reservationSelect,
	trainer,
}) => {
	const [showResults, setShowResults] = React.useState(false);
	const [date_input, setDate_input] = useState('');
	const [time_input, setTime_input] = useState('');
	const [exercise_name_input, setExercise_name_input] = useState('');
	const [trainer_input, setTrainer_input] = useState('');
	// const [isCancel_input, setIsCancel_input] = useState('');
	// const [cancelComment_input, setCancelComment_input] = useState('');
	const [number_of_people_input, setNumber_of_people_input] = useState('');

	const updateOnClick = () => {
		setShowResults(true);
		setDate_input(date2);
		setTime_input(time);
		setExercise_name_input(exercise_name);
		setTrainer_input(trainer);
		// setIsCancel_input(isCancel)
		// setCancelComment_input(cancelComment)
		setNumber_of_people_input(number_of_people);
	};
	const updateClose = () => {
		setShowResults(false);
	};
	const handleChangeDate = (e) => {
		setDate_input(e.target.value);
	};
	const handleChangeIsCancel = (e) => {
		setIsCancel_input(e.target.value);
	};
	const handleChangeCancelComment = (e) => {
		setCancelComment_input(e.target.value);
	};

	const reservationUpdate = (res_no) => {
		fetch(ip + '/reservation/update?res_no=' + res_no, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				time: time,
				exercise_name: exercise_name_input,
				number_of_people: number_of_people_input,
				date: date_input,
				trainer: trainer_input,
				// isCancel: isCancel_input,
				// cancelComment: cancelComment_input
			}),
		}).then((result) => {
			console.log(result);
			alert('예약변경완료');
			reservationSelect();
			updateClose();
		});
	};

	const reservationDelete = (res_no) => {
		fetch(ip + '/reservation/delete?res_no=' + res_no, {
			method: 'DELETE',
		}).then((result) => {
			reservationSelect();
		});
	};

	return (
		<tr>
			<td>
				[{customer_id}]{customer_name}
			</td>

			{showResults ? (
				<td>
					{/* <input value={date_input} id='date' onChange={handleChangeDate} /> */}
					<DatePicker
						value={date_input}
						seleted={date_input}
						id='date'
						onChange={handleChangeDate}
						dateFormat='yyyy-MM-dd(eee)'
						font-size='1.6rem'
						locale='ko'
					/>
				</td>
			) : (
				<td>{date}</td>
			)}
			{showResults ? (
				<td>
					<input value={exercise_name_input} id='exercise_name' />
				</td>
			) : (
				<td>{exercise_name}</td>
			)}
			{showResults ? (
				<td>
					<input value={trainer_input} id='trainer' />
				</td>
			) : (
				<td>{trainer}</td>
			)}
			{showResults ? (
				<td>
					{exercise_length + '/'}
					<input value={number_of_people_input} id='number_of_people' />
				</td>
			) : (
				<td>{exercise_length + '/' + number_of_people}</td>
			)}
			{showResults ? (
				<td>
					<input value={time_input} id='time' />
				</td>
			) : (
				<td>{time}</td>
			)}

			{/* {showResults ?
                <td><input value={isCancel_input == null ? '예약 완료' : '예약취소'} id='isCancel' onChange={handleChangeIsCancel} /></td>
                :
                <td>{isCancel == null ? '예약 완료' : '예약취소'}</td>}
            {showResults ?
                <td><input value={cancelComment_input} id='cancelComment' onChange={handleChangeCancelComment} /></td>
                :
                <td>{cancelComment}</td>} */}

			<td>
				<button
					className='deleteButton'
					onClick={() =>
						confirm('정말 삭제하시겠습니까??') == true
							? reservationDelete(res_no)
							: alert('삭제가 취소 되었습니다.')
					}
				>
					삭제
				</button>
			</td>
			{/* {showResults ?
                <td><button onClick={() => reservationUpdate(res_no)}>수정하기...</button></td>
                :
                <td><button onClick={() => updateOnClick()}>수정하기</button></td>
            } */}
		</tr>
	);
};

class Reservation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			fitness_no: 1,
			customer: null,
			reservation: [],
			reservation_data: [],
			reservationClass: [],
			customer_name: '',
			customer_id: 'xcv',
			isCancel: 1,
			reserv_date: new Date(),
			time: '',
			exercise_name: '',
			cancelComment: '',
			number_of_people: '',
			trainer: '',
			exercise_length: '0',
			customer_name_err: false,
			exercise_name_err: false,

			show: false,

			open: false,
			reservationArray: [],
		};
		this.handleDateChange = this.handleDateChange.bind(this);
		this.reservationSelect();
		// this.reservationClassSelect();
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
				this.reservationSelect();
			}
		});
	}

	reservationSelect = () => {
		fetch(
			ip + '/reservation/select?fitness_no=' + this.props.userinfo.fitness_no,
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
					const date = moment(data.date).format('YYYY년 MM월 DD일');
					let exercise_length = result.filter(
						(filterData) =>
							filterData.exercise_name === data.exercise_name &&
							filterData.time === data.time &&
							filterData.date.split('T')[0] === data.date.split('T')[0]
					).length;
					return (
						<ReservationItem
							res_no={data.res_no}
							date={date}
							date2={data.date}
							exercise_name={data.exercise_name}
							fitness_no={data.fitness_no}
							customer_name={data.customer_name}
							isCancel={data.isCancel}
							cancelComment={data.cancelComment}
							number_of_people={data.number_of_people}
							exercise_length={exercise_length}
							time={data.time}
							reservationSelect={this.reservationSelect}
							trainer={data.trainer}
							customer_id={data.customer_id}
						/>
					);
				});
				console.log('reservationSelect', result);
				this.setState({ reservation: items, reservation_data: result });
				this.reservationClassSelect();
			});
	};

	dateFormat = (reserv_date) => {
		let month = reserv_date.getMonth() + 1;
		let day = reserv_date.getDate();
		let hour = reserv_date.getHours();
		let minute = reserv_date.getMinutes();
		let second = reserv_date.getSeconds();

		month = month >= 10 ? month : '0' + month;
		day = day >= 10 ? day : '0' + day;
		hour = hour >= 10 ? hour : '0' + hour;
		minute = minute >= 10 ? minute : '0' + minute;
		second = second >= 10 ? second : '0' + second;

		return (
			reserv_date.getFullYear() +
			'-' +
			month +
			'-' +
			day +
			'T' +
			hour +
			':' +
			minute +
			':' +
			second
		);
	};

	handleOnClick = () => {
		let canRegist =
			this.state.reservation.filter(
				(filterData) =>
					filterData.exercise_name === this.state.exercise_name &&
					filterData.time === this.state.time &&
					filterData.date.split('T')[0] ===
						this.dateFormat(this.state.reserv_date).split('T')[0]
			).length > 0;
		this.setState({
			customer_name_err: false,
			exercise_name_err: false,
		});
		if (this.state.exercise_name == '') {
			this.setState({ exercise_name_err: true });
			alert('운동을 선택해 주세요');
		} else if (this.state.customer_name == '') {
			this.setState({ customer_name_err: true });
			alert('이름을 확인해 주세요');
		} else {
			fetch(ip + '/reservation/insert', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					fitness_no: this.props.userinfo.fitness_no,
					date: this.state.reserv_date,
					exercise_name: this.state.exercise_name,
					trainer: this.state.trainer,
					customer_name: this.state.customer_name,
					customer_id: this.state.customer_id,
					number_of_people: this.state.number_of_people,
					time: this.state.time,
				}),
			})
				.then((result) => result.json())
				.then((result) => {
					if (result.message == 'ok') {
						alert('예약이 완료되었습니다.');
					} else {
						alert(result.message);
					}

					this.reservationSelect();
				});
		}
	};

	handleDateChange(date) {
		this.setState({
			reserv_date: date,
		});
	}

	// handleChange = (e) => {
	//     this.setState({
	//         [e.target.id]: e.target.value,
	//     });
	// };

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
					const time =
						`${data.hour}`.padStart(2, '0') +
						':' +
						`${data.minute}`.padStart(2, '0');
					let canRegist = this.state.reservation_data.filter(
						(item) =>
							item.exercise_name === data.exercise_class && item.time === time
					).length;
					return (
						<ReservationClassItem
							exercise_class={data.exercise_class}
							number_of_people={data.number_of_people}
							hour={data.hour}
							minute={data.minute}
							trainer={data.trainer}
							canRegist={canRegist}
							handleClick={(
								result_exercise_name,
								result_hour,
								result_minute,
								result_number_of_people,
								result_trainer
							) =>
								this.setState({
									exercise_name: result_exercise_name,
									time: time,
									number_of_people: result_number_of_people,
									trainer: result_trainer,
								})
							}
						/>
					);
				});
				this.setState({ reservationClass: items });
			});
	};

	handleUser = (customer) => {
		const { member_no, name } = customer;
		this.setState({
			customer: customer,
			customer_name: name,
			customer_id: member_no,
			open: false,
		});
	};

	render() {
		console.log(this.state.reservationClass);
		return (
			<div className='reservationWrap'>
				<header className='header'>
					<Header />
					<Navigation goLogin={this.goLogin} />
					<MegaMenu />
					<div className='localNavigation'>
						<div className='container'>
							<h2>
								<div className='parallelogram'></div>
								예약
								<span>.</span>
							</h2>
							<div className='breadCrumb'>
								<Link to='/home'>HOME</Link>
								<span>&#62;</span>
								<Link to='/reservation'>예약</Link>
							</div>
							{/*.breadCrumb */}
						</div>
						{/*.container */}
					</div>
					{/*.localNavigation */}
				</header>
				<Container className='reservationWrap'>
					<Row className='pb-5 justify-content-center'>
						<Col xs={9}>
							<h4 className='fs-1'>운동 클래스</h4>
						</Col>
						<Col xs={3} className='text-center w-auto'>
							<Link to='/reservationClass'>
								<button>운동 클래스 만들기</button>
							</Link>
						</Col>
						<Col
							className='text-center py-2 w-100 overflow-auto justify-content-center'
							xs={12}
						>
							<table class='table classListTable'>
								<thead>
									<tr>
										<th scope='col'>운동 클래스</th>
										<th scope='col'>강사</th>
										<th scope='col'>인원</th>
										<th scope='col'>시간</th>
										<th scope='col'>선택</th>
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

							{/* 
                            {
                                this.state.customer && (
                                    <span>[{this.state.customer_id}]{this.state.customer_name} 님</span>
                                )
                            } */}
							{/* <TextField
                                id='customer_name'
                                value={this.state.customer_name}
                                // onChange={this.handleChange}
                                label='회원이름'
                                error={this.state.customer_name_err}
                            /> */}
							{/* <TextField
                                id='customer_id'
                                value={this.state.customer_id}
                                onChange={this.handleChange}
                                label='회원아이디'
                            /> */}
						</Col>
						<Col></Col>
					</Row>
					<Row lg={6}>
						<Col className='text-center my-3' xs={12} sm={4}>
							<div className='boxmorpinsm py-3 h-100 w-100'>
								<p className='fs-3'>운동명</p>
								<p className='fs-2 fw-bold'>{this.state.exercise_name}</p>
							</div>
							<TextField
								id='exercise_name'
								className='d-none'
								value={this.state.exercise_name}
								// onChange={this.handleChange}
								label='운동명'
								err={this.state.exercise_name_err}
							/>
						</Col>
						<Col className='text-center my-3' xs={12} sm={4}>
							<div className='boxmorpinsm py-3 h-100 w-100'>
								<p className='fs-3'>강사명</p>
								<p className='fs-2 fw-bold'>{this.state.trainer}</p>
							</div>
							<TextField
								id='trainer'
								className='d-none'
								value={this.state.trainer}
								// onChange={this.handleChange}
								label='강사명'
								// err={this.state.trainer_err}
							/>
						</Col>
						<Col className='text-center my-3' xs={12} sm={4}>
							<div className='boxmorpinsm py-3 h-100'>
								<p className='fs-3'>시간</p>
								<p className='fs-2 fw-bold'>{this.state.time}</p>
							</div>
							<TextField
								id='time'
								className='d-none'
								value={this.state.time}
								// onChange={this.handleChange}
								label='시간'
							/>
						</Col>
						<Col className='text-center my-3' xs={12} sm={4}>
							<div className='boxmorpinsm py-3 h-100 w-100'>
								<p className='fs-3'>최대 인원수</p>
								<p className='fs-2'>
									<span className='fw-bold'>
										{this.state.number_of_people == ''
											? ''
											: this.state.number_of_people + '명'}
									</span>{' '}
								</p>
							</div>
							<TextField
								id='number_of_people'
								className='d-none'
								value={this.state.number_of_people}
								// onChange={this.handleChange}
								label='최대 인원수'
							/>
						</Col>
						<Col className='text-center usersearchButton my-3'>
							{this.state.open ? (
								<UserSearch
									open={this.state.open}
									setOpen={(o) => this.setState({ open: o })}
									fitness_no={this.props.userinfo.fitness_no}
									handleUser={this.handleUser}
								/>
							) : (
								<TextField
									onClick={() => this.setState({ open: true })}
									id='customer_name'
									className='boxmorpsm h-100 w-100'
									InputProps={{ disableUnderline: true }}
									value={this.state.customer_name}
									// onChange={this.handleChange}
									label='회원 검색'
									error={this.state.customer_name_err}
								/>
							)}
						</Col>
						<Col className='text-center boxmorpsm p-0 datepickerButton my-3'>
							<DatePicker
								selected={this.state.reserv_date}
								onChange={this.handleDateChange}
								name='reserv_date'
								dateFormat='yyyy-MM-dd(eee)'
								font-size='1.6rem'
								locale='ko'
							/>
						</Col>
						<Col className='text-center w-100 mt-3' xs={12}>
							<button
								className='btnSolid mx-4 px-5'
								type='button'
								onClick={this.handleOnClick}
							>
								예약하기
							</button>
						</Col>
					</Row>
					<Row xs={1} sm={3}>
						{/* <Col className='text-end m-3' xs={12}>
                        <Link to='/reservation/update'>
                            <button className=''>예약 수정하기</button>
                        </Link>
                    </Col> */}
						{/* <ReservationList
                        reservation={this.state.reservation}
                        reservationDelete={this.reservationDelete}
                    /> */}
						<Col xs={12}>
							<h4 className='fs-1'>예약 현황</h4>
						</Col>
						<Col xs={12} className='w-100 overflow-auto'>
							<table class='table text-center reservationListTable mt-5'>
								<thead>
									<tr>
										<th scope='col'>[회원번호]회원이름</th>
										<th scope='col'>날짜</th>
										<th scope='col'>운동</th>
										<th scope='col'>강사</th>
										<th scope='col'>인원수</th>
										<th scope='col'>시간</th>
										{/* <th scope='col'>상태</th>
                                    <th scope='col'>취소사유</th> */}
										<th scope='col'>삭제</th>
									</tr>
								</thead>
								<tbody>
									{this.state.reservation.length == 0 ? (
										<p>'설정된 운동이 없습니다.'</p>
									) : (
										this.state.reservation
									)}
								</tbody>
							</table>
						</Col>
					</Row>
				</Container>
				<div className='footer'>
					<Footer />
				</div>
			</div>
		);
	}
}

const ReservationStateToProps = (state) => {
	return {
		userinfo: state.authentication.userinfo,
		status: state.authentication.status,
	};
};

const ReservationDispatchToProps = (dispatch) => {
	return {
		getStatusRequest: () => {
			return dispatch(getStatusRequest());
		},
	};
};

export default connect(
	ReservationStateToProps,
	ReservationDispatchToProps
)(Reservation);
