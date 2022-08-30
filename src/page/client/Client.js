import { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';

import {
  clientSelect,
  deleteClient,
  selectClientReservation,
  selectTrainerReservation,
  updateClient,
  updateManagerClientTrainer,
  voucherSelect,
  voucherSelect2,
  voucherUpdate,
  voucherUpdate2,
} from '../../api/user';

// 컴포넌트
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Footer from '../../component/footer/Footer';
import CustomerCalendarComponent from '../../component/customer/CustomerCalendarComponent';

// moment
import moment from 'moment';
// Bootstrap
import Form from 'react-bootstrap/Form';
import { Container, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

// css
import '../../styles/client/client.css';
import { TablePagination } from '@mui/material';

// react icons
import { TbMoodSuprised } from 'react-icons/tb';

const ViewClientItem = ({
  joinNo,
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
  lockerNumber,
  sportswear,
  idc,
  viewClient,
  loginWhether,
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [client_name_input, setClient_name_input] = useState('');
  const [address_input, setAddress_input] = useState('');
  const [phone_input, setPhone_input] = useState('');
  const [locker_input, setLocker_input] = useState(lockerNumber);
  const [wear_input, setWear_input] = useState(sportswear);
  const [voucher, setVoucher] = useState([]);
  const [voucher2, setVoucher2] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const modalClose = () => {
    setShowModal(false);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
    setShowUpdate(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    vocherView();
  };
  const modalUpdate = () => {
    setShowUpdate(true);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
  };

  const deleteCompleted = (idc) => {
    deleteClient(idc).then(() => {
      modalClose();
      setShowUpdate(false);
      viewClient();
    });
  };

  const viewModalOnclick = () => {
    setViewModal(true);
    vocherView2();
  };
  const viewModalClose = () => {
    setViewModal(false);
  };

  const updateCompleted = (idc) => {
    if (client_name_input === '') {
      alert('이름을 입력해주세요.');
    } else if (phone_input === '') {
      alert('연락처를 입력해주세요.');
    } else if (address_input === '') {
      alert('주소를 입력해주세요.');
    } else {
      updateClient(
        idc,
        client_name_input,
        phone_input,
        address_input,
        locker_input,
        wear_input
      ).then(() => {
        updateManagerClientTrainer(idc, client_name_input, phone_input).then(
          () => {}
        );
        modalClose();
        setShowUpdate(false);
        viewClient();
      });
    }
  };

  const updateChange1 = (e) => {
    setClient_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setAddress_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setPhone_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setLocker_input(e.target.value);
  };
  const handleWear = () => {
    setWear_input('미사용');
  };
  const handleWear2 = () => {
    setWear_input('사용');
  };

  const VoucherView = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');
    const today = moment(new Date()).format('YYYY년 MM월 DD일');
    const date3plus1 = moment(salesStart_date)
      .add(salesDays, 'days')
      .add(1, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    // console.log(today);
    // console.log(date3plus1);
    // console.log(client_name, fitness_no, kind);
    const paidControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 차감됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 - 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };

    const paidControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate(client_name, kind, res[0].paidMembership2 + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '이용권이 증가됩니다. 잔여 이용권은' +
                    (res[0].paidMembership2 + 1) +
                    '회 입니다.'
                );
              }
            );
          }
        });
      });
    };
    //salesControl 비활성화
    const salesControl = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays + 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 증가됩니다. D - ' +
                    (res[0].salesDays + 1)
                );
              }
            );
          }
        });
      });
    };

    const salesControl2 = () => {
      selectTrainerReservation(joinNo ? joinNo : '').then((trainerResult) => {
        const fitness =
          loginWhether === 1 ? trainerResult[0].fitness_no : fitness_no;
        voucherSelect2(client_name, fitness, kind).then((res) => {
          // console.log(res);
          if (res.length === 0) {
            alert(kind + '이용권이 없습니다.');
          } else {
            voucherUpdate2(client_name, kind, res[0].salesDays - 1).then(
              (res2) => {
                vocherView();
                alert(
                  client_name +
                    '님의 ' +
                    kind +
                    '기간권이 차감됩니다. D - ' +
                    (res[0].salesDays - 1)
                );
              }
            );
          }
        });
      });
    };

    return (
      //paidMembership: 이용권, salesDays: 기간권
      //기간권 이용권 보다 보기좋게 구분
      <div>
        {date3plus1 <= today ? (
          ''
        ) : paidMembership ? (
          paidMembership2 === 0 ? (
            ''
          ) : (
            <p>
              <Button onClick={paidControl}>-이용권 차감</Button>
              <Button onClick={paidControl2}>+이용권 증가</Button>
              <h4>{kind}</h4>
              이용권: {paidMembership2}/{paidMembership}
              <br />
              이용권 결제일: {date1}
            </p>
          )
        ) : (
          <p>
            {/* <Button onClick={salesControl}>+기간권 기간 증가</Button>
            <Button onClick={salesControl2}>-기간권 기간 차감</Button> */}
            --------------기간권-------------------
            <h4>{kind}</h4>
            기간권: {salesDays}일 권
            <br />
            남은기간: D {endDays}
            <br />
            기간권 결제일: {date2}
            <br />
            기간권 마감일: {date3}
          </p>
        )}
      </div>
    );
  };

  const vocherView = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher(items);
    });
  };

  const VoucherView2 = ({
    kind,
    paidMembership,
    paidMembership2,
    paymentDate,
    salesDays,
    salesStart_date,
  }) => {
    const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
    const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
    const date3 = moment(salesStart_date)
      .add(salesDays, 'days')
      .subtract(1, 'days')
      .format('YYYY년 MM월 DD일');
    const date4 = moment(salesStart_date).add(salesDays, 'days');
    const endDays =
      moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');

    return (
      //paidMembership: 이용권, salesDays: 기간권
      <div>
        {/* paidMembership= true면 이용권 아니면 기간권 */}
        {paidMembership ? (
          <p>
            <h4>{kind}</h4>
            이용권: {paidMembership2}/{paidMembership}
            <br />
            이용권 결제일: {date1}
          </p>
        ) : (
          <p>
            <h4>{kind}</h4>
            기간권: {salesDays}일 권
            <br />
            남은기간: D {endDays}
            <br />
            기간권 결제일: {date2}
            <br />
            기간권 마감일: {date3}
          </p>
        )}
      </div>
    );
  };

  const vocherView2 = () => {
    voucherSelect(client_name, fitness_no).then((res) => {
      // console.log(res);
      const items = res.map((data, index, array) => {
        return (
          <VoucherView2
            kind={data.kind}
            paidMembership={data.paidMembership}
            paidMembership2={data.paidMembership2}
            paymentDate={data.paymentDate}
            salesDays={data.salesDays}
            salesStart_date={data.salesStart_date}
            salesEnd_date={data.salesEnd_date}
          />
        );
      });
      setVoucher2(items);
    });
  };

  return (
    <TableRow>
      <TableCell onClick={modalOnClick}>{client_name}</TableCell>
      <TableCell onClick={modalOnClick}>{phone}</TableCell>
      <TableCell onClick={modalOnClick}>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell onClick={modalOnClick}>{newDate}</TableCell>
      {/* <TableCell>
        <button onClick={modalOnClick}>수정</button>
      </TableCell> */}
      <Modal
        className='client_modal'
        show={showModal}
        onHide={modalClose}
        size='xl'
      >
        <Modal.Header>
          <Modal.Title>회원 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mw-100'>
          <div>
            <CustomerCalendarComponent customer_no={idc} />
          </div>
          <Row className='mt-3 client__modal--information'>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>이름</h5>
              {showUpdate ? (
                <Form.Control
                  value={client_name_input}
                  onChange={updateChange1}
                />
              ) : (
                <p>{client_name}</p>
              )}
            </Col>
            <h3>현재 사용중인 이용권</h3>
            <div>{voucher}</div>
            <Button onClick={viewModalOnclick}>이용권&기간권 더보기</Button>
            {/* 이용권&기간권 더보기 Modal */}
            <Modal
              className='client_modal'
              show={viewModal}
              onHide={viewModalClose}
            >
              <Modal.Header>
                <Modal.Title>이용권&기간권 더보기</Modal.Title>
              </Modal.Header>
              <Modal.Body className='mw-100'>{voucher2}</Modal.Body>
            </Modal>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>생년월일</h5>
              <p>{birth}</p>
            </Col>
            <Col xs={12} md={8} className='mb-2'>
              <h5 className='mb-1'>주소</h5>
              {showUpdate ? (
                <Form.Control value={address_input} onChange={updateChange2} />
              ) : (
                <p>{address}</p>
              )}
            </Col>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>연락처</h5>
              {showUpdate ? (
                <Form.Control value={phone_input} onChange={updateChange3} />
              ) : (
                <p>{phone}</p>
              )}
            </Col>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>가입경로</h5>
              <p>{join_route}</p>
            </Col>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>사물함번호</h5>
              {showUpdate ? (
                <Form.Control
                  type='number'
                  value={locker_input}
                  onChange={updateChange4}
                />
              ) : (
                <p>{lockerNumber}</p>
              )}
            </Col>
            <Col xs={6} md={4} className='mb-2'>
              <h5 className='mb-1'>운동복사용여부</h5>
              {showUpdate ? (
                <Form.Group>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route1' className='w-100'>
                      미사용
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      checked={wear_input === '미사용'}
                      onChange={() => setWear_input('미사용')}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route1' className='w-100'>
                      사용
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      checked={wear_input === '사용'}
                      onChange={() => setWear_input('사용')}
                    />
                  </Form.Check>
                </Form.Group>
              ) : (
                <p>{sportswear}</p>
              )}
            </Col>

            <Col className='text-center mt-4'>
              {showUpdate ? (
                loginWhether === 1 ? (
                  ''
                ) : (
                  <div>
                    <Button
                      variant='outline-danger'
                      onClick={() =>
                        // eslint-disable-next-line no-restricted-globals
                        confirm(
                          client_name +
                            ' 회원을 탈퇴하시겠습니까? \n회원 삭제 시 되돌릴 수 없습니다. \n한번 더 확인해주세요.'
                        ) == true
                          ? deleteCompleted(idc)
                          : alert(client_name + '회원 탈퇴를 취소 하였습니다.')
                      }
                    >
                      회원삭제
                    </Button>
                    <p className='text-danger fs-6 fw-lighter fst-italic'>
                      회원 삭제시 되돌릴 수 없습니다.
                      <br /> 한번 더 확인해주세요.
                    </p>
                  </div>
                )
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {showUpdate ? (
            <Button onClick={() => updateCompleted(idc)} variant='success'>
              완료하기
            </Button>
          ) : (
            <Button onClick={modalUpdate} variant='primary'>
              정보 수정
            </Button>
          )}
          {showUpdate ? (
            <Button onClick={modalClose} variant='outline-light'>
              닫기
            </Button>
          ) : (
            <Button onClick={modalClose} variant='secondary'>
              닫기
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </TableRow>
  );
};

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = { viewClientList: [], rowsPerPage: 5, page: 0 };
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
        this.viewClient();
      }
    });
  }
  viewClient = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      clientSelect(fitness_no).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ViewClientItem
              joinNo={this.props.userinfo.joinNo}
              fitness_no={data.fitness_no}
              client_name={data.client_name}
              phone={data.phone}
              birth={data.birth}
              sex={data.sex}
              join_route={data.join_route}
              address={data.address}
              start_date={data.start_date}
              lockerNumber={data.lockerNumber}
              sportswear={data.sportswear}
              idc={data.idc}
              viewClient={this.viewClient}
              loginWhether={this.props.userinfo.loginWhether}
            />
          );
        });
        this.setState({ viewClientList: items });
      });
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.viewClientList);
    return (
      <div className='wrap client_wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
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
                <Link to='/client'>고객</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <TableContainer component={Paper}>
            <Table className='table--block' aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>회원이름</TableCell>
                  <TableCell>연락처</TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>가입일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.viewClientList.length === 0
                  ? ''
                  : this.state.viewClientList.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
              </TableBody>
            </Table>
            {this.state.viewClientList.length === 0 ? (
              <div className='p-3 fs-5 fw-bold text-center'>
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
                  value: this.state.viewClientList.length,
                },
              ]}
              count={this.state.viewClientList.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}
const ClientStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ClientDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(ClientStateToProps, ClientDispatchToProps)(Client);
