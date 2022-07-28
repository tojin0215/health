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

//bootstrap
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

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
      alert(fitness_name + '로그인');
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
    <div className='sectionGlass'>
      <Row xs={5} className='border p-4'>
        <Col>
          <h5>피트니스 넘버</h5>
          {fitness_no}
        </Col>
        <Col>
          <Button
            onClick={() => handleClick(phone, idx)}
            className='w-100 h-100'
          >
            {fitness_name}
            <br />
            {fitness_no_input}
          </Button>
        </Col>
      </Row>
    </div>
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
      alert(fitness_name + '로그인');
      window.location.replace('/home');
    });
  };
  const [fitness_no_input, setFitness_no_input] = useState('');
  const [fitness_name, setfitness_name] = useState('');
  useEffect(() => {
    choiceFitness(fitness_no).then((res) => {
      setFitness_no_input(res[0].manager_name);
      setfitness_name(res[0].fitness_name);
      console.log(res[0].manager_name);
    });
  });
  return (
    <div className='sectionGlass'>
      <Row className='border p-4'>
        <Col>
          <h5>피트니스 넘버</h5>
          {fitness_no}
        </Col>
        <Col>
          <Button
            onClick={() => handleClick(phone, idc)}
            className='w-100 h-100'
          >
            {fitness_name}
            <br />
            {fitness_no_input}
          </Button>
        </Col>
      </Row>
    </div>
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
      console.log(items);
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
          <div>{this.props.userinfo.manager_name}</div>
          <h2>
            <Button onClick={this.handleOn}>회원</Button>
          </h2>
          {this.state.on
            ? this.state.clientList.length === 0
              ? ''
              : this.state.clientList
            : ''}

          <h2>
            <Button onClick={this.handleOn2}>강사</Button>
          </h2>
          {this.state.on2
            ? this.state.trainerList.length === 0
              ? ''
              : this.state.trainerList
            : ''}
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
