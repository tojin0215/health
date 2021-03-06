import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';

import DatePicker from 'react-datepicker';
// locale 오류로 임시 삭제
// import DatePicker, { registerLocale } from 'react-datepicker';
// import ko from 'date-fns/locale/ko';

import { getStatusRequest, login } from '../../action/authentication';

import { Container, Row, Col, Table, FloatingLabel } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { AiFillTool } from 'react-icons/ai';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';

import styles from '../../styles/reservation/reservationClass.css';

import { SERVER_URL } from '../../const/settings';

import moment from 'moment';

import TextField from '@mui/material/TextField';
import {
  getReservationClassBy,
  reservationDataDelete,
  selectTrainerReservation,
} from '../../api/user';
import TrainerSearch from '../../component/customer/TrainerSearch';

// locale 오류로 임시 삭제
// registerLocale('ko', ko);

const ip = SERVER_URL;
/*
운동클래스 body
*/
const ReservationClassItem = ({
  exercise_class,
  no,
  number_of_people,
  reserv_time,
  reservationClassSelect,
  fitness_no,
  hour,
  minute,
  trainer,
  class_date,
  updateOpen,
  loginWhether,
  loginWhetherTrainer,
}) => {
  /*
	운동클래스 delete
	*/
  const reservationClassDelete = (no) => {
    fetch(ip + '/reservationClass/delete?no=' + no, {
      method: 'DELETE',
    }).then((result) => {
      modalClose();
      reservationDelete();
      reservationClassSelect();
      reservationDelete();
    });
  };
  const reservationDelete = () => {
    const time = hourArray + ':' + minuteArray;
    reservationDataDelete(
      exercise_class,
      class_date,
      fitness_no,
      time,
      trainer
    );
  };
  const [showModal, setShowModal] = useState(false);

  const [exercise_class_err, setExercise_class_err] = useState(false);
  const [number_of_people_err, setNumber_of_people_err] = useState(false);
  const [hour_err, setHour_err] = useState(false);
  const [minute_err, setMinute_err] = useState(false);
  const [trainer_err, setTrainer_err] = useState(false);
  const [class_date_err, setClass_date_err] = useState(false);

  const [exercise_class_input, setExercise_class_input] = useState('');
  const [class_date_input, setClass_date_input] = useState('');
  const [trainer_input, setTrainer_input] = useState(
    loginWhether === 1 ? loginWhetherTrainer : ''
  );
  const [number_of_people_input, setNumber_of_people_input] = useState('');
  const [hour_input, setHour_input] = useState('');
  const [minute_input, setMinute_input] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const updateChange = (e) => {
    setExercise_class_input(e.target.value);
  };
  const updateChange2 = (e) => {
    setNumber_of_people_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setHour_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setMinute_input(e.target.value);
  };
  const updateChange5 = (e) => {
    setTrainer_input(e.target.value);
  };
  const updateChange6 = (e) => {
    setClass_date_input(e.target.value);
  };

  /*
	운동클래스 update
	*/
  const reservationClassUpdate = (no) => {
    if (exercise_class_input == '') {
      setExercise_class_err(true);
      alert('운동명을 써주세요.');
    } else if (class_date_input == class_date) {
      setClass_date_err(true);
      alert('날짜를 써주세요.');
    } else if (trainer_input == '') {
      setTrainer_err(true);
      alert('트레이너명을 선택해주세요.');
    } else if ((number_of_people_input == '', number_of_people_input == 0)) {
      setNumber_of_people_err(true);
      alert('인원을 확인해 주세요.(숫자만, 0입력불가)');
    } else if (hour_input >= 24) {
      setHour_err(true);
      alert('00~23시까지 설정 가능합니다.');
    } else if (minute_input >= 59) {
      setMinute_err(true);
      alert('0~59분까지 설정 가능합니다.');
    } else {
      fetch(ip + '/reservationClass/update?no=' + no, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          fitness_no: fitness_no,
          exercise_class: exercise_class_input,
          number_of_people: number_of_people_input,
          hour: hour_input,
          minute: minute_input,
          trainer: trainer_input,
          class_date: class_date_input + 'T00:00:00.000Z',
        }),
      })
        .then((result) => result.json())
        .then((result) => {
          alert('수정 완료');
          modalClose();
          reservationClassSelect();
        });
    }
  };

  const modalOnClick = () => {
    setShowModal(true);
    setExercise_class_input(exercise_class);
    setNumber_of_people_input(number_of_people);
    setHour_input(hour);
    setMinute_input(minute);
    setTrainer_input(trainer);
    setClass_date_input(class_date);
  };
  const modalClose = () => {
    setShowModal(false);
  };
  const hourArray = hour >= 10 ? hour : '0' + hour;

  const minuteArray = minute >= 10 ? minute : '0' + minute;
  // console.log(class_date_input);
  // console.log(class_date);
  // console.log(searchOpen);
  const handleUser = (sTrainer) => {
    setTrainer_input(sTrainer.trainer_name);
    setSearchOpen(false);
  };
  // console.log(loginWhether);
  // console.log(loginWhetherTrainer);

  return (
    <div className='border py-2 my-1 text-center'>
      <p className='fw-bold'>{exercise_class}</p>
      <p>{trainer}</p>
      <p>
        {hourArray}시{minuteArray}분
      </p>
      <p>정원: {number_of_people}명</p>
      {(loginWhether === 1 && loginWhetherTrainer === trainer) ||
      (loginWhether === 0 && loginWhetherTrainer !== trainer) ? (
        updateOpen ? (
          <Button variant='outline-success mt-2' onClick={modalOnClick}>
            <AiFillTool className='align-baseline' />
          </Button>
        ) : (
          ''
        )
      ) : (
        ''
      )}

      <div>
        <Modal show={showModal}>
          <Container>
            <Row>
              <Form.Group>
                <Form.Label>운동명</Form.Label>
                <Form.Control
                  value={exercise_class_input}
                  id='exercise_class'
                  onChange={updateChange}
                  error={exercise_class_err}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>강사명</Form.Label>
                {loginWhether === 1 ? (
                  <Form.Control
                    value={trainer_input}
                    id='trainer'
                    error={trainer_err}
                  ></Form.Control>
                ) : (
                  <Form.Control
                    value={trainer_input}
                    onClick={() => setSearchOpen(true)}
                    id='trainer'
                    error={trainer_err}
                  ></Form.Control>
                )}

                <Modal show={searchOpen}>
                  <div>
                    <TrainerSearch
                      open={searchOpen}
                      setOpen={(o) => setSearchOpen(o)}
                      fitness_no={fitness_no}
                      handleUser={handleUser}
                    />
                  </div>
                </Modal>
              </Form.Group>
              <Form.Group>
                <Form.Label>날짜</Form.Label>
                <Form.Control
                  type='date'
                  selected={setClass_date_input}
                  value={class_date_input}
                  id='class_date'
                  onChange={updateChange6}
                  error={class_date_err}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>시간</Form.Label>
                <Form.Control
                  value={hour_input == 0 ? '00' : hour_input}
                  type='number'
                  id='hour'
                  onChange={updateChange3}
                  error={hour_err}
                ></Form.Control>
                시
                <Form.Control
                  type='number'
                  value={minute_input == 0 ? '00' : minute_input}
                  id='minute'
                  onChange={updateChange4}
                  error={minute_err}
                ></Form.Control>
                분
              </Form.Group>
              <Form.Group>
                <Form.Label>수강인원</Form.Label>
                <Form.Control
                  type='number'
                  value={number_of_people_input}
                  id='number_of_people'
                  onChange={updateChange2}
                  error={number_of_people_err}
                ></Form.Control>
              </Form.Group>
            </Row>
            <Row className='mt-3'>
              <Col xs={4}>
                <Button
                  className='w-100'
                  variant='danger'
                  onClick={() =>
                    // eslint-disable-next-line no-restricted-globals
                    confirm(
                      '정말 삭제하시겠습니까?_예약된 회원도 같이 취소됩니다.'
                    ) == true
                      ? reservationClassDelete(no)
                      : alert('삭제가 취소 되었습니다.')
                  }
                >
                  삭제
                </Button>
              </Col>
              <Col xs={8}>
                <Button
                  className='w-100'
                  onClick={() => reservationClassUpdate(no)}
                >
                  수정하기
                </Button>
              </Col>
              <Col xs={12} className='mt-2'>
                <Button
                  className='w-100'
                  variant='outline-light'
                  onClick={modalClose}
                >
                  닫기
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal>
      </div>
    </div>
  );
};

class ReservationClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise_class: '',
      fitness_no: 2,
      number_of_people: '',
      reservationClass: [],
      hour: '',
      minute: '',
      trainer: '',
      class_date: new Date(),
      hour_err: false,
      minute_err: false,
      exercise_class_err: false,
      number_of_people_err: false,
      trainer_err: false,
      class_date_err: false,
      dayIncreament: 0,
      updateOpen: false,
      trainerTable: [],
      open: false,
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
        this.reservationClassSelect();
      }
    });
  }

  handleUser = (trainer) => {
    const { idx, trainer_name } = trainer;
    this.setState({
      trainer: trainer,
      trainer_name: trainer_name,
      trainer_id: idx,
      open: false,
    });
  };

  /*
운동클래쓰
	*/
  reservationClassSelect = () => {
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      // console.log(trainerResult[0].fitness_no);
      const fitness_no =
        this.props.userinfo.loginWhether === 1
          ? trainerResult[0].fitness_no
          : this.props.userinfo.fitness_no;
      getReservationClassBy(fitness_no).then((result) => {
        // console.log("dayIncreament", this.state.dayIncreament)
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
            const date_value = data.class_date
              ? moment(data.class_date.split('T')[0])
              : moment();

            const handling = this.state.updateOpen ? true : false;

            return (
              <ReservationClassItem
                fitness_no={fitness_no}
                reservationClassSelect={this.reservationClassSelect}
                exercise_class={data.exercise_class}
                no={data.no}
                number_of_people={data.number_of_people}
                hour={data.hour}
                minute={data.minute}
                trainer={data.trainer}
                class_date={data.class_date}
                updateOpen={handling}
                loginWhether={this.props.userinfo.loginWhether}
                loginWhetherTrainer={this.props.userinfo.manager_name}
              />
            );
          });
        // eslint-disable-next-line no-unused-expressions
        this.setState({ reservationClass: items });
        // console.log(this.state.reservationClass);
      });
    });
  };

  handleWeekClick = (w) => {
    const dayIncreament = 0;
    const name = w.target.name;
    if (name === 'next') {
      this.setState({
        dayIncreament: this.state.dayIncreament + 7,
      }),
        this.reservationClassSelect();
    } else if (name === 'prev') {
      this.setState({
        dayIncreament: this.state.dayIncreament - 7,
      }),
        this.reservationClassSelect();
    }
  };

  handleOnClick = () => {
    this.setState({
      exercise_class_err: false,
      number_of_people_err: false,
      hour_err: false,
      minute_err: false,
      trainer_err: false,
      class_date_err: false,
    });
    selectTrainerReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((trainerResult) => {
      if (this.state.exercise_class == '') {
        this.setState({ exercise_class_err: true });
        alert('운동명을 써주세요.');
      } else if (this.state.class_date == '') {
        this.setState({ class_date_err: true });
        alert('날짜를 써주세요.');
      } else if (
        this.props.userinfo.loginWhether === 1 ? '' : this.state.trainer == ''
      ) {
        this.setState({ trainer_err: true });
        alert('강사명을 써주세요.');
      } else if (
        (this.state.number_of_people == '', this.state.number_of_people == 0)
      ) {
        this.setState({ number_of_people_err: true });
        alert('인원을 확인해 주세요.(숫자만, 0입력불가)');
      } else if (this.state.hour >= 24) {
        this.setState({ hour_err: true });
        alert('00~23시까지 설정 가능합니다.');
      } else if (this.state.minute >= 59) {
        this.setState({ minute_err: true });
        alert('0~59분까지 설정 가능합니다.');
      } else if (this.state.hour == '') {
        this.setState({ hour_err: true });
        alert('시를 확인해 주세요.(0~24)');
      } else if (this.state.minute == '') {
        this.setState({ minute_err: true });
        alert('분을 확인해 주세요.(0~59)');
      } else {
        const date =
          moment(this.state.class_date).format('YYYY-MM-DD') + 'T00:00:00.000Z';

        fetch(ip + '/reservationClass/insert', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            fitness_no:
              this.props.userinfo.loginWhether === 1
                ? trainerResult[0].fitness_no
                : this.props.userinfo.fitness_no,
            exercise_class: this.state.exercise_class,
            number_of_people: this.state.number_of_people,
            hour: this.state.hour,
            minute: this.state.minute,
            trainer:
              this.props.userinfo.loginWhether === 1
                ? trainerResult[0].trainer_name
                : this.state.trainer_name,
            class_date: date,
          }),
        })
          .then((result) => result.json())
          .then((result) => {
            if (result.message == 'ok') {
              alert('운동 설정이 완료되었습니다.');
              console.log(this.state.class_date);
            } else {
              alert(result.message);
            }
            this.reservationClassSelect();
            this.setState({
              exercise_class: '',
              number_of_people: '',
              hour: '',
              minute: '',
              trainer: '',
              class_date: new Date(),
              trainer_name: '',
            });
          });
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleUpdate = () => {
    // alert("오늘 이전에 설정한 운동은 수정 및 삭제가 불가합니다.");
    // if (condition) {
    // } else {
    // }
    this.setState(
      {
        updateOpen: !this.state.updateOpen,
      },
      this.reservationClassSelect()
    );
    // console.log("수정하기", this.state.updateOpen);
  };
  goLogin = () => {
    this.props.history.push('/');
  };
  render() {
    // console.log(this.props.userinfo.loginWhether);
    return (
      <div className='wrap reservationClassWrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                수업 만들기
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/reservation'>수업</Link>
                <span>&#62;</span>
                <Link to='/reservationClass'>수업 만들기</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>

        <Container>
          <Row className='pb-5 justify-content-center'>
            <Col>
              <h4>수업 만들기</h4>
            </Col>
            <Col className='text-end'>
              <Link to='/reservation'>
                <Button variant='outline-light me-2'>돌아가기</Button>
              </Link>
              <Button onClick={this.handleUpdate}>수정하기</Button>
            </Col>
          </Row>
          <Row xs={3}>
            <Col className='text-end'>
              <Button
                name='prev'
                variant='outline-light'
                onClick={this.handleWeekClick}
              >
                이전주
              </Button>
            </Col>
            <Col className='text-center align-self-center fs-5'>
              <div>
                {' '}
                {moment(this.state.class_date)
                  .day(0)
                  .add({ days: this.state.dayIncreament })
                  .format('YYYY-MM-DD (dd)')}{' '}
                ~{' '}
                {moment(this.state.class_date)
                  .day(6)
                  .add({ days: this.state.dayIncreament })
                  .format('YYYY-MM-DD (dd)')}
              </div>
            </Col>
            <Col className='text-start'>
              <Button
                name='next'
                variant='outline-light'
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
              <table class='table' name='classTable'>
                <thead>
                  <tr>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(0)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(1)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(2)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(3)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(4)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(5)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                    <th scope='col'>
                      {moment(this.state.class_date)
                        .day(6)
                        .add({ days: this.state.dayIncreament })
                        .format('MM-DD (dd)')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(0 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(0 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(1 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(1 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(2 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(2 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(3 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(3 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(4 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(4 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(5 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(5 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                    <td>
                      {' '}
                      {this.state.reservationClass.length == 0 ? (
                        <div className='border py-2 my-1 text-secondary'>
                          수업이 없습니다.
                        </div>
                      ) : (
                        this.state.reservationClass.filter(
                          (value) =>
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrAfter(
                                moment().day(6 + this.state.dayIncreament),
                                'day'
                              ) &&
                            moment(value.props.class_date.split('T')[0])
                              .add(9, 'hour')
                              .isSameOrBefore(
                                moment().day(6 + this.state.dayIncreament),
                                'day'
                              )
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <table class='table'>
							<thead>
								<tr>
									<th scope='col'>운동 클래스</th>
									<th scope='col'>강사</th>
									<th scope='col'>수강날짜</th>
									<th scope='col'>수강 인원</th>
									<th scope='col'>삭제</th>
									<th scope='col'>수정</th>
								</tr>
							</thead>
							<tbody>
								{this.state.reservationClass.length == 0 ? (
									<p>'설정된 운동이 없습니다.'</p>
								) : (
									this.state.reservationClass
								)}
							</tbody>
						</table> */}
            </Col>
          </Row>
          <Row lg={6}>
            <Col className='text-center' xs={12} sm={3} lg={3}>
              {this.props.userinfo.loginWhether === 1 ? (
                // <label className=' d-block w-100'>
                <TextField
                  id='trainer'
                  variant='standard'
                  value={this.props.userinfo.manager_name}
                  onChange={this.handleChange}
                  InputProps={{ disableUnderline: true }}
                  label='강사명'
                  error={this.state.trainer_err}
                  className=''
                />
              ) : (
                // </label>
                <div>
                  {this.state.open ? (
                    <div>
                      <TrainerSearch
                        open={this.state.open}
                        setOpen={(o) => this.setState({ open: o })}
                        fitness_no={this.props.userinfo.fitness_no}
                        handleUser={this.handleUser}
                      />
                    </div>
                  ) : (
                    <div>
                      <TextField
                        id='trainer'
                        label='강사 검색'
                        onClick={() => this.setState({ open: true })}
                        value={this.state.trainer_name}
                        // onChange={this.handleChange}
                        InputProps={{ disableUnderline: true }}
                        error={this.state.trainer_err}
                        variant='standard'
                        disabled
                        className='boxmorpsm w-100 reservation-class--trainer-input'
                        style={{
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </Col>
            <Col
              className='text-center height-fit-content fs-2'
              xs={12}
              sm={3}
              lg={3}
            >
              <label className='w-100'>
                <TextField
                  className='boxmorpsm w-100'
                  id='exercise_class'
                  variant='standard'
                  value={this.state.exercise_class}
                  onChange={this.handleChange}
                  InputProps={{ disableUnderline: true }}
                  label='운동명'
                  error={this.state.exercise_class_err}
                />
              </label>
            </Col>
            <Col className='text-center height-fit-content' xs={12} sm={4}>
              <label className='d-block w-100'>
                <DatePicker
                  className='boxmorpsm text-center w-100 border-0'
                  selected={this.state.class_date}
                  onChange={(date) => this.setState({ class_date: date })}
                  name='class_date'
                  dateFormat='yyyy-MM-dd(eee)'
                  font-size='1.6rem'
                  // locale 오류로 임시 삭제
                  // locale='ko'
                  error={this.state.class_date_err}
                  minDate={new Date()}
                />
              </label>
            </Col>
            <Col className=' px-1' xs={12} sm={2} lg={2}>
              <Row className=''>
                <Col className='pe-0 height-fit-content'>
                  <label className='w-100'>
                    <TextField
                      className='boxmorpsm w-100'
                      type='number'
                      id='hour'
                      variant='standard'
                      value={this.state.hour}
                      onChange={this.handleChange}
                      InputProps={{ disableUnderline: true }}
                      label='시'
                      error={this.state.hour_err}
                    />
                  </label>
                </Col>
                <Col
                  className='p-0 d-flex justify-content-center align-items-center'
                  xs={1}
                >
                  <span className='fs-5 fw-bold'>:</span>
                </Col>
                <Col className='text-center ps-0 height-fit-content'>
                  <label className='w-100'>
                    <TextField
                      className='w-100 boxmorpsm'
                      type='number'
                      id='minute'
                      variant='standard'
                      value={this.state.minute}
                      onChange={this.handleChange}
                      InputProps={{ disableUnderline: true }}
                      label='분'
                      error={this.state.minute_err}
                    />
                  </label>
                </Col>
              </Row>
            </Col>
            <Col className='text-center height-fit-content' xs={12} sm={4}>
              <label className='w-100'>
                <TextField
                  className='w-100 boxmorpsm'
                  type='number'
                  id='number_of_people'
                  variant='standard'
                  value={this.state.number_of_people}
                  onChange={this.handleChange}
                  InputProps={{ disableUnderline: true }}
                  label='수강 인원'
                  error={this.state.number_of_people_err}
                />
              </label>
            </Col>
            <Col xs={12} lg={12} className='text-center'>
              <Button className='my-4 px-5' onClick={this.handleOnClick}>
                수업 만들기
              </Button>
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

const ReservationClassStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const ReservationClassDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  ReservationClassStateToProps,
  ReservationClassDispatchToProps
)(ReservationClass);
