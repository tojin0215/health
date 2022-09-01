import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-dropdown';

import '../../styles/sales/AddSales.css';

import NumberFormat from 'react-number-format';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
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
        ? '회원'
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
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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

  handleDateChange(date) {
    this.setState({
      paymentDate: date,
      salesStart_date: date,
    });
  }

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
    if (this.state.client_name === '회원') {
      alert('회원을 선택해주세요.');
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
    // console.log(obj);
    this.setState({
      checkboxGroup: obj,
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
    console.log(this.state.client_name);
    return (
      <div className='wrap addSales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                결제 등록
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/sales'>상품/매출</Link>
                <span>&#62;</span>
                <Link to='#'>결제 등록</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
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
              label='회원 검색'
              disabled
              variant='standard'
              onClick={() => this.setState({ open: true })}
              className='boxmorpsm h-100 w-100 text-center pb-2 px-5'
              InputProps={{ disableUnderline: true }}
              value={this.state.client_name}
            />
          )}
          {/* <Link to="/sales">회원 검색</Link><br/> */}
          <form>
            <label className='my-4'>
              <span className='fs-5 fw-bold'>{this.state.client_name}</span> 님
              결제 등록입니다.
            </label>
            <h3>운동 종목</h3>
            <div className='mb-5'>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Check>
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
                  </Col>
                  <Col>
                    <Form.Check>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='gx'
                        checked={this.state.exerciseGroup['gx']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='gx' className='w-100'>
                        GX
                      </Form.Check.Label>
                      <Form.Control
                        placeholder='GX'
                        id='gxExercise'
                        type='text'
                        value={this.state.gxExercise}
                        onChange={this.handleChange}
                      ></Form.Control>
                    </Form.Check>
                  </Col>
                  <Col>
                    <Form.Check>
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
                  </Col>
                  <Col>
                    <Form.Check>
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
                  </Col>
                  <Col>
                    <Form.Check>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='etc'
                        checked={this.state.exerciseGroup['etc']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='etc' className='w-100'>
                        기타
                      </Form.Check.Label>
                      <Form.Control
                        placeholder='기타'
                        id='etcExercise'
                        type='text'
                        value={this.state.etcExercise}
                        onChange={this.handleChange}
                      ></Form.Control>
                    </Form.Check>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <h3>이용권 종류</h3>
            <Row xs={2}>
              <Col xs={12} sm={2} className='mb-3'>
                <Form.Group>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      id='salesDaysCheckbox'
                      name='voucher'
                      value='4'
                      onChange={this.handleCheckbox}
                      checked={this.state.checkboxGroup['salesDaysCheckbox']}
                    />
                    <Form.Check.Label for='salesDaysCheckbox' className='w-100'>
                      기간권
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Label>기간시작일</Form.Label>
                  <DatePicker
                    selected={this.state.salesStart_date}
                    onChange={this.handleDateChange}
                    name='salesStart_date'
                    dateFormat='yyyy-MM-dd'
                    font-size='1.6rem'
                    // locale 오류로 임시 삭제
                    // locale='ko'
                  />
                  {/* <DatePicker
										selected={this.state.paymentDate}
										onChange={this.handleDateChange}
										name='paymentDate'
										dateFormat='yyyy-MM-dd'
										locale='ko'
									/> */}
                  <Form.Label>기간 일수</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.salesDays}
                    onChange={this.handleChange}
                    type='number'
                    id='salesDays'
                    placeholder='숫자만 입력하세요'
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} sm={2}>
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
                      이용권
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Label>이용권 횟수</Form.Label>
                  <Form.Control
                    value={this.state.paidMembership}
                    onChange={this.handleChange}
                    type='number'
                    name='paidMembership'
                    id='paidMembership'
                    placeholder='숫자만 입력하세요'
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <h3 className='mt-5'>결제</h3>
            <div className='mb-2'>
              <h4>결제 종류</h4>
              <Form.Group>
                <Row>
                  <Col xs={12} sm={2}>
                    <Form.Check>
                      <Form.Check.Input
                        type='radio'
                        name='payGroup'
                        id='card'
                        checked={this.state.payGroup['card']}
                        onChange={this.handlePayRadio}
                      />
                      <Form.Check.Label htmlFor='card' className='w-100'>
                        카드
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                  <Col xs={12} sm={2}>
                    <Form.Check>
                      <Form.Check.Input
                        type='radio'
                        name='payGroup'
                        id='cash'
                        checked={this.state.payGroup['cash']}
                        onChange={this.handlePayRadio}
                      />
                      <Form.Check.Label htmlFor='cash' className='w-100'>
                        현금
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                  <Col xs={12} sm={2}>
                    <Form.Check>
                      <Form.Check.Input
                        type='radio'
                        name='payGroup'
                        id='transfer'
                        checked={this.state.payGroup['transfer']}
                        onChange={this.handlePayRadio}
                      />
                      <Form.Check.Label htmlFor='transfer' className='w-100'>
                        계좌이체
                      </Form.Check.Label>
                    </Form.Check>
                  </Col>
                </Row>
              </Form.Group>
            </div>
            <h4>금액</h4>
            <Row className='mb-4'>
              <Col xs={12} sm={2}>
                <label>
                  <p>운동</p>
                  <NumberFormat
                    className='add-sales__input--number-format'
                    thousandSeparator={true}
                    id='exercisePrice'
                    placeholder='0'
                    onChange={this.handleChange}
                  />
                </label>
              </Col>
              <Col xs={12} sm={2}>
                <label>
                  <p>운동복</p>
                  <NumberFormat
                    className='add-sales__input--number-format'
                    thousandSeparator={true}
                    id='sportswearPrice'
                    placeholder='0'
                    onChange={this.handleChange}
                  />
                </label>
              </Col>
              <Col xs={12} sm={2}>
                <label>
                  <p>개인 사물함</p>
                  <NumberFormat
                    className='add-sales__input--number-format'
                    thousandSeparator={true}
                    id='lockerPrice'
                    placeholder='0'
                    onChange={this.handleChange}
                  />
                </label>
              </Col>
            </Row>
            <h3>결제</h3>
            <div className='mb-4'>
              <Row xs={1}>
                <Col>
                  <label>
                    <span>결제일</span>
                    <DatePicker
                      selected={this.state.paymentDate}
                      onChange={this.handleDateChange}
                      name='paymentDate'
                      dateFormat='yyyy-MM-dd'
                      // locale 오류로 임시 삭제
                      // locale='ko'
                    />
                  </label>
                </Col>
                <Col>
                  <label>
                    <p>금액 합계</p>
                    <NumberFormat
                      className='add-sales__input--number-format'
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
                  </label>
                </Col>
              </Row>
            </div>
            <Button className='w-100' onClick={this.handleOnClick}>
              등록하기
            </Button>
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
