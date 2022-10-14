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
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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
  kind,
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

  const [kind_input, setKind_input] = useState('');
  const [exercise_class_input, setExercise_class_input] = useState('');
  const [class_date_input, setClass_date_input] = useState('');
  const [trainer_input, setTrainer_input] = useState(
    loginWhether === 1 ? loginWhetherTrainer : ''
  );
  const [number_of_people_input, setNumber_of_people_input] = useState('');
  const [hour_input, setHour_input] = useState('');
  const [minute_input, setMinute_input] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [kindOpen, setKindOpen] = useState(false);

  const [etcExercise_input, setEtcExercise_input] = useState('');
  const [exerciseGroup, setExerciseGroup] = useState({
    pt: true,
    gx: false,
    pila: false,
    health: false,
    etc: false,
  });
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
  const handleChangeEtc = (e) => {
    setEtcExercise_input(e.target.value);
  };
  const handleExerciseRadio = () => {
    setExerciseGroup({
      pt: true,
      gx: false,
      pila: false,
      health: false,
      etc: false,
    });
    this.setState({ kind: '개인PT' });
  };
  const handleExerciseRadio2 = () => {
    setExerciseGroup({
      pt: false,
      gx: true,
      pila: false,
      health: false,
      etc: false,
    });
    this.setState({ kind: 'GX' });
  };
  const handleExerciseRadio3 = () => {
    setExerciseGroup({
      pt: false,
      gx: false,
      pila: true,
      health: false,
      etc: false,
    });
    this.setState({ kind: '필라테스' });
    console.log('kind: ', kind);
  };
  const handleExerciseRadio4 = () => {
    setExerciseGroup({
      pt: false,
      gx: false,
      pila: false,
      health: true,
      etc: false,
    });
    this.setState({ kind: '헬스' });
  };
  const handleExerciseRadio5 = () => {
    setExerciseGroup({
      pt: false,
      gx: false,
      pila: false,
      health: false,
      etc: true,
    });
    this.setState({ kind: '기타(' + this.state.etcExercise + ')' });
  };

  /*
	운동클래스 update
	*/
  const reservationClassUpdate = (no) => {
    if (exercise_class_input == '') {
      setExercise_class_err(true);
      alert('운동명을 써주세요.');
    } else if (trainer_input == '') {
      setTrainer_err(true);
      alert('트레이너명을 선택해주세요.');
    } else if (number_of_people_input == '') {
      setNumber_of_people_err(true);
      alert('올바른 수강 인원을 입력해 주세요.');
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
          class_date: moment(class_date_input).format('yyyy-MM-DD'),
          kind: kind_input,
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
  // console.log(exerciseGroup.pt);

  const modalOnClick = () => {
    setShowModal(true);
    setExercise_class_input(exercise_class);
    setNumber_of_people_input(number_of_people);
    setHour_input(hour);
    setMinute_input(minute);
    setTrainer_input(trainer);
    setClass_date_input(class_date);
    setKind_input(kind);
  };
  const modalClose = () => {
    setShowModal(false);
  };
  const hourArray = hour >= 10 ? hour : '0' + hour;

  const minuteArray = minute >= 10 ? minute : '0' + minute;
  // console.log(moment(class_date_input).format('yyyy-MM-DD'));
  // console.log(class_date);
  // console.log(searchOpen);
  const handleUser = (sTrainer) => {
    setTrainer_input(sTrainer.trainer_name);
    setSearchOpen(false);
  };
  // console.log(loginWhether);
  // console.log(loginWhetherTrainer);

  const exerciseKind = () => {
    setKind_input(
      exerciseGroup.pt
        ? '개인PT'
        : exerciseGroup.gx
        ? 'gx'
        : exerciseGroup.pila
        ? '필라테스'
        : exerciseGroup.health
        ? '헬스'
        : exerciseGroup.etc
        ? '기타(' + etcExercise_input + ')'
        : '개인PT'
    );
    setKindOpen(false);
  };
  // console.log(kind_input);
  return (
    <>
      {(loginWhether === 1 && loginWhetherTrainer === trainer) ||
      (loginWhether === 0 && loginWhetherTrainer !== trainer) ? (
        <Row
          className='reservation-class__schedule-content'
          onClick={modalOnClick}
        >
          <Col>
            <p>
              {hourArray}:{minuteArray}
            </p>
          </Col>
          <Col>
            <p className='fw-bold'>
              {exercise_class}
              {/* /{kind} */}
            </p>
            <p>{trainer}</p>
            <p>
              {number_of_people}/{/* {canRegist} */}전체
            </p>
          </Col>
        </Row>
      ) : (
        ''
      )}
      {/* <Modal show={true}> */}
      <Modal show={showModal}>
        <div>
          <h4 className='mb-3'>수업 수정</h4>
          <Row>
            <Col xs={3}>
              <h5>운동종류</h5>
            </Col>
            <Col xs={9} className='mt-2'>
              <Row xs={2}>
                <Col xs={4}>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='pt'
                      checked={exerciseGroup['pt']}
                      onChange={handleExerciseRadio}
                    />
                    <Form.Check.Label htmlFor='pt' className='w-100'>
                      개인 PT
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='gx'
                      checked={exerciseGroup['gx']}
                      onChange={handleExerciseRadio2}
                    />
                    <Form.Check.Label htmlFor='gx' className='w-100'>
                      GX
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col xs={4}>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='pila'
                      checked={exerciseGroup['pila']}
                      onChange={handleExerciseRadio3}
                    />
                    <Form.Check.Label htmlFor='pila' className='w-100'>
                      필라테스
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col xs={3} /* className='d-flex justify-content' */>
                  <Form.Check>
                    <Form.Check.Input
                      type='radio'
                      name='exerciseGroup'
                      id='etc'
                      checked={exerciseGroup['etc']}
                      onChange={handleExerciseRadio5}
                    />
                    <Form.Check.Label htmlFor='etc' className='w-100'>
                      기타
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col xs={5}>
                  <Form.Check>
                    <Form.Control
                      placeholder='기타'
                      id='etcExercise'
                      htmlFor='etc'
                      type='text'
                      value={etcExercise_input}
                      onChange={handleChangeEtc}
                    ></Form.Control>
                  </Form.Check>
                  {/* <Form.Group>
                    <Form.Control
                      value={kind_input}
                      id='kind'
                      onClick={() => setKindOpen(true)}
                    />
                    <Modal show={kindOpen}>
                      <div className='mb-5'>
                        <Button onClick={exerciseKind}>선택완료</Button>
                      </div>
                      <Button onClick={() => setKindOpen(false)}>닫기</Button>
                    </Modal>
                  </Form.Group> */}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <h5>운동명</h5>
            </Col>
            <Col xs={9}>
              <Form.Control
                value={exercise_class_input}
                placeholder='운동명을 입력해주세요'
                id='exercise_class'
                onChange={updateChange}
                error={exercise_class_err}
              ></Form.Control>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <h5>강사</h5>
            </Col>
            <Col xs={9}>
              {loginWhether === 1 ? (
                <Form.Control
                  value={trainer_input}
                  id='trainer'
                  error={trainer_err}
                ></Form.Control>
              ) : (
                <Form.Control
                  value={trainer_input}
                  placeholder='강사 검색'
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
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <h5>날짜</h5>
            </Col>
            <Col xs={9}>
              <Form.Control
                type='date'
                selected={setClass_date_input}
                value={moment(class_date_input).format('yyyy-MM-DD')}
                id='class_date'
                onChange={updateChange6}
                error={class_date_err}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <h5>시간</h5>
            </Col>
            <Col xs={9}>
              <Row>
                <Col>
                  <Form.Control
                    type='number'
                    id='hour'
                    value={hour_input == 0 ? '00' : hour_input}
                    onChange={updateChange3}
                    label='시'
                    error={hour_err}
                  />
                </Col>
                <Col className='d-flex align-items-center' xs={1}>
                  <span className='fs-6 fw-bold'>:</span>
                </Col>
                <Col>
                  <Form.Control
                    type='number'
                    id='minute'
                    value={minute_input == 0 ? '00' : minute_input}
                    onChange={updateChange4}
                    label='분'
                    error={minute_err}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>수강인원</Col>
            <Col xs={9}>
              <Form.Control
                type='number'
                value={number_of_people_input}
                id='number_of_people'
                onChange={updateChange2}
                error={number_of_people_err}
              ></Form.Control>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col xs={12} className='text-danger text-end my-3'>
              <span className='m-2'>
                삭제시 되돌릴 수 없습니다. 한번 더 확인해주세요.
              </span>
              <Button
                variant='outline-danger'
                onClick={() =>
                  // eslint-disable-next-line no-restricted-globals
                  confirm(
                    '정말 삭제하시겠습니까?_예약된 회원도 함께 취소됩니다.'
                  ) == true
                    ? reservationClassDelete(no)
                    : alert('삭제가 취소 되었습니다.')
                }
              >
                삭제
              </Button>
            </Col>
            <Col className='text-center'>
              <Button
                className='btn-primary-dark mx-1'
                onClick={modalClose}
                variant='primary-dark'
              >
                닫기
              </Button>
              <Button onClick={() => reservationClassUpdate(no)}>
                수정하기
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
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
      kindOpen: false,
      kind: '',
      etcExercise: '',
      exerciseGroup: {
        pt: true,
        gx: false,
        pila: false,
        health: false,
        etc: false,
      },
      key: 'pt',
      keyTrainer: 'trainerAll',
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
                kind={data.kind}
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
            kind: this.state.kind,
          }),
        })
          .then((result) => result.json())
          .then((result) => {
            if (result.message == 'ok') {
              alert('운동 설정이 완료되었습니다.');
              // console.log(this.state.class_date);
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
              kind: '',
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

  handlekindOpen = () => {
    this.setState({ kindOpen: true });
  };
  handlekindClose = () => {
    this.setState({ kindOpen: false });
  };
  handleExerciseRadio = (e) => {
    let obj = {
      pt: false,
      gx: false,
      pila: false,
      health: false,
      etc: false,
    };
    obj[e.target.id] = e.target.checked;
    this.setState({
      exerciseGroup: obj,
    });
  };
  exerciseKind = () => {
    this.setState({
      kind: this.state.exerciseGroup.pt
        ? '개인PT'
        : this.state.exerciseGroup.gx
        ? 'GX'
        : this.state.exerciseGroup.pila
        ? '필라테스'
        : this.state.exerciseGroup.health
        ? '헬스'
        : this.state.exerciseGroup.etc
        ? '기타(' + this.state.etcExercise + ')'
        : '개인PT',
      kindOpen: false,
    });
  };

  selectClassTabs = (e) => {
    this.setState({ key: e });
  };

  render() {
    // console.log(this.props.userinfo.loginWhether);
    // console.log(this.state.kindOpen);
    // console.log(this.state.exerciseGroup);
    // console.log(this.state.etcExercise);
    // console.log(this.state.kind);
    return (
      <div className='wrap reservationClassWrap'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
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
          <Row className='reservation-class__form sectionGlass mb-5'>
            <Col xs={12} className='mb-3'>
              <h4>수업 설정</h4>
            </Col>
            <Col xs={12}>
              <Row className='mb-3'>
                <Col md={1} className='exerciseGroup'>
                  <h5>운동종류</h5>
                </Col>
                <Col>
                  <div>
                    <Form.Check inline>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='pt'
                        checked={this.state.exerciseGroup['pt']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='pt' className='w-100'>
                        개인 PT
                      </Form.Check.Label>
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='gx'
                        checked={this.state.exerciseGroup['gx']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='gx' className='w-100'>
                        GX
                      </Form.Check.Label>
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='pila'
                        checked={this.state.exerciseGroup['pila']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='pila' className='w-100'>
                        필라테스
                      </Form.Check.Label>
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Check.Input
                        type='radio'
                        name='exerciseGroup'
                        id='etc'
                        checked={this.state.exerciseGroup['etc']}
                        onChange={this.handleExerciseRadio}
                      />
                      <Form.Check.Label htmlFor='etc'>기타</Form.Check.Label>
                    </Form.Check>
                    <Form.Check inline>
                      <Form.Control
                        placeholder='기타'
                        id='etcExercise'
                        type='text'
                        value={this.state.etcExercise}
                        onChange={this.handleChange}
                      ></Form.Control>
                    </Form.Check>
                    {/* <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='exerciseGroup'
                          id='health'
                          checked={this.state.exerciseGroup['health']}
                          onChange={this.handleExerciseRadio}
                        />
                        <Form.Check.Label htmlFor='헬스' className='w-100'>
                          헬스
                        </Form.Check.Label>
                      </Form.Check>
                    </Col> */}
                  </div>
                </Col>
              </Row>
            </Col>
            {/* <Col xs={11}>
              <Form.Control
                label='운동종류'
                onClick={this.handlekindOpen}
                value={this.state.kind}
              />
              <Modal show={this.state.kindOpen}>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='exerciseGroup'
                          id='pt'
                          checked={this.state.exerciseGroup['pt']}
                          onChange={this.handleExerciseRadio}
                        />
                        <Form.Check.Label htmlFor='pt' className='w-100'>
                          개인 PT
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='exerciseGroup'
                          id='gx'
                          checked={this.state.exerciseGroup['gx']}
                          onChange={this.handleExerciseRadio}
                        />
                        <Form.Check.Label htmlFor='gx' className='w-100'>
                          GX
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='exerciseGroup'
                          id='pila'
                          checked={this.state.exerciseGroup['pila']}
                          onChange={this.handleExerciseRadio}
                        />
                        <Form.Check.Label htmlFor='pila' className='w-100'>
                          필라테스
                        </Form.Check.Label>
                      </Form.Check>
                    </Col>
                    <Col>
                      <Form.Check>
                        <Form.Check.Input
                          type='radio'
                          name='exerciseGroup'
                          id='etc'
                          checked={this.state.exerciseGroup['etc']}
                          onChange={this.handleExerciseRadio}
                        />
                        <Form.Control
                          placeholder='기타'
                          id='etcExercise'
                          type='text'
                          value={this.state.etcExercise}
                          onChange={this.handleChange}
                        ></Form.Control>
                      </Form.Check>
                    </Col>
                  </Row>
                </Form.Group>
                <Row xs={2}>
                  <Col>
                    <Button onClick={this.handlekindClose} variant='secondary'>
                      닫기
                    </Button>
                  </Col>
                  <Col>
                    <Button onClick={this.exerciseKind}>선택완료</Button>
                  </Col>
                </Row>
              </Modal>
            </Col> */}
            <Col md={1} className='mb-3'>
              <h5>운동명</h5>
            </Col>
            <Col md={4}>
              <Form.Control
                id='exercise_class'
                value={this.state.exercise_class}
                placeholder='운동명을 입력해주세요'
                onChange={this.handleChange}
                InputProps={{ disableUnderline: true }}
                label='운동명'
                error={this.state.exercise_class_err}
              />
            </Col>
            <Col xs={1}>
              <h5>강사</h5>
            </Col>
            <Col xs={4}>
              {this.props.userinfo.loginWhether === 1 ? (
                <Form.Control
                  id='trainer'
                  value={this.props.userinfo.manager_name}
                  placeholder='강사명을 입력해주세요'
                  onChange={this.handleChange}
                  InputProps={{ disableUnderline: true }}
                  label='강사명'
                  error={this.state.trainer_err}
                  className='reservation-class--trainer-input'
                />
              ) : (
                <div>
                  {this.state.open ? (
                    <div>
                      <TrainerSearch
                        open={this.state.open}
                        labe='강사검색'
                        placeholder='강사명을 입력해주세요'
                        setOpen={(o) => this.setState({ open: o })}
                        fitness_no={this.props.userinfo.fitness_no}
                        handleUser={this.handleUser}
                      />
                    </div>
                  ) : (
                    <div>
                      <Form.Control
                        id='trainer'
                        label='강사 검색'
                        placeholder='강사명 검색'
                        onClick={() => this.setState({ open: true })}
                        value={this.state.trainer_name}
                        // onChange={this.handleChange}
                        InputProps={{ disableUnderline: true }}
                        error={this.state.trainer_err}
                        // disabled
                        className='reservation-class--trainer-input'
                      />
                    </div>
                  )}
                </div>
              )}
            </Col>
            <Col xs={2}></Col>
            <Col xs={1}>
              <h5>날짜</h5>
            </Col>
            <Col xs={4}>
              <DatePicker
                className='text-center w-100 mb-4'
                selected={this.state.class_date}
                onChange={(date) => this.setState({ class_date: date })}
                name='class_date'
                dateFormat='yyyy년MM월dd일'
                font-size='1.6rem'
                error={this.state.class_date_err}
                minDate={new Date()}
              />
            </Col>
            <Col xs={1}>
              <h5>시간</h5>
            </Col>
            <Col xs={4}>
              <Row>
                <Col>
                  <Form.Control
                    type='number'
                    id='hour'
                    value={this.state.hour}
                    onChange={this.handleChange}
                    InputProps={{ disableUnderline: true }}
                    label='시'
                    placeholder='시'
                    error={this.state.hour_err}
                  />
                </Col>
                <Col className='d-flex align-items-center' xs={1}>
                  <span className='fs-5 fw-bold'>:</span>
                </Col>
                <Col>
                  <Form.Control
                    type='number'
                    id='minute'
                    value={this.state.minute}
                    onChange={this.handleChange}
                    InputProps={{ disableUnderline: true }}
                    label='분'
                    placeholder='분'
                    error={this.state.minute_err}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={1}>
              <h5>인원</h5>
            </Col>
            <Col xs={1}>
              <Form.Control
                className=''
                placeholder='인원'
                type='number'
                id='number_of_people'
                value={this.state.number_of_people}
                onChange={this.handleChange}
                InputProps={{ disableUnderline: true }}
                label='수강 인원'
                error={this.state.number_of_people_err}
              />
            </Col>
            <Col xs={12} className='text-center'>
              <Button onClick={this.handleOnClick}>수업 만들기</Button>
            </Col>
          </Row>
          <Row xs={3} className='mb-3'>
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
          <Tabs activeKey={this.key} onSelect={this.selectClassTabs}>
            <Tab eventKey='pt' title='개인PT'>
              <Tabs activeKey={this.keyTrainer} onSelect={this.selectClassTabs}>
                <Tab eventKey='trainerAll' title='전체'></Tab>
                <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                <Tab eventKey='trainer3' title='한세연 강사'></Tab>
              </Tabs>
            </Tab>
            <Tab eventKey='pilates' title='필라테스'>
              <Tabs activeKey={this.keyTrainer} onSelect={this.selectClassTabs}>
                <Tab eventKey='trainerAll' title='전체'></Tab>
                <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                <Tab eventKey='trainer3' title='한세연 강사'></Tab>
              </Tabs>
            </Tab>
            <Tab eventKey='gx' title='GX'>
              <Tabs activeKey={this.keyTrainer} onSelect={this.selectClassTabs}>
                <Tab eventKey='trainerAll' title='전체'></Tab>
                <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                <Tab eventKey='trainer3' title='한세연 강사'></Tab>
              </Tabs>
            </Tab>
            <Tab eventKey='etc' title='기타'>
              <Tabs activeKey={this.keyTrainer} onSelect={this.selectClassTabs}>
                <Tab eventKey='trainerAll' title='전체'></Tab>
                <Tab eventKey='trainer1' title='김유리 강사'></Tab>
                <Tab eventKey='trainer2' title='박우진 강사'></Tab>
                <Tab eventKey='trainer3' title='한세연 강사'></Tab>
              </Tabs>
            </Tab>
          </Tabs>
          <Row>
            <Col
              className='text-center py-2 w-100 overflow-auto justify-content-center'
              xs={12}
            >
              <table className='table classTable' name='classTable'>
                <thead>
                  <tr>
                    <th scope='col'>
                      <div>
                        {moment(this.state.class_date)
                          .day(0)
                          .add({ days: this.state.dayIncreament })
                          .format('MM-DD (dd)')}
                      </div>
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
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
                    </td>
                    <td>
                      <div className='class-info'>
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
                      </div>
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
