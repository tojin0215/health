import React, { Component, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';

import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko"
registerLocale("ko", ko);
import { getStatusRequest } from '../../action/authentication';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
import ReservationPresetList from '../../component/reservation/ReservationPresetList';
import ReservationList from '../../component/reservation/ReservationList';

const ip = SERVER_URL;

const ReservationClassItem = ({ exercise_class, number_of_people, hour, minute, handleClick }) => {

    const [input, setInput] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const handleClick2 = () => {
        setInput(exercise_class)
        setInput2(number_of_people)
        setInput3(hour)
        setInput4(minute)
        handleClick(exercise_class, hour, minute, number_of_people)
    };

    return (
        <tr>
            <td><button onClick={handleClick2}>{exercise_class}</button></td>
            <td>{number_of_people}</td>
            <td>{hour}:{minute}</td>
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
            customer_name: '',
            customer_id: 'xcv',
            isCancel: 1,
            reserv_date: new Date(),
            time: " : ",
            exercise_name: '',
            cancelComment: '',
            number_of_people: '',
            exercise_length: '0',
            customer_name_err: false,
            exercise_name_err: false,

            show: false,

            reservationArray: []
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
            .then(result => result.map(value => {
                let exercise_length = result.filter(filterData => filterData.exercise_name === value.exercise_name).length;
                value.number_of_peopleFountain = exercise_length
                return value
            }))
            .then((result) => {
                this.setState({ reservation: result });
            });
    };

    handleOnClick = () => {
        this.setState({
            customer_name_err: false,
            exercise_name_err: false
        })
        if (this.state.exercise_name == "") {
            this.setState({ exercise_name_err: true });
            alert("운동을 선택해 주세요")
        }
        else if (this.state.customer_name == "") {
            this.setState({ customer_name_err: true });
            alert("이름을 확인해 주세요")
        }
        else {
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
                    if (result.message == 'false') {
                        alert('예약이 다 찼습니다.')
                    } else {
                        alert('등록');
                        this.reservationSelect();
                    }
                });
        }
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
                            hour={data.hour}
                            minute={data.minute}
                            handleClick={
                                (reuslt_exercise_name, reuslt_hour, reuslt_minute, reuslt_number_of_people) => this.setState({
                                    exercise_name: reuslt_exercise_name,
                                    time: reuslt_hour + ':' + reuslt_minute,
                                    number_of_people: reuslt_number_of_people
                                })
                            }
                        />
                    );
                });
                this.setState({ reservationClass: items });
            });
    };

    reservationDelete = (reservation) => {
        fetch(ip + '/reservation/delete?res_no=' + reservation.res_no, {
            method: 'DELETE',
        }).then((result) => {
            alert('삭제');
            this.reservationSelect();
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
                            <Link to='/reservationClass'>운동 목록 설정하기</Link>
                            <table class='table'>
                                <thead>
                                    <tr>
                                        <th>운동 목록</th>
                                        <th>인원수</th>
                                        <th>시간</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.reservationClass.length == 0
                                        ? <p>'설정된 운동이 없습니다.'</p>
                                        : this.state.reservationClass}
                                </tbody>
                            </table>
                            <TextField
                                id='exercise_name'
                                value={this.state.exercise_name}
                                // onChange={this.handleChange}
                                label='운동명'
                                err={this.state.exercise_name_err}
                            />
                            <TextField
                                id='time'
                                value={this.state.time}
                                // onChange={this.handleChange}
                                label='시간'
                            />


                            <TextField
                                id='number_of_people'
                                value={this.state.number_of_people}
                                // onChange={this.handleChange}
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
                        </Col>
                    </Row>


                    <ReservationList
                        reservation={this.state.reservation}
                        reservationDelete={this.reservationDelete}
                    />
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
