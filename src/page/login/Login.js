import React, { Component } from 'react';
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
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

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
            if (this.props.userinfo.loginWhether === 1 && trainer.length > 1) {
              // alert('강사 로그인 선택');
              this.props.history.push('/choiceLogin');
              return true;
            } else if (
              this.props.userinfo.loginWhether === 2 &&
              client.length > 1
            ) {
              // alert('회원 로그인 선택');
              this.props.history.push('/choiceLogin');
              return true;
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
      <div className='wrap'>
        {/* <div className='header'>
					<Header />
					<Navigation />
				</div> */}
        <div className='localNavigation'>
          <div className='container'>
            <h2>
              <div className='parallelogram'></div>
              로그인
              <span>.</span>
            </h2>
          </div>
        </div>
        <Container className='my-0'>
          <Authentication mode={true} onLogin={this.handleLogin} />
        </Container>
        <div>
          <Container>
            <h3>About Us</h3>
            <CardGroup>
              <Card>
                <Card.Img
                  variant='top'
                  src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22187%22%20height%3D%22160%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20187%20160%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1818018722b%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3Avar(--bs-font-sans-serif)%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1818018722b%22%3E%3Crect%20width%3D%22187%22%20height%3D%22160%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2268.125%22%20y%3D%2284.7109375%22%3E187x160%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                />
                <Card.Body>
                  <Card.Title>상품</Card.Title>
                  <Card.Text>
                    헬스, 필라테스 등의 운동 상품과 함께 운동복, 사물함 등의
                    상품도 함께 등록하고 매출을 관리할 수 있습니다.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant='top'
                  src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22187%22%20height%3D%22160%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20187%20160%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1818018722b%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3Avar(--bs-font-sans-serif)%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1818018722b%22%3E%3Crect%20width%3D%22187%22%20height%3D%22160%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2268.125%22%20y%3D%2284.7109375%22%3E187x160%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                />
                <Card.Body>
                  <Card.Title>운동</Card.Title>
                  <Card.Text>
                    센터의 전문가가 사용자와 상담하고 적합한 운동의 리스트를
                    배정해 줄 수 있습니다.
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card>
                <Card.Img
                  variant='top'
                  src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22187%22%20height%3D%22160%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20187%20160%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1818018722b%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3Avar(--bs-font-sans-serif)%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1818018722b%22%3E%3Crect%20width%3D%22187%22%20height%3D%22160%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2268.125%22%20y%3D%2284.7109375%22%3E187x160%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                />
                <Card.Body>
                  <Card.Title>회원관리</Card.Title>
                  <Card.Text>
                    회원을 쉽게 등록하고 수정할 수 있으며, 회원의 인바디 정보,
                    운동 정보 등도 함께 관리할 수 있습니다.
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
