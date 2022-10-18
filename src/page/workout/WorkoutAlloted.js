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
import '../../styles/workout/workoutAlloted.css';
//bootstrap
import { Container, Row, Col } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TabContainer from 'react-bootstrap/TabContainer';
import TabPane from 'react-bootstrap/TabPane';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// mui
import { ConstructionOutlined, Refresh } from '@mui/icons-material';
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

//mui-
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';

// 리액트 아이콘
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { TbMoodSuprised } from 'react-icons/tb';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';
import { BsCalendarCheck } from 'react-icons/bs';

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
  handleOnClick,
  close,
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
  console.log('region 입니다', region);
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
      setWorkoutA_date(workoutA_date_input);
      workoutAllotedView(idc);
      // close();
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

  // console.log('exerciseAllotlist', workoutAllotedView);
  return (
    <>
      {/* {this.state.exerciseAllotlist.length ? ( */}
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
      {/* ) : (
         ''
       )} */}
    </>
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
      <TableCell>{region}</TableCell>
      <TableCell>{workout}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
      <TableCell
        onClick={() => hadndleDelete(idwa)}
        className='workout-alloted__selected--cencel'
      >
        <GiCancel className='fs-2' />
      </TableCell>
    </TableRow>
  );
};

class WorkoutAlloted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '회원 검색',
      open: false,
      inbodiesList: [],
      assignexerciseAllotlist: [],
      exerciseAllotlist: [],
      tablePlus: [],
      workoutAllotlist: [],
      headRegion: 1,
      // Region: 1,
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
  goWorkout = () => {
    this.props.history.push('/workout');
  };
  goWorkoutAdd = () => {
    this.props.history.push('/workoutAdd');
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
    // this.handleOnClick(1);
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
      this.workoutAllotedView(this.state.idc);
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
        console.log('result 입니다', result);
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
        // console.log(this.state.workoutA_date);
      });
    });
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

  dateOnChange = (date) => {
    this.setState({ workoutA_date: date, asd: 1 });
    this.workoutAllotedView(this.state.idc);
  };
  // handleSelect(key) {
  //   {
  //     alert('선택되었습니다. ' + key);
  //     this.state.handleOnClick(1);
  //   }
  // }

  UserSearchOpen = () => {
    this.handleOnClick(1);
    this.setState({ open: true });
  };

  render() {
    console.log('headRegion 입니다', this.state.headRegion);
    console.log('Region 입니다', this.state.Region);
    // console.log('idc 입니다', this.state.idc);
    console.log('exerciseAllotlist 입니다', this.state.exerciseAllotlist);
    // console.log('workoutA_date 입니다', this.state.workoutA_date);

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
          <Button variant='secondary' className='mb-3' onClick={this.goWorkout}>
            돌아가기
          </Button>
          <div className='clientSearch'>
            <h4>커스텀 루틴 배정</h4>
            <div>
              {this.state.client_name == '회원 검색' ? (
                <span>회원을 선택해주세요</span>
              ) : (
                ''
              )}
              <div
                className='customer_name'
                onClick={() => this.UserSearchOpen()}
              >
                <TextField
                  id='customer_name'
                  disabled
                  variant='standard'
                  className='customer-input--search'
                  InputProps={{
                    disableUnderline: true,
                  }}
                  value={this.state.client_name}
                />
              </div>
              {this.state.client_name == '회원 검색' ? (
                ''
              ) : (
                <>
                  <span>회원님의</span>
                  <DatePicker
                    className='text-center'
                    selected={this.state.workoutA_date}
                    onChange={(date) => this.dateOnChange(date)}
                    dateFormat='yyyy년 MM월 dd일'
                    minDate={new Date()}
                  />
                  <span>맞춤형 운동 배정입니다.</span>
                </>
              )}
            </div>
          </div>
          <UserSearch
            open={this.state.open}
            setOpen={(o) => this.setState({ open: o })}
            fitness_no={this.props.userinfo.fitness_no}
            loginWhether={this.props.userinfo.loginWhether}
            joinNo={this.props.userinfo.joinNo}
            handleUser={this.handleUser}
          />
          {/* <div>
            <Tabs
              defaultActiveKey='1'
              id='exercise-part-tab'
              onSelect={this.handleSelect}
            >
              <Tab
                eventKey='1'
                title='상체'
                onClick={() => this.handleOnClick(1)}
              >
                <TabContainer>
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
                        <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
                </TabContainer>
              </Tab>
              <Tab
                eventKey='18'
                title='하체'
                // onSelect={this.handleOnClick(18)}
                onClick={() => this.handleSelect(18)}
              >
                <TabContainer>
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
                        <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
                </TabContainer>
              </Tab>
              <Tab
                eventKey='28'
                title='전신'
                onClick={() => this.handleOnClick(28)}
              >
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
                      <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
              </Tab>
              <Tab
                eventKey='38'
                title='코어'
                onClick={() => this.handleOnClick(38)}
              >
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
                      <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
              </Tab>
              <Tab
                eventKey='48'
                title='유산소'
                onClick={() => this.handleOnClick(48)}
              >
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
                      <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
              </Tab>
              <Tab
                eventKey='58'
                title='기타'
                onClick={() => this.handleOnClick(58)}
              >
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
                      <p>운동을 선택하거나 설정된 운동이 없습니다.</p>
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
              </Tab>
            </Tabs>
          </div> */}
          <div>
            {/* <div> */}
            {/* <div className='mt-4 sectionGlass'>
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
                </div> */}
            {/* {this.state.asd === 1 ? ( */}
            {/* </div> */}
            <Row className='sectionGlass'>
              <Col xs={12}>
                <div className='pageTit'>
                  <div>
                    <div>
                      <h4>
                        <span>
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
                            : '부위가 선택되지 않은 '}
                        </span>
                        운동목록
                      </h4>
                      <p>설정된 운동목록입니다. 회원에게 배정해주세요.</p>
                    </div>
                    <Button variant='secondary' onClick={this.goWorkoutAdd}>
                      운동설정
                    </Button>
                  </div>
                </div>
              </Col>
              <Col className='mt-2'>
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
                  <Col>
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
                      {this.state.exerciseAllotlist.slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                      )}
                    </TableBody>
                  </Table>
                  {this.state.exerciseAllotlist.length == 0 &&
                  this.state.client_name == '회원 검색' ? (
                    <div className='p-5 fs-5 fw-bold text-center'>
                      <TbMoodSuprised className='fs-3' />
                      <p>배정할 회원을 먼저 선택해주세요.</p>
                    </div>
                  ) : this.state.exerciseAllotlist.length == 0 ? (
                    <div className='p-5 fs-5 fw-bold text-center'>
                      <TbMoodSuprised className='fs-3' />
                      <p>등록된 운동이 없습니다.</p>
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
            {this.state.client_name == '회원 검색' ? (
              ''
            ) : (
              <Row className='sectionGlass'>
                <Col>
                  <h5>
                    <strong>{this.state.client_name}</strong>
                    님의
                    <strong>
                      {' '}
                      {moment(this.state.workoutA_date).format(
                        'YYYY년 MM월DD일'
                      )}
                    </strong>
                    에 배정된 운동 목록입니다
                  </h5>
                  <TableContainer component={Paper}>
                    <Table className='table-light'>
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
                      <div className='p-5 fs-5 fw-bold text-center bg-white text-black'>
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
            )}
          </div>
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
