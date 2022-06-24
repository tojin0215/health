import { Component, useState } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
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

//bootstrap
import { Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// mui
import { Refresh } from '@mui/icons-material';
import { TextField } from '@mui/material';
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

const InbodiesView = ({ client_name, height, weight, bodyFat, muscleMass }) => {
  return (
    <Row className='mt-4 sectionGlass'>
      <Col xs={12}>
        <h3>
          {client_name}
          <span className='fs-4'> 님</span>
          <span className='fs-5'>의 마지막 인바디 기록입니다.</span>
        </h3>
      </Col>
      <Col>
        <h5>키</h5>
        <span className='fs-5 fw-bold'>{height}</span>
        <span> cm</span>
      </Col>
      <Col>
        <h5>체중</h5>
        <span className='fs-5 fw-bold'>{weight}</span>
        <span> kg</span>
      </Col>
      <Col>
        <h5>체지방</h5>
        <span className='fs-5 fw-bold'>{bodyFat}</span>
        <span> kg</span>
      </Col>
      <Col>
        <h5>근육량</h5>
        <span className='fs-5 fw-bold'>{muscleMass}</span>
        <span> kg</span>
      </Col>
    </Row>
  );
};

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
  idc,
  client_name,
  workoutAllotedView,
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

  const plusTable = () => {
    workoutAllotedInsert(
      fitness_no,
      idc,
      workout,
      region,
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
      workoutAllotedView(idc);
      alert(workout + '운동이 배정됩니다.');
    });
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
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>
        <input
          type='number'
          value={default_set_input}
          onChange={changeInsert}
        />
      </TableCell>
      <TableCell>
        <input
          type='number'
          value={default_count_input}
          onChange={changeInsert2}
        />
      </TableCell>
      <TableCell>
        <input
          type='number'
          value={default_rest_input}
          onChange={changeInsert3}
        />
      </TableCell>
      <TableCell>
        <input value={url_input} onChange={changeInsert4} />
      </TableCell>
      <TableCell>
        <Button onClick={plusTable}>+</Button>
      </TableCell>
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
  idc,
  workoutAllotedView,
}) => {
  const hadndleDelete = (idwa) => {
    workoutAllotedDelete(idwa).then((res) => {
      workoutAllotedView(idc);
      alert('삭제합니다.');
    });
  };

  return (
    <TableRow>
      <TableCell>{workout}</TableCell>
      <TableCell>{region}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
      <TableCell>
        <Button
          className='px-2 py-1'
          variant='outline-danger'
          onClick={() =>
            confirm('정말 삭제하시겠습니까?') == true
              ? hadndleDelete(idwa)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill />
        </Button>
      </TableCell>
    </TableRow>
  );
};

class WorkoutAlloted extends Component {
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
    this.inbodiesView(idc);
    this.workoutAllotedView(idc);
  };

  inbodiesView = (idc) => {
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
        inbodiesSelect(fitness_no, idc === undefined ? '' : idc).then(
          (result) => {
            const items = result.map((data, index, array) => {
              return (
                <InbodiesView
                  client_name={this.state.client_name}
                  num={data.num}
                  fitness_no={data.fitness_no}
                  member_no={data.member_no}
                  height={data.height}
                  measurementDate={data.measurementDate}
                  bodyMoisture={data.bodyMoisture}
                  protein={data.protein}
                  mineral={data.mineral}
                  bodyFat={data.bodyFat}
                  muscleMass={data.muscleMass}
                  bodyFatMass1={data.bodyFatMass1}
                  weight={data.weight}
                  skeletalMuscleMass={data.skeletalMuscleMass}
                  bodyFatMass2={data.bodyFatMass2}
                  BMI={data.BMI}
                  PercentBodyFat={data.PercentBodyFat}
                />
              );
            });
            this.setState({ inbodiesList: items.reverse() });
          }
        );
      });
    });
  };

  handleOnClick = (key) => {
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
              idc={
                this.props.userinfo.loginWhether == 2
                  ? this.props.userinfo.joinNo
                  : this.state.idc === undefined
                  ? 0
                  : this.state.idc
              }
              workoutAllotedView={this.workoutAllotedView}
            />
          );
        });
        this.setState({
          exerciseAllotlist: items,
          headRegion: items[0].props.part,
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
      workoutAllotedSelect(fitness_no, idc).then((result) => {
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
              workoutAllotedView={this.workoutAllotedView}
            />
          );
        });
        this.setState({ workoutAllotlist: items.reverse() });
      });
    });
  };

  render() {
    // console.log(this.state.idc);

    return (
      <div className='wrap'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
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
            <TextField
              id='customer_name'
              label='회원 검색'
              disabled
              variant='standard'
              onClick={() => this.setState({ open: true })}
              className='boxmorpsm bg-white h-100 w-100 text-center pb-2 px-5'
              InputProps={{ disableUnderline: true }}
              value={this.state.client_name}
            />
          )}

          {this.state.client_name ? (
            <div>
              <div>
                {this.state.inbodiesList[0]
                  ? this.state.inbodiesList[0]
                  : '등록된 인바디 정보가 없습니다.'}
              </div>
              <Row className='sectionGlass'>
                <Col xs={12}>
                  <h3>
                    <span className='text-primary'>
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
                    </span>
                    운동 선택
                  </h3>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(1)}
                  >
                    상체
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(18)}
                  >
                    하체
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(28)}
                  >
                    전신
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(38)}
                  >
                    코어
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(48)}
                  >
                    유산소
                  </Button>
                </Col>
                <Col xs={2}>
                  <Button
                    className='w-100'
                    onClick={() => this.handleOnClick(58)}
                  >
                    기타
                  </Button>
                </Col>
                <Col xs={12} className='mt-2'>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell scope='col'>운동 부위</TableCell>
                        <TableCell scope='col'>운동 이름</TableCell>
                        <TableCell scope='col'>운동 기구</TableCell>
                        <TableCell scope='col'>세트</TableCell>
                        <TableCell scope='col'>횟수</TableCell>
                        <TableCell scope='col'>쉬는시간</TableCell>
                        <TableCell scope='col'>url</TableCell>
                        <TableCell scope='col'>선택</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.exerciseAllotlist}</TableBody>
                  </Table>
                </Col>
              </Row>
              <Row className='sectionGlass'>
                <h3>
                  {this.state.client_name}
                  <span className='fs-5'>님에게 배정된 운동 목록입니다</span>
                </h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>운동 이름</TableCell>
                      <TableCell scope='col'>운동 부위</TableCell>
                      <TableCell scope='col'>운동 기구</TableCell>
                      <TableCell scope='col'>세트</TableCell>
                      <TableCell scope='col'>횟수</TableCell>
                      <TableCell scope='col'>쉬는시간</TableCell>
                      <TableCell scope='col'>url</TableCell>
                      <TableCell scope='col'>삭제</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.workoutAllotlist
                      ? this.state.workoutAllotlist
                      : '배정된 운동목록이 없습니다.'}
                  </TableBody>
                </Table>
              </Row>
            </div>
          ) : null}
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
