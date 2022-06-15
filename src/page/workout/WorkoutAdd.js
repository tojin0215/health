import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import { workoutInsert } from '../../api/user';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';

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
      alert('workoutInsert');
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
  render() {
    return (
      <div>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>새 운동설정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/workoutAdd'>새 운동설정</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          <table>
            <tr>
              <th>workout</th>
              <th>part</th>
              <th>machine</th>
            </tr>
            <tr>
              <td>
                <input
                  value={this.state.workout}
                  id='workout'
                  onChange={this.handleChange}
                />
              </td>
              <td>
                상체
                <input
                  type='radio'
                  id='region1'
                  checked={this.state.radioGroup['region1']}
                  onChange={this.handleRegionRadio}
                />
                하체
                <input
                  type='radio'
                  id='region2'
                  checked={this.state.radioGroup['region2']}
                  onChange={this.handleRegionRadio}
                />
                전신
                <input
                  type='radio'
                  id='region3'
                  checked={this.state.radioGroup['region3']}
                  onChange={this.handleRegionRadio}
                />
                코어
                <input
                  type='radio'
                  id='region4'
                  checked={this.state.radioGroup['region4']}
                  onChange={this.handleRegionRadio}
                />
                유산소
                <input
                  type='radio'
                  id='region5'
                  checked={this.state.radioGroup['region5']}
                  onChange={this.handleRegionRadio}
                />
                기타
                <input
                  type='radio'
                  id='region6'
                  checked={this.state.radioGroup['region6']}
                  onChange={this.handleRegionRadio}
                />
              </td>
              <td>
                <input
                  value={this.state.machine}
                  id='machine'
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </table>
          <table>
            <tr>
              <th>default_set</th>
              <th>default_count</th>
              <th>default_rest</th>
              <th>url</th>
            </tr>
            <tr>
              <td>
                <input
                  type='number'
                  value={this.state.default_set}
                  id='default_set'
                  onChange={this.handleChange}
                />
              </td>
              <td>
                <input
                  type='number'
                  value={this.state.default_count}
                  id='default_count'
                  onChange={this.handleChange}
                />
              </td>
              <td>
                <input
                  type='number'
                  value={this.state.default_rest}
                  id='default_rest'
                  onChange={this.handleChange}
                />
              </td>
              <td>
                <input
                  value={this.state.url}
                  id='url'
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </table>
          <button onClick={this.workoutAdd}>운동 설정</button>
        </div>

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
