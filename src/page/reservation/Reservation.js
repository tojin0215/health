import React, { Component, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col } from 'react-bootstrap';

import { getStatusRequest } from '../../action/authentication';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';
import styles from '../../styles/reservation/reservation.css';

// 데이터피커
import DatePicker from 'react-datepicker';
// 부트스트랩
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
// 리액트 아이콘
import { ImSortAlphaAsc } from 'react-icons/im';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { TbMoodSuprised } from 'react-icons/tb';
// MUI
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { SERVER_URL } from '../../const/settings';

import UserSearch from '../../component/customer/UserSearch';
import {
  getReservation,
  getReservationClassBy,
  getReservation_exercise,
  getReservation_trainer,
  getReservation_choice_trainer,
  getReservation_date,
  selectTrainerReservation,
  selectClientReservation,
  selectTrainer,
  clientSelect,
  getReservation_choice_client,
  reservationInsert,
  voucherSelect,
  voucherUpdate,
  voucherSelect2,
  reservationDestroy,
} from '../../api/user';

// locale 오류로 임시 삭제
// registerLocale('ko', ko);
// import DatePicker, { registerLocale } from 'react-datepicker';
// import ko from 'date-fns/locale/ko';
import moment from 'moment';
import 'moment/locale/ko';
import { Paper } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';
moment.locale('ko'); // en - 영어
// moment().format();

const ip = SERVER_URL;

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
  class_date,
  kind,
}) => {
  const handleInnerOnClick = () => {
    handleClick(
      exercise_class,
      kind,
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
    <Row className='reservation__class-table--td' onClick={handleInnerOnClick}>
      <Col xs={6}>{kind}</Col>
      <Col xs={6}>{trainer}</Col>
      <Col xs={6}>
        {canRegist}/{number_of_people}
      </Col>
      <Col xs={6} className='text-center fw-bold'>
        {hourArray}:{minuteArray}
      </Col>
      {/* <p>운동명</p> */}
      {/* <p className='fw-bold'>
        {exercise_class}[{kind}]
      </p> */}
      {/* <p>강사명</p> */}
      {/* <p className=''>{trainer}</p> */}
      {/* <p>시간</p> */}
      {/* <p className=''>
        {hourArray}시 {minuteArray}분
      </p> */}
      {/* <p>인원</p> */}
      {/* <p className=''>
        {canRegist}/{number_of_people}
      </p> */}
    </Row>
  );
};

/**
 * 예약테이블 data 전체보기 탭
 */
const ReservationItem = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  reservationSelect,
  trainer,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationSelect();
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };

  const [clockDate, setClockDate] = useState(new Date());

  const month =
    clockDate.getMonth() + 1 < 10
      ? '0' + (clockDate.getMonth() + 1)
      : clockDate.getMonth() + 1;

  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};

/**
 * 예약테이블 data 운동
 */
const ReservationItem_exercise = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  reservationSelect,
  trainer,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationSelect();
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };

  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};
/**
 * 예약테이블 data 강사
 */
const ReservationItem_trainer = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  reservationSelect,
  trainer,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationSelect();
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };
  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};

/**
 * 예약테이블 data 날짜
 */
const ReservationItem_date = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  reservationSelect,
  trainer,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationSelect();
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };

  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};

/**
 * 강사별조회 예약테이블
 */
const ReservationChoiceTrainerItem = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  reservationChoiceTrainer,
  trainer,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationChoiceTrainer(res_no);
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };

  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};

/**
 * 강사별조회 탭에서 강사이름만 나오는 테이블
 * 강사이름 누르면 강사이름으로 된 테이블 조회
 */
const ReservationClassItem_choice = ({
  trainer_choice,
  handleClick_choice,
  reservationChoiceTrainer,
}) => {
  const handleInnerOnClick_choice = () => {
    handleClick_choice(trainer_choice);
    reservationChoiceTrainer(trainer_choice);
  };

  return (
    <Button
      variant='outline-light'
      className='m-1'
      onClick={handleInnerOnClick_choice}
    >
      {trainer_choice}
    </Button>
  );
};
/**
 * 회원별조회 예약테이블
 */
