import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-dropdown';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { getStatusRequest } from '../../action/authentication';
import '../../styles/setting/addExercise.css';

import { SERVER_URL } from '../../const/settings';
import { getExercise } from '../../const/utils';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');
const options = ['이름', '운동기구', '운동부위'];
const defaultOption = options[0];

class AddExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      exerciseListLoaded: false,

      search: '',
      item: options[0],

      fitness_no: this.props.userinfo.fitness_no,
      name: '',
      part: 0,
      machine: '',
      url: '',
      default_data_type: 1,
      default_data: '',
      default_rest_second: -0,
      default_set_count: -0,
      is_default: false,
    };
    this.handleOnClick = this.handleOnClick.bind(this);
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
      } else {
        this.cusFetch();
      }
    });
  }

  handleOnClick() {
    alert('운동이 저장되었습니다.');
    this.setState({
      open: false,
    });
  }

  handleChange = (e) => {
    let v;
    if (e.target.name === 'part') {
      if (e.target.checked) {
        this.setState({
          [e.target.name]:
            JSON.parse(JSON.stringify({ data: Number(this.state.part) }))[
              'data'
            ] + Number(e.target.value),
        });
      } else {
        this.setState({
          [e.target.name]:
            JSON.parse(JSON.stringify({ data: Number(this.state.part) }))[
              'data'
            ] - Number(e.target.value),
        });
      }
    } else if (e.target.name === 'default_set_count') {
      if (/^\d+$/.test(e.target.value)) {
        this.setState({ [e.target.name]: Number(e.target.value) });
      } else {
        if (e.target.value === '') {
          this.setState({ [e.target.name]: '' });
          return;
        }
        alert(e.target.value + '는 숫자가 아닙니다.');
        e.target.value = '';
      }
    } else if (e.target.name === 'default_data') {
      if (/^\d+$/.test(e.target.value)) {
        this.setState({ [e.target.name]: Number(e.target.value) });
      } else {
        if (e.target.value === '') {
          this.setState({ [e.target.name]: '' });
          return;
        }
        alert(e.target.value + '는 숫자가 아닙니다.');
        e.target.value = '';
      }
    } else if (e.target.name === 'default_rest_second') {
      if (/^\d+$/.test(e.target.value)) {
        this.setState({ [e.target.name]: Number(e.target.value) });
      } else {
        if (e.target.value === '') {
          this.setState({ [e.target.name]: '' });
          return;
        }
        alert(e.target.value + '는 숫자가 아닙니다.');
        e.target.value = '';
      }
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  cusFetch = () => {
    // this.setState(fitness_no => ({ exerciseList: getExercise(fitness_no) }))
    // this.state.exerciseList = getExercise(this.state.fitness_no);
    // this.setState({ exerciseList: getExercise(this.state.fitness_no) });
    getExercise((arr) => {
      this.setState({ exerciseList: arr });
    }, this.state.fitness_no);
    // let it = '';
    // let search = '';
    // //customer 참고해서 검색기능 넣기

    // fetch(
    //
    //         ip +
    //         '/exercise?type=search' +
    //         it +
    //         '&search=' +
    //         search +
    //         '&fn=' +
    //         this.props.userinfo.fitness_no,
    //     {
    //         method: 'GET',
    //         headers: {
    //             'Content-type': 'application/json',
    //         },
    //     }
    // )
    //     .then((response) => response.json())
    //     .then((res) => {
    //         console.log(res);
    //         let arr = [];
    //         for (let i = res.length - 1; i >= 0; i--) {
    //             let part = ', ';
    //             let part_num = Number(res[i].part);
    //             console.log(part_num);
    //             if (part_num === 32) {
    //                 part = '기타, ' + part;
    //                 part_num = 0;
    //             }
    //             if (part_num >= 16) {
    //                 part = '유산소, ' + part;
    //                 part_num = part_num - 16;
    //             }
    //             if (part_num >= 8) {
    //                 part = '코어, ' + part;
    //                 part_num = part_num - 8;
    //             }
    //             if (part_num >= 4) {
    //                 part = '전신, ' + part;
    //                 part_num = part_num - 4;
    //             }
    //             if (part_num >= 2) {
    //                 part = '하체, ' + part;
    //                 part_num = part_num - 2;
    //             }
    //             if (part_num === 1) {
    //                 part = '상체, ' + part;
    //             }
    //             part = part.slice(0, -2);

    //             arr.push({
    //                 no: res[i].exercise_no,
    //                 name: res[i].name,
    //                 tool: res[i].machine,
    //                 aa: part,
    //                 set: res[i].default_set_count,
    //                 bb: res[i].default_data,
    //                 cc: res[i].default_rest_second,
    //                 link: res[i].url,
    //             });
    //         }
    //         this.setState({ exerciseList: arr });
    //     });
  };

  search = () => {
    let it = '0';
    if (this.state.item === '이름') {
      it = '0';
    } else if (this.state.item === '운동기구') {
      it = '1';
    } else if (this.state.item === '운동부위') {
      it = '2';
    }
    //customer 참고해서 검색기능 넣기

    let search = this.state.search;
    if (it === '2') {
      let v = 0;
      if (/상체/.test(this.state.search)) {
        search = search.replace('상체', '');
        v = v + 1;
      }
      if (/하체/.test(this.state.search)) {
        search = search.replace('하체', '');
        v = v + 2;
      }
      if (/전신/.test(this.state.search)) {
        search = search.replace('전신', '');
        v = v + 4;
      }
      if (/코어/.test(this.state.search)) {
        search = search.replace('코어', '');
        v = v + 8;
      }
      if (/유산소/.test(this.state.search)) {
        search = search.replace('유산소', '');
        v = v + 16;
      }
      if (/기타/.test(this.state.search)) {
        search = search.replace('기타', '');
        v = 32;
      }

      if (v === 0) {
        alert('부위를 입력바랍니다.');
        return;
      }
      search = v;
    }

    fetch(
      ip +
        '/exercise?type=search' +
        it +
        '&search=' +
        search +
        '&fn=' +
        this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        let arr = [];
        for (let i = res.length - 1; i >= 0; i--) {
          let part = ', ';
          let part_num = Number(res[i].part);
          console.log(part_num);
          if (part_num == 32) {
            part = '기타, ' + part;
            part_num = 0;
          }
          if (part_num >= 16) {
            part = '유산소, ' + part;
            part_num = part_num - 16;
          }
          if (part_num >= 8) {
            part = '코어, ' + part;
            part_num = part_num - 8;
          }
          if (part_num >= 4) {
            part = '전신, ' + part;
            part_num = part_num - 4;
          }
          if (part_num >= 2) {
            part = '하체, ' + part;
            part_num = part_num - 2;
          }
          if (part_num === 1) {
            part = '상체, ' + part;
          }
          part = part.slice(0, -2);

          arr.push({
            no: res[i].exercise_no,
            name: res[i].name,
            tool: res[i].machine,
            aa: part,
            set: res[i].default_set_count,
            bb: res[i].default_data,
            cc: res[i].default_rest_second,
            link: res[i].url,
          });
        }
        this.setState({ exerciseList: arr });
      })
      .catch((err) => console.error(err));
  };
  selectItem = (e) => {
    if (e.value == '이름') {
      this.setState({ item: '이름' });
    } else if (e.value == '운동기구') {
      this.setState({ item: '운동기구' });
    } else if (e.value == '운동부위') {
      this.setState({ item: '운동부위' });
    }
  };

  AddExercise = () => {
    // 기본 데이터 입력 확인
    if (!this.state.name) {
      alert('이름을 입력하세요.');
      return;
    }
    if (!this.state.part) {
      alert('운동 부위를 선택하세요.');
      return;
    }
    if (!this.state.machine) {
      alert('운동 기구를 입력하세요.');
      return;
    }
    if (!this.state.url) {
      this.setState({ url: '' });
    }
    if (!this.state.default_data_type) {
      this.setState({ default_data_type: 1 });
    }
    if (!this.state.default_data) {
      alert('기본 횟수를 입력하세요.');
      return;
    }
    if (!this.state.default_rest_second) {
      alert('쉬는 시간를 입력하세요.');
      return;
    }
    if (!this.state.default_set_count) {
      alert('세트 횟수를 입력하세요.');
      return;
    }
    if (!this.state.is_default) {
      this.setState({ is_default: false });
    }

    // 사용자 정보 확인
    const userinfo = {
      member_no: this.props.userinfo.member_no,
      manager_name: this.props.userinfo.manager_name,
      fitness_no: this.props.userinfo.fitness_no,
    };
    // if (this.props.userinfo !== undefined) {
    //     userinfo['member_no'] = this.props.userinfo.member_no;
    //     userinfo['manager_name'] = this.props.userinfo.manager_name;
    //     userinfo['fitness_no'] = this.props.userinfo.fitness_no;
    //     userinfo['fitness_name'] = this.props.userinfo.fitness_name;
    // } else {
    //     alert('DEBUG');
    // }

    const url = ip + '/exercise';
    const body = {
      fitness_no: userinfo.fitness_no,

      name: this.state.name, // 운동 이름
      part: this.state.part, // 운동 부위
      machine: this.state.machine, // 운동 기구
      url: this.state.url, // 운동 링크
      default_data_type: this.state.default_data_type, // 기본 운동 데이터 타입
      default_data: this.state.default_data, // 기본 값
      default_rest_second: this.state.default_rest_second, // 쉬는 시간(초)
      default_set_count: this.state.default_set_count, // 세트 횟수
      is_default: this.state.is_default, // 기본값인가?
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        res.json();
      })
      .then((res) => {
        this.iptName.value = '';
        this.chkPartTop.checked = false;
        this.chkPartBottom.checked = false;
        this.chkPartAllbody.checked = false;
        this.chkPartCore.checked = false;
        this.chkPartOxy.checked = false;
        this.iptMachine.value = '';
        this.iptUrl.value = '';
        this.iptDD.value = '';
        this.iptDRS.value = '';
        this.iptDSC.value = '';

        this.cusFetch();
        alert('운동 등록됨');
        // this.search();
      })
      .catch((err) => {
        alert(err);
      });

    return;
    // if (this.state.name === '') {
    //     alert('이름이 없습니다');
    //     return;
    // } else if (this.state.part === 0) {
    //     alert('운동 부위가 선택되지 않았습니다');
    //     return;
    // } else if (this.state.machine === '') {
    //     alert('운동 기구가 없습니다');
    //     return;
    // } else if (this.state.url === '') this.setState({ url: '' });
    // else if (this.state.default_data_type === '')
    //     this.setState({ default_data_type: 1 });
    // else if (this.state.default_data === '') {
    //     alert('운동 기본 횟수가 없습니다');
    //     return;
    // } else if (this.state.default_rest_second === '') {
    //     alert('쉬는 시간이 없습니다');
    //     return;
    // } else if (this.state.default_set_count === '') {
    //     alert('운동 세트 횟수가 없습니다');
    //     return;
    // } else if (this.state.is_default === undefined)
    //     this.setState({ is_default: false });
    if (true) {
    } else {
      const userinfo = {
        member_no: -1,
        manager_name: '',
        fitness_no: -1,
      };
      if (this.props.userinfo !== undefined) {
        userinfo['member_no'] = this.props.userinfo.member_no;
        userinfo['manager_name'] = this.props.userinfo.manager_name;
        userinfo['fitness_no'] = this.props.userinfo.fitness_no;
      } else {
        alert('DEBUG');
      }

      fetch(ip + '/exercise', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          fitness_no: userinfo.fitness_no,

          name: this.state.name, // 운동 이름
          part: this.state.part, // 운동 부위
          machine: this.state.machine, // 운동 기구
          url: this.state.url, // 운동 링크
          default_data_type: this.state.default_data_type, // 기본 운동 데이터 타입
          default_data: this.state.default_data, // 기본 값
          default_rest_second: this.state.default_rest_second, // 쉬는 시간(초)
          default_set_count: this.state.default_set_count, // 세트 횟수
          is_default: this.state.is_default, // 기본값인가?
        }),
      })
        .then((res) => {
          res.json();
        })
        .then((res) => {
          this.iptName.value = '';
          this.chkPartTop.checked = false;
          this.chkPartBottom.checked = false;
          this.chkPartAllbody.checked = false;
          this.chkPartCore.checked = false;
          this.chkPartOxy.checked = false;
          this.iptMachine.value = '';
          this.iptUrl.value = '';
          this.iptDD.value = '';
          this.iptDRS.value = '';
          this.iptDSC.value = '';

          this.cusFetch();
          alert('운동 등록되었습니다.');
          // this.search();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      console.log(e);
      this.AddExercise();
    }
  };

  iptName = null;
  chkPartTop = null;
  chkPartBottom = null;
  chkPartAllbody = null;
  chkPartCore = null;
  chkPartOxy = null;
  iptMachine = null;
  iptUrl = null;
  iptDD = null;
  iptDRS = null;
  iptDSC = null;

  render() {
    const { userinfo } = this.props;

    const options1 = {
      noDataText: '등록된 운동이 없습니다.',
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
      sizePerPage: 5,
    };

    return (
      <div className='addExercise'>
        <header className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                운동 설정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/exercise'>운동 설정</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        {/*.header */}
        <div className='wrap container'>
          {/* <NavLink exact to='/exercise'>[운동 추가]</NavLink>
                <NavLink exact to='/setting/default'>[운동 기본묶음 설정]</NavLink> */}
          <section className='settingInfoInput sectionGlass'>
            <h6>
              <div className='circle'></div>
              운동 정보 입력
            </h6>
            <article className='wayDefault waySub'>
              <Link to='/setting/default'>
                <button type='button'>운동 묶음 설정</button>
              </Link>
            </article>
            <form>
              <div className='input-row'>
                <label className='label-description'>운동 이름</label>
                {/*.label-description */}
                <input
                  id='name'
                  type='text'
                  placeholder='name'
                  name='name'
                  ref={(ref) => {
                    this.iptName = ref;
                  }}
                  onChange={this.handleChange}
                />
                {/*#name */}
              </div>
              {/*.input-row */}
              <div className='input-row'>
                <label className='label-description'>운동 기구</label>
                {/*.label-description */}
                <input
                  id='tool'
                  type='text'
                  placeholder='machine'
                  name='machine'
                  ref={(ref) => {
                    this.iptMachine = ref;
                  }}
                  onChange={this.handleChange}
                />
                {/*#tool */}
              </div>
              {/*.input-row */}
              <div className='input-row exercisePart'>
                <label className='label-description'>부위</label>
                {/*.label-description */}
                <div className='part'>
                  <label>
                    <input
                      type='checkBox'
                      value='1'
                      name='part'
                      ref={(ref) => {
                        this.chkPartTop = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    상체
                  </label>
                  <label>
                    <input
                      type='checkBox'
                      value='2'
                      name='part'
                      ref={(ref) => {
                        this.chkPartBottom = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    하체
                  </label>
                  <label>
                    <input
                      type='checkBox'
                      value='4'
                      name='part'
                      ref={(ref) => {
                        this.chkPartAllbody = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    전신
                  </label>
                  <label>
                    <input
                      type='checkBox'
                      value='8'
                      name='part'
                      ref={(ref) => {
                        this.chkPartCore = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    코어
                  </label>
                  <label>
                    <input
                      type='checkBox'
                      value='16'
                      name='part'
                      ref={(ref) => {
                        this.chkPartOxy = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    유산소
                  </label>
                  <label>
                    <input
                      type='checkBox'
                      value='32'
                      name='part'
                      ref={(ref) => {
                        this.chkPartOxy = ref;
                      }}
                      onChange={this.handleChange}
                    />
                    기타
                  </label>
                </div>
                {/*.part */}
              </div>
              {/*.input-row */}
              <div className='input-row'>
                <label className='label-description'>영상 링크</label>
                <input
                  id='link'
                  type='text'
                  placeholder='link'
                  name='url'
                  ref={(ref) => {
                    this.iptUrl = ref;
                  }}
                  onChange={this.handleChange}
                />
              </div>
              {/*.input-row */}
              <div className='input-row settingRoutin'>
                <label className='label-description'>기본 세트 설정</label>
                <div>
                  <label className='inputColumn'>
                    <p>횟수</p>
                    <input
                      id='횟수'
                      type='number'
                      placeholder='횟수'
                      name='default_data'
                      ref={(ref) => {
                        this.iptDD = ref;
                      }}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label className='inputColumn'>
                    <p>휴식시간</p>
                    <input
                      id='휴식시간'
                      type='number'
                      placeholder='휴식시간'
                      name='default_rest_second'
                      ref={(ref) => {
                        this.iptDRS = ref;
                      }}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label className='inputColumn'>
                    <p>세트</p>
                    <input
                      id='세트'
                      type='number'
                      placeholder='세트'
                      name='default_set_count'
                      ref={(ref) => {
                        this.iptDSC = ref;
                      }}
                      onChange={this.handleChange}
                    />
                  </label>
                </div>
              </div>
              {/*.input-row */}
              <button
                className='btnSolid'
                type='button'
                onClick={this.AddExercise}
              >
                저장하기
              </button>
            </form>
          </section>
          {/*.settingInfoInput */}
          <section className='settingExerciseList sectionGlass'>
            <h6>
              <div className='circle'></div>
              운동 목록
            </h6>
            <div className='searchInputRow'>
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
                name='search'
                checked={this.state.search}
                onChange={this.handleChange}
              />
              <button type='button' onClick={this.search}>
                운동 검색
              </button>
            </div>
            <div className='tablewrap'>
              <BootstrapTable
                data={this.state.exerciseList}
                hover
                pagination={this.state.exerciseList.length > 1}
                options={options1}
                tableHeaderClass='tableHeader'
                tableContainerClass='tableContainer'
                className='table2'
              >
                <TableHeaderColumn
                  dataField='no'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                  isKey
                >
                  번호
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='name'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  운동이름
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='tool'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  운동도구
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='aa'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  운동부위
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='set'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  세트
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='bb'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  횟수
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='cc'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  휴식시간
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField='link'
                  thStyle={{ textAlign: 'center' }}
                  tdStyle={{ textAlign: 'center' }}
                >
                  링크
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </section>
        </div>
        {/*.container */}
        <footer className='footer'>
          <Footer />
        </footer>
        {/*.footer */}
      </div>
    );
  }
}

const AddExerciseStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AddExerciseDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  AddExerciseStateToProps,
  AddExerciseDispatchToProps
)(AddExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고
