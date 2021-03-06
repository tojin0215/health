import { Component } from 'react';
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
  workoutAllotedSelect,
} from '../../api/user';
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

import { TbMoodSuprised } from 'react-icons/tb';
import { MdPersonSearch } from 'react-icons/md';

const InbodiesView = ({ client_name, height, weight, bodyFat, muscleMass }) => {
  return (
    <Row className=''>
      <Col>
        <h5>키</h5>
        <span className='fs-5 fw-bold'>{height}</span>
        <span>cm</span>
      </Col>
      <Col>
        <h5>체중</h5>
        <span className='fs-5 fw-bold'>{weight}</span>
        <span>kg</span>
      </Col>
      <Col>
        <h5>체지방</h5>
        <span className='fs-5 fw-bold'>{bodyFat}</span>
        <span>kg</span>
      </Col>
      <Col>
        <h5>근육량</h5>
        <span className='fs-5 fw-bold'>{muscleMass}</span>
        <span>kg</span>
      </Col>
    </Row>
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
      <TableCell>{workout}</TableCell>
      <TableCell>{region}</TableCell>
      <TableCell>{machine}</TableCell>
      <TableCell>{default_set}</TableCell>
      <TableCell>{default_count}</TableCell>
      <TableCell>{default_rest}</TableCell>
      <TableCell>{url}</TableCell>
    </TableRow>
  );
};

class WorkoutAllotedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '',
      open: false,
      inbodiesList: [],
      workoutAllotlist: [],
      exerciseAllotlist: [],
      idc2: this.props.location.state.idc2,
      client_name2: this.props.location.state.client_name2,
      line: this.props.location.state.line,
      rowsPerPage: 5,
      page: 0,
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
        this.state.line === 3 ? this.inbodiesView(this.state.idc2) : '';
        this.state.line === 3 ? this.workoutAllotedView(this.state.idc2) : '';
        this.state.line === 1 ? this.inbodiesView(this.state.idc2) : '';
        this.state.line === 1 ? this.workoutAllotedView(this.state.idc2) : '';
        this.props.userinfo.loginWhether === 2
          ? this.inbodiesView(this.props.userinfo.joinNo)
          : '';
        this.props.userinfo.loginWhether === 2
          ? this.workoutAllotedView(this.props.userinfo.joinNo)
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
                  client_name={
                    this.state.line === 1 || this.state.line === 3
                      ? this.state.client_name2
                      : this.props.userinfo.loginWhether === 2
                      ? this.props.userinfo.manager_name
                      : this.state.client_name
                  }
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

  workoutAllotedView = (idc) => {
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
              />
            );
          });
          this.setState({ workoutAllotlist: items.reverse() });
        });
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
    //line은 들어오는 경로 표시 1,2,3을 보내서 받으면 어떻게 되라하는 것
    // console.log(this.state.client_name2);
    // console.log(this.props.userinfo.manager_name);
    // console.log(this.props.userinfo.loginWhether);
    // console.log(this.state.exerciseAllotlist);
    // console.log(this.state.idc2);
    // console.log(this.state.line);
    return (
      <div className='wrap'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>운동 배정 확인
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutAllotedList'>운동 배정 확인</Link>
              </div>
            </div>
          </div>
        </div>
        <Container className='workoutallotedlist__container'>
          {this.state.line === 3 ? (
            <>
              <TextField
                id='customer_name'
                label='회원 검색'
                disabled
                variant='standard'
                className='customer-input--search'
                InputProps={{ disableUnderline: true }}
                value={this.state.client_name2}
              />
            </>
          ) : this.state.line === 1 ? (
            ''
          ) : this.props.userinfo.loginWhether === 2 ? (
            ''
          ) : this.state.open ? (
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
          {this.state.client_name || this.state.client_name2 ? (
            <div>
              <div className='mt-4 sectionGlass'>
                <h3>
                  {this.state.client_name}
                  <span className='fs-4'>님</span>
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
                <h3>
                  <span className='text-primary'>
                    {this.state.client_name || this.state.client_name2}
                  </span>
                  님의 운동 배정 목록
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
              </Row>
            </div>
          ) : (
            ''
          )}
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const WorkoutAllotedListStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutAllotedListDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  WorkoutAllotedListStateToProps,
  WorkoutAllotedListDispatchToProps
)(WorkoutAllotedList);
