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

class Trainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  render() {
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
                강사관리
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
          <div></div>
        </Container>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}
const TrainerStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const TrainerDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(TrainerStateToProps, TrainerDispatchToProps)(Trainer);
