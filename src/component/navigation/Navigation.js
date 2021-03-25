import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {Nav, Navbar, Container} from 'react-bootstrap';
import {logoutRequest} from '../../action/authentication';

import 'bootstrap/dist/css/bootstrap.css';
import styles from './Navigation.css';

import imgLogo from '../../images/logo.png';
import imgLogoFull from '../../images/logo-text.png';

class Navigation extends Component {
    constructor(props){
        super(props);
        console.log(this.props.userinfo)
    }
    handleLogout = () => {
        this.props.logoutRequest().then(
            () => {
                alert('Good Bye!');
 
                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    username: ''
                };
 
                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                
                this.props.goLogin();
            }
        );
    }
    
    render() {
        const { userinfo } = this.props;
        return (
            <div className="Navigation">
                <Navbar className={styles.navbar}>
                    <Navbar.Brand href="/home">
                        <img
                            alt="투진컴퍼니"
                            src={imgLogo}
                            width="auto"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        <span className={styles.navitem}>{userinfo.fitness_name}</span>
                    </Navbar.Brand>
                    <Nav className="mr-auto" className={styles.navitem}>
                        <NavLink exact to="/home"><span className={styles.navitem}>Home</span></NavLink>
                        <NavLink exact to="/customer"><span className={styles.navitem}>고객</span></NavLink>
                        <NavLink exact to="/sales"><span className={styles.navitem}>상품/매출</span></NavLink>
                        <NavLink exact to="/exercise"><span className={styles.navitem}>운동</span></NavLink>
                    </Nav>
                    <Nav className={styles.navUtill}>
                        <Nav.Item><span className={styles.navitem}>{userinfo.manager_name}님</span></Nav.Item>
                        <Nav.Item>
                        <button onClick={this.handleLogout}>Logout</button>
                        </Nav.Item>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

const navigationStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

const navigationDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    };
};
export default connect(navigationStateToProps, navigationDispatchToProps)(Navigation);

