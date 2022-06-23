import { TableCell, TableHead, TableRow } from '@mui/material';
import { Component, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import {
  selectTrainerReservation,
  workoutSelect,
  workoutStageInsert,
  workoutStageSelect,
} from '../../api/user';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';

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
  const [stage_input, setStage_input] = useState(stage);
  const plusStage = () => {
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
      alert(stageWord + '에 묶음 운동이 설정되었습니다.');
    });
  };
  console.log('stage', stage);
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
    <>
      <TableRow>
        {/* <TableCell>{stage}</TableCell> */}
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
        <TableCell onClick={plusStage}>
          <button>+</button>
        </TableCell>
      </TableRow>
    </>
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
      </TableRow>
    </>
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
  handleOnClick = (key) => {
    console.log('workout', this.state.stage);
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
          headRegion: items[0].props.part,
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
            />
          );
        });
        this.setState({
          workoutStage: items.reverse(),
        });
        this.handleOnClick(1);
        // console.log(items[0].props.part);
      });
    });
  };

  stageOnClick = (s) => {
    this.setState({
      stage: s,
    });
    this.workoutStageView(s);
    console.log('workoutStageView', s);
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
  render() {
    console.log('stage', this.state.stage);

    return (
      <div className='wrap'>
        {' '}
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>묶음 운동 설정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutStageAdd'>묶음 운동 설정</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
          {this.state.nextStage1 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(111)}>1</Button>
                <Button onClick={() => this.stageOnClick(112)}>2</Button>
                <Button onClick={() => this.stageOnClick(113)}>3</Button>
                <Button onClick={() => this.stageOnClick(114)}>4</Button>
                <Button onClick={() => this.stageOnClick(115)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage1: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
          ) : this.state.nextStage2 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(211)}>1</Button>
                <Button onClick={() => this.stageOnClick(212)}>2</Button>
                <Button onClick={() => this.stageOnClick(213)}>3</Button>
                <Button onClick={() => this.stageOnClick(214)}>4</Button>
                <Button onClick={() => this.stageOnClick(215)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage2: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
          ) : this.state.nextStage3 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(311)}>1</Button>
                <Button onClick={() => this.stageOnClick(312)}>2</Button>
                <Button onClick={() => this.stageOnClick(313)}>3</Button>
                <Button onClick={() => this.stageOnClick(314)}>4</Button>
                <Button onClick={() => this.stageOnClick(315)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage3: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
          ) : this.state.nextStage4 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(411)}>1</Button>
                <Button onClick={() => this.stageOnClick(412)}>2</Button>
                <Button onClick={() => this.stageOnClick(413)}>3</Button>
                <Button onClick={() => this.stageOnClick(414)}>4</Button>
                <Button onClick={() => this.stageOnClick(415)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage4: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
          ) : this.state.nextStage5 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(511)}>1</Button>
                <Button onClick={() => this.stageOnClick(512)}>2</Button>
                <Button onClick={() => this.stageOnClick(513)}>3</Button>
                <Button onClick={() => this.stageOnClick(514)}>4</Button>
                <Button onClick={() => this.stageOnClick(515)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage5: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
          ) : this.state.nextStage6 ? (
            <div>
              <div>
                <Button onClick={() => this.stageOnClick(611)}>1</Button>
                <Button onClick={() => this.stageOnClick(612)}>2</Button>
                <Button onClick={() => this.stageOnClick(613)}>3</Button>
                <Button onClick={() => this.stageOnClick(614)}>4</Button>
                <Button onClick={() => this.stageOnClick(615)}>5</Button>
              </div>
              <Link
                to={{
                  pathname: '/workoutStageAdd',
                }}
                onClick={() => this.setState({ nextStage6: '' })}
              >
                다시단계선택하기
              </Link>
              <Col xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col'>단계</TableCell>
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
                {/* <button onClick={() => this.stageOnClick(11)}>
                  1단계 기존바꿔야됨
                </button> */}
                <Button onClick={() => this.stageOnClickStage()}>상체</Button>
              </div>
              <div>
                <Button onClick={() => this.stageOnClickStage2()}>하체</Button>
              </div>
              <div>
                <Button onClick={() => this.stageOnClickStage3()}>전신</Button>
              </div>
              <div>
                <Button onClick={() => this.stageOnClickStage4()}>코어</Button>
              </div>
              <div>
                <Button onClick={() => this.stageOnClickStage5()}>
                  유산소
                </Button>
              </div>
              <div>
                <Button onClick={() => this.stageOnClickStage6()}>기타</Button>
              </div>
            </div>
          )}

          <Row className='mt-4' xs={6}>
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
                운동 목록
              </h3>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(1)}
              >
                상체
              </Button>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(18)}
              >
                하체
              </Button>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(28)}
              >
                전신
              </Button>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(38)}
              >
                코어
              </Button>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(48)}
              >
                유산소
              </Button>
            </Col>
            <Col>
              <Button
                className='w-100'
                variant='outline-primary'
                onClick={() => this.handleOnClick(58)}
              >
                기타
              </Button>
            </Col>
          </Row>
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
            {this.state.workoutlist ? this.state.workoutlist : ''}
          </Table>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
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
