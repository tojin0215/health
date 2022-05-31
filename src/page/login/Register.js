import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import NumberFormat from 'react-number-format';

import TextField from '@mui/material/TextField';

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';
import '../../styles/login/Register.css';
import { Modal, NavItem } from 'react-bootstrap';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

const IdCheck = RegExp(/^[A-Za-z0-9_\-]{3,20}$/);

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      password_confirm: '',
      manager_name: '',
      phone: '',
      business_number: '',
      business_phone: '',

      id_err: false,
      password_err: false,
      password_confirm_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number_err: false,
      business_phone_err: false,

      check: 0,
      modalShow: false,
      agreeCheck: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  idCheck = () => {
    //alert(this.state.id)
    if (this.state.id === '') {
      alert('아이디를 입력해주세요.');
    } else {
      let url = ip + '/manager?type=idCheck&id=' + this.state.id;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          //console.log(response.length)
          if (response.length == 0) {
            if (IdCheck.test(this.state.id)) {
              alert('사용가능합니다.');
              this.setState({
                check: 1,
              });
            } else {
              alert('아이디는 3~20자 이내의 영문 숫자만 가능합니다. ');
            }
          } else {
            alert('존재하는 아이디입니다. 다시 입력해주세요.');
            this.setState({
              check: 0,
              id: '',
            });
          }
        });
    }
  };

  handleOnClick = (e) => {
    this.setState({
      id_err: false,
      password_err: false,
      password_confirm_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number_err: false,
      business_phone_err: false,
    });

    if (this.state.id === '') {
      this.setState({ id_err: true });
    } else if (this.state.password === '') {
      this.setState({ password_err: true });
    } else if (this.state.password_confirm === '') {
      this.setState({ password_confirmm_err: true });
    } else if (this.state.manager_name === '') {
      this.setState({ manager_name_err: true });
    } else if (this.state.phone === '') {
      this.setState({ phone_err: true });
    } else if (this.state.business_number === '') {
      this.setState({ business_number_err: true });
    } else if (this.state.business_phone === '') {
      this.setState({ business_phone_err: true });
    }

    if (
      this.state.id === '' ||
      this.state.password === '' ||
      this.state.password_confirm === '' ||
      this.state.manager_name === '' ||
      this.state.phone === '' ||
      this.state.business_number === '' ||
      this.state.business_phone === ''
    ) {
      alert('빈칸을 채워주세요.');
    } else if (this.state.password != this.state.password_confirm) {
      alert('비밀번호가 다릅니다. 다시 입력해주세요.');
    } else if (this.state.check == 0) {
      alert('아이디 중복체크 해주세요.');
    } else {
      // 서버 연결하는 부분
      fetch(ip + '/manager', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.id,
          password: this.state.password,
          manager_name: this.state.manager_name,
          phone: this.state.phone,
          business_number: this.state.business_number,
          business_phone: this.state.business_phone,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          alert('가입되었습니다.');
          this.setState({
            open: false,
            id: '',
            password: '',
            manager_name: '',
            phone: '',
            business_number_err: '',
            business_phone_err: '',
          });
          this.props.history.push('/');
        });
    }
  };
  handleModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  agreeCheckModal = () => {
    this.setState({
      agreeCheck: true,
      modalShow: false,
    });
  };
  render() {
    const { userinfo } = this.props;
    // console.log("userinfo : ");
    // console.log(userinfo);
    console.log(this.state.agreeCheck);
    return (
      <div className='wrap loginWrap register'>
        {/* <div className='header d-none'>
					<Header />
					<Navigation />
				</div> */}
        <div className='localNavigation'>
          <div className='container'>
            <h2>
              <div className='parallelogram'></div>
              회원가입
              <span>.</span>
            </h2>
          </div>
        </div>
        <div className='container'>
          <form className='AddSalesForm productPay sectionGlass'>
            {/* <div className='registerId'> */}
            <div
              className='resigterVisual'
              style={{ backgroundImage: 'src/img/resiVisual.jpeg' }}
            ></div>
            강사, 회원은 사업주가 승인하여야만 회원가입이 가능합니다.
            <ul>
              <li>
                <TextField
                  value={this.state.id}
                  onChange={this.handleChange}
                  id='id'
                  label='아이디/센터이름'
                  error={this.state.id_err}
                  required
                  autoFocus
                />
              </li>
              <li className='overlapCheck'>
                <button
                  className='btnSolid'
                  type='button'
                  onClick={this.idCheck}
                >
                  중복확인
                </button>
                {this.state.check == 0 ? (
                  <label></label>
                ) : (
                  <label>사용가능한 아이디입니다.</label>
                )}
              </li>
              <li>
                <TextField
                  value={this.state.password}
                  onChange={this.handleChange}
                  type='password'
                  id='password'
                  label='비밀번호'
                  error={this.state.password_err}
                  required
                />
              </li>
              <li>
                <TextField
                  value={this.state.password_confirm}
                  onChange={this.handleChange}
                  type='password'
                  id='password_confirm'
                  label='비밀번호확인'
                  error={this.state.password_confirm_err}
                  required
                />
              </li>
              <li>
                <TextField
                  value={this.state.manager_name}
                  onChange={this.handleChange}
                  id='manager_name'
                  label='대표 이름'
                  error={this.state.manager_name_err}
                  required
                />
              </li>
              <li>
                <TextField
                  type='number'
                  value={this.state.phone}
                  onChange={this.handleChange}
                  id='phone'
                  label='대표 연락처(-제외)'
                  error={this.state.phone_err}
                  required
                />
              </li>
              <li>
                <TextField
                  value={this.state.business_number}
                  onChange={this.handleChange}
                  id='business_number'
                  label='사업자 등록번호'
                  error={this.state.business_number_err}
                  required
                />
              </li>
              <li>
                <TextField
                  value={this.state.business_phone}
                  onChange={this.handleChange}
                  id='business_phone'
                  label='사업장 연락처(-제외)'
                  error={this.state.business_phone_err}
                  required
                />
              </li>
              <li>
                <div onClick={this.handleModal}>약관</div>
                <Modal show={this.state.modalShow}>
                  <p>피트니스CRM 약관</p>
                  <div>
                    <input
                      type='checkbox'
                      onClick={this.agreeCheckModal}
                    ></input>
                  </div>
                </Modal>
              </li>
            </ul>
            {this.state.agreeCheck ? (
              <button
                className='btnSolid'
                type='button'
                onClick={this.handleOnClick}
              >
                등록하기
              </button>
            ) : (
              <button className='btnSolid' type='button' disabled>
                disabled
              </button>
            )}
          </form>
          {/*.AddSalesForm productPay */}
        </div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    );
  }
}

const RegisterStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    //status: state.authentication.status
  };
};

// const RegisterDispatchToProps = (dispatch) => {
//     return {
//         getStatusRequest: () => {
//             return dispatch(getStatusRequest());
//         },
//     };
// };

export default connect(RegisterStateToProps, null)(Register);
