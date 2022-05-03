import React, { Component } from 'react';
import Authentication from '../login/Authentication';
import Navigation from '../../component/navigation/Navigation';
import { Slide } from 'react-slideshow-image';


import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { loginRequest } from '../../action/authentication';
import 'react-slideshow-image/dist/styles.css';
import '../../styles/login/Login.css';

import 'react-slideshow-image/dist/styles.css';

const fadeProperties = {
	duration: 2000,
	canSwipe: false,
};

class Login extends Component {
	handleLogin = (id, pw) => {
		return this.props.loginRequest(id, pw).then(() => {
			if (this.props.status === 'SUCCESS') {
				// create session data
				let loginData = {
					isLoggedIn: true,
					id: id,
				};
				document.cookie = 'key=' + btoa(JSON.stringify(loginData));
				alert(id + '님 반갑습니다.');
				this.props.history.push('/home');
				return true;
			} else if (this.props.status === 'PERMITWAITING') {
				alert('승인 대기 중입니다.');
				return false;
			} else {
				alert('ID나 비밀번호를 확인해주세요.');
				return false;
			}
		});
	};

	render() {
		return (
			<div className='wrap loginWrap'>
				{/* <div className='header'>
					<Header />
					<Navigation />
				</div> */}
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
					<Authentication mode={true} onLogin={this.handleLogin} />
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
		status: state.authentication.login.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginRequest: (id, pw) => {
			return dispatch(loginRequest(id, pw));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
