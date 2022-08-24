import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Menu from '../../component/navigation/Menu';
import Navigation from '../../component/navigation/Navigation';
// moment
import moment from 'moment';
// Bootstrap
import Form from 'react-bootstrap/Form';
import { Container, Modal, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
// MUI 테이블
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {
  choiceFitness,
  salesClient,
  selectClientReservation,
  selectTrainerReservation,
  voucherSelect,
} from '../../api/user';

const SalesClient = ({
  kind,
  paidMembership,
  paidMembership2,
  paymentDate,
  salesDays,
  salesStart_date,
}) => {
  const date1 = moment(paymentDate).format('YYYY년 MM월 DD일');
  const date2 = moment(salesStart_date).format('YYYY년 MM월 DD일');
  const date3 = moment(salesStart_date)
    .add(salesDays, 'days')
    .subtract(1, 'days')
    .format('YYYY년 MM월 DD일');
  const date4 = moment(salesStart_date).add(salesDays, 'days');
  const endDays =
    moment().diff(date4, 'days') == 0 ? '-Day' : moment().diff(date4, 'days');

  return (
    <div>
      {paidMembership ? (
        <p>
          <h2>{kind}</h2>
          이용권: {paidMembership2}/{paidMembership}
          <br />
          이용권 결제일: {date1}
        </p>
      ) : (
        <p>
          <h2>{kind}</h2>
          기간권: {salesDays}일 권
          <br />
          남은기간: D {endDays}
          <br />
          기간권 결제일: {date2}
          <br />
          기간권 마감일: {date3}
        </p>
      )}
    </div>
  );
};

class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myName: '',
      fitness_name: '',
      phone: '',
      business_phone: '',
      business_number: '',
      cPhone: '',
      cBirth: '',
      cSex: '',
      cWear: '',
      tPhone: '',
      tBirth: '',
      tSex: '',
      start_date: new Date(),
      voucher: [],
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
        this.selectManager();
        this.props.userinfo.loginWhether === 2
          ? this.tableSalesClient()
          : this.props.userinfo.loginWhether === 1
          ? this.tableSalesTrainer()
          : '';
      }
    });
  }
  selectManager = () => {
    choiceFitness(this.props.userinfo.fitness_no).then((res) => {
      // console.log(res);
      this.setState({
        myName: res[0].manager_name,
        fitness_name: res[0].fitness_name,
        phone: res[0].phone,
        business_phone: res[0].business_phone,
        business_number: res[0].business_number,
      });
    });
  };

  tableSalesTrainer = () => {
    selectTrainerReservation(this.props.userinfo.joinNo).then((res21) => {
      // console.log(res21);
      this.setState({
        tPhone: res21[0].phone,
        tBirth: res21[0].birth,
        tSex: res21[0].sex === 1 ? '남자' : '여자',
        tJOin: moment(res21[0].start_date).format('YYYY년 MM월 DD일 '),
      });
    });
  };

  tableSalesClient = () => {
    selectClientReservation(this.props.userinfo.joinNo).then((res2) => {
      // console.log(res2);
      voucherSelect(this.props.userinfo.manager_name, res2[0].fitness_no).then(
        (res3) => {
          const items = res3.map((data, index, array) => {
            return (
              <SalesClient
                kind={data.kind}
                paidMembership={data.paidMembership}
                paidMembership2={data.paidMembership2}
                paymentDate={data.paymentDate}
                salesDays={data.salesDays}
                salesStart_date={data.salesStart_date}
                salesEnd_date={data.salesEnd_date}
              />
            );
          });
          this.setState({
            voucher: items,
            cPhone: res2[0].phone,
            cBirth: res2[0].birth,
            cLocker: res2[0].lockerNumber ? res2[0].lockerNumber : '미사용',
            cWear: res2[0].sportswear,
            cSex: res2[0].sex === 1 ? '남자' : '여자',
          });
        }
      );
    });
  };

  render() {
    // console.log(this.props.userinfo.fitness_no);
    // console.log(this.props.userinfo.loginWhether);
    // console.log(this.props.userinfo.joinNo);
    // console.log(this.props.userinfo);
    // console.log(this.state.voucher);
    return (
      <div className='wrap client_wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>내 정보(MYPAGE)
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/mypage'>내정보(mypage)</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <p>
            {this.props.userinfo.loginWhether === 2
              ? '회원'
              : this.props.userinfo.loginWhether === 1
              ? '강사'
              : '센터'}
          </p>
          {this.props.userinfo.loginWhether === 2 ? (
            //회원
            <div>
              <p>헬스장명: {this.state.fitness_name}</p>
              <p>
                이름:
                {this.state.myName}
              </p>
              <p>폰번호: {this.state.cPhone}</p>
              <p>생년월일: {this.state.cBirth}</p>
              <p>락커룸: {this.state.cLocker}</p>
              <p>운동복: {this.state.cWear}</p>
              <p>성별: {this.state.cSex}</p>
              <p>결제기간(이용권, 기간권): {this.state.voucher}</p>
            </div>
          ) : this.props.userinfo.loginWhether === 1 ? (
            //강사
            <div>
              <p>헬스장명: {this.state.fitness_name}</p>
              <p>
                이름:
                {this.state.myName}
              </p>
              <p>폰번호: {this.state.tPhone}</p>
              <p>생년월일: {this.state.tBirth}</p>
              <p>성별: {this.state.tSex}</p>
              <p>입사일: {this.state.tJOin}</p>
            </div>
          ) : (
            //사업주
            <div>
              <p>헬스장명: {this.state.fitness_name}</p>
              <p>
                이름:
                {this.state.myName}
              </p>
              <p>폰번호: {this.state.phone}</p>
              <p>사업장 전화번호: {this.state.business_phone}</p>
              <p>사업장등록번호: {this.state.business_number}</p>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

const MypageStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const MypageDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(MypageStateToProps, MypageDispatchToProps)(Mypage);
