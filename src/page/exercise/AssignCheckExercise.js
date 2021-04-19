import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
];

// const ip = '13.124.141.28';

const ip = 'localhost:3001';
class AssignCheckExercise extends Component {
    constructor(props) {
        super(props);

        const search = location.search;

        this.state = {
            fitness_no: this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            member_no: Number(search.split('=')[1]),
            assignDefault: this.props.location.state.assignDefault,

            exerciseList: [],
        };

        this.getExerciseListDefault();
    }
    getExerciseListDefault = () => {
        let exList = [];
        // let setState = this.setState;
        const setState = this.setState.bind(this);

        this.sendAssign(
            function (arr, n) {
                // arr.forEach((res) => {});
                exList = [...arr];
                setState({ exerciseList: exList });
            },
            this.procDefaultPackage,
            -1
        );
    };

    goLogin = () => {
        this.props.history.push('/');
    };

    sendAssign2 = (arr, last_group_no) => {
        let url = 'http://' + ip + '/assignexercise';
        arr.forEach((ex) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(ex),
            }).then((response) => {
                console.log(response);
            });
        });
    };
    procDefaultPackage = (
        next_func,
        searchs,
        arr,
        fitness_no,
        member_no,
        last_group_no
    ) => {
        let it = 2;
        let search = searchs.pop();
        console.log(search);
        let url = 'http://' + ip + '/exercise';
        url = url + '?type=search' + it;
        url = url + '&search=' + search;
        url = url + '&fn=' + fitness_no;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((res) => {
                let arr2 = [];
                let idx = 0;
                for (let i = res.length - 1; i >= 0; i--) {
                    idx = idx + 1;
                    let part = ', ';
                    let part_num = Number(res[i].part);
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
                        res[i]['fitness_no'] = fitness_no;
                        res[i]['member_no'] = member_no;
                        res[i]['group_no'] = last_group_no + 1;
                        res[i]['data_type'] = res[i]['default_data_type'];
                        res[i]['data'] = res[i]['default_data'];
                        res[i]['set_count'] = res[i]['default_set_count'];
                        res[i]['rest_second'] = res[i]['default_rest_second'];

                        res[i]['no'] = idx;
                        res[i]['name'] = res[i].name;
                        res[i]['tool'] = res[i].machine;
                        res[i]['aa'] = part;
                        res[i]['set'] = res[i].default_set_count;
                        res[i]['bb'] = res[i].default_data;
                        res[i]['cc'] = res[i].default_rest_second;
                        res[i]['link'] = res[i].url;
                        arr.push(res[i]);
                    } else {
                    }
                    if (res[i].is_default) {
                        arr2.push(res[i].exercise_no);
                    }
                }
            })
            .then(() => {
                console.log('this: ' + this);
                console.log(this);
                if (searchs.length > 0) {
                    console.log('this: ' + this);
                    console.log(this);
                    return this.procDefaultPackage(
                        next_func,
                        searchs,
                        arr,
                        fitness_no,
                        member_no,
                        last_group_no
                    );
                } else {
                    next_func(arr, last_group_no);
                }
            })
            .catch((err) => console.error(err));
    };

    sendAssign = (next_func, procDefaultPackage, last_group_no) => {
        const fitness_no = this.props.userinfo.fitness_no;
        const member_no = this.props.userinfo.member_no;
        let v_arr = [];
        if (this.state.assignDefault.length > 0) {
            this.state.assignDefault.forEach((part) => {
                let search = part;
                let v = 0;
                if (/상체/.test(search)) {
                    search = search.replace('상체', '');
                    v = v + 1;
                    v_arr.push(1);
                }
                if (/하체/.test(search)) {
                    search = search.replace('하체', '');
                    v = v + 2;
                    v_arr.push(2);
                }
                if (/전신/.test(search)) {
                    search = search.replace('전신', '');
                    v = v + 4;
                    v_arr.push(4);
                }
                if (/코어/.test(search)) {
                    search = search.replace('코어', '');
                    v = v + 8;
                    v_arr.push(8);
                }
                if (/유산소/.test(search)) {
                    search = search.replace('유산소', '');
                    v = v + 16;
                    v_arr.push(16);
                }
                if (v === 0) {
                    console.error('assignDefault:' + part);
                    return;
                }
                search = v;
            });

            let searchs = v_arr;
            let arr = [];
            procDefaultPackage(
                next_func,
                searchs,
                arr,
                fitness_no,
                member_no,
                last_group_no
            );
        } else {
        }
    };

    handleOnClick = () => {
        let url =
            'http://' +
            ip +
            '/assignexercise' +
            '?type=' +
            'member' +
            '&fitness_no=' +
            this.props.userinfo.fitness_no +
            '&member_no=' +
            this.props.userinfo.member_no;

        let inits = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        };

        const sendAssign = this.sendAssign;
        const sendAssign2 = this.sendAssign2;
        const procDefaultPackage = this.procDefaultPackage;
        fetch(url, inits)
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 0) {
                    return 0;
                } else {
                    return res[res.length - 1].group_no;
                }
            })
            .then((last_group_no) => {
                sendAssign(sendAssign2, procDefaultPackage, last_group_no);
            })
            .catch((err) => console.error(err));
    };

    render() {
        const { userinfo } = this.props;

        const options = {
            noDataText: '인바디 정보가 없습니다.',
        };

        return (
            <div>
                <Header />
                <Navigation goLogin={this.goLogin} />
                <div className="title">
                    <div className="titleIn">
                        <h2>운동 배정</h2>
                        <h4>운동 {'>'} 운동 배정</h4>
                    </div>
                </div>
                <div className="container">
                    <NavLink exact to="/assign">
                        [운동 배정 설정]
                    </NavLink>
                    <Link to={{ pathname: '/assign/inbody?member_no=' + 0 }}>
                        [고객인바디]
                    </Link>

                    <div>
                        <label>{this.state.name}님의 운동배정입니다.</label>
                    </div>
                    <BootstrapTable
                        data={this.state.exerciseList}
                        hover
                        pagination={this.state.exerciseList > 1}
                        options={options}
                        tableHeaderClass="tableHeader"
                        tableContainerClass="tableContainer"
                        //selectRow={selectRowProp}
                        className="table2"
                    >
                        <TableHeaderColumn
                            dataField="no"
                            thStyle={{ textAlign: 'center' }}
                            tdStyle={{ textAlign: 'center' }}
                            isKey
                        >
                            no
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

                    <button type="button" onClick={this.handleOnClick}>
                        배정하기
                    </button>
                </div>
            </div>
        );
    }
}

const AssignCheckExerciseStateToProps = (state) => {
    return {
        userinfo: state.authentication.userinfo,
    };
};

export default connect(
    AssignCheckExerciseStateToProps,
    undefined
)(AssignCheckExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고
