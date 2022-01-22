import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';

import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko"
registerLocale("ko", ko);
import { getStatusRequest } from '../../action/authentication';
import Modal from 'react-bootstrap/Modal';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';
import styles from '../../styles/customer/reservation.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
import moment from 'moment';
const ip = SERVER_URL;

const ReservationClassItem = ({ exercise_class, number_of_people, reserv_time, handleClick }) => {

    const [input, setInput] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');



    handleClick = () => {
        setInput(exercise_class)
        setInput2(number_of_people)
        setInput3(reserv_time)
    };


    return (
        <tr>
            <td>운동명<input type="text" value={input} id='exercise_name' /></td>
            <td>시간<input type="text" value={input3} id='reserv_time' /></td>
            <td>제한 인원 수<input type="text" value={input2 == "" ? '제한없음' : input2} id='number_of_people' /></td>
            <td><button onClick={handleClick}>{exercise_class}</button></td>

        </tr>

    );

};

const ReservationItem = ({ reserv_date, reserv_time, exercise_name, customer_name, customer_id,
    isCancel, cancelComment, res_no, maxNumber_of_people, length = 1, exercise_length,
    reservationSelect }) => {
    //exercise_name, number_of_people을 가져와야하는데...
    const reservationDelete = (res_no) => {
        fetch(ip + '/reservation/delete?res_no=' + res_no, {
            method: 'DELETE',
        }).then((result) => {
            alert('삭제');
            reservationSelect();
        });
    };

    return (
        <tr>
            <td>{customer_name}</td>
            {/* <td> {customer_id}</td> */}
            <td> {reserv_date}</td>
            <td> {reserv_time}:00</td>
            <td> {exercise_name}</td>
            <td> {isCancel == null ? '예약 완료' : '예약 취소'}</td>
            <td> {cancelComment}</td>
            <td> {exercise_length == 0 ? "제한없음" : exercise_length + "/" + maxNumber_of_people}</td>

            <td> <button onClick={() => reservationDelete(res_no)}>삭제</button></td>
        </tr>


    );
};

