import { Component, useState } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserSearch from '../../component/customer/UserSearch';
import {
  inbodiesSelect,
  selectClientReservation,
  selectTrainerReservation,
  workoutAllotedDelete,
  workoutAllotedInsert,
  workoutAllotedSelect,
  workoutSelect,
} from '../../api/user';
import { data } from 'jquery';
import Footer from '../../component/footer/Footer';

//css
import '../../styles/workout/workout.css';

//bootstrap
import { Container, Row, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TabContainer from 'react-bootstrap/TabContainer';
import TabPane from 'react-bootstrap/TabPane';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// mui
import { Refresh } from '@mui/icons-material';
import { TablePagination, TextField } from '@mui/material';
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
// 리액트 아이콘
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { TbMoodSuprised } from 'react-icons/tb';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';

//react-icons.github.io
import { CgArrowRight, CgArrowLongRight } from 'react-icons/cg';
import { MdArrowForwardIos } from 'react-icons/md';

// import { HiOutlineArrowLongRight } from 'react-icons/hi2';

class Workout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '',
      open: false,
      inbodiesList: [],
      assignexerciseAllotlist: [],
      exerciseAllotlist: [],
      tablePlus: [],
      workoutAllotlist: [],
      headRegion: '',
      page: 0,
      rowsPerPage: 5,
      workoutA_date: new Date(),
      asd: '',
      key: 1,
    };
    //여기 function
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
        this.viewWorkout();
      }
              handleOnClick={this.handleOnClick}
              workoutAllotedView={this.workoutAllotedView}
              workoutA_date={this.state.workoutA_date}
              close={() => this.setState({ asd: 0, exerciseAllotlist: '' })}
            />
          );
        });
        this.setState({
          exerciseAllotlist: items,
          headRegion: key,
        });
        // console.log(result);
      });
    });
  };

  workoutAllotedView = (idc) => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      workoutAllotedSelect(
        fitness_no,
        idc,
        moment(this.state.workoutA_date).format('YYYY-MM-DD')
      ).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <WorkoutAllotedView
              idwa={data.idwa}
              fitness_no={data.fitness_no}
              client_no={data.client_no}
              workout={data.workout}
              region={data.region}
              machine={data.machine}
              default_set={data.default_set}
              default_count={data.default_count}
              default_rest={data.default_rest}
              url={data.url}
              idc={
                this.props.userinfo.loginWhether == 2
                  ? this.props.userinfo.joinNo
                  : this.state.idc === undefined
                  ? 0
                  : this.state.idc
  }

  render() {
    // console.log(this.state.idc);
    // console.log(this.state.workoutAllotlist);
    console.log(this.state.workoutA_date);

    return (
      <div className='workout-alloted wrap'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>운동 배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutAlloted'>운동 배정</Link>
              </div>
            </div>
          </div>
        </div>
        <Container className='workoutalloted__container'>
          <Row className='border p-2'>
            <Col xs={3}>
              {this.state.open ? (
                <UserSearch
                  open={this.state.open}
                  setOpen={(o) => this.setState({ open: o })}
                  fitness_no={this.props.userinfo.fitness_no}
                  loginWhether={this.props.userinfo.loginWhether}
                  joinNo={this.props.userinfo.joinNo}
                  handleUser={this.handleUser}
                />
              ) : (
                <>
                  <TextField
                    id='customer_name'
                    label='회원 검색'
                    disabled
                    variant='standard'
                    onClick={() => this.setState({ open: true })}
                    className='customer-input--search'
                    InputProps={{ disableUnderline: true }}
                    value={this.state.client_name}
                  />
                </>
              )}
            </Col>
            <Row>
              <Col xs={6} className='workoutRoutine'>
                <Link to='/workoutAlloted'>
                  <Row>
                    <Col xs={10} className='mb-5'>
                      <h2>커스텀 루틴 배정</h2>
                    </Col>
                    <Col xs={2}>
                      {/* <HiOutlineArrowLongRight className='fs-1' /> */}
                      <CgArrowLongRight className='fs-1' />
                    </Col>
                    <Col xs={12}>
                      <p>
                        개별 운동을 직접 조합해서 루틴을 만들어
                        <br />
                        회원에게 배정해 줄 수 있습니다.
                      </p>
                    </Col>
                  </Row>
                </Link>
              </Col>
              <Col xs={6} className='workoutRoutine ds'>
                <Link to='/workoutStage'>
                  <Row>
                    <Col xs={10} className='mb-5'>
                      <h2>베이직 루틴 배정</h2>
                    </Col>
                    <Col xs={2}>
                      <CgArrowLongRight className='fs-1' />
                    </Col>
                    <Col xs={12}>
                      <p>
                        사전에 생성한 루틴을 선택해
                        <br />
                        회원에게 배정해 줄 수 있습니다.
                      </p>
                    </Col>
                  </Row>
                </Link>
              </Col>
            </Row>

            <Col xs={12} className='addWorkout my-4'>
              <Link to='/workoutAdd'>
                <Row>
                  <Col xs={3}>
                    <h4>운동 설정</h4>
                  </Col>
                  <Col xs={8}>
                    <p>루틴에 들어갈 개별 운동들을 만들 수 있습니다.</p>
                  </Col>
                  <Col xs={1}>
                    <MdArrowForwardIos />
                  </Col>
                </Row>
              </Link>
            </Col>
            <Col xs={12} className='addWorkout'>
              <Link to='/workoutStageAdd'>
                <Row>
                  <Col xs={3}>
                    <h4>루틴 설정</h4>
                  </Col>
                  <Col xs={8}>
                    <p>베이직 루틴을 직접 만들 수 있습니다.</p>
                  </Col>
                  <Col xs={1}>
                    <MdArrowForwardIos />
                  </Col>
                </Row>
              </Link>
            </Col>
          </Row>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const WorkoutAllotedStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutAllotedDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  WorkoutAllotedStateToProps,
  WorkoutAllotedDispatchToProps
)(WorkoutAlloted);
