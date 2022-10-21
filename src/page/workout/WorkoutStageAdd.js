import { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  selectTrainerReservation,
  workoutDestroy,
  workoutSelect,
  workoutStageDestroy,
  workoutStageInsert,
  workoutStageSelect,
} from '../../api/user';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';
//css
import '../../styles/workout/workoutAlloted.css';
//bootstrap
import { Button, Col, Container, Row, Tab } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
//mui
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TablePagination, TextField } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
//react icons
import { BsPlusLg } from 'react-icons/bs';
import { TbMoodSuprised } from 'react-icons/tb';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';

const ExerciseView = ({
  idw,
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
  workoutStageView,
  nextStage1,
  nextStage2,
  nextStage3,
  nextStage4,
  nextStage5,
  nextStage6,
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
  const plusStage = () => {
    if (stage === '') {
      alert('루틴을 선택한 뒤 설정하세요');
    } else {
      workoutStageInsert(
        stage,
        fitness_no,
        workout,
        part,
        machine,
        default_set_input,
        default_count_input,
        default_rest_input,
        url_input
      ).then((res) => {
        setDefault_set_input(default_set);
        setDefault_count_input(default_count);
        setDefault_rest_input(default_rest);
        setUrl_input(url);
        workoutStageView(stage);
      });
    }
  };

  const [default_set_input, setDefault_set_input] = useState(default_set);
  const [default_count_input, setDefault_count_input] = useState(default_count);
  const [default_rest_input, setDefault_rest_input] = useState(default_rest);
  const [url_input, setUrl_input] = useState(url);
  const changeInsert = (e) => {
    setDefault_set_input(e.target.value);
  };
  const changeInsert2 = (e) => {
    setDefault_count_input(e.target.value);
  };
  const changeInsert3 = (e) => {
    setDefault_rest_input(e.target.value);
  };
  const changeInsert4 = (e) => {
    setUrl_input(e.target.value);
  };

  return (
    <TableRow>
      {/* <TableCell>{stage}</TableCell> */}
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>
        <Form.Control
          type='number'
          value={default_set_input}
          onChange={changeInsert}
        />
      </TableCell>
      <TableCell>
        <Form.Control
          type='number'
          value={default_count_input}
          onChange={changeInsert2}
        />
      </TableCell>
      <TableCell>
        <Form.Control
          type='number'
          value={default_rest_input}
          onChange={changeInsert3}
        />
      </TableCell>
      <TableCell>
        <Form.Control value={url_input} onChange={changeInsert4} />
      </TableCell>
      {/* <TableCell onClick={plusStage}>
          <Button variant='success'>
            <BsPlusLg />
          </Button>
        </TableCell> */}
      <TableCell
        className='workout-alloted__select--plus cursor-pointer'
        onClick={plusStage}
      >
        <HiOutlinePlusCircle className='fs-1' />
      </TableCell>
    </TableRow>
  );
};

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
  ids,
  workoutStageView,
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
  const destroy = () => {
    workoutDestroy(ids).then((res) => {
      workoutStageView(stage);
    });
  };
  return (
    <TableRow>
      {/* <TableCell>{stage}</TableCell> */}
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
      {/* <TableCell onClick={destroy}>
          <Button>삭제</Button>
        </TableCell> */}
      <TableCell
        onClick={destroy}
        className='workout-alloted__selected--cencel'
      >
        <GiCancel className='fs-2' />
      </TableCell>
    </TableRow>
  );
};

class WorkoutStageAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headRegion: '',
      workoutlist: [],
      stage: '',
      workoutStage: [],
      nextStage1: false,
      nextStage2: false,
      nextStage3: false,
      nextStage4: false,
      nextStage5: false,
      nextStage6: false,
      // nextGroup: {
      //   nextStage1: false,
      //   nextStage2: false,
      //   nextStage3: false,
      //   nextStage4: false,
      //   nextStage5: false,
      //   nextStage6: false,
      // },
      rowsPerPage: 5,
      page: 0,
    };
  }

  goLogin = () => {
    this.props.history.push('/');
  };
  goWorkout = () => {
    this.props.history.push('/workout');
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
        // this.handleOnClick(1);
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView(this.props.userinfo.joinNo)
          : '';
      }
    });
  }
  handleOnClick = (key) => {
    console.log('handleOnClick 동작 workout', this.state.stage);
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      workoutSelect(fitness_no, key).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ExerciseView
              idw={data.idw}
              fitness_no={data.fitness_no}
              workout={data.workout}
              part={data.part}
              machine={data.machine}
              default_set={data.default_set}
              default_count={data.default_count}
              default_rest={data.default_rest}
              url={data.url}
              client_name={this.state.client_name}
              workoutStageView={this.workoutStageView}
              stage={this.state.stage}
              nextStage1={this.state.nextStage1}
              nextStage2={this.state.nextStage2}
              nextStage3={this.state.nextStage3}
              nextStage4={this.state.nextStage4}
              nextStage5={this.state.nextStage5}
              nextStage6={this.state.nextStage6}
            />
          );
        });
        this.setState({
          workoutlist: items.reverse(),
          headRegion: key,
        });
        // console.log(items[0].props.part);
      });
    });
  };

  workoutStageView = (s) => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      workoutStageSelect(fitness_no, s).then((result) => {
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
              workoutStageView={this.workoutStageView}
            />
          );
        });
        this.setState({
          workoutStage: items.reverse(),
        });
        // this.handleOnClick(1);
        // console.log(items[0].props.part);
      });
    });
  };
  stageOnClick = (s) => {
    console.log('stageOnClick 동작하였습니다. 매개변수 :', s);
    let sliceNumber = Number(String(s).slice(0, 1));
    let stepNumber = Number(String(s).slice(-1));
    this.setState({
      stage: s,
    });
    // console.log('typeof sliceNumber', typeof sliceNumber);
    // console.log('sliceNumber', sliceNumber);
    switch (sliceNumber) {
      case 1:
        console.log('active stageOnClick switch 1');
        this.handleOnClick(1);
        break;
      case 2:
        console.log('active stageOnClick switch 18');
        this.handleOnClick(18);
        break;
      case 3:
        console.log('active stageOnClick switch 28');
        this.handleOnClick(28);
        break;
      case 4:
        console.log('active stageOnClick switch 38');
        this.handleOnClick(38);
        break;
      case 5:
        console.log('active stageOnClick switch 48');
        this.handleOnClick(48);
        break;
      case 6:
        console.log('active stageOnClick switch 58');
        this.handleOnClick(58);
        break;
      default:
        console.log('active stageOnClick switch 문 실패');
    }
    this.workoutStageView(s);
    console.log('workoutStageView :', s);
  };

  stageOnClickStage1 = () => {
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

  workoutStageDelete = () => {
    workoutStageDestroy(this.state.stage).then((res) => {
      this.workoutStageView(this.state.stage);
    });
  };

  render() {
    // const [select_region_type, setSelect_region_type] = useState(1);
    return (
      <div className='workoutStageAdd wrap'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>베이직 루틴 설정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workout'>운동</Link>
                <span>&#62;</span>
                <Link to='/workoutStageAdd'>베이직 루틴 설정</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
          <Button variant='secondary' onClick={this.goWorkout}>
            돌아가기
          </Button>
          <Row className='sectionGlass'>
            <Col xs={12}>
              <div className='pageTit d-flex justify-content-between mb-3'>
                <h4>베이직 루틴 설정</h4>
                <p>베이직 루틴을 설정하세요.</p>
              </div>
            </Col>
            <Col>
              <Row className='workoutTabs text-center'>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(1)}
                  >
                    상체
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(18)}
                  >
                    하체
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(28)}
                  >
                    전신
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(38)}
                  >
                    코어
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(48)}
                  >
                    유산소
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(58)}
                  >
                    기타
                  </Button>
                </Col>
              </Row>
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
                      <TableCell scope='col' align='center'>
                        배정
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.workoutlist.slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                    )}
                  </TableBody>
                </Table>
                {this.state.workoutlist.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>설정된 운동이 없습니다.</p>
                  </div>
                ) : (
                  ''
                )}
                <TablePagination
                  className='bg-white'
                  rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    {
                      label: 'All',
                      value: this.state.workoutlist.length,
                    },
                  ]}
                  count={this.state.workoutlist.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </TableContainer>
            </Col>
          </Row>
          <Row className='sectionGlass'>
            <Col xs={12} className='d-flex justify-content-between'>
              <h5>
                {this.state.stage ? (
                  <p>
                    <strong>
                      {this.state.headRegion === 1
                        ? '상체 '
                        : this.state.headRegion === 18
                        ? '하체 '
                        : this.state.headRegion === 28
                        ? '전신 '
                        : this.state.headRegion === 38
                        ? '코어 '
                        : this.state.headRegion === 48
                        ? '유산소 '
                        : this.state.headRegion === 58
                        ? '기타 '
                        : ''}
                      {String(this.state.stage).slice(-1) === '1'
                        ? '1단계 '
                        : String(this.state.stage).slice(-1) === '2'
                        ? '2단계 '
                        : String(this.state.stage).slice(-1) === '3'
                        ? '3단계 '
                        : String(this.state.stage).slice(-1) === '4'
                        ? '4단계 '
                        : String(this.state.stage).slice(-1) === '5'
                        ? '5단계 '
                        : String(this.state.stage).slice(-1) === '6'
                        ? '6단계 '
                        : ''}
                    </strong>
                    {this.state.headRegion && this.state.stage
                      ? '에 배정된 베이직 운동 루틴 목록입니다.'
                      : ''}
                  </p>
                ) : (
                  '루틴을 배정할 단계를 선택해주세요.'
                )}
              </h5>
              <div>
                <p
                  className='text-danger text-center'
                  onClick={() => this.workoutStageDelete()}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  전체삭제
                </p>
                {/* 기능추가 경고알림 */}
              </div>
            </Col>
            <Col>
              <Row className='workoutTabs text-center my-2'>
                <Col>
                  {/* <button onClick={() => this.stageOnClick(11)}>
                    1단계 기존바꿔야됨
                  </button> */}
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage1()}
                  >
                    상체
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage2()}
                  >
                    하체
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage3()}
                  >
                    전신
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage4()}
                  >
                    코어
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage5()}
                  >
                    유산소
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.stageOnClickStage6()}
                  >
                    기타
                  </Button>
                </Col>
              </Row>
            </Col>
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
                <Row xs={5}>
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
                <Row xs={5}>
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
                <Row xs={5}>
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
                <Row xs={5}>
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
                <Row xs={5}>
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
                <Row xs={5}>
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
            {/* <Row className='my-2'>
                <Col className='text-start'>
                  <Button
                    variant='outline-danger'
                    to={{
                      pathname: '/workoutStage',
                    }}
                    onClick={() => this.setState({ nextStage1: '' })}
                  >
                    돌아가기
                  </Button>
                </Col>
              </Row> */}
            {/* <Row className='my-2'>
                <Col className='text-start'>
                  <Button onClick={() => this.workoutStageDelete()}>
                    초기화
                  </Button>
                </Col>
              </Row> */}
            <Col>
              {/* 기타 */}
              <TableContainer component={Paper} className='mt-3'>
                <Table className='table-light'>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>부위</TableCell>
                      <TableCell scope='col'>이름</TableCell>
                      <TableCell scope='col'>기구</TableCell>
                      <TableCell scope='col'>세트</TableCell>
                      <TableCell scope='col'>횟수</TableCell>
                      <TableCell scope='col'>휴식</TableCell>
                      <TableCell scope='col'>URL</TableCell>
                      <TableCell scope='col' align='center'>
                        삭제
                      </TableCell>
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
                {this.state.workoutStage.length === 0 ? (
                  <div className='p-5 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>설정된 운동이 없습니다.</p>
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
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}
const WorkoutStageAddStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutStageAddDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  WorkoutStageAddStateToProps,
  WorkoutStageAddDispatchToProps
)(WorkoutStageAdd);
