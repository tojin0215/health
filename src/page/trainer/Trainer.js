import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';

import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';

import { Container, Row, Col, Button } from 'react-bootstrap';
// BootStrap Modal
import Modal from 'react-bootstrap/Modal';

// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import 'react-dropdown/style.css';

import MegaMenu from '../../component/navigation/Menu';
import { deleteTrainer, selectTrainer, updateTrainer } from '../../api/user';

const VieWTrainerItem = ({
  fitness_no,
  trainer_name,
  phone,
  birth,
  ment,
  history,
  sex,
  viewTrainer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [trainer_name_input, setTrainer_name_input] = useState('');
  const [ment_input, setMent_input] = useState('');
  const [history_input, setHistory_input] = useState('');

  const modalClose = () => {
    setShowModal(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    setTrainer_name_input(trainer_name);
    setMent_input(ment);
    setHistory_input(history);
  };
  const updateChange1 = (e) => {
    setTrainer_name_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setMent_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setHistory_input(e.target.value);
  };

  const updateCompleted = (phone, fitness_no) => {
    updateTrainer(
      phone,
      fitness_no,
      trainer_name_input,
      ment_input,
      history_input
    ).then(() => {
      alert('수정완료');
      modalClose();
      viewTrainer();
    });
  };
  const deleteCompleted = (phone, fitness_no) => {
    deleteTrainer(phone, fitness_no).then(() => {
      alert('삭제완료');
      modalClose();
      viewTrainer();
    });
  };
  // console.log(showModal);
  return (
    <TableRow>
      <TableCell>{trainer_name}</TableCell>
      <TableCell>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell>{phone}</TableCell>
      <TableCell>{birth}</TableCell>
      <TableCell>{history}</TableCell>
      <TableCell>{ment}</TableCell>
      <TableCell onClick={modalOnClick}>
        <Button className='' variant='outline-secondary' size='sm'>
          수정하기
        </Button>
      </TableCell>
      <Modal show={showModal} onHide={modalClose}>
        <Modal.Header>
          <Modal.Title>강사 정보 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row xs={1}>
            <Col>폰번호:{phone}(변경불가)</Col>
            <Col>성별:{sex == 1 ? '남' : '여'}(변경불가)</Col>
            <Col>
              이름:
              <input
                value={trainer_name_input}
                id='trainer_name'
                onChange={updateChange1}
              />
            </Col>
            <Col>
              자기소개:
              <input value={ment_input} id='ment' onChange={updateChange3} />
            </Col>
            <Col>
              연혁:
              <input
                value={history_input}
                id='history'
                onChange={updateChange4}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className='w-100'>
            <Col className='pe-1' xs={8}>
              <Button
                className='w-100'
                onClick={() => updateCompleted(phone, fitness_no)}
              >
                수정하기
              </Button>
            </Col>
            <Col className='ps-1' xs={4}>
              <Button
                className='w-100'
                onClick={() => deleteCompleted(phone, fitness_no)}
                variant='outline-danger'
              >
                제거하기
              </Button>
            </Col>
            <Col className='mt-2'>
              <Button
                className='w-100'
                onClick={modalClose}
                variant='outline-secondary'
              >
                닫기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </TableRow>
  );
};

class Trainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTrainerList: [],
      trainer_name: '',
      phone: '',
      birth: '',
      ment: '',
      history: '',
      sex: '',
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
        this.viewTrainer();
      }
    });
  }

  viewTrainer = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    selectTrainer(fitness_no).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <VieWTrainerItem
            fitness_no={data.fitness_no}
            trainer_name={data.trainer_name}
            phone={data.phone}
            birth={data.birth}
            ment={data.ment}
            history={data.history}
            sex={data.sex}
            viewTrainer={this.viewTrainer}
          />
        );
      });
      this.setState({ viewTrainerList: items });
    });
  };

  render() {
    console.log(this.props.userinfo.fitness_no);
    console.log(this.state.viewTrainerList[0]);
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
                강사관리
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/trainer'>강사</Link>
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
                  <TableCell>이름</TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>연락처</TableCell>
                  <TableCell>생년월일</TableCell>
                  <TableCell>연혁</TableCell>
                  <TableCell>자기소개</TableCell>
                  <TableCell>수정하기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.state.viewTrainerList}</TableBody>
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
const TrainerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const TrainerDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(TrainerStateToProps, TrainerDispatchToProps)(Trainer);
