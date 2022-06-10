import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';

import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';

// react-responsive
import { useMediaQuery } from 'react-responsive';
// Bootstrap
import { Container, Row, Col, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// MUI 테이블
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import 'react-dropdown/style.css';

import MegaMenu from '../../component/navigation/Menu';
import {
  deleteTrainer,
  selectTrainer,
  updateManagerClientTrainer,
  updateTrainer,
} from '../../api/user';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};
const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

const VieWTrainerItem = ({
  idx,
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
  const [phone_input, setPhone_input] = useState('');
  const [ment_input, setMent_input] = useState('');
  const [history_input, setHistory_input] = useState('');

  const modalClose = () => {
    setShowModal(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    setTrainer_name_input(trainer_name);
    setPhone_input(phone);
    setMent_input(ment);
    setHistory_input(history);
  };
  const updateChange1 = (e) => {
    setTrainer_name_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setPhone_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setMent_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setHistory_input(e.target.value);
  };

  const updateCompleted = (idx) => {
    if (trainer_name_input === '') {
      alert('안됨');
    } else if (phone_input === '') {
      alert('안됨2');
    } else if (ment_input === '') {
      alert('안됨');
    } else if (history_input === '') {
      alert('안됨');
    } else {
      updateTrainer(
        idx,
        trainer_name_input,
        phone_input,
        ment_input,
        history_input
      ).then(() => {
        updateManagerClientTrainer(idx, trainer_name_input, phone_input).then(
          () => {}
        );
        alert('수정완료');
        modalClose();
        viewTrainer();
      });
    }
  };
  const deleteCompleted = (idx) => {
    deleteTrainer(idx).then(() => {
      alert('삭제완료');
      modalClose();
      viewTrainer();
    });
  };
  // console.log(showModal);
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
        className='trainer_table_row'
      >
        <Default>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </Default>
        <TableCell>{trainer_name}</TableCell>
        <TableCell>{sex == 1 ? '남' : '여'}</TableCell>
        <TableCell>{phone}</TableCell>
        <TableCell>{birth}</TableCell>
        <Mobile>
          <TableCell>{history}</TableCell>
          <TableCell>{ment}</TableCell>
        </Mobile>
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
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='disabledTextInput'>이름</Form.Label>
                  <Form.Control
                    id='trainer_name'
                    value={trainer_name_input}
                    onChange={updateChange1}
                  />
                </Form.Group>
              </Col>
              <Col xs={10}>
                <Form.Group className='mb-3'>
                  <Form.Label>생년월일</Form.Label>
                  <Form.Control value={birth} disabled />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Form.Group className='mb-3'>
                  <Form.Label>성별</Form.Label>
                  <Form.Control value={sex == 1 ? '남' : '여'} disabled />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='disabledTextInput'>연락처</Form.Label>
                  <Form.Control
                    type='number'
                    id='disabledTextInput'
                    value={phone_input}
                    onChange={updateChange2}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='TextInput'>이력</Form.Label>
                  <Form.Control
                    id='history'
                    onChange={updateChange4}
                    as='textarea'
                    rows={5}
                    value={history_input}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='TextInput'>자기소개</Form.Label>
                  <Form.Control
                    id='ment'
                    onChange={updateChange3}
                    as='textarea'
                    rows={6}
                    value={ment_input}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row className='w-100'>
              <Col className='p-0' xs={8}>
                <Button className='w-100' onClick={() => updateCompleted(idx)}>
                  수정하기
                </Button>
              </Col>
              <Col className='p-0 ps-2' xs={4}>
                <Button
                  className='w-100'
                  onClick={() => deleteCompleted(idx)}
                  variant='outline-danger'
                >
                  제거하기
                </Button>
              </Col>
              <Col className='mt-2 p-0'>
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
      <Default>
        <TableRow className='trainer_table_collapse'>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant='h6' gutterBottom component='div'>
                  강사 소개
                </Typography>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '40%' }}>이력</TableCell>
                      <TableCell>자기소개</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component='th' scope='row'>
                        {history}
                      </TableCell>
                      <TableCell>{ment}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Default>
    </React.Fragment>
  );
};

class Trainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTrainerList: [],
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
            idx={data.idx}
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
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.state.viewTrainerList[0]);
    return (
      <div className='trainer_wrap'>
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
          <h3>강사 목록</h3>
          <TableContainer component={Paper}>
            <Table aria-label='simple table' className='table--block'>
              <TableHead>
                <TableRow>
                  <Default>
                    <TableCell></TableCell>
                  </Default>
                  <TableCell>이름</TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>연락처</TableCell>
                  <TableCell>생년월일</TableCell>
                  <Mobile>
                    <TableCell>이력</TableCell>
                    <TableCell>자기소개</TableCell>
                  </Mobile>
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
