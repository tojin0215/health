import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import { logoutRequest } from '../../action/authentication';

import { textlogo } from '../../../src/img/logo-text.png';

import $ from 'jquery';

// import { MdMenu } from 'react-icons/md';

import './Menu.css';

class MegaMenu extends Component {
	constructor(props) {
		super(props);
		console.log(this.props.userinfo);
		console.log('AAAA');
		console.log(this.props);
	}
	handleLogout = () => {
		this.props.logoutRequest().then(() => {
			alert('로그아웃 되었습니다.');

			// EMPTIES THE SESSION
			let loginData = {
				isLoggedIn: false,
				username: '',
			};

			document.cookie = 'key=' + btoa(JSON.stringify(loginData));

			this.props.goLogin();
		});
	};
	// constructor(props) {
	// 	super(props);
	// 	console.log(this.props.userinfo);
	// }
	render() {
		const { userinfo } = this.props;
		console.log(userinfo);

		$('#menu-icon')
			.off('click')
			.on('click', function () {
				$('nav').slideToggle();
				$(this).toggleClass('active');
				// $(".active").off('click').on('click', function(){
				// 	$("nav").slideToggle();
				// });
			});

		return (
			<div class='megamenu'>
				<div class='logo'>
					<a href='/home'>
						<p className='fs-1'>{userinfo.fitness_name}</p>
					</a>
				</div>
				<p className='menuCenterCode fs-2'>
					센터코드{' '}
					{userinfo &&
						userinfo.fitness_no &&
						parseInt(`${userinfo.fitness_no}`, 16)}
				</p>
				<div id='menu-icon'>
					<span className='first'></span>
					<span className='second'></span>
					<span className='third'></span>
				</div>
				<nav>
					<ul>
						<li class='dropdown'>
							<NavLink exact to='/home'>
								Home
							</NavLink>
							<li>
								<NavLink exact to='/qr'>
									QR
								</NavLink>
							</li>
						</li>
						<li class='dropdown'>
							<NavLink exact to='/customer'>
								고객
							</NavLink>
							<li>
								<NavLink exact to='/customer'>
									회원 관리
								</NavLink>
							</li>
							<li>
								<NavLink exact to='/customer/add'>
									회원 등록
								</NavLink>
							</li>
							<li>
								<NavLink
									exact
									to={{
										pathname: '/assign/inbody',
										state: { member_no: 0, a: true },
									}}
								>
									인바디 정보
								</NavLink>
							</li>
						</li>
						<li class='dropdown'>
							<NavLink exact to='/reservation'>
								수업
							</NavLink>
							<li>
								<NavLink exact to='/reservation'>
									수업
								</NavLink>
							</li>
							<li>
								<NavLink exact to='/reservationClass'>
									수업 설정
								</NavLink>
							</li>
						</li>
						<li class='dropdown'>
							<NavLink exact to='/assign'>
								운동
							</NavLink>
							<li>
								<NavLink exact to='/assign'>
									운동 배정
								</NavLink>
							</li>
							<li>
								<NavLink exact to='/exercise'>
									운동 설정
								</NavLink>
							</li>
						</li>
						<li class='dropdown'>
							<NavLink exact to='/sales'>
								매출
							</NavLink>
							<li>
								<NavLink exact to='/sales'>
									매출 현황
								</NavLink>
							</li>
							<li>
								<NavLink exact to='/sales/add'>
									결제 등록
								</NavLink>
							</li>
						</li>

						<li className='text-center'>
							<button className='btnSolid' onClick={this.handleLogout}>
								LOG-OUT
							</button>
						</li>
						{/* <li class="dropdown">
								<NavLink exact to="/statistics">
								</NavLink>
							</li> */}
						{/* <li>
								{userinfo.fitness_no === 1?
										<NavLink exact to="/admin">
												<span className={styles.navitem}>
														관리자
												</span>
										</NavLink>
								:null
								}
							</li> */}
					</ul>
				</nav>
			</div>
		);
	}
}

const megaStateToProps = (state) => {
	return {
		userinfo: state.authentication.userinfo,
	};
};

const megaDispatchToProps = (dispatch) => {
	return {
		logoutRequest: () => {
			return dispatch(logoutRequest());
		},
	};
};
export default connect(megaStateToProps, megaDispatchToProps)(MegaMenu);
