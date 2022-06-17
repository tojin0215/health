import { Component, useState } from 'react';
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

const ViewClientItem = ({
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
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

  const modalClose = () => {
    setShowModal(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
  };
  const modalUpdate = () => {
    setShowUpdate(true);
    setClient_name_input(client_name);
    setAddress_input(address);
    setPhone_input(phone);
  };

  const deleteCompleted = (idc) => {
    deleteClient(idc).then(() => {
      alert(client_name + '님 회원탈퇴');
      modalClose();
      viewClient();
    });
  };

  const updateCompleted = (idc) => {
    if (client_name_input === '') {
      alert('!!!');
    } else if (phone_input === '') {
      alert('!!!');
    } else if (address_input === '') {
      alert('!!!');
    } else {
      updateClient(idc, client_name_input, phone_input, address_input).then(
        () => {
          updateManagerClientTrainer(idc, client_name_input, phone_input).then(
            () => {}
          );
          alert(client_name_input + '님 수정이 완료되었습니다.');
          modalClose();
          setShowUpdate(false);
          viewClient();
        }
      );
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
          <Row>
            <Col xs={8}>
              <CustomerCalendarComponent customer_no={idc} />
            </Col>
            <Col xs={4}>
              <Col className='mb-2'>
                <h5 className='mb-1'>이름</h5>
              </Col>
              <Col className='mb-2'>
                {showUpdate ? (
                  <Form.Control
                    value={client_name_input}
                    onChange={updateChange1}
                  />
                ) : (
                  <p>{client_name}</p>
                )}
              </Col>
              <Col className='mb-2'>
                <h5 className='mb-1'>주소</h5>
                {showUpdate ? (
                  <Form.Control
                    value={address_input}
                    onChange={updateChange2}
                  />
                ) : (
                  <p>{address}</p>
                )}
              </Col>
              <Col className='mb-2'>
                <h5 className='mb-1'>연락처</h5>
                {showUpdate ? (
                  <Form.Control value={phone_input} onChange={updateChange3} />
                ) : (
                  <p>{phone}</p>
                )}
              </Col>
              <Col className='mb-2'>
                <h5 className='mb-1'>생년월일</h5>
                <p>{birth}</p>
              </Col>
              <Col className='mb-2'>
                <h5 className='mb-1'>가입경로</h5>
                <p>{join_route}</p>
              </Col>
              <Col className='text-center mt-4'>
                {showUpdate ? (
                  loginWhether === 1 ? (
                    ''
                  ) : (
                    <div>
                      <Button
                        variant='danger'
                        onClick={() =>
                          // eslint-disable-next-line no-restricted-globals
                          confirm(client_name + '회원을 탈퇴시겠습니까??') ==
                          true
                            ? deleteCompleted(idc)
                            : alert(
                                client_name + '회원 탈퇴를 취소 하였습니다.'
                              )
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
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {showUpdate ? (
            <Button onClick={() => updateCompleted(idc)}>수정 완료</Button>
          ) : (
            <Button onClick={modalUpdate} variant='outline-primary'>
              정보 수정
            </Button>
          )}
          {showUpdate ? (
            <Button onClick={modalClose} variant='outline-secondary'>
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
    this.state = { viewClientList: [] };
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
              fitness_no={data.fitness_no}
              client_name={data.client_name}
              phone={data.phone}
              birth={data.birth}
              sex={data.sex}
              join_route={data.join_route}
              address={data.address}
              start_date={data.start_date}
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
  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.viewClientList);
    return (
      <div className='client_wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
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
              <TableBody>{this.state.viewClientList}</TableBody>
            </Table>
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
