import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Menu from '../../component/navigation/Menu';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { getStatusRequest } from '../../action/authentication';
import '../../styles/setting/defaultExercise.css';

import { SERVER_URL } from '../../const/settings';

const ip = SERVER_URL;
//const ip = 'localhost:3000';

const List = [
  {
    no: 1,
    name: 'AAA',
    tool: '바벨',
    aa: '상체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 2,
    name: 'BBB',
    tool: '바벨',
    aa: '하체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 3,
    name: 'CCC',
    tool: '바벨',
    aa: '전신',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 4,
    name: 'AAA',
    tool: '바벨',
    aa: '상체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 5,
    name: 'BBB',
    tool: '바벨',
    aa: '하체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 6,
    name: 'CCC',
    tool: '바벨',
    aa: '전신',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 7,
    name: 'AAA',
    tool: '바벨',
    aa: '상체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 8,
    name: 'BBB',
    tool: '바벨',
    aa: '하체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 9,
    name: 'CCC',
    tool: '바벨',
    aa: '전신',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 10,
    name: 'AAA',
    tool: '바벨',
    aa: '상체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 11,
    name: 'BBB',
    tool: '바벨',
    aa: '하체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 12,
    name: 'CCC',
    tool: '바벨',
    aa: '전신',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 13,
    name: 'AAA',
    tool: '바벨',
    aa: '상체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 14,
    name: 'BBB',
    tool: '바벨',
    aa: '하체',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
  {
    no: 15,
    name: 'CCC',
    tool: '바벨',
    aa: '전신',
    set: '3',
    bb: '10',
    cc: '10분',
    link: 'www.www.www',
  },
];

class DefaultExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: [],
      selectedListId: [],
      exerciseList: [],
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,

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
    this.handleOnClick = this.handleOnClick.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);

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

  cusFetch = () => {
    //customer 참고해서 검색기능 넣기

    const url =
      ip + '/exercise?type=search&search=&fn=' + this.props.userinfo.fitness_no;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        let arr = [];
        let arr_top = [];
        let arr_bottom = [];
        let arr_allbody = [];
        let arr_core = [];
        let arr_oxy = [];
        let arr_etc = [];

        for (let i = res.length - 1; i >= 0; i--) {
          let part = ', ';
          let part_num = Number(res[i].part);
          console.log(part_num);

          if (part_num == 32) {
            part = '기타, ' + part;
            part_num = 0;
            if (this.parserIsDefault(res[i], '기타')) {
              arr_etc.push(res[i].exercise_no);
            }
          }
          if (part_num >= 16) {
            part = '유산소, ' + part;
            part_num = part_num - 16;
            if (this.parserIsDefault(res[i], '유산소')) {
              arr_oxy.push(res[i].exercise_no);
            }
          }
          if (part_num >= 8) {
            part = '코어, ' + part;
            part_num = part_num - 8;
            if (this.parserIsDefault(res[i], '코어')) {
              arr_core.push(res[i].exercise_no);
            }
          }
          if (part_num >= 4) {
            part = '전신, ' + part;
            part_num = part_num - 4;
            if (this.parserIsDefault(res[i], '전신')) {
              arr_allbody.push(res[i].exercise_no);
            }
          }
          if (part_num >= 2) {
            part = '하체, ' + part;
            part_num = part_num - 2;
            if (this.parserIsDefault(res[i], '하체')) {
              arr_bottom.push(res[i].exercise_no);
            }
          }
          if (part_num === 1) {
            part = '상체, ' + part;
            if (this.parserIsDefault(res[i], '상체')) {
              arr_top.push(res[i].exercise_no);
            }
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
        this.setState({
          exerciseList: arr,
          select_top: arr_top,
          select_bottom: arr_bottom,
          select_allbody: arr_allbody,
          select_core: arr_core,
          select_oxy: arr_oxy,
          select_etc: arr_etc,
        });
      });
  };

  search = (part) => {
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
    if (/기타/.test(this.state.search)) {
      search = search.replace('기타', '');
      v = 32;
    }

    if (v === 0) {
      alert('부위를 입력바랍니다.');
      return;
    }
    search = v;

    const url =
      ip +
      '/exercise?type=search' +
      it +
      '&search=' +
      search +
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
        let arr = [];
        let arr_top = [];
        let arr_bottom = [];
        let arr_allbody = [];
        let arr_core = [];
        let arr_oxy = [];
        let arr_etc = [];
        let arr2 = [];
        for (let i = res.length - 1; i >= 0; i--) {
          let part = ', ';
          let part_num = Number(res[i].part);
          console.log('isD' + res[i].is_default);

          if (part_num === 32) {
            part = '기타, ' + part;
            part_num = 0;
            if (this.parserIsDefault(res[i], '기타')) {
              arr_etc.push(res[i].exercise_no);
            }
          }
          if (part_num >= 16) {
            part = '유산소, ' + part;
            part_num = part_num - 16;
            if (this.parserIsDefault(res[i], '유산소')) {
              arr_oxy.push(res[i].exercise_no);
            }
          }
          if (part_num >= 8) {
            part = '코어, ' + part;
            part_num = part_num - 8;
            if (this.parserIsDefault(res[i], '코어')) {
              arr_core.push(res[i].exercise_no);
            }
          }
          if (part_num >= 4) {
            part = '전신, ' + part;
            part_num = part_num - 4;
            if (this.parserIsDefault(res[i], '전신')) {
              arr_allbody.push(res[i].exercise_no);
            }
          }
          if (part_num >= 2) {
            part = '하체, ' + part;
            part_num = part_num - 2;
            if (this.parserIsDefault(res[i], '하체')) {
              arr_bottom.push(res[i].exercise_no);
            }
          }
          if (part_num === 1) {
            part = '상체, ' + part;
            if (this.parserIsDefault(res[i], '상체')) {
              arr_top.push(res[i].exercise_no);
            }
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
          if (this.parserIsDefault(res, part)) {
            arr2.push(res[i].exercise_no);
          }
        }
        arr2.reverse();
        this.setState({
          select_top: arr_top,
          select_bottom: arr_bottom,
          select_allbody: arr_allbody,
          select_core: arr_core,
          select_oxy: arr_oxy,
          select_etc: arr_etc,
          selectedListId: arr2,
          exerciseList: arr,
        });
      });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSelectRow(row, isSelected, e) {
    const exercise_no = row['no'];

    this.setState({
      selectedList: [...this.state.selectedList, [exercise_no, isSelected]],
    });

    console.log(this.state.selectedListId);
    if (isSelected) {
      this.setState({
        selectedListId: [...this.state.selectedListId, exercise_no],
      });
    } else {
      this.setState({
        selectedListId: this.state.selectedListId.filter(
          (i) => i !== exercise_no
        ),
      });
    }
  }

  selectHandleOnClick(e) {
    alert(e.target.id);
  }
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
    this.search('상체');
    this.setState({
      show1: !this.state.show1,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
    });
  };

  click2 = (e) => {
    //하체
    e.preventDefault();
    this.search('하체');
    this.setState({
      show2: !this.state.show2,
      show1: false,
      show3: false,
      show4: false,
      show5: false,
    });
  };

  click3 = (e) => {
    //전신
    e.preventDefault();
    this.search('전신');
    this.setState({
      show3: !this.state.show3,
      show1: false,
      show2: false,
      show4: false,
      show5: false,
    });
  };

  click4 = (e) => {
    //코어
    e.preventDefault();
    this.search('코어');
    this.setState({
      show4: !this.state.show4,
      show1: false,
      show2: false,
      show3: false,
      show5: false,
    });
  };

  click5 = (e) => {
    //유산소
    e.preventDefault();
    this.search('유산소');
    this.setState({
      show5: !this.state.show5,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
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

  handleOnClick() {
    let selectedList = [];
    let unSelectedList = [];
    let exerciseList = this.state.exerciseList.map((ex) => ex.no);
    const top = this.state.show1;
    const bottom = this.state.show2;
    const allbody = this.state.show3;
    const core = this.state.show4;
    const oxy = this.state.show5;

    let select_top = this.state.select_top;
    let select_bottom = this.state.select_bottom;
    let select_allbody = this.state.select_allbody;
    let select_core = this.state.select_core;
    let select_oxy = this.state.select_oxy;

    if (top) {
      unSelectedList = exerciseList
        .map(function (ex_no) {
          if (select_top.includes(ex_no)) {
          } else {
            return ex_no;
          }
        })
        .map(function (ex_no) {
          let v = 0;
          if (select_bottom.includes(ex_no)) {
            v = v + 20;
          }
          if (select_allbody.includes(ex_no)) {
            v = v + 400;
          }
          if (select_core.includes(ex_no)) {
            v = v + 8000;
          }
          if (select_oxy.includes(ex_no)) {
            v = v + 160000;
          }
          return [ex_no, v];
        });
      selectedList = select_top.map(function (ex_no) {
        let v = 1;
        if (select_bottom.includes(ex_no)) {
          v = v + 20;
        }
        if (select_allbody.includes(ex_no)) {
          v = v + 400;
        }
        if (select_core.includes(ex_no)) {
          v = v + 8000;
        }
        if (select_oxy.includes(ex_no)) {
          v = v + 160000;
        }
        return [ex_no, v];
      });
    } else if (bottom) {
      unSelectedList = exerciseList
        .map(function (ex_no) {
          if (select_bottom.includes(ex_no)) {
          } else {
            return ex_no;
          }
        })
        .map(function (ex_no) {
          let v = 0;
          if (select_top.includes(ex_no)) {
            v = v + 1;
          }
          if (select_allbody.includes(ex_no)) {
            v = v + 400;
          }
          if (select_core.includes(ex_no)) {
            v = v + 8000;
          }
          if (select_oxy.includes(ex_no)) {
            v = v + 160000;
          }
          return [ex_no, v];
        });
      selectedList = select_bottom.map(function (ex_no) {
        let v = 20;
        if (select_top.includes(ex_no)) {
          v = v + 1;
        }
        if (select_allbody.includes(ex_no)) {
          v = v + 400;
        }
        if (select_core.includes(ex_no)) {
          v = v + 8000;
        }
        if (select_oxy.includes(ex_no)) {
          v = v + 160000;
        }
        return [ex_no, v];
      });
    } else if (allbody) {
      unSelectedList = exerciseList
        .map(function (ex_no) {
          if (select_allbody.includes(ex_no)) {
          } else {
            return ex_no;
          }
        })
        .map(function (ex_no) {
          let v = 0;
          if (select_top.includes(ex_no)) {
            v = v + 1;
          }
          if (select_bottom.includes(ex_no)) {
            v = v + 20;
          }
          if (select_core.includes(ex_no)) {
            v = v + 8000;
          }
          if (select_oxy.includes(ex_no)) {
            v = v + 160000;
          }
          return [ex_no, v];
        });
      selectedList = select_allbody.map(function (ex_no) {
        let v = 400;
        if (select_top.includes(ex_no)) {
          v = v + 1;
        }
        if (select_bottom.includes(ex_no)) {
          v = v + 20;
        }
        if (select_core.includes(ex_no)) {
          v = v + 8000;
        }
        if (select_oxy.includes(ex_no)) {
          v = v + 160000;
        }
        return [ex_no, v];
      });
    } else if (core) {
      unSelectedList = exerciseList
        .map(function (ex_no) {
          if (select_core.includes(ex_no)) {
          } else {
            return ex_no;
          }
        })
        .map(function (ex_no) {
          let v = 0;
          if (select_top.includes(ex_no)) {
            v = v + 1;
          }
          if (select_bottom.includes(ex_no)) {
            v = v + 20;
          }
          if (select_allbody.includes(ex_no)) {
            v = v + 400;
          }
          if (select_oxy.includes(ex_no)) {
            v = v + 160000;
          }
          return [ex_no, v];
        });
      selectedList = select_core.map(function (ex_no) {
        let v = 8000;
        if (select_top.includes(ex_no)) {
          v = v + 1;
        }
        if (select_bottom.includes(ex_no)) {
          v = v + 20;
        }
        if (select_allbody.includes(ex_no)) {
          v = v + 400;
        }
        if (select_oxy.includes(ex_no)) {
          v = v + 160000;
        }
        return [ex_no, v];
      });
    } else if (oxy) {
      unSelectedList = exerciseList
        .map(function (ex_no) {
          if (select_oxy.includes(ex_no)) {
          } else {
            return ex_no;
          }
        })
        .map(function (ex_no) {
          let v = 0;
          if (select_top.includes(ex_no)) {
            v = v + 1;
          }
          if (select_bottom.includes(ex_no)) {
            v = v + 20;
          }
          if (select_allbody.includes(ex_no)) {
            v = v + 400;
          }
          if (select_core.includes(ex_no)) {
            v = v + 8000;
          }
          return [ex_no, v];
        });
      selectedList = select_oxy.map(function (ex_no) {
        let v = 160000;
        if (select_top.includes(ex_no)) {
          v = v + 1;
        }
        if (select_bottom.includes(ex_no)) {
          v = v + 20;
        }
        if (select_allbody.includes(ex_no)) {
          v = v + 400;
        }
        if (select_core.includes(ex_no)) {
          v = v + 8000;
        }
        return [ex_no, v];
      });
    }
    fetch(ip + '/exercise?fn=' + this.props.userinfo.fitness_no, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 'set_default',
        data: [...selectedList, ...unSelectedList],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        alert('저장되었습니다.');
      })
      .catch((err) => console.error(err));
  }
  handleRowSelectAll = (isSelected, rows) => {
    // const exercise_no = row['no']
    let arr = [];
    let arr2 = [];

    rows.forEach((row) => {
      const exercise_no = row['no'];
      arr.push([exercise_no, isSelected]);
      arr2.push(exercise_no);
    });
    this.setState({ selectedList: [...this.state.selectedList, ...arr] });

    if (isSelected) {
      this.setState({
        selectedListId: [...this.state.selectedListId, ...arr2],
      });
    } else {
      this.setState({
        selectedListId: this.state.selectedListId.filter(
          (i) => !arr2.includes(i)
        ),
      });
    }
  };

  viewTable;

  render() {
    const { userinfo } = this.props;

    const options1 = {
      noDataText: '운동 기본값 설정 해주세요.',
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
    };

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      // unselectable: [2],
      selected: this.state.selectedListId,
      onSelect: this.onSelectRow,
      onSelectAll: this.handleRowSelectAll,
      bgColor: 'mint',
    };

    const selectRowProp_상체 = {
      mode: 'checkbox',
      clickToSelect: true,
      //unselectable: [2],
      //selected: [1],
      selected: this.state.select_top,
      onSelect: this.onSelectRowTop,
      bgColor: 'mint',
    };
    const selectRowProp_하체 = {
      mode: 'checkbox',
      clickToSelect: true,
      //unselectable: [2],
      //selected: [1],
      selected: this.state.select_bottom,
      onSelect: this.onSelectRowBottom,
      bgColor: 'mint',
    };
    const selectRowProp_코어 = {
      mode: 'checkbox',
      clickToSelect: true,
      //unselectable: [2],
      //selected: [1],
      selected: this.state.select_core,
      onSelect: this.onSelectRowCore,
      bgColor: 'mint',
    };
    const selectRowProp_전신 = {
      mode: 'checkbox',
      clickToSelect: true,
      //unselectable: [2],
      //selected: [1],
      selected: this.state.select_allbody,
      onSelect: this.onSelectRowAllbody,
      bgColor: 'mint',
    };

    const selectRowProp_유산소 = {
      mode: 'checkbox',
      clickToSelect: true,
      //unselectable: [2],
      //selected: [1],
      selected: this.state.select_oxy,
      onSelect: this.onSelectRowOxy,
      bgColor: 'mint',
    };

    return (
      <div className='defaultExercise'>
        <header>
          <Header />
          <Navigation goLogin={this.goLogin} />
          <Menu />
          <div className='localNavigation'>
            <div className='container'>
              <h2>
                <div className='parallelogram'></div>
                운동 기본묶음 설정
                <span>.</span>
              </h2>
              <div className='breadCrumb'>
                <Link to='/home'>HOME</Link>
                <span>&#62;</span>
                <Link to='/exercise'>운동 설정</Link>
                <span>&#62;</span>
                <Link to='/setting/default'>운동 기본묶음 설정</Link>
              </div>
              {/*.breadCrumb */}
            </div>
            {/*.container */}
          </div>
          {/*.localNavigation */}
        </header>
        <div className='container'>
          <div className='defaultKind flexbetween'>
            <button type='button' id='1' onClick={this.click1}>
              상체
            </button>
            {/*#1 */}
            <button type='button' id='2' onClick={this.click2}>
              하체
            </button>
            {/*#2 */}
            <button type='button' id='3' onClick={this.click3}>
              전신
            </button>
            {/*#3 */}
            <button type='button' id='4' onClick={this.click4}>
              코어
            </button>
            {/*#4 */}
            <button type='button' id='5' onClick={this.click5}>
              유산소
            </button>
            {/*#5 */}
          </div>
          {/*.defaultKind .flexbetween*/}
          {this.state.show1 ? (
            <div>
              <h3>상체 운동 목록</h3>
              <div className='tablewrap'>
                <BootstrapTable
                  hover
                  data={this.state.exerciseList}
                  pagination={this.state.exerciseList > 1}
                  options={options1}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  selectRow={selectRowProp_상체}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
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
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    세트
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='bb'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    횟수
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cc'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
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
            </div>
          ) : null}
          {this.state.show2 ? (
            <div>
              <h3>하체 운동 목록</h3>
              <div className='tablewrap'>
                <BootstrapTable
                  hover
                  data={this.state.exerciseList}
                  pagination={this.state.exerciseList > 1}
                  options={options1}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  selectRow={selectRowProp_하체}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
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
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    세트
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='bb'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    횟수
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cc'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
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
            </div>
          ) : null}
          {this.state.show3 ? (
            <div>
              <h3>전신 운동 목록</h3>
              <div className='tablewrap'>
                <BootstrapTable
                  hover
                  data={this.state.exerciseList}
                  pagination={this.state.exerciseList.length > 1}
                  options={options1}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  selectRow={selectRowProp_전신}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
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
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    세트
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='bb'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    횟수
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cc'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
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
              {/*.table2 */}
            </div>
          ) : null}
          {this.state.show4 ? (
            <div>
              <h3>코어 운동 목록</h3>
              <div className='tablewrap'>
                <BootstrapTable
                  hover
                  data={this.state.exerciseList}
                  pagination={this.state.exerciseList.length > 1}
                  options={options1}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  selectRow={selectRowProp_코어}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
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
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    세트
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='bb'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    횟수
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cc'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
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
              {/*.table2 */}
            </div>
          ) : null}
          {this.state.show5 ? (
            <div>
              <h3>유산소 운동 목록</h3>
              <div className='tablewrap'>
                <BootstrapTable
                  hover
                  data={this.state.exerciseList}
                  pagination={this.state.exerciseList.length > 1}
                  options={options1}
                  tableHeaderClass='tableHeader'
                  tableContainerClass='tableContainer'
                  selectRow={selectRowProp_유산소}
                  className='table2'
                >
                  <TableHeaderColumn
                    dataField='no'
                    thStyle={{ textAlign: 'center', width: '6rem' }}
                    tdStyle={{ textAlign: 'center', width: '6rem' }}
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
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    세트
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='bb'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
                  >
                    횟수
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cc'
                    thStyle={{ textAlign: 'center', width: '10rem' }}
                    tdStyle={{ textAlign: 'center', width: '10rem' }}
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
              {/*.table2 */}
            </div>
          ) : null}
          <button
            className='btnSolid'
            type='button'
            onClick={this.handleOnClick}
          >
            저장하기
          </button>
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

const PackageStateToProps = (state) => {
  return {
    userinfo: state.authentication.userinfo,
    status: state.authentication.status,
  };
};

const DefaultExerciseDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default connect(
  PackageStateToProps,
  DefaultExerciseDispatchToProps
)(DefaultExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고
