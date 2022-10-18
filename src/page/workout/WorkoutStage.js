import Menu from '../../component/navigation/Menu';
import { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getStatusRequest } from '../../action/authentication';
import {
  selectTrainerReservation,
  workoutAllotedInsert,
  workoutStageSelect,
  inbodiesSelect,
  selectClientReservation,
  workoutAllotedSelect,
} from '../../api/user';
import UserSearch from '../../component/customer/UserSearch';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
//css
import '../../styles/workout/workoutAlloted.css';
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

// react-icons
import { TbMoodSuprised } from 'react-icons/tb';
import { TbMoodSmile } from 'react-icons/tb';
import { MdOutlineRotateLeft } from 'react-icons/md';

const WorkoutStageView = ({
  fitness_no,
  workout,
  part,
  machine,
  default_set,
  default_count,
  default_rest,
  url,
  inbody_no,
  stage,
  idc,
}) => {
  const region =
    part === 1
      ? '상체'
      : part === 18
      ? '하체'
      : part === 28
      ? '전신'
      : part === 38
      ? '코어'
      : part === 48
      ? '유산소'
      : '기타';
  const stageWord =
    stage === 111
      ? '상체 1단계'
      : stage === 112
      ? '상체 2단계'
      : stage === 113
      ? '상체 3단계'
      : stage === 114
      ? '상체 4단계'
      : stage === 115
      ? '상체 5단계'
      : stage === 211
      ? '하체 1단계'
      : stage === 212
      ? '하체 2단계'
      : stage === 213
      ? '하체 3단계'
      : stage === 214
      ? '하체 4단계'
      : stage === 215
      ? '하체 5단계'
      : stage === 311
      ? '전신 1단계'
      : stage === 312
      ? '전신 2단계'
      : stage === 313
      ? '전신 3단계'
      : stage === 314
      ? '전신 4단계'
      : stage === 315
      ? '전신 5단계'
      : stage === 411
      ? '코어 1단계'
      : stage === 412
      ? '코어 2단계'
      : stage === 413
      ? '코어 3단계'
      : stage === 414
      ? '코어 4단계'
      : stage === 415
      ? '코어 5단계'
      : stage === 511
      ? '유산소 1단계'
      : stage === 512
      ? '유산소 2단계'
      : stage === 513
      ? '유산소 3단계'
      : stage === 514
      ? '유산소 4단계'
      : stage === 515
      ? '유산소 5단계'
      : stage === 611
      ? '기타 1단계'
      : stage === 612
      ? '기타 2단계'
      : stage === 613
      ? '기타 3단계'
      : stage === 614
      ? '기타 4단계'
      : stage === 615
      ? '기타 5단계'
      : '기본';
  return (
    <TableRow>
      <TableCell>{stageWord}</TableCell>
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
    </TableRow>
  );
};

const WorkoutAllotedView = ({
  idwa,
  fitness_no,
  client_no,
  workout,
  region,
  machine,
  default_set,
  default_count,
  default_rest,
  url,
}) => {
  return (
    <TableRow>
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
    </TableRow>
  );
};

