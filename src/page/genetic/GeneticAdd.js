import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  clientSetname,
  geneticDestroy,
  geneticInsert,
  geneticSelect,
  genticUpdate,
  selectClientReservation,
  selectTrainerReservation,
} from '../../api/user';
import Header from '../../component/header/Header';
import MobNavigation from '../../component/navigation/MobNavigation';
import Navigation from '../../component/navigation/Navigation';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import moment from 'moment';
import DatePicker from 'react-datepicker';

// icons
import CircleIcon from '@mui/icons-material/Circle';

class GeneticAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idc: this.props.location.state.idc,
      well: this.props.location.state.well,
      name: '',
      sex: '',
      phone: '',
      birth: '',
      measurementDate: new Date(),
      bmi1: '',
      bmi2: '',
      bmi3: '',
      cholesterol1: '',
      cholesterol2: '',
      cholesterol3: '',
      triglyceride1: '',
      triglyceride2: '',
      triglyceride3: '',
      hypertension1: '',
      hypertension2: '',
      hypertension3: '',
      bloodsugar1: '',
      bloodsugar2: '',
      bloodsugar3: '',
      pigmentation1: '',
      pigmentation2: '',
      pigmentation3: '',
      skinfold1: '',
      skinfold2: '',
      skinfold3: '',
      dermis1: '',
      dermis2: '',
      dermis3: '',
      hairthick1: '',
      hairthick2: '',
      hairthick3: '',
      nohair1: '',
      nohair2: '',
      nohair3: '',
      vitaminc1: '',
      vitaminc2: '',
      vitaminc3: '',
      caffeine1: '',
      caffeine2: '',
      caffeine3: '',
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.geneticView = this.geneticView.bind(this);
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
        this.client_name();
        this.geneticView();
      }
    });
  }

  client_name = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        clientSetname(this.state.idc, fitness).then((res) => {
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

  //genetic select
  geneticView = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        geneticSelect(fitness, this.state.idc).then((result) => {
          // console.log(result);
          this.setState({
            genetic: result,
            idg: result[0].idg,
            member_no: result[0].member_no,
            measurementDate: new Date(result[0].measurementDate),
            bmi1: result[0].bmi1,
            bmi2: result[0].bmi2,
            bmi3: result[0].bmi3,
            cholesterol1: result[0].cholesterol1,
            cholesterol2: result[0].cholesterol2,
            cholesterol3: result[0].cholesterol3,
            triglyceride1: result[0].triglyceride1,
            triglyceride2: result[0].triglyceride2,
            triglyceride3: result[0].triglyceride3,
            hypertension1: result[0].hypertension1,
            hypertension2: result[0].hypertension2,
            hypertension3: result[0].hypertension3,
            bloodsugar1: result[0].bloodsugar1,
            bloodsugar2: result[0].bloodsugar2,
            bloodsugar3: result[0].bloodsugar3,
            pigmentation1: result[0].pigmentation1,
            pigmentation2: result[0].pigmentation2,
            pigmentation3: result[0].pigmentation3,
            skinfold1: result[0].skinfold1,
            skinfold2: result[0].skinfold2,
            skinfold3: result[0].skinfold3,
            dermis1: result[0].dermis1,
            dermis2: result[0].dermis2,
            dermis3: result[0].dermis3,
            hairthick1: result[0].hairthick1,
            hairthick2: result[0].hairthick2,
            hairthick3: result[0].hairthick3,
            nohair1: result[0].nohair1,
            nohair2: result[0].nohair2,
            nohair3: result[0].nohair3,
            vitaminc1: result[0].vitaminc1,
            vitaminc2: result[0].vitaminc2,
            vitaminc3: result[0].vitaminc3,
            caffeine1: result[0].caffeine1,
            caffeine2: result[0].caffeine2,
            caffeine3: result[0].caffeine3,
          });
        });
      });
    });
  };
  //   genetic insert
  handleClick = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        geneticInsert(
          fitness,
          this.state.idc,
          this.state.measurementDate,
          this.state.bmi1,
          this.state.bmi2,
          this.state.bmi3,
          this.state.cholesterol1,
          this.state.cholesterol2,
          this.state.cholesterol3,
          this.state.triglyceride1,
          this.state.triglyceride2,
          this.state.triglyceride3,
          this.state.hypertension1,
          this.state.hypertension2,
          this.state.hypertension3,
          this.state.bloodsugar1,
          this.state.bloodsugar2,
          this.state.bloodsugar3,
          this.state.pigmentation1,
          this.state.pigmentation2,
          this.state.pigmentation3,
          this.state.skinfold1,
          this.state.skinfold2,
          this.state.skinfold3,
          this.state.dermis1,
          this.state.dermis2,
          this.state.dermis3,
          this.state.hairthick1,
          this.state.hairthick2,
          this.state.hairthick3,
          this.state.nohair1,
          this.state.nohair2,
          this.state.nohair3,
          this.state.vitaminc1,
          this.state.vitaminc2,
          this.state.vitaminc3,
          this.state.caffeine1,
          this.state.caffeine2,
          this.state.caffeine3
        ).then(() => {
          alert('DTC 정보가 등록되었습니다.');
          this.props.history.push('/genetic');
        });
      });
    });
  };
  //genetic delete
  handleDelete = () => {
    geneticDestroy(this.state.idc).then((res) => {
      alert('삭제 완료');
    });
  };
  handleDateChange(date) {
    this.setState({
      measurementDate: date,
    });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  //genetic update
  handleUpdate = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        genticUpdate(
          fitness,
          this.state.idc,
          this.state.measurementDate,
          this.state.bmi1,
          this.state.bmi2,
          this.state.bmi3,
          this.state.cholesterol1,
          this.state.cholesterol2,
          this.state.cholesterol3,
          this.state.triglyceride1,
          this.state.triglyceride2,
          this.state.triglyceride3,
          this.state.hypertension1,
          this.state.hypertension2,
          this.state.hypertension3,
          this.state.bloodsugar1,
          this.state.bloodsugar2,
          this.state.bloodsugar3,
          this.state.pigmentation1,
          this.state.pigmentation2,
          this.state.pigmentation3,
          this.state.skinfold1,
          this.state.skinfold2,
          this.state.skinfold3,
          this.state.dermis1,
          this.state.dermis2,
          this.state.dermis3,
          this.state.hairthick1,
          this.state.hairthick2,
          this.state.hairthick3,
          this.state.nohair1,
          this.state.nohair2,
          this.state.nohair3,
          this.state.vitaminc1,
          this.state.vitaminc2,
          this.state.vitaminc3,
          this.state.caffeine1,
          this.state.caffeine2,
          this.state.caffeine3
        ).then((res) => {
          alert('DTC가 등록되었습니다.');
          this.props.history.push('/genetic');
        });
      });
    });
  };

  render() {
    // console.log('idc', this.state.idc);
    // console.log('name', this.state.name);
    // console.log('measurementDate', this.state.measurementDate);
    // console.log(this.state.well);

    return (
      <div className='wrap dtc-add'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MobNavigation goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                DTC 검사 입력
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/genetic'>DTC 정보</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container className='dtc-add__box'>
          <div className='sectionGlass p-4'>
            <Row>
              <Col>
                회원이름<p className='fs-4 fw-bold'>{this.state.name}</p>
              </Col>
              <Col>
                성별<p className='fs-4 fw-bold'>{this.state.sex}</p>
              </Col>
              <Col>
                생년월일<p className='fs-4 fw-bold'>{this.state.birth}</p>
              </Col>
            </Row>
          </div>
          <div className='sectionGlass mt-1 p-4'>
            <Row xs={3} className='dtc__lamp-explain'>
              <Col>
                <CircleIcon /> 위험 유전자 수
              </Col>
              <Col>
                <CircleIcon /> 주의 유전자 수
              </Col>
              <Col>
                <CircleIcon /> 양호 유전자 수
              </Col>
            </Row>
            <Row className='py-4'>
              <Col xs={3}>
                측정일
                <DatePicker
                  selected={this.state.measurementDate}
                  onChange={this.handleDateChange}
                  name='measurementDate'
                  dateFormat='yyyy년MM월dd일'
                />
              </Col>
            </Row>
            <Row md={6} className='dtc-add__input-box g-5'>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img1.png'}
                    />
                  </Col>
                  <Col xs={12}>체질량 지수</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bmi1}
                      onChange={this.handleChange}
                      type='number'
                      id='bmi1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bmi2}
                      onChange={this.handleChange}
                      type='number'
                      id='bmi2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bmi3}
                      onChange={this.handleChange}
                      type='number'
                      id='bmi3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img2.png'}
                    />
                  </Col>
                  <Col xs={12}>콜레스테롤</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.cholesterol1}
                      onChange={this.handleChange}
                      type='number'
                      id='cholesterol1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.cholesterol2}
                      onChange={this.handleChange}
                      type='number'
                      id='cholesterol2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.cholesterol3}
                      onChange={this.handleChange}
                      type='number'
                      id='cholesterol3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img3.png'}
                    />
                  </Col>
                  <Col xs={12}>중성지방농도</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.triglyceride1}
                      onChange={this.handleChange}
                      type='number'
                      id='triglyceride1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.triglyceride2}
                      onChange={this.handleChange}
                      type='number'
                      id='triglyceride2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.triglyceride3}
                      onChange={this.handleChange}
                      type='number'
                      id='triglyceride3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img4.png'}
                    />
                  </Col>
                  <Col xs={12}>혈압</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hypertension1}
                      onChange={this.handleChange}
                      type='number'
                      id='hypertension1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hypertension2}
                      onChange={this.handleChange}
                      type='number'
                      id='hypertension2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hypertension3}
                      onChange={this.handleChange}
                      type='number'
                      id='hypertension3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img5.png'}
                    />
                  </Col>
                  <Col xs={12}>혈당</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bloodsugar1}
                      onChange={this.handleChange}
                      type='number'
                      id='bloodsugar1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bloodsugar2}
                      onChange={this.handleChange}
                      type='number'
                      id='bloodsugar2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.bloodsugar3}
                      onChange={this.handleChange}
                      type='number'
                      id='bloodsugar3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img6.png'}
                    />
                  </Col>
                  <Col xs={12}>색소침착</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.pigmentation1}
                      onChange={this.handleChange}
                      type='number'
                      id='pigmentation1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.pigmentation2}
                      onChange={this.handleChange}
                      type='number'
                      id='pigmentation2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.pigmentation3}
                      onChange={this.handleChange}
                      type='number'
                      id='pigmentation3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img7.png'}
                    />
                  </Col>
                  <Col xs={12}>피부노화</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.skinfold1}
                      onChange={this.handleChange}
                      type='number'
                      id='skinfold1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.skinfold2}
                      onChange={this.handleChange}
                      type='number'
                      id='skinfold2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.skinfold3}
                      onChange={this.handleChange}
                      type='number'
                      id='skinfold3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img8.png'}
                    />
                  </Col>
                  <Col xs={12}>피부탄력</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.dermis1}
                      onChange={this.handleChange}
                      type='number'
                      id='dermis1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.dermis2}
                      onChange={this.handleChange}
                      type='number'
                      id='dermis2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.dermis3}
                      onChange={this.handleChange}
                      type='number'
                      id='dermis3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img9.png'}
                    />
                  </Col>
                  <Col xs={12}>모발굵기</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hairthick1}
                      onChange={this.handleChange}
                      type='number'
                      id='hairthick1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hairthick2}
                      onChange={this.handleChange}
                      type='number'
                      id='hairthick2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.hairthick3}
                      onChange={this.handleChange}
                      type='number'
                      id='hairthick3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img10.png'}
                    />
                  </Col>
                  <Col xs={12}>탈모</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.nohair1}
                      onChange={this.handleChange}
                      type='number'
                      id='nohair1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.nohair2}
                      onChange={this.handleChange}
                      type='number'
                      id='nohair2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.nohair3}
                      onChange={this.handleChange}
                      type='number'
                      id='nohair3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img11.png'}
                    />
                  </Col>
                  <Col xs={12}>비타민C</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.vitaminc1}
                      onChange={this.handleChange}
                      type='number'
                      id='vitaminc1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.vitaminc2}
                      onChange={this.handleChange}
                      type='number'
                      id='vitaminc2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.vitaminc3}
                      onChange={this.handleChange}
                      type='number'
                      id='vitaminc3'
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row xs={3} className='dtc__lamp'>
                  <Col xs={12}>
                    <Image
                      src={process.env.PUBLIC_URL + '/assets/dtc-img12.png'}
                    />
                  </Col>
                  <Col xs={12}>카페인 대사</Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.caffeine1}
                      onChange={this.handleChange}
                      type='number'
                      id='caffeine1'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.caffeine2}
                      onChange={this.handleChange}
                      type='number'
                      id='caffeine2'
                    />
                  </Col>
                  <Col>
                    <CircleIcon />
                    <input
                      value={this.state.caffeine3}
                      onChange={this.handleChange}
                      type='number'
                      id='caffeine3'
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='pt-4'>
              <Col className='text-center'>
                {this.state.well ? (
                  <Button className='w-100' onClick={this.handleUpdate}>
                    수정하기
                  </Button>
                ) : (
                  <Button className='w-100' onClick={this.handleClick}>
                    입력하기
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }
}

const GeneticAddStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const GeneticAddDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  GeneticAddStateToProps,
  GeneticAddDispatchToProps
)(GeneticAdd);
