import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import {loginRequest} from '../../action/authentication';
import '../../styles/login/Login.css';

import QrReader from 'react-qr-scanner';
import {SERVER_URL} from '../../const/settings';
import QRCode from "react-qr-code";


const ip = SERVER_URL;
class QRLogin extends Component {
    handleScan(data) {
        console.log(data);
        if (data === null) {
            return;
        }
        alert('QR코드: ' + data.text);
        try {
            fetch('http://'+ip+'/customerenter?token='+data.text,
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
            })
            .catch(error => {
                if (data.text === '1') {
                    alert('김하늘 님 반갑습니다.');
                }
                else if (data.text === '2') {
                    alert('QR을 다시 인식바랍니다.');
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
    handleError(err) {
        console.error(err);
    }
 
    render() {
        const previewStyle = {
            display: 'flex',
            'alignItems': 'center',
            'justifyContent': 'center',
            height: 400,
            width: 400,
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
                    delay={100}
                    style={previewStyle}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    />
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
