import React, { Component, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

import DatePicker from 'react-datepicker';
// locale 오류로 임시 삭제
// import DatePicker, { registerLocale } from 'react-datepicker';
// import ko from 'date-fns/locale/ko';

import { getStatusRequest } from '../../action/authentication';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import ClickAwayListener from '@mui/base/ClickAwayListener';

import { ImSortAlphaAsc } from 'react-icons/im';
import { RiDeleteBin5Fill } from 'react-icons/ri';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';
import styles from '../../styles/reservation/reservation.css';

import TextField from '@mui/material/TextField';

import { SERVER_URL } from '../../const/settings';
import moment from 'moment';
import ReservationPresetList from '../../component/reservation/ReservationPresetList';
import ReservationList from '../../component/reservation/ReservationList';
import UserSearch from '../../component/customer/UserSearch';
import {
  getReservation,
  getReservationClassBy,
  getReservation_exercise,
  getReservation_trainer,
  getReservation_choice_trainer,
  getReservation_date,
} from '../../api/user';

// locale 오류로 임시 삭제
// registerLocale('ko', ko);

const ip = SERVER_URL;

const dateFormat = (reserv_date) => {
  let month = reserv_date.getMonth() + 1;
  let day = reserv_date.getDate();
  let hour = reserv_date.getHours();
  let minute = reserv_date.getMinutes();
  let second = reserv_date.getSeconds();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;
  second = second >= 10 ? second : '0' + second;

  return (
    reserv_date.getFullYear() +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hour +
    ':' +
    minute +
    ':' +
    second
  );
};
/*
 * 운동클래스 body
 */
const ReservationClassItem = ({
  exercise_class,
  number_of_people,
  hour,
  minute,
  handleClick,
  canRegist,
  trainer,
  reservationSelect,
  class_date,
}) => {
  const handleInnerOnClick = () => {
    handleClick(
      exercise_class,
      number_of_people,
      hour,
      minute,
      trainer,
      class_date
    );
    // console.log(number_of_people);
  };

  const hourArray = hour >= 10 ? hour : '0' + hour;
  const minuteArray = minute >= 10 ? minute : '0' + minute;
  return (
    <div className='border py-2 my-1 ' onClick={handleInnerOnClick}>
      {/* <p>운동명</p> */}
      <p className='fw-bold'>{exercise_class}</p>
      {/* <p>강사명</p> */}
      <p className='fw-bold'>{trainer}</p>
      {/* <p>시간</p> */}
      <p className='fw-bold'>
        {hourArray}시{minuteArray}분
      </p>
      {/* <p>인원</p> */}
      <p className='fw-bold'>
        {canRegist}/{number_of_people}
      </p>
    </div>
  );
};

/**
 * 예약테이블 data 전체보기 탭
 */
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
  customer_id,
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
  const handleChangeIsCancel = (e) => {
    // eslint-disable-next-line no-undef
    setIsCancel_input(e.target.value);
  };
  const handleChangeCancelComment = (e) => {
    // eslint-disable-next-line no-undef
    setCancelComment_input(e.target.value);
  };

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
      // console.log(result);
      alert('예약변경완료');
      reservationSelect();
      updateClose();
    });
  };

  const reservationDelete = (res_no) => {
    fetch(ip + '/reservation/delete?res_no=' + res_no, {
      method: 'DELETE',
    }).then((result) => {
      reservationSelect();
    });
  };

  return (
    <tr>
      <td>
        [{customer_id}]{customer_name}
      </td>
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
          <input value={time_input} id='time' />
        </td>
      ) : (
        <td>{time}</td>
      )}

      {/* {showResults ?
                <td><input value={isCancel_input == null ? '예약 완료' : '예약취소'} id='isCancel' onChange={handleChangeIsCancel} /></td>
                :
                <td>{isCancel == null ? '예약 완료' : '예약취소'}</td>}
            {showResults ?
                <td><input value={cancelComment_input} id='cancelComment' onChange={handleChangeCancelComment} /></td>
                :
                <td>{cancelComment}</td>} */}

      <td>
        <Button
          className='py-1 px-2'
          variant='outline-danger'
          onClick={() =>
            // eslint-disable-next-line no-restricted-globals
            confirm('정말 삭제하시겠습니까??') == true
              ? reservationDelete(res_no)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill className='align-baseline' />
        </Button>
      </td>
      {/* {showResults ?
                <td><button onClick={() => reservationUpdate(res_no)}>수정하기...</button></td>
                :
                <td><button onClick={() => updateOnClick()}>수정하기</button></td>
            } */}
    </tr>
  );
};

