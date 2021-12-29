import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';

import { textlogo } from '../../../src/img/logo-text.png';

import $ from 'jquery';

// import { MdMenu } from 'react-icons/md';

import './Menu.css';

class MegaMenu extends Component {
	render() {
		// $('.megamenu').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');

		// $("#menu-icon").on("click", function(){
		// 	$("nav").slideToggle();
		// 	$(this).toggleClass("active");
		// });

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
						<img
							alt='투진컴퍼니'
							src={textlogo}
							width='auto'
							height='30'
							className='d-inline-block align-top'
						/>
					</a>
				</div>
				<div id='menu-icon'>
					<span className='first'></span>
					<span className='second'></span>
					<span className='third'></span>
				</div>
				<nav>
					<ul>
						<li>
							<NavLink exact to='/home'>
								Home
							</NavLink>
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
								<NavLink exact to='/reservation'>
									예약페이지
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
							<NavLink exact to='/sales'>
								상품/매출
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

export default MegaMenu;
