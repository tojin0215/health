import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {Nav, Navbar, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './Navigation.css';

class Navigation extends Component {
    render() {
        const { userinfo } = this.props;
        return (
            <div className="Navigation">
                <Navbar className={styles.navbar}>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="../../logo.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        <span className={styles.navitem}>{userinfo.fitness_name}</span>
                    </Navbar.Brand>
                    <Nav className="mr-auto" className={styles.navitem}>
                        <NavLink exact to="/"><span className={styles.navitem}>Home</span></NavLink>
                        <NavLink exact to="/customer"><span className={styles.navitem}>고객</span></NavLink>
                        <NavLink exact to="/sales"><span className={styles.navitem}>상품/매출</span></NavLink>
                        <NavLink exact to="/exercise"><span className={styles.navitem}>운동</span></NavLink>
                    </Nav>
                    <Nav>
                        <Nav.Item><span className={styles.navitem}>{userinfo.member_name}님</span></Nav.Item>
                        <Nav.Link eventKey={2} href="/login">
                        <span className={styles.navitem}>Logout</span>
                        </Nav.Link>
                    </Nav>
                </Navbar>
                
            </div>
        );
    }
}

const navigationStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}
export default connect(navigationStateToProps, undefined)(Navigation);

