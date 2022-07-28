import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Authentication from '../login/Authentication';
import Navigation from '../../component/navigation/Navigation';
import { Slide } from 'react-slideshow-image';

import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { loginRequest } from '../../action/authentication';
import 'react-slideshow-image/dist/styles.css';
import '../../styles/login/Login.css';

import 'react-slideshow-image/dist/styles.css';
import { choiceLoginClient, choiceLoginTrainer } from '../../api/user';

// React-Bootstrap
import { Row, Col, Container, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

// svg image
// import { ReactComponent as SvgWorkingOut } from '../../../public/assets/working_out.svg';

const fadeProperties = {
  duration: 2000,
  canSwipe: false,
};

class Login extends Component {
  handleLogin = (id, pw) => {
    return this.props.loginRequest(id, pw).then(() => {
      if (this.props.status === 'SUCCESS') {
        // create session data
        let loginData = {
          isLoggedIn: true,
          id: id,
        };
        document.cookie = 'key=' + btoa(JSON.stringify(loginData));
        choiceLoginTrainer(id).then((trainer) => {
          choiceLoginClient(id).then((client) => {
            if (trainer.length > 1) {
              alert('강사 로그인 선택');
              this.props.history.push('/choiceLogin');
              return true;
            } else if (client.length > 1) {
              alert('회원 로그인 선택');
              this.props.history.push('/choiceLogin');
              return true;
            } else if (trainer.length >= 1 && client.length >= 1) {
              alert('회원&&강사 로그인 선택');
              this.props.history.push('/choiceLogin');
            } else {
              // alert(id + '님 반갑습니다.');
              this.props.history.push('/home');
              return true;
            }
          });
        });
      } else if (this.props.status === 'PERMITWAITING') {
        alert('승인 대기 중입니다.');
        return false;
      } else {
        alert('ID나 비밀번호를 확인해주세요.');
        return false;
      }
    });
  };

  // loginWhetherhow = (id) => {
  //   this.props.userinfo.loginWhether === 1
  //     ? choiceLoginTrainer(id).then((trainer) => {
  //         trainer.length > 1;
  //         return true;
  //       })
  //     : this.props.userinfo.loginWhether === 2
  //     ? choiceLoginClient(id).then((client) => {
  //         client.length > 1;
  //         return true;
  //       })
  //     : true;
  // };

  render() {
    // console.log(this.props.userinfo);
    // console.log(this.props.status.valid);
    // console.log('Login', this.props.status);
    return (
      <div className='login login_wrap wrap'>
        {/* <div className='header'>
					<Header />
					<Navigation />
				</div> */}
        <div className='localNavigation login__local-navigation pt-1'>
          <div className='container'>
            <h1 className='pt-2'>
              <Image
                className='login_logo'
                src={process.env.PUBLIC_URL + '/assets/logo-circle-yellow.png'}
                // src={process.env.PUBLIC_URL + '/assets/divvy_gif_1.gif'}
              />
            </h1>
          </div>
        </div>
        <div className='bg-black'>
          <Container className='login__authentication--container my-0'>
            <Row>
              <Col className='login__main-visual--box' md={9}>
                {/* <Image
                  className='login__main-visual--image'
                  src={process.env.PUBLIC_URL + '/assets/login-main-visual.jpg'}
                /> */}
                <p>반갑습니다.</p>
                <p>편리한 피트니스 관리</p>
                <Image
                  className='login__main-visual--logo'
                  src={process.env.PUBLIC_URL + '/assets/logo-text-white.svg'}
                />
              </Col>
              <Col md={3}>
                <Authentication mode={true} onLogin={this.handleLogin} />
              </Col>
            </Row>
          </Container>
        </div>
        <div className='login__introduce'>
          <Container>
            <h5 className='login__introduce__title'>
              <Row className='w-100'>
                <Col className='login__introduce__title--brand' md={2}>
                  <span>DIVVY</span>
                </Col>
                <Col className='login__introduce__title--text' md={10}>
                  <span>
                    헬스장&#183;회원 관리를 한 번에 해결할 수 있습니다.
                  </span>
                </Col>
              </Row>
            </h5>
            <CardGroup className='login__introduce-card'>
              <Card>
                <Card.Img
                  variant='top'
                  src={process.env.PUBLIC_URL + '/assets/login-center.jpg'}
                />
                <Card.Body>
                  <Card.Title>센터</Card.Title>
                  <Card.Text>
                    • 헬스, 필라테스 등의 운동 상품 및 운동복, 사물함 등의 상품
                    등록
                  </Card.Text>
                  <Card.Text>• 결제, 매출 관리까지</Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant='top'
                  src={process.env.PUBLIC_URL + '/assets/login-workout.jpg'}
                />
                <Card.Body>
                  <Card.Title>운동</Card.Title>
                  <Card.Text>
                    • 센터의 전문가가 사용자와 상담하고 적합한 운동의 리스트를
                    배정해 줄 수 있습니다.
                  </Card.Text>
                  <Card.Text>• 운동 후 체크 서비스까지</Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant='top'
                  src={process.env.PUBLIC_URL + '/assets/login-workers.jpg'}
                />
                <Card.Body>
                  <Card.Title>회원관리</Card.Title>
                  <Card.Text>• 쉬운 회원등록 및 수정</Card.Text>
                  <Card.Text>
                    • 회원의 인바디 정보, 운동 정보 등도 함께 관리할 수
                    있습니다.
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardGroup>
          </Container>
        </div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.login.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (id, pw) => {
      return dispatch(loginRequest(id, pw));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
