import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { logoutRequest } from '../../action/authentication';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './Navigation.css';
//web
class Navigation extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.userinfo);
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

  render() {
    const { userinfo } = this.props;
    // console.log(userinfo);
    // console.log(this.props.userinfo);
    return (
      //2:회원, 1:강사, else(0):헬스장
      <div className='Navigation'>
        {userinfo.loginWhether === 2 ? (
          <Navbar className={styles.navbar}>
            <Nav className='mr-auto dropdownNav navitem'>
              <Nav.Item>
                <span className={styles.navitem}>회원</span>
              </Nav.Item>
              <NavLink exact to='/home'>
                <span className={styles.navitem}>Home</span>
                <ul>
                  <li>
                    <NavLink exact to='/home'>
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/introduce'>
                <span className={styles.navitem}>센터 소개</span>
                <ul>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/inbodies'>
                <span className={styles.navitem}>인바디 정보</span>
                <ul>
                  <li>
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/reservation'>
                <span className={styles.navitem}>수업관리</span>
                <ul>
                  <li class='dropdown'>
                    <NavLink exact to='/reservation'>
                      수업
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
            </Nav>
            <Nav className={styles.navUtill}>
              <Navbar.Brand className='' href='/home'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button variant='outline-light' onClick={this.handleLogout}>
                  LOG-OUT
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        ) : userinfo.loginWhether === 1 ? (
          <Navbar className={styles.navbar}>
            <Nav className='mr-auto dropdownNav navitem'>
              <Nav.Item>
                <span className={styles.navitem}>강사</span>
              </Nav.Item>
              <NavLink exact to='/home'>
                <span className={styles.navitem}>Home</span>
                <ul>
                  <li>
                    <NavLink exact to='/home'>
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/introduce'>
                <span className={styles.navitem}>센터 소개</span>
                <ul>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 소개
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/client'>
                <span className={styles.navitem}>회원</span>
                <ul>
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
                </ul>
              </NavLink>
              <NavLink exact to='/reservation'>
                <span className={styles.navitem}>수업관리</span>
                <ul>
                  <li class='dropdown'>
                    <NavLink exact to='/reservation'>
                      수업
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/reservationClass'>
                      수업 설정
                      {/* (강사,회원 hide) */}
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/workoutAlloted'>
                <span className={styles.navitem}>운동</span>
                <ul>
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
                </ul>
              </NavLink>

              <NavLink exact to='/statistics'>
                <span className={styles.navitem}></span>
              </NavLink>
            </Nav>
            <Nav className={styles.navUtill}>
              <Navbar.Brand className='' href='/home'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button variant='outline-light' onClick={this.handleLogout}>
                  LOG-OUT
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        ) : (
          <Navbar className={styles.navbar}>
            <Nav className='mr-auto dropdownNav navitem'>
              <Nav.Item>
                <span className={styles.navitem}>센터</span>
              </Nav.Item>
              <NavLink exact to='/home'>
                <span className={styles.navitem}>Home</span>
                <ul>
                  <li>
                    <NavLink exact to='/home'>
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/introduce'>
                <span className={styles.navitem}>센터 소개</span>
                <ul>
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
                </ul>
              </NavLink>

              <NavLink exact to='/trainer'>
                <span className={styles.navitem}>강사</span>
                <ul>
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
                </ul>
              </NavLink>
              <NavLink exact to='/client'>
                <span className={styles.navitem}>회원</span>
                <ul>
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
                  {/* <li>
                    <NavLink
                      exact
                      to={{
                        pathname: '/assign/inbody',
                        state: { member_no: 0, a: true },
                      }}
                    >
                      인바디 정보
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/reservation'>
                <span className={styles.navitem}>수업관리</span>
                <ul>
                  <li class='dropdown'>
                    <NavLink exact to='/reservation'>
                      수업
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/reservationClass'>
                      수업 설정
                      {/* (강사,회원 hide) */}
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/workoutAlloted'>
                <span className={styles.navitem}>운동</span>
                <ul>
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
                      묶음 운동 배정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStageAdd'>
                      묶음 운동 설정
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/sales'>
                <span className={styles.navitem}>매출</span>
                <ul>
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
                </ul>
              </NavLink>

              <NavLink exact to='/statistics'>
                <span className={styles.navitem}></span>
              </NavLink>
              {/* {userinfo.fitness_no === 1 ? (
                <NavLink exact to='/admin'>
                  <span className={styles.navitem}>관리자</span>
                </NavLink>
              ) : null} */}
            </Nav>
            <Nav className={styles.navUtill}>
              <Navbar.Brand className='' href='/home'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button
                  variant='outline-light
                '
                  onClick={this.handleLogout}
                >
                  LOG-OUT
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        )}
      </div>
    );
  }
}

const navigationStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
  };
};

const navigationDispatchToProps = (dispatch) => {
  return {
    logoutRequest: () => {
      return dispatch(logoutRequest());
    },
  };
};
export default connect(
  navigationStateToProps,
  navigationDispatchToProps
)(Navigation);
