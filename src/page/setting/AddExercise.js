import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-dropdown';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../styles/setting/addExercise.css';

const ip = '13.124.141.28:3003';
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');
const options = ['이름', '운동기구', '운동부위'];
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
            url: 'http://localhost',
            default_data_type: 1,
            default_data: '',
            default_rest_second: -1,
            default_set_count: -1,
            is_default: false,
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.cusFetch();
    }

    goLogin = () => {
        this.props.history.push('/');
    };

    handleOnClick() {
        alert('운동 저장');
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
                        JSON.parse(
                            JSON.stringify({ data: Number(this.state.part) })
                        )['data'] + Number(e.target.value),
                });
            } else {
                this.setState({
                    [e.target.name]:
                        JSON.parse(
                            JSON.stringify({ data: Number(this.state.part) })
                        )['data'] - Number(e.target.value),
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
        let it = '';
        let search = '';
        //customer 참고해서 검색기능 넣기

        fetch(
            'http://' +
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
            });
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

            if (v === 0) {
                alert('부위를 입력바랍니다.');
                return;
            }
            search = v;
        }

        fetch(
            'http://' +
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
        if (this.state.name === '') {
            alert('이름이 없습니다');
            return;
        } else if (this.state.part === 0) {
            alert('운동 부위가 선택되지 않았습니다');
            return;
        } else if (this.state.machine === '') {
            alert('운동 기구가 없습니다');
            return;
        } else if (this.state.url === '') this.setState({ url: '' });
        else if (this.state.default_data_type === '')
            this.setState({ default_data_type: 1 });
        else if (this.state.default_data === '') {
            alert('운동 기본 횟수가 없습니다');
            return;
        } else if (this.state.default_rest_second === '') {
            alert('쉬는 시간이 없습니다');
            return;
        } else if (this.state.default_set_count === '') {
            alert('운동 세트 횟수가 없습니다');
            return;
        } else if (this.state.is_default === undefined)
            this.setState({ is_default: false });
        else {
            const userinfo = {
                member_no: -1,
                manager_name: '',
                fitness_no: -1,
                fitness_name: '',
            };
            if (this.props.userinfo !== undefined) {
                userinfo['member_no'] = this.props.userinfo.member_no;
                userinfo['manager_name'] = this.props.userinfo.manager_name;
                userinfo['fitness_no'] = this.props.userinfo.fitness_no;
                userinfo['fitness_name'] = this.props.userinfo.fitness_name;
            } else {
                alert('DEBUG');
            }

            fetch('http://' + ip + '/exercise', {
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
                    alert('운동 등록됨');
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
            <div className="addExercise">
                <header className="header">
                    <Header />
                    <Navigation goLogin={this.goLogin} />
                    <div className="localNavigation">
                        <div className="container">
                            <h2>운동 설정</h2>
                            <div className="breadCrumb">
                                <Link to="/home">HOME</Link>
                                <span>&#62;</span>
                                <Link to="/exercise">운동 설정</Link>
                            </div>
                            {/*.breadCrumb */}
                        </div>
                        {/*.container */}
                    </div>
                    {/*.localNavigation */}
                </header>
                {/*.header */}
                <div className="container">
                    {/* <NavLink exact to='/exercise'>[운동 추가]</NavLink>
                <NavLink exact to='/setting/default'>[운동 기본묶음 설정]</NavLink> */}
                    <section className="settingInfoInput">
                        <h3>운동 정보 입력</h3>
                        <article className="wayDefault waySub">
                            <Link to="/setting/default">
                                <button type="button">운동 묶음 설정</button>
                            </Link>
                        </article>
                        <form>
                            <div className="input-row">
                                <label className="label-description">
                                    운동 이름
                                </label>
                                {/*.label-description */}
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="name"
                                    name="name"
                                    ref={(ref) => {
                                        this.iptName = ref;
                                    }}
                                    onChange={this.handleChange}
                                />
                                {/*#name */}
                            </div>
                            {/*.input-row */}
                            <div className="input-row">
                                <label className="label-description">
                                    운동 기구
                                </label>
                                {/*.label-description */}
                                <input
                                    id="tool"
                                    type="text"
                                    placeholder="machine"
                                    name="machine"
                                    ref={(ref) => {
                                        this.iptMachine = ref;
                                    }}
                                    onChange={this.handleChange}
                                />
                                {/*#tool */}
                            </div>
                            {/*.input-row */}
                            <div className="input-row exercisePart">
                                <label className="label-description">
                                    부위
                                </label>
                                {/*.label-description */}
                                <div className="part">
                                    <label>
                                        <input
                                            type="checkBox"
                                            value="1"
                                            name="part"
                                            ref={(ref) => {
                                                this.chkPartTop = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                        상체
                                    </label>
                                    <label>
                                        <input
                                            type="checkBox"
                                            value="2"
                                            name="part"
                                            ref={(ref) => {
                                                this.chkPartBottom = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                        하체
                                    </label>
                                    <label>
                                        <input
                                            type="checkBox"
                                            value="4"
                                            name="part"
                                            ref={(ref) => {
                                                this.chkPartAllbody = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                        전신
                                    </label>
                                    <label>
                                        <input
                                            type="checkBox"
                                            value="8"
                                            name="part"
                                            ref={(ref) => {
                                                this.chkPartCore = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                        코어
                                    </label>
                                    <label>
                                        <input
                                            type="checkBox"
                                            value="16"
                                            name="part"
                                            ref={(ref) => {
                                                this.chkPartOxy = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                        유산소
                                    </label>
                                </div>
                                {/*.part */}
                            </div>
                            {/*.input-row */}
                            <div className="input-row">
                                <label className="label-description">
                                    영상 링크
                                </label>
                                <input
                                    id="link"
                                    type="text"
                                    placeholder="link"
                                    name="url"
                                    ref={(ref) => {
                                        this.iptUrl = ref;
                                    }}
                                    onChange={this.handleChange}
                                />
                            </div>
                            {/*.input-row */}
                            <div className="input-row settingRoutin">
                                <label className="label-description">
                                    기본 세트 설정
                                </label>
                                <div>
                                    <label className="inputColumn">
                                        <p>횟수</p>
                                        <input
                                            id="횟수"
                                            type="number"
                                            placeholder="횟수"
                                            name="default_data"
                                            ref={(ref) => {
                                                this.iptDD = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </label>
                                    <label className="inputColumn">
                                        <p>휴식시간</p>
                                        <input
                                            id="휴식시간"
                                            type="number"
                                            placeholder="휴식시간"
                                            name="default_rest_second"
                                            ref={(ref) => {
                                                this.iptDRS = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </label>
                                    <label className="inputColumn">
                                        <p>세트</p>
                                        <input
                                            id="세트"
                                            type="number"
                                            placeholder="세트"
                                            name="default_set_count"
                                            ref={(ref) => {
                                                this.iptDSC = ref;
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/*.input-row */}
                            <button type="button" onClick={this.AddExercise}>
                                저장하기
                            </button>
                        </form>
                    </section>
                    {/*.settingInfoInput */}
                    <section className="settingExerciseList">
                        <h3>운동 목록</h3>
                        <div className="searchInputRow">
                            <Dropdown
                                className="searchDrop"
                                options={options}
                                onChange={this.selectItem}
                                value={this.state.item}
                                placeholder="Select an option"
                            />
                            <input
                                type="text"
                                id="search"
                                name="search"
                                checked={this.state.search}
                                onChange={this.handleChange}
                            />
                            <button type="button" onClick={this.search}>
                                운동 검색
                            </button>
                        </div>
                        <BootstrapTable
                            data={this.state.exerciseList}
                            hover
                            pagination={this.state.exerciseList.length > 1}
                            options={options1}
                            tableHeaderClass="tableHeader"
                            tableContainerClass="tableContainer"
                            className="table2"
                        >
                            <TableHeaderColumn
                                dataField="no"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                                isKey
                            >
                                번호
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="name"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                운동이름
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="tool"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                운동도구
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="aa"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                운동부위
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="set"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                세트
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="bb"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                횟수
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="cc"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                휴식시간
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField="link"
                                thStyle={{ textAlign: 'center' }}
                                tdStyle={{ textAlign: 'center' }}
                            >
                                링크
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </section>
                </div>
                {/*.container */}
                <footer className="footer">
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
    };
};

export default connect(AddExerciseStateToProps, undefined)(AddExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고

//와 멋져요