class Reservation extends Component {
    constructor(props) {
        super(props);

        (this.state = {
            show: false,
            fitness_no: 1,
            customer: null,
            reservation: [],
            reservationClass: [],
            customer_name: '홍길동',
            customer_id: 'xcv',
            isCancel: 1,
            reserv_date: new Date(),
            time: "00",
            exercise_name: 'PT기구',
            cancelComment: '',
            number_of_people: '10',
            exercise_length: '0',
            customer_name_err: false,
            exercise_name_err: false,

            show: false,

        });
        this.handleDateChange = this.handleDateChange.bind(this);
        this.reservationSelect();
        this.reservationClassSelect();

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
                    const date = moment(data.date).format("YYYY년 MM월 DD일")

                    let exercise_length2 = 0;
                    for (exercise_length2 = 0; exercise_length2 < result.length; exercise_length2++) {
                        if (result[data.exercise_name] === data.exercise_name
                            // exercise_class로 바꾸면 되긋는디
                        ) {
                            exercise_length++;
                        }
                    }
                    return (
                        <ReservationItem
                            exercise_length={exercise_length2}
                            reserv_date={date}
                            reserv_time={data.time}
                            exercise_name={data.exercise_name}
                            customer_name={data.customer_name}
                            customer_id={data.customer_id}
                            isCancel={data.isCancel}
                            cancelComment={data.cancelComment}
                            res_no={data.res_no}
                            maxNumber_of_people={data.number_of_people}
                            reservationSelect={this.reservationSelect}
                            handleChange={this.handleChange}
                        />
                    );
                });

                this.setState({ reservation: items });

            });
    };

    handleOnClick = () => {
        this.setState({
            customer_name_err: false,
            exercise_name_err: false
        })
        if (this.state.customer_name == "") {
            this.setState({ customer_name_err: true });
            alert("이름을 확인해 주세요")
        } else if (this.state.exercise_name == "") {
            this.setState({ exercise_name_err: true });
            alert("운동을 선택해 주세요")
        } else {
            fetch(ip + '/reservation/insert', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    fitness_no: this.props.userinfo.fitness_no,
                    date: this.state.reserv_date,
                    exercise_name: this.state.exercise_name,
                    customer_name: this.state.customer_name,
                    // customer_id: this.state.customer_id,
                    number_of_people: this.state.number_of_people,
                    time: this.state.time,
                }),
            })
                .then((result) => result.json())
                .then((result) => {
                    alert('등록');
                    this.reservationSelect();
                });
        }
    };

    reservationUpdate = () => {
        fetch(ip + '/reservation/update', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                res_no: this.state.res_no,
                reserv_date: this.state.reserv_date,
                reserv_time: this.state.reserv_time,
                exercise_name: this.state.exercise_name,
                isCancel: this.state.isCancel,
                cancelComment: this.state.cancelComment,
                number_of_people: this.state.number_of_people
            }),
        });
    };


    handleDateChange(date) {
        this.setState({
            reserv_date: date,
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };


    reservationClassSelect = () => {
        fetch(
            ip + '/reservationClass/select?fitness_no=' + this.props.userinfo.fitness_no,
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
                            number_of_people={data.number_of_people}
                            reserv_time={data.time}
                        />
                    );
                });

                this.setState({ reservationClass: items });
                console.log(result);
            });
    };

    handleClickAway = () => {
        this.setState({
            show: false,
        });
    };

    render() {
        return (
            <div className='addCustomer'>
                <header className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin} />
                    <MegaMenu />
                    <div className='localNavigation'>
                        <div className='container'>
                            <h2>
                                <div className='parallelogram'></div>
                                예약
                                <span>.</span>
                            </h2>
                            <div className='breadCrumb'>
                                <Link to='/home'>HOME</Link>
                                <span>&#62;</span>
                                <Link to='/reservation'>예약</Link>
                            </div>
                            {/*.breadCrumb */}
                        </div>
                        {/*.container */}
                    </div>
                    {/*.localNavigation */}
                </header>
                {/* <CustomerFindAndSelect
                    show={this.state.show}
                    setShow={value => this.setState({ show: value })}
                    fitness_no={this.state.fitness_no}
                    setCustomer={c => this.setState({ customer: c })}
                /> */}
                <Container className='reservationWrap'>
                    <Row className='pb-5'>
                        <Col className='text-center py-2' xs={12}>

                            <div>
                                <Link to='/reservationClass'>운동설정하기</Link>
                            </div>
                            <table class='table'>
                                <tbody>
                                    {this.state.reservationClass.length == 0
                                        ? <p>'설정된 운동이 없습니다.'</p>
                                        : this.state.reservationClass}
                                </tbody>
                            </table>
                            <TextField
                                id='exercise_name'
                                value={this.state.exercise_name}
                                onChange={this.handleChange}
                                label='운동명'
                                err={this.state.exercise_name_err}
                            />
                            <TextField
                                id='time'
                                value={this.state.time}
                                onChange={this.handleChange}
                                label='시간'
                            />

                            <TextField
                                id='number_of_people'
                                value={this.state.number_of_people}
                                onChange={this.handleChange}
                                label='최대 인원수'
                            />
                            <TextField
                                id='customer_name'
                                value={this.state.customer_name}
                                onChange={this.handleChange}
                                label='회원이름'
                                error={this.state.customer_name_err}
                            />
                            {/* <TextField
                                id='customer_id'
                                value={this.state.customer_id}
                                onChange={this.handleChange}
                                label='회원아이디'
                            /> */}
                        </Col>
                        <Col className='text-center py-2' xs={12}>
                            <DatePicker
                                selected={this.state.reserv_date}
                                onChange={this.handleDateChange}
                                name='reserv_date'
                                dateFormat='yyyy-MM-dd(eee)'
                                font-size='1.6rem'
                                locale="ko"
                            />
                        </Col>
                        <Col className='text-center' xs={12}>
                            <button
                                className='mx-4'
                                type='button'
                                onClick={this.handleOnClick}
                            >
                                예약하기
                            </button>
                            <button
                                className='mx-4'
                                type='button2'
                                onClick={this.handleOnClick2}
                            >
                                예약변경
                            </button>
                        </Col>
                    </Row>
                    {/* <ClickAwayListener onClickAway={this.handleClickAway}> */}
                    {/* <div className='container'>
                            <div>
                                <Modal
                                    show={this.state.show}
                                    onHide={this.handleClickAway}
                                    dialogClassName='modal-90w mw-100'
                                    aria-labelledby='example-modal'
                                >
                                </Modal>
                                <Modal.Header closeButton>
                                    <Modal.Title id='example-modal' className='fs-1'>
                                        예약 변경
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <TextField
                                        label='운동명' />
                                    <TextField
                                        label='인원수' />
                                    <TextField
                                        label='회원이름' />
                                    <TextField
                                        label='인원수' />
                                    <TextField
                                        label='시간' />
                                    <TextField
                                        label='날짜' />

                                </Modal.Body>
                            </div>
                        </div> */}
                    <table class='table'>
                        <thead>
                            <tr>
                                <th scope='col'>회원이름</th>
                                {/* <th scope='col'>회원아이디</th> */}
                                <th scope='col'>날짜</th>
                                <th scope='col'>시간</th>
                                <th scope='col'>운동명</th>
                                <th scope='col'>상태</th>
                                <th scope='col'>취소사유</th>
                                <th scope='col'>인원수</th>
                                <th scope='col'>---</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.reservation.length == 0
                                ? <p>'예약된 회원이 없습니다.'</p>
                                : this.state.reservation}
                        </tbody>
                    </table>
                    {/* </ClickAwayListener> */}
                </Container>
                <div className='footer'>
                    <Footer />
                </div>
            </div >
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
