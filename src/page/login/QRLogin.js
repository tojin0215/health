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


const ip = SERVER_URL;
class QRLogin extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fitness_no: this.props.userinfo? this.props.userinfo.fitness_no:1, //Redux를 통해 받은 값
            member_no: this.props.location.state?Number(this.props.location.state.member_no):1,
            token: '',
            is_checking: false,
        };
        this.getTestCustomerQRCode();
    };
    handleScan = (data) => {
        console.log(data);
        if (data === null) {
            return;
        }
        else if (this.state.is_checking) {
            console.log('is_checking');
            return;
        } else {this.setState({is_checking: true})}
        try {
            fetch(ip+'/customerenter?token='+data.text,
            {
                method: 'GET',
                credential: 'include',
            })
            .then(response => response.json())
            .then(response => {
                if (response.code !== 200) {
                    alert(response.message);
                }
                else {
                    alert(response.user.name+' 님 반갑습니다.');
                }
                this.setState({is_checking: false})
            })
            .catch(error => {
                if (data.text === '1') {
                    alert('김하늘 님 반갑습니다.');
                }
                else if (data.text === '2') {
                    alert('QR을 다시 인식바랍니다.');
                }
                this.setState({is_checking: false})
            })
        } catch (e) {
            console.error(e);
            this.setState({is_checking: false})
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
            'alignItems': 'center',
            'justifyContent': 'center',
            height: 600,
            width: 600,
        }
        return (
            <div className='wrap loginWrap'>
                <div className='header'>
                    <Header />
                    <Navigation />
                </div>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            <div className='parallelogram'></div>
                            로그인
                            <span>.</span>
                        </h2>
                    </div>
                </div>
                <div className='container'>
                <QrReader
                    delay={500}
                    style={previewStyle}
                    className='qr-reader'
                    onError={this.handleError}
                    onScan={this.handleScan}
                    />
                </div>
                <div className='container'>
                    <div>
                    <h1>
                        테스트를 위한 QR입니다.
                    </h1>
                    </div>
                    
                    <div>
                        <QRCode value={this.state.token} />
                    </div>
                </div>
                <div className='footer'>
                    <Footer />
                </div>
            </div>
        );
    }
}
 
const mapStateToProps = (state) => {
    return {
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
