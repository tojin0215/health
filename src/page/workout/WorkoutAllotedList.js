import { Component } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import UserSearch from '../../component/customer/UserSearch';
import { TextField } from '@mui/material';
import {
  inbodiesSelect,
  selectClientReservation,
  selectTrainerReservation,
  workoutAllotedSelect,
} from '../../api/user';
import Footer from '../../component/footer/Footer';
const InbodiesView = ({ client_name, height, weight, bodyFat, muscleMass }) => {
  return (
    <div>
      {client_name}님 운동배정/키{height}cm/체중{weight}kg/체지방{bodyFat}
      kg/근육량{muscleMass}
      kg
    </div>
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
    <tr>
      <td>{workout}</td>
      <td>{region}</td>
      <td>{machine}</td>
      <td>{default_set}</td>
      <td>{default_count}</td>
      <td>{default_rest}</td>
      <td>{url}</td>
    </tr>
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
                    this.state.line === 1
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
          this.setState({ workoutAllotlist: items });
        });
      });
    });
  };

  render() {
    // console.log(this.state.client_name2);
    // console.log(this.props.userinfo.manager_name);
    // console.log(this.props.userinfo.loginWhether);
    // console.log(this.state.exerciseAllotlist);
    // console.log(this.state.idc2);
    // console.log(this.state.line);
    return (
      <div>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>새 운동배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutAllotedList'>새 배정된 운동배정</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          {this.state.line === 1 ? (
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
          {this.state.client_name ? (
            <div>
              <div>
                <h1> 인바디</h1>
                {this.state.inbodiesList[0]
                  ? this.state.inbodiesList[0]
                  : '등록된 인바디가 없습니다.'}
              </div>
              <div>
                <h1>{this.state.client_name}님의 운동 배정된 목록</h1>
                <table class='table'>
                  <tr>
                    <th scope='col'>운동 이름</th>
                    <th scope='col'>운동 부위</th>
                    <th scope='col'>운동 기구</th>
                    <th scope='col'>세트</th>
                    <th scope='col'>회수</th>
                    <th scope='col'>쉬는시간</th>
                    <th scope='col'>url</th>
                  </tr>
                  {this.state.workoutAllotlist}
                </table>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
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
