import { Menu, TableCell, TableHead, TableRow } from '@mui/material';
import { Component } from 'react';
import { Col, Container, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import { selectTrainerReservation, workoutStageSelect } from '../../api/user';
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
        {/* <TableCell>{stage}</TableCell> */}
        <TableCell>{region}</TableCell>
        <TableCell>{workout}</TableCell>
        <TableCell>{machine}</TableCell>
        <TableCell>{default_set}</TableCell>
        <TableCell>{default_count}</TableCell>
        <TableCell>{default_rest}</TableCell>
        <TableCell>{url}</TableCell>
        <TableCell>배정</TableCell>
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

  render() {
    console.log(this.state.stage);
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
              <div onClick={() => window.location.replace('/workoutStage')}>
                다시단계선택하기
              </div>
              <Col xs={12}>
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
                      <TableCell scope='col'>배정</TableCell>
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
