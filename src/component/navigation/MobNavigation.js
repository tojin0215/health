import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import { logoutRequest } from '../../action/authentication';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { textlogo } from '../../../src/img/logo-text.png';

// MUI AppBar
//test333

// 부트스트랩
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import $ from 'jquery';
//app 사이드 내비게이션
// import { MdMenu } from 'react-icons/md';

import './MobNavigation.css';
import { IconButton } from '@mui/material';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdKeyboardArrowRight } from 'react-icons/md';

// 모바일 네비게이션 Mobile Navigation
class MobNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: false,
      sideGroup: {
        center: false,
        client: false,
        trainer: false,
        reserv: false,
        workout: false,
        sales: false,
      },
    };

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
  mobileOpen = () => {
    this.setState({ mobile: open });
  };
  mobileClose = () => {
    this.setState({ mobile: false, side: false });
  };
  sideMenu = () => {
    let obj = {
      center: true,
      client: false,
      trainer: false,
      reserv: false,
      workout: false,
      sales: false,
    };
    this.setState({ sideGroup: obj });
  };
  sideMenu2 = () => {
    let obj = {
      center: false,
      client: true,
      trainer: false,
      reserv: false,
      workout: false,
      sales: false,
    };
    this.setState({ sideGroup: obj });
  };
  sideMenu3 = () => {
    let obj = {
      center: false,
      client: false,
      trainer: true,
      reserv: false,
      workout: false,
      sales: false,
    };
    this.setState({ sideGroup: obj });
  };
  sideMenu4 = () => {
    let obj = {
      center: false,
      client: false,
      trainer: false,
      reserv: true,
      workout: false,
      sales: false,
    };
    this.setState({ sideGroup: obj });
  };
  sideMenu5 = () => {
    let obj = {
      center: false,
      client: false,
      trainer: false,
      reserv: false,
      workout: true,
      sales: false,
    };
    this.setState({ sideGroup: obj });
  };
  sideMenu6 = () => {
    let obj = {
      center: false,
      client: false,
      trainer: false,
      reserv: false,
      workout: false,
      sales: true,
    };
    this.setState({ sideGroup: obj });
  };
  render() {
    const { userinfo } = this.props;
    // console.log(userinfo.loginWhether);
    // console.log(userinfo);

    return (
      <div className='mob-navigation'>
        {userinfo.loginWhether === 2 ? (
          //회원
          <div className='menu'>
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div className='logo'>
              <p>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>회원</span>
                </a>
              </p>
            </div>
            <Drawer
              className='mob-nav__drawer'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul className='mob-nav__drawer__menu'>
                <h3 exact to='/mypage'>
                  {this.props.userinfo.manager_name}
                </h3>
                <li className='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu()}
                >
                  센터 소개
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.center ? (
                  <li className='dropdown'>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu2()}
                >
                  회원
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.client ? (
                  <li className='dropdown'>
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                    <br />
                    <NavLink exact to='/genetic'>
                      DTC
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu4()}
                >
                  수업
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.reserv ? (
                  <li className='dropdown'>
                    <li>
                      <NavLink exact to='/reservation'>
                        수업
                      </NavLink>
                    </li>
                  </li>
                ) : (
                  ''
                )}
                <li className='text-center mt-3'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </Drawer>
          </div>
        ) : userinfo.loginWhether === 1 ? (
          //강사
          <div className='menu'>
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div className='logo'>
              <p>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>강사</span>
                </a>
              </p>
            </div>
            <Drawer
              className='mob-nav__drawer'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul className='mob-nav__drawer__menu'>
                <h3 exact to='/mypage'>
                  {this.props.userinfo.manager_name}
                </h3>
                <li className='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu()}
                >
                  센터 소개
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.center ? (
                  <li className='dropdown'>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu2()}
                >
                  회원
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.client ? (
                  <li className='dropdown'>
                    <NavLink exact to='/client'>
                      회원 관리
                    </NavLink>
                    <br />
                    <NavLink exact to='/clientAdd'>
                      회원 등록
                    </NavLink>
                    <br />
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                    <br />
                    <NavLink exact to='/genetic'>
                      DTC
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu4()}
                >
                  수업관리
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.reserv ? (
                  <li className='dropdown'>
                    <li>
                      <NavLink exact to='/reservation'>
                        수업
                      </NavLink>
                      <br />
                      <NavLink exact to='/reservationClass'>
                        수업 설정
                      </NavLink>
                    </li>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu5()}
                >
                  운동
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.workout ? (
                  <li className='dropdown'>
                    <NavLink exact to='/workout'>
                      운동 배정
                    </NavLink>
                    <NavLink exact to='/workoutAlloted'>
                      개별 운동 배정
                    </NavLink>
                    <br />
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
                    <br />
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                    {/* <br />
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정
                    </NavLink>
                    <br />
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
                    </NavLink> */}
                  </li>
                ) : (
                  ''
                )}
                <li className='text-center mt-3'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </Drawer>
          </div>
        ) : (
          // 0 사업주
          <div className='menu'>
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div className='logo'>
              <p>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>센터</span>
                </a>
              </p>
            </div>
            <Drawer
              className='mob-nav__drawer'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul className='mob-nav__drawer__menu'>
                <h3 exact to='/mypage'>
                  {this.props.userinfo.manager_name}
                  {/*  <IoSettingsOutline /> */}
                </h3>
                <li className='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu()}
                >
                  센터
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.center ? (
                  <li className='dropdown'>
                    <NavLink exact to='/sales'>
                      매출 현황
                    </NavLink>
                    <br />
                    <NavLink exact to='/trainer'>
                      강사 관리
                    </NavLink>
                    <br />
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu2()}
                >
                  회원
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.client ? (
                  <li class='dropdown'>
                    <NavLink exact to='/client'>
                      회원 관리
                    </NavLink>
                    <br />
                    <NavLink exact to='/client'>
                      이용권 등록
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu4()}
                >
                  수업
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.reserv ? (
                  <li class='dropdown'>
                    <li>
                      <NavLink exact to='/reservation'>
                        시간표/예약
                      </NavLink>
                      <br />
                      <NavLink exact to='/reservationClass'>
                        수업 설정
                      </NavLink>
                    </li>
                  </li>
                ) : (
                  ''
                )}
                <div
                  className='mob-nav__drawer__menu-item d-flex justify-content-between'
                  onClick={() => this.sideMenu5()}
                >
                  운동
                  <MdKeyboardArrowRight />
                </div>
                {this.state.sideGroup.workout ? (
                  <li class='dropdown'>
                    <NavLink exact to='/workout'>
                      운동 배정
                    </NavLink>
                    <br />
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
                      회원 운동 확인
                    </Link>
                    <br />
                    <NavLink exact to='/workoutAdd'>
                      운동 만들기
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <li className='text-center mt-3'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </Drawer>
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
export default connect(megaStateToProps, megaDispatchToProps)(MobNavigation);
