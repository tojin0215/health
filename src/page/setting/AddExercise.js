import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-dropdown';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../styles/exercise/Exercise.css';

// const ip = '13.124.141.28:3000';
const ip = 'localhost:3000';

const List2 = [
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
const List = [];

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault('Asia/Seoul');
const options = ['이름', '운동기구', '운동부위'];
const defaultOption = options[0];

class AddExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseList: List,
            exerciseListLoaded: false,

            search: '',
            item: options[0],

            fitness_no: this.props.userinfo.fitness_no,
            name: '',
            part: 0,
            machine: '',
            url: 'http://localhost',
            default_data_type: -1,
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
            });
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
            // if (this.state.name==="") this.setState({name: ""});
            // else if (this.state.part == false) this.setState({part: ""});
            // else if (this.state.machine == false) this.setState({machine: ""});
            // else if (this.state.url == false) this.setState({url: ""});
            // else if (this.state.default_data_type==false) this.setState({default_data_type: ""});
            // else if (this.state.default_data==false) this.setState({default_data: ""});
            // else if (this.state.default_rest_second==false) this.setState({default_rest_second: ""});
            // else if (this.state.default_set_count==false) this.setState({default_set_count: ""});
            // else if (this.state.is_default === undefined) this.setState({is_default: false});
            // else {
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
                alert('debug');
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
                    alert('운동 등록됨');
                    this.search();
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

    render() {
        const { userinfo } = this.props;
        // console.log("userinfo : ");
        // console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        const options1 = {
            noDataText: '등록된 운동이 없습니다.',
            alwaysShowAllBtns: true,
            hideSizePerPage: true,
            sizePerPage: 5,
        };

        return (
            <div>
                <Header />
                <Navigation goLogin={this.goLogin} />
                <div className="title">
                    <div className="titleIn">
                        <h2>운동 추가</h2>
                        <h4>운동 {'>'} 운동 추가</h4>
                    </div>
                </div>
                <div className="container">
                    {/* <NavLink exact to="/exercise">[운동 추가]</NavLink>
                <NavLink exact to="/setting/default">[운동 기본묶음 설정]</NavLink> */}

                    <div className="subTitle">운동 정보 입력</div>
                    <hr />
                    <form style={{ flexDirection: 'column' }}>
                        <div className="input-row">
                            <label className="label-description">
                                운동 이름
                            </label>
                            <input
                                id="name"
                                placeholder="name"
                                name="name"
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="input-row">
                            <label className="label-description">
                                운동 기구
                            </label>
                            <input
                                id="tool"
                                placeholder="machine"
                                name="machine"
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className="input-row">
                            <label className="label-description">부위</label>
                            <div className="part">
                                <label>
                                    <input
                                        type="checkBox"
                                        value="1"
                                        name="part"
                                        onChange={this.handleChange}
                                    />
                                    상체
                                </label>
                                <label>
                                    <input
                                        type="checkBox"
                                        value="2"
                                        name="part"
                                        onChange={this.handleChange}
                                    />
                                    하체
                                </label>
                                <label>
                                    <input
                                        type="checkBox"
                                        value="4"
                                        name="part"
                                        onChange={this.handleChange}
                                    />
                                    전신
                                </label>
                                <label>
                                    <input
                                        type="checkBox"
                                        value="8"
                                        name="part"
                                        onChange={this.handleChange}
                                    />
                                    코어
                                </label>
                                <label>
                                    <input
                                        type="checkBox"
                                        value="16"
                                        name="part"
                                        onChange={this.handleChange}
                                    />
                                    유산소
                                </label>
                            </div>
                        </div>

                        <div className="input-row">
                            <label>세트</label>
                            <input
                                id="세트"
                                placeholder="세트"
                                name="default_set_count"
                                onChange={this.handleChange}
                            />
                            <label>횟수</label>
                            <input
                                id="횟수"
                                placeholder="횟수"
                                name="default_data"
                                onChange={this.handleChange}
                            />
                            <label>휴식시간</label>
                            <input
                                id="휴식시간"
                                placeholder="휴식시간"
                                name="default_rest_second"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-row">
                            <label className="label-description">
                                영상 링크
                            </label>
                            <input
                                id="link"
                                placeholder="link"
                                name="url"
                                onChange={this.handleChange}
                                onKeyUp={this.handleKeyUp}
                            />
                        </div>

                        <button type="button" onClick={this.AddExercise}>
                            저장하기
                        </button>
                    </form>
                    <br></br>
                    <div className="customerSearch">
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
                            {' '}
                            운동 검색{' '}
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
                    <br />
                </div>

                <Link to="/setting/default">
                    <Button color="primary">운동 묶음 설정</Button>
                </Link>
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
