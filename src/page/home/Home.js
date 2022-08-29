import { Component } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import Drawer from '../../component/navigation/Drawer';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import '../../styles/home/home.css';

// 리액트 부트스트랩 관련
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// import  { PC, Mobile } from '../../component/MediaQuery';
// import Menu from '../../component/navigation/Menu';

// 이미지 파일 관련
// import MainVisual1 from 'url(/src/img/mainVisual1.png)';
import btnCustomer from '../../../src/img/btnCustomer.png';
import btnSetting from '../../../src/img/btnSetting.png';
import btnExercise from '../../../src/img/btnExercise.png';
import btnSales from '../../../src/img/btnSales.png';
import btnStatic from '../../../src/img/btnStatic.png';
import aboutManage from '../../../src/img/aboutManage.png';
import aboutProduct from '../../../src/img/aboutProduct.png';
import aboutExercise from '../../../src/img/aboutExercise.png';

import { SERVER_URL } from '../../const/settings';
import AlertToastComponent from '../../component/home/AlertToast';
import {
  choiceTest,
  clientSelect,
  salesSelect,
  salesSelect2,
} from '../../api/user';
import { height } from '@mui/system';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCustomer: 0,
      totalClient: 0,
      todayCustomer: 0,
      monthSales: 0,
      todaySales: 0,
      admin: this.props.userinfo.manager_name,
    };
    this.cusFetch();
    // console.log(`${MainVisual1}`);
  }

  goLogin = () => {
    this.props.history.push('/');
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
    // console.log('get cookie by name / get loginData from cookie : ', loginData);
    //eyJpc0xvZ2dlZEluIjp0cnVlLCJpZCI6InRvamluIn0=

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));
    // if not logged in, do nothing
    if (!loginData.isLoggedIn) {
      this.props.history.push('/');
      return;
    }
    // console.log(
    //   'get loginData from cookie / decode base64 & parse json : ',
    //   loginData
    // );
    //{isLoggedIn:true, id:"tojin"}

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(() => {
      // console.log('????', this.props.status.valid);
      // if session is not valid -->logout
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
        this.cusFetch();
      }
    });
  }

  cusFetch = (tools, exercise) => {
    clientSelect(this.props.userinfo.fitness_no).then((result) => {
      this.setState({ totalClient: result.length });
    });
    salesSelect(this.props.userinfo.fitness_no).then((res) => {
      let sum = 0;
      for (let i = 0; i < res.length; i++) {
        sum =
          Number(sum) +
          Number(res[i].lockerPrice) +
          Number(res[i].sportswearPrice) +
          Number(res[i].exercisePrice);
      }
      this.setState({ todaySales: sum });
    });

    let today = new Date();
    let startTime = new Date(today.getFullYear(), today.getMonth(), 1);
    let endTime = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    //alert(today)
    salesSelect2(
      this.props.userinfo.fitness_no,
      startTime,
      endTime,
      tools != undefined ? tools : '',
      exercise != undefined ? exercise : ''
    ).then((res) => {
      let sum = 0;
      for (let i = 0; i < res.length; i++) {
        sum =
          Number(sum) +
          Number(res[i].lockerPrice) +
          Number(res[i].sportswearPrice) +
          Number(res[i].exercisePrice);
      }
      this.setState({ monthSales: sum });
      // console.log(res);
    });
    // 금일 방문 고객
    fetch(ip + '/customerenter?fitness_no=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ todayCustomer: res.length });
      });
  };

  fommat = (num) => {
    if (Number(num) >= 1000) {
      const parts = num.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');

      // return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return num;
    }
  };

  render() {
    const { userinfo } = this.props;
    // console.log('userinfo : ');
    // console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
    // console.log('오늘매출', this.state.todaySales);
    // console.log(userinfo.joinNo);
    // console.log(this.props.userinfo);
    return (
      <div className='wrap home'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          {/* 이전처럼 Navigation Menu 공존 */}
        </div>
        {/*.header */}
        <div
          className='home__mainvisual'
          style={{
            backgroundImage: 'url(/assets/home__main-visual.jpg)',
          }}
        >
          {!this.props.userinfo.loginWhether ? (
            <div className='home__dashboard'>
              <Row className='home__dashboard__box'>
                <Col lg='1'>
                  <label>
                    <p>등록된 회원</p>
                    <span>{this.fommat(this.state.totalClient)}</span>
                  </label>
                </Col>
                <Col lg='1'>
                  <label>
                    <p>당일 매출</p>
                    <span>{this.fommat(this.state.todaySales)}</span>
                  </label>
                </Col>
                <Col lg='1'>
                  <label>
                    <p>월 매출</p>
                    <span>{this.fommat(this.state.monthSales)}</span>
                  </label>
                </Col>
              </Row>
            </div>
          ) : (
            ''
          )}

          <Container className='home__main-visual--content'>
            <div className='home__main-visual--logo'>
              <p>새로워진 피트니스 센터 관리</p>
              <h2>DIVVY</h2>
            </div>
            <div className='home__main-visual--menu'>
              {this.props.userinfo.loginWhether === 2 ? (
                <ul className='text-cente'>
                  <li>
                    <Link to='introduce'>센터 소개</Link>
                  </li>
                  <li>
                    <Link to='inbodies'>인바디 정보</Link>
                  </li>
                  <li>
                    <Link to='reservation'>수업 예약</Link>
                  </li>
                </ul>
              ) : this.props.userinfo.loginWhether === 1 ? (
                <ul className='text-center'>
                  <li>
                    <Link to='/client'>회원 관리</Link>
                  </li>
                  <li>
                    <Link to='reservation'>수업 예약</Link>
                  </li>
                  <li>
                    <Link to='workoutAlloted'>운동 배정</Link>
                  </li>
                </ul>
              ) : (
                <ul className='text-center d-flex'>
                  <li>
                    <Link to='/trainer'>강사 관리</Link>
                  </li>
                  <li>
                    <Link to='/client'>회원 관리</Link>
                  </li>
                  <li>
                    <Link to='reservation'>수업 예약</Link>
                  </li>
                  <li>
                    <Link to='workoutAlloted'>운동 배정</Link>
                  </li>
                  <li>
                    <Link to='sales'>매출 관리</Link>
                  </li>
                </ul>
              )}
            </div>
          </Container>
        </div>
        <Container>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {
              <AlertToastComponent
                fitness_no={this.props.userinfo.fitness_no}
              />
            }
          </div>
          <section className='home__about'>
            <h4 className='home_about--title'>
              About 헬스케어CRM 서비스 DIVVY
            </h4>
            <p className='home_about--explain'>
              헬스 회원 스마트 관리 시스템으로 <br /> 기존 회원 관리 방식에서
              탈피하여 <br />
              쉬운 회원관리, 스마트한 서비스를 제공합니다.
            </p>
            <Row xs={2} md={5} className='home__shortcut'>
              <Col>
                <Link to='/client'>
                  <div className='home__shortcut-box'>
                    <Image
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/home__content-client.jpg'
                      }
                    />
                    <h5>회원 관리</h5>
                  </div>
                </Link>
              </Col>
              <Col>
                <Link to='/trainer'>
                  <div className='home__shortcut-box'>
                    <Image
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/home__content-coach.jpg'
                      }
                    />
                    <h5>강사 관리</h5>
                  </div>
                </Link>
              </Col>
              <Col>
                <Link to='/reservation'>
                  <div className='home__shortcut-box'>
                    <Image
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/home__content-class.jpg'
                      }
                    />
                    <h5>수업 일정</h5>
                  </div>
                </Link>
              </Col>
              <Col>
                <Link to='/workoutAlloted'>
                  <div className='home__shortcut-box'>
                    <Image
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/home__content-workout.jpg'
                      }
                    />
                    <h5>운동 배정</h5>
                  </div>
                </Link>
              </Col>
              <Col>
                <Link to='/sales'>
                  <div className='home__shortcut-box'>
                    <Image
                      src={
                        process.env.PUBLIC_URL +
                        '/assets/home__content-sales.jpg'
                      }
                    />
                    <h5>매출 관리</h5>
                  </div>
                </Link>
              </Col>
            </Row>
            <ul>{userinfo.fitness_no === 1 ? '' : null}</ul>
          </section>
        </Container>
        <section
          className='home__mission'
          style={{
            backgroundImage: 'url(/assets/home__mission-background.jpg)',
          }}
        >
          <Container>
            <h4>Our Mission</h4>
            <p>
              센터 운영자와 강사 및 회원 모두가 편하게 사용할 수 있습니다.
              <br />
              웹&amp;앱을 이용한 출석체크 등 센터 편의 프로그램부터
              <br />
              개개인의 맞춤형 운동정보, 매출관리까지 한 번에 관리할 수 있습니다.
            </p>
            <Row xs={1} md={3}>
              <Col xs={4}>
                <div className='home__mission--contents'>
                  <div className='home__mission--img-box'>
                    <Image
                      className='w-100'
                      src={process.env.PUBLIC_URL + '/assets/home-shopping.svg'}
                    />
                  </div>
                  <div className='home__mission--txt-box'>
                    <h5>상품</h5>
                    <p>
                      헬스, 필라테스 등의 운동상품과 함께 운동복, 사물함 등의
                      상품도 함께 등록하고 매출을 관리할 수 있습니다.
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                {/* misson */}
                <div className='home__mission--contents'>
                  <div className='home__mission--img-box'>
                    <Image
                      className='w-100'
                      src={process.env.PUBLIC_URL + '/assets/home-healthy.svg'}
                    />
                  </div>
                  <div className='home__mission--txt-box'>
                    <h5>운동</h5>
                    <p>
                      센터의 전문가가 사용자와 상담하고 적합한 운동 리스트를
                      배정해 줄 수 있습니다.
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <div className='home__mission--contents'>
                  <div className='home__mission--img-box'>
                    <Image
                      className='w-100'
                      src={process.env.PUBLIC_URL + '/assets/home-workers.svg'}
                    />
                  </div>
                  <div className='home__mission--txt-box'>
                    <h5>회원관리</h5>
                    <p>
                      회원을 쉽게 등록하고 수정할 수 있으며, 회원의 인바디 정보,
                      운동 정보 등도 함께 관리할 수 있습니다.
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    );
  }
}

const HomeStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};
const HomeDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);
