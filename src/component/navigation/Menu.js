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

import './Menu.css';
import { IconButton } from '@mui/material';

class Menu extends Component {
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
      <div>
        {userinfo.loginWhether === 2 ? (
          //회원
          <div class='menu'>
            {/* <div id='menu-icon'>
              <span className='first'></span>
              <span className='second'></span>
              <span className='third'></span>
            </div> */}
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div class='logo'>
              <p className='fs-5'>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>회원</span>
                </a>
              </p>
            </div>
            <Drawer
              variant='temporary'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul>
                <h3>{this.props.userinfo.manager_name}</h3>
                <li class='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div onClick={() => this.sideMenu()}>센터 소개(대메뉴)</div>
                {this.state.sideGroup.center ? (
                  <li class='dropdown'>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div onClick={() => this.sideMenu2()}>회원(대메뉴)</div>
                {this.state.sideGroup.client ? (
                  <li class='dropdown'>
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
                <div onClick={() => this.sideMenu4()}>수업(대메뉴)</div>
                {this.state.sideGroup.reserv ? (
                  <li class='dropdown'>
                    <li>
                      <NavLink exact to='/reservation'>
                        수업
                      </NavLink>
                    </li>
                  </li>
                ) : (
                  ''
                )}
                <li className='text-center'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </Drawer>
          </div>
        ) : userinfo.loginWhether === 1 ? (
          //강사
          <div class='menu'>
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div class='logo'>
              <p className='fs-5'>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>강사</span>
                </a>
              </p>
            </div>

            <Drawer
              variant='temporary'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul>
                <h3>{this.props.userinfo.manager_name}</h3>
                <li class='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div onClick={() => this.sideMenu()}>센터 소개(대메뉴)</div>
                {this.state.sideGroup.center ? (
                  <li class='dropdown'>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div onClick={() => this.sideMenu2()}>회원(대메뉴)</div>
                {this.state.sideGroup.client ? (
                  <li class='dropdown'>
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
                <div onClick={() => this.sideMenu4()}>수업(대메뉴)</div>
                {this.state.sideGroup.reserv ? (
                  <li class='dropdown'>
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
                <div onClick={() => this.sideMenu5()}>운동(대메뉴)</div>
                {this.state.sideGroup.workout ? (
                  <li class='dropdown'>
                    <NavLink exact to='/workoutAlloted'>
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
                      운동 배정된 목록
                    </Link>
                    <br />
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                    <br />
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정
                    </NavLink>
                    <br />
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                <li className='text-center'>
                  <Button variant='danger' onClick={this.handleLogout}>
                    로그아웃
                  </Button>
                </li>
              </ul>
            </Drawer>
          </div>
        ) : (
          <div class='menu'>
            <IconButton onClick={() => this.mobileOpen()}>
              <MenuIcon />
            </IconButton>
            <div class='logo'>
              <p className='fs-5'>
                <a href='/home'>
                  {this.props.userinfo.fitness_name}
                  <span className='text-secondary ps-2'>센터</span>
                </a>
              </p>
            </div>

            <Drawer
              variant='temporary'
              open={this.state.mobile}
              onClose={() => this.mobileClose()}
            >
              <ul>
                <h3>{this.props.userinfo.manager_name}</h3>
                <li class='dropdown'>
                  <NavLink exact to='/mypage'>
                    내 정보
                  </NavLink>
                </li>
                <div onClick={() => this.sideMenu()}>센터 소개(대메뉴)</div>
                {this.state.sideGroup.center ? (
                  <li class='dropdown'>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                    <br />
                    <NavLink exact to='/introduceAdd'>
                      센터 소개 등록
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div onClick={() => this.sideMenu2()}>회원(대메뉴)</div>
                {this.state.sideGroup.client ? (
                  <li class='dropdown'>
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
                <div onClick={() => this.sideMenu3()}>강사(대메뉴)</div>
                {this.state.sideGroup.trainer ? (
                  <li class='dropdown'>
                    <NavLink exact to='/trainer'>
                      강사 관리
                    </NavLink>
                    <br />
                    <NavLink exact to='/trainerAdd'>
                      강사 등록
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div onClick={() => this.sideMenu4()}>수업(대메뉴)</div>
                {this.state.sideGroup.reserv ? (
                  <li class='dropdown'>
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
                <div onClick={() => this.sideMenu5()}>운동(대메뉴)</div>
                {this.state.sideGroup.workout ? (
                  <li class='dropdown'>
                    <NavLink exact to='/workoutAlloted'>
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
                      운동 배정된 목록
                    </Link>
                    <br />
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                    <br />
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정
                    </NavLink>
                    <br />
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}
                <div onClick={() => this.sideMenu6()}>매출(대메뉴)</div>
                {this.state.sideGroup.sales ? (
                  <li class='dropdown'>
                    <NavLink exact to='/sales'>
                      매출 현황
                    </NavLink>
                    <br />
                    <NavLink exact to='/addSales'>
                      결제 등록
                    </NavLink>
                  </li>
                ) : (
                  ''
                )}

                <li className='text-start mt-3'>
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
export default connect(megaStateToProps, megaDispatchToProps)(Menu);
