import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import {loginRequest} from '../../action/authentication';
import '../../styles/login/QRLogin.css';

import QrReader from 'react-qr-scanner';
import {SERVER_URL} from '../../const/settings';
import QRCode from "react-qr-code";
import axios from 'axios';
import { Modal } from 'react-bootstrap';


const ip = SERVER_URL;
const TIMER_SUCCESS = 2500;
const TIMER_FAIL = 1500;

const postCustomerEnter = (fitness_no, token) => {
    return axios.get(`${SERVER_URL}/customerenter`, {params: {fitness_no, token}}).then(response => response.data)
}

class QRLogin extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fitness_no: props.userinfo? props.userinfo.fitness_no: 2, //Redux를 통해 받은 값
            member_no: this.props.location.state?Number(this.props.location.state.member_no):1,
            token: '',
            is_checking: false,
            modal_show: false,
            modal_title: "",
            modal_body: "",
        };
    };

    handleScan = (data) => {
        if (data === null) {
            return;
        }
        else if (this.state.is_checking) {
            // console.log('is_checking');
            return;
        }
        else {
            this.setState({is_checking: true});
        }
        try {

            postCustomerEnter(this.state.fitness_no, data.text)
            .then(result => {
                this.setState({
                    modal_title: "반갑습니다",
                    modal_body: result.user.name+' 님 반갑습니다.',
                    is_checking: false,
                    modal_show: true,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            modal_show: false,
                        })
                    }, TIMER_SUCCESS)
                })
                .catch(error => console.log(error))
            })
            .catch(error => {
                this.setState({
                    modal_title: "에러 발생",
                    modal_body: error.response.data.message,
                    is_checking: false,
                    modal_show: true,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            modal_show: false,
                        })
                    }, TIMER_FAIL)
                })
            })
        } catch (e) {
            console.error(e);
            this.setState({is_checking: false, modal_show: false})
        }
    }
    handleError(err) {
        console.error(err);
    }

    getTestCustomerQRCode = () => {
        // const data = new FormData();
        // data.append('fitness_no', 1);
        // data.append('customer_no', 1);
        const data = {
            fitness_no: 1,
            customer_no: 1,
        }
        fetch(
            ip+'/customerenter?type=check&type2=customer',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        )
        .then(response => response.json())
        .then(response => {
            console.log(response.token);
            this.setState({token: response.token})
        })
    }
 
    render() {
        const previewStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '75%',
            width: '95%',
        }
        return (
            <div className='wrap loginWrap'>
                {/* <div className='header'>
                    <Header />
                    <Navigation />
                </div> */}
                {/* <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            <div className='parallelogram'></div>
                            로그인
                            <span>.</span>
                        </h2>
                    </div>
                </div> */}
                <div className='container'>
                <QrReader
                    delay={500}
                    style={previewStyle}
                    className='qr-reader'
                    onError={this.handleError}
                    onScan={this.handleScan}
                    />
                </div>

                {/* <div className='container'>
                    <div>
                    <h1>
                        테스트를 위한 QR입니다.
                    </h1>
                    </div>
                    
                    <div>
                        <QRCode value={this.state.token} />
                    </div>
                </div> */}
                <div className='footer'>
                    <Footer />
                </div>
                <Modal show={this.state.modal_show}>
                    <Modal.Header>
                        {this.state.modal_title}
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modal_body}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
 
const mapStateToProps = (state) => {
    return {
		userinfo: state.authentication.userinfo,
        status: state.authentication.login.status
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id,pw));
        }
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(QRLogin);
