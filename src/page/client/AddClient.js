import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Footer from '../../component/footer/Footer';
import { getStatusRequest } from '../../action/authentication';
import {
  clientManager,
  clientSelect,
  insertClient,
  phoneCheckClient,
} from '../../api/user';

// Bootstrap
import { Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
// MUI
import TextField from '@mui/material/TextField';
const pCheck = RegExp(/^\d{11}$/);
const pCheck2 = RegExp(/^\d{8}$/);
class AddClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '',
      phone: '',
      birth: '',
      sex: '',
      join_route: '',
      address: '',
      radioGroup: {
        male: true,
        female: false,
      },
      radioGroup2: {
        route1: true,
        route2: false,
        route3: false,
        route4: false,
        route5: false,
        route6: false,
      },
      lockerNumber: '',
      radioGroup3: {
        sportswear1: true,
        sportswear2: false,
      },
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
  handleClient = () => {
    if (this.state.client_name === '') {
      alert('이름을 입력해주새요.');
    } else if (this.state.phone === '') {
      alert('연락처를 입력해주세요.');
    } else if (!pCheck.test(this.state.phone)) {
      alert('연락처는 11자리 번호만, 특수문자 사용불가(-포함)');
    } else if (this.state.birth === '') {
      alert('생년월일을 입력해주세요.');
    } else if (!pCheck2.test(this.state.birth)) {
      alert(
        '생년월일은 8자리 번호만, 특수문자 사용불가(-포함), 비밀번호는 월일입니다.'
      );
    } else if (this.state.address === '') {
      alert('주소를 입력해주세요.');
    } else {
      phoneCheckClient(this.props.userinfo.fitness_no, this.state.phone).then(
        (res) => {
          // console.log(res);
          if (res.length === 0) {
            insertClient(
              this.props.userinfo.fitness_no,
              this.state.client_name,
              this.state.phone,
              this.state.birth,
              this.state.radioGroup.male ? 1 : 2,
              this.state.radioGroup2.route1
                ? '간판'
                : this.state.radioGroup2.route2
                ? '홈페이지'
                : this.state.radioGroup2.route3
                ? '전단지'
                : this.state.radioGroup2.route4
                ? '지인소개'
                : this.state.radioGroup2.route5
                ? 'SNS'
                : this.state.radioGroup2.route6
                ? this.state.join_route
                : '간판',
              this.state.address,
              this.state.lockerNumber,
              this.state.radioGroup3.sportswear1
                ? '미사용'
                : this.state.radioGroup3.sportswear2
                ? '사용'
                : '미사용'
            ).then((res) => {
              // console.log(res);
              // alert('client Table');
              clientSelect(this.props.userinfo.fitness_no).then((result) => {
                const items = result.filter(
                  (value) => value.client_name === this.state.client_name
                );
                console.log(items[0].idc);
                this.setState(items);
                clientManager(
                  this.state.phone,
                  this.props.userinfo.fitness_name,
                  this.state.birth.slice(4),
                  //생년월일 중 월일 4자리만 입력
                  this.state.client_name,
                  items[0].idc
                ).then((res) => {});
                // confirm(
                //   this.state.client_name +
                //     '님이 가입되었습니다. 바로 매출등록하시겠습니까?'
                // ) == true
                //   ? this.AddSalesPush()
                //   : alert('매출 등록을 안했습니다.'),
                this.props.history.push('/addSales');
              });
            });
          } else {
            alert('중복된 회원 정보가 있습니다.');
            this.setState({
              phone: '',
              birth: '',
              client_name: '',
              address: '',
              join_route: '',
            });
          }
        }
      );
    }
  };

  // AddSalesPush = () => {
  //   this.props.history.push({
  //     pathname: '/addSales',
  //     state: {
  //       client_name: this.state.client_name,
  //     },
  //   });
  // };

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

  handleRouteRadio = (r) => {
    let obj = {
      route1: false,
      route2: false,
      route3: false,
      route4: false,
      route5: false,
      route6: false,
    };
    obj[r.target.id] = r.target.checked;
    this.setState({
      radioGroup2: obj,
    });
  };

  handleWearRadio = (w) => {
    let obj = {
      sportswear1: false,
      sportswear2: false,
    };
    obj[w.target.id] = w.target.checked;
    this.setState({
      radioGroup3: obj,
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    // console.log(this.state.client_name);
    // console.log(this.state.birth.slice(4));
    return (
      <div className='wrap'>
        {' '}
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                신규회원 등록
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/client'>회원 관리</Link>
                <span>&#62;</span>
                <Link to='/clientAdd'>신규 회원 등록</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <Form>
            <Row className='sectionGlass'>
              <h3 className='mb-4'>회원 정보 입력</h3>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    id='client_name'
                    type='text'
                    placeholder='이름'
                    value={this.state.client_name}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>핸드폰번호</Form.Label>
                  <Form.Control
                    id='phone'
                    type='text'
                    pattern='[0-9]+'
                    placeholder='01000000000'
                    value={this.state.phone}
                    onChange={this.handleChange}
                    variant='outlined'
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>생년월일</Form.Label>
                  <Form.Control
                    id='birth'
                    type='text'
                    pattern='[0-9]+'
                    placeholder='19990101'
                    value={this.state.birth}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md={1}>
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
                <Form.Group className=''>
                  <Form.Label className='w-100'>가입경로</Form.Label>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route1' className='w-100'>
                      간판
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route1'
                      checked={this.state.radioGroup2['route1']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route2' className='w-100'>
                      홈페이지
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route2'
                      checked={this.state.radioGroup2['route2']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route3' className='w-100'>
                      전단지
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route3'
                      checked={this.state.radioGroup2['route3']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route4' className='w-100'>
                      지인소개
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route4'
                      checked={this.state.radioGroup2['route4']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route5' className='w-100'>
                      SNS
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route5'
                      checked={this.state.radioGroup2['route5']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check inline className='me-1'>
                    <Form.Check.Label htmlFor='route6' className='w-100'>
                      기타
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup2'
                      id='route6'
                      checked={this.state.radioGroup2['route6']}
                      onChange={this.handleRouteRadio}
                    />
                  </Form.Check>
                  <Form.Check
                    inline
                    className='p-0 add-client__form__route-text'
                  >
                    <Form.Control
                      placeholder='기타 경로인 경우 입력'
                      id='join_route'
                      type='text'
                      value={this.state.join_route}
                      onChange={this.handleChange}
                    ></Form.Control>
                  </Form.Check>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    id='address'
                    type='text'
                    placeholder='OO시 OO구 OO로 000, 000'
                    value={this.state.address}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>사물함번호</Form.Label>
                  <Form.Control
                    id='lockerNumber'
                    type='number'
                    value={this.state.lockerNumber}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>운동복</Form.Label>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route1' className='w-100'>
                      미사용
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup3'
                      id='sportswear1'
                      checked={this.state.radioGroup3['sportswear1']}
                      onChange={this.handleWearRadio}
                    />
                  </Form.Check>
                  <Form.Check inline>
                    <Form.Check.Label htmlFor='route1' className='w-100'>
                      사용
                    </Form.Check.Label>
                    <Form.Check.Input
                      type='radio'
                      name='radioGroup3'
                      id='sportswear2'
                      checked={this.state.radioGroup3['sportswear2']}
                      onChange={this.handleWearRadio}
                    />
                  </Form.Check>
                </Form.Group>
              </Col>
              <Col xs={12} className='mt-4 text-center'>
                <Button
                  className='w-100'
                  type='button'
                  onClick={this.handleClient}
                >
                  등록하기
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}
const AddclientStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddclientDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};
export default connect(
  AddclientStateToProps,
  AddclientDispatchToProps
)(AddClient);
