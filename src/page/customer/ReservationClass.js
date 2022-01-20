import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';

import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko"
registerLocale("ko", ko);
import { getStatusRequest } from '../../action/authentication';


import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
import moment from 'moment';
const ip = SERVER_URL;

const ReservationClassItem = ({ exercise_class, no, number_of_people }) => {

    const reservationClassDelete = (no) => {
        fetch(ip + '/reservationClass/delete?no=' + no, {
            method: 'DELETE',

        }).then((result) => {
            alert('삭제');
        });
    };
    return (
        <tr>
            <td>{exercise_class}  </td>
            <td>asd{number_of_people}</td>
            <td><button onClick={() => reservationClassDelete(no)}>삭제</button></td>
        </tr>
    );
};

class ReservationClass extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            exercise_class: '요가',
            fitness_no: 1,
            number_of_people: 10,
            reservationClass: []
        });
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
                this.reservationClassSelect();
            }
        });
    }

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
                            no={data.no}
                            number_of_people={data.number_of_people}
                        />
                    );
                });
                console.log(result)
                this.setState({ reservationClass: items });
            });
    };

    handleOnClick = () => {
        fetch(ip + '/reservationClass/insert', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                fitness_no: this.props.userinfo.fitness_no,
                exercise_class: this.state.exercise_class,
            }),
        })
            .then((result) => result.json())
            .then((result) => {
                alert('운동 설정');
                this.reservationClassSelect();
            });
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };


    reservationDelete = () => {
        fetch(ip + '/reservationClass/delete', {
            method: 'DELETE',
            body: JSON.stringify({
                no: this.state.no,
            }),
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

                <Container >
                    <Row className='pb-5'>
                        <button>
                            <Link to='/reservation'>예약</Link>
                        </button>
                        <table class='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>설정된 운동명</th>
                                    <th scope='col'>인원 제한</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reservationClass.length == 0
                                    ? <p>'설정된 운동이 없습니다.'</p>
                                    : this.state.reservationClass}
                            </tbody>
                        </table>
                        <TextField
                            id='exercise_class'
                            value={this.state.exercise_class}
                            onChange={this.handleChange}
                            label='운동명'
                        />
                        <button
                            className='mx-4'
                            type='button'
                            onClick={this.handleOnClick}
                        >
                            운동 설정하기
                        </button>
                    </Row>
                </Container>
                <div className='footer'>
                    <Footer />
                </div>
            </div >
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
