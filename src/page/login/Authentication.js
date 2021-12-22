import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../../styles/login/Authentication.css';

class Authentication extends Component {
	state = {
		id: '',
		password: '',
	};

	handleChange = (e) => {
		let nextState = {};
		nextState[e.target.name] = e.target.value;
		this.setState(nextState);
	};

	handleRegister = () => {
		let id = this.state.id;
		let pw = this.state.password;

		this.props.onRegister(id, pw).then((result) => {
			if (!result) {
				this.setState({
					id: '',
					password: '',
				});
			}
		});
	};

	handleLogin = () => {
		let id = this.state.id;
		let pw = this.state.password;

		this.props.onLogin(id, pw).then((success) => {
			if (!success) {
				this.setState({
					password: '',
				});
			}
		});
	};
	handleKeyPress = (e) => {
		if (e.charCode == 13) {
			if (this.props.mode) {
				this.handleLogin();
			} else {
				this.handleRegister();
			}
		}
	};
	render() {
		const inputBoxes = (
			<div>
				<div className='input-field col s12 id'>
					<label>아이디</label>
					<input
						name='id'
						type='text'
						className='validate'
						onChange={this.handleChange}
						value={this.state.id}
					/>
				</div>
				<div className='input-field col s12'>
					<label>비밀번호</label>
					<input
						name='password'
						type='password'
						className='validate'
						onChange={this.handleChange}
						value={this.state.password}
						onKeyPress={this.handleKeyPress}
					/>
				</div>
			</div>
		);

		const loginView = (
			<div className='loginCard'>
				<div className='card-content'>
					<div className='row'>
						{inputBoxes}
						<a
							className='waves-effect waves-light btn'
							onClick={this.handleLogin}
						>
							<Button className='' variant='primary'>
								LOGIN
							</Button>
						</a>
						<Link to='/register'>
							<Button variant='outline-secondary'>회원가입</Button>
						</Link>
					</div>
				</div>

				{/*<div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>*/}
			</div>
		);

		// const registerView = (
		//     <div className="card-content">
		//         <div className="row">
		//             {inputBoxes}
		//             <a className="waves-effect waves-light btn"
		//               onClick={this.handleRegister}>회원가입</a>
		//         </div>
		//     </div>
		// );
		return (
			<div className='container auth'>
				<div className='welcomeMent'>
					<p>Hello,</p>
					<p>안녕하세요</p>
					<p>헬스짐 관리자 로그인입니다</p>
				</div>
				<Link className='logo' to='/'>
					헬스 웹
				</Link>
				<div className='card'>
					{/*<div className="header blue white-text center">
                      <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    </div>*/}
					{this.props.mode ? loginView : registerView}
				</div>
			</div>
		);
	}
}

Authentication.propTypes = {
	mode: PropTypes.bool,
	onRegister: PropTypes.func,
	onLogin: PropTypes.func,
};

Authentication.defaultProps = {
	mode: true,
	onRegister: (id, pw) => {
		console.error('register function is not defined');
	},
	onLogin: (id, pw) => {
		console.error('login function not defined');
	},
};

export default Authentication;
