import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card'
import FormCheck from "react-bootstrap/FormCheck";

import "../../styles/login/Authentication.css";

class Authentication extends Component {
  state = {
    id: "",
    password: "",
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
          id: "",
          password: "",
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
          password: "",
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
        <Form key="loginGroup">
          <Form.Check
            inline
            type="radio"
            id="loginGroup-1"
            name="group1"
            label="사업주"
          />
          <Form.Check
            inline
            type="radio"
            id="loginGroup-2"
            name="group1"
            label="강사"
          />
          <Form.Check
            inline
            type="radio"
            id="loginGroup-3"
            name="group1"
            label="회원"
          />
          <Form.Group className="mb-3" controlId="formBasicId">
            <Form.Label>아이디</Form.Label>
            <Form.Control
            	name="id"
              type="text"
              className="validate"
              placeholder="Enter id"
              onChange={this.handleChange}
              value={this.state.id}
            />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              name="password"
              type="password"
              className="validate"
              onChange={this.handleChange}
              value={this.state.password}
              onKeyPress={this.handleKeyPress}
              placeholder="Password" />
          </Form.Group>
        </Form>
      </div>
    );

    const loginView = (
		<div>
			<Card className="text-center"  >
				<Card.Body>
          {inputBoxes}
          <Button 
          onClick={this.handleLogin} className="" variant="primary">
            LOGIN
          </Button>
          <Button className="border-0 bg-white" variant="outline-secondary" href="/register">
            회원가입
          </Button>
        </Card.Body>
			</Card>
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
      <div className="container auth">
        <div className="welcomeMent">
          <p>Hello,</p>
          <p>안녕하세요!</p>
          <p>헬스짐 관리자 오마이짐입니다.</p>
        </div>
        <div className="card">
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
    console.error("register function is not defined");
  },
  onLogin: (id, pw) => {
    console.error("login function not defined");
  },
};

export default Authentication;
