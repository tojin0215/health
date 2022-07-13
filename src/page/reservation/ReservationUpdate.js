import { connect } from 'react-redux';
import 'react-dropdown/style.css';

import TextField from '@mui/material/TextField';

import { getStatusRequest } from '../../action/authentication';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import { SERVER_URL } from '../../const/settings';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';
import ReservationPresetList from '../../component/reservation/ReservationPresetList';

import DatePicker from 'react-datepicker';
// locale 오류로 임시 삭제
// import DatePicker, { registerLocale } from 'react-datepicker';
// import ko from 'date-fns/locale/ko';
// registerLocale('ko', ko);

const ip = SERVER_URL;

const ReservationClassItem = ({
  exercise_class,
  number_of_people,
  hour,
  minute,
  handleClick,
  canRegist,
  trainer,
}) => {
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const handleClick2 = () => {
    setInput(exercise_class);
    setInput2(number_of_people);
    setInput3(hour);
    setInput4(minute);
    setInput5(trainer);
    handleClick(exercise_class, hour, minute, number_of_people, trainer);
  };

  return (
    <tr>
      <td>{exercise_class}</td>
      <td>{trainer}</td>
      <td>
        {canRegist}/{number_of_people}
      </td>
      <td>
        {hour == 1
          ? '01'
          : hour == 2
          ? '02'
          : hour == 3
          ? '03'
          : hour == 4
          ? '04'
          : hour == 5
          ? '05'
          : minute == 6
          ? '06'
          : hour == 7
          ? '07'
          : hour == 8
          ? '09'
          : hour == 0
          ? '00'
          : hour}
        :
        {minute == 1
          ? '01'
          : minute == 2
          ? '02'
          : minute == 3
          ? '03'
          : minute == 4
          ? '04'
          : minute == 5
          ? '05'
          : minute == 6
          ? '06'
          : minute == 7
          ? '07'
          : minute == 8
          ? '09'
          : minute == 0
          ? '00'
          : minute}
      </td>
      <td>
        <button onClick={handleClick2}>선택</button>
      </td>
    </tr>
  );
};

const ReservationItem = ({
  res_no,
  date,
  exercise_name,
  fitness_no,
  customer_name,
  isCancel,
  cancelComment,
  number_of_people,
  time,
  date2,
  exercise_length,
  reservationSelect,
  trainer,
}) => {
  const [showResults, setShowResults] = React.useState(false);
  const [date_input, setDate_input] = useState('');
  const [time_input, setTime_input] = useState('');
  const [exercise_name_input, setExercise_name_input] = useState('');
  const [trainer_input, setTrainer_input] = useState('');
  // const [isCancel_input, setIsCancel_input] = useState('');
  // const [cancelComment_input, setCancelComment_input] = useState('');
  const [number_of_people_input, setNumber_of_people_input] = useState('');

  const updateOnClick = () => {
    setShowResults(true);
    setDate_input(date2);
    setTime_input(time);
    setExercise_name_input(exercise_name);
    setTrainer_input(trainer);
    // setIsCancel_input(isCancel)
    // setCancelComment_input(cancelComment)
    setNumber_of_people_input(number_of_people);
  };
  const updateClose = () => {
    setShowResults(false);
  };
  const handleChangeDate = (e) => {
    setDate_input(e.target.value);
  };
  // const handleChangeIsCancel = (e) => {
  //   setIsCancel_input(e.target.value);
  // };
  // const handleChangeCancelComment = (e) => {
  //   setCancelComment_input(e.target.value);
  // };

  const reservationUpdate = (res_no) => {
    fetch(ip + '/reservation/update?res_no=' + res_no, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        time: time,
        exercise_name: exercise_name_input,
        number_of_people: number_of_people_input,
        date: date_input,
        trainer: trainer_input,
        // isCancel: isCancel_input,
        // cancelComment: cancelComment_input
      }),
    }).then((result) => {
      console.log(result);
      alert('예약변경완료');
      reservationSelect();
      updateClose();
    });
  };

  return (
    <tr>
      <td>{customer_name}</td>
      {showResults ? (
        <td>
          {/* <input value={date_input} id='date' onChange={handleChangeDate} /> */}
          <DatePicker
            value={date_input}
            seleted={date_input}
            id='date'
            onChange={handleChangeDate}
            dateFormat='yyyy-MM-dd(eee)'
            font-size='1.6rem'
            // locale 오류로 임시 삭제
            // locale='ko'
          />
        </td>
      ) : (
        <td>{date}</td>
      )}
      {showResults ? (
        <td>
          <input value={time_input} id='time' />
        </td>
      ) : (
        <td>{time}</td>
      )}
      {showResults ? (
        <td>
          <input value={exercise_name_input} id='exercise_name' />
        </td>
      ) : (
        <td>{exercise_name}</td>
      )}
      {showResults ? (
        <td>
          <input value={trainer_input} id='trainer' />
        </td>
      ) : (
        <td>{trainer}</td>
      )}
      {/* {showResults ?
                <td><input value={isCancel_input == null ? '예약 완료' : '예약취소'} id='isCancel' onChange={handleChangeIsCancel} /></td>
                :
                <td>{isCancel == null ? '예약 완료' : '예약취소'}</td>}
            {showResults ?
                <td><input value={cancelComment_input} id='cancelComment' onChange={handleChangeCancelComment} /></td>
                :
                <td>{cancelComment}</td>} */}
      {showResults ? (
        <td>
          {exercise_length + '/'}
          <input value={number_of_people_input} id='number_of_people' />
        </td>
      ) : (
        <td>{exercise_length + '/' + number_of_people}</td>
      )}
      {showResults ? (
        <td>
          <button onClick={() => reservationUpdate(res_no)}>변경하기...</button>
        </td>
      ) : (
        <td>
          <button onClick={() => updateOnClick()}>변경하기</button>
        </td>
      )}
    </tr>
  );
};

class ReservationUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitness_no: 2,
      reservation: [],
      reservationClass: [],
      time: '',
      exercise_name: '',
      number_of_people: '',
      trainer: '',
    };
    this.reservationSelect();
    this.reservationClassSelect();
    // this.reservationTogether();
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
        // this.reservationTogether();
        this.reservationSelect();
        this.reservationClassSelect();
      }
    });
  }

  reservationSelect = () => {
    fetch(
      ip + '/reservation/select?fitness_no=' + this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((result) => result.json())
      .then((result) => {
        const items = result.map((data, index, array) => {
          const date = moment(data.date).format('YYYY년 MM월 DD일');
          let exercise_length = result.filter(
            (filterData) =>
              filterData.exercise_name === data.exercise_name &&
              filterData.time === data.time &&
              filterData.date.split('T')[0] === data.date.split('T')[0]
          ).length;
          return (
            <ReservationItem
              res_no={data.res_no}
              date={date}
              date2={data.date}
              exercise_name={data.exercise_name}
              fitness_no={data.fitness_no}
              customer_name={data.customer_name}
              isCancel={data.isCancel}
              cancelComment={data.cancelComment}
              number_of_people={data.number_of_people}
              exercise_length={exercise_length}
              time={data.time}
              reservationSelect={this.reservationSelect}
              trainer={data.trainer}
            />
          );
        });
        console.log(result);
        this.setState({ reservation: items });
      });
  };

  reservationClassSelect = () => {
    fetch(
      ip +
        '/reservationClass/select?fitness_no=' +
        this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((result) => result.json())
      .then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              trainer={data.trainer}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              handleClick={(
                result_exercise_name,
                result_hour,
                result_minute,
                result_number_of_people,
                result_trainer
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time:
                    // result_hour + ":" + result_minute
                    (result_hour == 1
                      ? '01'
                      : result_hour == 2
                      ? '02'
                      : result_hour == 3
                      ? '03'
                      : result_hour == 4
                      ? '04'
                      : result_hour == 5
                      ? '05'
                      : result_hour == 6
                      ? '06'
                      : result_hour == 7
                      ? '07'
                      : result_hour == 8
                      ? '09'
                      : result_hour == 0
                      ? '00'
                      : result_hour) +
                    ':' +
                    (result_minute == 1
                      ? '01'
                      : result_minute == 2
                      ? '02'
                      : result_minute == 3
                      ? '03'
                      : result_minute == 4
                      ? '04'
                      : result_minute == 5
                      ? '05'
                      : result_minute == 6
                      ? '06'
                      : result_minute == 7
                      ? '07'
                      : result_minute == 8
                      ? '09'
                      : result_minute == 0
                      ? '00'
                      : result_minute),
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                })
              }
            />
          );
        });
        this.setState({ reservationClass: items });
      });
  };

  render() {
    console.log(this.state.reservationClass);
    return (
      <div className='wrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                운동 설정하기
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/reservationClass'>운동 설정하기</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>

        <Container>
          <Row className='pb-5'>
            <table class='table'>
              <thead>
                <Link to='/reservation'>예약</Link>
                <tr>
                  <th scope='col'>회원이름</th>
                  <th scope='col'>날짜</th>
                  <th scope='col'>시간</th>
                  <th scope='col'>운동명</th>
                  <th scope='col'>트레이너명</th>
                  {/* <th scope='col'>상태</th>
                                    <th scope='col'>취소사유</th> */}
                  <th scope='col'>인원수</th>
                  <th scope='col'>--- </th>
                </tr>
              </thead>
              <tbody>
                {this.state.reservation.length == 0 ? (
                  <p>'설정된 운동이 없습니다.'</p>
                ) : (
                  this.state.reservation
                )}
              </tbody>
            </table>
            <table class='table'>
              <thead>
                <tr>
                  <th scope='col'>운동명</th>
                  <th scope='col'>트레이너명</th>
                  <th scope='col'>인원수</th>
                  <th scope='col'>시간</th>
                  <th scope='col'>선택</th>
                </tr>
              </thead>
              <tbody>
                {this.state.reservationClass.length == 0 ? (
                  <p>'설정된 운동이 없습니다.'</p>
                ) : (
                  this.state.reservationClass
                )}
              </tbody>
            </table>
            시간
            <input id='time' value={this.state.time} />
            운동명
            <input id='exercise_name' value={this.state.exercise_name} />
            트레이너명
            <input id='trainer' value={this.state.trainer} />
            제한인원수
            <input id='number_of_people' value={this.state.number_of_people} />
          </Row>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const ReservationUpdateStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ReservationUpdateDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  ReservationUpdateStateToProps,
  ReservationUpdateDispatchToProps
)(ReservationUpdate);