const ReservationChoiceClientItem = ({
  res_no,
  date,
  exercise_name,
  customer_name,
  number_of_people,
  time,
  exercise_length,
  trainer,
  reservationChoiceClient,
  kind,
  fitness_no,
}) => {
  const reservationDelete = (res_no) => {
    reservationDestroy(res_no).then((result) => {
      reservationChoiceClient(res_no);
      voucherPlus();
    });
  };

  const voucherPlus = () => {
    voucherSelect2(customer_name, fitness_no, kind).then((res) => {
      // console.log(res);
      voucherUpdate(
        res[0].client_name,
        res[0].kind,
        res[0].paidMembership2 + 1
      ).then((res2) =>
        alert(
          res[0].client_name +
            '님 의' +
            res[0].kind +
            '이용권이 1회 증가됩니다. 잔여 이용권은' +
            (res[0].paidMembership2 + 1) +
            '회 입니다.'
        )
      );
    });
  };
  return (
    <TableRow>
      <TableCell align='center'>{customer_name}</TableCell>
      <TableCell align='center'>{date}</TableCell>
      <TableCell align='center'>
        {exercise_name}[{kind}]
      </TableCell>
      <TableCell align='center'>{trainer}</TableCell>
      <TableCell align='center'>
        {exercise_length + '/' + number_of_people}
      </TableCell>
      <TableCell align='center'>{time}</TableCell>
      <TableCell align='center'>
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
      </TableCell>
    </TableRow>
  );
};

/**
 * 회원별조회 탭에서 회원이름만 나오는 테이블
 * 회원이름 누르면 회원이름으로 된 테이블 조회
 */
