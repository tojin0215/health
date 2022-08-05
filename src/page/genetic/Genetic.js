import {
  Menu,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import moment from 'moment';
moment.locale('ko-KR');

import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  geneticSelect,
  selectClientReservation,
  selectTrainerReservation,
} from '../../api/user';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import UserSearch from '../../component/customer/UserSearch';
import { TbMoodSuprised } from 'react-icons/tb';

class Genetic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genetic: [],
      measurementDate: new Date(),
      bmi1: 0,
      bmi2: 0,
      bmi3: 0,
      cholesterol1: 0,
      cholesterol2: 0,
      cholesterol3: 0,
      triglyceride1: 0,
      triglyceride2: 0,
      triglyceride3: 0,
      hypertension1: 0,
      hypertension2: 0,
      hypertension3: 0,
      bloodsugar1: 0,
      bloodsugar2: 0,
      bloodsugar3: 0,
      pigmentation1: 0,
      pigmentation2: 0,
      pigmentation3: 0,
      skinfold1: 0,
      skinfold2: 0,
      skinfold3: 0,
      dermis1: 0,
      dermis2: 0,
      dermis3: 0,
      hairthick1: 0,
      hairthick2: 0,
      hairthick3: 0,
      nohair1: 0,
      nohair2: 0,
      nohair3: 0,
      vitaminc1: 0,
      vitaminc2: 0,
      vitaminc3: 0,
      caffeine1: 0,
      caffeine2: 0,
      caffeine3: 0,
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
        this.props.userinfo.loginWhether === 2
          ? this.geneticView(this.props.userinfo.joinNo)
          : '';
      }
    });
  }

  //geneticSelect
  geneticView = (idc) => {
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
        geneticSelect(fitness, idc).then((result) => {
          // console.log(result);
          result.length === 0
            ? this.setState({
                genetic: result,
              })
            : this.setState({
                genetic: result,
                member_no: this.state.idc,
                measurementDate: result[0].measurementDate,
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
  handleUser = (client) => {
    const { idc, client_name } = client;
    // console.log(client_name);
    // console.log(idc);
    this.setState({
      client: client,
      client_name: client_name,
      idc: idc,
      open: false,
    });
    this.geneticView(idc);
  };

  render() {
    // console.log('genetic', this.state.genetic);
    // console.log(this.props.userinfo.fitness_no);
    // console.log('client', this.state.client);
    console.log('idc', this.state.idc);
    // console.log('member_no', this.state.member_no);
    // console.log(
    //   'measurementDate',
    //   moment(this.state.measurementDate).format('YYYY-MM-DD')
    // );

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
                DTC 정보
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='#'>DTC 정보</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <Container>
          <Row className=''>
            <Col md={6} className='text-center mb-2'>
              {this.props.userinfo.loginWhether === 2 ? (
                <TextField
                  id='customer_name'
                  label='선택된 회원'
                  disabled
                  variant='standard'
                  className='boxmorpsm h-100 w-100 text-center pb-2 px-5'
                  InputProps={{ disableUnderline: true }}
                  value={this.props.userinfo.manager_name}
                />
              ) : this.state.open ? (
                <div>
                  <UserSearch
                    open={this.state.open}
                    setOpen={(o) => this.setState({ open: o })}
                    fitness_no={this.props.userinfo.fitness_no}
                    loginWhether={this.props.userinfo.loginWhether}
                    joinNo={this.props.userinfo.joinNo}
                    handleUser={this.handleUser}
                  />
                </div>
              ) : (
                <div>
                  <TextField
                    id='customer_name'
                    label='회원 선택'
                    disabled
                    variant='standard'
                    onClick={() => this.setState({ open: true })}
                    className='boxmorpsm bg-white h-100 w-100 text-center pb-2 px-5'
                    InputProps={{ disableUnderline: true }}
                    value={this.state.client_name}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}
            </Col>
            {this.state.genetic.length === 0 ? (
              <Col md={2} className='mb-2'>
                <Link
                  to={{
                    pathname: '/geneticAdd',
                    state: {
                      idc:
                        this.props.userinfo.loginWhether === 2
                          ? this.props.userinfo.joinNo
                          : this.state.idc,
                    },
                  }}
                >
                  <Button className='w-100 h-100' variant='outline-primary'>
                    DTC 측정
                  </Button>
                </Link>
              </Col>
            ) : (
              <Col md={2} className='mb-2'>
                <Link
                  to={{
                    pathname: '/geneticAdd',
                    state: {
                      idc:
                        this.props.userinfo.loginWhether === 2
                          ? this.props.userinfo.joinNo
                          : this.state.idc,
                      well: 1,
                    },
                  }}
                >
                  <Button className='w-100 h-100' variant='outline-primary'>
                    DTC 수정하기
                  </Button>
                </Link>
              </Col>
            )}
          </Row>

          {this.state.idc === undefined ? (
            ''
          ) : this.state.genetic.length === 0 ? (
            'DTC검사를 하지 않았습니다. DTC측정을 하려면 버튼을 누르세요'
          ) : (
            <div>
              <Col>
                측정일:
                {moment(this.state.measurementDate).format(
                  '  YYYY년 MM월 DD일'
                )}
              </Col>
              <Col>
                DTC Total Care 검사결과,
                {this.state.bmi1 >= 1 ? '체질량지수, ' : ''}
                {this.state.cholesterol1 >= 1 ? '콜레스테롤, ' : ''}
                {this.state.triglyceride1 >= 1 ? '중성지방농도, ' : ''}
                {this.state.hypertension1 >= 1 ? '혈압, ' : ''}
                {this.state.bloodsugar1 >= 1 ? '혈당, ' : ''}
                {this.state.pigmentation1 >= 1 ? '색소침착, ' : ''}
                {this.state.skinfold1 >= 1 ? '피부노화, ' : ''}
                {this.state.dermis1 >= 1 ? '피부탄력, ' : ''}
                {this.state.hairthick1 >= 1 ? '모발굵기, ' : ''}
                {this.state.nohair1 >= 1 ? '탈모, ' : ''}
                {this.state.vitaminc1 >= 1 ? '비타민C, ' : ''}
                {this.state.caffeine1 >= 1 ? '카페인 대사' : ''}
                항목에서 위험 유전자가 확인되었습니다.
              </Col>
              <Row md={6}>
                <Col>
                  체질량 지수
                  <p>
                    {this.state.bmi1}/{this.state.bmi2}/{this.state.bmi3}
                  </p>
                </Col>
                <Col>
                  콜레스테롤
                  <p>
                    {this.state.cholesterol1}/{this.state.cholesterol2}/
                    {this.state.cholesterol3}
                  </p>
                </Col>
                <Col>
                  중성지방농도
                  <p>
                    {this.state.triglyceride1}/{this.state.triglyceride2}/
                    {this.state.triglyceride3}
                  </p>
                </Col>
                <Col>
                  혈압
                  <p>
                    {this.state.hypertension1}/{this.state.hypertension2}/
                    {this.state.hypertension3}
                  </p>
                </Col>
                <Col>
                  혈당
                  <p>
                    {this.state.bloodsugar1}/{this.state.bloodsugar2}/
                    {this.state.bloodsugar3}
                  </p>
                </Col>
                <Col>
                  색소침착
                  <p>
                    {this.state.pigmentation1}/{this.state.pigmentation2}/
                    {this.state.pigmentation3}
                  </p>
                </Col>
                <Col>
                  피부노화
                  <p>
                    {this.state.skinfold1}/{this.state.skinfold2}/
                    {this.state.skinfold3}
                  </p>
                </Col>
                <Col>
                  피부탄력
                  <p>
                    {this.state.dermis1}/{this.state.dermis2}/
                    {this.state.dermis3}
                  </p>
                </Col>
                <Col>
                  모발굵기
                  <p>
                    {this.state.hairthick1}/{this.state.hairthick2}/
                    {this.state.hairthick3}
                  </p>
                </Col>
                <Col>
                  탈모
                  <p>
                    {this.state.nohair1}/{this.state.nohair2}/
                    {this.state.nohair3}
                  </p>
                </Col>
                <Col>
                  비타민C
                  <p>
                    {this.state.vitaminc1}/{this.state.vitaminc2}/
                    {this.state.vitaminc3}
                  </p>
                </Col>
                <Col>
                  카페인 대사
                  <p>
                    {this.state.caffeine1}/{this.state.caffeine2}/
                    {this.state.caffeine3}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </div>
    );
  }
}
const GeneticStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const GeneticDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(GeneticStateToProps, GeneticDispatchToProps)(Genetic);
