import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Nav, Navbar, Container } from "react-bootstrap";
import { logoutRequest } from "../../action/authentication";

import "bootstrap/dist/css/bootstrap.css";
import styles from "./Navigation.css";

class Navigation extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.userinfo);
  }
  handleLogout = () => {
    this.props.logoutRequest().then(() => {
      alert("로그아웃 되었습니다.");

      // EMPTIES THE SESSION
      let loginData = {
        isLoggedIn: false,
        username: "",
      };

      document.cookie = "key=" + btoa(JSON.stringify(loginData));

      this.props.goLogin();
    });
  };

  render() {
    const { userinfo } = this.props;
    return (
      <div className="Navigation">
        <Navbar className={styles.navbar}>
          <Nav className="mr-auto dropdownNav navitem">
            <Nav.Item>
              <span className={styles.navitem}>{userinfo.manager_name}</span>
            </Nav.Item>
            <NavLink exact to="/home">
              <span className={styles.navitem}>Home</span>
              <ul>
                <li>
                  <NavLink exact to="/home">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/qr">
                    QR
                  </NavLink>
                </li>
              </ul>
            </NavLink>

            <NavLink exact to="/trainer">
              <span className={styles.navitem}>강사</span>
              <ul>
                <li>
                  <NavLink exact to="/trainer">
                    강사 관리
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/trainer/add">
                    강사 등록
                  </NavLink>
                </li>
              </ul>
            </NavLink>
            <NavLink exact to="/customer">
              <span className={styles.navitem}>고객</span>
              <ul>
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
                  <NavLink
                    exact
                    to={{
                      pathname: "/assign/inbody",
                      state: { member_no: 0, a: true },
                    }}
                  >
                    인바디 정보
                  </NavLink>
                </li>
              </ul>
            </NavLink>
            <NavLink exact to="/reservation">
              <span className={styles.navitem}>수업관리</span>
              <ul>
                <li class="dropdown">
                  <NavLink exact to="/reservation">
                    수업
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/reservationClass">
                    수업 설정
                    {/* (강사,회원 hide) */}
                  </NavLink>
                </li>
              </ul>
            </NavLink>
            <NavLink exact to="/assign">
              <span className={styles.navitem}>운동</span>
              <ul>
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
              </ul>
            </NavLink>
            <NavLink exact to="/sales">
              <span className={styles.navitem}>매출</span>
              <ul>
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
              </ul>
            </NavLink>

            <NavLink exact to="/statistics">
              <span className={styles.navitem}></span>
            </NavLink>
            {userinfo.fitness_no === 1 ? (
              <NavLink exact to="/admin">
                <span className={styles.navitem}>관리자</span>
              </NavLink>
            ) : null}
          </Nav>
          <Nav className={styles.navUtill}>
            <Navbar.Brand className="" href="/home">
              {/* <img
								alt='투진컴퍼니'
								src='%PUBLIC_URL%/assets/logo-text.png'
								width='auto'
								height='30'
								className='d-inline-block align-top'
							/>{' '} */}
              <p className="fs-2 px-2">{userinfo.fitness_name} </p>
              <p className="fs-5">
                센터 코드
                <p className="fs-2 fw-bold">
                  {userinfo &&
                    userinfo.fitness_no &&
                    parseInt(`${userinfo.fitness_no}`, 16)}
                </p>
              </p>
            </Navbar.Brand>
            <Nav.Item>
              <button className="btnSolid" onClick={this.handleLogout}>
                LOG-OUT
              </button>
            </Nav.Item>
          </Nav>
        </Navbar>
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
