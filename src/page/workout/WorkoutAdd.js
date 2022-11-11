import { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  selectTrainerReservation,
  workoutInsert,
  workoutSelect,
} from '../../api/user';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import MobNavigation from '../../component/navigation/MobNavigation';
import Navigation from '../../component/navigation/Navigation';
//css
import '../../styles/workout/workoutAlloted.css';
import '../../styles/workout/workoutAdd.css';

// Bootstrap
import { Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// MUI 테이블
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
import { TablePagination } from '@mui/material';

// React icons
import { TbMoodSuprised } from 'react-icons/tb';
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

  return (
    <>
      <TableRow>
        <TableCell>{region}</TableCell>
        <TableCell>{workout}</TableCell>
        <TableCell>{machine}</TableCell>
        <TableCell>{default_set}</TableCell>
        <TableCell>{default_count}</TableCell>
        <TableCell>{default_rest}</TableCell>
        <TableCell>{url}</TableCell>
        <TableCell
          /* onClick={} 기능추가 */
          className='workout-alloted__selected--cencel'
        >
          <GiCancel className='fs-2' />
        </TableCell>
      </TableRow>
    </>
  );
};

class WorkoutAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workout: '',
      part: '',
      machine: '',
      default_set: 3,
      default_count: 8,
      default_rest: 30,
      url: 'https://',
      radioGroup: {
        region1: true,
        region2: false,
        region3: false,
        region4: false,
        region5: false,
        region6: false,
      },
      headRegion: '',
      workoutlist: [],
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
        this.handleOnClick(1);
      }
    });
  }
  workoutAdd = () => {
    workoutInsert(
      this.props.userinfo.fitness_no,
      this.state.workout,
      this.state.radioGroup.region1
        ? 1
        : this.state.radioGroup.region2
        ? 18
        : this.state.radioGroup.region3
        ? 28
        : this.state.radioGroup.region4
        ? 38
        : this.state.radioGroup.region5
        ? 48
        : this.state.radioGroup.region6
        ? 58
        : 1,
      this.state.machine,
      this.state.default_set,
      this.state.default_count,
      this.state.default_rest,
      this.state.url
    ).then((res) => {
      this.handleOnClick(
        this.state.radioGroup.region1
          ? 1
          : this.state.radioGroup.region2
          ? 18
          : this.state.radioGroup.region3
          ? 28
          : this.state.radioGroup.region4
          ? 38
          : this.state.radioGroup.region5
          ? 48
          : this.state.radioGroup.region6
          ? 58
          : 1
      );
      alert(this.state.workout + '운동이 설정됩니다.');
      this.setState({
        workout: '',
        radioGroup: '',
        machine: '',
        default_set: 3,
        default_count: 8,
        default_rest: 30,
        url: 'https://',
      });
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleRegionRadio = (r) => {
    let obj = {
      region1: false,
      region2: false,
      region3: false,
      region4: false,
      region5: false,
      region6: false,
    };
    obj[r.target.id] = r.target.checked;
    this.setState({
      radioGroup: obj,
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
            />
          );
        });
        this.setState({
          workoutlist: items.reverse(),
          headRegion: key,
        });
        // console.log(this.state.workoutlist);
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
    // console.log(this.state.headRegion);
    return (
      <div className='wrap workout-add'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MobNavigation goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>운동 만들기
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutAdd'>운동 만들기</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
          <Button variant='secondary' onClick={this.goWorkout}>
            돌아가기
          </Button>
          <Row className='sectionGlass workout-create'>
            <Col md={12}>
              <h3 className='mb-4'>운동 만들기</h3>
            </Col>
            <Col md={2}>
              <h5>운동부위</h5>
            </Col>
            <Col md={10} className='d-flex justify-content-between'>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region1'
                  checked={this.state.radioGroup['region1']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region1' className='w-100'>
                  상체
                </Form.Check.Label>
              </Form.Check>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region2'
                  checked={this.state.radioGroup['region2']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region2' className='w-100'>
                  하체
                </Form.Check.Label>
              </Form.Check>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region3'
                  checked={this.state.radioGroup['region3']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region3' className='w-100'>
                  전신
                </Form.Check.Label>
              </Form.Check>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region4'
                  checked={this.state.radioGroup['region4']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region4' className='w-100'>
                  코어
                </Form.Check.Label>
              </Form.Check>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region5'
                  checked={this.state.radioGroup['region5']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region5' className='w-100'>
                  유산소
                </Form.Check.Label>
              </Form.Check>
              <Form.Check>
                <Form.Check.Input
                  type='radio'
                  id='region6'
                  checked={this.state.radioGroup['region6']}
                  onChange={this.handleRegionRadio}
                />
                <Form.Check.Label htmlFor='region6' className='w-100'>
                  기타
                </Form.Check.Label>
              </Form.Check>
            </Col>
            <Col md={2}>
              <h5>운동명</h5>
            </Col>
            <Col md={10} className='mb-4'>
              <Form.Control
                placeholder='운동명을 입력해주세요'
                value={this.state.workout}
                id='workout'
                onChange={this.handleChange}
              ></Form.Control>
            </Col>
            <Col md={2}>
              <h5>기구</h5>
            </Col>
            <Col md={10} className='mb-4'>
              <Form.Control
                placeholder='사용할 기구를 입력해주세요'
                value={this.state.machine}
                id='machine'
                onChange={this.handleChange}
              ></Form.Control>
            </Col>
            <Col md={2}>
              <h5>반복</h5>
            </Col>
            <Col md={10} className='mb-4'>
              <Row>
                <Col>
                  <Form.Control
                    placeholder='세트(숫자만 입력)'
                    type='number'
                    /* value={this.state.default_set} */
                    id='default_set'
                    onChange={this.handleChange}
                  ></Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    placeholder='횟수(숫자만 입력)'
                    type='number'
                    /* value={this.state.default_count} */
                    id='default_count'
                    onChange={this.handleChange}
                  ></Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    placeholder='휴식(숫자만 입력)'
                    type='number'
                    /* value={this.state.default_rest} */
                    id='default_rest'
                    onChange={this.handleChange}
                  ></Form.Control>
                </Col>
              </Row>
            </Col>
            <Col md={2} className=''>
              <h5>링크</h5>
            </Col>
            <Col md={10}>
              <Form.Control
                placeholder='URL 링크를 입력해주세요'
                /* value={this.state.url} */
                id='url'
                onChange={this.handleChange}
              ></Form.Control>
            </Col>
            <Col md={12} className='text-center pt-3'>
              <Button className='btn-primary' onClick={this.workoutAdd}>
                운동 만들기
              </Button>
            </Col>
          </Row>
          <Row className='sectionGlass'>
            <Col xs={12} className='pageTit mb-3'>
              <h4>
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
                운동 목록
              </h4>
            </Col>
            <Col>
              <Row className='workoutTabs text-center'>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    id='danger-outlined'
                    onClick={() => this.handleOnClick(1)}
                  >
                    상체
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    id='danger-outlined'
                    onClick={() => this.handleOnClick(18)}
                  >
                    하체
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(28)}
                  >
                    전신
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(38)}
                  >
                    코어
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(48)}
                  >
                    유산소
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='radio'
                    className='btn-table'
                    variant='btn-table'
                    onClick={() => this.handleOnClick(58)}
                  >
                    기타
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <TableContainer
                    className='stage-add--workout-exercise-list'
                    component={Paper}
                  >
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
                            삭제
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.workoutlist.length === 0
                          ? ''
                          : this.state.workoutlist.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )}
                      </TableBody>
                    </Table>
                    {this.state.workoutlist.length === 0 ? (
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
const WorkoutAddStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const WorkoutAddDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  WorkoutAddStateToProps,
  WorkoutAddDispatchToProps
)(WorkoutAdd);