class WorkoutStage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: '',
      workoutStage: [],
      open: false,
      workout: [],
      part: '',
      machine: '',
      default_set: '',
      default_count: '',
      default_rest: '',
      url: '',
      nextStage1: false,
      nextStage2: false,
      nextStage3: false,
      nextStage4: false,
      nextStage5: false,
      nextStage6: false,
      rowsPerPage: 5,
      page: 0,
      workoutA_date: new Date(),
      client_name: '',
      inbodiesList: [],
      workoutAllotlist: [],
      exerciseAllotlist: [],
      // idc2: this.props.location.state.idc2,
      // client_name2: this.props.location.state.client_name2,
      // line: this.props.location.state.line,
      rowsPerPage: 5,
      page: 0,
      // workoutB_date: this.props.location.state.workoutB_date,
    };
  }
  goLogin = () => {
    this.props.history.push('/');
  };
  goWorkoutStageAdd = () => {
    this.props.history.push('/workoutStageAdd');
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
          ? this.inbodiesView(this.props.userinfo.joinNo)
          : '';
      }
    });
  }

  handleUser = (client) => {
    const { idc, client_name } = client;
    // console.log(client_name);
    this.setState({
      client: client,
      client_name: client_name,
      idc: idc,
      open: false,
    });
  };

  stageOnClick = (s) => {
    this.setState({
      stage: s,
    });
    this.workoutStageView();
  };

  workoutStageView = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      workoutStageSelect(fitness_no, this.state.stage).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <WorkoutStageView
              ids={data.ids}
              stage={data.stage}
              fitness_no={data.fitness_no}
              workout={data.workout}
              part={data.part}
              machine={data.machine}
              default_set={data.default_set}
              default_count={data.default_count}
              default_rest={data.default_rest}
              url={data.url}
            />
          );
        });
        this.setState({
          workoutStage: items.reverse(),
        });
        // console.log(items[0].props.part);
      });
    });
  };

  alloted = () => {
    if (this.state.idc === undefined) {
      alert('회원을 선택해주세요.');
    } else {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        this.state.workoutStage.map((data, index, array) => {
          // console.log(this.state.workoutStage);
          this.setState({
            workout: data.props.workout,
            part: data.props.part,
            machine: data.props.machine,
            default_set: data.props.default_set,
            default_count: data.props.default_count,
            default_rest: data.props.default_rest,
            url: data.props.url,
          });
          // console.log(this.state.workout);
          workoutAllotedInsert(
            fitness_no,
            this.state.idc,
            this.state.workout,
            this.state.part === 1
              ? '상체'
              : this.state.part === 18
              ? '하체'
              : this.state.part === 28
              ? '전신'
              : this.state.part === 38
              ? '코어'
              : this.state.part === 48
              ? '유산소'
              : '기타',
            this.state.machine,
            this.state.default_set,
            this.state.default_count,
            this.state.default_rest,
            this.state.url,
            moment(this.state.workoutA_date).format('YYYY-MM-DD')
          ).then((res) => {
            // console.log(this.state.workout);
            this.props.history.push({
              pathname: '/workoutAllotedList',
              state: {
                client_name2: this.state.client_name,
                idc2: this.state.idc,
                line: 3,
                workoutB_date: this.state.workoutA_date,
              },
            });
          });
        });
      });
    }
  };

  stageOnClickStage = () => {
    this.stageOnClick(111);
    this.setState({
      nextStage1: true,
      nextStage2: false,
      nextStage3: false,
      nextStage4: false,
      nextStage5: false,
      nextStage6: false,
    });
  };
  stageOnClickStage2 = () => {
    this.stageOnClick(211);
    this.setState({
      nextStage2: true,
      nextStage1: false,
      nextStage3: false,
      nextStage4: false,
      nextStage5: false,
      nextStage6: false,
    });
  };
  stageOnClickStage3 = () => {
    this.stageOnClick(311);
    this.setState({
      nextStage3: true,
      nextStage2: false,
      nextStage1: false,
      nextStage4: false,
      nextStage5: false,
      nextStage6: false,
    });
  };
  stageOnClickStage4 = () => {
    this.stageOnClick(411);
    this.setState({
      nextStage4: true,
      nextStage2: false,
      nextStage3: false,
      nextStage1: false,
      nextStage5: false,
      nextStage6: false,
    });
  };
  stageOnClickStage5 = () => {
    this.stageOnClick(511);
    this.setState({
      nextStage5: true,
      nextStage2: false,
      nextStage3: false,
      nextStage4: false,
      nextStage1: false,
      nextStage6: false,
    });
  };
  stageOnClickStage6 = () => {
    this.stageOnClick(611);
    this.setState({
      nextStage6: true,
      nextStage2: false,
      nextStage3: false,
      nextStage4: false,
      nextStage5: false,
      nextStage1: false,
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

  dateOnChange = (date) => {
    this.setState({ workoutA_date: date });
    this.workoutAllotedView(this.state.idc);
  };

  render() {
    console.log(
      'date : ',
      moment(this.state.workoutA_date).format('YYYY-MM-DD')
    );
    // console.log('stage : ', this.state.stage);
    // console.log('stage typeof : ', typeof this.state.stage);
    // console.log('idc : ', this.state.idc); //idc=client_no
    // console.log('workoutStage : ', this.state.workoutStage);
    // console.log('workout : ', this.state.workout);
    // console.log('client_name : ', this.state.client_name);

    return (
      <div className='wrap workoutStage__wrap'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>운동 루틴 배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutStage'>운동 루틴 배정</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
          <Row className='clientSearch d-flex justify-content-between align-items-center'>
            <Col>
              <h4>베이직 루틴 배정</h4>
            </Col>
            <Col>
              <DatePicker
                className='text-center'
                selected={this.state.workoutA_date}
                onChange={(date) => this.dateOnChange(date)}
                dateFormat='yyyy년 MM월 dd일'
                minDate={new Date()}
              />
            </Col>
            <Col className='customer_name'>
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
                    placeholder='회원검색'
                    id='customer_name'
                    label='회원 검색'
                    disabled
                    variant='standard'
                    onClick={() => this.setState({ open: true })}
                    className='customer-input--search'
                    InputProps={{
                      disableUnderline: true,
                    }}
                    value={this.state.client_name}
                  />
                </>
              )}
            </Col>
            <Col>
              <Button variant='primary' onClick={this.goWorkoutStageAdd}>
                루틴 추가
              </Button>
            </Col>
          </Row>
          <Row className='sectionGlass'>
            <Col>
              <div className='pageTit d-flex justify-content-between mb-3'>
                <h4>베이직 루틴 배정</h4>
                <p>기본 루틴 목록입니다. 회원에게 배정하세요.</p>
              </div>
            </Col>
            <Col xs={12} className='mt-2 workoutTabstage'>
              <Row xs={6} className='workoutTabs text-center w-100'>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage()}
                  >
                    상체
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage2()}
                  >
                    하체
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage3()}
                  >
                    전신
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage4()}
                  >
                    코어
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage5()}
                  >
                    유산소
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage6()}
                  >
                    기타
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                {/* 선택된 부위에 따른 단계 선택 버튼 표시 */}
                {this.state.nextStage1 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(111)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(112)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(113)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(114)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(115)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : this.state.nextStage2 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(211)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(212)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(213)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(214)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(215)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : this.state.nextStage3 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(311)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(312)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(313)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(314)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(315)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : this.state.nextStage4 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(411)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(412)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(413)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(414)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(415)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : this.state.nextStage5 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(511)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(512)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(513)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(514)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(515)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : this.state.nextStage6 ? (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(611)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(612)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(613)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(614)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(615)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div>
                    <Row xs={5} className='mt-3'>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(111)}
                        >
                          1 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(112)}
                        >
                          2 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(113)}
                        >
                          3 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(114)}
                        >
                          4 단계
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant='secondary'
                          className='w-100'
                          onClick={() => this.stageOnClick(115)}
                        >
                          5 단계
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Row>
            </Col>
            <Col xs={12} className='my-3'>
              <TableContainer component={Paper}>
                <Table className='table-light'>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
                      <TableCell scope='col'>부위</TableCell>
                      <TableCell scope='col'>이름</TableCell>
                      <TableCell scope='col'>기구</TableCell>
                      <TableCell scope='col'>세트</TableCell>
                      <TableCell scope='col'>횟수</TableCell>
                      <TableCell scope='col'>쉬는시간</TableCell>
                      <TableCell scope='col'>URL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.workoutStage.length === 0
                      ? ''
                      : this.state.workoutStage.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                  </TableBody>
                </Table>
                {this.state.stage == '' ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSmile className='fs-3' />
                    <p>운동 단계를 선택해주세요</p>
                  </div>
                ) : this.state.workoutStage.length === 0 ? (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 운동 목록이 없습니다.</p>
                    <p>설정 페이지로 이동하시겠습니까?</p>
                    <Link to='/workoutStageAdd'>
                      <Button
                        variant='success'
                        to='/workoutStageAdd'
                        className=''
                      >
                        기본 루틴 설정
                      </Button>
                    </Link>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.workoutStage.length,
                    },
                  ]}
                  count={this.state.workoutStage.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Col>
            <Col xs={12} className='text-center'>
              {this.state.client_name == undefined ? (
                <Button
                  variant='primary'
                  className='ms-2'
                  onClick={this.alloted}
                  disabled
                >
                  루틴 배정하기
                </Button>
              ) : (
                <Button
                  variant='primary'
                  className='ms-2'
                  onClick={this.alloted}
                >
                  루틴 배정하기
                </Button>
              )}
            </Col>
          </Row>
          <Row className='sectionGlass'>
            {this.state.client_name ? (
              <Col xs={12}>
                <h5>
                  <strong>{this.state.client_name}</strong>
                  님의{' '}
                  <strong>
                    {moment(this.state.workoutA_date).format(
                      'YYYY년 MM년 DD일 (ddd요일)'
                    )}
                  </strong>
                  에 배정된 운동목록입니다.
                </h5>
              </Col>
            ) : (
              <Col xs={12}>
                <h5>회원을 선택해주세요.</h5>
              </Col>
            )}
            <Col xs={12}>
              <TableContainer component={Paper}>
                <Table className='table--block table-light'>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>부위</TableCell>
                      <TableCell scope='col'>이름</TableCell>
                      <TableCell scope='col'>운동기구</TableCell>
                      <TableCell scope='col'>세트</TableCell>
                      <TableCell scope='col'>횟수</TableCell>
                      <TableCell scope='col'>휴식</TableCell>
                      <TableCell scope='col'>URL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.workoutAllotlist.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
                </Table>
                {this.state.workoutAllotlist.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSmile className='fs-3' />
                    <p>회원을 선택해주세요.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.workoutAllotlist.length,
                    },
                  ]}
                  count={this.state.workoutAllotlist.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
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
const WorkoutStageStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutStageDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  WorkoutStageStateToProps,
  WorkoutStageDispatchToProps
)(WorkoutStage);
