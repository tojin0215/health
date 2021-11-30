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
			<div className="wrap loginWrap">
				<div className="header">
					<Header />
					<Navigation />
				</div>
				<div className="localNavigation">
					<div className="container">
						<h2>
							<div className="parallelogram"></div>
							로그인
							<span>.</span>
						</h2>
					</div>
				</div>
				<div className="container">
					<Authentication mode={true} onLogin={this.handleLogin} />
					<div className="slide-container sectionGlass">
						<h5>오마이짐 미리보기</h5>
						<div className="loginSample">
							<p>체험 아이디로 미리 이용해볼 수 있습니다.</p>
							<p>아이디 : sample</p>
							<p>비밀번호 : sample</p>
						</div>
						<Slideshow></Slideshow>
					</div>
				</div>
				<div className="footer">
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

import slide1 from '../../images/slide_1.png';
import slide2 from '../../images/slide_2.png';
import slide3 from '../../images/slide_3.png';
import slide4 from '../../images/slide_4.png';
import slide5 from '../../images/slide_5.png';

const Slideshow = () => {
	return (
		<div>
			<Slide easing="ease" {...fadeProperties}>
				<div className="each-slide">
					<div style={{ backgroundImage: `url(${slide1})` }}>
						<span>회원 관리</span>
					</div>
				</div>
				<div className="each-slide">
					<div style={{ backgroundImage: `url(${slide2})` }}>
						<span>회원 인바디 체크</span>
					</div>
				</div>
				<div className="each-slide">
					<div style={{ backgroundImage: `url(${slide3})` }}>
						<span>결제 관리</span>
					</div>
				</div>
				<div className="each-slide">
					<div style={{ backgroundImage: `url(${slide4})` }}>
						<span>매출 현황</span>
					</div>
				</div>
				<div className="each-slide">
					<div style={{ backgroundImage: `url(${slide5})` }}>
						<span>운동 배정</span>
					</div>
				</div>
			</Slide>
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
