import { Component } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import Footer from '../../component/footer/Footer';
import { Button, Container } from 'react-bootstrap';
import { insertIntroduce } from '../../api/user';

class AddIntroduce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitness_no: this.props.userinfo.fitness_no,
      manager_name: '',
      picture: '',
      file: null,
      story: '',
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

  handleIntroduce = () => {
    insertIntroduce(
      this.state.fitness_no,
      this.props.userinfo.manager_name,
      this.state.file,
      this.state.story
    ).then((res) => {
      console.log(res);
      alert('소개 등록 완료');
      this.props.history.push('/introduce');
    });
  };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleFileChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    this.setState({ file: e.target.files[0] });
  };

  render() {
    console.log(this.state.file);
    console.log(this.state.picture);

    return (
      <div>
        {''}
        <header className='header'>
          <Header />
          <Navigation />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                헬스장 소개 등록
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/introduce'>헬스장 소개</Link>
                <span>&#62;</span>
                {this.props.userinfo.loginWhether === 0 ? (
                  <Link to='/introduce/add'>헬스장 소개 등록</Link>
                ) : (
                  ''
                )}
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <div>
            <input id='manager_name' value={this.props.userinfo.manager_name} />
          </div>
          <div>
            <input
              id='picture'
              type='file'
              value={this.state.picture}
              onChange={this.handleFileChange}
              accept='image/*'
            />
          </div>
          <div>
            <input
              id='story'
              value={this.state.story}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <Button type='button' onClick={this.handleIntroduce}>
              등록하기
            </Button>
          </div>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const AddIntroduceStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddIntroduceDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  AddIntroduceStateToProps,
  AddIntroduceDispatchToProps
)(AddIntroduce);
