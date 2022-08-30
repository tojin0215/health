import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import Menu from '../../component/navigation/Menu';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { getStatusRequest } from '../../action/authentication';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../../styles/exercise/AssignExercise.css';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

// import {SERVER_URL} from '../../const/settings';

// const ip = SERVER_URL;
import { SERVER_URL } from '../../const/settings';
// import { url } from 'inspector';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

function onChangeHandler(a, e) {
  [e.target.a] = e.target.value;
}

const options = ['이름', '핸드폰'];
const defaultOption = options[0];

class AssignExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignDefault: [],
      selectedList: [],
      selectedListId: [],
      exerciseList: [],
      member_no: 'ㅁㄴㅇㅁㄴㅇ',
      open: false,
      search: '',
      item: options[0],
      userName: '회원',
      customerList: [],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      select: [],
      select_data: {},
      select_top: [],
      select_top_data: {},
      select_bottom: [],
      select_bottom_data: {},
      select_allbody: [],
      select_allbody_data: {},
      select_core: [],
      select_core_data: {},
      select_oxy: [],
      select_oxy_data: {},
      select_etc: [],
      select_etc_data: {},
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    //this.handleChange = this.handleChange.bind(this);
    // this.prefetchQRLogin();
    this.search();
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

  loadInbody = (member_no) => {
    let url =
      ip +
      '/inbody?type=customer&member_no=' +
      member_no +
      '&fn=' +
      this.props.userinfo.fitness_no;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        for (let i = res.length - 1; i >= 0; i--) {
          this.setState({
            user_height: res[i].height,
            user_weight: res[i].weight,
            user_bodyFat: res[i].bodyFat,
            user_muscleMass: res[i].muscleMass,
          });
          break;
        }
      });
    // alert('선택하셨습니다.' + member_no);
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

  // handleChange=(e)=>{
  //     [e.target.name]=e.target.value
  // }
  beforeSaveCell = (row, cellName, cellValue) => {
    if (
      cellName === 'no' ||
      cellName === 'name' ||
      cellName === 'tool' ||
      cellName === 'aa' ||
      cellName === 'link'
    ) {
      alert('변경할 수 없습니다');
      return false;
    } else if (cellName === 'set' || cellName === 'bb' || cellName === 'cc') {
      if (/\d+/.test(cellValue)) {
      } else {
        alert('숫자만 입력 가능합니다.');
        return false;
      }
    }
  };
  afterSaveCell = (row, cellName, cellValue) => {};

  choiceUser = (e) => {
    // console.log('value', e.target.value);
    let values = e.target.value.split(',');

    this.setState({
      userName: values[0],
      member_no: e.target.id,
      open: false,
    });
    alert('선택하셨습니다.');
    this.loadInbody(e.target.id);
  };

  search = () => {
    let it = '0';
    if (this.state.item === '이름') {
      it = '0';
    } else if (this.state.item === '핸드폰') {
      it = '1';
    }
    fetch(
      ip +
        '/customer?type=search' +
        it +
        '&search=' +
        this.state.search +
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
        let arr = [];
        for (let i = 0; i < res.length; i++) {
          arr.push({
            no: res[i].member_no,
            userName: res[i].name,
            phone: res[i].phone,
          });
        }
        this.setState({ customerList: arr });
      });
  };
  prefetchQRLogin = () => {
    fetch(ip + '/customerenter?fitness_no=' + this.props.userinfo.fitness_no, {
      method: 'GET',
      credential: 'include',
    })
      .then((response) => response.json())
      .then((res) => {
        let arr = [];
        res.forEach((item) => {
          const url =
            ip +
            '/customer?type=select' +
            '&member_no=' +
            item.customer_no +
            '&fn=' +
            this.props.userinfo.fitness_no;

          // console.log('url: ' + url);

          if (arr.includes(item.member_no)) return;
          else arr.push(item.member_no);

          fetch(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
          })
            .then((response) => response.json())
            .then((res) => {
              let cl = [...this.state.customerList];
              cl.push({
                no: res[0].member_no,
                userName: res[0].name,
                phone: res[0].phone,
              });
              this.setState({ customerList: cl });
            });
        });
      });
  };

  selectItem = (e) => {
    if (e.value == '이름') {
      this.setState({ item: '이름' });
    } else if (e.value == '핸드폰') {
      this.setState({ item: '핸드폰' });
    }
  };
  selectHandleOnClick = (e) => {
    let n = e.target.name.split('|')[0]; // assignDefault
    let v = e.target.name.split('|')[1]; // 운동 이름
    if (e.target.checked) {
      this.setState({
        [n]: [...this.state.assignDefault, v],
      });
    } else {
      this.setState({
        [n]: this.state.assignDefault.filter((i) => i !== v),
      });
    }
    // console.log(e.target.checked);
    // console.log(this.state.assignDefault);
    // console.log(v);
  };

  onSelectRow = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select';
    const select_data = 'select_data';

    let selected = this.state.select;
    let selected_data = JSON.parse(JSON.stringify(this.state.select_data));

    const d = {};
    if (isSelected) {
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
    } else {
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
    }
    this.setState(d);
    // console.log(d);
  };

  onSelectRowTop = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_top';
    const select_data = 'select_top_data';

    let selected = this.state.select_top;
    let selected_data = JSON.parse(JSON.stringify(this.state.select_top_data));

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  onSelectRowBottom = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_bottom';
    const select_data = 'select_bottom_data';

    let selected = this.state.select_bottom;
    let selected_data = JSON.parse(
      JSON.stringify(this.state.select_bottom_data)
    );

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  onSelectRowCore = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_core';
    const select_data = 'select_core_data';

    let selected = this.state.select_core;
    let selected_data = JSON.parse(JSON.stringify(this.state.select_core_data));

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  onSelectRowAllbody = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_allbody';
    const select_data = 'select_allbody_data';

    let selected = this.state.select_allbody;
    let selected_data = JSON.parse(
      JSON.stringify(this.state.select_allbody_data)
    );

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  onSelectRowOxy = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_oxy';
    const select_data = 'select_oxy_data';

    let selected = this.state.select_oxy;
    let selected_data = JSON.parse(JSON.stringify(this.state.select_oxy_data));

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  onSelectRowEtc = (row, isSelected, e) => {
    const exercise_no = row['no'];
    const select_name = 'select_etc';
    const select_data = 'select_etc_data';

    let selected = this.state.select_etc;
    let selected_data = JSON.parse(JSON.stringify(this.state.select_etc_data));

    if (isSelected) {
      const d = {};
      selected_data[exercise_no] = row;
      d[select_name] = [...selected, exercise_no];
      d[select_data] = selected_data;
      this.setState(d);
    } else {
      const d = {};
      delete selected_data[exercise_no];
      d[select_name] = selected.filter((i) => i !== exercise_no);
      d[select_data] = selected_data;
      this.setState(d);
    }
  };

  click1 = (e) => {
    //상체
    e.preventDefault();
    this.searchExercise('상체');
    this.setState({
      show1: !this.state.show1,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
    });
  };

  click2 = (e) => {
    //하체
    e.preventDefault();
    this.searchExercise('하체');
    this.setState({
      show2: !this.state.show2,
      show1: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
    });
  };

  click3 = (e) => {
    //전신
    e.preventDefault();
    this.searchExercise('전신');
    this.setState({
      show3: !this.state.show3,
      show1: false,
      show2: false,
      show4: false,
      show5: false,
      show6: false,
    });
  };

  click4 = (e) => {
    //코어
    e.preventDefault();
    this.searchExercise('코어');
    this.setState({
      show4: !this.state.show4,
      show1: false,
      show2: false,
      show3: false,
      show5: false,
      show6: false,
    });
  };

  click5 = (e) => {
    //유산소
    e.preventDefault();
    this.searchExercise('유산소');
    this.setState({
      show5: !this.state.show5,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show6: false,
    });
  };
  click6 = (e) => {
    //기타
    e.preventDefault();
    this.searchExercise('기타');
    this.setState({
      show6: !this.state.show6,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
    });
  };

  parserIsDefault = (ex, part) => {
    let is_default = Number(ex.is_default);
    if (is_default >= 160000) {
      if (part === '유산소') {
        return true;
      } else {
        is_default = is_default - 160000;
      }
    }
    if (is_default >= 8000) {
      if (part === '코어') {
        return true;
      } else {
        is_default = is_default - 8000;
      }
    }
    if (is_default >= 400) {
      if (part === '전신') {
        return true;
      } else {
        is_default = is_default - 400;
      }
    }
    if (is_default >= 20) {
      if (part === '하체') {
        return true;
      } else {
        is_default = is_default - 20;
      }
    }
    if (is_default >= 1) {
      if (part === '상체') {
        return true;
      } else {
        is_default = is_default - 1;
      }
    }
    return false;
  };

  loadExerciseList() {
    let url =
      ip +
      '/assignexercise' +
      '?type=' +
      'member' +
      '&fitness_no=' +
      this.props.userinfo.fitness_no +
      '&member_no=' +
      this.props.userinfo.member_no;

    let inits = {
      methods: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    fetch(url, inits).then((res) => {
      // eslint-disable-next-line no-undef
      last_group_id = res[res.length - 1].group_id;

      let arr = [];
      for (let i = 0; i < res.length; i++) {
        // console.log(res[i]);
        arr.push(res[i]);
        // arr.push({
        //     "no": res[i].member_no,
        //     "name": res[i].name,
        //     "part": res[i].part
        // })
      }
      this.setState({ exerciseList: arr });
    });
  }
  searchExercise = (part) => {
    let it = '2';
    let search = part;
    let v = 0;
    if (/상체/.test(search)) {
      search = search.replace('상체', '');
      v = v + 1;
    }
    if (/하체/.test(search)) {
      search = search.replace('하체', '');
      v = v + 2;
    }
    if (/전신/.test(search)) {
      search = search.replace('전신', '');
      v = v + 4;
    }
    if (/코어/.test(search)) {
      search = search.replace('코어', '');
      v = v + 8;
    }
    if (/유산소/.test(search)) {
      search = search.replace('유산소', '');
      v = v + 16;
    }
    if (/기타/.test(search)) {
      search = search.replace('기타', '');
      v = 32;
    }

    if (v === 0) {
      alert('부위를 입력바랍니다.');
      return;
    }
    search = v;

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
        let arr = [];
        let arr2 = [];

        let arr_top = [];
        let arr_bottom = [];
        let arr_allbody = [];
        let arr_core = [];
        let arr_oxy = [];
        let arr_etc = [];

        let select_top_data = {};
        let select_bottom_data = {};
        let select_allbody_data = {};
        let select_core_data = {};
        let select_oxy_data = {};
        let select_etc_data = {};

        for (let i = res.length - 1; i >= 0; i--) {
          let part = ', ';
          let part_num = Number(res[i].part);

          if (part_num == 32) {
            part = '기타, ' + part;
            part_num = 0;
            if (this.parserIsDefault(res[i], '기타')) {
              arr_etc.push(res[i].exercise_no);
              select_etc_data[res[i].exercise_no] = res[i];
            }
          }
          if (part_num >= 16) {
            part = '유산소, ' + part;
            part_num = part_num - 16;
            if (this.parserIsDefault(res[i], '유산소')) {
              arr_oxy.push(res[i].exercise_no);
              select_oxy_data[res[i].exercise_no] = res[i];
            }
          }
          if (part_num >= 8) {
            part = '코어, ' + part;
            part_num = part_num - 8;
            if (this.parserIsDefault(res[i], '코어')) {
              arr_core.push(res[i].exercise_no);
              select_core_data[res[i].exercise_no] = res[i];
            }
          }
          if (part_num >= 4) {
            part = '전신, ' + part;
            part_num = part_num - 4;
            if (this.parserIsDefault(res[i], '전신')) {
              arr_allbody.push(res[i].exercise_no);
              select_allbody_data[res[i].exercise_no] = res[i];
            }
          }
          if (part_num >= 2) {
            part = '하체, ' + part;
            part_num = part_num - 2;
            if (this.parserIsDefault(res[i], '하체')) {
              arr_bottom.push(res[i].exercise_no);
              select_bottom_data[res[i].exercise_no] = res[i];
            }
          }
          if (part_num === 1) {
            part = '상체, ' + part;
            if (this.parserIsDefault(res[i], '상체')) {
              arr_top.push(res[i].exercise_no);
              select_top_data[res[i].exercise_no] = res[i];
            }
          }
          part = part.slice(0, -2);

          res[i]['no'] = res[i].exercise_no;
          res[i]['tool'] = res[i].machine;
          res[i]['aa'] = part;
          res[i]['set'] = res[i].default_set_count;
          res[i]['bb'] = res[i].default_data;
          res[i]['cc'] = res[i].default_rest_second;
          res[i]['link'] = res[i].url;
          arr.push(res[i]);
          // arr.push({
          //     no: res[i].exercise_no,
          //     name: res[i].name,
          //     tool: res[i].machine,
          //     aa: part,
          //     set: res[i].default_set_count,
          //     bb: res[i].default_data,
          //     cc: res[i].default_rest_second,
          //     link: res[i].url,
          // });
          if (res[i].is_default) {
            arr2.push(res[i].exercise_no);
          }
        }
        arr2.reverse();
        this.setState({
          exerciseList: arr,
          // select_top: arr_top,
          // select_bottom: arr_bottom,
          // select_allbody: arr_allbody,
          // select_core: arr_core,
          // select_oxy: arr_oxy,

          select_top_data: select_top_data,
          select_bottom_data: select_bottom_data,
          select_allbody_data: select_allbody_data,
          select_core_data: select_core_data,
          select_oxy_data: select_oxy_data,
        });
        // this.setState({
        //     selectedListId: arr2,
        //     exerciseList: arr,
        // });

        //   this.setState({
        //     select_top: arr_top,
        //     select_bottom: arr_bottom,
        //     select_allbody: arr_allbody,
        //     select_core: arr_core,
        //     select_oxy: arr_oxy,
        //     selectedListId: arr2,
        //     exerciseList: arr,
        // });
      });
  };

  sendAssign = (last_group_no) => {
    let arr = [];
    let arr2 = [];
    const t = new Array(8);

    if (this.state.assignDefault.length > 0) {
      this.state.assignDefault.forEach((part) => {
        let it = '2';
        let search = part;
        let v = 0;
        if (/상체/.test(search)) {
          search = search.replace('상체', '');
          v = v + 1;
          t[0] = 1;
        }
        if (/하체/.test(search)) {
          search = search.replace('하체', '');
          v = v + 2;
          t[1] = 1;
        }
        if (/전신/.test(search)) {
          search = search.replace('전신', '');
          v = v + 4;
          t[2] = 1;
        }
        if (/코어/.test(search)) {
          search = search.replace('코어', '');
          v = v + 8;
          t[3] = 1;
        }
        if (/유산소/.test(search)) {
          search = search.replace('유산소', '');
          v = v + 16;
          t[4] = 1;
        }
        if (/기타/.test(search)) {
          search = search.replace('기타', '');
          v = v + 16;
          t[5] = 1;
        }

        if (v === 0) {
          console.error('assignDefault:' + part);
          return;
        }
        search = v;

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
            for (let i = res.length - 1; i >= 0; i--) {
              let part = ', ';
              let part_num = Number(res[i].part);
              if (part_num == 32) {
                part = '유산소, ' + part;
                part_num = 32;
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

              if (res[i].is_default) {
                arr.push(res[i]);
                // console.log(res[i]);
              } else {
              }
              if (res[i].is_default) {
                arr2.push(res[i].exercise_no);
              }
            }
            arr2.reverse();
          })
          .then(() => {
            console.error('arr: ' + arr);
            const url =
              ip +
              '/assignexercise' +
              '?type=' +
              'member' +
              '&fitness_no=' +
              this.props.userinfo.fitness_no +
              '&member_no=' +
              this.props.userinfo.member_no;
            arr.forEach((ex) => {
              ex['fitness_no'] = this.props.userinfo.fitness_no;
              ex['member_no'] = this.props.userinfo.member_no;
              ex['last_group_no'] = last_group_no + 1;
              fetch(url, {
                methods: 'GET',
                headers: {
                  'Content-type': 'application/json',
                },
                body: JSON.stringify(ex),
              }).then((response) => {
                // console.log(response);
              });
            });
          });
      });
    } else {
    }
  };

  getCustomerEnterList = () => {
    fetch(
      ip + '/customerenter?' + '&fitness_no=' + this.props.userinfo.fitness_no,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        alert(response);
      })
      .error((error) => alert(error));
  };

  handleOnClick = (e) => {
    //기타
    e.preventDefault();

    this.searchExercise(e.target.value);
    // this.searchExercise('기타');
    let result = {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
    };
    if (e.target.value === '상체') result.show1 = true;
    else if (e.target.value === '하체') result.show2 = true;
    else if (e.target.value === '전신') result.show3 = true;
    else if (e.target.value === '코어') result.show4 = true;
    else if (e.target.value === '유산소') result.show5 = true;
    else if (e.target.value === '기타') result.show6 = true;
    this.setState(result);
    // console.log(e);
    return;
  };

  handleIgnoreClick = (e) => {
    if (!this.state.member_no) alert('회원을 선택하세요.');
  };

  createViewExerciseListButton = () => {
    const exerciseList = ['상체', '하체', '전신', '코어', '유산소', '기타'];
    return exerciseList.map((name, index) => (
      <button
        type='button'
        key={'createViewExerciseListButton.' + index}
        value={name}
        onClick={this.handleOnClick}
      >
        {name}
      </button>
    ));
  };
  createViewDefaultExerciseButton = () => {
    const exerciseList = ['상체', '하체', '전신', '코어', '유산소'];
    // const imagenumber = [
    // 	'url(/src/img/assignUpper.png)',
    // 	'url(/src/img/assignLower.png)',
    // 	'url(/src/img/assignEntire.png)',
    // 	'url(/src/img/assignCore.png)',
    // 	'url(/src/img/assignAerobic.png)',
    // ];
    return exerciseList.map((name, index) => (
      <label>
        <div
          className='imageBox'
          // style={{ backgroundImage: 'url(' + imagenumber + ')' }}
        ></div>
        <input
          type='checkBox'
          name={'assignDefault|' + name}
          key={'createViewDefaultExerciseButton' + index}
          onChange={this.selectHandleOnClick}
          // onClick={this.selectHandleOnClick}
        />
        <p>{name}</p>
      </label>
    ));
  };

  createViewExerciseListTable = () => {
    let exercise_name = '';
    if (this.state.show1) {
      exercise_name = '상체';
    }
    if (this.state.show2) {
      exercise_name = '하체';
    }
    if (this.state.show3) {
      exercise_name = '코어';
    }
    if (this.state.show4) {
      exercise_name = '전신';
    }
    if (this.state.show5) {
      exercise_name = '유산소';
    }
    if (this.state.show6) {
      exercise_name = '기타';
    }

    const options = {
      noDataText: '추가된 운동이 없습니다.',
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
    };

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.select,
      onSelect: this.onSelectRow,
      bgColor: 'mint',
    };
    const cellEdit = {
      mode: 'dbclick', // click cell to edit
      beforeSaveCell: this.beforeSaveCell,
      afterSaveCell: this.afterSaveCell,
    };

    // 사용되지 않으므로 주석처리함
    // const renderTooltip = (props) => (
    //   <Tooltip id='button-tooltip' {...props}>
    //     Simple tooltip
    //   </Tooltip>
    // );

    return (
      <div>
        <h3>{exercise_name} 운동 목록</h3>
        <BootstrapTable
          hover
          data={this.state.exerciseList}
          pagination={this.state.exerciseList.length > 1}
          options={options}
          tableHeaderClass='tableHeader'
          tableContainerClass='tableContainer'
          selectRow={selectRowProp}
          cellEdit={cellEdit}
          className='table2'
        >
          <TableHeaderColumn
            dataField='no'
            thStyle={{ textAlign: 'center' }}
            tdStyle={{ textAlign: 'center' }}
            isKey
          >
            no
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
        {/*.table2 */}
      </div>
    );
  };

  render() {
    // console.log(this.state.userName);
    return (
      <div className='wrap assignExercise'>
        <div className='header'>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu goLogin={this.goLogin} />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                운동 배정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/assign'>운동 배정</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </div>
        {/*.header */}
        <div className='container'>
          <article className='waySub'>
            <Link
              to={{
                pathname: '/assign/inbody',
                state: { member_no: this.state.member_no, a: false },
              }}
            >
              <button className='btnSolid' type='button'>
                고객인바디
              </button>
            </Link>
          </article>
          <section className='customerSearch'>
            <button
              className='btnAssignCusSearch'
              type='button'
              onClick={this.handleClickOpen}
            >
              회원검색
            </button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              maxWidth='lg'
            >
              <DialogTitle>고객 검색</DialogTitle>
              <DialogContent>
                <div className='customerSearch'>
                  <Dropdown
                    className='searchDrop'
                    options={options}
                    onChange={this.selectItem}
                    value={this.state.item}
                    placeholder='Select an option'
                  />
                  {/*.searchDrop */}
                  <input
                    type='text'
                    id='search'
                    checked={this.state.search}
                    onChange={this.handleChange}
                  />
                  {/*#search */}
                  <button type='button' onClick={this.search}>
                    고객 검색
                  </button>
                </div>
                {/*.customerSearch */}
                <Table className='addsalesSearchTable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>번호</TableCell>
                      <TableCell>이름</TableCell>
                      <TableCell>폰번호</TableCell>
                      <TableCell>선택</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.customerList ? (
                      //filteredComponents(this.state.customerList)
                      this.state.customerList.map((c) => (
                        <TableRow>
                          <TableCell>{c.no}</TableCell>
                          <TableCell>{c.userName}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>
                            <DialogActions>
                              <button
                                type='button'
                                onClick={this.choiceUser}
                                id={c.no}
                                value={[c.userName, c.phone]}
                              >
                                선택
                              </button>
                              {/*#{c.no} */}
                            </DialogActions>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan='6' align='center'></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <button type='button' onClick={this.handleClose}>
                  닫기
                </button>
              </DialogActions>
            </Dialog>
          </section>
          <section className='CustomerInbody sectionGlass'>
            <h3>
              <span>{this.state.userName}</span>님 운동배정
            </h3>
            <div>
              <h4>
                최근 <span>인바디</span> 정보입니다.
              </h4>
              <label>
                키<span>{this.state.user_height}</span>
                cm
              </label>
              <label>
                체중
                <span>{this.state.user_weight}</span>
                kg
              </label>
              <label>
                체지방
                <span>{this.state.user_bodyFat}</span>
                kg
              </label>
              <label>
                근육량
                <span>{this.state.user_muscleMass}</span>
                kg
              </label>
            </div>
            <Link
              to={{
                pathname: '/assign/customer',
                state: { member_no: this.state.member_no },
              }}
            >
              <button className='btnSolid' type='button'>
                운동 배정 확인
              </button>
            </Link>
          </section>
          {/*.CustomerInbody */}
          <section className='assignWorkout'>
            <h3>운동 목록</h3>
            <div className='inputCheckRow'>
              <h5>
                <div className='circle'></div>
                운동 묶음 선택 (기본 설정)
              </h5>
              <p className='mb-3 w-100 fs-3'>
                부위 별로 미리 설정한 운동 묶음을 간편하게 배정할 수 있습니다.
              </p>
              <div className='d-flex w-100'>
                {this.createViewDefaultExerciseButton()}
              </div>
            </div>
            <h5>
              <div className='circle'></div>
              운동 개별 선택
            </h5>
            <div className='exerciseSelectList'>
              <div className='flexbetween'>
                {this.createViewExerciseListButton()}
              </div>
            </div>
            {this.createViewExerciseListTable()}

            <button
              className='btnSolid'
              type='button'
              onClick={this.handleIgnoreClick}
            >
              {' '}
              {this.state.member_no === '' ? (
                '배정 확인하기'
              ) : (
                <Link
                  to={{
                    pathname: '/assign/check',
                    state: {
                      userName: this.state.userName,
                      member_no: this.state.member_no,
                      assignDefault: this.state.assignDefault,
                      assignCustom: {
                        0: this.state.select_data,
                        // 1: this.state.select_top_data,
                        // 2: this.state.select_bottom_data,
                        // 4: this.state.select_allbody_data,
                        // 8: this.state.select_core_data,
                        // 16: this.state.select_oxy_data,
                        // 32: this.state.select_etc_data,
                      },
                    },
                  }}
                >
                  배정 확인하기
                </Link>
              )}
            </button>
          </section>
        </div>
        {/*.container */}
        <div className='footer'>
          <Footer />
        </div>
        {/*.footer */}
      </div> /*.assignExercise */
    );
  }
}

const AssignExerciseStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const AssignExerciseDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  AssignExerciseStateToProps,
  AssignExerciseDispatchToProps
)(AssignExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고
