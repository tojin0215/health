import { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../../action/authentication';
import { choiceLoginManager, choiceLoginTrainer } from '../../api/user';
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
    choiceLoginManager(phone, idx).then(() => {
      handleLogin(phone, birth);
      alert(fitness_no + '로그인');
      window.location.replace('/home');
    });
  };

  return (
    <div className='sectionGlass'>
      <Row xs={5} className='border p-4'>
        <Col>
          <h5>idx</h5>
          {idx}
        </Col>
        <Col>
          <h5>연락처</h5>
          {phone}
        </Col>
        <Col>
          <h5>피트니스 넘버</h5>
          {fitness_no}
        </Col>
        <Col>
          <h5>생년월일</h5>
          {birth}
        </Col>
        <Col>
          <Button
            onClick={() => handleClick(phone, idx)}
            className='w-100 h-100'
          >
            {trainer_name}
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
    };
    this.selectTrainer();
  }

  selectTrainer = () => {
    choiceLoginTrainer(this.props.userinfo.id).then((res) => {
      const items = res.map((data, index, array) => {
        return (
          <TrainerList
            idx={data.idx}
            trainer_name={data.trainer_name}
            phone={data.phone}
            fitness_no={data.fitness_no}
            birth={data.birth}
            handleLogin={this.handleLogin}
          />
        );
      });
      this.setState({ trainerList: items });
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
        alert('되나');
        return true;
      } else {
        alert('ID나 비밀번호를 확인해주세요.');
        return false;
      }
    });
  };

  render() {
    return (
      <div className=''>
        <div className='localNavigation'>
          <div className='container'>
            <h2>
              <div className='parallelogram'></div>
              로그인 선택
              <span>.</span>
            </h2>
          </div>
        </div>
        <Container className='container'>{this.state.trainerList}</Container>
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
