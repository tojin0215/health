import { Component, useState } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import UserSearch from '../../component/customer/UserSearch';
import { TextField } from '@mui/material';
import {
  assignexerciseInsert,
  exerciseAllot,
  inbodiesSelect,
  selectClientReservation,
  selectTrainerReservation,
  workoutSelect,
} from '../../api/user';
import { data } from 'jquery';
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

  const [tablePlus, setTablePlus] = useState([
    { region: '', workout: '', machine: '' },
  ]);
  const plusTable = () => {
    setTablePlus((tablePlus) => [
      ...tablePlus,
      {
        region: region,
        workout: workout,
        machine: machine,
      },
    ]);
    // console.log(tablePlus);
  };
  console.log(tablePlus);
  return (
    <>
      <tr>
        <td>{region}</td>
        <td>{workout}</td>
        <td>{machine}</td>
        <td>
          <button onClick={plusTable}>+</button>
        </td>
        <div>
          <table class='table'>
            <tr>
              <th>운동 부위</th>
              <th>운동 이름</th>
              <th>운동 기구</th>
            </tr>
            {tablePlus.map((plus, index) => (
              <tr key={index}>
                <td>{plus.region}</td>
                <td>{plus.workout}</td>
                <td>{plus.machine}</td>
              </tr>
            ))}
          </table>
        </div>
      </tr>
      <Link
        to={{
          pathname: '/exerciseAllotAdd',
          state: {
            client_name: client_name,
            idc: idc,
            tablePlus: tablePlus,
          },
        }}
      >
        <button>등록하기(세부데이터입력set,count,rest)</button>
      </Link>
    </>
  );
};

class ExerciseAllot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '',
      open: false,
      inbodiesList: [],
      assignexerciseAllotlist: [],
      exerciseAllotlist: [],
      tablePlus: [],
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
    const fitness_no = this.props.userinfo.fitness_no;
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
          />
        );
      });
      this.setState({ exerciseAllotlist: items });
      // console.log(result);
    });
  };

  render() {
    console.log(this.state.idc);
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
                <Link to='/exerciseAllot'>새 운동배정</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
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
          <div>
            <h1> 인바디</h1>
            {this.state.inbodiesList[0]
              ? this.state.inbodiesList[0]
              : '등록된 인바디가 없습니다.'}
          </div>
          {this.state.client_name ? (
            <div>
              <div>
                <h1>운동 개별 선택</h1>
                <button onClick={() => this.handleOnClick(1)}>상체</button>
                <button onClick={() => this.handleOnClick(18)}>하체</button>
                <button onClick={() => this.handleOnClick(28)}>전신</button>
                <button onClick={() => this.handleOnClick(38)}>코어</button>
                <button onClick={() => this.handleOnClick(48)}>유산소</button>
                <button onClick={() => this.handleOnClick(58)}>기타</button>
              </div>
              <div>
                <h1>운동 개별 선택된 것 목록</h1>
                <table class='table'>
                  <tr>
                    <th scope='col'>운동 부위</th>
                    <th scope='col'>운동 이름</th>
                    <th scope='col'>운동 기구</th>
                    <th scope='col'>선택</th>
                  </tr>
                  {this.state.exerciseAllotlist
                    ? this.state.exerciseAllotlist
                    : ''}
                </table>
              </div>
            </div>
          ) : null}
        </div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const ExerciseAllotStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ExerciseAllotDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  ExerciseAllotStateToProps,
  ExerciseAllotDispatchToProps
)(ExerciseAllot);
