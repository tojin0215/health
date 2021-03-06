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
  salesSelect2,
  salesSelectExercise,
  salesSelectTools,
} from '../../api/user';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');

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
        {salesDays ? `[` + salesDays + '???' + `]` : ''}
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
        {salesDays ? `[` + salesDays + '???' + `]` : ''}
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
        {salesDays ? `[` + salesDays + '???' + `]` : ''}
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
      lets: 0,
      page: 0,
      rowsPerPage: 5,
    };
  }
  goLogin = () => {
    this.props.history.push('/');
  };
  componentDidMount() {
    //???????????? ???????????? ??? ?????? ????????? ????????? ?????? ????????????
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
    let card = 0;
    let cash = 0;
    let transfer = 0;
    salesSelect(this.props.userinfo.fitness_no).then((res) => {
      const items = res.map((data, index, array) => {
        const total =
          data.exercisePrice + data.lockerPrice + data.sportswearPrice;
        const time = moment(data.paymentDate).format('YYYY/MM/DD');
        const dt = { ...data, total, time };
        if (data.paymentTools === '??????') {
          card = card + dt.total;
        } else if (data.paymentTools === '??????') {
          cash = cash + dt.total;
        } else if (data.paymentTools === '????????????') {
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
  //?????? ??????
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
  //?????? ??????
  salesToday2 = (tools, exercise) => {
    let startTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate()
    );
    let endTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate() + 1
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

  //?????? ??????
  salesToday3 = (tools, exercise) => {
    let startTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate()
    );
    let endTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth() + 1,
      this.state.today.getDate()
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
  //?????????????????? ????????????
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
    //?????????????????????
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
        if (data.paymentTools === '??????') {
          card = card + dt.total;
        } else if (data.paymentTools === '??????') {
          cash = cash + dt.total;
        } else if (data.paymentTools === '????????????') {
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

  //??????, ??? ??? ??????
  handleButton = (e, tools, exercise) => {
    let startTime = new Date(
      this.state.today.getFullYear(),
      this.state.today.getMonth(),
      this.state.today.getDate()
    );
    if (e === '??????') {
      let endTime = new Date(
        this.state.today.getFullYear(),
        this.state.today.getMonth(),
        this.state.today.getDate() + 1
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
          if (data.paymentTools === '??????') {
            card = card + dt.total;
          } else if (data.paymentTools === '??????') {
            cash = cash + dt.total;
          } else if (data.paymentTools === '????????????') {
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
          tommorrow: this.state.today,
          toolsViewList: [],
          exerciseViewList: [],
        });
      });
    } else if (e === '??? ???') {
      let endTime = new Date(
        this.state.today.getFullYear(),
        this.state.today.getMonth() + 1,
        this.state.today.getDate()
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
          if (data.paymentTools === '??????') {
            card = card + dt.total;
          } else if (data.paymentTools === '??????') {
            cash = cash + dt.total;
          } else if (data.paymentTools === '????????????') {
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
                ??????/??????
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>??????/??????</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
          <h2>?????? ??????</h2>
          <Row xs={6} className='py-3'>
            <Col xs={2}>
              <Button
                onClick={() => this.handleButton('??????')}
                variant='outline-primary'
                className='w-100'
              >
                ??????
              </Button>
            </Col>
            <Col xs={2}>
              <Button
                onClick={() => this.handleButton('??? ???')}
                variant='outline-primary'
                className='w-100'
              >
                ??? ???
              </Button>
            </Col>
            <Col xs={3}>
              <DatePicker
                className='sales__calender--dateinput w-100 text-center'
                dateFormat='yyyy/MM/dd(eee)'
                selected={this.state.today}
                onChange={(date) => this.setState({ today: date })}
              />
            </Col>
            {/* <Col xs={1}>
            </Col> */}
            <Col xs={3}>
              <DatePicker
                className='sales__calender--dateinput w-100 text-center'
                dateFormat='yyyy/MM/dd(eee)'
                selected={this.state.tommorrow}
                onChange={(date) => this.setState({ tommorrow: date })}
                minDate={this.state.today}
              />
            </Col>
            <Col xs={2}>
              <Button onClick={() => this.handleOnClick()} className='w-100'>
                ????????????
              </Button>
            </Col>
          </Row>
          <Row>
            <Col></Col>
          </Row>
          <div className='tablewrap'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell scope='col'>??????</TableCell>
                  <TableCell scope='col'>??????</TableCell>
                  <TableCell scope='col'>????????????</TableCell>
                  <TableCell scope='col'>?????????</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell scope='col'> {this.state.card}</TableCell>
                  <TableCell scope='col'>{this.state.cash}</TableCell>
                  <TableCell scope='col'>{this.state.transfer}</TableCell>
                  <TableCell scope='col'>{this.state.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className='salesUtill salesUtill2 d-flex flex-row-reverse'>
              <Link to='/addSales'>
                <Button>?????? ??????</Button>
              </Link>
            </div>
            <h5>?????? ??????</h5>
            <Tabs
              defaultActiveKey='home'
              id='uncontrolled-tab-example'
              className='mb-3'
            >
              <Tab eventKey='home' title='????????????'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>????????? ?????????</TableCell>
                      <TableCell scope='col'>
                        ??????????????????[???????????????]
                      </TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.salesViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
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
                </Table>
              </Tab>

              <Tab eventKey='exercise' title='?????????'>
                {/* ?????? ????????? ???????????? ????????? ????????? ????????? ????????? ??????
                (like handleInnerOnClick_choice, Reservation.js 455???) */}
                {this.state.lets === 1 ? (
                  <div>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('', '?????? PT')}
                    >
                      ?????? PT
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('', 'GX')}
                    >
                      GX
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('', '????????????')}
                    >
                      ????????????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('', '??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('', '??????')}
                    >
                      ??????
                    </Button>
                  </div>
                ) : this.state.lets === 2 ? (
                  <div>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('', '?????? PT')}
                    >
                      ?????? PT
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('', 'GX')}
                    >
                      GX
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('', '????????????')}
                    >
                      ????????????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('', '??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('', '??????')}
                    >
                      ??????
                    </Button>
                  </div>
                ) : this.state.lets === 3 ? (
                  <div>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('', '?????? PT')}
                    >
                      ?????? PT
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('', 'GX')}
                    >
                      GX
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('', '????????????')}
                    >
                      ????????????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('', '??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('', '??????')}
                    >
                      ??????
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewExercise('?????? PT')}
                    >
                      ?????? PT
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewExercise('GX')}
                    >
                      GX
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewExercise('????????????')}
                    >
                      ????????????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewExercise('??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewExercise('??????')}
                    >
                      ??????
                    </Button>
                  </div>
                )}

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>????????? ?????????</TableCell>
                      <TableCell scope='col'>
                        ??????????????????[???????????????]
                      </TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.exerciseViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
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
                </Table>
              </Tab>
              <Tab eventKey='tools' title='????????????'>
                {/* ?????? ?????? */}
                {this.state.lets === 1 ? (
                  <>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday1('????????????', '')}
                    >
                      ????????????
                    </Button>
                  </>
                ) : this.state.lets === 2 ? (
                  <>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday2('????????????', '')}
                    >
                      ????????????
                    </Button>
                  </>
                ) : this.state.lets === 3 ? (
                  <>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('??????', '')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesToday3('????????????', '')}
                    >
                      ????????????
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewTools('??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewTools('??????')}
                    >
                      ??????
                    </Button>
                    <Button
                      variant='outline-dark'
                      className='m-1'
                      onClick={() => this.salesViewTools('????????????')}
                    >
                      ????????????
                    </Button>
                  </>
                )}

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>?????????</TableCell>
                      <TableCell scope='col'>????????? ?????????</TableCell>
                      <TableCell scope='col'>
                        ??????????????????[???????????????]
                      </TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                      <TableCell scope='col'>????????????</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.toolsViewList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
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