const ReservationClassItem_choice2 = ({
  client_choice,
  handleClick_choice,
  reservationChoiceClient,
}) => {
  const handleInnerOnClick_choice = () => {
    handleClick_choice(client_choice);
    reservationChoiceClient(client_choice);
  };
  return (
    <Button
      variant='outline-light'
      className='m-1'
      onClick={handleInnerOnClick_choice}
    >
      {client_choice}
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
      Redux: '',
      reservation_trainer: [],
      reservation_exercise: [],
      reservation_date: [],
      reservation_choice_trainer: [],
      reservation_choice_client: [],
      reservation_data: [],
      reservationClass: [],
      reservationClass_choice: [],
      reservationClass_choice2: [],
      customer_name: '',
      customer_id: '',
      isCancel: 1,
      reserv_date: new Date(),
      time: '',
      exercise_name: '',
      kind: '',
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
      rowsPerPage: 5,
      page: 0,
      key: 'pt',
      keyTrainer: 'trainerAll',
    };
    // this.handleWeekClick = this.handleWeekClick.bind(this);
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
        this.reservationClassSelect_choice2();
        this.reservationClassSelect();
      }
    });
  }
  /**
   * 예약테이블 전체보기
   */
  reservationSelect = () => {
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
        // this.props.userinfo.loginWhether === 2
        //   ? console.log(clientResult[0].fitness_no)
        //   : this.props.userinfo.loginWhether === 1
        //   ? console.log(trainerResult[0].fitness_no)
        //   : console.log(this.props.userinfo.fitness_no);
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
                  fitness_no={fitness_no}
                  res_no={data.res_no}
                  date={date}
                  kind={data.kind}
                  exercise_name={data.exercise_name}
                  customer_name={data.customer_name}
                  number_of_people={data.number_of_people}
                  exercise_length={exercise_length}
                  time={data.time}
                  reservationSelect={this.reservationSelect}
                  trainer={data.trainer}
                />
              );
            });
          this.setState({ reservation: items, reservation_data: result }, () =>
            this.reservationClassSelect()
          );
          // console.log('reservation_data', result);
        });
      });
    });
  };
  /**
   * 예약 운동정렬
   */
  reservationSelect_exercise = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
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
                fitness_no={fitness_no}
                res_no={data.res_no}
                date={date}
                kind={data.kind}
                exercise_name={data.exercise_name}
                customer_name={data.customer_name}
                number_of_people={data.number_of_people}
                exercise_length={exercise_length}
                time={data.time}
                reservationSelect={this.reservationSelect_exercise}
                trainer={data.trainer}
              />
            );
          });
        this.setState(
          { reservation_exercise: items, reservation_data: result },
          () => this.reservationClassSelect()
        );
      });
    });
  };
  /**
   * 예약 강사정렬
   */
  reservationSelect_trainer = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
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
                fitness_no={fitness_no}
                res_no={data.res_no}
                date={date}
                kind={data.kind}
                exercise_name={data.exercise_name}
                customer_name={data.customer_name}
                number_of_people={data.number_of_people}
                exercise_length={exercise_length}
                time={data.time}
                reservationSelect={this.reservationSelect_trainer}
                trainer={data.trainer}
              />
            );
          });
        this.setState(
          { reservation_trainer: items, reservation_data: result },
          () => this.reservationClassSelect()
        );
      });
    });
  };
  /**
   * 예약 날짜정렬
   */
  reservationSelect_date = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
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
                fitness_no={fitness_no}
                res_no={data.res_no}
                date={date}
                kind={data.kind}
                exercise_name={data.exercise_name}
                customer_name={data.customer_name}
                number_of_people={data.number_of_people}
                exercise_length={exercise_length}
                time={data.time}
                reservationSelect={this.reservationSelect_trainer}
                trainer={data.trainer}
              />
            );
          });
        this.setState(
          { reservation_date: items, reservation_data: result },
          () => this.reservationClassSelect()
        );
      });
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
   * 강사별 예약테이블(탭)
   */
  reservationChoiceTrainer = (trainer_choice) => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      getReservation_choice_trainer(fitness_no, trainer_choice).then(
        (result) => {
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
                  fitness_no={fitness_no}
                  res_no={data.res_no}
                  date={date}
                  kind={data.kind}
                  exercise_name={data.exercise_name}
                  customer_name={data.customer_name}
                  number_of_people={data.number_of_people}
                  exercise_length={exercise_length}
                  time={data.time}
                  reservationChoiceTrainer={this.reservationChoiceTrainer}
                  trainer={data.trainer}
                />
              );
            });
          this.setState({
            reservation_choice_trainer: items.reverse(),
            reservation_data: result,
          });
        }
      );
    });
  };

  /**
   * 회원별 예약테이블(탭)
   */
  reservationChoiceClient = (client_choice) => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? clientResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      getReservation_choice_client(fitness_no, client_choice).then((result) => {
        const items = result.map((data, index, array) => {
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
            <ReservationChoiceClientItem
              fitness_no={fitness_no}
              res_no={data.res_no}
              date={date}
              kind={data.kind}
              exercise_name={data.exercise_name}
              customer_name={data.customer_name}
              number_of_people={data.number_of_people}
              exercise_length={exercise_length}
              time={data.time}
              trainer={data.trainer}
              reservationChoiceClient={this.reservationChoiceClient}
            />
          );
        });
        this.setState({
          reservation_choice_client: items.reverse(),
          reservation_data: result,
        });
      });
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
      alert('이미 지난 수업은 예약할 수 없습니다.');
    } else if (
      this.props.userinfo.loginWhether === 2
        ? ''
        : this.state.customer_name == ''
    ) {
      this.setState({ customer_name_err: true });
      alert('회원을 선택해 주세요');
    } else if (this.state.kind == 'GX') {
      alert('GX 수업은 예약할 수 없습니다.');
    } else {
      selectTrainerReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        selectClientReservation(
          this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
        ).then((clientResult) => {
          const fitness_no =
            this.props.userinfo.loginWhether === 1
              ? trainerResult[0].fitness_no
              : this.props.userinfo.loginWhether === 2
              ? clientResult[0].fitness_no
              : this.props.userinfo.fitness_no;
          voucherSelect2(
            this.props.userinfo.loginWhether === 2
              ? this.props.userinfo.manager_name
              : this.state.customer_name,
            fitness_no,
            this.state.kind
          ).then((res) => {
            // console.log(res[0]);
            if (res[0] === undefined) {
              if (this.props.userinfo.loginWhether === 2) {
                alert('이용권이 없습니다. 이용권을 결제 후 예약가능합니다.');
              } else {
                confirm(
                  this.state.customer_name +
                    '님은 ' +
                    this.state.kind +
                    '이용권이 없습니다. 그래도 예약하시겠습니까?'
                ) === true
                  ? reservationInsert(
                      fitness_no,
                      date,
                      this.state.time,
                      this.state.exercise_name,
                      this.props.userinfo.loginWhether === 2
                        ? this.props.userinfo.manager_name
                        : this.state.customer_name,
                      this.state.number_of_people,
                      this.state.trainer,
                      this.props.userinfo.loginWhether === 2
                        ? this.props.userinfo.id
                        : this.state.customer_id,
                      this.state.kind
                    ).then((result) => {
                      if (result.message == 'ok') {
                        alert('예약이 완료되었습니다.');
                        // console.log(this.state.reserv_date)
                      } else {
                        alert(result.message);
                      }
                      this.reservationSelect();
                      this.setState({
                        exercise_name: '',
                        trainer: '',
                        customer_name: '',
                        date: '',
                        number_of_people: '',
                        time: '',
                        class_date: '',
                        kind: '',
                      });
                    })
                  : alert(this.state.customer_name + '님은 취소됐습니다.');
              }
            } else if (res[0].paidMembership2 == 0) {
              alert('기간권소지자입니다. 이용권을 결제 후 이용가능합니다.');
            } else {
              reservationInsert(
                fitness_no,
                date,
                this.state.time,
                this.state.exercise_name,
                this.props.userinfo.loginWhether === 2
                  ? this.props.userinfo.manager_name
                  : this.state.customer_name,
                this.state.number_of_people,
                this.state.trainer,
                this.props.userinfo.loginWhether === 2
                  ? this.props.userinfo.id
                  : this.state.customer_id,
                this.state.kind
              ).then((result) => {
                if (result.message == 'ok') {
                  alert('예약이 완료되었습니다.');
                  voucherUpdate(
                    res[0].client_name,
                    res[0].kind,
                    res[0].paidMembership2 - 1
                  ).then((res2) =>
                    alert(
                      res[0].client_name +
                        '님 의' +
                        res[0].kind +
                        '이용권이 1회 차감됩니다. 잔여 이용권은' +
                        (res[0].paidMembership2 - 1) +
                        '회 입니다.'
                    )
                  );
                  // console.log(this.state.reserv_date)
                } else {
                  alert(result.message);
                }
                this.reservationSelect();
                this.setState({
                  exercise_name: '',
                  trainer: '',
                  customer_name: '',
                  date: '',
                  number_of_people: '',
                  time: '',
                  class_date: '',
                  kind: '',
                });
              });
            }
          });
        });
      });
    }
  };

  /**
   * 운동클래스
   */
  reservationClassSelect = () => {
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
                  .isSameOrBefore(
                    moment().day(7 + this.state.dayIncreament),
                    'day'
                  )
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
                  kind={data.kind}
                  handleClick={(
                    result_exercise_name,
                    result_kind,
                    result_number_of_people,
                    result_hour,
                    result_minute,
                    result_trainer,
                    result_class_date
                  ) =>
                    this.setState({
                      exercise_name: result_exercise_name,
                      kind: result_kind,
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
      });
    });
  };

  /**
   * 강사별조회 예약현황(탭)
   */
  reservationClassSelect_choice = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      selectTrainer(fitness_no).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ReservationClassItem_choice
              trainer_choice={data.trainer_name}
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
        // console.log('강사별조회', result);
        this.setState({ reservationClass_choice: items });
      });
    });
  };
  /**
   * 회원별조회 예약현황(탭)
   */
  reservationClassSelect_choice2 = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      clientSelect(fitness_no).then((result) => {
        const items = result.map((data, index, array) => {
          return (
            <ReservationClassItem_choice2
              client_choice={data.client_name}
              handleClick_choice={(result_client_choice) =>
                this.setState({
                  trainer_choice: result_client_choice,
                })
              }
              reservationChoiceClient={this.reservationChoiceClient}
            />
          );
        });
        // console.log('회원별조회', result);
        this.setState({ reservationClass_choice2: items });
      });
    });
  };

  handleUser = (customer) => {
    const { idc, client_name } = customer;
    this.setState({
      customer: customer,
      customer_name: client_name,
      customer_id: idc,
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
    } else if (name === 'prev') {
      // eslint-disable-next-line no-unused-expressions
      this.setState({
        dayIncreament: this.state.dayIncreament - 7,
      }),
        this.reservationClassSelect();
    }
  };
  goLogin = () => {
    this.props.history.push('/');
  };
  goReservationClass = () => {
    this.props.history.push('/reservationClass');
  };

  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 });
  };

  handleChangePage = (e, newPage) => {
    this.setState({ page: newPage });
  };

  selectClassTabs = (e) => {
    this.setState({ key: e });
  };
  render() {
    // console.log(this.state.customer_name);
    // console.log(this.state.kind);
    // console.log('rowPerPage', this.state.rowsPerPage);
    // console.log('page', this.state.page);
    // console.log(this.props.userinfo.loginWhether);
    // console.log('joinNo', this.props.userinfo.joinNo);
    // console.log(this.state.reservationClass);
    // console.log("exercise", this.state.reservation_exercise);
    // console.log("trainer", this.state.reservation_trainer);
    // console.log("reservation_choice_trainer", this.state.reservation_choice_trainer);
    // console.log('reservationClass_choice', this.state.reservationClass_choice);

    return (
      <div className='wrap reservation'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
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
        <Row className='reservation__class'>
          <Col>
            <Row md={3}>
              <Col className='text-end'>
                <Button
                  className='reservation__class-prev'
                  name='prev'
                  variant='outline-light'
                  onClick={this.handleWeekClick}
                >
                  이전주
                </Button>
              </Col>
              <Col className='text-center align-self-center fs-5'>
                {moment(this.state.reserv_date)
                  .day(0)
                  .add(this.state.dayIncreament, 'days')
                  .format('YYYY-MM-DD (ddd)')}{' '}
                ~{' '}
                {moment(this.state.reserv_date)
                  .day(6)
                  .add(this.state.dayIncreament, 'days')
                  .format('YYYY-MM-DD (ddd)')}
              </Col>
              <Col className='text-start'>
                <Button
                  className='reservation__class-next'
                  name='next'
                  variant='outline-light'
                  onClick={this.handleWeekClick}
                >
                  다음주
                </Button>
              </Col>
            </Row>
            <Tabs
              className='reservation__class-container'
              id='reservation__class__tabs'
              activeKey={this.key}
              onSelect={this.selectClassTabs}
            >
              <Tab className='' eventKey='pt' title='개인PT'>
                <Tabs
                  activeKey={this.keyTrainer}
                  onSelect={this.selectClassTabs}
                >
                  <Tab eventKey='trainerAll' title='전체'>
                    <TableContainer>
                      <Table class='table class-list'>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(0)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(1)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(2)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(3)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(4)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(5)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                            <TableCell scope='col' align='center'>
                              {moment(this.state.reserv_date)
                                .day(6)
                                .add(this.state.dayIncreament, 'days')
                                .format('MM-DD (dd)')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align='center' className='align-top'>
                              {this.state.reservationClass.length === 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          0 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          0 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='mon'
                              align='center'
                              className='align-top'
                            >
                              {' '}
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary  rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          1 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          1 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='tue'
                              align='center'
                              className='align-top'
                            >
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          2 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          2 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='wed'
                              align='center'
                              className='align-top'
                            >
                              {' '}
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          3 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          3 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='thu'
                              align='center'
                              className='align-top'
                            >
                              {' '}
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          4 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          4 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='fri'
                              align='center'
                              className='align-top'
                            >
                              {' '}
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          5 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          5 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                            <TableCell
                              name='sat'
                              align='center'
                              className='align-top'
                            >
                              {' '}
                              {this.state.reservationClass.length == 0 ? (
                                <div className='py-2 my-1 text-secondary rounded'>
                                  <TbMoodSuprised className='fs-3' />
                                  <p>수업이 없습니다.</p>
                                </div>
                              ) : (
                                this.state.reservationClass.filter(
                                  (value) =>
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrAfter(
                                        moment().day(
                                          6 + this.state.dayIncreament
                                        ),
                                        'day'
                                      ) &&
                                    moment(value.props.class_date.split('T')[0])
                                      .add(9, 'hour')
                                      .isSameOrBefore(
                                        moment().day(
                                          6 + this.state.dayIncreament
                                        ),
                                        'day'
                                      )
                                )
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Tab>
                  <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                  <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                  <Tab eventKey='trainer3' title='한세연 강사'></Tab>
                </Tabs>
              </Tab>
              <Tab eventKey='pilates' title='필라테스'>
                <Tabs
                  activeKey={this.keyTrainer}
                  onSelect={this.selectClassTabs}
                >
                  <Tab eventKey='trainerAll' title='전체'></Tab>
                  <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                  <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                  <Tab eventKey='trainer3' title='한세연 강사'></Tab>
                </Tabs>
              </Tab>
              <Tab eventKey='gx' title='GX'>
                <Tabs
                  activeKey={this.keyTrainer}
                  onSelect={this.selectClassTabs}
                >
                  <Tab eventKey='trainerAll' title='전체'></Tab>
                  <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                  <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                  <Tab eventKey='trainer3' title='한세연 강사'></Tab>
                </Tabs>
              </Tab>
              <Tab eventKey='etc' title='기타'>
                <Tabs
                  activeKey={this.keyTrainer}
                  onSelect={this.selectClassTabs}
                >
                  <Tab eventKey='trainerAll' title='전체'></Tab>
                  <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                  <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                  <Tab eventKey='trainer3' title='한세연 강사'></Tab>
                </Tabs>
              </Tab>
            </Tabs>
          </Col>
          <Col className='reservation__class__console'>
            {this.props.userinfo.loginWhether === 2 ? (
              ' '
            ) : (
              <Button onClick={this.goReservationClass}>수업추가</Button>
            )}
            <div className='reservation__class__console-info'>
              <h5>선택된 수업</h5>
              <Row>
                <Col xs={4}>운동명</Col>
                <Col xs={8}>
                  {this.state.exercise_name
                    ? this.state.exercise_name + '[' + this.state.kind + ']'
                    : ''}
                  <TextField
                    id='exercise_name'
                    className='d-none'
                    value={this.state.exercise_name}
                    // onChange={this.handleChange}
                    label='운동명'
                    err={this.state.exercise_name_err}
                  />
                </Col>
                <Col xs={4}>날짜</Col>
                <Col xs={8}>
                  <p className='fw-bold text-primary'>
                    {moment(this.state.class_date).format('yyyy-MM-DD') ==
                    'Invalid date'
                      ? ''
                      : moment(this.state.class_date).format('yyyy-MM-DD')}
                  </p>
                  <TextField
                    id='class_date'
                    className='d-none'
                    name='class_date'
                    value={this.state.class_date}
                    label='배정된 날짜'
                  />
                </Col>
                <Col xs={4}>시간</Col>
                <Col xs={8}>
                  {this.state.time}
                  <TextField
                    id='time'
                    className='d-none'
                    value={this.state.time}
                    // onChange={this.handleChange}
                    label='시간'
                  />
                </Col>
                <Col xs={4}>현재정원</Col>
                <Col xs={8}>
                  {this.state.number_of_people == ''
                    ? ''
                    : this.state.number_of_people + '명'}
                  <TextField
                    id='number_of_people'
                    className='d-none'
                    value={this.state.number_of_people}
                    // onChange={this.handleChange}
                    label='최대 인원수'
                  />
                </Col>
                <Col xs={4}>예약자</Col>
                <Col xs={8}></Col>
                {/* 
                  강사명 표시
                <Col className='' xs={12} sm={4}>
                  <div className=''>
                    <p className='fw-bold text-primary'>{this.state.trainer}</p>
                  </div>
                  <TextField
                    id='trainer'
                    className='d-none'
                    value={this.state.trainer}
                    // onChange={this.handleChange}
                    label='강사명'
                    // err={this.state.trainer_err}
                  />
                </Col> */}
                <Col className='' xs={12} sm={4}></Col>
              </Row>
            </div>
            {this.props.userinfo.loginWhether === 2 ? (
              <Col className='text-center my-3'>
                <TextField
                  id='customer_name'
                  variant='standard'
                  value={this.props.userinfo.manager_name}
                  // onChange={this.handleChange}
                />
              </Col>
            ) : (
              <Col className='text-center'>
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
                    className='boxmorpsm h-100 w-100 justify-content-center'
                    InputProps={{ disableUnderline: true }}
                    value={this.state.customer_name}
                    // onChange={this.handleChange}
                    error={this.state.customer_name_err}
                  />
                )}
              </Col>
            )}

            <Col className='text-center w-100 mt-3' xs={12}>
              <Button
                className='btnSolid mx-4 px-5'
                type='button'
                onClick={this.handleOnClick}
              >
                예약하기
              </Button>
            </Col>
          </Col>
        </Row>
        <Container className='reservation__list'>
          <Row xs={1} sm={3}>
            {this.props.userinfo.loginWhether === 2 ? (
              ''
            ) : (
              <Col xs={12}>
                <h4 className=''>예약 현황</h4>
              </Col>
            )}
            {this.props.userinfo.loginWhether === 2 ? (
              ''
            ) : (
              <Col
                xs={12}
                className='w-100 overflow-auto reservation__reservation-status'
              >
                <Tabs
                  defaultActiveKey='home'
                  id='uncontrolled-tab-example'
                  className='mb-3'
                >
                  <Tab eventKey='home' title='전체보기'>
                    <Table class='table text-center reservationListTable'>
                      <TableHead rowCount={this.state.reservation.length}>
                        <TableRow>
                          <TableCell>
                            <Button variant='dark' className='w-100 fw-bold'>
                              회원이름
                            </Button>
                          </TableCell>
                          {/* handleDate, handleExercise, handleTrainer 를 EnhancedTableHead로 변경하기 추후 */}
                          <TableCell>
                            <Button
                              variant='secondary'
                              className='w-100 fw-bold'
                              onClick={() => this.handleDate()}
                            >
                              수강 날짜 <ImSortAlphaAsc />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant='secondary'
                              className='w-100 fw-bold'
                              onClick={() => this.handleExercise()}
                            >
                              운동 <ImSortAlphaAsc />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant='secondary'
                              className='w-100 fw-bold'
                              onClick={() => this.handleTrainer()}
                            >
                              강사 <ImSortAlphaAsc />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant='dark' className='w-100 fw-bold'>
                              인원수
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant='dark' className='w-100 fw-bold'>
                              시간
                            </Button>
                          </TableCell>
                          {/* <th scope='col'>상태</th>
										<th scope='col'>취소사유</th> */}
                          <TableCell>
                            <Button variant='dark' className='w-100 fw-bold'>
                              삭제
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {this.state.show_exercise_table &&
                      !this.state.show_trainer_table &&
                      !this.state.show_date_table ? (
                        <TableBody>
                          {this.state.reservation_exercise.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation_exercise.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                      ) : null}

                      {this.state.show_trainer_table &&
                      !this.state.show_exercise_table &&
                      !this.state.show_date_table ? (
                        <TableBody>
                          {this.state.reservation_trainer.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation_trainer.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                      ) : null}
                      {this.state.show_date_table &&
                      !this.state.show_exercise_table &&
                      !this.state.show_trainer_table ? (
                        <TableBody>
                          {this.state.reservation_date.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation_date.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                      ) : null}

                      {!this.state.show_exercise_table &&
                      !this.state.show_trainer_table &&
                      !this.state.show_date_table ? (
                        <TableBody>
                          {this.state.reservation.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                      ) : null}
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          {
                            label: 'All',
                            value: this.state.reservation.length,
                          },
                        ]}
                        count={this.state.reservation.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onPageChange={this.handleChangePage}
                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                      />
                    </Table>
                  </Tab>

                  <Tab eventKey='trainer' title='강사별 조회'>
                    <p>{this.state.reservationClass_choice}</p>
                    <TableContainer>
                      <Table class='table text-center reservationListTable'>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='col'>회원이름</TableCell>
                            <TableCell scope='col'>날짜</TableCell>
                            <TableCell scope='col'>운동</TableCell>
                            <TableCell scope='col'>강사</TableCell>
                            <TableCell scope='col'>인원수</TableCell>
                            <TableCell scope='col'>시간</TableCell>
                            {/* <TableCell scope='col'>상태</TableCell>
										<TableCell scope='col'>취소사유</TableCell> */}
                            <TableCell scope='col'>삭제</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.reservation_choice_trainer.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation_choice_trainer.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            {
                              label: 'All',
                              value:
                                this.state.reservation_choice_trainer.length,
                            },
                          ]}
                          count={this.state.reservation_choice_trainer.length}
                          rowsPerPage={this.state.rowsPerPage}
                          page={this.state.page}
                          onPageChange={this.handleChangePage}
                          onRowsPerPageChange={this.handleChangeRowsPerPage}
                        />
                      </Table>
                    </TableContainer>
                  </Tab>
                  <Tab eventKey='client' title='회원별조회'>
                    <Col className='text-center'>
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
                          className=''
                          InputProps={{ disableUnderline: true }}
                          value={this.state.customer_name}
                          // onChange={this.handleChange}
                          error={this.state.customer_name_err}
                        />
                      )}
                    </Col>
                    {/* 회원 선택 버튼 나열
                    <p>{this.state.reservationClass_choice2}</p> */}
                    <TableContainer>
                      <Table class='table text-center reservationListTable'>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='col'>회원이름</TableCell>
                            <TableCell scope='col'>날짜</TableCell>
                            <TableCell scope='col'>운동</TableCell>
                            <TableCell scope='col'>강사</TableCell>
                            <TableCell scope='col'>인원수</TableCell>
                            <TableCell scope='col'>시간</TableCell>
                            <TableCell scope='col'>삭제</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.reservation_choice_client.length == 0 ? (
                            <TableCell colSpan={7}>
                              <div className='p-3 fs-5 fw-bold text-center text-white'>
                                <TbMoodSuprised className='fs-3' />
                                <p>예약된 수업이 없습니다.</p>
                              </div>
                            </TableCell>
                          ) : (
                            this.state.reservation_choice_client.slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                          )}
                        </TableBody>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            {
                              label: 'All',
                              value:
                                this.state.reservation_choice_client.length,
                            },
                          ]}
                          count={this.state.reservation_choice_client.length}
                          rowsPerPage={this.state.rowsPerPage}
                          page={this.state.page}
                          onPageChange={this.handleChangePage}
                          onRowsPerPageChange={this.handleChangeRowsPerPage}
                        />
                      </Table>
                    </TableContainer>
                  </Tab>
                </Tabs>
              </Col>
            )}
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
