import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import MegaMenu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import Footer from '../../component/footer/Footer';

//bootstrap
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import {
  deleteIntroduce,
  selectClientReservation,
  selectIntroduce,
  selectReservation,
  updateIntroduce,
} from '../../api/user';

const ViewIntroduceItem = ({
  idi,
  fitness_no,
  manager_name,
  picture,
  story,
  viewIntroduce,
  loginWhether,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [story_input, setStory_input] = useState('');
  const [file_input, setFile_input] = useState(null);
  const [picture_input, setPicture_input] = useState('');
  const [open, setOpen] = React.useState(false);

  const handleUpdate = () => {
    updateIntroduce(file_input, story_input, idi).then(() => {
      alert('수정완료');
      setShowModal(false);
      viewIntroduce();
    });
  };
  const handleDelete = (idi) => {
    console.log(idi);
    deleteIntroduce(idi).then(() => {
      alert('삭제완료');
      setShowModal(false);
      viewIntroduce();
    });
  };

  const modalOnClick = () => {
    setShowModal(true);
    setStory_input(story);
  };
  const updateChange1 = (e) => {
    setPicture_input(e.target.value);
    setFile_input(e.target.files[0]);
  };
  const updateChange2 = (e) => {
    setStory_input(e.target.value);
  };

  return (
    <Row className='sectionGlass' xs={1}>
      <Col className='text-center mb-5'>
        <h1>{manager_name}</h1>
      </Col>
      <Col className='text-center'>
        <img className='width-inherit' src={picture} />
      </Col>
      <Col className='my-3 white-space-break-spaces text-center'>
        <p>{story}</p>
      </Col>
      {loginWhether == 2 ? (
        ''
      ) : loginWhether == 1 ? (
        ''
      ) : (
        <Col className='text-center'>
          <Button onClick={modalOnClick}>수정하기</Button>
          <Modal show={showModal} size='lg' onHide={() => setShowModal(false)}>
            {/* <Modal show={true} className=''> */}
            <Row xs={1} className='p-4'>
              <Col className='py-3 text-center'>
                <h2>{manager_name}</h2>
              </Col>
              <Col className='py-3 text-center'>
                <img className='width-inherit' src={picture} />
              </Col>
              <Col className='py-2'>
                <h5>사진 선택</h5>
                <Form.Group className='border'>
                  <Form.Control
                    type='file'
                    onChange={updateChange1}
                    className='w-100'
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col className='py-2'>
                <h5>내용</h5>
                <Form.Control
                  value={story_input}
                  onChange={updateChange2}
                  type='text'
                  as='textarea'
                  rows={5}
                ></Form.Control>
              </Col>
              <Col xs={12} sm={8} className='pb-2'>
                <Button onClick={() => handleUpdate(idi)} className='w-100'>
                  수정하기
                </Button>
              </Col>
              <Col xs={12} sm={4}>
                <Button
                  onClick={() => handleDelete(idi)}
                  variant='outline-danger'
                  className='w-100'
                >
                  삭제하기
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => setShowModal(false)}
                  variant='outline-secondary'
                  className='w-100 mt-2'
                >
                  닫기
                </Button>
              </Col>
            </Row>
          </Modal>
        </Col>
      )}
    </Row>
  );
};

class Introduce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewIntroduceList: [],
    };
  }
  goLogin = () => {
    this.props.history.push('/');
  };

  componentDidMount() {
    //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    // get cookie by name
    function getCookie(name) {
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      if (parts.length == 2) return parts.pop().split(';').shift();
    }

    // get loginData from cookie
    let loginData = getCookie('key');
    // if loginData is undefined, do nothing
    if (typeof loginData === 'undefined') {
      this.props.history.push('/');
      return;
    }

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));
    // if not logged in, do nothing
    if (!loginData.isLoggedIn) {
      this.props.history.push('/');
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
          id: '',
        };

        document.cookie = 'key=' + btoa(JSON.stringify(loginData));

        // and notify
        alert('Your session is expired, please log in again');
      } else {
        this.viewIntroduce();
      }
    });
  }

  viewIntroduce = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectReservation(
        this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
      ).then((trainerResult) => {
        const fitness_no =
          this.props.userinfo.loginWhether === 2
            ? clientResult[0].fitness_no
            : this.props.userinfo.loginWhether === 1
            ? trainerResult[0].fitness_no
            : this.props.userinfo.fitness_no;
        selectIntroduce(fitness_no).then((result) => {
          const items = result.map((data, index, array) => {
            return (
              <ViewIntroduceItem
                idi={data.idi}
                fitness_no={data.fitness_no}
                manager_name={data.manager_name}
                picture={data.picture}
                story={data.story}
                viewIntroduce={this.viewIntroduce}
                loginWhether={this.props.userinfo.loginWhether}
              />
            );
          });
          this.setState({ viewIntroduceList: items });
        });
      });
    });
  };

  render() {
    // console.log(this.state.viewIntroduceList);
    return (
      <div>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                센터 소개
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/introduce'>센터 소개</Link>
                <span>&#62;</span>
                {this.props.userinfo.loginWhether === 0 ? (
                  <Link to='/introduce/add'>센터 소개 등록</Link>
                ) : (
                  ''
                )}
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <Container>
          <div>{this.state.viewIntroduceList}</div>
        </Container>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const IntroduceStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const IntroduceDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  IntroduceStateToProps,
  IntroduceDispatchToProps
)(Introduce);
