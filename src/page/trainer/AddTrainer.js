import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col, FloatingLabel } from "react-bootstrap";

import Navigation from "../../component/navigation/Navigation";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import { connect } from "react-redux";
import { getStatusRequest } from "../../action/authentication";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { SERVER_URL } from "../../const/settings";
import MegaMenu from "../../component/navigation/Menu";
import { TextField } from "@material-ui/core";
import { insertTrainer, trainerManager } from "../../api/user";

class AddTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitness_no: this.props.userinfo.fitness_no,
      phone: "",
      birth: "",
      trainer_name: "",
      ment: "",
      history: "",
      sex: "",
    };
  }
  goLogin = () => {
    this.props.history.push("/");
  };
  componentDidMount() {
    //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    // get cookie by name
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
    // get loginData from cookie
    let loginData = getCookie("key");
    // if loginData is undefined, do nothing
    if (typeof loginData === "undefined") {
      this.props.history.push("/");
      return;
    }

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));
    // if not logged in, do nothing
    if (!loginData.isLoggedIn) {
      this.props.history.push("/");
      return;
    }

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(() => {
      // if session is not valid
      if (!this.props.status.valid) {
        // logout the session
        loginData = {
          isLoggedIn: false,
          id: "",
        };

        document.cookie = "key=" + btoa(JSON.stringify(loginData));

        // and notify
        alert("Your session is expired, please log in again");
      } else {
      }
    });
  }
  handleTrainer = () => {
    insertTrainer(
      this.state.phone,
      this.state.birth,
      this.state.trainer_name,
      this.state.fitness_no,
      this.state.ment,
      this.state.history,
      this.state.sex
    ).then((res) => {
      console.log(res);
      alert("trainer Table");
    });
  };
  handleManagerLogin = () => {
    trainerManager(
      this.state.phone,
      this.state.birth,
      this.state.trainer_name,
      this.state.fitness_no
    ).then((res) => {
      console.log(res);
      alert("manager Table");
    });
  };
  handleTotal = () => {
    this.handleTrainer();
    this.handleManagerLogin();
  };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  render() {
    console.log(this.state.fitness_no);
    return (
      <div>
        <header className="header">
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className="localNavigation">
            <div className="container">
              <h2>
                <div className="parallelogram"></div>
                강사등록
                <span>.</span>
              </h2>
              <div className="breadCrumb">
                <Link to="/home">HOME</Link>
                <span>&#62;</span>
                <Link to="/trainer">강사</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <div>
            <h3>강사 정보 입력</h3>
          </div>
          <form>
            <label>
              헬스장 번호:
              <TextField value={this.state.fitness_no} />
            </label>
            <br />
            <label>
              핸드폰번호:
              <TextField
                type="number"
                variant="outlined"
                value={this.state.phone}
                id="phone"
                onChange={this.handleChange}
                required
              />
            </label>
            <br />
            <label>
              생년월일:
              <TextField
                type="text"
                value={this.state.birth}
                id="birth"
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              이름:
              <TextField
                type="text"
                value={this.state.trainer_name}
                id="trainer_name"
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              자기소개:
              <TextField
                type="text"
                value={this.state.ment}
                id="ment"
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              수상이력:
              <TextField
                type="text"
                value={this.state.history}
                id="history"
                onChange={this.handleChange}
              />
            </label>
            <br />
            <label>
              성별
              <TextField
                value={this.state.sex}
                id="sex"
                onChange={this.handleChange}
                type="text"
              />
            </label>
            <br />
            <button
              className="btnSolid"
              type="button"
              onClick={this.handleTotal}
            >
              등록하기
            </button>
          </form>
        </Container>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}
const AddTrainerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddTrainerDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  AddTrainerStateToProps,
  AddTrainerDispatchToProps
)(AddTrainer);
