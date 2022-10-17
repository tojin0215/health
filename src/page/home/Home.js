import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import Drawer from '../../component/navigation/Drawer';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import '../../styles/home/home.css';

// 컴포넌트
import UserSearch from '../../component/customer/UserSearch';

// 리액트 부트스트랩 관련
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// MUI
import TextField from '@mui/material/TextField';

// import  { PC, Mobile } from '../../component/MediaQuery';
// import Menu from '../../component/navigation/Menu';

// 아이콘
import { TbMoodSuprised } from 'react-icons/tb';

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
      show: false,
      setShow: true,
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
        {this.props.userinfo.loginWhether === 2 ? (
          // 회원
          <Container>
            <Row>시간표(본인것만)</Row>
            <Row>배정된 운동목록</Row>
            <Row>
              <Col xs={6} className='sectionGlass'>
                <h5>센터시설이용 {'>'}</h5>
                <Row>
                  <Col>사물함</Col>
                  <Col>3번</Col>
                  <Col>사용중</Col>
                </Row>
                <Row>
                  <Col>운동복</Col>
                  <Col>사용안함</Col>
                </Row>
              </Col>
              <Col xs={6} className='sectionGlass'>
                <h5>보유중인 이용권 {'>'}</h5>
                <Row>
                  <Col>GX [기간권]</Col>
                  <Col>[D - 365]</Col>
                </Row>
                <Row>
                  <Col>필라테스 [횟수권]</Col>
                  <Col>[30/30]</Col>
                </Row>
              </Col>
            </Row>
          </Container>
        ) : this.props.userinfo.loginWhether === 1 ? (
          // 강사
          <Container>
            <Row md={3}>
              <Col className='text-end'>
                <Button
                  className='reservation__class-prev'
                  name='prev'
                  variant='outline-light'
                  onClick={this.handleWeekClick}
                >
                  이전주
                </Button>
              </Col>
              <Col className='text-center align-self-center fs-5'>
                {moment(this.state.reserv_date)
                  .day(0)
                  .add(this.state.dayIncreament, 'days')
                  .format('YYYY-MM-DD (ddd)')}{' '}
                ~{' '}
                {moment(this.state.reserv_date)
                  .day(6)
                  .add(this.state.dayIncreament, 'days')
                  .format('YYYY-MM-DD (ddd)')}
              </Col>
              <Col className='text-start'>
                <Button
                  className='reservation__class-next'
                  name='next'
                  variant='outline-light'
                  onClick={this.handleWeekClick}
                >
                  다음주
                </Button>
              </Col>
              <Col xs={12} md={12}>
                <table className='table classTable mt-3' name='classTable'>
                  <thead>
                    <tr>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(0)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(1)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(2)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(3)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(4)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(5)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                      <th scope='col' align='center'>
                        {moment(this.state.reserv_date)
                          .day(6)
                          .add(this.state.dayIncreament, 'days')
                          .format('MM-DD (dd)')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td name='mon' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary  rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td name='tue' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td name='wed' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td name='thu' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ' '
                          )}
                        </div>
                      </td>
                      <td name='fri' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                      <td name='sat' align='center' className='align-top'>
                        <div className='class-info'>
                          {1 == true ? (
                            <div className='py-2 my-1 text-secondary rounded'>
                              <TbMoodSuprised className='fs-3' />
                              <p>수업이 없습니다.</p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col className='reservation__class__console'>
                {this.props.userinfo.loginWhether === 2 ? (
                  ' '
                ) : (
                  <Button
                    className='reservation__class__console-addbtn mb-2 w-100 '
                    variant='outline-primary'
                    onClick={this.goReservationClass}
                  >
                    수업추가
                  </Button>
                )}
                <div className='reservation__class__console-info'>
                  <h5>선택된 수업</h5>
                  <div className='reservation__class__console-infoContent'>
                    <dl>
                      <div className='exercise_name'>
                        <dt>운동명</dt>
                        <dd className='text-end'>
                          {this.state.exercise_name ? (
                            <span>
                              {this.state.exercise_name} [{this.state.kind}]
                            </span>
                          ) : (
                            <span>클래스 이름입니다[종류]</span>
                          )}
                          <TextField
                            id='exercise_name'
                            className='d-none'
                            value={this.state.exercise_name}
                            // onChange={this.handleChange}
                            label='운동명'
                            err={this.state.exercise_name_err}
                          />
                        </dd>
                      </div>
                      <div className='class_date'>
                        <dt>날짜</dt>
                        <dd className='text-end'>
                          <p className='fw-bold text-primary'>
                            {moment(this.state.class_date).format(
                              'yyyy-MM-DD'
                            ) == 'Invalid date'
                              ? ''
                              : moment(this.state.class_date).format(
                                  'yyyy-MM-DD'
                                )}
                          </p>
                          <TextField
                            id='class_date'
                            className='d-none'
                            name='class_date'
                            value={this.state.class_date}
                            label='배정된 날짜'
                          />
                        </dd>
                      </div>
                      <div className='time'>
                        <dt>시간</dt>
                        <dd className='text-end'>
                          {this.state.time == true ? (
                            <>
                              <span>{this.state.time}</span>
                              <TextField
                                id='time'
                                className='d-none'
                                value={this.state.time}
                                // onChange={this.handleChange}
                                label='시간'
                              />
                            </>
                          ) : (
                            <span>10:00</span>
                          )}
                        </dd>
                      </div>
                      <div className='number_of_people'>
                        <dt>현재정원</dt>
                        <dd className='text-end'>
                          {this.state.number_of_people ? (
                            <span>{this.state.number_of_people} 명</span>
                          ) : (
                            <span>9/10 명</span>
                          )}
                          <TextField
                            id='number_of_people'
                            className='d-none'
                            value={this.state.number_of_people}
                            // onChange={this.handleChange}
                            label='최대 인원수'
                          />
                        </dd>
                      </div>
                      <div className='class_date'>
                        <dt>예약자</dt>
                        <dd className='text-end'>예약자이름</dd>
                      </div>
                    </dl>
                  </div>
                  <Row>
                    {/* 
                  강사명 표시
                <Col className='' xs={12} sm={4}>
                  <div className=''>
                    <p className='fw-bold text-primary'>{this.state.trainer}</p>
                  </div>
                  <TextField
                    id='trainer'
                    className='d-none'
                    value={this.state.trainer}
                    // onChange={this.handleChange}
                    label='강사명'
                    // err={this.state.trainer_err}
                  />
                </Col> */}
                    <Col className='' xs={12} sm={4}></Col>
                  </Row>
                </div>
                {this.props.userinfo.loginWhether === 2 ? (
                  <Col className='text-center my-3 '>
                    <TextField
                      id='customer_name'
                      variant='standard'
                      value={this.props.userinfo.manager_name}
                      // onChange={this.handleChange}
                    />
                  </Col>
                ) : (
                  <Col className='text-center '>
                    {this.state.open ? (
                      <UserSearch
                        open={this.state.open}
                        setOpen={(o) => this.setState({ open: o })}
                        fitness_no={this.props.userinfo.fitness_no}
                        loginWhether={this.props.userinfo.loginWhether}
                        joinNo={this.props.userinfo.joinNo}
                        handleUser={this.handleUser}
                      />
                    ) : (
                      <>
                        <TextField
                          id='customer_name'
                          disabled
                          placeholder='회원검색'
                          variant='standard'
                          onClick={() => this.setState({ open: true })}
                          className='customer-input--search w-100 justify-content-center mt-2'
                          InputProps={{ disableUnderline: true }}
                          value={this.state.customer_name}
                          // onChange={this.handleChange}
                          error={this.state.customer_name_err}
                        />
                      </>
                    )}
                  </Col>
                )}
                <Col className='text-center w-100 mt-2' xs={12}>
                  <Button
                    className='btnSolid w-100'
                    type='button'
                    onClick={this.handleOnClick}
                  >
                    예약하기
                  </Button>
                </Col>
              </Col>
            </Row>
          </Container>
        ) : (
          // 사업자
          <Container>
            <Button variant='secondary'>시간표</Button>
            <Row>
              <Col xs={3} className='sectionGlass-manager '>
                <Row>
                  <Col className='sectionGlass-manger-Tit'>
                    전체회원
                    <br />
                    <strong>99999</strong>명
                  </Col>
                  <Col>버튼</Col>
                </Row>
                <Row className='mt-5'>
                  <Col className='sectionGlass-manager-des'>
                    현재까지 등록된 모든 회원수는
                    <br />
                    99999명 입니다.
                  </Col>
                </Row>
                {/* <Button>{'>'}</Button> */}
              </Col>
              <Col xs={3} className='sectionGlass-manager'>
                <p>유효회원</p>
                <p>99999명</p>
                <p>현재 회원권 활성화된 회원수는</p>
                <p>9999명 입니다.</p>
                <Button>{'>'}</Button>
              </Col>
              <Col xs={3} className='sectionGlass-manager'>
                <p>마감임박회원</p>
                <p>99999명</p>
                <p>이용권 만료 일주일 이내 회원수는</p>
                <p>9999명 입니다.</p>
                <Button>{'>'}</Button>
              </Col>
              <Col xs={3} className='sectionGlass-manager'>
                <p>마감회원</p>
                <p>99999명</p>
                <p>최근 한달이내 마감된 회원수는</p>
                <p>9999명 입니다.</p>
                <Button>{'>'}</Button>
              </Col>
            </Row>
            <Row className='sectionGlass-manager '>
              <Col xs={6} className='salesStatis'>
                <Row className='d-flex justify-content-between'>
                  <Col xs={8}>
                    당일 매출
                    <br />
                    2022년 07월 30일
                  </Col>
                  <Col xs={4}>3,200,000원</Col>
                </Row>
              </Col>
              <Col xs={6} className='salesStatis'>
                <Row>
                  <div>
                    <p>당월 누적 매출</p>
                    <p>2022년 07월</p>
                  </div>
                  <div>3,200,000원</div>
                </Row>
              </Col>
              <Col xs={12}>
                <div id='chart'>매출 차트 공간</div>
              </Col>
            </Row>
          </Container>
        )}
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
                <Row xs={1} sm={2} md={6} className='text-center d-flex'>
                  <Col>
                    <Link to='/trainer'>강사 관리</Link>
                  </Col>
                  <Col>
                    <Link to='/client'>회원 관리</Link>
                  </Col>
                  <Col>
                    <Link to='reservation'>수업 예약</Link>
                  </Col>
                  <Col>
                    <Link to='workoutAlloted'>운동 배정</Link>
                  </Col>
                  <Col>
                    <Link to='sales'>매출 관리</Link>
                  </Col>
                </Row>
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
              <Col xs={12} sm={4}>
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
              <Col xs={12} sm={4}>
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
              <Col xs={12} sm={4}>
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
