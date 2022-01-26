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
import UserSearch from '../../component/customer/UserSearch';

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
            <td>{hour == 1 ? '01' : hour == 2 ? '02' : hour == 3 ? '03' : hour == 4 ? '04' : hour == 5 ? '05' : minute == 6 ? '06' : hour == 7 ? '07' : hour == 8 ? '09' : hour == 0 ? '00' : hour
            }:{minute == 1 ? '01' : minute == 2 ? '02' : minute == 3 ? '03' : minute == 4 ? '04' : minute == 5 ? '05' : minute == 6 ? '06' : minute == 7 ? '07' : minute == 8 ? '09' : minute == 0 ? '00' : minute}</td>

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
            time: "07:00",
            exercise_name: '',
            cancelComment: '',
            number_of_people: '',
            exercise_length: '0',
            customer_name_err: false,
            exercise_name_err: false,

            show: false,

            open: false,
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
                let exercise_length = result.filter(filterData => filterData.exercise_name === value.exercise_name && filterData.time === value.time &&
                    filterData.date.split('T')[0] === value.date.split('T')[0]).length;
                value.number_of_peopleFountain = exercise_length
                return value
            }))
            .then((result) => {
                this.setState({ reservation: result });
            });
    };

    dateFormat = (reserv_date) => {
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

        return reserv_date.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
    }

    handleOnClick = () => {
        let canRegist = this.state.reservation.filter(filterData => filterData.exercise_name === this.state.exercise_name &&
            filterData.time === this.state.time && filterData.date.split('T')[0] === this.dateFormat(this.state.reserv_date).split('T')[0]).length > 0;
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
        else if (canRegist) {
            alert("같은운동 중복등록 불가능")
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

    // handleChange = (e) => {
    //     this.setState({
    //         [e.target.id]: e.target.value,
    //     });
    // };

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
                                (result_exercise_name, result_hour, result_minute, result_number_of_people) => this.setState({
                                    exercise_name: result_exercise_name,
                                    time:
                                        // result_hour + ":" + result_minute
                                        (result_hour == 1 ? '01' : result_hour == 2 ? '02' : result_hour == 3 ? '03' : result_hour == 4 ? '04' : result_hour == 5 ? '05' :
                                            result_hour == 6 ? '06' : result_hour == 7 ? '07' : result_hour == 8 ? '09' : result_hour == 0 ? '00' : result_hour)
                                        + ':' +
                                        (result_minute == 1 ? '01' : result_minute == 2 ? '02' : result_minute == 3 ? '03' : result_minute == 4 ? '04' : result_minute == 5 ? '05' :
                                            result_minute == 6 ? '06' : result_minute == 7 ? '07' : result_minute == 8 ? '09' : result_minute == 0 ? '00' : result_minute)
                                    ,
                                    number_of_people: result_number_of_people
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
    reservationUpdate = (reservation) => {
        fetch(ip + '/reserv_time/update?res_no=' + reservation.res_no, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                time: this.state.time,
                exercise_name: this.state.exercise_name,
                number_of_people: this.state.number_of_people,

                date: this.state.date,
                isCancel: this.state.isCancel,
                cancelComment: this.state.cancelComment
            })
        })
            .then((result) => result.json())
            .then((result) => {
                alert('예약변경완료');
                this.reservationSelect();
            })
    }

    handleUser = (customer) => {
        const { member_no, name } = customer;
        this.setState({
            customer: customer,
            customer_name: name,
            customer_id: member_no,
            open: false,
        })
    }

    render() {
        console.log(this.state.reserv_date)
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
                <Container className='reservationWrap'>
                    <Row className='pb-5'>
                        <Col className='text-center py-2' xs={12}>
                            {
                                this.state.customer && (
                                    <span>[{this.state.customer_id}]{this.state.customer_name} 님</span>
                                )
                            }
                            {
                                this.state.open ? (
                                    <UserSearch open={this.state.open} setOpen={o => this.setState({ open: o })} fitness_no={this.props.userinfo.fitness_no} handleUser={this.handleUser} />
                                ) : (
                                    <button type='button' onClick={() => this.setState({ open: true })}>사용자 검색</button>
                                )
                            }

                        </Col >
                        <Col className='text-center py-2' xs={12}>

                            <div>
                                <Link to='/reservationClass'>운동설정하기</Link>
                            </div>
                            <table class='table'>
                                <thead>
                                    <tr>
                                        <td>운동명</td>
                                        <td>인원수</td>
                                        <td>시간</td>
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
                                // onChange={this.handleChange}
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
                    </Row >


                    <ReservationList
                        reservation={this.state.reservation}
                        reservationDelete={this.reservationDelete}
                        reservationUpdate={this.reservationUpdate}
                    />
                </Container >
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
