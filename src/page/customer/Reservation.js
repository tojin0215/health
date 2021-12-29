import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { getStatusRequest } from '../../action/authentication';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// import Dropdown from 'react-dropdown';

// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';

// import Table from '@material-ui/core/Table';
// import TableHead from '@material-ui/core/TableHead';
// import TableBody from '@material-ui/core/TableBody';
// import TableRow from '@material-ui/core/TableRow';
// import TableCell from '@material-ui/core/TableCell';
// import axios from 'axios';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';
import moment from 'moment';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';
import styles from '../../styles/customer/reservation.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
const ip = SERVER_URL;

// const getSearchUser = (type, search, fitness_no) => (
//     axios.get("/api/customer", {
//         params: {
//             type: type,
//             search: search,
//             fn: fitness_no,
//         }
//     }).then(response => response.data)
// )

// const CustomerFindAndSelect = (show, setShow, fitness_no, setCustomer) => {
//     const search_type_options = ['이름', '핸드폰'];
//     const [search_type, setSearchType] = useState(search_type_options[0])
//     const [search, setSearch] = useState("")
//     const [customers, setCustomers] = useState([]);

//     const handleSearch = () => {
//         let type = '0';
//         if (search_type === '이름') {
//             type = '0';
//         } else if (search_type === '핸드폰') {
//             type = '1';
//         }
//         getSearchUser(type, search, fitness_no)
//             .then(result => {
//                 setCustomers(result.map(value => {
//                     return {
//                         no: value.member_no,
//                         member_no: value.member_no,
//                         userName: value.name,
//                         phone: value.phone,
//                     }
//                 }))
//             });
//     }

//     return (<Dialog
//         open={show}
//         onClose={() => setShow(false)}
//         maxWidth='lg'>
//         <DialogTitle>고객 검색</DialogTitle>
//         <DialogContent>
//             <div className='customerSearch'>
//                 <Dropdown
//                     className='searchDrop'
//                     options={search_type_options}
//                     onChange={e => setSearchType(e.value)}
//                     value={search_type}
//                 />
//                 {/*.searchDrop */}
//                 <input
//                     type='text'
//                     id='search'
//                     checked={search}
//                     onChange={e => setSearch(e.target.value)}
//                 />
//                 {/*#search */}
//                 <button type='button' onClick={handleSearch}>
//                     고객 검색
//                 </button>
//             </div>
//             {/*.customerSearch */}
//             <Table className='addsalesSearchTable'>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>번호</TableCell>
//                         <TableCell>이름</TableCell>
//                         <TableCell>폰번호</TableCell>
//                         <TableCell>선택</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {customers ? (
//                         customers.map((c) => (
//                             <TableRow>
//                                 <TableCell>{c.no}</TableCell>
//                                 <TableCell>{c.userName}</TableCell>
//                                 <TableCell>{c.phone}</TableCell>
//                                 <TableCell>
//                                     <DialogActions>
//                                         <button
//                                             type='button'
//                                             onClick={() => setCustomer(c)}
//                                             id={c.no}
//                                             value={[c.userName, c.phone]}
//                                         >
//                                             선택
//                                         </button>
//                                         {/*#{c.no} */}
//                                     </DialogActions>
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan='6' align='center'></TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </DialogContent>
//         <DialogActions>
//             <button type='button' onClick={() => setShow(false)}>
//                 닫기
//             </button>
//         </DialogActions>
//     </Dialog>)
// }

const ReservationItem = ({
	reserv_date,
	reserv_time,
	exercise_name,
	customer_name,
	customer_id,
	isCancel,
	cancelComment,
}) => {
	return (
		<ListGroup.Item>
			<table class='table'>
				<thead>
					<tr>
						<th scope='col'>회원이름</th>
						<th scope='col'>회원아이디</th>
						<th scope='col'>날짜</th>
						<th scope='col'>시간</th>
						<th scope='col'>운동이름</th>
						<th scope='col'>상태</th>
						<th scope='col'>취소사유</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{customer_name}</td>
						<td> {customer_id}</td>
						<td> {reserv_date}</td>
						<td> {reserv_time}:00</td>
						<td> {exercise_name}</td>
						<td> {isCancel == null ? '예약됨' : '취소됨'}</td>
						<td> {cancelComment}</td>
					</tr>
				</tbody>
			</table>
			{/* <ul class="list-group">
                <li class="list-group-item">회원이름: {customer_name}</li>
                <li class="list-group-item">회원아이디: {customer_id}</li>
                <li class="list-group-item">날짜: {reserv_date}</li>
                <li class="list-group-item">시간: {reserv_time}:00</li>
                <li class="list-group-item">운동이름: {exercise_name}</li>
                <li class="list-group-item">취소유무: {isCancel == 1 ? "취소됨" : "예약됨"}</li>
                <li class="list-group-item">취소사유: {cancelComment}</li>
            </ul> */}
		</ListGroup.Item>
	);
};

