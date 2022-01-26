import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import { Container, Row, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal'
import ReservationPresetList from '../../component/reservation/ReservationPresetList';

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
const ip = SERVER_URL;

const ReservationItem = ({ res_no, date, exercise_name, fitness_no, customer_name,
    isCancel, cancelComment, number_of_people, time, date2, exercise_length,
    exercise_class, no, number_of_people_class, hour, minute, joiner, reservationSelect }) => {
    const [showResults, setShowResults] = React.useState(false)
    const [customer_name_input, setCustomer_name_input] = useState('');
    const [date_input, setDate_input] = useState(new Date());
    const [time_input, setTime_input] = useState('');
    const [exercise_name_input, setExercise_name_input] = useState('');
    const [isCancel_input, setIsCancel_input] = useState('');
    const [cancelComment_input, setCancelComment_input] = useState('');
    const [number_of_people_input, setNumber_of_people_input] = useState('');
    const [show, setShow] = useState(false);

    const updateOnClick = () => {
        setShowResults(true)
        setCustomer_name_input(customer_name)
        setDate_input(date2)
        setTime_input(time)
        setExercise_name_input(exercise_name)
        setIsCancel_input(isCancel)
        setCancelComment_input(cancelComment)
        setNumber_of_people_input(number_of_people)

    }
    const updateClose = () => {
        setShowResults(false)
    }
    const handleChangeDate = (e) => {
        setDate_input(e.target.value)
    }
    const handleChangeIsCancel = (e) => {
        setIsCancel_input(e.target.value)
    }
    const handleChangeCancelComment = (e) => {
        setCancelComment_input(e.target.value)
    }
    const reservationClassSelectOnClick = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }

    const reservationUpdate = (res_no) => {
        fetch(ip + '/reservation/update?res_no=' + res_no, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                time: time,
                exercise_name: exercise_name_input,
                number_of_people: number_of_people_input,
                date: date_input,
                isCancel: isCancel_input,
                cancelComment: cancelComment_input
            })
        })
            .then((result) => result.json())
            .then((result) => {
                console.log(result)
                alert('예약변경완료');
                reservationSelect();
                updateClose();
            })
    }

    return (
        <tr>
            {showResults ?
                <td><input value={customer_name_input} id='customer_name' /></td>
                :
                <td>{customer_name}</td>}
            {showResults ?
                <td>
                    <DatePicker
                        // seleted={date_input}
                        value={date_input}
                        onChange={handleChangeDate}
                        id='date'
                        dateFormat='yyyy-MM-dd(eee)'
                        font-size='1.6rem'
                        locale="ko"
                    />

                </td>
                :
                <td>{date}</td>}
            {showResults ?
                <td><input value={time_input} id='time' /></td>
                :
                <td>{time}</td>}
            {showResults ?
                <td>
                    <input value={exercise_name_input} id='exercise_name' />
                    <button onClick={() => reservationClassSelectOnClick()}>운동목록</button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header>
                            <Modal.Title>운동목록</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <table>
                                <thead>
                                    <th>운동명</th>
                                </thead>
                                <tbody>
                                    <tr>{joiner}</tr>
                                </tbody>
                            </table>
                        </Modal.Body>
                        <Modal.Footer>
                            <button variant="secondary" onClick={handleClose}>
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>
                </td>
                :
                <td>{exercise_name}</td>}
            {showResults ?
                <td><input value={isCancel_input == null ? '예약 완료' : '예약취소'} id='isCancel' onChange={handleChangeIsCancel} /></td>
                :
                <td>{isCancel == null ? '예약 완료' : '예약취소'}</td>}
            {showResults ?
                <td><input value={cancelComment_input} id='cancelComment' onChange={handleChangeCancelComment} /></td>
                :
                <td>{cancelComment}</td>}
            {showResults ?
                <td>{exercise_length + "/"}<input value={number_of_people_input} id='number_of_people' /></td>
                :
                <td>{exercise_length + "/" + number_of_people}</td>}
            {showResults ?
                <td><button onClick={() => reservationUpdate(res_no)}>변경하기...</button></td>
                :
                <td><button onClick={() => updateOnClick()}>변경하기</button></td>
            }
        </tr>
    )
}

class ReservationUpdate extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            fitness_no: 2,
            reservation: [],
        });
        this.reservationSelect();
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
                    let exercise_length = result.filter(filterData => filterData.exercise_name === data.exercise_name
                        && filterData.time === data.time
                        && filterData.date.split('T')[0] === data.date.split('T')[0]).length;
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
                        />
                    );
                });
                console.log(result)
                this.setState({ reservation: items });
            });
    };

    // reservationTogether = () => {
    //     reservationSelect = () => {
    //         fetch(
    //             ip + '/reservation/select?fitness_no=' + this.props.userinfo.fitness_no,
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-type': 'application/json',
    //                 },
    //             }
    //         )
    //             .then((result) => result.json())
    //             .then((resultSelect) => {
    //                 reservationClassSelect = () => {
    //                     fetch(
    //                         ip + '/reservationClass/select?fitness_no=' + this.props.userinfo.fitness_no,
    //                         {
    //                             method: 'GET',
    //                             headers: {
    //                                 'Content-type': 'application/json',
    //                             },
    //                         }
    //                     )
    //                         .then((result) => result.json())
    //                         .then((resultClass) => {
    //                             this.setState({
    //                                 reservation: resultSelect.map((data, index, array) => {
    //                                     const joiner = resultClass.find((resultClass) => resultClass.fitness_no == data.fitness_no)
    //                                     return (
    //                                         <ReservationItem
    //                                             res_no={data.res_no}
    //                                             date={date}
    //                                             date2={data.date}
    //                                             exercise_name={data.exercise_name}
    //                                             fitness_no={data.fitness_no}
    //                                             customer_name={data.customer_name}
    //                                             isCancel={data.isCancel}
    //                                             cancelComment={data.cancelComment}
    //                                             number_of_people={data.number_of_people}
    //                                             exercise_length={exercise_length}
    //                                             time={data.time}
    //                                             //class
    //                                             exercise_class={data.exercise_class}
    //                                             no={data.no}
    //                                             number_of_people_class={data.number_of_people}
    //                                             hour={data.hour}
    //                                             minute={data.minute}
    //                                             joiner={joiner}
    //                                         />
    //                                     );
    //                                 })
    //                             })
    //                             console.log(result)
    //                         });
    //                 };
    //             });
    //     };
    // }



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
                                    <th scope='col'>회원이름</th>
                                    <th scope='col'>날짜</th>
                                    <th scope='col'>시간</th>
                                    <th scope='col'>운동명</th>
                                    <th scope='col'>상태</th>
                                    <th scope='col'>취소사유</th>
                                    <th scope='col'>인원수</th>
                                    <th scope='col'>--- </th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reservation.length == 0
                                    ? <p>'설정된 운동이 없습니다.'</p>
                                    : this.state.reservation}

                            </tbody>
                        </table>
                    </Row>
                </Container>
                <div className='footer'>
                    <Footer />
                </div>
            </div >
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
