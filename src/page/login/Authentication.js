import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Container, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import FormCheck from 'react-bootstrap/FormCheck';
import Image from 'react-bootstrap/Image';

import '../../styles/login/Authentication.css';
import { Translate } from '@mui/icons-material';

class Authentication extends Component {
  state = {
    id: '',
    password: '',
    radioGroup: {
      fitness: true,
      trainer: false,
      customer: false,
    },
  };

  handleChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  handleRegister = () => {
    let id = this.state.id;
    let pw = this.state.password;

    this.props.onRegister(id, pw).then((result) => {
      if (!result) {
        this.setState({
          id: '',
          password: '',
        });
      }
    });
  };

  handleLogin = () => {
    let id = this.state.id;
    let pw = this.state.password;

    this.props.onLogin(id, pw).then((success) => {
      if (!success) {
        this.setState({
          password: '',
        });
      }
    });
  };

  handleKeyPress = (e) => {
    if (e.charCode == 13) {
      if (this.props.mode) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    }
  };
  handleRadio = (rad) => {
    let obj = {
      fitness: false,
      trainer: false,
      customer: false,
    };
    obj[rad.target.id] = rad.target.checked;
    // console.log(obj);
    this.setState({
      radioGroup: obj,
    });
  };

  render() {
    // console.log(this.state.radioGroup['fitness']);
    //강사, 회원은 사업주가 승인하여야만 회원가입이 가능합니다.
    // const inputBoxes = (
    //   <div>
    //     <Form key='loginGroup'>
    //       <Form.Check
    //         inline
    //         type='radio'
    //         id='fitness'
    //         name='radioGroup'
    //         checked={this.state.radioGroup['fitness']}
    //         label='사업주'
    //         onClick={this.handleRadio}
    //       />
    //       <Form.Check
    //         inline
    //         type='radio'
    //         id='trainer'
    //         name='radioGroup'
    //         checked={this.state.radioGroup['trainer']}
    //         label='강사'
    //         onClick={this.handleRadio}
    //       />
    //       <Form.Check
    //         inline
    //         type='radio'
    //         id='customer'
    //         name='radioGroup'
    //         checked={this.state.radioGroup['customer']}
    //         label='회원'
    //         onClick={this.handleRadio}
    //       />
    //     </Form>
    //   </div>
    // );
    const loginBox = (
      <div>
        <Form.Group className='mb-3' controlId='formBasicId'>
          <Form.Control
            name='id'
            type='text'
            className='validate'
            placeholder='아이디'
            onChange={this.handleChange}
            value={this.state.id}
          />
          <Form.Text className='text-muted'></Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Control
            name='password'
            type='password'
            className='validate'
            onChange={this.handleChange}
            value={this.state.password}
            onKeyPress={this.handleKeyPress}
            placeholder='비밀번호'
          />
        </Form.Group>
      </div>
    );
    const trainerLoginBox = (
      <div>
        <Form.Group className='mb-3' controlId='formBasicId'>
          <Form.Label>핸드폰번호</Form.Label>
          <Form.Control
            name='id'
            type='text'
            className='validate'
            placeholder='Enter phone number'
            onChange={this.handleChange}
            value={this.state.id}
          />
          <Form.Text className='text-muted'></Form.Text>
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>생년월일</Form.Label>
          <Form.Control
            name='password'
            type='password'
            className='validate'
            onChange={this.handleChange}
            value={this.state.password}
            onKeyPress={this.handleKeyPress}
            placeholder='birth'
          />
        </Form.Group>
      </div>
    );
    const loginView = (
      <Card className='text-center'>
        <Card.Body>
          {/* {inputBoxes} */}
          {loginBox}
          <Row xs={1}>
            <Col>
              <Button
                onClick={this.handleLogin}
                variant='primary'
                className='w-100 px-5'
              >
                로그인
              </Button>
            </Col>
            <Col className='mt-2'>
              <Button
                href='/register'
                variant='outline-light fw-bold'
                className='w-100 px-5 border-0'
              >
                회원가입
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
    const loginViewTrainer = (
      <Card className='text-center'>
        <Card.Body>
          {/* {inputBoxes} */}
          {trainerLoginBox}
          <Button onClick={this.handleLogin} className='' variant='primary'>
            LOGIN
          </Button>
          <br />
          강사는 센터에서 등록가능합니다.
        </Card.Body>
      </Card>
    );
    const loginViewCustomer = (
      <Card className='text-center'>
        <Card.Body>
          {/* {inputBoxes} */}
          {trainerLoginBox}
          <Button onClick={this.handleLogin} className='' variant='primary'>
            LOGIN
          </Button>
          <br />
          회원은 센터에서 등록가능합니다.
        </Card.Body>
      </Card>
    );

    // const registerView = (
    //     <div className="card-content">
    //         <div className="row">
    //             {inputBoxes}
    //             <a className="waves-effect waves-light btn"
    //               onClick={this.handleRegister}>회원가입</a>
    //         </div>
    //     </div>
    // );

    return (
      <Card>
        {/* <Card.Header></Card.Header> */}
        <Card.Body className='py-5 text-center'>
          <h1 className='fw-bolder text-primary'>
            <Image
              src={process.env.PUBLIC_URL + '/assets/divvy_yello.png'}
              // src={process.env.PUBLIC_URL + '/assets/divvy_yello.svg'}
              className='text-center login_logo p-0'
            />
          </h1>
          {this.state.radioGroup['fitness'] ? (
            <div>{this.props.mode ? loginView : ''}</div>
          ) : (
            ''
          )}
          {this.state.radioGroup['trainer'] ? (
            <div>{this.props.mode ? loginViewTrainer : ''}</div>
          ) : (
            ''
          )}
          {this.state.radioGroup['customer'] ? (
            <div>{this.props.mode ? loginViewCustomer : ''}</div>
          ) : (
            ''
          )}
        </Card.Body>
        {/* <Card.Footer></Card.Footer> */}
      </Card>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onRegister: PropTypes.func,
  onLogin: PropTypes.func,
};

Authentication.defaultProps = {
  mode: true,
  onRegister: (id, pw) => {
    console.error('register function is not defined');
  },
  onLogin: (id, pw) => {
    console.error('login function not defined');
  },
};

export default Authentication;
