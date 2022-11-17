import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import MobNavigation from '../../component/navigation/MobNavigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
// 미디어쿼리
import { Mobile, PC } from '../../component/common/MediaQuery';

import { Row, Col, Container, Button } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import '../../styles/sales/Sales.css';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';
import {
  salesSelect,
  salesSelect2,
  salesSelectExercise,
  salesSelectTools,
} from '../../api/user';
// react icons
import { TbMoodSuprised } from 'react-icons/tb';
/* mui */
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { TextField } from '@mui/material';
/* 
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'; */
import { DataArrayRounded } from '@mui/icons-material';

// nivo.rocks 그래프
import { ResponsiveBar } from '@nivo/bar';
// apexcharts.com
import Chart from 'react-apexcharts';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

// var options = {
//   chart: {
//     type: 'bar',
//   },
//   series: [
//     {
//       name: 'sales',
//       data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
//     },
//   ],
//   xaxis: {
//     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
//   },
// };

// var chart = new ApexCharts(document.querySelector('#chart'), options);
// chart.render();

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
      <TableCell>
        {startDate}
        {salesDays ? `[` + salesDays + '일' + `]` : ''}
      </TableCell>
      <TableCell>{paidMembership ? paidMembership : ''}</TableCell>
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
        {salesDays ? `[` + salesDays + '일' + `]` : ''}
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
        {salesDays ? `[` + salesDays + '일' + `]` : ''}
      </TableCell>
      <TableCell>{paymentTools}</TableCell>
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
      card: 0,
      cash: 0,
      transfer: 0,
      total: 0,
      today: new Date(),
      tommorrow: new Date(),
      ntoday: new Date(),
      lets: 0, //선택조회:1, 당일:2, 당월:3
      page: 0,
      rowsPerPage: 5,
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
      // chart: {
      //   type: 'bar',
      //   height: 550,
      //   stacked: true,
      //   toolbar: {
      //     show: true,
      //   },
      //   zoom: {
      //     enabled: true,
      //   },
      // },
      // optionsDonut: {},
      // seriesDonut: [30, 40, 45, 50, 49],
      // labelsDonut: ['A', 'B', 'C', 'D', 'E'],
    };
  }
  goLogin = () => {
    this.props.history.push('/');
  };
  goAddSales = () => {
    this.props.history.push('/addSales');
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
        this.handleButton('당일');
        this.salesToday1('', '');
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
    let card = 0;
    let cash = 0;
    let transfer = 0;
    salesSelect(this.props.userinfo.fitness_no).then((res) => {
      const items = res.map((data, index, array) => {
        const total =
          data.exercisePrice + data.lockerPrice + data.sportswearPrice;
        const time = moment(data.paymentDate).format('YYYY/MM/DD');
        const dt = { ...data, total, time };
        if (data.paymentTools === '카드') {
          card = card + dt.total;
        } else if (data.paymentTools === '현금') {
          cash = cash + dt.total;
        } else if (data.paymentTools === '계좌이체') {
          transfer = transfer + dt.total;
        }
      });
      this.setState({
        card: card,
        cash: cash,
        transfer: transfer,
        total: card + cash + transfer,
      });
    });
  };

  //선택 조회
  salesToday1 = (tools, exercise) => {
    let startTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate()
    );
    let endTime = new Date(
      this.state.tommorrow.getFullYear(),
      this.state.tommorrow.getMonth(),
      this.state.tommorrow.getDate() + 1
    );
    salesSelect2(
      this.props.userinfo.fitness_no,
      startTime,
      endTime,
      tools != undefined ? tools : '',
      exercise != undefined ? exercise : ''
    ).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          (
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
          ),
          (
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
          )
        );
      });
      this.setState({
        toolsViewList: items.reverse(),
        exerciseViewList: items.reverse(),
      });
    });
  };
  //당일 조회
  salesToday2 = (tools, exercise) => {
    let startTime = new Date(
      this.state.ntoday.getFullYear(),
      this.state.ntoday.getMonth(),
      this.state.ntoday.getDate()
    );
    let endTime = new Date(
      this.state.ntoday.getFullYear(),
      this.state.ntoday.getMonth(),
      this.state.ntoday.getDate() + 1
    );

    salesSelect2(
      this.props.userinfo.fitness_no,
      startTime,
      endTime,
      tools != undefined ? tools : '',
      exercise != undefined ? exercise : ''
    ).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          (
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
          ),
          (
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
          )
        );
      });
      this.setState({
        toolsViewList: items.reverse(),
        exerciseViewList: items.reverse(),
      });
    });
  };
  //당월 조회
  salesToday3 = (tools, exercise) => {
    let startTime = new Date(
      this.state.ntoday.getFullYear(),
      this.state.ntoday.getMonth(),
      1
    );
    let endTime = new Date(
      this.state.ntoday.getFullYear(),
      this.state.ntoday.getMonth() + 1,
      0
    );
    salesSelect2(
      this.props.userinfo.fitness_no,
      startTime,
      endTime,
      tools != undefined ? tools : '',
      exercise != undefined ? exercise : ''
    ).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          (
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
          ),
          (
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
          )
        );
      });
      this.setState({
        toolsViewList: items.reverse(),
        exerciseViewList: items.reverse(),
      });
    });
  };
  //날짜선택해서 조회하기
  handleOnClick = (tools, exercise) => {
    let startTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate()
    );
    let endTime = new Date(
      this.state.tommorrow.getFullYear(),
      this.state.tommorrow.getMonth(),
      this.state.tommorrow.getDate() + 1
    );
    let card = 0;
    let cash = 0;
    let transfer = 0;
    //전체보기테이블
    salesSelect2(
      this.props.userinfo.fitness_no,
      startTime,
      endTime,
      tools != undefined ? tools : '',
      exercise != undefined ? exercise : ''
    ).then((res) => {
      const items = res.map((data, index, array) => {
        const total =
          data.exercisePrice + data.lockerPrice + data.sportswearPrice;
        const time = moment(data.paymentDate).format('YYYY/MM/DD');
        const dt = { ...data, total, time };
        if (data.paymentTools === '카드') {
          card = card + dt.total;
        } else if (data.paymentTools === '현금') {
          cash = cash + dt.total;
        } else if (data.paymentTools === '계좌이체') {
          transfer = transfer + dt.total;
        }
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
      this.setState({
        lets: 1,
        card: card,
        cash: cash,
        transfer: transfer,
        total: card + cash + transfer,
        salesViewList: items.reverse(),
        toolsViewList: [],
        exerciseViewList: [],
      });
    });
  };

  //당일, 당월 버튼
  handleButton = (e, tools, exercise) => {
    if (e === '당일') {
      let startTime = new Date(
        this.state.ntoday.getFullYear(),
        this.state.ntoday.getMonth(),
        this.state.ntoday.getDate()
      );
      let endTime = new Date(
        this.state.ntoday.getFullYear(),
        this.state.ntoday.getMonth(),
        this.state.ntoday.getDate() + 1
      );
      let card = 0;
      let cash = 0;
      let transfer = 0;
      salesSelect2(
        this.props.userinfo.fitness_no,
        startTime,
        endTime,
        tools != undefined ? tools : '',
        exercise != undefined ? exercise : ''
      ).then((res) => {
        const items = res.map((data, index, array) => {
          const total =
            data.exercisePrice + data.lockerPrice + data.sportswearPrice;
          const time = moment(data.paymentDate).format('YYYY/MM/DD');
          const dt = { ...data, total, time };
          if (data.paymentTools === '카드') {
            card = card + dt.total;
          } else if (data.paymentTools === '현금') {
            cash = cash + dt.total;
          } else if (data.paymentTools === '계좌이체') {
            transfer = transfer + dt.total;
          }
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
        this.setState({
          lets: 2,
          card: card,
          cash: cash,
          transfer: transfer,
          total: card + cash + transfer,
          salesViewList: items.reverse(),
          today: this.state.ntoday,
          tommorrow: this.state.ntoday,
          toolsViewList: [],
          exerciseViewList: [],
        });
      });
    } else if (e === '당월') {
      let startTime = new Date(
        this.state.ntoday.getFullYear(),
        this.state.ntoday.getMonth(),
        1
      );
      let endTime = new Date(
        this.state.ntoday.getFullYear(),
        this.state.ntoday.getMonth() + 1,
        0
      );
      let card = 0;
      let cash = 0;
      let transfer = 0;
      salesSelect2(
        this.props.userinfo.fitness_no,
        startTime,
        endTime,
        tools != undefined ? tools : '',
        exercise != undefined ? exercise : ''
      ).then((res) => {
        const items = res.map((data, index, array) => {
          const total =
            data.exercisePrice + data.lockerPrice + data.sportswearPrice;
          const time = moment(data.paymentDate).format('YYYY/MM/DD');
          const dt = { ...data, total, time };
          if (data.paymentTools === '카드') {
            card = card + dt.total;
          } else if (data.paymentTools === '현금') {
            cash = cash + dt.total;
          } else if (data.paymentTools === '계좌이체') {
            transfer = transfer + dt.total;
          }
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
        this.setState({
          lets: 3,
          card: card,
          cash: cash,
          transfer: transfer,
          total: card + cash + transfer,
          salesViewList: items.reverse(),
          today: startTime,
          tommorrow: endTime,
          toolsViewList: [],
          exerciseViewList: [],
        });
      });
    }
  };
  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.salesViewList);
    // console.log(this.state.exerciseViewList);
    // console.log(this.state.card);
    // console.log(this.state.lets);
    // console.log(data.salesDays);
    return (
      <div className='wrap sales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MobNavigation goLogin={this.goLogin} />
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
                <Link to='#'>매출</Link>
                <span>&#62;</span>
                <Link to='#'>매출현황</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container className='sales'>
          <div className='sales--header'>
            <h5>
              <strong>투진피트니스</strong>의 매출현황입니다.
            </h5>
            <Button onClick={this.goAddSales}>결제 등록</Button>
          </div>
          <Row>
            <Col xs={12} className='mixed-chart my-3'>
              <Chart
                options={this.state.options}
                series={this.state.series}
                type='bar'
                width='100%'
                height='400px'
              />
            </Col>
            {/* <Col xs={6} className='mixed-chart'>
              <Chart
                options={this.state.optionsDonut}
                series={this.state.seriesDonut}
                type='donut'
                width='450'
              />
            </Col> */}
          </Row>
          <PC>
            <div className='d-flex justify-content-between my-3'>
              <Button
                onClick={() => this.handleButton('당일')}
                variant='outline-primary'
                className=''
              >
                당일
              </Button>
              <Button
                onClick={() => this.handleButton('당월')}
                variant='outline-primary'
                className=''
              >
                당월
              </Button>
              <div>
                <DatePicker
                  className='sales__calender--dateinput w-100 text-center'
                  dateFormat='yyyy년MM월dd일'
                  selected={this.state.today}
                  onChange={(date) => this.setState({ today: date })}
                  maxDate={this.state.today}
                />
              </div>
              <div>
                <DatePicker
                  className='sales__calender--dateinput w-100 text-center'
                  dateFormat='yyyy년MM월dd일'
                  selected={this.state.tommorrow}
                  onChange={(date) => this.setState({ tommorrow: date })}
                  maxDate={this.state.today}
                />
              </div>
              <Button onClick={() => this.handleOnClick()} className=''>
                조회하기
              </Button>
            </div>
          </PC>
          <Mobile>
            <Row className='sales__search-requirement'>
              <Col xs={6}>
                <DatePicker
                  className='sales__calender--dateinput w-100 text-center'
                  dateFormat='yyyy년MM월dd일'
                  selected={this.state.today}
                  onChange={(date) => this.setState({ today: date })}
                  maxDate={this.state.today}
                />
              </Col>
              <Col xs={6}>
                <DatePicker
                  className='sales__calender--dateinput w-100 text-center'
                  dateFormat='yyyy년MM월dd일'
                  selected={this.state.tommorrow}
                  onChange={(date) => this.setState({ tommorrow: date })}
                  maxDate={this.state.today}
                />
              </Col>
              <Col xs={3}>
                <Button
                  onClick={() => this.handleButton('당일')}
                  variant='outline-primary'
                  className=''
                >
                  당일
                </Button>
              </Col>
              <Col xs={3}>
                <Button
                  onClick={() => this.handleButton('당월')}
                  variant='outline-primary'
                  className=''
                >
                  당월
                </Button>
              </Col>
              <Col xs={6}>
                <Button onClick={() => this.handleOnClick()} className=''>
                  조회하기
                </Button>
              </Col>
            </Row>
          </Mobile>
          <TableContainer
            component={Paper}
            className='stage-add--workout-selected-list sales__summary-table'
          >
            <Table className='table-dark table-sales table--block'>
              <TableHead>
                <TableRow>
                  <TableCell scope='col'>카드</TableCell>
                  <TableCell scope='col'>현금</TableCell>
                  <TableCell scope='col'>계좌이체</TableCell>
                  <TableCell scope='col'>총매출</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell scope='col'> {this.state.card}</TableCell>
                <TableCell scope='col'>{this.state.cash}</TableCell>
                <TableCell scope='col'>{this.state.transfer}</TableCell>
                <TableCell scope='col' className='text-primary'>
                  {this.state.total}
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>
          <Tabs
            defaultActiveKey='home'
            id='uncontrolled-tab-example'
            className='mb-3 mt-5'
          >
            <Tab eventKey='home' title='전체보기'>
              <TableContainer
                component={Paper}
                className='stage-add--workout-selected-list sales__detail-table'
              >
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>회원명</TableCell>
                      <TableCell scope='col'>보유이용권</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>이용권시작일</TableCell>
                      <TableCell scope='col'>잔여이용권</TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.salesViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
                </Table>
                {this.state.salesViewList.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.salesViewList.length,
                    },
                  ]}
                  count={this.state.salesViewList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>

            <Tab eventKey='exercise' title='운동별'>
              {/* lets == 1, 선택 조회 */}
              {this.state.lets === 1 ? (
                <div>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '개인PT')}
                  >
                    개인PT
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', 'GX')}
                  >
                    GX
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '필라테스')}
                  >
                    필라테스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '헬스')}
                  >
                    헬스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '기타')}
                  >
                    기타
                  </Button>
                </div>
              ) : this.state.lets === 2 ? (
                <div>
                  {/* lets == 2, 당일 조회 */}
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('', '개인PT')}
                  >
                    개인PT
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('', 'GX')}
                  >
                    GX
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('', '필라테스')}
                  >
                    필라테스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('', '헬스')}
                  >
                    헬스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('', '기타')}
                  >
                    기타
                  </Button>
                </div>
              ) : this.state.lets === 3 ? (
                <div>
                  {/* lets == 3, 당월 조회 */}
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('', '개인PT')}
                  >
                    개인PT
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('', 'GX')}
                  >
                    GX
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('', '필라테스')}
                  >
                    필라테스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('', '헬스')}
                  >
                    헬스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('', '기타')}
                  >
                    기타
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewExercise('개인PT')}
                  >
                    개인PT
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewExercise('GX')}
                  >
                    GX
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewExercise('필라테스')}
                  >
                    필라테스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewExercise('헬스')}
                  >
                    헬스
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewExercise('기타')}
                  >
                    기타
                  </Button>
                </div>
              )}
              <TableContainer
                component={Paper}
                className='stage-add--workout-selected-list sales__detail-table'
              >
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>회원명</TableCell>
                      <TableCell scope='col'>보유이용권</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>이용권시작일</TableCell>
                      <TableCell scope='col'>잔여이용권</TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.salesViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
                </Table>
                {this.state.salesViewList.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.salesViewList.length,
                    },
                  ]}
                  count={this.state.salesViewList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>
            <Tab eventKey='tools' title='결제도구별'>
              {/* 위와 동일 */}
              {/* 셀렉트 박스로 변경 기능 작업 예정 */}
              {this.state.lets === 1 ? (
                <>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('카드', '')}
                  >
                    카드
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('현금', '')}
                  >
                    현금
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('계좌이체', '')}
                  >
                    계좌이체
                  </Button>
                </>
              ) : this.state.lets === 2 ? (
                <>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('카드', '')}
                  >
                    카드
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('현금', '')}
                  >
                    현금
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday2('계좌이체', '')}
                  >
                    계좌이체
                  </Button>
                </>
              ) : this.state.lets === 3 ? (
                <>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('카드', '')}
                  >
                    카드
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('현금', '')}
                  >
                    현금
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday3('계좌이체', '')}
                  >
                    계좌이체
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesToday1('', '')}
                  >
                    전체보기
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewTools('카드')}
                  >
                    카드
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewTools('현금')}
                  >
                    현금
                  </Button>
                  <Button
                    variant='outline-light'
                    className='m-1'
                    onClick={() => this.salesViewTools('계좌이체')}
                  >
                    계좌이체
                  </Button>
                </>
              )}
              <TableContainer
                component={Paper}
                className='stage-add--workout-selected-list sales__detail-table'
              >
                <Table
                  className='table--block table-dark'
                  aria-label='simple table'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>회원명</TableCell>
                      <TableCell scope='col'>보유이용권</TableCell>
                      <TableCell scope='col'>결제일</TableCell>
                      <TableCell scope='col'>이용권시작일</TableCell>
                      <TableCell scope='col'>잔여이용권</TableCell>
                      <TableCell scope='col'>결제도구</TableCell>
                      <TableCell scope='col'>결제금액</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.salesViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
                </Table>
                {this.state.salesViewList.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 회원이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.salesViewList.length,
                    },
                  ]}
                  count={this.state.salesViewList.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Tab>
          </Tabs>
          <div className='tablewrap'>
            <div className='salesUtill salesUtill2 d-flex flex-row-reverse'>
              <Link to='/addSales'></Link>
            </div>
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
