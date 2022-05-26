import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { getStatusRequest } from '../../action/authentication';

import ClickAwayListener from '@mui/base/ClickAwayListener';

import DropdownButton from 'react-bootstrap/DropdownButton';

import '../../styles/customer/Customer.css';
// import  { PC, Mobile } from '../../component/MediaQuery';

import { SERVER_URL } from '../../const/settings';
import MegaMenu from '../../component/navigation/Menu';
import CustomerCalendarComponent from '../../component/customer/CustomerCalendarComponent';
import {
  getCustomerByAll,
  getCustomerByManager,
  getCustomerByMemberNo,
  getCustomerByName,
  getCustomerByPhone,
  getCustomerByProfileName,
  getCustomerByResiNo,
  getSalesTypeCustomerByMemberNo,
} from '../../api/user';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');
const options = [
  '이름',
  '핸드폰',
  '담당자',
  '주민번호(앞자리)',
  '프로필(미지원)',
];
const defaultOption = options[0];

function dataFormatter(cell, row) {
  return ` ${cell}`.substring(0, 11);
}

function PriceFormatter(cell, row) {
  return (
    ` ${cell}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + '원'
  );
}

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      isOpenPopup: false,
      search: '',
      item: options[0],
      userLists: [],
      userLists2: [],
      userSalesLists: [],
      userSalesLists2: [],
      name: '',
      member_no: '',
      info: '',
      addr: '',
      phone: '',
      startDate: '',
      trainer: '',
      note: '',
      show: false,
    };

    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
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

  updateCustomerData = (result) => {
    const customerList = result
      .map((value) => {
        const sor = value.solar_or_lunar === true ? '양' : '음';
        return {
          no: value.member_no,
          name: value.name,
          sex: value.sex === true ? '남' : '여',
          phone: value.phone,
          in_charge: value.in_charge,
          start_date:
            moment(value.start_date).format('YYYY/MM/DD') +
            `~ (${value.period}개월)`,
          resi_no: `${value.resi_no}(${sor})`,
        };
      })
      .sort((a, b) => (a.no === b.no ? 0 : a.no - b.no));

    this.setState({ customerList });
  };

  cusFetch = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getCustomerByAll(fitness_no).then(this.updateCustomerData);
  };
  openPopup = () => {
    this.setState({
      isOpenPopup: true,
    });
  };
  closePopup = () => {
    this.setState({
      isOpenPopup: false,
    });
  };
  handleClickAway = () => {
    this.setState({
      show: false,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  calAge(data) {
    //만 나이 계산
    const today = new Date();
    let year = data.substring(0, 2);
    if (parseInt(year) >= '00' && parseInt(year) <= 30) {
      year = 20 + year;
    } else {
      year = 19 + year;
    }
    let month = data.substring(2, 4) - 1;
    let day = data.substring(4, 6);
    let birthday = new Date(year, month, day);

    let age = today.getFullYear() - birthday.getFullYear();
    let m = today.getMonth() - birthday.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }

  onSelectRow = (row, isSelected, e) => {
    if (!isSelected) return;

    //table row 클릭시
    const member_no = row.no;
    const fitness_no = this.props.userinfo.fitness_no;

    getCustomerByMemberNo(member_no, fitness_no).then((result) => {
      console.log(fitness_no);
      if (result.length < 1) return this.setState({ userLists: [] });
      const data = result[0];

      const age = this.calAge(data.resi_no); // 만나이
      const sex = data.sex === true ? '남' : '여';
      const info = sex + '/만' + age + '세/' + data.resi_no;
      const phone = `${data.phone.substring(0, 3)}-${data.phone.substring(
        3,
        7
      )}-${data.phone.substring(7, 11)}`;
      const date = moment(data.start_date).format('YYYY/MM/DD');

      this.setState({
        userLists: result,
        name: data.name,
        member_no: data.member_no,
        info: info,
        addr: data.address,
        phone: phone,
        startDate: date,
        trainer: data.in_charge,
        note: data.note,
      });
    });

    getSalesTypeCustomerByMemberNo(member_no, fitness_no).then((result) => {
      let arr = [];
      result.map((value) => {
        if (value.lockerPrice !== 0) {
          arr.push({
            product: '개인 사물함',
            date: value.paymentDate,
            payment: value.lockerPrice,
          });
        }
        if (value.sportswearPrice !== 0) {
          arr.push({
            product: '운동복',
            date: value.paymentDate,
            payment: value.sportswearPrice,
          });
        }
        arr.push({
          product: value.exerciseName,
          date: value.paymentDate,
          payment: value.exercisePrice,
        });
      });

      this.setState({
        userSalesLists: result,
        userSalesLists2: arr,
        show: true,
      });
    });
  };

  search = () => {
    const search = this.state.search;
    const fitness_no = this.props.userinfo.fitness_no;
    const selected_option = this.state.item;

    switch (selected_option) {
      case '이름':
        return getCustomerByName(search, fitness_no).then(
          this.updateCustomerData
        );
      case '핸드폰':
        return getCustomerByPhone(search, fitness_no).then(
          this.updateCustomerData
        );
      case '담당자':
        return getCustomerByManager(search, fitness_no).then(
          this.updateCustomerData
        );
      case '주민번호(앞자리)':
        return getCustomerByResiNo(search, fitness_no).then(
          this.updateCustomerData
        );
      case '프로필':
        return getCustomerByProfileName(search, fitness_no).then(
          this.updateCustomerData
        );
    }
  };
  selectItem = (e) => this.setState({ item: e.value });
  render() {
    console.log(this.props.userinfo.fitness_no);
    // const { userinfo } = this.props;

    const textOptions = {
      noDataText: '가입된 회원이 없습니다.',
      alwaysShowAllBtns: true,
      //hideSizePerPage:true
      sizePerPageList: [
        {
          text: '10명씩 보기',
          value: 10,
          //text: '5명씩 보기', value: 5
        },
        {
          text: '50명씩 보기',
          value: 50,
          //text: '10명씩 보기', value: 10
        },
        {
          text: '100명씩 보기',
          value: 100,
        },
      ],
    };

    const options1 = {
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
      sizePerPage: 3,
    };

    const selectRowProp = {
      mode: 'checkbox',
      //bgColor: 'pink', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
      hideSelectColumn: true, // enable hide selection column.
      clickToSelect: true, // you should enable clickToSelect, otherwise, you can't select column.
      onSelect: this.onSelectRow,
    };

    // console.log('table__', this.state.userSalesLists2);
    // console.log('클릭,', this.state.show);

    // const [show, setShow] = useState(false);

    return (
      <div className='customer'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                회원관리
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/customer'>고객</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div className='container'>
            <div>
              <Modal
                show={this.state.show}
                onHide={this.handleClickAway}
                aria-labelledby='example-modal'
              >
                <Modal.Header closeButton>
                  <Modal.Title id='example-modal' className='fs-1'>
                    상세 회원정보
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className=''>
                    {/* 캘린더 시작 */}
                    <Col xs={12} md={8} className=''>
                      <CustomerCalendarComponent
                        customer_no={this.state.member_no}
                      />
                    </Col>
                    {/* 캘린더 끝 */}
                    <Col xs={12} md={4} className=''>
                      <div>
                        <button
                          type='button'
                          onClick={this.handleClickAway}
                          className='btnSlideClose btnsolid'
                          style={{
                            backgroundImage: 'url(/src/img/btnCloseWhite.png)',
                          }}
                        >
                          닫기
                        </button>
                      </div>
                      <h5>
                        <div className='parallelogram'></div>
                        회원 정보
                      </h5>
                      <div className='pb-5 fs-3'>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            이름
                          </Col>
                          <Col>{this.state.name}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            고객번호
                          </Col>
                          <Col>{this.state.member_no}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            정보
                          </Col>
                          <Col>{this.state.info}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            연락처
                          </Col>
                          <Col>{this.state.phone}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            주소
                          </Col>
                          <Col>{this.state.addr}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            등록일
                          </Col>
                          <Col>{this.state.startDate}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            담당자
                          </Col>
                          <Col>{this.state.trainer}</Col>
                        </Row>
                        <Row className='pb-2'>
                          <Col className='fw-bold fs-2' xs={12} md={4}>
                            비고
                          </Col>
                          <Col>{this.state.note}</Col>
                        </Row>
                        <Row>
                          <Col className='text-center'>
                            <Link
                              to={{
                                pathname: '/customer/update',
                                state: { member_no: this.state.member_no },
                              }}
                              className='btnCustomerNew '
                            >
                              <button className='btnSolid fs-3'>
                                수정하기
                              </button>
                            </Link>
                          </Col>
                        </Row>
                      </div>
                      <h6>
                        <div className='circle'></div>
                        상품 결제 내역
                      </h6>
                      <div className='tablewrap'>
                        <BootstrapTable
                          data={this.state.userSalesLists2}
                          hover
                          pagination={this.state.customerList.length > 1}
                          options={options1}
                          tableHeaderClass='tableHeader'
                          tableContainerClass='tableContainer'
                          className='table2'
                        >
                          <TableHeaderColumn
                            dataField='product'
                            thStyle={{ textAlign: 'center' }}
                            tdStyle={{ textAlign: 'center' }}
                            isKey
                          >
                            상품
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='date'
                            dataFormat={dataFormatter}
                            thStyle={{ textAlign: 'center' }}
                            tdStyle={{ textAlign: 'center' }}
                          >
                            결제일자
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='payment'
                            dataFormat={PriceFormatter}
                            thStyle={{ textAlign: 'center' }}
                            tdStyle={{ textAlign: 'center' }}
                          >
                            금액
                          </TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </Col>
                  </Row>
                </Modal.Body>
              </Modal>
            </div>
            <div className='SearchInput'>
              <div className='SearchInputIn'>
                <Dropdown
                  className='searchDrop'
                  options={options}
                  onChange={this.selectItem}
                  value={this.state.item}
                  placeholder='Select an option'
                />
                <input
                  type='text'
                  id='search'
                  className='inputTextLine'
                  checked={this.state.search}
                  onChange={this.handleChange}
                />
                <button
                  className='btnSearch btnGhost'
                  type='button'
                  onClick={this.search}
                >
                  {' '}
                  고객 검색
                </button>
              </div>
            </div>
            <Link to='/customer/add' className='btnCustomerNew'>
              <button className='btnSolid'>신규회원 등록</button>
            </Link>
            <div className='customerTable sectionGlass'>
              <h5>
                <div className='circle'></div>
                회원 목록
              </h5>
              <div>
                <BootstrapTable
                  hover
                  data={this.state.customerList}
                  options={textOptions}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  pagination={this.state.customerList.length > 1}
                  selectRow={selectRowProp}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '5.5rem' }}
                    tdStyle={{ textAlign: 'center', width: '5.5rem' }}
                    isKey
                  >
                    No.
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='name'
                    thStyle={{ textAlign: 'center' }}
                    tdStyle={{ textAlign: 'center' }}
                  >
                    회원이름
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='sex'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
                  >
                    성별
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='phone'
                    thStyle={{ textAlign: 'center' }}
                    tdStyle={{ textAlign: 'center' }}
                  >
                    핸드폰
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='in_charge'
                    thStyle={{ textAlign: 'center' }}
                    tdStyle={{ textAlign: 'center' }}
                  >
                    담당자
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='start_date'
                    thStyle={{ textAlign: 'center' }}
                    tdStyle={{ textAlign: 'center' }}
                  >
                    강습시작일
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='resi_no'
                    thStyle={{ textAlign: 'center', width: '12rem' }}
                    tdStyle={{ textAlign: 'center', width: '12rem' }}
                  >
                    생년월일
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
            {/* ------ 클릭하면 나와야하는 부분 ------ */}
            {/* {this.state.show ? <div></div> : null} */}
            {/* ------ 클릭하면 나와야하는 부분 ------ */}
          </div>
        </ClickAwayListener>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const CustomerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const CustomerDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(CustomerStateToProps, CustomerDispatchToProps)(Customer);
