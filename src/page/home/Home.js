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

// 라이브러리
import DatePicker from 'react-datepicker';
import Chart from 'react-apexcharts';

// 컴포넌트
import UserSearch from '../../component/customer/UserSearch';
import {
  inbodiesSelect,
  selectClientReservation,
  selectTrainerReservation,
  workoutAllotedSelect,
} from '../../api/user';
import ClassTimeTable from '../../component/home/classTimeTable';

// 리액트 부트스트랩 관련
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// MUI
import { Refresh } from '@mui/icons-material';
import { TablePagination, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// import  { PC, Mobile } from '../../component/MediaQuery';
// import Menu from '../../component/navigation/Menu';

// 아이콘
import { TbMoodSuprised } from 'react-icons/tb';
import { AiOutlineRightCircle } from 'react-icons/ai';

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

const WorkoutAllotedView = ({
  idwa,
  fitness_no,
  client_no,
  workout,
  region,
  machine,
  default_set,
  default_count,
  default_rest,
  url,
}) => {
  return (
    <TableRow>
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
    </TableRow>
  );
};
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
      client_name: '',
      open: false,
      workoutAllotlist: [],
      exerciseAllotlist: [],
      rowsPerPage: 5,
      page: 0,
      workoutA_date: new Date(),
      // 매출 차트
      options: {
        chart: {
          id: 'sales-bar',
        },
        xaxis: {
          categories: [
            '2022.03',
            '2022.04',
            '2022.05',
            '2022.06',
            '2022.07',
            '2022.08',
            '2022.09',
            '2022.10',
          ],
        },
      },
      series: [
        {
          name: '현금',
          data: [800, 650, 760, 940, 840, 745, 850, 810],
        },
        {
          name: '계좌이체',
          data: [900, 850, 960, 840, 940, 845, 950, 910],
        },
        {
          name: '카드',
          data: [3300, 2860, 3950, 4820, 3950, 4250, 3860, 4800],
        },
      ],
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

  handleUser = (client) => {
    const { idc, client_name } = client;

    this.setState({
      client: client,
      client_name: client_name,
      idc: idc,
      open: false,
    });
    this.workoutAllotedView(idc);
  };

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

  workoutAllotedView = (idc) => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        workoutAllotedSelect(
          fitness_no,
          this.state.line === 3 ? this.state.idc2 : idc,
          this.state.line === 3
            ? moment(this.state.workoutB_date).format('YYYY-MM-DD')
            : moment(this.state.workoutA_date).format('YYYY-MM-DD')
        ).then((result) => {
          const items = result.map((data, index, array) => {
            return (
              <WorkoutAllotedView
                idwa={data.idwa}
                fitness_no={data.fitness_no}
                client_no={data.client_no}
                workout={data.workout}
                region={data.region}
                machine={data.machine}
                default_set={data.default_set}
                default_count={data.default_count}
                default_rest={data.default_rest}
                url={data.url}
              />
            );
          });
          this.setState({ workoutAllotlist: items.reverse() });
        });
      });
    });
  };

  render() {
    const { userinfo } = this.props;
    console.log('client_name : ', userinfo.client_name);
    console.log('manager_name : ', userinfo.manager_name);
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
                              <p>
                                예약된 수업이
                                <br />
                                없습니다
                              </p>
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
              <Col className='sectionGlass' xs={12} md={12}>
                <h5>
                  <Row xs='auto'>
                    <Col className='customer_name mb-3'>
                      {/* {this.state.open ? (
                        <>
                          <UserSearch
                            open={this.state.open}
                            setOpen={(o) => this.setState({ open: o })}
                            fitness_no={this.props.userinfo.fitness_no}
                            loginWhether={this.props.userinfo.loginWhether}
                            joinNo={this.props.userinfo.joinNo}
                            handleUser={this.handleUser}
                          />
                        </>
                      ) : (
                        <>
                          <TextField
                            id='customer_name'
                            label='회원검색'
                            disabled
                            variant='standard'
                            onClick={() => this.setState({ open: true })}
                            className='customer-input--search'
                            InputProps={{ disableUnderline: true }}
                            value={this.state.client_name}
                          />
                        </>
                      )} */}
                      {userinfo.manager_name}
                    </Col>
                    <Col>님의</Col>
                    <Col>
                      <DatePicker
                        className='text-center'
                        selected={this.state.workoutA_date}
                        onChange={(date) => this.dateOnChange(date)}
                        dateFormat='yyyy년MM월dd일'
                        font-size='1.6rem'
                        maxDate={new Date()}
                      />
                    </Col>
                    <Col>에 배정된 운동목록입니다.</Col>
                    {/* {moment(this.state.workoutA_date).format('YYYY년 MM월 DD일')} */}
                    <TableContainer component={Paper}>
                      <Table className='table--block table-light'>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='col'>부위</TableCell>
                            <TableCell scope='col'>이름</TableCell>
                            <TableCell scope='col'>운동기구</TableCell>
                            <TableCell scope='col'>세트</TableCell>
                            <TableCell scope='col'>횟수</TableCell>
                            <TableCell scope='col'>휴식</TableCell>
                            <TableCell scope='col'>URL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.workoutAllotlist.slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )}
                        </TableBody>
                      </Table>
                      {this.state.workoutAllotlist.length ? (
                        ''
                      ) : (
                        <div className='p-5 fs-5 fw-bold text-center'>
                          <TbMoodSuprised className='fs-3' />
                          <p>배정된 운동이 없습니다.</p>
                        </div>
                      )}
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          {
                            label: 'All',
                            value: this.state.workoutAllotlist.length,
                          },
                        ]}
                        count={this.state.workoutAllotlist.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onPageChange={this.handleChangePage}
                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  </Row>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col xs={6} className='sectionGlass'>
                <h4>
                  센터시설이용 <span>&#62;</span>
                </h4>
                <Row>
                  <Col xs={6}>사물함</Col>
                  <Col xs={2}>3번</Col>
                  <Col xs={4}>사용중</Col>
                </Row>
                <Row>
                  <Col xs={8}>운동복</Col>
                  <Col xs={4}>사용안함</Col>
                </Row>
              </Col>
              <Col xs={6} className='sectionGlass'>
                <h4>
                  보유중인 이용권 <span>&#62;</span>
                </h4>
                <Row>
                  <Col xs={8}>GX [기간권]</Col>
                  <Col xs={4}>[D - 365]</Col>
                </Row>
                <Row>
                  <Col xs={8}>필라테스 [횟수권]</Col>
                  <Col xs={4}>[30/30]</Col>
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
            <ClassTimeTable />
            <Row>
              <Col className='sectionGlass-manager me-3'>
                <Row>
                  <Col className='sectionGlass-manger-Tit'>
                    전체회원
                    <br />
                    <strong>99999</strong>명
                  </Col>
                  <Col>
                    <AiOutlineRightCircle />
                  </Col>
                </Row>
                <Row>
                  <Col className='sectionGlass-manager-des mt-5'>
                    현재까지 등록된 모든 회원수는
                    <br />
                    99999명 입니다.
                  </Col>
                </Row>
                {/* <Button>{'>'}</Button> */}
              </Col>
              <Col className='sectionGlass-manager me-3'>
                <Row>
                  <Col className='sectionGlass-manger-Tit'>
                    유효회원
                    <br />
                    <strong>99999</strong>명
                  </Col>
                  <Col>
                    <AiOutlineRightCircle />
                  </Col>
                </Row>
                <Row>
                  <Col className='sectionGlass-manager-des mt-5'>
                    현재까지 등록된 모든 회원수는
                    <br />
                    99999명 입니다.
                  </Col>
                </Row>
              </Col>
              <Col className='sectionGlass-manager me-3'>
                <Row>
                  <Col className='sectionGlass-manger-Tit'>
                    마감임박회원
                    <br />
                    <strong>99999</strong>명
                  </Col>
                  <Col>
                    <AiOutlineRightCircle />
                  </Col>
                </Row>
                <Row>
                  <Col className='sectionGlass-manager-des mt-5'>
                    현재까지 등록된 모든 회원수는
                    <br />
                    99999명 입니다.
                  </Col>
                </Row>
              </Col>
              <Col className='sectionGlass-manager'>
                <Row>
                  <Col className='sectionGlass-manger-Tit '>
                    마감회원
                    <br />
                    <strong>99999</strong>명
                  </Col>
                  <Col>
                    <AiOutlineRightCircle />
                  </Col>
                </Row>
                <Row>
                  <Col className='sectionGlass-manager-des mt-5'>
                    현재까지 등록된 모든 회원수는
                    <br />
                    99999명 입니다.
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='sectionGlass-manager '>
              <Col className='sales-statis me-3'>
                <Row className=''>
                  <Col xs={7}>
                    <strong>당일 매출</strong>
                    <br />
                    2022년 07월 30일
                  </Col>
                  <Col xs={5} className='sales-total'>
                    3,200,000원
                  </Col>
                </Row>
              </Col>
              <Col className='sales-statis'>
                <Row>
                  <Col xs={7}>
                    <strong>당월 누적 매출</strong>
                    <br />
                    2022년 07월
                  </Col>
                  <Col xs={5} className='sales-total'>
                    20,000,000원
                  </Col>
                </Row>
              </Col>
              <Col xs={12}>
                <div className='mixed-chart'>
                  <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type='bar'
                    width='100%'
                    height='400px'
                  />
                </div>
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
