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
      exerciseName: [],
      inputExercise: '',
      exercisePrice: 0,
      //locker:0,
      lockerPrice: 0,
      //sportswear:0,
      sportswearPrice: 0,
      //TotalPayment: 0,
      paymentTools: '',
      open: false,
      //searchKeyword:'',
      userName: '회원',
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
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      } else {
        this.cusFetch();
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

  toggleChange = (e) => {
    const target = e.target;
    let value = target.id;
    console.log(target.checked);
    if (target.checked === true) {
      this.state.exerciseName[value] = value;
      this.setState({
        exerciseName: [
          ...this.state.exerciseName,
          this.state.exerciseName[value],
        ],
      });
      //console.log('들어오는 값 )    ')
      //console.log(this.state.exerciseName)
    } else {
      //console.log('들어오니')
      for (var i = 0; i < this.state.exerciseName.length; i++) {
        if (this.state.exerciseName[i] === value) {
          this.state.exerciseName.splice(i, 1);
        }
      }
      //console.log(this.state.exerciseName)
    }

    // this.setState({
    //     isChecked: !this.state.isChecked,
    //     exerciseName:exerciseName.concat(e.target.id)
    // });
    // //alert(e.target.id)
    // console.log(this.state.exerciseName)
  };

  handleChange = (e) => {
    if (e.target.name === 'paymentTools' || e.target.name === 'exerciseName') {
      this.setState({
        [e.target.name]: e.target.id,
      });
    } else {
      this.setState({
        [e.target.id]: e.target.value,
        //TotalPayment : parseInt(this.state.TotalPayment) + parseInt(e.target.value)
      });
    }
  };

  handleDateChange(date) {
    this.setState({
      paymentDate: date,
      salesStart_date: date,
    });
  }

  handleOnClick = (e) => {
    //alert('운동목록 : ' + this.state.exerciseName + ', 운동금액 : '+  this.state.exercisePrice + ', 운동복여부: '+ this.state.sportswear +', 운동복 금액: '+ this.state.sportswearPrice + ', 락커여부: '+ this.state.locker +', 락커금액 : '+  this.state.lockerPrice + ', 결제도구 : '+this.state.paymentTools+', 전체금액 : '+this.state.TotalPayment);

    let ex = '';
    console.log('---------------------------');
    // for(var i=0; i<this.state.exerciseName.length;i++){
    //     if(this.state.exerciseName[i] === '기타'){
    //         ex = this.state.exerciseName[i] +'('+this.state.inputExercise +') /'+ex
    //     }
    //     else{
    //         ex = this.state.exerciseName[i] +'/ '+ex
    //     }
    // }

    if (this.state.exerciseName === '기타') {
      ex = this.state.exerciseName + '(' + this.state.inputExercise + ')';
    } else {
      ex = this.state.exerciseName;
    }

    let exercisePrice1 = parseInt(
      this.state.exercisePrice.toString().replace(/[^(0-9)]/gi, '')
    );
    let lockerPrice1 = parseInt(
      this.state.lockerPrice.toString().replace(/[^(0-9)]/gi, '')
    );
    let sportswearPrice1 = parseInt(
      this.state.sportswearPrice.toString().replace(/[^(0-9)]/gi, '')
    );

    console.log('***********paymentDate : ', this.state.paymentDate);
    console.log(this.state);
    if (this.state.userName === '회원') {
      alert('회원을 선택해주세요.');
    } else {
      fetch(ip + '/sales', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          fitness_no: this.state.fitness_no,
          member_no: this.state.member_no,
          exerciseName: ex,
          exercisePrice: exercisePrice1,
          lockerPrice: lockerPrice1,
          sportswearPrice: sportswearPrice1,
          paymentTools: this.state.paymentTools,
          paymentDate: this.state.paymentDate,
          paidMembership:
            this.state.checkboxGroup['paidMembershipCheckbox'] == false
              ? '0'
              : this.state.paidMembership,
          salesStart_date:
            this.state.checkboxGroup['salesDaysCheckbox'] == false
              ? 'null'
              : this.state.salesStart_date,
          salesDays:
            this.state.checkboxGroup['salesDaysCheckbox'] == false
              ? 'null'
              : this.state.salesDays,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          alert('등록되었습니다.');
          console.log(response);
        });
      this.props.history.push('/sales');
    }
  };

  choiceUser = (e) => {
    console.log('value', e.target.value);
    let values = e.target.value.split(',');

    this.setState({
      userName: values[0],
      member_no: e.target.id,
      open: false,
    });
    alert('선택하셨습니다.');
  };

  search = () => {
    let it = '0';
    if (this.state.item === '이름') {
      it = '0';
    } else if (this.state.item === '핸드폰') {
      it = '1';
    }
    fetch(
      ip +
        '/customer?type=search' +
        it +
        '&search=' +
        this.state.search +
        '&fn=' +
        this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        let arr = [];
        for (let i = 0; i < res.length; i++) {
          arr.push({
            no: res[i].member_no,
            userName: res[i].name,
            phone: res[i].phone,
          });
        }
        this.setState({ customerList: arr });
      });
  };

  selectItem = (e) => {
    if (e.value == '이름') {
      this.setState({ item: '이름' });
    } else if (e.value == '핸드폰') {
      this.setState({ item: '핸드폰' });
    }
  };

  handleCheckbox = (e) => {
    let obj = {
      paidMembershipCheckbox: false,
      salesDaysCheckbox: false,
    };
    obj[e.target.id] = e.target.checked;
    console.log(obj);
    this.setState({
      checkboxGroup: obj,
    });
  };

  render() {
    console.log('___', this.state.customerList);
    const { userinfo } = this.props;
    console.log('userinfo : ');
    console.log(userinfo);

    return (
      <div className='addSales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
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
        <div className='container'>
          <h2>상품 등록페이지</h2>
          <div>
            <Button type='button' onClick={this.handleClickOpen}>
              회원검색
            </Button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              maxWidth='lg'
            >
              <DialogTitle>고객 검색</DialogTitle>
              <DialogContent>
                {/* <label>이름을 입력해주세요</label>
                            <input type="search" className="form-control" placeholder="김투진" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleValueChange}/> */}
                <div className='customerSearch'>
                  <Dropdown
                    className='searchDrop'
                    options={options}
                    onChange={this.selectItem}
                    value={this.state.item}
                    placeholder='Select an option'
                  />
                  {/*.searchDrop */}
                  <input
                    type='text'
                    id='search'
                    checked={this.state.search}
                    onChange={this.handleChange}
                  />
                  <Button type='button' onClick={this.search}>
                    고객 검색
                  </Button>
                </div>
                {/*.customerSearch */}
                <Table className='addsalesSearchTable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>번호</TableCell>
                      <TableCell>이름</TableCell>
                      <TableCell>폰번호</TableCell>
                      <TableCell>선택</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.customerList ? (
                      //filteredComponents(this.state.customerList)
                      this.state.customerList.map((c) => (
                        <TableRow>
                          <TableCell>{c.no}</TableCell>
                          <TableCell>{c.userName}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <DialogActions>
                              <button
                                type='button'
                                onClick={this.choiceUser}
                                id={c.no}
                                value={[c.userName, c.phone]}
                              >
                                선택
                              </button>
                            </DialogActions>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan='6' align='center'></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <button type='button' onClick={this.handleClose}>
                  닫기
                </button>
              </DialogActions>
            </Dialog>
          </div>
          {/* <Link to="/sales">회원 검색</Link><br/> */}
          <form
            className='AddSalesForm productPay'
            style={{ flexDirection: 'column' }}
          >
            <label className='salesCustomer'>
              <span>{this.state.userName}</span>님 반갑습니다.
            </label>
            <h3 className='AddSalesHeader'>운동 종목</h3>
            <div className='exerciseType boxmorpinsm p-4 mb-5'>
              <Form.Group>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='개인 PT'
                    name='exerciseName'
                    value='1'
                    onChange={this.handleChange}
                  />
                  <Form.Check.Label htmlFor='male' className='w-100'>
                    개인 PT
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='GX'
                    name='exerciseName'
                    value='2'
                    onChange={this.handleChange}
                  />
                  <Form.Check.Label htmlFor='female' className='w-100'>
                    GX
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='필라테스'
                    name='exerciseName'
                    value='3'
                    onChange={this.handleChange}
                  />
                  <Form.Check.Label htmlFor='female' className='w-100'>
                    필라테스
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='헬스'
                    name='exerciseName'
                    value='4'
                    onChange={this.handleChange}
                  />
                  <Form.Check.Label htmlFor='female' className='w-100'>
                    헬스
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='기타'
                    name='exerciseName'
                    value='5'
                    onChange={this.handleChange}
                  />
                  <Form.Check.Label htmlFor='female' className='w-100'>
                    기타
                  </Form.Check.Label>
                  <Form.Control
                    type='text'
                    id='inputExercise'
                    className='form-control'
                    placeholder='기타 운동'
                    name='Exercise'
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Check>
              </Form.Group>
            </div>
            {/*.exerciseType */}

            <h3>이용권 종류</h3>
            <Row
              xs={2}
              className='boxmorpinsm w-100 justify-content-start m-0 p-4 mb-4'
            >
              <label className='d-flex align-items-center justify-content-start w-100'>
                <Form.Check>
                  <Form.Check.Input
                    type='radio'
                    id='salesDaysCheckbox'
                    name='voucher'
                    value='4'
                    onChange={this.handleCheckbox}
                    checked={this.state.checkboxGroup['salesDaysCheckbox']}
                  />
                  <Form.Check.Label htmlFor='male' className='w-100'>
                    기간제
                  </Form.Check.Label>
                </Form.Check>
                <label>
                  기간시작일
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
                  <Form.Group>
                    <Form.Label>일수</Form.Label>
                    <Form.Control
                      variant='outlined'
                      value={this.state.salesDays}
                      onChange={this.handleChange}
                      type='number'
                      id='salesDays'
                      label='일'
                      required
                    ></Form.Control>
                  </Form.Group>
                </label>
              </label>
            </Row>
            <Row
              xs={2}
              className='boxmorpinsm w-100 justify-content-start m-0 p-4 mb-4'
            >
              <label>
                <input
                  type='radio'
                  id='paidMembershipCheckbox'
                  name='voucher'
                  value='4'
                  onChange={this.handleCheckbox}
                  checked={this.state.checkboxGroup['paidMembershipCheckbox']}
                />
                <Form.Group>
                  <Form.Label>횟수제 이용권</Form.Label>
                  <Form.Control
                    value={this.state.paidMembership}
                    onChange={this.handleChange}
                    type='number'
                    name='paidMembership'
                    id='paidMembership'
                    label='숫자만 입력하세요'
                    required
                  ></Form.Control>
                </Form.Group>
              </label>
            </Row>

            <h3>결제 금액</h3>
            <div className='payType boxmorpinsm p-4 mb-2'>
              <label>
                <input
                  type='radio'
                  name='paymentTools'
                  id='카드'
                  onChange={this.handleChange}
                />
                카드
              </label>
              <label>
                <input
                  type='radio'
                  name='paymentTools'
                  id='현금'
                  onChange={this.handleChange}
                />
                현금
              </label>
              <label>
                <input
                  type='radio'
                  name='paymentTools'
                  id='계좌이체'
                  onChange={this.handleChange}
                />
                계좌이체
              </label>
            </div>
            {/*.payType */}
            <div className='paymentAmount boxmorpinsm p-4 mb-4'>
              <label>
                운동
                <NumberFormat
                  thousandSeparator={true}
                  id='exercisePrice'
                  placeholder='0'
                  onChange={this.handleChange}
                />
              </label>
              <label>
                운동복
                <NumberFormat
                  thousandSeparator={true}
                  id='sportswearPrice'
                  placeholder='0'
                  onChange={this.handleChange}
                />
              </label>
              <label>
                개인 사물함
                <NumberFormat
                  thousandSeparator={true}
                  id='lockerPrice'
                  placeholder='0'
                  onChange={this.handleChange}
                />
              </label>
            </div>
            {/*.paymentAmount */}
            <div className='finalAmount'>
              <div className='finalAmountOthers'>
                <label className='amountDay'>
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
                {/*.amountDay */}
              </div>
              {/*.finalAmountOthers */}
              <label className='amountTotal'>
                금액 합계
                <NumberFormat
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
              {/*.amountTotal */}
            </div>
            {/*.finalAmount */}
            <Button onClick={this.handleOnClick}>등록하기</Button>
          </form>
          {/*.AddSalesForm productPay */}
        </div>
        {/*.container */}
        <div className='footer'>
          <Footer />
        </div>
        {/*.footer */}
      </div> /*.addSales */
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
