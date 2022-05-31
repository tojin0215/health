import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import MegaMenu from '../../component/navigation/Menu';
import { connect } from 'react-redux';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Dropdown from 'react-dropdown';
import '../../styles/admin/Admin.css';
import 'react-dropdown/style.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { getStatusRequest } from '../../action/authentication';

import { SERVER_URL } from '../../const/settings';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

const options = ['헬스장이름', '대표 이름', '아이디', '전화번호'];
const defaultOption = options[0];

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      pwd: '',
      fitness_name: '',
      fitness_addr: '',
      manager_name: '',
      phone: '',
      business_number: '',
      business_phone: '',

      id_err: false,
      pwd_err: false,
      fitness_name_err: false,
      fitness_addr_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number_err: false,
      business_phone_err: false,

      open: false,
      fitnessList: [],
      search: '',
      item: options[0],

      check: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.cusFetch();
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
      }
    });
  }

  cusFetch = () => {
    let url = ip + '/manager?type=all';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        let arr1 = [];
        for (let i = res.length - 1; i >= 0; i--) {
          let phone =
            res[i].phone.substring(0, 3) +
            '-' +
            res[i].phone.substring(3, 7) +
            '-' +
            res[i].phone.substring(7, 11);
          let business_phone =
            res[i].business_phone.substring(0, 3) +
            '-' +
            res[i].business_phone.substring(3, 7) +
            '-' +
            res[i].business_phone.substring(7, 11);
          arr1.push({
            no: res[i].fitness_no,
            id: res[i].id,
            fitness_name: res[i].fitness_name,
            manager_name: res[i].manager_name,
            phone: phone,
            business_number: res[i].business_number,
            business_phone: business_phone,
            permit: res[i].permit,
          });
        }
        this.setState({
          fitnessList: arr1,
        });
      });
  };

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  idCheck = () => {
    //alert(this.state.id)
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
          alert('사용가능합니다.');
          this.setState({
            check: 1,
          });
        } else {
          alert('존재하는 아이디입니다. 다시 입력해주세요.');
          this.setState({
            check: 0,
            id: '',
          });
        }
      });
  };

  handleOnClick = (e) => {
    this.setState({
      id_err: false,
      pwd_err: false,
      fitness_name_err: false,
      fitness_addr_err: false,
      manager_name_err: false,
      phone_err: false,
      business_number: false,
      business_phone: false,
    });

    if (this.state.id === '') {
      this.setState({ id_err: true });
    }
    if (this.state.pwd === '') {
      this.setState({ pwd_err: true });
    }
    if (this.state.fitness_name === '') {
      this.setState({ fitness_name_err: true });
    }
    if (this.state.fitness_addr === '') {
      this.setState({ fitness_addr_err: true });
    }
    if (this.state.manager_name === '') {
      this.setState({ manager_name_err: true });
    }
    if (this.state.phone === '') {
      this.setState({ phone_err: true });
    }
    if (this.state.business_number === '') {
      this.setState({ business_number_err: true });
    }
    if (this.state.business_phone === '') {
      this.setState({ business_phone_err: true });
    }
    if (
      this.state.id === '' ||
      this.state.pwd === '' ||
      this.state.fitness_name === '' ||
      this.state.fitness_addr === '' ||
      this.state.manager_name === '' ||
      this.state.phone === '' ||
      this.state.business_number === '' ||
      this.state.business_phone === ''
    ) {
      alert('빈칸을 채워주세요.');
    } else {
      // 서버 연결하는 부분
      fetch(ip + '/manager', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.state.id,
          password: this.state.pwd,
          fitness_name: this.state.fitness_name,
          fitness_addr: this.state.fitness_addr,
          manager_name: this.state.fitness_name,
          phone: this.state.phone,
          business_number: this.state.business_number,
          business_phone: this.state.business_phone,
          permit: 0,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          alert('등록되었습니다.');
          this.setState({
            open: false,
            id: '',
            pwd: '',
            fitness_name: '',
            fitness_addr_err: '',
            manager_name: '',
            phone: '',
            business_number_err: '',
            business_phone_err: '',
          });
          this.cusFetch();
        });
    }
  };
  permitButton(cell, row, enumObject, rowIndex) {
    return row['permit'] == 1 ? (
      'O'
    ) : (
      <button
        type='button'
        onClick={
          () =>
            confirmAlert({
              title: '가입 승인',
              message: row['fitness_name'] + ' 가입 승인 하시겠습니까?',
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => this.register(row['no']),
                },
                {
                  label: 'No',
                  onClick: () => alert('취소되었습니다.'),
                },
              ],
            })
          //this.delete(row['no'])
        }
      >
        승인하기
      </button>
    );
  }

  cellButton(cell, row, enumObject, rowIndex) {
    return (
      <button
        type='button'
        onClick={
          () =>
            confirmAlert({
              title: '삭제 확인',
              message: row['fitness_name'] + ' 삭제하시겠습니까?',
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => this.delete(row['no']),
                },
                {
                  label: 'No',
                  onClick: () => alert('취소되었습니다.'),
                },
              ],
            })
          //this.delete(row['no'])
        }
      >
        삭제{/*  { row['no'] } */}
      </button>
    );
  }

  register = (fn) => {
    fetch(ip + '/manager?fn=' + fn, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        permit: 1,
      }),
    }).then((response) => {
      alert('가입 승인 되었습니다.');
      this.cusFetch();
    });
  };

  delete = (fn) => {
    fetch(ip + '/manager?type=delete&fn=' + fn, {
      method: 'DELETE',
    }).then((response) => {
      alert('삭제되었습니다.');
      this.cusFetch();
    });
  };

  search = () => {
    let it = '0';
    if (this.state.item === '헬스장이름') {
      it = '0';
    } else if (this.state.item === '담당자이름') {
      it = '1';
    } else if (this.state.item === '아이디') {
      it = '2';
    } else if (this.state.item === '전화번호') {
      it = '3';
    }
    fetch(ip + '/manager?type=search' + it + '&search=' + this.state.search, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        let arr1 = [];
        for (let i = res.length - 1; i >= 0; i--) {
          let phone =
            res[i].phone.substring(0, 3) +
            '-' +
            res[i].phone.substring(3, 7) +
            '-' +
            res[i].phone.substring(7, 11);
          let business_phone =
            res[i].business_phone.substring(0, 3) +
            '-' +
            res[i].business_phone.substring(3, 7) +
            '-' +
            res[i].business_phone.substring(7, 11);
          arr1.push({
            no: res[i].fitness_no,
            id: res[i].id,
            fitness_name: res[i].fitness_name,
            manager_name: res[i].manager_name,
            phone: phone,
            business_number: res[i].business_number,
            business_phone: business_phone,
            permit: res[i].permit,
          });
        }
        this.setState({
          fitnessList: arr1,
        });
      });
  };
  selectItem = (e) => {
    if (e.value == '헬스장이름') {
      this.setState({ item: '헬스장이름' });
    } else if (e.value == '담당자이름') {
      this.setState({ item: '담당자이름' });
    } else if (e.value == '아이디') {
      this.setState({ item: '아이디' });
    } else if (e.value == '전화번호') {
      this.setState({ item: '전화번호' });
    }
  };

  render() {
    const { userinfo } = this.props;
    console.log('userinfo : ');
    console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

    const textOptions = {
      noDataText: '등록된 헬스장이 없습니다.',
      alwaysShowAllBtns: true,
      //hideSizePerPage:true
      sizePerPageList: [
        {
          text: '10개씩 보기',
          value: 10,
        },
        {
          text: '50개씩 보기',
          value: 50,
        },
        {
          text: '100개씩 보기',
          value: 100,
        },
      ],
    };

    return (
      <div className='admin'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <MegaMenu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>관리자페이지</h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/statistics'>관리자</Link>
              </div>
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <div className='container'>
          <div>
            <button type='button' onClick={this.handleClickOpen}>
              센터 추가하기
            </button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              maxWidth='lg'
            >
              <DialogTitle>추가하기</DialogTitle>
              <DialogContent>
                <form className='formAddCustomer formAddAdmin'>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.id}
                      onChange={this.handleChange}
                      id='id'
                      label='아이디'
                      error={this.state.id_err}
                      required
                      autoFocus
                    />
                  </label>
                  {/*.customerName */}
                  <label>
                    <TextField
                      variant='outlined'
                      type='password'
                      value={this.state.pwd}
                      onChange={this.handleChange}
                      id='pwd'
                      label='비밀번호'
                      error={this.state.pwd_err}
                      required
                    />
                  </label>
                  <button
                    className='btnSolid'
                    type='button'
                    onClick={this.idCheck}
                  >
                    아이디 중복체크
                  </button>
                  {this.state.check == 0 ? (
                    <label></label>
                  ) : (
                    <label>사용가능한 아이디입니다.</label>
                  )}
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.fitness_name}
                      onChange={this.handleChange}
                      id='fitness_name'
                      label='센터 이름'
                      error={this.state.fitness_name_err}
                      required
                    />
                  </label>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.fitness_addr}
                      onChange={this.handleChange}
                      id='fitness_addr'
                      label='센터 주소'
                      error={this.state.fitness_addr_err}
                      required
                    />
                  </label>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.manager_name}
                      onChange={this.handleChange}
                      id='manager_name'
                      label='대표 이름'
                      error={this.state.manager_name_err}
                      required
                    />
                  </label>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.phone}
                      onChange={this.handleChange}
                      id='phone'
                      label='대표 연락처'
                      error={this.state.phone_err}
                      required
                    />
                  </label>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.business_number}
                      onChange={this.handleChange}
                      id='business_number'
                      label='사업자 등록번호'
                      error={this.state.business_number_err}
                      required
                    />
                  </label>
                  <label>
                    <TextField
                      variant='outlined'
                      value={this.state.business_phone}
                      onChange={this.handleChange}
                      id='business_phone'
                      label='사업장 연락처(-제외)'
                      error={this.state.business_phone_err}
                      required
                    />
                  </label>
                </form>
                {/*.formAddCustomer */}
              </DialogContent>
              <DialogActions>
                <button type='button' onClick={this.handleOnClick}>
                  등록하기
                </button>
                <button type='button' onClick={this.handleClose}>
                  닫기
                </button>
              </DialogActions>
            </Dialog>
          </div>

          <div className='SearchInput'>
            <div className='SearchInputIn'>
              <Dropdown
                className='searchDrop'
                options={options}
                onChange={this.selectItem}
                value={this.state.item}
                placeholder='Select an option'
              />
              <input
                type='text'
                id='search'
                checked={this.state.search}
                onChange={this.handleChange}
              />
              <button className='btnSolid' type='button' onClick={this.search}>
                검색
              </button>
            </div>
          </div>

          <div>
            <BootstrapTable
              data={this.state.fitnessList}
              options={textOptions}
              pagination={this.state.fitnessList.length > 1}
              tableHeaderClass='tableHeader'
              tableContainerClass='tableContainer'
            >
              <TableHeaderColumn
                dataField='no'
                thStyle={{ textAlign: 'center', width: '35px' }}
                tdStyle={{ textAlign: 'center', width: '35px' }}
                isKey
              >
                no
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='id'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                아이디
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='fitness_name'
                thStyle={{ textAlign: 'center', width: '100px' }}
                tdStyle={{ textAlign: 'center', width: '100px' }}
              >
                센터 이름
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='manager_name'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                대표 이름
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='phone'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                대표 연락처
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='business_number'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                사업자등록번호
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='business_phone'
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                사업장연락처
              </TableHeaderColumn>
              <TableHeaderColumn
                dataField='permit'
                dataFormat={this.permitButton.bind(this)}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                승인
              </TableHeaderColumn>

              <TableHeaderColumn
                dataField='button'
                dataFormat={this.cellButton.bind(this)}
                thStyle={{ textAlign: 'center' }}
                tdStyle={{ textAlign: 'center' }}
              >
                삭제
              </TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
        <div className='footer'>
          <Footer />
        </div>
        {/*.footer */}
      </div>
    );
  }
}

const AdminStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AdminDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(AdminStateToProps, AdminDispatchToProps)(Admin);
