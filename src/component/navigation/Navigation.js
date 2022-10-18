import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { logoutRequest } from '../../action/authentication';

import Button from 'react-bootstrap/Button';
import styles from './Navigation.css';
import { TbHome } from 'react-icons/tb';
//web용 내비게이션
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
          <Navbar>
            <Nav className='mr-auto dropdownNav navitem'>
              <NavLink exact to='/home'>
                <Nav.Item>
                  <span className='text-primary'>
                    {this.props.userinfo.fitness_name}
                  </span>
                  <span className={styles.navitem}> 회원</span>
                </Nav.Item>
              </NavLink>
              <NavLink exact to='/introduce'>
                <span className={styles.navitem}>센터</span>
              </NavLink>
              <NavLink exact to='/client'>
                <span className={styles.navitem}>회원</span>
              </NavLink>
              <NavLink exact to='/reservation'>
                <span className={styles.navitem}>수업</span>
              </NavLink>
            </Nav>
            <Nav className={styles.navUtill}>
              <Navbar.Brand className='' href='/mypage'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button
                  className='me-4'
                  variant='outline-light'
                  onClick={this.handleLogout}
                >
                  LOG-OUT
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        ) : userinfo.loginWhether === 1 ? (
          <Navbar>
            <Nav className='mr-auto dropdownNav navitem'>
              <Nav.Item>
                <span className='text-primary'>
                  {this.props.userinfo.fitness_name}
                </span>
                <span className={styles.navitem}> 강사</span>
              </Nav.Item>
              <NavLink exact to='/home'>
                <span className={styles.navitem}>Home</span>
                <ul>
                  <li>
                    <NavLink exact to='/home'>
                      Home
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink exact to='/qr'>
                      QR
                    </NavLink>
                  </li> */}
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
                    <NavLink exact to='/clientAdd'>
                      회원 등록
                    </NavLink>
                  </li>

                  <li>
                    <NavLink exact to='/inbodies'>
                      인바디 정보
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/genetic'>
                      DTC
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
                      기본 루틴 배정
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정
                    </NavLink>
                  </li>
                </ul>
              </NavLink>

              <NavLink exact to='/statistics'>
                <span className={styles.navitem}></span>
              </NavLink>
            </Nav>
            <Nav className={styles.navUtill}>
              <Navbar.Brand className='' href='/mypage'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button
                  className='me-4'
                  variant='outline-light'
                  onClick={this.handleLogout}
                >
                  LOG-OUT
                </Button>
              </Nav.Item>
            </Nav>
          </Navbar>
        ) : (
          <Navbar>
            <Nav className='mr-auto dropdownNav navitem'>
              <NavLink exact to='/home'>
                <Nav.Item>
                  <span className='text-primary'>
                    {this.props.userinfo.fitness_name}
                  </span>
                  <span className={styles.navitem}> 센터</span>
                </Nav.Item>
              </NavLink>
              <NavLink exact to='/introduce'>
                <span className={styles.navitem}>센터</span>
                <ul>
                  <li>
                    <NavLink exact to='/sales'>
                      매출 현황
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/trainer'>
                      강사 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/introduce'>
                      센터 관리
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink exact to='/introduceAdd'>
                      센터 소개 등록 (삭제)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/trainerAdd'>
                      강사 등록 (삭제)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/clientAdd'>
                      회원 등록 (삭제)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/inbodies'>
                      인바디 정보 (삭제)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/genetic'>
                      DTC (삭제)
                    </NavLink>
                  </li> */}
                </ul>
              </NavLink>
              <NavLink exact to='/sales'>
                <span className={styles.navitem}>회원</span>
                <ul>
                  <li>
                    <NavLink exact to='/client'>
                      회원 관리
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/addSales'>
                      회원권 연장
                    </NavLink>
                  </li>
                </ul>
              </NavLink>
              <NavLink exact to='/reservation'>
                <span className={styles.navitem}>수업</span>
                <ul>
                  <li class='dropdown'>
                    <NavLink exact to='/reservation'>
                      시간표/예약
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
              <NavLink exact to='/workout'>
                <span className={styles.navitem}>운동</span>
                <ul>
                  <li>
                    <NavLink exact to='/workout'>
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
                      회원 운동 확인
                    </Link>
                  </li>
                  {/* <li>
                    <NavLink exact to='/workoutAlloted'>
                      개별 운동 배정
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink exact to='/workoutAdd'>
                      운동 설정
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink exact to='/workoutStage'>
                      기본 루틴 배정 (삭제)
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to='/workoutStageAdd'>
                      기본 루틴 설정 (삭제)
                    </NavLink>
                  </li> */}
                </ul>
              </NavLink>
              {/* <NavLink exact to='/statistics'>
                <span className={styles.navitem}></span>
              </NavLink> */}
              {/* {userinfo.fitness_no === 1 ? (
                <NavLink exact to='/admin'>
                  <span className={styles.navitem}>관리자</span>
                </NavLink>
              ) : null} */}
            </Nav>
            <Nav>
              <Navbar.Brand className='' href='/mypage'>
                {userinfo.manager_name}
              </Navbar.Brand>
              <Nav.Item className='align-self-center'>
                <Button
                  className='me-4'
                  variant='outline-light'
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
