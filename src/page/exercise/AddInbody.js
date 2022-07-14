import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';

import { getStatusRequest } from '../../action/authentication';

import '../../styles/customer/AddCustomer.css';
import '../../styles/exercise/AddInbody.css';

import { SERVER_URL } from '../../const/settings';
import {
  selectClientReservation,
  selectTrainerReservation,
} from '../../api/user';

import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

class AddInbody extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-restricted-globals
    const search = location.pathname;
    //alert(search+'   '+search.split('/')[3])

    //alert(this.props.location.state.inbody_no)
    let inbody_no1 = '';
    if (this.props.location.state.inbody_no == null) {
      inbody_no1 = 0;
    } else {
      inbody_no1 = Number(this.props.location.state.inbody_no);
    }

    this.state = {
      fitness_no: '',
      //member_no: search.split('/')[3] ,
      member_no: Number(this.props.location.state.member_no),
      inbody_no: inbody_no1,
      height: '', //키
      measurementDate: new Date(), // 측정날짜
      //체성분 분석
      bodyMoisture: '', //체수분
      protein: '', //단백질
      mineral: '', //무기질
      bodyFat: '', //체지방
      muscleMass: '', //근육량
      bodyFatMass1: '', //체지방량1
      weight: '', //체중
      //골격근,지방
      skeletalMuscleMass: '', //골격근량
      bodyFatMass2: '', //체지방량2
      //비만진단
      bmi: '', //BMI
      percentBodyFat: '', //체지방률
      sex: '',
      age: 0,
      name: '',
      customerList: [],
      birth: '',

      height_err: false,
      bodyMoisture_err: false,
      protein_err: false,
      minerals_err: false,
      bodyFat_err: false,
      muscleMass_err: false,
      bodyFatMass1_err: false,
      weight_err: false,
      skeletalMuscleMass_err: false,
      bodyFatMass2_err: false,
      bmi_err: false,
      percentBodyFat_err: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.cusFetch();
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

  cusFetch = () => {
    if (this.state.member_no == 0) {
      alert('선택된 회원이 없습니다. 회원을 선택 해주세요.');
      this.props.history.push('/inbodies');
      // this.props.history.push({
      //   pathname: '/assign/inbody',
      //   state: { member_no: 0, a: true },
      // });
    }
    selectClientReservation(this.state.member_no).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        fetch(
          ip +
            '/client?type=select&idc=' +
            this.state.member_no +
            '&fitness_no=' +
            fitness_no,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((res) => {
            this.setState({
              customerList: res,
            });

            this.state.customerList.map((c) => {
              let s = c.sex == 1 ? '남' : '여';
              this.setState({
                name: c.client_name,
                sex: s,
                phone: c.phone,
                birth: c.birth,
              });
            });
          });
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleDateChange(date) {
    this.setState({
      measurementDate: date,
    });
  }

  handleOnClick = (e) => {
    //alert('여기')
    this.setState({
      height_err: false,
      bodyMoisture_err: false,
      protein_err: false,
      minerals_err: false,
      bodyFat_err: false,
      muscleMass_err: false,
      bodyFatMass1_err: false,
      weight_err: false,
      skeletalMuscleMass_err: false,
      bodyFatMass2_err: false,
      bmi_err: false,
      percentBodyFat_err: false,
      inbody_no: this.state.inbody_no + 1,
    });

    if (this.state.height === '') {
      this.setState({ height_err: true });
    }
    if (this.state.bodyMoisture === '') {
      this.setState({ bodyMoisture_err: true });
    }
    if (this.state.protein === '') {
      this.setState({ protein_err: true });
    }
    if (this.state.minerals === '') {
      this.setState({ minerals_err: true });
    }
    if (this.state.bodyFat === '') {
      this.setState({ bodyFat_err: true });
    }
    if (this.state.muscleMass === '') {
      this.setState({ muscleMass_err: true });
    }
    if (this.state.bodyFatMass1 === '') {
      this.setState({ bodyFatMass1_err: true });
    }
    if (this.state.weight === '') {
      this.setState({ weight_err: true });
    }
    if (this.state.skeletalMuscleMass === '') {
      this.setState({ skeletalMuscleMass_err: true });
    }
    if (this.state.bodyFatMass2 === '') {
      this.setState({ bodyFatMass2_err: true });
    }
    if (this.state.bmi === '') {
      this.setState({ bmi_err: true });
    }
    if (this.state.percentBodyFat === '') {
      this.setState({ percentBodyFat_err: true });
    }

    if (
      this.state.height === '' ||
      this.state.bodyMoisture === 0 ||
      this.state.protein === '' ||
      this.state.minerals === '' ||
      this.state.bodyFat === '' ||
      this.state.muscleMass === 0 ||
      this.state.bodyFatMass1 === '' ||
      this.state.weight === '' ||
      this.state.skeletalMuscleMass === '' ||
      this.state.bodyFatMass2 === 0 ||
      this.state.bmi === '' ||
      this.state.percentBodyFat === ''
    ) {
      alert('빈칸을 채워주세요.');
    } else {
      selectClientReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((clientResult) => {
        selectTrainerReservation(
          this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
        ).then((trainerResult) => {
          const fitness_no =
            this.props.userinfo.loginWhether === 2
              ? clientResult[0].fitness_no
              : this.props.userinfo.loginWhether === 1
              ? trainerResult[0].fitness_no
              : this.props.userinfo.fitness_no;
          fetch(ip + '/inbody', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              fitness_no: fitness_no,
              member_no: this.state.member_no,
              //inbody_no:in_no,
              inbody_no: this.state.inbody_no + 1,
              height: this.state.height, //키
              measurementDate: this.state.measurementDate, // 측정날짜
              //체성분 분석
              bodyMoisture: this.state.bodyMoisture, //체수분
              protein: this.state.protein, //단백질
              mineral: this.state.mineral, //무기질
              bodyFat: this.state.bodyFat, //체지방
              muscleMass: this.state.muscleMass, //근육량
              bodyFatMass1: this.state.bodyFatMass1, //체지방량1
              weight: this.state.weight, //체중
              //골격근,지방
              skeletalMuscleMass: this.state.skeletalMuscleMass, //골격근량
              bodyFatMass2: this.state.bodyFatMass2, //체지방량2
              //비만진단
              bmi: this.state.bmi, //BMI
              PercentBodyFat: this.state.percentBodyFat, //체지방률
            }),
          })
            .then((response) => response.json())
            .then((response) => {
              alert('인바디 등록되었습니다.');
              // this.props.history.push({
              //   //pathname: "/assign/inbody?member_no="+this.state.member_no
              //   pathname: '/assign/inbody',
              //   state: { member_no: this.state.member_no },
              // });
              this.props.history.push('/inbodies');
            });
        });
      });
    }
  };

  render() {
    const { userinfo } = this.props;
    // console.log('userinfo : ');
    // console.log(userinfo);
    // console.log('member_no=idc', this.state.member_no);

    return (
      <div className='wrap addInbody'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                인바디 입력
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>인바디 정보</Link>
                <span>&#62;</span>
                <Link to='#'>인바디 입력</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        {/* <label>번호 : {this.state.member_no}</label>  */}
        <Container>
          <Row className=''>
            <Col xs={12}>
              <h3>회원 정보</h3>
            </Col>
            <Col sm={12} md={4}>
              <h5>이름</h5>
              <p>{this.state.name}</p>
            </Col>
            <Col sm={12} md={4}>
              <h5>생년월일</h5>
              <p>{this.state.birth}</p>
            </Col>
            <Col sm={12} md={4}>
              <h5>성별</h5>
              <p>{this.state.sex}</p>
            </Col>
          </Row>
          <Form className='mt-5'>
            <Row>
              <Col xs={12}>
                <h3>인바디 정보 입력</h3>
              </Col>
              <Col xs={12} sm={3}>
                <Form.Group>
                  <Form.Label className='w-100'>검사날짜</Form.Label>
                  <DatePicker
                    selected={this.state.measurementDate}
                    onChange={this.handleDateChange}
                    name='measurementDate'
                    dateFormat='yyyy년MM월dd일'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={3}>
                <Form.Group>
                  <Form.Label>키</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.height}
                    onChange={this.handleChange}
                    type='number'
                    id='height'
                    error={this.state.height_err}
                    required
                    autoFocus
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <h5 className='mt-3'>체성분 분석</h5>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>체수분</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.bodyMoisture}
                    onChange={this.handleChange}
                    type='number'
                    id='bodyMoisture'
                    error={this.state.bodyMoisture_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>단백질</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.protein}
                    onChange={this.handleChange}
                    type='number'
                    id='protein'
                    error={this.state.protein_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>무기질</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.mineral}
                    onChange={this.handleChange}
                    type='number'
                    id='mineral'
                    error={this.state.mineral_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>체지방</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.bodyFat}
                    onChange={this.handleChange}
                    type='number'
                    id='bodyFat'
                    error={this.state.bodyFat_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>근육량</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.muscleMass}
                    onChange={this.handleChange}
                    type='number'
                    id='muscleMass'
                    error={this.state.muscleMass_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>체지방량</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.bodyFatMass1}
                    onChange={this.handleChange}
                    type='number'
                    id='bodyFatMass1'
                    error={this.state.bodyFatMass1_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Label>체중</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.weight}
                    onChange={this.handleChange}
                    type='number'
                    id='weight'
                    error={this.state.weight_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <h5 className='mt-3'>골격근, 지방</h5>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label>골격근량</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.skeletalMuscleMass}
                    onChange={this.handleChange}
                    type='number'
                    id='skeletalMuscleMass'
                    error={this.state.skeletalMuscleMass_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label>체지방량</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.bodyFatMass2}
                    onChange={this.handleChange}
                    type='number'
                    id='bodyFatMass2'
                    error={this.state.bodyFatMass2_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col className='mt-3' xs={12}>
                <h5>비만진단</h5>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label>BMI</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.bmi}
                    onChange={this.handleChange}
                    type='number'
                    id='bmi'
                    error={this.state.bmi_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Form.Group>
                  <Form.Label>체지방률</Form.Label>
                  <Form.Control
                    variant='outlined'
                    value={this.state.percentBodyFat}
                    onChange={this.handleChange}
                    type='number'
                    id='percentBodyFat'
                    error={this.state.percentBodyFat_err}
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} className='mt-5 text-center'>
                <Button className='w-100' onClick={this.handleOnClick}>
                  등록하기
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
        {/*.footer */}
      </div> /*.addInbody */
    );
  }
}

const InbodyStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddInbodyDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(InbodyStateToProps, AddInbodyDispatchToProps)(AddInbody);
