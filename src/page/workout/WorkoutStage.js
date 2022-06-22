import { Menu, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { Component } from 'react';
import { Col, Container, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  selectTrainerReservation,
  workoutAllotedInsert,
  workoutStageSelect,
} from '../../api/user';
import UserSearch from '../../component/customer/UserSearch';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';

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
      </TableRow>
    </>
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
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      this.state.workoutStage.map((data, index, array) => {
        console.log(this.state.workoutStage);
        this.setState({
          workout: data.props.workout,
          part: data.props.part,
          machine: data.props.machine,
          default_set: data.props.default_set,
          default_count: data.props.default_count,
          default_rest: data.props.default_rest,
          url: data.props.url,
        });
        console.log(this.state.workout);
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
          this.state.url
        ).then((res) => {
          // console.log(this.state.workout);
          this.props.history.push({
            pathname: '/workoutAllotedList',
            state: {
              client_name2: this.state.client_name,
              idc2: this.state.idc,
              line: 3,
            },
          });
        });
      });
    });
  };

  render() {
    // console.log(this.state.stage);
    // console.log(this.state.idc); //idc=client_no
    // console.log(this.state.workoutStage);
    // console.log(this.state.workout);
    console.log(this.state.client_name);

    return (
      <div>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>묶음 운동 배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutStage'>묶음 운동 배정</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
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
              className='boxmorpsm h-100 w-100 text-center pb-2 px-5'
              InputProps={{ disableUnderline: true }}
              value={this.state.client_name}
            />
          )}

          {this.state.stage ? (
            <div>
              <div>
                {this.state.stage === 1
                  ? '1단계'
                  : this.state.stage === 21
                  ? '2단계'
                  : this.state.stage === 31
                  ? '3단계'
                  : this.state.stage === 41
                  ? '4단계'
                  : this.state.stage === 51
                  ? '5단계'
                  : '1단계'}
              </div>

              <Link
                to={{
                  pathname: '/workoutStage',
                }}
                onClick={() => this.setState({ stage: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <button onClick={this.alloted}>배정하기</button>
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
                    </TableRow>
                  </TableHead>
                  {this.state.workoutStage ? this.state.workoutStage : ''}
                </Table>
              </Col>
            </div>
          ) : (
            <div>
              <div>
                <button onClick={() => this.stageOnClick(11)}>1단계</button>
              </div>
              <div>
                <button onClick={() => this.stageOnClick(21)}>2단계</button>
              </div>
              <div>
                <button onClick={() => this.stageOnClick(31)}>3단계</button>
              </div>
              <div>
                <button onClick={() => this.stageOnClick(41)}>4단계</button>
              </div>
              <div>
                <button onClick={() => this.stageOnClick(51)}>5단계</button>
              </div>
            </div>
          )}
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
