import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-dropdown';

import '../../styles/sales/AddSales.css';
import '../../styles/input.css';

import NumberFormat from 'react-number-format';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import MobNavigation from '../../component/navigation/MobNavigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

// React-Bootstrap
import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

// MUI
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import DatePicker from 'react-datepicker';
import UserSearch from '../../component/customer/UserSearch';
import { voucherInsert } from '../../api/user';
import { RFC_2822 } from 'moment/moment';
import { FaSleigh } from 'react-icons/fa';
// locale 오류로 임시 삭제
// import DatePicker, { registerLocale } from 'react-datepicker';
// import ko from 'date-fns/locale/ko';
// registerLocale('ko', ko);

const ip = SERVER_URL;
//const ip = 'localhost:3000';

const userList = [
  { num: 1, userName: '김투진', phone: '000-0000-0000' },
  { num: 2, userName: '이투진', phone: '000-1111-0000' },
  { num: 3, userName: '박투진', phone: '000-2222-0000' },
  { num: 4, userName: '최투진', phone: '000-3333-0000' },
  { num: 5, userName: '김투진', phone: '000-0000-0000' },
  { num: 6, userName: '이투진', phone: '000-1111-0000' },
  { num: 7, userName: '박투진', phone: '000-2222-0000' },
  { num: 8, userName: '최투진', phone: '000-3333-0000' },
];

const options = ['이름', '핸드폰'];
const defaultOption = options[0];

class AddSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitness_no: this.props.userinfo.fitness_no,
      member_no: '',
      //isChecked:false,
      paymentDate: new Date(),
      client_name: !this.props.location.state
        ? '회원 검색'
        : this.props.location.state.client_name,
      inputExercise: '',
      exercisePrice: 0,
      //locker:0,
      lockerPrice: 0,
      //sportswear:0,
      sportswearPrice: 0,
      //TotalPayment: 0,
      open: false,
      //searchKeyword:'',
      customerList: [],
      search: '',
      item: options[0],
      paidMembership: '',
      salesStart_date: new Date(),
      salesDays: '',
      checkboxGroup: {
        salesDaysCheckbox: true,
        paidMembershipCheckbox: false,
      },
      exerciseGroup: {
        pt: true,
        gx: false,
        pila: false,
        health: false,
        etc: false,
      },
      etcExercise: '',
      gxExercise: '',
      payGroup: {
        card: true,
        cash: false,
        transfer: false,
      },
      voucherType: '',
    };
    this.handleSalesDaysSelect = this.handleSalesDaysSelect.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  goLogin = () => {
    this.props.history.push('/');
  };
  goSales = () => {
    this.props.history.push('/sales');
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
      }
    });
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleStartDateChange(date) {
    this.setState({
      salesStart_date: date,
    });
  }

  handleSalesDaysSelect(e) {
    this.setState({
      salesDays: e.target.value,
    });
  }

  handleDateChange(date) {
    this.setState({
      paymentDate: date,
    });
  }

  // voucherSelect(e) {
  //   this.setState({
  //     voucherType: e,
  //   });
  //   console.log('선택된 이용권 종류입니다.', e);
  // }

  handleOnClick = (e) => {
    let exercisePrice1 = parseInt(
      this.state.exercisePrice.toString().replace(/[^(0-9)]/gi, '')
    );
    let lockerPrice1 = parseInt(
      this.state.lockerPrice.toString().replace(/[^(0-9)]/gi, '')
    );
    let sportswearPrice1 = parseInt(
      this.state.sportswearPrice.toString().replace(/[^(0-9)]/gi, '')
    );

    if (exercisePrice1 == '' || lockerPrice1 == '' || sportswearPrice1 == '') {
      if (exercisePrice1 == '') {
        exercisePrice1 = 0;
      }
      if (lockerPrice1 == '') {
        lockerPrice1 = 0;
      }
      if (sportswearPrice1 == '') {
        sportswearPrice1 = 0;
      }
    }

    if (this.state.client_name === '회원 검색') {
      alert('회원을 선택해주세요.');
    } else if (
      this.state.checkboxGroup['paidMembershipCheckbox'] == true &&
      this.state.paidMembership == ''
    ) {
      alert('횟수권의 올바른 횟수(회)를 입력해주세요.');
    } else if (
      this.state.checkboxGroup['salesDaysCheckbox'] == true &&
      this.state.salesDays == ''
    ) {
      alert('기간권의 올바른 기간(일)을 입력해주세요.');
    } else {
      fetch(ip + '/sales', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          fitness_no: this.state.fitness_no,
          client_name: this.state.client_name,
          exerciseName: this.state.exerciseGroup.pt
            ? '개인PT'
            : this.state.exerciseGroup.gx
            ? 'GX(' + this.state.gxExercise + ')'
            : this.state.exerciseGroup.pila
            ? '필라테스'
            : this.state.exerciseGroup.health
            ? '헬스'
            : this.state.exerciseGroup.etc
            ? '기타(' + this.state.etcExercise + ')'
            : '개인PT',
          exercisePrice: exercisePrice1,
          lockerPrice: lockerPrice1,
          sportswearPrice: sportswearPrice1,
          paymentTools: this.state.payGroup.card
            ? '카드'
            : this.state.payGroup.cash
            ? '현금'
            : this.state.payGroup.transfer
            ? '계좌이체'
            : '카드',
          paymentDate: this.state.paymentDate,
          paidMembership:
            this.state.checkboxGroup['paidMembershipCheckbox'] == false
              ? ''
              : this.state.paidMembership,
          salesStart_date:
            this.state.checkboxGroup['salesDaysCheckbox'] == false
              ? ''
              : this.state.salesStart_date,
          salesDays:
            this.state.checkboxGroup['salesDaysCheckbox'] == false
              ? ''
              : this.state.salesDays,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          this.voucherPost();
          alert('등록되었습니다.');

          // console.log(response);
        });
      this.props.history.push('/sales');
    }
  };

  voucherPost = () => {
    voucherInsert(
      this.state.client_name,
      this.state.fitness_no,
      this.state.exerciseGroup.pt
        ? '개인PT'
        : this.state.exerciseGroup.gx
        ? 'GX'
        : this.state.exerciseGroup.pila
        ? '필라테스'
        : this.state.exerciseGroup.health
        ? '헬스'
        : this.state.exerciseGroup.etc
        ? '기타(' + this.state.etcExercise + ')'
        : '개인PT',
      this.state.checkboxGroup['paidMembershipCheckbox'] == false
        ? ''
        : this.state.paidMembership,
      this.state.checkboxGroup['paidMembershipCheckbox'] == false
        ? ''
        : this.state.paidMembership, //paidMembership2
      this.state.paymentDate,
      this.state.checkboxGroup['salesDaysCheckbox'] == false
        ? ''
        : this.state.salesDays,
      this.state.checkboxGroup['salesDaysCheckbox'] == false
        ? ''
        : this.state.salesStart_date,
      this.state.checkboxGroup['salesDaysCheckbox'] == false
        ? ''
        : this.state.salesDays //salesDays2
    ).then((res) => {});
  };

  // plusHandle = () => {
  //   this.voucherPost();
  //   this.handleOnClick();
  // };
  handleCheckbox = (e) => {
    let obj = {
      paidMembershipCheckbox: false,
      salesDaysCheckbox: false,
    };
    obj[e.target.id] = e.target.checked;
    console.log('handleCheckbox 의 obj입니다', obj);
    this.setState({
      checkboxGroup: obj,
    });
    console.log(
      'handleCheckbox 의 checkboxGroup입니다',
      this.state.checkboxGroup.paidMembershipCheckbox
    );
    this.setState({
      salesDays: '',
      paidMembership: '',
    });
  };

  handleUser = (client) => {
    const { idc, client_name } = client;
    // console.log(client_name);

    this.setState({
      client: client,
      client_name: client_name,
      idc: idc,
      open: false,
    });
  };

  handleExerciseRadio = (e) => {
    let obj = {
      pt: false,
      gx: false,
      pila: false,
      health: false,
      etc: false,
    };
    obj[e.target.id] = e.target.checked;
    this.setState({
      exerciseGroup: obj,
    });
  };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handlePayRadio = (e) => {
    let obj = {
      card: false,
      cash: false,
      transfer: false,
    };
    obj[e.target.id] = e.target.checked;
    this.setState({
      payGroup: obj,
    });
  };

  render() {
    // console.log('___', this.state.customerList);
    const { userinfo } = this.props;
    // console.log(userinfo);
    // console.log(this.state.paymentTools);
    // console.log(this.props.location.state.client_name);
    console.log('client_name :', this.state.client_name);
    return (
      <div className='wrap addSales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MobNavigation goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                이용권 등록
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/client'>회원</Link>
                <span>&#62;</span>
                <Link to='#'>이용권 등록</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container className='addSales'>
          <form>
            <div className='sectionGlass'>
              <Row>
                <Col xs={12} lg={2} className='customer_name'>
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
                    <TextField
                      id='customer_name'
                      disabled
                      variant='standard'
                      className='customer-input--search'
                      InputProps={{ disableUnderline: true }}
                      value={this.state.client_name}
                      onClick={() => this.setState({ open: true })}
                    />
                  )}
                </Col>
                <Col xs={12} lg={10} className='w-100'>
                  {/* <span className='fs-5 fw-bold'>{this.state.client_name}</span> */}
                  <h5>
                    {this.state.client_name !== '회원 검색'
                      ? '님의 결제 등록입니다.'
                      : '회원을 선택해주세요.'}
                  </h5>
                </Col>
              </Row>
              <Row className='sports-classification'>
                <Col xs={12} lg={2}>
                  <h5>운동종목</h5>
                </Col>
                <Col xs={12} lg={10}>
                  <Form.Check inline>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='pt'
                      checked={this.state.exerciseGroup['pt']}
                      onChange={this.handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='pt' className='w-100'>
                      개인 PT
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='pila'
                      checked={this.state.exerciseGroup['pila']}
                      onChange={this.handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='pila' className='w-100'>
                      필라테스
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='health'
                      checked={this.state.exerciseGroup['health']}
                      onChange={this.handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='health' className='w-100'>
                      헬스
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='gx'
                      checked={this.state.exerciseGroup['gx']}
                      onChange={this.handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='gx' className=''>
                      GX
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Control
                      placeholder='GX'
                      id='gxExercise'
                      type='text'
                      value={this.state.gxExercise}
                      onChange={this.handleChange}
                    ></Form.Control>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup '
                      id='etc'
                      checked={this.state.exerciseGroup['etc']}
                      onChange={this.handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='etc'>기타</Form.Check.Label>
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Control
                      className=''
                      placeholder='기타'
                      id='etcExercise'
                      type='text'
                      value={this.state.etcExercise}
                      onChange={this.handleChange}
                    ></Form.Control>
                  </Form.Check>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>이용권종류</h5>
                </Col>
                <Col>
                  <Row>
                    <Col xs={6} lg={3} className='mt-2'>
                      <Form.Group>
                        <Form.Check>
                          <Form.Check.Input
                            type='radio'
                            id='salesDaysCheckbox'
                            name='voucher'
                            value='4'
                            onChange={this.handleCheckbox}
                            checked={
                              this.state.checkboxGroup['salesDaysCheckbox']
                            }
                          />
                          <Form.Check.Label
                            for='salesDaysCheckbox'
                            className='w-100'
                          >
                            기간권
                          </Form.Check.Label>
                        </Form.Check>
                      </Form.Group>
                    </Col>
                    <Col xs={6} lg={3} className='mt-2'>
                      <Form.Group>
                        <Form.Check>
                          <Form.Check.Input
                            type='radio'
                            id='paidMembershipCheckbox'
                            name='voucher'
                            value='4'
                            onChange={this.handleCheckbox}
                            checked={
                              this.state.checkboxGroup['paidMembershipCheckbox']
                            }
                          />
                          <Form.Check.Label
                            htmlFor='paidMembershipCheckbox'
                            className='w-100'
                          >
                            횟수권
                          </Form.Check.Label>
                        </Form.Check>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {this.state.checkboxGroup.salesDaysCheckbox ? (
                      <>
                        {/* 기간권 내용 */}
                        <Col className='voucher-info'>
                          <Row>
                            <Col xs={12} lg={2}>
                              <h5>기간시작일</h5>
                            </Col>
                            <Col xs={10}>
                              <DatePicker
                                selected={this.state.salesStart_date}
                                onChange={this.handleStartDateChange}
                                name='salesStart_date'
                                dateFormat='yyyy년MM월dd일'
                              />
                            </Col>
                            <Col xs={12} lg={2}>
                              <h6>기간</h6>
                            </Col>
                            <Col xs={10}>
                              <Row>
                                <Col xs={12}>
                                  <strong>{this.state.salesDays} </strong>일
                                  기간권
                                </Col>
                                <Col>
                                  <Form.Check inline>
                                    <Form.Check.Input
                                      type='radio'
                                      id='voucherPeriod1'
                                      name='PeriodQuickSelection'
                                      value='30'
                                      onClick={this.handleSalesDaysSelect}
                                    />
                                    <Form.Check.Label
                                      htmlFor='voucherPeriod1'
                                      className='w-100'
                                    >
                                      1개월
                                    </Form.Check.Label>
                                  </Form.Check>
                                  <Form.Check inline>
                                    <Form.Check.Input
                                      type='radio'
                                      id='voucherPeriod3'
                                      name='PeriodQuickSelection'
                                      value='91'
                                      onClick={this.handleSalesDaysSelect}
                                    />
                                    <Form.Check.Label
                                      htmlFor='voucherPeriod3'
                                      className='w-100'
                                    >
                                      3개월
                                    </Form.Check.Label>
                                  </Form.Check>
                                  <Form.Check inline>
                                    <Form.Check.Input
                                      type='radio'
                                      id='voucherPeriod6'
                                      name='PeriodQuickSelection'
                                      value='183'
                                      onClick={this.handleSalesDaysSelect}
                                    />
                                    <Form.Check.Label
                                      htmlFor='voucherPeriod6'
                                      className='w-100'
                                    >
                                      6개월
                                    </Form.Check.Label>
                                  </Form.Check>
                                  <Form.Check inline>
                                    <Form.Check.Input
                                      type='radio'
                                      id='voucherPeriod12'
                                      name='PeriodQuickSelection'
                                      value='365'
                                      onClick={this.handleSalesDaysSelect}
                                    />
                                    <Form.Check.Label
                                      htmlFor='voucherPeriod12'
                                      className='w-100'
                                    >
                                      12개월
                                    </Form.Check.Label>
                                  </Form.Check>
                                  <Form.Check inline>
                                    <Form.Check.Input
                                      type='radio'
                                      id='voucherPeriodetc'
                                      name='PeriodQuickSelection'
                                      value='5'
                                    />
                                    <Form.Check.Label
                                      htmlFor='voucherPeriodetc'
                                      className='w-100'
                                    >
                                      일 지정
                                    </Form.Check.Label>
                                  </Form.Check>
                                  <Form.Check inline>
                                    <Form.Control
                                      variant='outlined'
                                      value={this.state.salesDays}
                                      onChange={this.handleChange}
                                      type='number'
                                      id='salesDays'
                                      placeholder='00(일)'
                                      // required
                                    />
                                  </Form.Check>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <Col className='voucher-info'>
                        <Row>
                          <Col xs={2}>
                            <Form.Label htmlFor='paidMembership'>
                              이용권 횟수
                            </Form.Label>
                          </Col>
                          <Col xs={3}>
                            <Form.Control
                              value={this.state.paidMembership}
                              onChange={this.handleChange}
                              type='number'
                              name='paidMembership'
                              id='paidMembership'
                              placeholder='숫자만 입력하세요'
                              required
                            ></Form.Control>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
              <Row></Row>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>사물함</h5>
                </Col>
                <Col xs={12} lg={10}>
                  <Row>
                    <Col xs={12} lg={2} className='mt-2'>
                      <Form.Check inline>
                        <Form.Check.Input
                          type='radio'
                          id='lockerUnused'
                          name='locker'
                          checked='checked'
                        ></Form.Check.Input>
                        <Form.Check.Label
                          htmlFor='lockerUnused'
                          className='w-100'
                        >
                          미사용
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col xs={12} lg={2}>
                      <Form.Check inline>
                        <Form.Check.Input
                          type='radio'
                          id='lockerUse'
                          name='locker'
                        ></Form.Check.Input>
                        <Form.Check.Label htmlFor='lockerUse' className='w-100'>
                          사용
                        </Form.Check.Label>
                      </Form.Check>
                      <Form.Check inline>
                        <Form.Control
                          placeholder='사물함 번호'
                          id='lockerNumber'
                          type='number'
                        />
                      </Form.Check>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>운동복</h5>
                </Col>
                <Col xs={12} lg={10}>
                  <Row>
                    <Col xs={6} lg={2} className='mt-2'>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          id='wearUnused'
                          name='sportswear'
                          checked='checked'
                        ></Form.Check.Input>
                        <Form.Check.Label
                          htmlFor='wearUnused'
                          className='w-100'
                        >
                          미사용
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col xs={6} lg={2} className='mt-2'>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          id='wearUse'
                          name='sportswear'
                        ></Form.Check.Input>
                        <Form.Check.Label htmlFor='wearUse' className='w-100'>
                          사용
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className='sectionGlass'>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>결제일</h5>
                </Col>
                <Col>
                  <DatePicker
                    selected={this.state.paymentDate}
                    onChange={this.handleDateChange}
                    name='paymentDate'
                    dateFormat='yyyy년MM월dd일'
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>결제 종류</h5>
                </Col>
                <Col>
                  <Row className='mt-2'>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='payGroup'
                          id='card'
                          checked={this.state.payGroup['card']}
                          onChange={this.handlePayRadio}
                        />
                        <Form.Check.Label htmlFor='card'>카드</Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='payGroup'
                          id='cash'
                          checked={this.state.payGroup['cash']}
                          onChange={this.handlePayRadio}
                        />
                        <Form.Check.Label htmlFor='cash'>현금</Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='payGroup'
                          id='transfer'
                          checked={this.state.payGroup['transfer']}
                          onChange={this.handlePayRadio}
                        />
                        <Form.Check.Label htmlFor='transfer'>
                          계좌이체
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={2}>
                  <h5>금액</h5>
                </Col>
                <Col>
                  <Row>
                    <Col xs={6} lg={2}>
                      <h6>이용권</h6>
                    </Col>
                    <Col>
                      <NumberFormat
                        className='add-sales__input--number-format'
                        thousandSeparator={true}
                        id='exercisePrice'
                        placeholder='0'
                        onChange={this.handleChange}
                      />
                    </Col>
                    <Col xs={6} lg={2}>
                      <h6>사물함</h6>
                    </Col>
                    <Col>
                      <NumberFormat
                        className='add-sales__input--number-format'
                        thousandSeparator={true}
                        id='sportswearPrice'
                        placeholder='0'
                        onChange={this.handleChange}
                      />
                    </Col>
                    <Col xs={6} lg={2}>
                      <h6>운동복</h6>
                    </Col>
                    <Col>
                      <NumberFormat
                        className='add-sales__input--number-format'
                        thousandSeparator={true}
                        id='lockerPrice'
                        placeholder='0'
                        onChange={this.handleChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='TotalPayment-bg my-2 align-items-center'>
                <Col xs={6} lg={2}>
                  <strong>총 결제 금액</strong>
                </Col>
                <Col>
                  <NumberFormat
                    className='total_price text-primary'
                    thousandSeparator={true}
                    name='payment'
                    id='TotalPayment'
                    readOnly
                    value={
                      parseInt(
                        this.state.exercisePrice
                          .toString()
                          .replace(/[^(0-9)]/gi, '')
                      ) +
                      parseInt(
                        this.state.sportswearPrice
                          .toString()
                          .replace(/[^(0-9)]/gi, '')
                      ) +
                      parseInt(
                        this.state.lockerPrice
                          .toString()
                          .replace(/[^(0-9)]/gi, '')
                      )
                    }
                  />
                  &nbsp; 원
                </Col>
              </Row>
            </div>
            <Row className='btn-group text-center mt-3'>
              <Col>
                <Button
                  className='btn-primary-dark mx-1'
                  variant='primary-dark'
                  onClick={this.goSales}
                >
                  이전
                </Button>
                <Button onClick={this.handleOnClick}>등록하기</Button>
              </Col>
            </Row>
          </form>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const SalesStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};
const AddSalesDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(SalesStateToProps, AddSalesDispatchToProps)(AddSales);
