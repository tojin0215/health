import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

import { Container, Row, Col, FloatingLabel } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Navigation from "../../component/navigation/Navigation";
import Header from "../../component/header/Header";
import Footer from "../../component/footer/Footer";
import { connect } from "react-redux";
import { getStatusRequest } from "../../action/authentication";

import "react-dropdown/style.css";

import MegaMenu from "../../component/navigation/Menu";
import { deleteTrainer, selectTrainer, updateTrainer } from "../../api/user";
const VieWTrainerItem = ({
  fitness_no,
  trainer_name,
  phone,
  birth,
  ment,
  history,
  sex,
  vieWTrainer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [trainer_name_input, setTrainer_name_input] = useState("");
  const [ment_input, setMent_input] = useState("");
  const [history_input, setHistory_input] = useState("");

  const modalClose = () => {
    setShowModal(false);
  };
  const modalOnClick = () => {
    setShowModal(true);
    setTrainer_name_input(trainer_name);
    setMent_input(ment);
    setHistory_input(history);
  };
  const updateChange1 = (e) => {
    setTrainer_name_input(e.target.value);
  };
  const updateChange3 = (e) => {
    setMent_input(e.target.value);
  };
  const updateChange4 = (e) => {
    setHistory_input(e.target.value);
  };

  const updateCompleted = (phone, fitness_no) => {
    updateTrainer(
      phone,
      fitness_no,
      trainer_name_input,
      ment_input,
      history_input
    ).then(() => {
      alert("수정완료");
      modalClose();
      vieWTrainer();
    });
  };
  const deleteCompleted = (phone, fitness_no) => {
    deleteTrainer(phone, fitness_no).then(() => {
      alert("삭제완료");
      modalClose();
      vieWTrainer();
    });
  };
  // console.log(showModal);
  return (
    <tr>
      <td>{trainer_name}</td>
      <td>{phone}</td>
      <td>{birth}</td>
      <td>{ment}</td>
      <td>{history}</td>
      <td>{sex == 1 ? "남" : "여"}</td>
      <td onClick={modalOnClick}> 수정하기</td>
      <div>
        <Modal show={showModal}>
          폰번호:{phone}(변경불가)
          <br />
          성별:{sex == 1 ? "남" : "여"}(변경불가)
          <br />
          이름:
          <input
            value={trainer_name_input}
            id="trainer_name"
            onChange={updateChange1}
          />
          자기소개:
          <input value={ment_input} id="ment" onChange={updateChange3} />
          연혁:
          <input value={history_input} id="history" onChange={updateChange4} />
          <button onClick={() => updateCompleted(phone, fitness_no)}>
            수정하기
          </button>
          <button onClick={() => deleteCompleted(phone, fitness_no)}>
            삭제하기(강사자르기)
          </button>
          <button onClick={modalClose}>닫기</button>
        </Modal>
      </div>
    </tr>
  );
};
class Trainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTrainerList: [],
      trainer_name: "",
      phone: "",
      birth: "",
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
        this.vieWTrainer();
      }
    });
  }

  vieWTrainer = () => {
    const fitness_no = this.props.userinfo.fitness_no;
    selectTrainer(fitness_no).then((result) => {
      const items = result.map((data, index, array) => {
        return (
          <VieWTrainerItem
            fitness_no={data.fitness_no}
            trainer_name={data.trainer_name}
            phone={data.phone}
            birth={data.birth}
            ment={data.ment}
            history={data.history}
            sex={data.sex}
            vieWTrainer={this.vieWTrainer}
          />
        );
      });
      this.setState({ viewTrainerList: items });
    });
  };
  render() {
    console.log(this.props.userinfo.fitness_no);
    console.log(this.state.viewTrainerList[0]);
    return (
      <div>
        <header className="header">
          {/* <Header /> */}
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
          <table>
            <thead>
              <tr>
                <th>이름/</th>
                <th>폰번호/</th>
                <th>생년월일/</th>
                <th>자기소개/</th>
                <th>연혁/</th>
                <th>성별</th>
              </tr>
            </thead>
            <tbody>{this.state.viewTrainerList}</tbody>
          </table>
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
