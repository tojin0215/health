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

// 아이콘
import { SiCheckmarx } from 'react-icons/si';

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
          // console.log(response);
          // console.log(response.length);
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
      console.log('id_err');
      this.setState({ id_err: true });
    } else if (this.state.fitness_name === '') {
      console.log('fitness_name_err');
      this.setState({ fitness_name_err: true });
    } else if (this.state.password === '') {
      console.log('password_err');
      this.setState({ password_err: true });
    } else if (this.state.password_confirm === '') {
      console.log('password_confirmm_err');
      this.setState({ password_confirmm_err: true });
    } else if (this.state.manager_name === '') {
      console.log('manager_name_err');
      this.setState({ manager_name_err: true });
    } else if (this.state.phone === '') {
      console.log('phone_err');
      this.setState({ phone_err: true });
    } else if (this.state.business_number === '') {
      console.log('business_number_err');
      this.setState({ business_number_err: true });
    } else if (this.state.business_phone === '') {
      console.log('business_phone_err');
      this.setState({ business_phone_err: true });
    }

    if (this.state.id === '') {
      alert('아이디를 입력해주세요.');
    } else if (!this.state.fitness_name) {
      alert('사업장 이름을 입력해주세요.');
    } else if (!this.state.password) {
      alert('비밀번호를 입력해주세요.');
    } else if (!this.state.password_confirm) {
      alert('비밀번호 확인을 입력해주세요.');
    } else if (!this.state.manager_name) {
      alert('대표님 이름을 입력해주세요.');
    } else if (!this.state.phone) {
      alert('대표님 연락처를 입력해주세요.');
    } else if (!this.state.business_number) {
      alert('사업자 등록 번호를 입력해주세요.');
    } else if (!this.state.business_phone) {
      alert('사업장 연락처를 입력해주세요.');
    } else if (this.state.password != this.state.password_confirm) {
      alert('비밀번호가 다릅니다. 다시 입력해주세요.');
    } else if (this.state.business_number.length !== 12) {
      alert('사업장 등록번호를 하이픈(-) 포함하여 12자리 입력해주세요.');
    } else if (
      !(
        this.state.business_phone.length == 10 ||
        this.state.business_phone.length == 11 ||
        this.state.business_phone.length == 8
      )
    ) {
      alert('올바른 사업장 연락처를 입력해주세요.');
    } else if (
      !(
        this.state.phone.length == 10 ||
        this.state.phone.length == 11 ||
        this.state.phone.length == 8
      )
    ) {
      alert('올바른 대표 연락처를 입력해주세요.');
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

  goLogin = () => {
    this.props.history.push('/');
  };

  handleOnInput = (el, maxlength) => {
    if (el.value.length > maxlength) {
      el.value = el.value.substr(0, maxlength);
    }
  };

  render() {
    const { userinfo } = this.props;
    // console.log("userinfo : ");
    // console.log(userinfo);
    // console.log(this.state.agreeCheck);
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
            <p className='resigter_des'>
              강사, 회원은 센터에서 직접 등록할 수 있습니다. 가입하려는 센터로
              문의해주세요.
            </p>
            <Row xs={1} md={2} className='mt-4 g-3'>
              <Col xs={8} md={4}>
                <Form.Group>
                  <Form.Label>아이디</Form.Label>
                  <Form.Control
                    value={this.state.id}
                    onChange={this.handleChange}
                    id='id'
                    label='아이디'
                    placeholder='아이디를 입력해주세요.'
                    error={this.state.id_err}
                    required
                    autoFocus
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={2} className='align-self-end'>
                {this.state.check == 0 ? (
                  <Button className='w-100' onClick={this.idCheck}>
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
                    placeholder='사업자 등록번호를 입력해주세요. 하이픈(-) 포함'
                    label='사업자 등록번호'
                    error={this.state.business_number_err}
                    // type='number'
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
                    placeholder='비밀번호를 입력해주세요.'
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
                    placeholder='비밀번호를 한번더 입력해주세요.'
                    label='비밀번호확인'
                    error={this.state.password_confirm_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>사업장 명</Form.Label>
                  <Form.Control
                    value={this.state.fitness_name}
                    onChange={this.handleChange}
                    id='fitness_name'
                    placeholder='사업장 명을 입력해주세요.'
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
                    placeholder='사업장 연락처를 입력해주세요.(-제외)'
                    error={this.state.business_phone_err}
                    type='number'
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
                    placeholder='대표자 이름을 입력해주세요.'
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
                    placeholder='대표 연락처를 입력해주세요.'
                    label='대표 연락처(-제외)'
                    error={this.state.phone_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={12} className='register__terms'>
                <div className='form-check'>
                  <div className='form-check-label'>
                    {this.state.agreeCheck ? (
                      <>
                        <SiCheckmarx className='form-check-input--success' />
                        <span className='text-success fw-bold'>
                          필수 약관에 동의했습니다.
                          <br />
                          <span className='register__terms__guide'>
                            이용 약관을 확인해주세요.
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value=''
                          id='flexCheckDefault'
                          onClick={this.agreeCheckModal}
                        />
                        <span onClick={this.handleModal}>
                          필수 약관에 동의합니다.
                          <br />
                          <span className='register__terms__guide'>
                            이용 약관에 동의하여야 가입할 수 있습니다.
                          </span>
                        </span>
                      </>
                    )}
                    <div>
                      <a
                        className='register__terms__btn'
                        onClick={this.handleModal}
                      >
                        이용 약관
                      </a>
                    </div>
                  </div>
                  <Modal show={this.state.modalShow} centered>
                    <Modal.Header>
                      <Modal.Title>divvy 서비스 약관</Modal.Title>
                    </Modal.Header>
                    <Card>
                      <Card.Body>
                        <Card.Title>서비스 이용 약관</Card.Title>
                        <Card.Text>
                          <strong>여러분을 환영합니다.</strong>
                          <p>
                            Divvy 서비스&#40;이하 &#39;서비스&#39;&#41;를 이용해
                            주셔서 감사합니다. 본 약관은 서비스의 이용과 관련된
                            정보를 포함하고 있습니다.
                          </p>
                          <p>
                            Divvy 서비스를 이용하시거나 가입하실 경우 여러분은
                            본 약관 및 관련 운영 정책을 확인하거나 동의하게
                            되므로, 잠시 시간을 내시어 주의깊게 살펴봐 주시기
                            바랍니다.
                          </p>
                          <br />
                          <strong>다양한 Divvy 서비스를 이용해보세요.</strong>
                          <p>
                            Divvy 서비스는 사업주, 강사, 회원을 위한 서비스로
                            나뉘어져 있습니다. 센터 관리, 강사와 회원 관리,
                            결제, 매출 관리를 할 수 있습니다. 센터에서 할 수
                            있는 운동 목록을 만들어, 센터의 회원에게 운동 목록을
                            직접 만들어 배정해 줄 수 있습니다. 해당 회원은
                            배정받은 운동을 통해 운동을 하고 완료한 운동을
                            체크할 수 있습니다. 강사는 센터에서 운영하는 수업을
                            만들어 회원들이 직접 수업을 예약할 수 있도록 하여,
                            센터의 모든 수업을 관리할 수 있습니다.
                          </p>
                          <br />
                          <strong>
                            여러분의 개인정보를 소중히 보호합니다.
                          </strong>
                          <p>
                            서비스의 원활한 제공을 위하여 회원이 동의한 목적과
                            범위 내에서만 개인정보를 수집.이용하며, 개인정보
                            보호 법력에 따라 안전하게 관리합니다.
                          </p>
                          <p>
                            Divvy는 여러분이 서비스를 이용하기 위해 일정 기간
                            동안 로그인 혹은 접속한 기록이 없는 경우, 적절한
                            전자적 수단을 통해 사전에 안내해 드린 후 여러분의
                            정보를 파기하거나 분리 보관할 수 있으며, 만약 이로
                            인해 서비스 제공을 위해 필수적인 정보가 부족해질
                            경우 부득이 관련 서비스 이용계약을 해지할 수
                            있습니다.
                          </p>
                          <br />
                          <strong>
                            Divvy 서비스 이용과 관련하여 몇 가지 주의사항이
                            있습니다.
                          </strong>
                          <p>
                            Divvy는 여러분이 서비스를 자유롭고 편리하게 이용할
                            수 있도록 최선을 다하고 있습니다. 다만, 여러분이
                            Divvy 서비스를 보다 안전하게 이용하고 Divvy
                            서비스에서 여러분과 타인의 권리가 서로 존중되고
                            보호받으려면 여러분의 도움과 협조가 필요합니다.
                            여러분의 안전한 서비스 이용과 권리 보호를 위해
                            부득이 아래와 같은 경우 여러분의 서비스 이용이
                            제한될 수 있으므로, 이에 대한 확인 및 준수를 요청
                            드립니다.
                          </p>
                          <br />
                          <ul>
                            <li>
                              ﹒회원 가입 시 이름, 생년월일, 휴대전화번호 등의
                              정보를 허위로 기재해서는 안 됩니다. 계정에 등록된
                              정보는 항상 정확한 최신 정보가 유지될 수 있도록
                              관리해 주세요. 자신의 계정을 다른 사람에게 판매,
                              양도, 대여 또는 담보로 제공하거나 다른 사람에게 그
                              사용을 허락해서는 안 됩니다. 아울러 자신의 계정이
                              아닌 타인의 계정을 무단으로 사용해서는 안 됩니다.
                            </li>
                            <li>
                              ﹒자동화된 수단을 활용하는 등 Divvy 서비스의
                              기능을 비정상적으로 이용하여 다른 이용자들의
                              정상적인 Divvy 서비스 이용에 불편을 초래하고 더
                              나아가 Divvy의 원활한 서비스 제공을 방해하므로
                              역시 제한될 수 있습니다.
                            </li>
                            <li>
                              ﹒Divvy의 사전 허락 없이 자동화된 수단&#40;예:
                              매크로 프로그램, 로봇&#40;봇&#41;, 스파이더,
                              스크래퍼 등&#41;을 이용하여 Divvy 서비스 회원으로
                              가입을 시도 또는 가입하거나, DIvvy 서비스에
                              로그인을 시도 또는 로그인하거나, Divvy 서비스를
                              이용하거나, Divvy 서비스의 회원의 아이디, 정보
                              등을 수집하거나, 이용자&#40;사람&#41;의 실제
                              이용을 전제로 하는 Divvy 서비스의 제공 취지에
                              부합하지 않는 방식으로 Divvy 서비스를 이용하거나
                              이와 같은 Divvy 서비스에 대한 어뷰징&#40;남용&#41;
                              행위를 막기 위한 Divvy의 기술적 조치를
                              무력화하려는 일체의 행위&#40;예: IP를 지속적으로
                              바꿔가며 접속하는 행위, Captcha를 외부 솔루션 등을
                              통해 우회하거나 무력화 하는 행위 등&#41;를
                              시도해서는 안 됩니다.
                            </li>
                            <li>
                              ﹒Divvy의 동의 없이 자동화된 수단에 의해 Divvy
                              서비스 상에 광고가 게재되는 영역 또는 그 밖의
                              영역에 부호, 문자, 음성, 음향, 그림, 사진, 동영상,
                              링크 등으로 구성된 각종 콘텐츠 자체 또는 파일을
                              삽입해서는 안 됩니다. 또한, Divvy 서비스 또는 이에
                              포함된 소프트웨어를 복사, 수정할 수 없으며, 이를
                              판매, 양도, 대여 또는 담보로 제공하거나 타인에게
                              그 이용을 허락해서는 안 됩니다. Divvy 서비스에
                              포함된 소프트웨어를 역 설계, 소스코드 추출 시도,
                              복제, 분해, 모방, 기타 변형하는 등의 행위도
                              금지됩니다&#40;다만, 오픈소스에 해당되는 경우 그
                              자체 조건에 따릅니다&#41;. 그 밖에 바이러스나 기타
                              악성 코드를 업로드하거나 Divvy 서비스의 원활한
                              운영을 방해할 목적으로 서비스 기능을 비정상적으로
                              이용하는 행위 역시 금지됩니다.
                            </li>
                          </ul>
                          <br />
                          <strong>
                            부득이 서비스 이용을 제한할 경우 합리적인 절차를
                            준수합니다.
                          </strong>
                          <p>
                            여러분의 컨텐츠가 관련 법령, 본 약관, 게시물
                            운영정책, 각 개별 서비스의 운영정책 등에 위배되는
                            경우, 부득이 이를 비공개 또는 삭제 처리하거나 거부할
                            수 있습니다. 다만, 이것이 모든 컨텐츠를 검토할
                            의무가 있다는 것을 의미하지는 않습니다.
                          </p>
                          <p>
                            또한 여러분이 관련 법령, 본 약관, 계정 및 운영 정책
                            등을 준수하지 않을 경우, Divvy는 여러분의 관련 행위
                            내용을 확인할 수 있으며, 그 확인 결과에 따라 Divvy
                            서비스 이용에 대한 주의를 당부하거나, Divvy 서비스
                            이용을 일부 또는 전부, 일시 또는 영구히 정지시키는
                            등 그 이용을 제한할 수 있습니다. 한편, 이러한 이용
                            제한에도 불구하고 더 이상 Divvy 서비스 이용계약의
                            온전한 유지를 기대하기 어려운 경우엔 부득이
                            여러분과의 이용계약을 해지할 수 있습니다.
                          </p>
                          <p>
                            부득이 여러분의 서비스 이용을 제한해야 할 경우
                            명백한 법령 위반이나 타인의 권리침해로서 긴급한 위험
                            또는 피해 차단이 요구되는 사안 외에는 위와 같은
                            단계적 서비스 이용제한 원칙을 준수 하겠습니다.
                            명백한 법령 위반 등을 이유로 부득이 서비스 이용을
                            즉시 영구 정지시키는 경우 서비스 이용을 통해 획득한
                            기타 혜택 등은 모두 소멸되고 이에 대해 별도로
                            보상하지 않으므로 유의해 주시기 바랍니다.
                          </p>
                          <ul>
                            <li>﹒공지 일자: 2022년 12월 1일</li>
                            <li>﹒적용 일자: 2022년 2월 1일</li>
                          </ul>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title>개인정보 이용 동의</Card.Title>
                        <Card.Text>
                          <ul>
                            <li>
                              <li>
                                ﹒개인정보 수집 항목: 이름, 휴대폰번호, 사업자
                                등록번호, 사업장 이름, 사업장 연락처
                              </li>
                              <li>
                                ﹒개인정보 수집 이용 목적: 서비스의 원활한 이용,
                                서비스 관련 정보 전송
                              </li>
                              <li>﹒이용자의 탈퇴시까지 보유.이용</li>
                            </li>
                          </ul>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <div
                      className='register__terms__modal-button'
                      onClick={this.agreeCheckModal}
                    >
                      <Button>확인</Button>
                    </div>
                  </Modal>
                </div>
              </Col>
            </Row>
          </Form>
          <div className='d-flex justify-content-center mt-3'>
            <Button className='btn-secondary mx-2' onClick={this.goLogin}>
              이전으로
            </Button>
            {this.state.agreeCheck ? (
              <Button
                type='button'
                className='btn-primary mx-2'
                onClick={this.handleOnClick}
              >
                등록하기
              </Button>
            ) : (
              <div>
                <Button variant='primary' className='btn-primary mx-2' disabled>
                  등록하기
                </Button>
              </div>
            )}
          </div>
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