/**
 * 예약테이블 data 운동
 */
const ReservationItem_exercise = ({
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
  customer_id,
  reservationSelect,
  trainer,
}) => {
  const reservationDelete = (res_no) => {
    fetch(ip + '/reservation/delete?res_no=' + res_no, {
      method: 'DELETE',
    }).then((result) => {
      reservationSelect();
    });
  };
  return (
    <tr>
      <td>
        [{customer_id}]{customer_name}
      </td>
      <td>{date}</td>
      <td>{exercise_name}</td>
      <td>{trainer}</td>
      <td>{exercise_length + '/' + number_of_people}</td>
      <td>{time}</td>
      <td>
        <Button
          className='py-1 px-2'
          variant='outline-danger'
          onClick={() =>
            // eslint-disable-next-line no-restricted-globals
            confirm('정말 삭제하시겠습니까??') == true
              ? reservationDelete(res_no)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill className='align-baseline' />
        </Button>
      </td>
    </tr>
  );
};
/**
 * 예약테이블 data 강사
 */
const ReservationItem_trainer = ({
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
  customer_id,
  reservationSelect,
  trainer,
}) => {
  const reservationDelete = (res_no) => {
    fetch(ip + '/reservation/delete?res_no=' + res_no, {
      method: 'DELETE',
    }).then((result) => {
      reservationSelect();
    });
  };

  return (
    <tr>
      <td>
        [{customer_id}]{customer_name}
      </td>
      <td>{date}</td>
      <td>{exercise_name}</td>
      <td>{trainer}</td>
      <td>{exercise_length + '/' + number_of_people}</td>
      <td>{time}</td>
      <td>
        <Button
          className='py-1 px-2'
          variant='outline-danger'
          onClick={() =>
            // eslint-disable-next-line no-restricted-globals
            confirm('정말 삭제하시겠습니까??') == true
              ? reservationDelete(res_no)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill className='align-baseline' />
        </Button>
      </td>
    </tr>
  );
};

/**
 * 예약테이블 data 날짜
 */
const ReservationItem_date = ({
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
  customer_id,
  reservationSelect,
  trainer,
}) => {
  const reservationDelete = (res_no) => {
    fetch(ip + '/reservation/delete?res_no=' + res_no, {
      method: 'DELETE',
    }).then((result) => {
      reservationSelect();
    });
  };

  return (
    <tr>
      <td>
        [{customer_id}]{customer_name}
      </td>
      <td>{date}</td>
      <td>{exercise_name}</td>
      <td>{trainer}</td>
      <td>{exercise_length + '/' + number_of_people}</td>
      <td>{time}</td>
      <td>
        <Button
          className='py-1 px-2'
          variant='outline-danger'
          onClick={() =>
            // eslint-disable-next-line no-restricted-globals
            confirm('정말 삭제하시겠습니까??') == true
              ? reservationDelete(res_no)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill className='align-baseline' />
        </Button>
      </td>
    </tr>
  );
};

/**
 * 강사별조회 예약테이블
 */
const ReservationChoiceTrainerItem = ({
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
  customer_id,
  reservationChoiceTrainer,
  trainer,
  reservationSelect,
}) => {
  const reservationDelete = (res_no) => {
    fetch(ip + '/reservation/delete?res_no=' + res_no, {
      method: 'DELETE',
    }).then((result) => {
      // reservationChoiceTrainer();
      // trainer를 못가져와서 화면 새로고침함
      // window.location.replace("/reservation");
      reservationSelect();
    });
  };

  return (
    <tr>
      <td>
        [{customer_id}]{customer_name}
      </td>
      <td>{date}</td>
      <td>{exercise_name}</td>
      <td>{trainer}</td>
      <td>{exercise_length + '/' + number_of_people}</td>
      <td>{time}</td>
      <td>
        <Button
          className='py-1 px-2'
          variant='outline-danger'
          onClick={() =>
            // eslint-disable-next-line no-restricted-globals
            confirm('정말 삭제하시겠습니까??') == true
              ? reservationDelete(res_no)
              : alert('삭제가 취소 되었습니다.')
          }
        >
          <RiDeleteBin5Fill className='align-baseline' />
        </Button>
      </td>
    </tr>
  );
};

/**
 * 강사별조회 탭 예약현황
 */
const ReservationClassItem_choice = ({
  trainer_choice,
  handleClick_choice,
  reservationChoiceTrainer,
  class_date,
  hour,
  minute,
}) => {
  const handleInnerOnClick_choice = () => {
    handleClick_choice(trainer_choice);
    reservationChoiceTrainer(trainer_choice);
  };
  const date = moment(class_date).format('YYYY년 MM월 DD일');
  const hourArray = hour >= 10 ? hour : '0' + hour;
  const minuteArray = minute >= 10 ? minute : '0' + minute;
  return (
    <Button
      variant='oultline-secondary m-1'
      onClick={handleInnerOnClick_choice}
    >
      {trainer_choice}
    </Button>
  );
};

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      fitness_no: 1,
      customer: null,
      reservation: [],

      reservation_trainer: [],
      reservation_exercise: [],
      reservation_date: [],
      reservation_choice_trainer: [],
      reservation_data: [],
      reservationClass: [],
      reservationClass1: [],
      reservationClass2: [],
      reservationClass3: [],
      reservationClass4: [],
      reservationClass5: [],
      reservationClass6: [],
      reservationClass_choice: [],
      customer_name: '',
      customer_id: 'xcv',
      isCancel: 1,
      reserv_date: new Date(),
      time: '',
      exercise_name: '',
      cancelComment: '',
      number_of_people: '',
      trainer: '',
      class_date: '',
      exercise_length: '0',
      customer_name_err: false,
      exercise_name_err: false,
      show: false,
      open: false,
      reservationArray: [],
      show_exercise_table: false,
      show_trainer_table: false,
      show_date_table: false,
      dayIncreament: 0,
    };
    this.handleWeekClick = this.handleWeekClick.bind(this);
    // this.handleDateChange = this.handleDateChange.bind(this);
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
        this.reservationSelect();
        this.reservationChoiceTrainer();
        this.reservationClassSelect_choice();
        this.reservationClassSelect();
        this.reservationClassSelect1();
        this.reservationClassSelect2();
        this.reservationClassSelect3();
        this.reservationClassSelect4();
        this.reservationClassSelect5();
        this.reservationClassSelect6();
      }
    });
  }
  /**
   * 예약테이블 전체보기
   */
  reservationSelect = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservation(fitness_no).then((result) => {
      const now = moment();
      const items = result
        // .filter(value => moment(value.date.split('T')[0]).isSameOrAfter(moment(), "day"))
        .map((data, index, array) => {
          const date_value = data.date
            ? moment(data.date.split('T')[0])
            : moment();
          // if (date_value.isBefore(now, "day")) return
          const date = date_value.format('YYYY년 MM월 DD일');
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
              customer_id={data.customer_id}
            />
          );
        });
      this.setState(
        { reservation: items, reservation_data: result },
        () => this.reservationClassSelect(),
        this.reservationClassSelect1(),
        this.reservationClassSelect2(),
        this.reservationClassSelect3(),
        this.reservationClassSelect4(),
        this.reservationClassSelect5(),
        this.reservationClassSelect6()
      );
      // console.log("reservation_data", result);
    });
  };
  /**
   * 예약 운동정렬
   */
  reservationSelect_exercise = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservation_exercise(fitness_no).then((result) => {
      const now = moment();
      const items = result
        // .filter(value => moment(value.date.split('T')[0]).add(9, 'hour').isSameOrAfter(moment(), "day"))
        .map((data, index, array) => {
          const date_value = data.date
            ? moment(data.date.split('T')[0])
            : moment();
          const date = date_value.format('YYYY년 MM월 DD일');
          let exercise_length = result.filter(
            (filterData) =>
              filterData.exercise_name === data.exercise_name &&
              filterData.time === data.time &&
              filterData.date.split('T')[0] === data.date.split('T')[0]
          ).length;
          return (
            <ReservationItem_exercise
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
              reservationSelect={this.reservationSelect_exercise}
              trainer={data.trainer}
              customer_id={data.customer_id}
            />
          );
        });
      this.setState(
        { reservation_exercise: items, reservation_data: result },
        () => this.reservationClassSelect()
      );
    });
  };
  /**
   * 예약 강사정렬
   */
  reservationSelect_trainer = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservation_trainer(fitness_no).then((result) => {
      const now = moment();
      const items = result
        // .filter(value => moment(value.date.split('T')[0]).isSameOrAfter(moment(), "day"))
        .map((data, index, array) => {
          const date_value = data.date
            ? moment(data.date.split('T')[0])
            : moment();
          // if (date_value.isBefore(now, "day")) return
          const date = date_value.format('YYYY년 MM월 DD일');
          let exercise_length = result.filter(
            (filterData) =>
              filterData.exercise_name === data.exercise_name &&
              filterData.time === data.time &&
              filterData.date.split('T')[0] === data.date.split('T')[0]
          ).length;
          return (
            <ReservationItem_trainer
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
              reservationSelect={this.reservationSelect_trainer}
              trainer={data.trainer}
              customer_id={data.customer_id}
            />
          );
        });
      this.setState(
        { reservation_trainer: items, reservation_data: result },
        () => this.reservationClassSelect()
      );
    });
  };
  /**
   * 예약 날짜정렬
   */
  reservationSelect_date = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservation_date(fitness_no).then((result) => {
      const now = moment();
      const items = result
        // .filter(value => moment(value.date.split('T')[0]).isSameOrAfter(moment(), "day"))
        .map((data, index, array) => {
          const date_value = data.date
            ? moment(data.date.split('T')[0])
            : moment();
          // if (date_value.isBefore(now, "day")) return
          const date = date_value.format('YYYY년 MM월 DD일');
          let exercise_length = result.filter(
            (filterData) =>
              filterData.exercise_name === data.exercise_name &&
              filterData.time === data.time &&
              filterData.date.split('T')[0] === data.date.split('T')[0]
          ).length;
          return (
            <ReservationItem_date
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
              reservationSelect={this.reservationSelect_trainer}
              trainer={data.trainer}
              customer_id={data.customer_id}
            />
          );
        });
      this.setState({ reservation_date: items, reservation_data: result }, () =>
        this.reservationClassSelect()
      );
    });
  };

  handleExercise = () => {
    this.reservationSelect_exercise();
    this.setState({
      show_exercise_table: true,
      show_trainer_table: false,
      show_date_table: false,
    });
  };
  handleTrainer = () => {
    this.reservationSelect_trainer();
    this.setState({
      show_exercise_table: false,
      show_trainer_table: true,
      show_date_table: false,
    });
  };
  handleDate = () => {
    this.reservationSelect_date();
    this.setState({
      show_exercise_table: false,
      show_trainer_table: false,
      show_date_table: true,
    });
  };
  /**
   * 강사별 예약테이블
   */
  reservationChoiceTrainer = (trainer_choice) => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservation_choice_trainer(fitness_no, trainer_choice).then((result) => {
      const now = moment();
      const items = result
        // .filter(value => moment(value.date.split('T')[0]).isSameOrAfter(moment(), "day"))
        .map((data, index, array) => {
          const date_value = data.date
            ? moment(data.date.split('T')[0])
            : moment();
          // if (date_value.isBefore(now, "day")) return
          const date = date_value.format('YYYY년 MM월 DD일');
          let exercise_length = result.filter(
            (filterData) =>
              filterData.exercise_name === data.exercise_name &&
              filterData.time === data.time &&
              filterData.date.split('T')[0] === data.date.split('T')[0]
          ).length;
          return (
            <ReservationChoiceTrainerItem
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
              reservationChoiceTrainer={this.reservationChoiceTrainer}
              trainer={data.trainer}
              customer_id={data.customer_id}
            />
          );
        });
      this.setState(
        { reservation_choice_trainer: items, reservation_data: result },
        () => this.reservationClassSelect()
      );
    });
  };

  /**
   * 예약 입력
   */
  handleOnClick = () => {
    const date =
      moment(this.state.class_date).format('YYYY-MM-DD') + 'T00:00:00.000Z';

    const dateYesterday =
      moment(this.state.reserv_date)
        .subtract({ days: 1 })
        .format('YYYY-MM-DD') + 'T00:00:00.000Z';

    // console.log("yesterday", dateYesterday);
    this.setState({
      customer_name_err: false,
      exercise_name_err: false,
    });
    if (this.state.exercise_name == '') {
      this.setState({ exercise_name_err: true });
      alert('운동을 선택해 주세요');
    } else if (date <= dateYesterday) {
      alert('오늘 이후 만 예약이 가능합니다.');
    } else if (this.state.customer_name == '') {
      this.setState({ customer_name_err: true });
      alert('회원을 선택해 주세요');
    } else {
      fetch(ip + '/reservation/insert', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          fitness_no: this.props.userinfo.fitness_no,
          date: date,
          exercise_name: this.state.exercise_name,
          trainer: this.state.trainer,
          customer_name: this.state.customer_name,
          customer_id: this.state.customer_id,
          number_of_people: this.state.number_of_people,
          time: this.state.time,
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          if (result.message == 'ok') {
            alert('예약이 완료되었습니다.');
            // console.log(this.state.reserv_date)
          } else {
            alert(result.message);
          }
          this.reservationSelect();
          this.reservationClassSelect1();
          this.reservationClassSelect2();
          this.reservationClassSelect3();
          this.reservationClassSelect4();
          this.reservationClassSelect5();
          this.reservationClassSelect6();
          this.reservationSelect_exercise();
          this.reservationSelect_trainer();
          this.reservationChoiceTrainer();
          this.reservationClassSelect_choice();
          this.reservationSelect_date();
        });
    }
  };

  // handleDateChange(date) {
  // 	console.log("date", moment(date).format('YYYY-MM-DD'))
  // 	this.setState({
  // 		reserv_date: date,
  // 	}, () => this.reservationClassSelect()
  // 	);
  // }

  // handleChange = (e) => {
  //     this.setState({
  //         [e.target.id]: e.target.value,
  //     });
  // };
  /**
   * 운동클래스 일요일
   */
  reservationClassSelect = () => {
    const fitness_no = this.props.userinfo.fitness_no;

    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(0 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(0 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass: items });
    });
  };
  /**
   * 운동클래스 월요일
   */
  reservationClassSelect1 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(1 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(1 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass1: items });
    });
  };
  /**
   * 운동클래스 화요일
   */
  reservationClassSelect2 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(2 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(2 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass2: items });
    });
  };
  /**
   * 운동클래스 수요일
   */
  reservationClassSelect3 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(3 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(3 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass3: items });
    });
  };
  /**
   * 운동클래스 목요일
   */
  reservationClassSelect4 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(4 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(4 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass4: items });
    });
  };
  /**
   * 운동클래스 금요일
   */
  reservationClassSelect5 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(5 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(5 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass5: items });
    });
  };
  /**
   * 운동클래스 토요일
   */
  reservationClassSelect6 = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        .filter(
          (value) =>
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrAfter(
                moment().day(6 + this.state.dayIncreament),
                'day'
              ) &&
            moment(value.class_date.split('T')[0])
              .add(9, 'hour')
              .isSameOrBefore(moment().day(6 + this.state.dayIncreament), 'day')
        )
        .map((data, index, array) => {
          const time =
            `${data.hour}`.padStart(2, '0') +
            ':' +
            `${data.minute}`.padStart(2, '0');
          let canRegist = this.state.reservation_data.filter(
            (item) =>
              item.exercise_name === data.exercise_class &&
              item.time === time &&
              item.date === data.class_date
            // moment(this.state.class_date).isSame(
            //   moment(item.date.split("T")[0]),
            //   "day"
            // )
          ).length;
          return (
            <ReservationClassItem
              exercise_class={data.exercise_class}
              number_of_people={data.number_of_people}
              hour={data.hour}
              minute={data.minute}
              trainer={data.trainer}
              canRegist={canRegist}
              class_date={data.class_date}
              handleClick={(
                result_exercise_name,
                result_number_of_people,
                result_hour,
                result_minute,
                result_trainer,
                result_class_date
              ) =>
                this.setState({
                  exercise_name: result_exercise_name,
                  time: time,
                  number_of_people: result_number_of_people,
                  trainer: result_trainer,
                  class_date: result_class_date,
                })
              }
            />
          );
        });
      this.setState({ reservationClass6: items });
    });
  };

  /**
   * 강사별조회 예약현황(탭)
   */
  reservationClassSelect_choice = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    getReservationClassBy(fitness_no).then((result) => {
      const items = result
        //오늘 날짜에 해당하는 주간만 조회
        // .filter(value => moment(value.class_date.split('T')[0]).add(9, 'hour').isSameOrAfter(moment().day(0 + this.state.dayIncreament), "day")
        // 	// && moment(value.class_date.split('T')[0]).add(9, 'hour').isSameOrBefore(moment().day(6 + this.state.dayIncreament), "day")
        // )
        .map((data, index, array) => {
          return (
            <ReservationClassItem_choice
              trainer_choice={data.trainer}
              class_date={data.class_date}
              hour={data.hour}
              minute={data.minute}
              handleClick_choice={(result_trainer_choice) =>
                this.setState({
                  trainer_choice: result_trainer_choice,
                })
              }
              reservationChoiceTrainer={this.reservationChoiceTrainer}
              reservationSelect={this.reservationSelect}
            />
          );
        });
      // console.log(result);
      this.setState({ reservationClass_choice: items });
    });
  };

  handleUser = (customer) => {
    const { member_no, name } = customer;
    this.setState({
      customer: customer,
      customer_name: name,
      customer_id: member_no,
      open: false,
    });
  };

  handleWeekClick = (w) => {
    const dayIncreament = 0;
    const name = w.target.name;
    if (name === 'next') {
      // eslint-disable-next-line no-unused-expressions
      this.setState({
        dayIncreament: this.state.dayIncreament + 7,
      }),
        this.reservationClassSelect();
      this.reservationClassSelect1();
      this.reservationClassSelect2();
      this.reservationClassSelect3();
      this.reservationClassSelect4();
      this.reservationClassSelect5();
      this.reservationClassSelect6();
    } else if (name === 'prev') {
      // eslint-disable-next-line no-unused-expressions
      this.setState({
        dayIncreament: this.state.dayIncreament - 7,
      }),
        this.reservationClassSelect();
      this.reservationClassSelect1();
      this.reservationClassSelect2();
      this.reservationClassSelect3();
      this.reservationClassSelect4();
      this.reservationClassSelect5();
      this.reservationClassSelect6();
    }
  };
  goLogin = () => {
    this.props.history.push('/');
  };
  render() {
    // console.log(this.state.reservation);
    // console.log("exercise", this.state.reservation_exercise);
    // console.log("trainer", this.state.reservation_trainer);
    // console.log("reservation_choice_trainer", this.state.reservation_choice_trainer);
    // console.log("reservationClass_choice", this.state.reservationClass_choice);

    return (
      <div className='reservationWrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                수업
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/reservation'>수업</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>

        <Container className='reservationWrap'>
          <Row className='pb-5 justify-content-center'>
            <Col xs={9}>
              <h4 className=''>진행중인 수업</h4>
            </Col>
            <Col xs={3} className='text-center w-auto'>
              <Link to='/reservationClass'>
                <Button>새로운 수업 만들기</Button>
              </Link>
            </Col>
          </Row>
          <Row xs={3}>
            <Col className='text-end'>
              <Button
                name='prev'
                variant='outline-secondary'
                onClick={this.handleWeekClick}
              >
                이전주
              </Button>
            </Col>
            <Col className='text-center align-self-center fs-5'>
              {moment(this.state.reserv_date)
                .day(0)
                .add(this.state.dayIncreament, 'days')
                .format('YYYY-MM-DD(dd)')}{' '}
              ~{' '}
              {moment(this.state.reserv_date)
                .day(6)
                .add(this.state.dayIncreament, 'days')
                .format('YYYY-MM-DD(dd)')}
            </Col>
            <Col className='text-start'>
              <Button
                name='next'
                variant='outline-secondary'
                onClick={this.handleWeekClick}
              >
                다음주
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              className='text-center py-2 w-100 overflow-auto justify-content-center'
              xs={12}
            >
              <table class='table classListTable'>
                <thead>
                  <tr>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(0)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(0)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(1)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(1)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(2)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(2)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(3)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(3)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(4)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(4)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(5)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(5)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                    <th scope='col'>
                      {' '}
                      {moment(this.state.reserv_date)
                        .day(6)
                        .add(this.state.dayIncreament, 'days')
                        .format('dd')}
                      {moment(this.state.reserv_date)
                        .day(6)
                        .add(this.state.dayIncreament, 'days')
                        .format('YYYY-MM-DD')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {this.state.reservationClass.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass
                      )}
                    </td>
                    <td name='mon'>
                      {this.state.reservationClass1.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass1
                      )}
                    </td>
                    <td name='tue'>
                      {this.state.reservationClass2.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass2
                      )}
                    </td>
                    <td name='wed'>
                      {this.state.reservationClass3.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass3
                      )}
                    </td>
                    <td name='thu'>
                      {this.state.reservationClass4.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass4
                      )}
                    </td>
                    <td name='fri'>
                      {this.state.reservationClass5.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass5
                      )}
                    </td>
                    <td name='sat'>
                      {this.state.reservationClass6.length === 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass6
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 
                            {
                                this.state.customer && (
                                    <span>[{this.state.customer_id}]{this.state.customer_name} 님</span>
                                )
                            } */}
              {/* <TextField
                                id='customer_name'
                                value={this.state.customer_name}
                                // onChange={this.handleChange}
                                label='회원이름'
                                error={this.state.customer_name_err}
                            /> */}
              {/* <TextField
                                id='customer_id'
                                value={this.state.customer_id}
                                onChange={this.handleChange}
                                label='회원아이디'
                            /> */}
            </Col>
            <Col></Col>
          </Row>
          <Row className='' lg={6}>
            <Col lg={12}>
              <h5>선택된 수업</h5>
            </Col>
            <Col className='text-center my-3 height-fit-content' xs={12} sm={4}>
              <div className='boxmorpinsm py-3 h-100 w-100 '>
                <p className=''>운동명</p>
                <p className='fw-bold'>{this.state.exercise_name}</p>
              </div>
              <TextField
                id='exercise_name'
                className='d-none'
                value={this.state.exercise_name}
                // onChange={this.handleChange}
                label='운동명'
                err={this.state.exercise_name_err}
              />
            </Col>
            <Col className='text-center my-3 height-fit-content' xs={12} sm={4}>
              <div className='boxmorpinsm py-3 h-100 w-100'>
                <p className=''>강사명</p>
                <p className='fw-bold'>{this.state.trainer}</p>
              </div>
              <TextField
                id='trainer'
                className='d-none'
                value={this.state.trainer}
                // onChange={this.handleChange}
                label='강사명'
                // err={this.state.trainer_err}
              />
            </Col>
            <Col className='text-center my-3 height-fit-content' xs={12} sm={4}>
              <div className='boxmorpinsm py-3 h-100'>
                <p className=''>시간</p>
                <p className='fw-bold'>{this.state.time}</p>
              </div>
              <TextField
                id='time'
                className='d-none'
                value={this.state.time}
                // onChange={this.handleChange}
                label='시간'
              />
            </Col>
            <Col className='text-center my-3 height-fit-content' xs={12} sm={4}>
              <div className='boxmorpinsm py-3 h-100 w-100'>
                <p className=''>최대 인원수</p>
                <p className=''>
                  <span className='fw-bold'>
                    {this.state.number_of_people == ''
                      ? ''
                      : this.state.number_of_people + '명'}
                  </span>{' '}
                </p>
              </div>
              <TextField
                id='number_of_people'
                className='d-none'
                value={this.state.number_of_people}
                // onChange={this.handleChange}
                label='최대 인원수'
              />
            </Col>
            <Col className='text-center my-3' xs={12} sm={4}>
              <div className='boxmorpinsm py-3'>
                <p className=''>배정된 날짜</p>
                <p className='fw-bold'>
                  {moment(this.state.class_date).format('yyyy-MM-DD') ==
                  'Invalid date'
                    ? ''
                    : moment(this.state.class_date).format('yyyy-MM-DD')}
                </p>
              </div>
              <TextField
                id='class_date'
                className='d-none'
                name='class_date'
                value={this.state.class_date}
                label='배정된 날짜'
              />
              {/* <DatePicker
								selected={this.state.reserv_date}
								onChange={this.handleDateChange}
								name='reserv_date'
								dateFormat='yyyy-MM-dd(eee)'
								font-size='1.6rem'
								locale='ko'
							/> */}
            </Col>
            <Col className='text-center usersearchButton my-3'>
              {this.state.open ? (
                <UserSearch
                  open={this.state.open}
                  setOpen={(o) => this.setState({ open: o })}
                  fitness_no={this.props.userinfo.fitness_no}
                  handleUser={this.handleUser}
                />
              ) : (
                <TextField
                  onClick={() => this.setState({ open: true })}
                  id='customer_name'
                  className='boxmorpsm h-100 w-100'
                  InputProps={{ disableUnderline: true }}
                  value={this.state.customer_name}
                  // onChange={this.handleChange}
                  label='회원 검색'
                  error={this.state.customer_name_err}
                />
              )}
            </Col>
            <Col className='text-center w-100 mt-3' xs={12}>
              <Button
                className='btnSolid mx-4 px-5'
                type='button'
                onClick={this.handleOnClick}
              >
                예약하기
              </Button>
            </Col>
          </Row>
          <Row xs={1} sm={3}>
            {/* <Col className='text-end m-3' xs={12}>
                        <Link to='/reservation/update'>
                            <button className=''>예약 수정하기</button>
                        </Link>
                    </Col> */}
            {/* <ReservationList
                        reservation={this.state.reservation}
                        reservationDelete={this.reservationDelete}
                    /> */}
            <Col xs={12}>
              <h4 className=''>예약 현황</h4>
            </Col>
            <Col xs={12} className='w-100 overflow-auto'>
              <Tabs
                defaultActiveKey='home'
                id='uncontrolled-tab-example'
                className='mb-3'
              >
                <Tab eventKey='home' title='전체보기'>
                  <table class='table text-center reservationListTable mt-5'>
                    <thead>
                      <tr>
                        <th scope='col'>[회원번호]회원이름</th>
                        <th scope='col'>
                          <Button
                            variant='ouline-ligth'
                            className='w-100 fw-bold'
                            onClick={() => this.handleDate()}
                          >
                            수강 날짜 <ImSortAlphaAsc />
                          </Button>
                        </th>
                        <th scope='col'>
                          <Button
                            variant='ouline-ligth'
                            className='w-100 fw-bold'
                            onClick={() => this.handleExercise()}
                          >
                            운동 <ImSortAlphaAsc />
                          </Button>
                        </th>
                        <th scope='col'>
                          <Button
                            variant='ouline-ligth'
                            className='w-100 fw-bold'
                            onClick={() => this.handleTrainer()}
                          >
                            강사 <ImSortAlphaAsc />
                          </Button>
                        </th>
                        <th scope='col'>인원수</th>
                        <th scope='col'>시간</th>
                        {/* <th scope='col'>상태</th>
										<th scope='col'>취소사유</th> */}
                        <th scope='col'>삭제</th>
                      </tr>
                    </thead>
                    {this.state.show_exercise_table &&
                    !this.state.show_trainer_table &&
                    !this.state.show_date_table ? (
                      <tbody>
                        {this.state.reservation_exercise.length == 0 ? (
                          <p>'설정된 운동이 없습니다.'</p>
                        ) : (
                          this.state.reservation_exercise
                        )}
                      </tbody>
                    ) : null}

                    {this.state.show_trainer_table &&
                    !this.state.show_exercise_table &&
                    !this.state.show_date_table ? (
                      <tbody>
                        {this.state.reservation_trainer.length == 0 ? (
                          <p>'설정된 운동이 없습니다.'</p>
                        ) : (
                          this.state.reservation_trainer
                        )}
                      </tbody>
                    ) : null}

                    {this.state.show_date_table &&
                    !this.state.show_exercise_table &&
                    !this.state.show_trainer_table ? (
                      <tbody>
                        {this.state.reservation_date.length == 0 ? (
                          <p>'설정된 운동이 없습니다.'</p>
                        ) : (
                          this.state.reservation_date
                        )}
                      </tbody>
                    ) : null}

                    {!this.state.show_exercise_table &&
                    !this.state.show_trainer_table &&
                    !this.state.show_date_table ? (
                      <tbody>
                        {this.state.reservation.length == 0 ? (
                          <p>'설정된 운동이 없습니다.'</p>
                        ) : (
                          this.state.reservation
                        )}
                      </tbody>
                    ) : null}
                  </table>
                </Tab>
                <Tab eventKey='trainer' title='강사별조회'>
                  <p>{this.state.reservationClass_choice}</p>
                  <table class='table text-center reservationListTable mt-5'>
                    <thead>
                      <tr>
                        <th scope='col'>[회원번호]회원이름</th>
                        <th scope='col'>날짜</th>
                        <th scope='col'>운동</th>
                        <th scope='col'>강사</th>
                        <th scope='col'>인원수</th>
                        <th scope='col'>시간</th>
                        {/* <th scope='col'>상태</th>
										<th scope='col'>취소사유</th> */}
                        <th scope='col'>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.reservation_choice_trainer.length == 0 ? (
                        <p>'설정된 운동이 없습니다.'</p>
                      ) : (
                        this.state.reservation_choice_trainer
                      )}
                    </tbody>
                  </table>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const ReservationStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ReservationDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  ReservationStateToProps,
  ReservationDispatchToProps
)(Reservation);
