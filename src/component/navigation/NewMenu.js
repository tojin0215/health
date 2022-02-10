import React, { Component } from 'react';
// import Navbar from 'react-bootstrap/Navbar';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
// import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';
import { logoutRequest } from '../../action/authentication';

import { textlogo } from '../../../src/img/logo-text.png';

// import { MdMenu } from 'react-icons/md';

import styles from './newMenu.css';

class NewMenu extends Component {
	// constructor(props) {
	// 	super(props);
	// 	console.log(this.props.userinfo);
	// }
	// handleLogout = () => {
	// 	this.props.logoutRequest().then(() => {
	// 		alert('로그아웃 되었습니다.');

	// 		// EMPTIES THE SESSION
	// 		let loginData = {
	// 			isLoggedIn: false,
	// 			username: '',
	// 		};

	// 		document.cookie = 'key=' + btoa(JSON.stringify(loginData));

	// 		this.props.goLogin();
	// 	});
	// };

	render() {
		return (
			<Navbar className='newmenuWrap' bg='light' variant='light' expand='xl'>
				<Container fluid>
					<Navbar.Brand href='/home'>오마이짐</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse>
						<Nav className='me-auto'>
							<Nav.Link href='/QR'>QR</Nav.Link>
							<NavDropdown title='고객'>
								<NavDropdown.Item href=''>예약</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href='/customer'>회원 관리</NavDropdown.Item>
								<NavDropdown.Item href=''>회원 등록</NavDropdown.Item>
								<NavDropdown.Item href=''>인바디 정보</NavDropdown.Item>
							</NavDropdown>
							<NavDropdown title='상품/매출'>
								<NavDropdown.Item href=''>매출 현황</NavDropdown.Item>
								<NavDropdown.Item href=''>결제 등록</NavDropdown.Item>
							</NavDropdown>
							<NavDropdown title='운동'>
								<NavDropdown.Item href=''>운동 배정</NavDropdown.Item>
								<NavDropdown.Item href=''>운동 설정</NavDropdown.Item>
							</NavDropdown>
							<Navbar.Text>
								센터 코드: <span>2</span>
							</Navbar.Text>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	}
}

export default NewMenu;
