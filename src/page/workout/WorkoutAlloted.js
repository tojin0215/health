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

//bootstrap
import { Container, Row, Col, FloatingLabel } from 'react-bootstrap';
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

const InbodiesView = ({ client_name, height, weight, bodyFat, muscleMass }) => {
  return (
    <Row className=''>
      <Col xs={6} md={3}>
        <h5>키</h5>
        <span className='fs-5 fw-bold'>{height}</span>
        <span> cm</span>
      </Col>
      <Col xs={6} md={3}>
        <h5>체중</h5>
        <span className='fs-5 fw-bold'>{weight}</span>
        <span> kg</span>
      </Col>
      <Col xs={6} md={3}>
        <h5>체지방</h5>
        <span className='fs-5 fw-bold'>{bodyFat}</span>
        <span> kg</span>
      </Col>
      <Col xs={6} md={3}>
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
  workoutA_date,
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
      url_input,
      workoutA_date_input
    ).then((res) => {
      setDefault_set_input(default_set);
      setDefault_count_input(default_count);
      setDefault_rest_input(default_rest);
      setUrl_input(url);
      setWorkoutA_date(moment(workoutA_date).format('YYYY-MM-DD'));
      workoutAllotedView(idc);
      alert(workoutA_date_input);
      // alert(workout + '운동이 배정됩니다.');
    });
  };
  const [default_set_input, setDefault_set_input] = useState(default_set);
  const [default_count_input, setDefault_count_input] = useState(default_count);
  const [default_rest_input, setDefault_rest_input] = useState(default_rest);
  const [url_input, setUrl_input] = useState(url);
  const [workoutA_date_input, setWorkoutA_date] = useState(
    moment(workoutA_date).format('YYYY-MM-DD')
  );
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
      <TableCell
        className='workout-alloted__select--plus cursor-pointer'
        onClick={plusTable}
      >
        <HiOutlinePlusCircle className='fs-1' />
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
      <TableCell
        onClick={() =>
          confirm('정말 삭제하시겠습니까?') == true
            ? hadndleDelete(idwa)
            : alert('삭제가 취소 되었습니다.')
        }
        className='workout-alloted__selected--cencel'
      >
        <MdCancel className='fs-2' />
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
      page: 0,
      rowsPerPage: 5,
      workoutA_date: new Date(),
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
    this.handleOnClick(1);
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

  /**운동선택 클릭시 운동테이블 ex)상체->상체 테이블 */
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
              workoutA_date={this.state.workoutA_date}
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
              workoutAllotedView={this.workoutAllotedView}
            />
          );
        });
        this.setState({ workoutAllotlist: items.reverse() });
      });
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

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

          {this.state.client_name ? (
            <div>
              asd
              <Col className='text-center height-fit-content' xs={12} sm={4}>
                <label className='d-block w-100'>
                  <DatePicker
                    className='boxmorpsm text-center w-100 border-0'
                    selected={this.state.workoutA_date}
                    onChange={(date) => this.setState({ workoutA_date: date })}
                    dateFormat='yyyy-MM-dd(eee)'
                    font-size='1.6rem'
                    // locale 오류로 임시 삭제
                    // locale='ko'
                    minDate={new Date()}
                  />
                </label>
                <Button
                  onClick={() => {
                    this.workoutAllotedView(this.state.idc);
                  }}
                >
                  날짜선택완료
                </Button>
              </Col>
              <div className='mt-4 sectionGlass'>
                <h3>
                  {this.state.client_name}
                  <span className='fs-4'> 님</span>
                  <span className='fs-5 fw-light'>
                    의 마지막 인바디 기록입니다.
                  </span>
                </h3>
                {this.state.inbodiesList[0] ? (
                  this.state.inbodiesList[0]
                ) : (
                  <div className='p-3 fs-5 fw-bold text-center'>
                    <TbMoodSuprised className='fs-3' />
                    <p>등록된 인바디 정보가 없습니다.</p>
                  </div>
                )}
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
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(1)}
                  >
                    상체
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(18)}
                  >
                    하체
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(28)}
                  >
                    전신
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(38)}
                  >
                    코어
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(48)}
                  >
                    유산소
                  </Button>
                </Col>
                <Col xs={6} md={2}>
                  <Button
                    className='w-100'
                    variant='outline-primary'
                    onClick={() => this.handleOnClick(58)}
                  >
                    기타
                  </Button>
                </Col>
                <Col xs={12} className='mt-2'>
                  <TableContainer component={Paper}>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell scope='col'>운동 부위</TableCell>
                          <TableCell scope='col'>운동 이름</TableCell>
                          <TableCell scope='col'>운동 기구</TableCell>
                          <TableCell scope='col'>세트</TableCell>
                          <TableCell scope='col'>횟수</TableCell>
                          <TableCell scope='col'>쉬는시간</TableCell>
                          <TableCell scope='col'>url</TableCell>
                          <TableCell scope='col' align='center'>
                            배정
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.exerciseAllotlist.slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )}
                      </TableBody>
                    </Table>
                    {this.state.exerciseAllotlist.length === 0 ? (
                      <div className='p-3 fs-5 fw-bold text-center'>
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
                          value: this.state.exerciseAllotlist.length,
                        },
                      ]}
                      count={this.state.exerciseAllotlist.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      onPageChange={this.handleChangePage}
                      onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </Col>
              </Row>
              <Row className='sectionGlass'>
                <Col>
                  <h3>
                    {this.state.client_name}
                    <span className='fs-5'>
                      님의{' '}
                      {moment(this.state.workoutA_date).format(
                        'YYYY년 MM월DD일'
                      )}
                      에 배정된 운동 목록입니다
                    </span>
                  </h3>
                  <TableContainer component={Paper}>
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
                          <TableCell scope='col' align='center'>
                            삭제
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.workoutAllotlist.length === 0
                          ? ''
                          : this.state.workoutAllotlist.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )}
                      </TableBody>
                    </Table>
                    {this.state.workoutAllotlist.length === 0 ? (
                      <div className='p-3 fs-5 fw-bold text-center bg-white text-black'>
                        <TbMoodSuprised className='fs-3' />
                        <p>배정된 운동 목록이 없습니다.</p>
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
