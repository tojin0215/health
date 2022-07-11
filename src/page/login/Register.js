import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import NumberFormat from 'react-number-format';

import TextField from '@mui/material/TextField';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';
import '../../styles/login/Register.css';

import { Container, Row, Col, Modal, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { registerManager } from '../../api/user';

const ip = SERVER_URL;
// const ip = 'localhost:3000';

const IdCheck = RegExp(/^[A-Za-z0-9\-]{3,20}$/);

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      fitness_name: '',
      password: '',
      password_confirm: '',
      manager_name: '',
      phone: '',
      business_number: '',
      business_phone: '',

      id_err: false,
      fitness_name_err: false,
      password_err: false,
      password_confirm_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number_err: false,
      business_phone_err: false,

      check: 0,
      modalShow: false,
      agreeCheck: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  idCheck = () => {
    //alert(this.state.id)
    if (this.state.id === '') {
      alert('아이디를 입력해주세요.');
    } else {
      let url = ip + '/manager?type=idCheck&id=' + this.state.id;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          console.log(response.length);
          if (response.length == 0) {
            if (IdCheck.test(this.state.id)) {
              alert('사용 가능합니다.');
              this.setState({
                check: 1,
              });
            } else {
              alert('아이디는 3~20자 이내의 영문, 숫자만 가능합니다. ');
            }
          } else {
            alert('존재하는 아이디입니다. 다시 입력해주세요.');
            this.setState({
              check: 0,
              id: '',
            });
          }
        });
    }
  };

  handleOnClick = (e) => {
    this.setState({
      id_err: false,
      fitness_name_err: false,
      password_err: false,
      password_confirm_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number_err: false,
      business_phone_err: false,
    });

    if (this.state.id === '') {
      this.setState({ id_err: true });
    } else if (this.state.fitness_name === '') {
      this.setState({ fitness_name_err: true });
    } else if (this.state.password === '') {
      this.setState({ password_err: true });
    } else if (this.state.password_confirm === '') {
      this.setState({ password_confirmm_err: true });
    } else if (this.state.manager_name === '') {
      this.setState({ manager_name_err: true });
    } else if (this.state.phone === '') {
      this.setState({ phone_err: true });
    } else if (this.state.business_number === '') {
      this.setState({ business_number_err: true });
    } else if (this.state.business_phone === '') {
      this.setState({ business_phone_err: true });
    }

    if (
      this.state.id === '' ||
      this.state.fitness_name === '' ||
      this.state.password === '' ||
      this.state.password_confirm === '' ||
      this.state.manager_name === '' ||
      this.state.phone === '' ||
      this.state.business_number === '' ||
      this.state.business_phone === ''
    ) {
      alert('빈칸을 채워주세요.');
    } else if (this.state.password != this.state.password_confirm) {
      alert('비밀번호가 다릅니다. 다시 입력해주세요.');
    } else if (this.state.check == 0) {
      alert('아이디 중복체크 해주세요.');
    } else {
      // 서버 연결하는 부분
      registerManager(
        this.state.id,
        this.state.fitness_name,
        this.state.password,
        this.state.manager_name,
        this.state.phone,
        this.state.business_number,
        this.state.business_phone
      ).then((response) => {
        alert('가입되었습니다.');
        this.setState({
          open: false,
          id: '',
          fitness_name: '',
          password: '',
          manager_name: '',
          phone: '',
          business_number_err: '',
          business_phone_err: '',
        });
        this.props.history.push('/');
      });
    }
  };
  handleModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  agreeCheckModal = () => {
    this.setState({
      agreeCheck: true,
      modalShow: false,
    });
  };
  render() {
    const { userinfo } = this.props;
    // console.log("userinfo : ");
    // console.log(userinfo);
    console.log(this.state.agreeCheck);
    return (
      <div className='wrap loginWrap register'>
        {/* <div className='header d-none'>
					<Header />
					<Navigation />
				</div> */}
        <div className='localNavigation'>
          <div className='container'>
            <h2>
              <div className='parallelogram'></div>
              회원가입
              <span>.</span>
            </h2>
          </div>
        </div>
        <Container>
          <Form className='AddSalesForm productPay sectionGlass'>
            {/* <div className='registerId'> */}
            <div
              className='resigterVisual'
              style={{ backgroundImage: 'src/img/resiVisual.jpeg' }}
            ></div>
            <h3>사업장 회원가입</h3>
            <p className='text-secondary'>
              강사, 회원은 센터에서 직접 등록할 수 있습니다. 해당 센터로
              문의해주세요.
            </p>
            <Row xs={1} md={2} className='mt-4 g-3'>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>아이디</Form.Label>
                  <Form.Control
                    value={this.state.id}
                    onChange={this.handleChange}
                    id='id'
                    label='아이디'
                    error={this.state.id_err}
                    required
                    autoFocus
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={2} className='align-self-end'>
                {this.state.check == 0 ? (
                  <Button className='mt-2 w-100' onClick={this.idCheck}>
                    중복확인
                  </Button>
                ) : (
                  <>
                    <span className='register__form--id-check-ok text-success'>
                      사용 가능한 아이디입니다.
                    </span>
                    <Button
                      variant='outline-success'
                      className='mt-2 w-100'
                      onClick={this.idCheck}
                    >
                      중복확인
                    </Button>
                  </>
                )}
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>사업자 등록번호</Form.Label>
                  <Form.Control
                    value={this.state.business_number}
                    onChange={this.handleChange}
                    id='business_number'
                    label='사업자 등록번호'
                    error={this.state.business_number_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    value={this.state.password}
                    onChange={this.handleChange}
                    type='password'
                    id='password'
                    label='비밀번호'
                    error={this.state.password_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>비밀번호확인</Form.Label>
                  <Form.Control
                    value={this.state.password_confirm}
                    onChange={this.handleChange}
                    type='password'
                    id='password_confirm'
                    label='비밀번호확인'
                    error={this.state.password_confirm_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>사업장 이름</Form.Label>
                  <Form.Control
                    value={this.state.fitness_name}
                    onChange={this.handleChange}
                    id='fitness_name'
                    label='사업장이름'
                    error={this.state.fitness_name_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>사업장 연락처(-제외)</Form.Label>
                  <Form.Control
                    value={this.state.business_phone}
                    onChange={this.handleChange}
                    id='business_phone'
                    label='사업장 연락처(-제외)'
                    error={this.state.business_phone_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>대표 이름</Form.Label>
                  <Form.Control
                    value={this.state.manager_name}
                    onChange={this.handleChange}
                    id='manager_name'
                    label='대표 이름'
                    error={this.state.manager_name_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>대표 연락처(-제외)</Form.Label>
                  <Form.Control
                    type='number'
                    value={this.state.phone}
                    onChange={this.handleChange}
                    id='phone'
                    label='대표 연락처(-제외)'
                    error={this.state.phone_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={12} className='text-center mt-4'>
                {this.state.agreeCheck ? (
                  <>
                    <p className='pb-2 text-success fw-bold'>
                      필수 약관에 동의했습니다.
                    </p>
                    <Button
                      className='w-100'
                      variant='outline-success'
                      onClick={this.handleModal}
                    >
                      약관 확인
                    </Button>
                  </>
                ) : (
                  <>
                    <p className='pb-2'>
                      필수 약관에 동의하여야 가입이 가능합니다.
                    </p>
                    <Button
                      className='w-100'
                      variant='primary'
                      onClick={this.handleModal}
                    >
                      약관 확인
                    </Button>
                  </>
                )}
                <Modal show={this.state.modalShow}>
                  <Modal.Header
                    closeButton
                    onClick={() => this.setState({ modalShow: false })}
                  >
                    <Modal.Title>divvy 서비스 약관</Modal.Title>
                  </Modal.Header>
                  <Card>
                    <Card.Body>
                      <Card.Title>서비스 이용 약관</Card.Title>
                      <Card.Text>
                        해당 사항은 서비스 이용 약관입니다. divvy 서비스 이용에
                        대해서 필요한 약관 사항에 대해서 이곳에 기입되어,
                        이용자들이 가입하기 전에 해당 약관 사항을 보고 동의또는
                        비동의하게 되는 내용입니다.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body>
                      <Card.Title>마케팅 이용 동의</Card.Title>
                      <Card.Text>
                        해당 사항은 마케팅 이용 동의 약관입니다. 고객의 정보를
                        마케팅에 이용함에 있어 고지해야할 사항들이 이곳에
                        기입되어, 이용자들이 가입하기 전에 해당 약관 사항을 보고
                        동의 또는 비동의 하게 되는 내용입니다.
                      </Card.Text>
                    </Card.Body>
                    <Button onClick={this.agreeCheckModal}>
                      약관에 동의합니다.
                    </Button>
                  </Card>
                </Modal>
              </Col>
              <Col md={12} className='text-center mt-2'>
                {this.state.agreeCheck ? (
                  <Button className='w-100' onClick={this.handleOnClick}>
                    등록하기
                  </Button>
                ) : (
                  <div>
                    <Button variant='secondary' className='w-100' disabled>
                      등록하기
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Form>
          {/*.AddSalesForm productPay */}
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const RegisterStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    //status: state.authentication.status
  };
};

// const RegisterDispatchToProps = (dispatch) => {
//     return {
//         getStatusRequest: () => {
//             return dispatch(getStatusRequest());
//         },
//     };
// };

export default connect(RegisterStateToProps, null)(Register);
