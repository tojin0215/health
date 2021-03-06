import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { SERVER_URL } from '../../const/settings';
import Menu from '../../component/navigation/Menu';

// Bootstrap
import { Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// MUI
import TextField from '@mui/material/TextField';

import { insertTrainer, selectTrainer, trainerManager } from '../../api/user';

class AddTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitness_no: this.props.userinfo.fitness_no,
      phone: '',
      birth: '',
      trainer_name: '',
      ment: '',
      history: '',
      sex: '',
      radioGroup: {
        male: true,
        female: false,
      },
      joinNo: '',
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
      }
    });
  }
  handleTrainer = () => {
    if (this.state.trainer_name === '') {
      alert('이름을 입력해주세요.');
    } else if (this.state.phone === '') {
      alert('연락처를 입력해주세요.');
    } else if (this.state.birth === '') {
      alert('생년월일을 입력해주세요.');
    } else if (this.state.ment === '') {
      alert('이력 정보를 입력해주세요.');
    } else if (this.state.history === '') {
      alert('자기 소개 내용을 입력해주세요.');
    } else {
      insertTrainer(
        this.state.phone,
        this.state.birth,
        this.state.trainer_name,
        this.props.userinfo.fitness_no,
        this.state.ment,
        this.state.history,
        this.state.radioGroup.male ? 1 : 2
      ).then((res) => {
        // console.log(res);
        // alert('trainer Table');
        selectTrainer(this.props.userinfo.fitness_no).then((result) => {
          const items = result.filter(
            (value) => value.trainer_name === this.state.trainer_name
          );
          this.setState(items);
          trainerManager(
            this.state.phone,
            this.props.userinfo.fitness_name,
            this.state.birth,
            this.state.trainer_name,
            items[0].idx
          ).then((res) => {
            // console.log(res);
          });
          alert(this.state.trainer_name + '님이 강사로 등록되었습니다.');
          this.props.history.push('/trainer');
        });
      });
    }
  };
  // handleManagerLogin = () => {
  //   trainerManager(
  //     this.state.phone,
  //     this.state.birth,
  //     this.state.trainer_name,
  //     this.state.joinNo
  //   ).then((res) => {
  //     // console.log(res);
  //     alert('manager Table');
  //   });
  // };
  // handleTotal = () => {
  //   this.handleTrainer();
  //   this.handleManagerLogin();
  //   this.props.history.push('/trainer');
  // };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleRadio = (s) => {
    let obj = {
      male: false,
      female: false,
    };
    obj[s.target.id] = s.target.checked;
    this.setState({
      radioGroup: obj,
    });
  };
  render() {
    // console.log(this.state.fitness_no);
    return (
      <div className='wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                강사등록
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
        <Container className='sectionGlass'>
          <h3>강사 정보 입력</h3>
          <Form>
            {/* <label>
              헬스장 번호:
              <TextField value={this.props.userinfo.fitness_no} />
            </label> */}
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    id='trainer_name'
                    type='text'
                    value={this.state.trainer_name}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>핸드폰번호</Form.Label>
                  <Form.Control
                    type='number'
                    variant='outlined'
                    value={this.state.phone}
                    id='phone'
                    placeholder='01012345678'
                    onChange={this.handleChange}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={8} md={3}>
                <Form.Group>
                  <Form.Label>생년월일</Form.Label>
                  <Form.Control
                    type='number'
                    value={this.state.birth}
                    id='birth'
                    placeholder='19990101'
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={1}>
                <Form.Group>
                  <Form.Label>성별</Form.Label>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup'
                      id='male'
                      checked={this.state.radioGroup['male']}
                      onChange={this.handleRadio}
                    />
                    <Form.Check.Label htmlFor='male' className='w-100'>
                      남
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup'
                      id='female'
                      checked={this.state.radioGroup['female']}
                      onChange={this.handleRadio}
                    />
                    <Form.Check.Label htmlFor='female' className='w-100'>
                      여
                    </Form.Check.Label>
                  </Form.Check>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>이력</Form.Label>
                  <Form.Control
                    type='text'
                    value={this.state.history}
                    id='history'
                    onChange={this.handleChange}
                    as='textarea'
                    rows={5}
                  ></Form.Control>
                  <img />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>자기소개</Form.Label>
                  <Form.Control
                    type='text'
                    value={this.state.ment}
                    id='ment'
                    onChange={this.handleChange}
                    as='textarea'
                    rows={5}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button
              className='w-100 mt-3'
              type='button'
              onClick={this.handleTrainer}
            >
              등록하기
            </Button>
          </Form>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}
const AddTrainerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddTrainerDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  AddTrainerStateToProps,
  AddTrainerDispatchToProps
)(AddTrainer);
