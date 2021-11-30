import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {Nav, Navbar, Container} from 'react-bootstrap';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import {logoutRequest} from '../../action/authentication';



import Collapse from "@kunukn/react-collapse";

import { MdMenu } from "react-icons/md";

import imgLogo from '../../images/logo-text.png';
import './Menu.css';

class MegaMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: true,
		}
	}
  render() {
		// $('.megamenu').prepend('<div id="menu-icon"><span class="first"></span><span class="second"></span><span class="third"></span></div>');

		// $("#menu-icon").on("click", function(){
		// 	$("nav").slideToggle();
		// 	$(this).toggleClass("active");
		// });

		// $("#menu-icon").off('click').on("click", function(){
		// 	$("nav").slideToggle();
		// 	$(this).toggleClass("active");
		// 	// $(".active").off('click').on('click', function(){
		// 	// 	$("nav").slideToggle();
		// 	// });
		// });

    return (
			<div class="megamenu">
						<div class="logo">
							<a href='/home'>
								<img
										alt="투진컴퍼니"
										src={imgLogo}
										width="auto"
										height="30"
										className="d-inline-block align-top"
								/>{' '}
							</a>
						</div>
						<button className='btnSolid' onClick={this.handleLogout}>
							LOG-OUT
						</button>
						<div id='menu-icon'
						onClick={(e) => this.setState({isOpen: !this.state.isOpen})}
						>
							<span className='first'></span>
							<span className='second'></span>
							<span className='third'></span>
						</div>

			<Collapse isOpen={this.state.isOpen}>
				
						<nav>
							<ul>
								<li>
									<NavLink exact to="/home">
										Home
										</NavLink>
								</li>
								<li class="dropdown">
									<NavLink exact to="/customer">
										고객
									</NavLink>
									<li>
										<NavLink exact to="/customer">
												회원 관리
										</NavLink>
									</li>
									<li>
										<NavLink exact to="/customer/add">
												회원 등록
										</NavLink>
									</li>
									<li>
										<NavLink exact to=
										{{ pathname: '/assign/inbody',
												state:{member_no:0,a:true} }}>
												인바디 정보
										</NavLink>
									</li>
								</li>
								<li class="dropdown">
									<NavLink exact to="/sales">상품/매출</NavLink>
										<li>
											<NavLink exact to="/sales">
													매출 현황
											</NavLink>
										</li>
										<li>
											<NavLink exact to="/sales/add">
													결제 등록
											</NavLink>
										</li> 
								</li>
								<li class="dropdown">
									<NavLink exact to="/assign">운동</NavLink>
										<li>
											<NavLink exact to="/assign">
													운동 배정
											</NavLink>
										</li>
										<li>
											<NavLink exact to="/exercise">
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

				</Collapse>
				</div>
    );
  }
}

export default MegaMenu;