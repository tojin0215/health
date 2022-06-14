import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Footer from '../../component/footer/Footer';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';
// react-bootstrap
import { Row, Col, Container, Tabs, Tab, Button } from 'react-bootstrap';
import { workoutAllotedInsert } from '../../api/user';

class ExerciseAllotAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // member_no: Number(this.props.location.state.member_no),
      inbody_no: this.props.location.state.inbody_no,
      idc: this.props.location.state.idc,
      tablePlus: this.props.location.state.tablePlus,
      client_name: this.props.location.state.client_name,
      rest: 30,
      set: 3,
      count: 8,
      url: null,
    };
  }
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
      }
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  workoutPost = () => {
    this.state.tablePlus
      .filter(
        (value) => value.region != '',
        (value) => value.workout != '',
        (value) => value.machine != ''
      )
      .map((plus) =>
        workoutAllotedInsert(
          this.props.userinfo.fitness_no,
          this.state.idc,
          plus.workout,
          plus.region,
          plus.machine,
          this.state.set,
          this.state.count,
          this.state.rest,
          this.state.url
        ).then((res) => {
          console.log(this.state.idc);
          alert('workoutAllotedInsert');
        })
      );
  };
  render() {
    // console.log(this.props.userinfo.fitness_no);
    console.log(this.state.idc);
    // console.log(this.state.tablePlus);
    return (
      <div>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>새 운동배정insert
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/exerciseAllotAdd'>새 운동배정insert</Link>
              </div>
            </div>
          </div>
        </div>
        <Container>
          <div>
            {this.state.client_name}님
            <table>
              <tr>
                <th>운동 부위</th>
                <th>운동 이름</th>
                <th>운동 기구</th>
                <th>set</th>
                <th>count</th>
                <th>rest</th>
                <th>url</th>
              </tr>
              {this.state.tablePlus
                .filter(
                  (value) => value.region != '',
                  (value) => value.workout != '',
                  (value) => value.machine != ''
                )
                .map((plus, index) => (
                  <tr key={index}>
                    <td>
                      <input value={plus.region} />
                    </td>
                    <td>
                      <input value={plus.workout} />
                    </td>
                    <td>
                      <input value={plus.machine} />
                    </td>
                    <td>
                      <input
                        type='number'
                        value={this.state.set}
                        id='set'
                        onChange={this.handleChange}
                      />
                      세트
                    </td>
                    <td>
                      <input
                        type='number'
                        value={this.state.count}
                        id='count'
                        onChange={this.handleChange}
                      />
                      회
                    </td>
                    <td>
                      <input
                        type='number'
                        value={this.state.rest}
                        id='rest'
                        onChange={this.handleChange}
                      />
                      초
                    </td>
                    <td>
                      <input
                        type='text'
                        value={this.state.url}
                        id='url'
                        onChange={this.handleChange}
                      />
                    </td>
                  </tr>
                ))}
              <button onClick={this.workoutPost}>운동insert</button>
            </table>
          </div>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const ExerciseAllotAddStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ExerciseAllotAddDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  ExerciseAllotAddStateToProps,
  ExerciseAllotAddDispatchToProps
)(ExerciseAllotAdd);
