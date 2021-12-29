import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { getStatusRequest } from '../../action/authentication';


// import Dropdown from 'react-dropdown';

// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';

// import Table from '@material-ui/core/Table';
// import TableHead from '@material-ui/core/TableHead';
// import TableBody from '@material-ui/core/TableBody';
// import TableRow from '@material-ui/core/TableRow';
// import TableCell from '@material-ui/core/TableCell';
// import axios from 'axios';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';
import moment from 'moment';

import { connect } from 'react-redux';
import 'react-dropdown/style.css';

import { SERVER_URL } from '../../const/settings';
import { TextField } from '@material-ui/core';
const ip = SERVER_URL;

// const getSearchUser = (type, search, fitness_no) => (
//     axios.get("/api/customer", {
//         params: {
//             type: type,
//             search: search,
//             fn: fitness_no,
//         }
//     }).then(response => response.data)
// )


// const CustomerFindAndSelect = (show, setShow, fitness_no, setCustomer) => {
//     const search_type_options = ['이름', '핸드폰'];
//     const [search_type, setSearchType] = useState(search_type_options[0])
//     const [search, setSearch] = useState("")
//     const [customers, setCustomers] = useState([]);

//     const handleSearch = () => {
//         let type = '0';
//         if (search_type === '이름') {
//             type = '0';
//         } else if (search_type === '핸드폰') {
//             type = '1';
//         }
//         getSearchUser(type, search, fitness_no)
//             .then(result => {
//                 setCustomers(result.map(value => {
//                     return {
//                         no: value.member_no,
//                         member_no: value.member_no,
//                         userName: value.name,
//                         phone: value.phone,
//                     }
//                 }))
//             });
//     }

//     return (<Dialog
//         open={show}
//         onClose={() => setShow(false)}
//         maxWidth='lg'>
//         <DialogTitle>고객 검색</DialogTitle>
//         <DialogContent>
//             <div className='customerSearch'>
//                 <Dropdown
//                     className='searchDrop'
//                     options={search_type_options}
//                     onChange={e => setSearchType(e.value)}
//                     value={search_type}
//                 />
//                 {/*.searchDrop */}
//                 <input
//                     type='text'
//                     id='search'
//                     checked={search}
//                     onChange={e => setSearch(e.target.value)}
//                 />
//                 {/*#search */}
//                 <button type='button' onClick={handleSearch}>
//                     고객 검색
//                 </button>
//             </div>
//             {/*.customerSearch */}
//             <Table className='addsalesSearchTable'>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>번호</TableCell>
//                         <TableCell>이름</TableCell>
//                         <TableCell>폰번호</TableCell>
//                         <TableCell>선택</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {customers ? (
//                         customers.map((c) => (
//                             <TableRow>
//                                 <TableCell>{c.no}</TableCell>
//                                 <TableCell>{c.userName}</TableCell>
//                                 <TableCell>{c.phone}</TableCell>
//                                 <TableCell>
//                                     <DialogActions>
//                                         <button
//                                             type='button'
//                                             onClick={() => setCustomer(c)}
//                                             id={c.no}
//                                             value={[c.userName, c.phone]}
//                                         >
//                                             선택
//                                         </button>
//                                         {/*#{c.no} */}
//                                     </DialogActions>
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan='6' align='center'></TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </DialogContent>
//         <DialogActions>
//             <button type='button' onClick={() => setShow(false)}>
//                 닫기
//             </button>
//         </DialogActions>
//     </Dialog>)
// }


class Reservation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            fitness_no: 1,
            customer: null,
            reservation: [],

            customer_name: "홍길동",
            customer_id: "홍길동",
            isCancel: 1,
            reserv_date: moment(),
            reserv_time: moment(),
            exercise_name: "PT기구",
            cancelComment: "",
        },
            this.reservationSelect()
        // ,
        // this.reservationUpdate(),
        // this.reservationDelete(),
        // this.reservationInsert()
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
            }
        });
    }



    reservationSelect = () => {
        fetch(ip + '/reservation/select?fitness_no=' + this.props.userinfo.fitness_no,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            })
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    reservation: result
                })

            })
    }

    handleOnClick = () => {
        reservationInsert = () => {
            fetch(ip + '/reservation/insert',
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        date: this.state.date,
                        time: this.state.time,
                        exercise_name: this.state.exercise_name,
                        customer_name: this.state.customer_name,
                        customer_id: this.state.customer_id
                    })
                }
            )
                .then((result) => result.json())
                .then((result) => {
                    alert("asdasd")
                    this.setState({
                        reservationInsert: result
                    })

                })
        }
    }


    reservationUpdate = () => {
        fetch(ip + '/reservation/update',
            {
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
                    cancelComment: this.state.cancelComment
                })
            })
    }

    reservationDelete = () => {
        fetch(ip + '/reservation/delete',
            {
                method: 'DELETE',
                body: JSON.stringify({
                    res_no: this.state.res_no
                })
            })
            .then((result) => {
                alert('삭제')
                this.reservationSelect()
            })
    }
    handleDateChange(date) {
        this.setState({
            date: date
        })
    }


    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }


    render() {
        console.log(this.state.reservation)
        console.log(this.props.userinfo.fitness_no)
        return (
            <div className='addCustomer'>
                <header className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin} />
                    <MegaMenu />
                </header>
                {/* <CustomerFindAndSelect
                    show={this.state.show}
                    setShow={value => this.setState({ show: value })}
                    fitness_no={this.state.fitness_no}
                    setCustomer={c => this.setState({ customer: c })}
                /> */}
                <Container>
                    <Row><Col>회원이름:</Col><Col>{this.state.customer_name}</Col></Row>
                    <Row><Col>날짜:</Col><Col>{this.state.reserv_date.format("YYYY-MM-DD")}</Col></Row>
                    <Row><Col>시간:</Col><Col>{this.state.reserv_time.format("hh:mm")}</Col></Row>
                    <Row><Col>운동이름:</Col><Col>{this.state.exercise_name}</Col></Row>
                    <Row><Col>취소유무:</Col><Col>{this.state.isCancel == 0 ? "취소됨" : "예약됨"}</Col></Row>
                    <Row><Col>취소사유:</Col><Col>{this.state.cancelComment}</Col></Row>
                </Container>
                <Container>
                    <button type="button" onClick={this.handleOnClick}>예약하기</button>
                    <DatePicker
                        selected={this.state.date}
                        onChange={this.handleDateChange}
                        name="date"
                        dateFormat="yyyy-MM-dd"
                        font-size="1.6rem"
                    />
                    {/* <button type={button} id='time' />
                    <button type={button} id='time' />
                    <button type={button} id='time' />
                    <button type={button} id='time' /> */}
                    <TextField
                        id='exercise_name'
                        value={this.state.exercise_name}
                        onChange={this.handleChange}
                        label='운동명'
                    />
                    <TextField
                        id='customer_name'
                        value={this.state.customer_name}
                        onChange={this.handleChange}
                        label='회원이름'
                    />
                    <TextField
                        id='customer_id'
                        value={this.state.customer_id}
                        onChange={this.handleChange}
                        label='회원아이디'
                    />
                </Container>
                <div className='footer'>
                    <Footer />
                </div>
            </div>
        )
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


export default connect(ReservationStateToProps, ReservationDispatchToProps)(Reservation);