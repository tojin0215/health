import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import { geneticInsert } from '../../api/user';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
class GeneticAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  // current=()=>{
  //     select
  // }

  //   idc=123 moment
  handleClick = () => {
    geneticInsert(
      this.props.userinfo.fitness_no,
      123,
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
    ).then((response) => {
      alert('DTC가 등록되었습니다.');
    });
  };

  render() {
    console.log('idc', this.state.member_no);
    return (
      <div className='wrap inbodies'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
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
        <Container>
          <Col>회원이름</Col>
          <Col>측정일</Col>
          <Row md={6}></Row>
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
