import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import Footer from '../../component/footer/Footer';

//css
import '../../styles/workout/workout.css';

//bootstrap
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

//react-icons.github.io
import { CgArrowRight, CgArrowLongRight } from 'react-icons/cg';
import { MdArrowForwardIos } from 'react-icons/md';
import { AiOutlineSetting } from 'react-icons/ai';

// import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import SettingsIcon from '@mui/icons-material/Settings';

class Workout extends Component {
  constructor(props) {
    super(props);
  }
  goLogin = () => {
    this.props.history.push('/');
  };
  goAlloted = () => {
    this.props.history.push('/workoutAlloted');
  };
  goStage = () => {
    this.props.history.push('/workoutStage');
  };

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
        this.viewWorkout();
      }
    });
  }

  render() {
    return (
      <div className='wrap workout'>
        <Header />
        <Navigation goLogin={this.goLogin} />
        <Menu goLogin={this.goLogin} />
        <header className='header'>
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                운동 배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/introduce'>운동 배정</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <Row>
            <Col xs={12}>
              <h3>운동 배정</h3>
            </Col>
            <Col>
              <Row className='workoutRoutine'>
                <Col className='me-4 custom' onClick={this.goStage}>
                  <Row>
                    <Col xs={10} className='mb-5'>
                      <h2>베이직 루틴 배정</h2>
                    </Col>
                    <Col xs={2}>
                      <CgArrowLongRight className='fs-1' />
                    </Col>
                    <Col xs={12}>
                      <p>
                        단계별 기본 루틴을 선택해
                        <br />
                        회원에게 배정해 줄 수 있습니다.
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col className='personal' onClick={this.goAlloted}>
                  <Row>
                    <Col xs={10} className='mb-5'>
                      <h2>맞춤형 운동 배정</h2>
                    </Col>
                    <Col xs={2}>
                      <CgArrowLongRight className='fs-1' />
                    </Col>
                    <Col xs={12}>
                      <p>
                        개별 운동을 직접 조합해서 루틴을 만들어
                        <br />
                        회원에게 배정해 줄 수 있습니다.
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Link to='/workoutAdd'>
              <Row className='addWorkout my-4'>
                <Col xs={4}>
                  <h4>
                    운동 만들기
                    <AiOutlineSetting className='mx-2' />
                  </h4>
                </Col>
                <Col xs={7}>
                  <p>
                    맞춤형 운동 배정에 들어갈 개별 운동들을 만들 수 있습니다.
                  </p>
                </Col>
                <Col xs={1}>
                  <MdArrowForwardIos />
                </Col>
              </Row>
            </Link>
            <Link to='/workoutStageAdd'>
              <Row className='addWorkout'>
                <Col xs={4}>
                  <h4>
                    베이직 루틴 만들기
                    <AiOutlineSetting className='mx-2' />
                  </h4>
                </Col>
                <Col xs={7}>
                  <p>베이직 루틴을 직접 만들 수 있습니다.</p>
                </Col>
                <Col xs={1}>
                  <MdArrowForwardIos />
                </Col>
              </Row>
            </Link>
          </Row>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const WorkoutStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(WorkoutStateToProps, WorkoutDispatchToProps)(Workout);
