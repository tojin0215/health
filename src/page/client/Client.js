import { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import Footer from '../../component/footer/Footer';
import { clientSelect, deleteClient, updateClient } from '../../api/user';
import moment from 'moment';

// Bootstrap
import { Container, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomerCalendarComponent from '../../component/customer/CustomerCalendarComponent';

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
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [client_name_input, setClient_name_input] = useState('');
  const [address_input, setAddress_input] = useState('');

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
  };

  const deleteCompleted = (phone, fitness_no) => {
    deleteClient(phone, fitness_no).then(() => {
      alert('삭제완료');
      modalClose();
      viewClient();
    });
  };

  const updateCompleted = (phone, fitness_no) => {
    updateClient(phone, fitness_no, client_name_input, address_input).then(
      () => {
        alert('수정완료');
        modalClose();
        setShowUpdate(false);
        viewClient();
      }
    );
  };
  const updateChange1 = (e) => {
    setClient_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setAddress_input(e.target.value);
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
      <Modal show={showModal} onHide={modalClose}>
        <Modal.Header>
          <Modal.Title>회원 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row></Row>
          <CustomerCalendarComponent customer_no={idc} />
          이름(변경불가):{' '}
          {showUpdate ? (
            <input value={client_name_input} onChange={updateChange1} />
          ) : (
            client_name
          )}
          주소:{' '}
          {showUpdate ? (
            <input value={address_input} onChange={updateChange2} />
          ) : (
            address
          )}
          생년월일(변경불가): {birth}
          가입경로(변경불가): {join_route}
        </Modal.Body>
        <Modal.Footer>
          {showUpdate ? (
            <button onClick={() => updateCompleted(phone, fitness_no)}>
              회원 정보 수정2
            </button>
          ) : (
            <button onClick={modalUpdate}>회원 정보 수정1</button>
          )}

          <button onClick={() => deleteCompleted(phone, fitness_no)}>
            회원삭제
          </button>
          <button onClick={modalClose}>닫기</button>
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
    const fitness_no = this.props.userinfo.fitness_no;
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
          />
        );
      });
      this.setState({ viewClientList: items });
    });
  };
  render() {
    // console.log(this.props.userinfo.fitness_no);
    console.log(this.state.viewClientList);
    return (
      <div>
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
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>회원이름</TableCell>
                  <TableCell>폰번호</TableCell>
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
