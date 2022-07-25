import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import { logoutRequest } from '../../action/authentication';

import { textlogo } from '../../../src/img/logo-text.png';

// MUI AppBar

// 부트스트랩
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import $ from 'jquery';
//app 사이드 내비게이션
// import { MdMenu } from 'react-icons/md';

import './Menu.css';

import DrawerAppBar from './Drawer';

class Menu extends Component {
  constructor(props) {
    super(props);

    // console.log(this.props.userinfo);
    // console.log("AAAA");
    // console.log(this.props);
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
    console.log(userinfo.loginWhether);

    $('#menu-icon')
      .off('click')
      .on('click', function () {
        $('nav').slideToggle();
        $(this).toggleClass('active');
        $('.active')
          .off('click')
          .on('click', function () {
            $('nav').slideToggle();
          });
      });
    // console.log(userinfo);
    return (
      <div>
        {userinfo.loginWhether === 2 ? (
          <div class='menu'>
            <div class='logo'>
              <a href='/home' className='text-white'>
                <p className='fs-1 text-white'>
                  {this.props.userinfo.fitness_name}
                </p>
                <p className='fs-1'>{this.props.userinfo.manager_name}</p>
                <p className='fs-1'>회원</p>
              </a>
            </div>
            {/* <p className='menuCenterCode fs-2'>
              센터코드 {userinfo.fitness_no}
            </p> */}
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
                  {/* <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li> */}
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/introduce'>
                    센터 소개
                  </NavLink>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/inbodies'>
                    인바디 정보
                  </NavLink>
                  <li>
                    <NavLink exact to='/inbodies'>
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
                </li>

                <li className='text-center'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
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
        ) : userinfo.loginWhether === 1 ? (
          <div class='menu'>
            <div class='logo'>
              <a href='/home'>
                <p className='fs-1'>{this.props.userinfo.fitness_name}</p>
                <p className='fs-1'>{this.props.userinfo.manager_name}</p>
                <p className='fs-1'>강사</p>
              </a>
            </div>
            {/* <p className='menuCenterCode fs-2'>
              센터코드 {userinfo.fitness_no}
            </p> */}
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
                  {/* <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li> */}
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/introduce'>
                    센터 소개
                  </NavLink>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/client'>
                    회원
                  </NavLink>
                  <li>
                    <NavLink exact to='/client'>
                      회원 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/client/add'>
                      회원 등록
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/inbodies'>
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
                  <NavLink exact to='/workoutAlloted'>
                    운동
                  </NavLink>
                  <li>
                    <NavLink exact to='/workoutAlloted'>
                      운동 배정
                    </NavLink>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: '/workoutAllotedList',
                        state: {
                          client_name2: '',
                          idc2: '',
                          line: '',
                        },
                      }}
                    >
                      운동 배정된 목록
                    </Link>
                  </li>
                  <li>
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
                    </NavLink>
                  </li>
                </li>
                <li className='text-center'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
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
        ) : (
          // <DrawerAppBar />
          <div class='menu'>
            <div class='logo'>
              <a href='/home'>
                <p className='fs-5'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>센터</span>
                  <span className='ps-2 fw-normal'>
                    {this.props.userinfo.manager_name}
                  </span>
                </p>
              </a>
            </div>
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
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/introduce'>
                    센터 소개
                  </NavLink>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/introduce/add'>
                      센터 소개 등록
                    </NavLink>
                  </li>
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/client'>
                    회원
                  </NavLink>
                  <li>
                    <NavLink exact to='/client'>
                      회원 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/client/add'>
                      회원 등록
                    </NavLink>
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                  </li>
                </li>
                <li class='dropdown'>
                  <NavLink exact to='/trainer'>
                    강사
                  </NavLink>
                  <li>
                    <NavLink exact to='/trainer'>
                      강사 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/trainer/add'>
                      강사 등록
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
                  <NavLink exact to='/workoutAlloted'>
                    운동 배정
                  </NavLink>
                  <li>
                    <NavLink exact to='/workoutAlloted'>
                      운동 배정
                    </NavLink>
                  </li>
                  <li>
                    <Link
                      to={{
                        pathname: '/workoutAllotedList',
                        state: {
                          client_name2: '',
                          idc2: '',
                          line: '',
                        },
                      }}
                    >
                      운동 배정된 목록
                    </Link>
                  </li>
                  <li>
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
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
                    <NavLink exact to='/addSales'>
                      결제 등록
                    </NavLink>
                  </li>
                </li>
                <li className='text-start mt-3'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}
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
export default connect(megaStateToProps, megaDispatchToProps)(Menu);
