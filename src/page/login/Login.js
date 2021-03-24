import React, { Component } from 'react';
import Authentication from '../login/Authentication';
import { connect } from 'react-redux';
import {loginRequest} from '../../action/authentication';
class Login extends Component {
    handleLogin = (id, pw) => {
        return this.props.loginRequest(id, pw).then(
            () => {
                if(this.props.status === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        id: id
                    };
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    alert('Welcome, ' + id + '!') 
                    this.props.history.push('/home');
                    return true;
                } else {
                    alert('Incorrect ID or password');
                    return false;
                }
            }
        );
    }
 
    render() {
        return (
            <div>
                <Authentication 
                mode={true} 
                onLogin={this.handleLogin}/>
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
 
 
export default connect(mapStateToProps, mapDispatchToProps)(Login);
