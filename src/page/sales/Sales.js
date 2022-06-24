import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import { Row, Col, Container, Button, Table, Tab, Tabs } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import '../../styles/sales/Sales.css';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';
import {
  salesSelect,
  salesSelectExercise,
  salesSelectTools,
} from '../../api/user';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

const options = [
  { value: 'all', label: '전체' },
  { value: 'card', label: '카드' },
  { value: 'cash', label: '현금' },
  { value: 'transfer', label: '계좌이체' },
];

const exerciseOptions = [
  { value: 'all', label: '전체' },
  { value: 'pt', label: '개인 PT' },
  { value: 'gx', label: 'GX' },
  { value: 'Pilates', label: '필라테스' },
  { value: 'health', label: '헬스' },
  { value: 'exc', label: '기타' },
];

function dataFormatter(cell, row) {
  return ` ${cell}`.substring(0, 11);
}

function PriceFormatter(cell, row) {
  return (
    ` ${cell}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + '원'
  );
}
/**회원권 회(단위) */
function membershipFormatter(cell, row) {
  if (cell == 'null' || cell == '0' || !cell) {
    return '-';
  } else {
    return `${cell}` + '회';
  }
}
/**기간제날짜 */
function salesdateFormatter(cell, row) {
  if (cell) {
    return `${cell}`.split('T')[0];
  } else {
    return '-';
  }
}

/**기간제 일수 */
function daysFormatter(cell, row) {
  if (cell == 'null' || cell == '0' || !cell) {
    return '-';
  } else {
    return ` ${cell}` + '일';
  }
}

const ViewsalesItem = ({
  num,
  fitness_no,
  client_name,
  exerciseName,
  exercisePrice,
  lockerPrice,
  sportswearPrice,
  paymentTools,
  paymentDate,
  paidMembership,
  salesStart_date,
  salesDays,
}) => {
  const allPrice = exercisePrice + lockerPrice + sportswearPrice;
  const startDate = salesStart_date
    ? moment(salesStart_date).format('YYYY-MM-DD(ddd)')
    : '';
  const payDate = moment(paymentDate).format('YYYY-MM-DD(ddd)');
  return (
    <TableRow>
      {/* <TableCell>{num}</TableCell> */}
      <TableCell>{client_name}</TableCell>
      <TableCell>{exerciseName}</TableCell>
      <TableCell>{payDate}</TableCell>
      <TableCell>{paidMembership ? paidMembership : ''}</TableCell>
      <TableCell>
        {startDate}
        {salesDays ? `[` + salesDays + `]` : ''}
      </TableCell>
      <TableCell>{paymentTools}</TableCell>
      <TableCell>{allPrice}</TableCell>
    </TableRow>
  );
};

const ExerciseSalesItem = ({
  num,
  fitness_no,
  client_name,
  exerciseName,
  exercisePrice,
  lockerPrice,
  sportswearPrice,
  paymentTools,
  paymentDate,
  paidMembership,
  salesStart_date,
  salesDays,
}) => {
  const allPrice = exercisePrice + lockerPrice + sportswearPrice;
  const startDate = salesStart_date
    ? moment(salesStart_date).format('YYYY-MM-DD(ddd)')
    : '';
  const payDate = moment(paymentDate).format('YYYY-MM-DD(ddd)');
  return (
    <TableRow>
      {/* <TableCell>{num}</TableCell> */}
      <TableCell>{client_name}</TableCell>
      <TableCell>{exerciseName}</TableCell>
      <TableCell>{payDate}</TableCell>
      <TableCell>{paidMembership ? paidMembership : ''}</TableCell>
      <TableCell>
        {startDate}
        {salesDays ? `[` + salesDays + `]` : ''}
      </TableCell>
      <TableCell>{paymentTools}</TableCell>
      <TableCell>{allPrice}</TableCell>
    </TableRow>
  );
};

const ToolsSalesItem = ({
  num,
  fitness_no,
  client_name,
  exerciseName,
  exercisePrice,
  lockerPrice,
  sportswearPrice,
  paymentTools,
  paymentDate,
  paidMembership,
  salesStart_date,
  salesDays,
}) => {
  const allPrice = exercisePrice + lockerPrice + sportswearPrice;
  const startDate = salesStart_date
    ? moment(salesStart_date).format('YYYY-MM-DD(ddd)')
    : '';
  const payDate = moment(paymentDate).format('YYYY-MM-DD(ddd)');
  return (
    <TableRow>
      {/* <TableCell>{num}</TableCell> */}
      <TableCell>{client_name}</TableCell>
      <TableCell>{exerciseName}</TableCell>
      <TableCell>{payDate}</TableCell>
      <TableCell>{paidMembership ? paidMembership : ''}</TableCell>
      <TableCell>
        {startDate}
        {salesDays ? `[` + salesDays + `]` : ''}
      </TableCell>
      <TableCell>{paymentTools}</TableCell>
      <TableCell>{allPrice}</TableCell>
    </TableRow>
  );
};

const CashItem = ({
  num,
  fitness_no,
  client_name,
  exerciseName,
  exercisePrice,
  lockerPrice,
  sportswearPrice,
  paymentTools,
  paymentDate,
  paidMembership,
  salesStart_date,
  salesDays,
}) => {
  const allPrice = exercisePrice + lockerPrice + sportswearPrice;

  return (
    <TableRow>
      {/* <TableCell>{num}</TableCell> */}
      <TableCell>{exercisePrice}</TableCell>
      <TableCell>{lockerPrice}</TableCell>
      <TableCell>{sportswearPrice}</TableCell>
      <TableCell>{allPrice}</TableCell>
    </TableRow>
  );
};

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesViewList: [],
      exerciseViewList: [],
      toolsViewList: [],
      cashViewList: [],
    };
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
        this.salesView();
        this.cashView();
      }
    });
  }

  salesView = () => {
    salesSelect(this.props.userinfo.fitness_no).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <ViewsalesItem
            num={data.num}
            fitness_no={data.fitness_no}
            client_name={data.client_name}
            exerciseName={data.exerciseName}
            exercisePrice={data.exercisePrice}
            lockerPrice={data.lockerPrice}
            sportswearPrice={data.sportswearPrice}
            paymentTools={data.paymentTools}
            paymentDate={data.paymentDate}
            paidMembership={data.paidMembership}
            salesStart_date={data.salesStart_date}
            salesDays={data.salesDays}
          />
        );
      });
      this.setState({ salesViewList: items.reverse() });
    });
  };

  salesViewExercise = (exercise) => {
    salesSelectExercise(this.props.userinfo.fitness_no, exercise).then(
      (res) => {
        const items = res.map((data, index, array) => {
          return (
            <ExerciseSalesItem
              num={data.num}
              fitness_no={data.fitness_no}
              client_name={data.client_name}
              exerciseName={data.exerciseName}
              exercisePrice={data.exercisePrice}
              lockerPrice={data.lockerPrice}
              sportswearPrice={data.sportswearPrice}
              paymentTools={data.paymentTools}
              paymentDate={data.paymentDate}
              paidMembership={data.paidMembership}
              salesStart_date={data.salesStart_date}
              salesDays={data.salesDays}
            />
          );
        });
        this.setState({ exerciseViewList: items.reverse() });
      }
    );
  };

  salesViewTools = (tools) => {
    salesSelectTools(this.props.userinfo.fitness_no, tools).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <ToolsSalesItem
            num={data.num}
            fitness_no={data.fitness_no}
            client_name={data.client_name}
            exerciseName={data.exerciseName}
            exercisePrice={data.exercisePrice}
            lockerPrice={data.lockerPrice}
            sportswearPrice={data.sportswearPrice}
            paymentTools={data.paymentTools}
            paymentDate={data.paymentDate}
            paidMembership={data.paidMembership}
            salesStart_date={data.salesStart_date}
            salesDays={data.salesDays}
          />
        );
      });
      this.setState({ toolsViewList: items.reverse() });
    });
  };

  cashView = () => {
    salesSelect(this.props.userinfo.fitness_no).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <CashItem
            num={data.num}
            fitness_no={data.fitness_no}
            client_name={data.client_name}
            exerciseName={data.exerciseName}
            exercisePrice={data.exercisePrice}
            lockerPrice={data.lockerPrice}
            sportswearPrice={data.sportswearPrice}
            paymentTools={data.paymentTools}
            paymentDate={data.paymentDate}
            paidMembership={data.paidMembership}
            salesStart_date={data.salesStart_date}
            salesDays={data.salesDays}
          />
        );
      });
      this.setState({ cashViewList: items.reverse() });
    });
  };

  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.salesViewList);
    console.log(this.state.exerciseViewList);

    return (
      <div className='wrap sales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                상품/매출
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>상품/매출</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
          <h2>매출 현황</h2>
          <div className='salesUtill'>
            <div className='salesStatus'>날짜 범위 설정</div>
            {/*.salesStatus */}
          </div>
          {/*.salesUtill */}
          <div className='tablewrap'>
            카드 현금 계좌이체 총매출 테이블
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell scope='col'>카드</TableCell>
                  <TableCell scope='col'>현금</TableCell>
                  <TableCell scope='col'>계좌이체</TableCell>
                  <TableCell scope='col'>총매출</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.state.cashViewList}</TableBody>
            </Table>
            <div className='salesUtill salesUtill2 d-flex flex-row-reverse'>
              <Link to='/addSales'>
                <Button>결제 등록</Button>
              </Link>
            </div>
            <h5>전체 기록</h5>
            sales table 기간권시작일(기간권일수)로 변경
            <Tabs
              defaultActiveKey='home'
              id='uncontrolled-tab-example'
              className='mb-3'
            >
              <Tab eventKey='home' title='전체보기'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>고객명</TableCell>
                      <TableCell scope='col'>운동명</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>결제된 회원권</TableCell>
                      <TableCell scope='col'>
                        기간권시작일[기간권일수]
                      </TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.state.salesViewList}</TableBody>
                </Table>
              </Tab>

              <Tab eventKey='exercise' title='운동명'>
                {/* 추후 테이블 만들어서 운동명 리스트 클릭시 테이블 갱신
                (like handleInnerOnClick_choice, Reservation.js 455줄) */}
                <Button onClick={() => this.salesViewExercise('개인 PT')}>
                  개인 PT
                </Button>
                <Button onClick={() => this.salesViewExercise('GX')}>GX</Button>
                <Button onClick={() => this.salesViewExercise('필라테스')}>
                  필라테스
                </Button>
                <Button onClick={() => this.salesViewExercise('헬스')}>
                  헬스
                </Button>
                <Button onClick={() => this.salesViewExercise('기타')}>
                  기타
                </Button>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>고객명</TableCell>
                      <TableCell scope='col'>운동명</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>결제된 회원권</TableCell>
                      <TableCell scope='col'>
                        기간권시작일[기간권일수]
                      </TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.state.exerciseViewList}</TableBody>
                </Table>
              </Tab>
              <Tab eventKey='tools' title='결제도구'>
                {/* 위와 동일 */}
                <Button onClick={() => this.salesViewTools('카드')}>
                  카드
                </Button>
                <Button onClick={() => this.salesViewTools('현금')}>
                  현금
                </Button>
                <Button onClick={() => this.salesViewTools('계좌이체')}>
                  계좌이체
                </Button>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>고객명</TableCell>
                      <TableCell scope='col'>운동명</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>결제된 회원권</TableCell>
                      <TableCell scope='col'>
                        기간권시작일[기간권일수]
                      </TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{this.state.toolsViewList}</TableBody>
                </Table>
              </Tab>
            </Tabs>
          </div>
        </Container>
        {/*.container */}
        <footer className='footer'>
          <Footer />
        </footer>
      </div> /*.sales */
    );
  }
}

const SalesStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const SalesDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(SalesStateToProps, SalesDispatchToProps)(Sales);
