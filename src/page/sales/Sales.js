import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import { Row, Col, Container, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import '../../styles/sales/Sales.css';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';

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

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      salesLists: [],
      salesLists2: [],
      salesLists3: [],
      salesLists4: [],
      toolList: [],
      customerList: [],
      selectedOption: null,
      exerciseOptions: null,
    };
    this.cusFetch();
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

  cusFetch = () => {
    fetch(ip + '/customer?type=all&fn=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        let arr = [];
        for (let i = 0; i < res.length; i++) {
          arr.push({
            num: res[i].member_no,
            userName: res[i].name,
            paidMembership: res[i].paidMembership,
            salesStart_date: res[i].salesStart_date,
            salesDays: res[i].salesDays,
          });
        }
        this.setState({ customerList: arr });
      });

    fetch(ip + '/sales?type=all&fn=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          salesLists: data,
        });

        let card = 0;
        let cash = 0;
        let transfer = 0;
        let lists = [];
        this.state.salesLists.reverse().map((data) => {
          let total =
            data.exercisePrice + data.lockerPrice + data.sportswearPrice;
          let time = moment(data.paymentDate).format('YYYY/MM/DD');
          data = { ...data, total, time };
          this.state.customerList.map((c) => {
            if (data.member_no === c.num) {
              let userName = c.userName;
              data = { ...data, userName };
            }
          });
          lists = [...lists, data];

          if (data.paymentTools === '카드') {
            card = card + data.total;
          } else if (data.paymentTools === '현금') {
            cash = cash + data.total;
          } else if (data.paymentTools === '계좌이체') {
            transfer = transfer + data.total;
          }

          this.setState({
            salesLists2: lists,
            toolList: [
              {
                card: card,
                cash: cash,
                transfer: transfer,
                total: card + cash + transfer,
              },
            ],
          });
        });
      });
  };

  handleChange = (selectedOption) => {
    let startTime = new Date(
      this.state.startDate.getFullYear(),
      this.state.startDate.getMonth(),
      this.state.startDate.getDate()
    );
    let endTime = new Date(
      this.state.endDate.getFullYear(),
      this.state.endDate.getMonth(),
      this.state.endDate.getDate() + 1
    );

    let url = '';
    if (selectedOption.label === '전체') {
      url =
        ip +
        '/sales?type=select&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no;
    } else {
      url =
        ip +
        '/sales?type=tools&paymentTools=' +
        selectedOption.label +
        '&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no;
    }
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          salesLists3: data,
        });
        let list = [];
        this.state.salesLists3.reverse().map((data) => {
          let total =
            data.exercisePrice + data.lockerPrice + data.sportswearPrice;
          let time = moment(data.paymentDate).format('YYYY/MM/DD');
          data = { ...data, total, time };
          this.state.customerList.map((c) => {
            if (data.member_no === c.num) {
              let userName = c.userName;

              data = { ...data, userName };
            }
          });
          list = [...list, data];
        });
        this.setState({
          salesLists2: list,
          selectedOption: selectedOption,
          exerciseSelectedOption: 'all',
        });
      });
  };

  exhandleChange = (exerciseSelectedOption) => {
    let startTime = new Date(
      this.state.startDate.getFullYear(),
      this.state.startDate.getMonth(),
      this.state.startDate.getDate()
    );
    let endTime = new Date(
      this.state.endDate.getFullYear(),
      this.state.endDate.getMonth(),
      this.state.endDate.getDate() + 1
    );

    let url = '';
    if (exerciseSelectedOption.label === '전체') {
      url =
        ip +
        '/sales?type=select&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no;
    } else {
      url =
        ip +
        '/sales?type=exercise&exerciseName=' +
        exerciseSelectedOption.label +
        '&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no;
    }
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          salesLists3: data,
        });
        let card = 0;
        let cash = 0;
        let transfer = 0;
        let list = [];
        let toolLists = [];
        this.state.salesLists3.reverse().map((data) => {
          let total =
            data.exercisePrice + data.lockerPrice + data.sportswearPrice;
          let time = moment(data.paymentDate).format('YYYY/MM/DD');
          data = { ...data, total, time };
          this.state.customerList.map((c) => {
            if (data.member_no === c.num) {
              let userName = c.userName;

              data = { ...data, userName };
            }
          });
          list = [...list, data];

          if (data.paymentTools === '카드') {
            card = card + data.total;
          } else if (data.paymentTools === '현금') {
            cash = cash + data.total;
          } else if (data.paymentTools === '계좌이체') {
            transfer = transfer + data.total;
          }
          toolLists = [
            {
              card: card,
              cash: cash,
              transfer: transfer,
              total: card + cash + transfer,
            },
          ];
        });
        this.setState({
          salesLists2: list,
          exerciseSelectedOption: exerciseSelectedOption,
          toolList: toolLists,
          selectedOption: 'all',
        });
      });
  };

  dateClick = (e) => {
    let today = new Date();
    let url = '';
    let startTime = new Date();
    let endTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (e.target.value === '오늘') {
      if (this.state.salesLists4.length != 0) {
        this.setState({
          salesLists4: [],
          salesLists2: [],
          startDate: startTime,
          endDate: endTime,
        });
      }
      url = ip + '/sales?type=all&fn=' + this.props.userinfo.fitness_no;
    } else if (e.target.value === '한달') {
      if (this.state.salesLists4.length != 0) {
        this.setState({
          salesLists4: [],
          salesLists2: [],
          endDate: endTime,
        });
      }
      startTime = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      endTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      url =
        ip +
        '/sales?type=select&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          salesLists4: data,
        });
        if (this.state.salesLists4.length == 0) {
          //alert('없음')
          this.setState({
            salesLists2: [],
            toolList: [],
          });
        } else {
          //alert(this.state.salesLists4)
          let card = 0;
          let cash = 0;
          let transfer = 0;
          let lists = [];
          this.state.salesLists4.reverse().map((data) => {
            let total =
              data.exercisePrice + data.lockerPrice + data.sportswearPrice;
            let time = moment(data.paymentDate).format('YYYY/MM/DD');
            data = { ...data, total, time };
            this.state.customerList.map((c) => {
              if (data.member_no === c.num) {
                let userName = c.userName;

                data = { ...data, userName };
              }
            });
            if (data.paymentTools === '카드') {
              card = card + data.total;
            } else if (data.paymentTools === '현금') {
              cash = cash + data.total;
            } else if (data.paymentTools === '계좌이체') {
              transfer = transfer + data.total;
            }

            lists = [...lists, data];
          });
          this.setState({
            salesLists2: lists,
            toolList: [
              {
                card: card,
                cash: cash,
                transfer: transfer,
                total: card + cash + transfer,
              },
            ],
            startDate: startTime,
          });
        }
      });
  };

  handleOnClick = (e) => {
    this.setState({
      exerciseSelectedOption: null,
      selectedOption: null,
    });

    let startTime = new Date(
      this.state.startDate.getFullYear(),
      this.state.startDate.getMonth(),
      this.state.startDate.getDate()
    );
    let endTime = new Date(
      this.state.endDate.getFullYear(),
      this.state.endDate.getMonth(),
      this.state.endDate.getDate() + 1
    );

    fetch(
      ip +
        '/sales?type=select&startDate=' +
        startTime +
        '&endDate=' +
        endTime +
        '&fn=' +
        this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({
          salesLists: data,
        });

        if (this.state.salesLists.length == 0) {
          //alert('없음')
          this.setState({
            salesLists2: [],
            toolList: [],
          });
        } else {
          let card = 0;
          let cash = 0;
          let transfer = 0;
          let lists = [];
          let toolLists = [];

          this.state.salesLists.reverse().map((data) => {
            let total =
              data.exercisePrice + data.lockerPrice + data.sportswearPrice;
            let time = moment(data.paymentDate).format('YYYY/MM/DD');
            data = { ...data, total, time };
            this.state.customerList.map((c) => {
              if (data.member_no === c.num) {
                let userName = c.userName;

                data = { ...data, userName };
              }
            });
            lists = [...lists, data];

            if (data.paymentTools === '카드') {
              card = card + data.total;
            } else if (data.paymentTools === '현금') {
              cash = cash + data.total;
            } else if (data.paymentTools === '계좌이체') {
              transfer = transfer + data.total;
            }
            toolLists = [
              {
                card: card,
                cash: cash,
                transfer: transfer,
                total: card + cash + transfer,
              },
            ];

            this.setState({
              salesLists2: lists,
              toolList: toolLists,
              exerciseSelectedOption: '전체',
              selectedOption: '전체',
            });
          });
        }
      });
  };

  render() {
    const { userinfo } = this.props;
    console.log('userinfo : ');
    console.log(userinfo);
    console.log('customerList', this.state.customerList);
    console.log('salesLists2', this.state.salesLists2);

    const textOptions = {
      noDataText: '결제내역이 없습니다.',
      alwaysShowAllBtns: true,
      //hideSizePerPage:true
      sizePerPageList: [
        {
          text: '10개씩 보기',
          value: 10,
        },
        {
          text: '50개씩 보기',
          value: 50,
        },
        {
          text: '100개씩 보기',
          value: 100,
        },
      ],
    };

    return (
      <div className='sales'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
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
            <div className='salesStatus'>
              <Row>
                <Col className='text-end'>
                  <Button value='오늘' onClick={this.dateClick}>
                    당일
                  </Button>
                  <Button value='한달' onClick={this.dateClick}>
                    1개월
                  </Button>
                </Col>
                <Col className='d-flex'>
                  <DatePicker
                    selected={this.state.startDate}
                    selectsStart
                    maxDate={new Date()}
                    onChange={(date) => this.setState({ startDate: date })}
                    name='startDate'
                    dateFormat='yyyy/MM/dd'
                  />
                  <text> ~ </text>
                  <DatePicker
                    selected={this.state.endDate}
                    selectsEnd
                    minDate={this.state.startDate}
                    maxDate={new Date()}
                    onChange={(date) => this.setState({ endDate: date })}
                    name='endDate'
                    dateFormat='yyyy/MM/dd'
                  />
                </Col>
                <Col>
                  <Button onClick={this.handleOnClick}>조회하기</Button>
                </Col>
              </Row>
            </div>
            {/*.salesStatus */}
          </div>
          {/*.salesUtill */}
          <div className='tablewrap'>
            <BootstrapTable
              data={this.state.toolList}
              options={textOptions}
              tableHeaderClass='tableHeader'
              tableContainerClass='tableContainer'
              className='salesTotal'
            >
              <TableHeaderColumn
                dataField='card'
                dataFormat={PriceFormatter}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                카드
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='cash'
                dataFormat={PriceFormatter}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                현금
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='transfer'
                dataFormat={PriceFormatter}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                계좌이체
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='total'
                dataFormat={PriceFormatter}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
                isKey
              >
                총 매출
              </TableHeaderColumn>
            </BootstrapTable>
            <div className='salesUtill salesUtill2 d-flex flex-row-reverse'>
              <Link to='/sales/add'>
                <Button>결제 등록</Button>
              </Link>
            </div>
            <h5>전체 기록</h5>
            <BootstrapTable
              data={this.state.salesLists2}
              hover
              options={textOptions}
              pagination={this.state.customerList.length > 1}
              tableHeaderClass='tableHeader'
              tableContainerClass='tableContainer'
              className='table2'
            >
              <TableHeaderColumn
                dataField='num'
                thStyle={{ textAlign: 'center', width: '8rem' }}
                tdStyle={{ textAlign: 'center', width: '8rem' }}
                isKey
              >
                No.
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='userName'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                회원이름
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='exerciseName'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                <Select
                  menuPortalTarget={document.querySelector('body')}
                  placeholder='상품이름'
                  value={this.state.exerciseSelectedOption}
                  onChange={this.exhandleChange}
                  options={exerciseOptions}
                />
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='time'
                dataFormat={dataFormatter}
                thStyle={{ textAlign: 'center', width: '12rem' }}
                tdStyle={{ textAlign: 'center', width: '12rem' }}
              >
                결제일
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='total'
                dataFormat={PriceFormatter}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                결제 금액
              </TableHeaderColumn>

              <TableHeaderColumn
                dataFormat={membershipFormatter}
                dataField='paidMembership'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                결제된 회원권
              </TableHeaderColumn>
              <TableHeaderColumn
                dataFormat={salesdateFormatter}
                dataField='salesStart_date'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                기간권 시작일
              </TableHeaderColumn>
              {/* date값으로 변경하기 */}
              <TableHeaderColumn
                dataFormat={daysFormatter}
                dataField='salesDays'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                기간권 일수(마감일로변경)
              </TableHeaderColumn>
              {/* 값이 null이면 나오기 숨기기 */}
              <TableHeaderColumn
                dataField='paymentTools'
                thStyle={{ textAlign: 'center', width: '16rem' }}
                tdStyle={{ textAlign: 'center', width: '16rem' }}
              >
                <Select
                  menuPortalTarget={document.querySelector('body')}
                  placeholder='결제도구'
                  value={this.state.selectedOption}
                  onChange={this.handleChange}
                  options={options}
                />
              </TableHeaderColumn>
            </BootstrapTable>
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
