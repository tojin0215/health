import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import { Container } from 'react-bootstrap';
import Footer from '../../component/footer/Footer';
import { getStatusRequest } from '../../action/authentication';
import TextField from '@mui/material/TextField';
import { clientManager, insertClient } from '../../api/user';

class AddClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client_name: '',
      phone: '',
      birth: '',
      sex: '',
      join_route: '',
      address: '',
      radioGroup: {
        male: true,
        female: false,
      },
      radioGroup2: {
        route1: true,
        route2: false,
        route3: false,
        route4: false,
        route5: false,
        route6: false,
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
  handleClient = () => {
    insertClient(
      this.props.userinfo.fitness_no,
      this.state.client_name,
      this.state.phone,
      this.state.birth,
      this.state.radioGroup.male ? 1 : 2,
      this.state.radioGroup2.route1
        ? '간판'
        : this.state.radioGroup2.route2
        ? '홈페이지'
        : this.state.radioGroup2.route3
        ? '전단지'
        : this.state.radioGroup2.route4
        ? '지인소개'
        : this.state.radioGroup2.route5
        ? 'SNS'
        : this.state.radioGroup2.route6
        ? this.state.join_route
        : '간판',
      this.state.address
    ).then((res) => {
      // console.log(res);
      alert('client Table');
    });
  };
  handleRadio = (s) => {
    let obj = {
      male: false,
      female: false,
    };
    obj[s.target.id] = s.target.checked;
    this.setState({
      radioGroup: obj,
    });
  };

  handleRouteRadio = (r) => {
    let obj = {
      route1: false,
      route2: false,
      route3: false,
      route4: false,
      route5: false,
      route6: false,
    };
    obj[r.target.id] = r.target.checked;
    this.setState({
      radioGroup2: obj,
    });
  };

  handleManagerLogin = () => {
    clientManager(
      this.state.phone,
      this.state.birth,
      this.state.client_name
    ).then((res) => {
      // console.log(res);
      alert('manager Table');
    });
  };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleTotal = () => {
    this.handleClient();
    this.handleManagerLogin();
    this.props.history.push('/client');
  };
  render() {
    return (
      <div>
        {' '}
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                회원관리
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/client'>회원 관리</Link>
                <span>&#62;</span>
                <Link to='/client/add'>신규 회원 등록</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <div>
            <h3>회원 정보 입력</h3>
          </div>
          <form>
            <label>
              이름:
              <TextField
                type='text'
                id='client_name'
                onChange={this.handleChange}
                value={this.state.client_name}
              />
            </label>
            <br />
            <label>
              핸드폰번호:
              <TextField
                type='number'
                id='phone'
                onChange={this.handleChange}
                value={this.state.phone}
              />
            </label>
            <br />
            <label>
              생년월일:
              <TextField
                type='text'
                id='birth'
                onChange={this.handleChange}
                value={this.state.birth}
              />
            </label>
            <br />
            <label>
              성별:
              <input
                type='radio'
                name='radioGroup'
                id='male'
                checked={this.state.radioGroup['male']}
                onChange={this.handleRadio}
              />
              <span>남</span>
              <input
                type='radio'
                name='radioGroup'
                id='female'
                checked={this.state.radioGroup['female']}
                onChange={this.handleRadio}
              />
              <span>여</span>
            </label>
            <br />
            <label>
              {/* 라디오로 */}
              가입경로:
              <span>간판</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route1'
                checked={this.state.radioGroup2['route1']}
                onChange={this.handleRouteRadio}
              />
              <span>홈페이지</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route2'
                checked={this.state.radioGroup2['route2']}
                onChange={this.handleRouteRadio}
              />
              <span>전단지</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route3'
                checked={this.state.radioGroup2['route3']}
                onChange={this.handleRouteRadio}
              />
              <span>지인소개</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route4'
                checked={this.state.radioGroup2['route4']}
                onChange={this.handleRouteRadio}
              />
              <span>SNS</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route5'
                checked={this.state.radioGroup2['route5']}
                onChange={this.handleRouteRadio}
              />
              <span>기타</span>
              <input
                type='radio'
                name='radioGroup2'
                id='route6'
                checked={this.state.radioGroup2['route6']}
                onChange={this.handleRouteRadio}
              />
              <TextField
                type='text'
                id='join_route'
                onChange={this.handleChange}
                value={this.state.join_route}
              />
            </label>
            <br />
            <label>
              주소:
              <TextField
                type='text'
                id='address'
                onChange={this.handleChange}
                value={this.state.address}
              />
            </label>
            <br />
            <button
              className='btnSolid'
              type='button'
              onClick={this.handleTotal}
            >
              등록하기
            </button>
          </form>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}
const AddclientStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddclientDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};
export default connect(
  AddclientStateToProps,
  AddclientDispatchToProps
)(AddClient);
