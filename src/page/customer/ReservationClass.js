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

const ReservationClassItem = ({ exercise_class, no, number_of_people, reserv_time, reservationClassSelect, fitness_no,
    hour, minute }) => {

    const reservationClassDelete = (no) => {
        fetch(ip + '/reservationClass/delete?no=' + no, {
            method: 'DELETE',
        }).then((result) => {
            alert('삭제');
            reservationClassSelect()
        });
    };
    const [showResults, setShowResults] = React.useState(false)

    const [input, setInput] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const updateOnClick = () => {
        setShowResults(true)
        setInput(exercise_class)
        setInput2(number_of_people)
        setInput3(hour)
        setInput4(minute)
    }
    const updateClose = () => {
        setShowResults(false)
        console.log(showResults)
    }
    const updateChange = (e) => {
        setInput(e.target.value)
    }
    const updateChange2 = (e) => {
        setInput2(e.target.value)
    }
    const updateChange3 = (e) => {
        setInput3(e.target.value)
    }
    const updateChange4 = (e) => {
        setInput4(e.target.value)
    }
    const reservationClassUpdate = (no) => {
        fetch(ip + '/reservationClass/update?no=' + no, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                fitness_no: fitness_no,
                exercise_class: input,
                number_of_people: input2,
                hour: input3,
                minute: input4
            })
        })
            .then((result) => result.json())
            .then((result) => {
                console.log(result)
                alert('변경 완료');
                updateClose()
                reservationClassSelect()
            });
    };

    return (

        <tr>
            {showResults ?
                <td><input value={input} id='exercise_class' onChange={updateChange} /></td>
                :
                <td>{exercise_class}</td>
            }
            {showResults ?
                <td><input value={input2} id='number_of_people' onChange={updateChange2} /></td>
                :
                <td>{number_of_people}</td>
            }
            {showResults ?
                <td><input value={input3} id='hour' onChange={updateChange3} />:<input value={input4 == 0 ? '00' : input4} id='minute' onChange={updateChange4} /></td>
                :
                <td>{hour}:{minute == 0 ? '00' : minute}</td>
            }


            <td><button onClick={() => reservationClassDelete(no)}>삭제</button></td>
            {showResults ?
                <td><button onClick={() => reservationClassUpdate(no)}>변경하기</button></td>
                :
                <td><button onClick={() => updateOnClick()}>변경하기</button></td>
            }

        </tr >
    );
};

class ReservationClass extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            exercise_class: '',
            fitness_no: 2,
            number_of_people: '',
            reservationClass: [],
            hour: '',
            minute: '',

            // radioGroup: {
            //     ten: true,
            //     eleven: false,
            //     twelve: false,
            //     thirteen: false,
            // },
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
                            fitness_no={this.props.userinfo.fitness_no}
                            reservationClassSelect={this.reservationClassSelect}
                            exercise_class={data.exercise_class}
                            no={data.no}
                            number_of_people={data.number_of_people}
                            hour={data.hour}
                            minute={data.minute}
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
                number_of_people: this.state.number_of_people,
                hour: this.state.hour,
                minute: this.state.minute
                // this.state.radioGroup.ten == true
                //     ? '10'
                //     : this.state.radioGroup.eleven == true
                //         ? '11'
                //         : this.state.radioGroup.twelve == true
                //             ? '12'
                //             : this.state.radioGroup.thirteen == true
                //                 ? '13'
                //                 : '00'
            }),
        })
            .then((result) => result.json())
            .then((result) => {
                alert('운동 설정');
                this.reservationClassSelect();
            });
    };
    handleRadio = (event) => {
        let obj = {
            ten: false,
            eleven: false,
            twelve: false,
            thirteen: false,
        };
        obj[event.target.id] = event.target.checked; // true
        console.log(obj);
        this.setState({
            radioGroup: obj,
        });
    };
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
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
                        <table class='table'>
                            <thead>
                                <Link to='/reservation'>예약</Link>
                                <tr>
                                    <th scope='col'>설정된 운동명</th>
                                    <th scope='col'>인원 제한</th>
                                    <th scope='col'>시간</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reservationClass.length == 0
                                    ? <p>'설정된 운동이 없습니다.'</p>
                                    : this.state.reservationClass}
                            </tbody>
                        </table>
                        <Col className='text-center py-2' xs={12}>
                            <TextField
                                id='exercise_class'
                                value={this.state.exercise_class}
                                onChange={this.handleChange}
                                label='운동명'
                            />
                            <TextField
                                id='number_of_people'
                                value={this.state.number_of_people}
                                onChange={this.handleChange}
                                label='제한 인원 수'
                            />
                            <TextField
                                id='hour'
                                value={this.state.hour}
                                onChange={this.handleChange}
                                label='시'
                            />
                            <TextField
                                id='minute'
                                value={this.state.minute}
                                onChange={this.handleChange}
                                label='분'
                            />
                            {/* <label className='customerResi'>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='ten'
                                        checked={this.state.radioGroup['ten']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>10:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='eleven'
                                        checked={this.state.radioGroup['eleven']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>11:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='twelve'
                                        checked={this.state.radioGroup['twelve']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>12:00</span>
                                </label>
                                <label className='labelCheck'>
                                    <input
                                        className='btnRadio'
                                        type='radio'
                                        name='radioGroup'
                                        id='thirteen'
                                        checked={this.state.radioGroup['thirteen']}
                                        onChange={this.handleRadio}
                                    />
                                    <span>13:00</span>
                                </label>
                            </label> */}
                        </Col>
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
