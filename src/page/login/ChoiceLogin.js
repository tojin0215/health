import { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../../action/authentication';
import {
  changeLoginwhether,
  choiceFitness,
  choiceLoginClient,
  choiceLoginManager,
  choiceLoginTrainer,
} from '../../api/user';
import Footer from '../../component/footer/Footer';

//css
import '../../styles/login/choiceLogin.css';

//bootstrap
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// icons
import { AiTwotoneSnippets } from 'react-icons/ai';
import { AiFillSmile } from 'react-icons/ai';

const TrainerList = ({
  idx,
  trainer_name,
  phone,
  fitness_no,
  birth,
  handleLogin,
}) => {
  const handleClick = () => {
    choiceLoginManager(phone, idx, fitness_name).then(() => {
      handleLogin(phone, birth);
      // alert(fitness_name + '로그인');
      window.location.replace('/home');
    });
  };
  const [fitness_no_input, setFitness_no_input] = useState('');
  const [fitness_name, setfitness_name] = useState('');
  useEffect(() => {
    choiceFitness(fitness_no).then((res) => {
      setFitness_no_input(res[0].manager_name);
      setfitness_name(res[0].fitness_name);
      // console.log(res[0].manager_name);
    });
  });
  return (
    <Row
      className='p-4 choice-login__block'
      onClick={() => handleClick(phone, idx)}
    >
      <Col>
        <span>센터</span>
        <h4>{fitness_name}</h4>
      </Col>
      <Col md={2}>
        <span>Fit-No.</span>
        <h5>{fitness_no}</h5>
      </Col>
      <Col md={2}>
        <span>사업주</span>
        <h5>{fitness_no_input}</h5>
      </Col>
    </Row>
  );
};

const ClientList = ({
  idc,
  client_name,
  fitness_no,
  phone,
  birth,
  handleLogin,
}) => {
  const handleClick = () => {
    choiceLoginManager(phone, idc, fitness_name, 2).then(() => {
      handleLogin(phone, birth);
      // alert(fitness_name + '로그인');
      window.location.replace('/home');
    });
  };
  const [fitness_no_input, setFitness_no_input] = useState('');
  const [fitness_name, setfitness_name] = useState('');
  useEffect(() => {
    choiceFitness(fitness_no).then((res) => {
      setFitness_no_input(res[0].manager_name);
      setfitness_name(res[0].fitness_name);
      // console.log(res[0].manager_name);
    });
  });
  return (
    <Row
      className='p-4 choice-login__block'
      onClick={() => handleClick(phone, idc)}
    >
      <Col>
        <span>센터</span>
        <h4>{fitness_name}</h4>
      </Col>
      <Col md={2}>
        <span>Fit-no.</span>
        <h5>{fitness_no}</h5>
      </Col>
      <Col md={2}>
        <span>사업주</span>
        <h5>{fitness_no_input}</h5>
      </Col>
    </Row>
  );
};
class ChoiceLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinNo: '',
      trainerList: [],
      clientList: [],
      on: false,
      on2: false,
    };
    this.selectTrainer();
    this.selectClient();
  }

  selectTrainer = () => {
    choiceLoginTrainer(this.props.userinfo.id).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <TrainerList
            idx={data.idx}
            trainer_name={data.trainer_name}
            fitness_no={data.fitness_no}
            phone={data.phone}
            birth={data.birth}
            handleLogin={this.handleLogin}
          />
        );
      });
      this.setState({ trainerList: items });
      // console.log(items);
    });
  };

  selectClient = () => {
    choiceLoginClient(this.props.userinfo.id).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <ClientList
            idc={data.idc}
            client_name={data.client_name}
            fitness_no={data.fitness_no}
            phone={data.phone}
            birth={data.birth}
            handleLogin={this.handleLogin}
          />
        );
      });
      this.setState({ clientList: items });
    });
  };

  handleLogin = (id, pw) => {
    return this.props.loginRequest(id, pw).then(() => {
      if (this.props.status === 'SUCCESS') {
        let loginData = {
          isLoggedIn: true,
          id: id,
        };
        document.cookie = 'key=' + btoa(JSON.stringify(loginData));
        // alert('되나');
        return true;
      } else {
        alert('ID나 비밀번호를 확인해주세요.');
        return false;
      }
    });
  };

  //회원 2
  handleOn = () => {
    this.setState({ on: true, on2: false });
    changeLoginwhether(this.props.userinfo.id, 2).then(() => {});
  };
  //강사 1
  handleOn2 = () => {
    this.setState({ on2: true, on: false });
    changeLoginwhether(this.props.userinfo.id, 1).then(() => {});
  };

  render() {
    // console.log(this.props.userinfo.loginWhether);
    // console.log(this.props.userinfo.id);
    // console.log(this.state.trainerList);

    return (
      <div className='wrap'>
        <div className='localNavigation'>
          <div className='container'>
            <h2>
              <div className='parallelogram'></div>
              로그인 선택
              <span>.</span>
            </h2>
          </div>
        </div>
        <Container className='container'>
          <Row>
            <Col xs={12}>
              <div className='mt-4 sectionGlass'>
                <h3>
                  {this.props.userinfo.manager_name}
                  <span className='fs-4'> 님 </span>
                  <span className='fs-5 fw-light'>반갑습니다</span>
                </h3>
                <div className='p-3 fs-5 fw-bold text-center'>
                  <p className='pb-3'>
                    로그인하실 회원 종류 및 사업장을 선택해주세요
                  </p>
                  <Row>
                    <Col md={6} className='choice-login__btn'>
                      <Button
                        variant='primary'
                        className='w-100 fs-4 fw-bold'
                        onClick={this.handleOn}
                      >
                        <AiFillSmile />
                        회원
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant='success'
                        className='w-100 fs-4 fw-bold'
                        onClick={this.handleOn2}
                      >
                        <AiTwotoneSnippets />
                        강사
                      </Button>
                    </Col>
                    <Col className='p-4'>
                      {this.state.on
                        ? this.state.clientList.length === 0
                          ? ''
                          : this.state.clientList
                        : ''}
                      {this.state.on2
                        ? this.state.trainerList.length === 0
                          ? ''
                          : this.state.trainerList
                        : ''}
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const ChoiceLoginStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.login.status,
  };
};

const ChoiceLoginDispatchToProps = (dispatch) => {
  return {
    loginRequest: (id, pw) => {
      return dispatch(loginRequest(id, pw));
    },
  };
};

export default connect(
  ChoiceLoginStateToProps,
  ChoiceLoginDispatchToProps
)(ChoiceLogin);