class Reservation extends Component {
	constructor(props) {
		super(props);

		(this.state = {
			show: false,
			fitness_no: 1,
			customer: null,
			reservation: [],

			customer_name: '홍길동',
			customer_id: '홍길동',
			isCancel: 1,
			reserv_date: new Date(),
			reserv_time: moment(),
			exercise_name: 'PT기구',
			cancelComment: '',

			radioGroup: {
				ten: true,
				eleven: false,
				twelve: false,
				thirteen: false,
			},
		}),
			(this.handleDateChange = this.handleDateChange.bind(this));
		this.reservationSelect();
		// ,
		// this.reservationUpdate(),
		// this.reservationDelete(),
		// this.reservationInsert()
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
					return (
						<ReservationItem
							reserv_date={data.date.split('T')[0]}
							reserv_time={data.time}
							exercise_name={data.exercise_name}
							customer_name={data.customer_name}
							customer_id={data.customer_id}
							isCancel={data.isCancel}
							cancelComment={data.cancelComment}
						/>
					);
				});

				this.setState({ reservation: items });
				console.log(result);
			});
	};

	handleOnClick = () => {
		fetch(ip + '/reservation/insert', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				fitness_no: this.props.userinfo.fitness_no,
				name: this.state.name,
				date: this.state.reserv_date,
				time:
					this.state.radioGroup.ten == true
						? '10'
						: this.state.radioGroup.eleven == true
						? '11'
						: this.state.radioGroup.twelve == true
						? '12'
						: this.state.radioGroup.thirteen == true
						? '13'
						: '00',
				exercise_name: this.state.exercise_name,
				customer_name: this.state.customer_name,
				customer_id: this.state.customer_id,
			}),
		})
			.then((result) => result.json())
			.then((result) => {
				alert('등록');
				this.props.history.push('/reservation');
			});
	};

	reservationUpdate = () => {
		fetch(ip + '/reservation/update', {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				res_no: this.state.res_no,
				reserv_date: this.state.reserv_date,
				reserv_time: this.state.reserv_time,
				exercise_name: this.state.exercise_name,
				isCancel: this.state.isCancel,
				cancelComment: this.state.cancelComment,
			}),
		});
	};

	reservationDelete = () => {
		fetch(ip + '/reservation/delete', {
			method: 'DELETE',
			body: JSON.stringify({
				res_no: this.state.res_no,
			}),
		}).then((result) => {
			alert('삭제');
			this.reservationSelect();
		});
	};
	handleDateChange(date) {
		this.setState({
			reserv_date: date,
		});
	}

	handleChange = (e) => {
		this.setState({
			[e.target.id]: e.target.value,
		});
	};

	handleRadio = (event) => {
		let obj = {
			ten: false,
			eleven: false,
			twelve: false,
			thirteen: false,
		};
		obj[event.target.id] = event.target.checked; // true
		console.log(obj);
		this.setState({
			radioGroup: obj,
		});
	};

	render() {
		console.log(this.state.reservation);
		console.log(this.state.reserv_date);
		return (
			<div className='addCustomer'>
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
				{/* <CustomerFindAndSelect
                    show={this.state.show}
                    setShow={value => this.setState({ show: value })}
                    fitness_no={this.state.fitness_no}
                    setCustomer={c => this.setState({ customer: c })}
                /> */}
				<Container className='reservationWrap'>
					<Row className='pb-5'>
						<Col className='text-center py-2' xs={12}>
							<TextField
								id='exercise_name'
								value={this.state.exercise_name}
								onChange={this.handleChange}
								label='운동명'
							/>
							<TextField
								id='customer_name'
								value={this.state.customer_name}
								onChange={this.handleChange}
								label='회원이름'
							/>
							<TextField
								id='customer_id'
								value={this.state.customer_id}
								onChange={this.handleChange}
								label='회원아이디'
							/>
						</Col>
						<Col className='text-center py-2' xs={12}>
							<DatePicker
								selected={this.state.reserv_date}
								onChange={this.handleDateChange}
								name='reserv_date'
								dateFormat='yyyy-MM-dd'
								font-size='1.6rem'
							/>
							<label className='customerResi'>
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
							</label>
						</Col>
						<Col className='text-center' xs={12}>
							<button
								className='mx-4'
								type='button'
								onClick={this.handleOnClick}
							>
								예약하기
							</button>
						</Col>
					</Row>
					<ListGroup>
						<p>
							{this.state.reservation.length == 0
								? '예약된 회원이 없습니다.'
								: this.state.reservation}
						</p>
					</ListGroup>
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
