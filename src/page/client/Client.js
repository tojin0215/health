import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import { Container } from 'react-bootstrap';
import Footer from '../../component/footer/Footer';
import { clientSelect } from '../../api/user';
import moment from 'moment';
// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ViewClientItem = ({
  fitness_no,
  client_name,
  phone,
  birth,
  sex,
  join_route,
  address,
  start_date,
}) => {
  const newDate = moment(start_date).format('YYYY년 MM월 DD일');
  return (
    <TableRow>
      <TableCell>{client_name}</TableCell>
      <TableCell>{phone}</TableCell>
      <TableCell>{birth}</TableCell>
      <TableCell>{sex == 1 ? '남' : '여'}</TableCell>
      <TableCell>{join_route}</TableCell>
      <TableCell>{address}</TableCell>
      <TableCell>{newDate}</TableCell>
    </TableRow>
  );
};

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = { viewClientList: [] };
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
        this.viewClient();
      }
    });
  }
  viewClient = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    clientSelect(fitness_no).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <ViewClientItem
            fitness_no={data.fitness_no}
            client_name={data.client_name}
            phone={data.phone}
            birth={data.birth}
            sex={data.sex}
            join_route={data.join_route}
            address={data.address}
            start_date={data.start_date}
          />
        );
      });
      this.setState({ viewClientList: items });
    });
  };
  render() {
    // console.log(this.props.userinfo.fitness_no);
    console.log(this.state.viewClientList);
    return (
      <div>
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
                <Link to='/client'>고객</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>회원이름</TableCell>
                  <TableCell>폰번호</TableCell>
                  <TableCell>생년월일</TableCell>
                  <TableCell>성별</TableCell>
                  <TableCell>가입경로</TableCell>
                  <TableCell>주소</TableCell>
                  <TableCell>가입일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.state.viewClientList}</TableBody>
            </Table>
          </TableContainer>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}
const ClientStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ClientDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(ClientStateToProps, ClientDispatchToProps)(Client);
