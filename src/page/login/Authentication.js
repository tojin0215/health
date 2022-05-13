import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import FormCheck from "react-bootstrap/FormCheck";

import "../../styles/login/Authentication.css";

class Authentication extends Component {
  state = {
    id: "",
    password: "",
    radioGroup: {
      fitness: true,
      trainer: false,
      customer: false,
    },
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
  handleRadio = (rad) => {
    let obj = {
      fitness: false,
      trainer: false,
      customer: false,
    };
    obj[rad.target.id] = rad.target.checked;
    // console.log(obj);
    this.setState({
      radioGroup: obj,
    });
  };

  handleLoginCustomer = () => {
    alert("회원로그인");
  };
  render() {
    console.log(this.state.radioGroup["fitness"]);
    //강사, 회원은 사업주가 승인하여야만 회원가입이 가능합니다.
    const inputBoxes = (
      <div>
        <Form key="loginGroup">
          <Form.Check
            inline
            type="radio"
            id="fitness"
            name="radioGroup"
            checked={this.state.radioGroup["fitness"]}
            label="사업주"
            onClick={this.handleRadio}
          />
          <Form.Check
            inline
            type="radio"
            id="trainer"
            name="radioGroup"
            checked={this.state.radioGroup["trainer"]}
            label="강사"
            onClick={this.handleRadio}
          />
          <Form.Check
            inline
            type="radio"
            id="customer"
            name="radioGroup"
            checked={this.state.radioGroup["customer"]}
            label="회원"
            onClick={this.handleRadio}
          />
        </Form>
      </div>
    );
    const loginBox = (
      <div>
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
          <Form.Text className="text-muted"></Form.Text>
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
            placeholder="Password"
          />
        </Form.Group>
      </div>
    );
    const trainerLoginBox = (
      <div>
        <Form.Group className="mb-3" controlId="formBasicId">
          <Form.Label>핸드폰번호</Form.Label>
          <Form.Control
            name="phone"
            type="text"
            className="validate"
            placeholder="Enter phone number"
            onChange={this.handleChange}
            value={this.state.phone}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>생년월일</Form.Label>
          <Form.Control
            name="birth"
            type="password"
            className="validate"
            onChange={this.handleChange}
            value={this.state.birth}
            onKeyPress={this.handleKeyPress}
            placeholder="birth"
          />
        </Form.Group>
      </div>
    );
    const loginView = (
      <div>
        <Card className="text-center">
          <Card.Body>
            {inputBoxes}
            {loginBox}
            <Button onClick={this.handleLogin} className="" variant="primary">
              LOGIN
            </Button>
            <Button
              className="border-0 bg-white"
              variant="outline-secondary"
              href="/register"
            >
              회원가입
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
    const loginViewTrainer = (
      <div>
        <Card className="text-center">
          <Card.Body>
            {inputBoxes}
            {trainerLoginBox}
            <Button
              onClick={this.handleLoginTrainer}
              className=""
              variant="primary"
            >
              LOGIN
            </Button>
            <br />
            강사는 헬스장에서 등록가능합니다.
          </Card.Body>
        </Card>
      </div>
    );
    const loginViewCustomer = (
      <div>
        <Card className="text-center">
          <Card.Body>
            {inputBoxes}
            <Button
              onClick={this.handleLoginCustomer}
              className=""
              variant="primary"
            >
              LOGIN
            </Button>
            <br />
            회원은 헬스장에서 등록가능합니다.
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
        {this.state.radioGroup["fitness"] ? (
          <div className="card">
            {this.props.mode ? loginView : registerView}
          </div>
        ) : (
          ""
        )}
        {this.state.radioGroup["trainer"] ? (
          <div className="card">
            {this.props.mode ? loginViewTrainer : registerView}
          </div>
        ) : (
          ""
        )}
        {this.state.radioGroup["customer"] ? (
          <div className="card">
            {this.props.mode ? loginViewCustomer : registerView}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onRegister: PropTypes.func,
  onLogin: PropTypes.func,
  onTrainer: PropTypes.func,
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
