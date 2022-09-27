import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { getStatusRequest } from '../../action/authentication';
import Header from '../../component/header/Header';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import { Link } from 'react-router-dom';
import Footer from '../../component/footer/Footer';

import '../../styles/introduce/introduce.css';

//bootstrap
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

// icons
import { RiDeleteBin5Fill } from 'react-icons/ri';

import {
  deleteIntroduce,
  selectClientReservation,
  selectIntroduce,
  selectTrainerReservation,
  updateIntroduce,
  updateStory,
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
  const [whether, setWhether] = useState(false);

  const handleUpdate = (idi) => {
    updateIntroduce(file_input, story_input, idi).then(() => {
      alert('수정이 완료되었습니다.');
      setShowModal(false);
      setPicture_input('');
      setFile_input(null);
      setWhether(false);
      viewIntroduce();
    });
  };
  const handleDelete = (idi) => {
    // console.log(idi);
    deleteIntroduce(idi).then(() => {
      alert('삭제가 완료되었습니다.');
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
    setWhether(true);
  };
  const updateChange2 = (e) => {
    setStory_input(e.target.value);
  };
  const close = () => {
    setShowModal(false);
    setPicture_input('');
    setFile_input(null);
    setWhether(false);
  };

  const handleUpdateStory = (idi) => {
    updateStory(story_input, idi).then(() => {
      alert('수정이 완료되었습니다.');
      setShowModal(false);
      setPicture_input('');
      setFile_input(null);
      setWhether(false);
      viewIntroduce();
    });
  };

  return (
    <div className='sectionGlass introduce__article'>
      <div className='introduce__article--header'>
        <h4>{manager_name}</h4>
      </div>
      <div className='introduce__article--img-box'>
        {/* <img className='width-inherit' src={picture} /> */}
        {/* 웹 올릴때 밑에 거*/}
        <img src={'/api/' + picture} />
      </div>
      <div className='introduce__article--text-box'>
        <p>{story}</p>
      </div>
      {loginWhether == 2 ? (
        ''
      ) : loginWhether == 1 ? (
        ''
      ) : (
        <Col>
          <Button
            className='btn-primary'
            variant='secondary'
            onClick={modalOnClick}
          >
            수정하기
          </Button>
          <Modal show={showModal} size='lg' onHide={() => setShowModal(false)}>
            {/* <Modal show={true} className=''> */}
            <h2 className='text-center'>{manager_name}</h2>
            <div className='py-3 text-center'>
              {/* <img className='width-inherit' src={picture} /> */}
              {/* 웹 올릴때  밑에 거*/}
              <img className='w-100' src={'/api/' + picture} />
            </div>
            <Row>
              <Col xs={1} className='input_tit'>
                <h5>사진</h5>
              </Col>
              <Col xs={11}>
                <Form.Control
                  type='file'
                  onChange={updateChange1}
                  accept='image/*'
                  className='w-100 '
                ></Form.Control>
              </Col>
            </Row>
            <Row className='my-2'>
              <Col xs={1} className='mt-1'>
                <h5>내용</h5>
              </Col>
              <Col xs={11}>
                <Form.Control
                  value={story_input}
                  onChange={updateChange2}
                  type='text'
                  as='textarea'
                  rows={5}
                ></Form.Control>
              </Col>
            </Row>
            <Col xs={12} className='text-danger text-end mt-3'>
              <span className='m-2'>
                삭제시 되돌릴 수 없습니다 한번 더 확인해주세요
              </span>
              <Button
                onClick={() =>
                  confirm('정말 삭제하시겠습니까?') == true
                    ? handleDelete(idi)
                    : alert('삭제가 취소 되었습니다.')
                }
                variant='outline-danger'
              >
                삭제
              </Button>
            </Col>
            <Row className='d-flex justify-content-center mt-3'>
              <Button
                className='btn-primary-dark mx-2'
                onClick={close}
                variant='secondary'
              >
                닫기
              </Button>
              {whether ? (
                <Button className='mx-2' onClick={() => handleUpdate(idi)}>
                  수정하기
                </Button>
              ) : (
                <Button className='mx-2' onClick={() => handleUpdateStory(idi)}>
                  수정하기
                </Button>
              )}
            </Row>
          </Modal>
        </Col>
      )}
    </div>
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
  linkAdd = () => {
    if (this.state.viewIntroduceList.length === 0) {
      this.props.history.push('/introduceAdd'),
        alert('등록된 센터소개가 없습니다. 센터소개를 등록해주세요');
    }
  };
  linkHome = () => {
    if (this.state.viewIntroduceList.length === 0) {
      this.props.history.push('/home'), alert('등록된 센터소개가 없습니다.');
    }
  };
  viewIntroduce = () => {
    selectClientReservation(
      this.props.userinfo.joinNo ? this.props.userinfo.joinNo : ''
    ).then((clientResult) => {
      selectTrainerReservation(
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
          this.setState({ viewIntroduceList: items.reverse() });
          !this.props.userinfo.loginWhether ? this.linkAdd() : this.linkHome();
        });
      });
    });
  };

  render() {
    // console.log(this.state.viewIntroduceList);
    return (
      <div className='wrap introduce'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
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
                  <Link to='/introduceAdd'>센터 소개 등록</Link>
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
          <Row>
            <Col>
              <h3>센터명</h3>
            </Col>
            <Col>
              <div className='text-end'>
                <Link to='/introduceAdd'>
                  <Button variant='outline-primary'>센터소개 등록</Button>
                </Link>
              </div>
            </Col>
          </Row>
          {this.state.viewIntroduceList.length === 0 ? (
            '센터소개가 없습니다.'
          ) : (
            <div>{this.state.viewIntroduceList}</div>
          )}
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
