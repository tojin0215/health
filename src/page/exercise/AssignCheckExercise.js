import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/exercise/AssignCheckExercise.css';

// const ip = '13.124.141.28:3003';

const ip = 'localhost:3000';
class AssignCheckExercise extends Component {
    constructor(props) {
        super(props);

        const search = location.search;

        this.state = {
            fitness_no: this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            // member_no: Number(search.split('=')[1]),
            member_no: Number(this.props.location.state.member_no),
            assignDefault: this.props.location.state.assignDefault,
            assignCustom: this.props.location.state.assignCustom,

            exerciseList: [],
        };
        if (this.props.location.state.assignDefault.length !== 0)
            this.getExerciseListDefault();
        else {
            let arr = [];
            let idx = 0;
            for (const [key, value] of Object.entries(
                this.props.location.state.assignCustom
            )) {
                console.log(key, value);
                for (const [k, v] of Object.entries(value)) {
                    idx = idx + 1;
                    console.log(idx, v);
                    if (v.hasOwnProperty('exercise_no')) {
                        v['no'] = idx;
                    } else {
                        v['exercise_no'] = k;
                        v['no'] = idx;
                    }
                    arr.push(v);
                }
            }
            this.state.exerciseList = arr;
        }
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
    loadInbody = () => {};

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
        alert('배정되었습니다.');
        // this.props.history.push("/assign")
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
        // const member_no = this.props.userinfo.member_no;
        const member_no = this.state.member_no;
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
            const exerciseList = this.state.exerciseList
                ? this.state.exerciseList
                : [];
            let arr = [];
            [...exerciseList].forEach((ex) => {
                let res = JSON.parse(JSON.stringify(ex));
                res['fitness_no'] = fitness_no;
                res['member_no'] = member_no;
                res['group_no'] = last_group_no + 1;
                res['data_type'] = res['default_data_type'];
                res['data'] = res['default_data'];
                res['set_count'] = res['default_set_count'];
                res['rest_second'] = res['default_rest_second'];
                arr.push(res);
            });
            next_func(arr, last_group_no);
            // this.state.assignCustom;
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
            noDataText: '선택된 운동이 없습니다.',
        };

        return (
            <div className="assignCheckExercise">
                <div className="header">
                    <Header />
                    <Navigation goLogin={this.goLogin} />
                    <div className="localNavigation">
                        <div className="container">
                            <h2>운동 배정 확인</h2>
                            <div className="breadCrumb">
                                <Link to="/home">HOME</Link>
                                <span>&#62;</span>
                                <Link to="/assign">운동 배정</Link>
                                <span>&#62;</span>
                                <Link to="#">운동 배정 확인</Link>
                            </div>
                            {/*.breadCrumb */}
                        </div>
                        {/*.container */}
                    </div>
                    {/*.localNavigation */}
                </div>
                {/*.header */}
                <div className="container">
                    <article className="waySub">
                        <NavLink exact to="/assign">
                            <button type="button">운동 배정 설정</button>
                        </NavLink>
                        <Link
                            to={{
                                pathname:
                                    '/assign/inbody?member_no=' +
                                    this.state.member_no,
                            }}
                        >
                            <button type="button">고객인바디</button>
                        </Link>
                    </article>
                    {/*.waySub */}
                    <section className="checkExercise">
                        <h3>
                            <span>{this.props.location.state.userName}</span>
                            님의 운동배정입니다.
                        </h3>
                        <BootstrapTable
                            hover
                            data={this.state.exerciseList}
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
                        {/*.table2 */}
                        <button
                            className="btnOneCenter"
                            type="button"
                            onClick={this.handleOnClick}
                        >
                            배정하기
                        </button>
                    </section>
                    {/*.checkExercise */}
                </div>
                {/*.container */}
                <div className="footer">
                    <Footer />
                </div>
                {/*.footer */}
            </div> /*.assignCheckExercise */
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
