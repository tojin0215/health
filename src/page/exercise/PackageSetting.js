import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

const { SearchBar } = Search;
// userinfo = {
    // useridx: 1,
    // username: "박재진",
    // fitnessidx: 1,
    // fitnessname: "투진헬스장"
// }

const totalExercisePack = [
    {"no": 1, "part": "", "name": "", "strength": "쉬움", "cnt": "1", "rest": "20", "setcnt": "3", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 2, "part": "상체", "name": "윗몸 일으키기", "strength": "보통", "cnt": "2", "rest": "10", "setcnt": "5", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 3, "part": "", "name": "", "strength": "어려움", "cnt": "3", "rest": "5", "setcnt": "10", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 4, "part": "", "name": "", "strength": "쉬움", "cnt": "1", "rest": "20", "setcnt": "3", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 5, "part": "상체", "name": "윗몸 일으키기", "strength": "보통", "cnt": "2", "rest": "10", "setcnt": "5", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 6, "part": "", "name": "", "strength": "어려움", "cnt": "3", "rest": "5", "setcnt": "10", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 7, "part": "", "name": "", "strength": "쉬움", "cnt": "1", "rest": "20", "setcnt": "3", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 8, "part": "상체", "name": "윗몸 일으키기", "strength": "보통", "cnt": "2", "rest": "10", "setcnt": "5", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
    {"no": 9, "part": "", "name": "", "strength": "어려움", "cnt": "3", "rest": "5", "setcnt": "10", "move": "", "delete": "", expand: {"data": 1, "data_second": 2}},
]

const columns = [{
    dataField: 'no',
    text: 'No.'
  }, {
    dataField: 'name',
    text: '이름'
  }, {
    dataField: 'part',
    text: '운동 부위'
  }, {
    dataField: 'strength',
    text: '운동 강도'
  }, {
    dataField: 'cnt',
    text: '횟수'
  }, {
    dataField: 'rest',
    text: '휴식'
  }, {
    dataField: 'setcnt',
    text: '세트 횟수'
  }];

const sub_columns = [{
    dataField: 'data',
    text: 'data'
}, {
    dataField: 'data_second',
    text: 'second'
}];
const expandRow = {
    renderer: row => (
<BootstrapTable data={ row.expand } columns={ sub_columns } />
    )
};

function onAfterSaveCell(row, cellName, cellValue) {
    alert(`Save cell ${cellName} with value ${cellValue}`);
  
    let rowStr = '';
    for (const prop in row) {
      rowStr += prop + ': ' + row[prop] + '\n';
    }
  
    alert('Thw whole row :\n' + rowStr);
  }
  
  function onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing
    return true;
  }
  
  const cellEditProp = {
    mode: 'dbclick',
    blurToSave: true,
    beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
    afterSaveCell: onAfterSaveCell  // a hook for after saving cell
  };

  
function isExpandableRow(row) {
    if (row.id < 2) return true;
    else return false;
  };

function expandComponent(row) {
    console.log("test");
    return (
      <BSTable data={ row.expand } />
    );
  };
class PackageSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fitness_no: this.props.userinfo.fitnessidx,
            name: "",
            stength: 0,
            exercise_link: []
        };
    };


    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    handleOnChange = (e) => {
        console.log(this.state);
        var exercise_pack_no = -1

        fetch("http://localhost:3000/exercise", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                fitness_no: this.state.fitness_no,
                name: this.state.name,
                strength: this.state.strength
            })
        })
        .then(response => response.json())
        .then(response => { exercise_pack_no = response.exercise_pack_no });

        this.state.exercise_link.forEach(element => {
            fetch("http://localhost:3000/exercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    exercise_no: element.exercise_no,
                    exercise_pack_no: exercise_pack_no,
                    order_no: element.order_no,
                    cnt: element.cnt,
                    sec: element.sec,
                    rest: element.rest,
                    setcnt: element.setcnt
                })
            })
            .then(response => response.json())
            .then(response => { alert("새 운동 패키지가 등록되었습니다.") });
        });

    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        const options = {
            expandRowBgColor: 'rgb(242, 255, 163)'
          };
        
        return (
            <div>
            <Header />
            <Navigation />
            <div className='container'>
                <NavLink exact to="/exercise">[운동 설정]</NavLink>
                <NavLink exact to="/exercise/package">[운동 묶음 설정]</NavLink>
                <NavLink exact to="/exercise/assign">[운동 배정 설정]</NavLink>
                <div className='title'>
                <h2>운동 묶음 설정</h2><h4>운동{'>'}운동 묶음 설정</h4>
                </div>

                <div className="ExercisePackageSelect">
                    <div>운동 묶음 선택</div>
                    <hr />
                    <div>
                        <input placeholder="운동 묶음 선택하기"></input>
                        <button>확인</button>
                        <button>추가하기</button>
                    </div>
                </div>
                <div className="ExercisePackageSetting">
                    <p>운동 묶음 설정</p>
                    <hr />
                    <div>
                        <label>묶음 이름
                            <input placeholder="묶음 이름"></input>
                            <button type="submit">저장하기</button>
                        </label>
                    </div>
                    <hr />
<ToolkitProvider
    keyField='no'
    data={ totalExercisePack }
    columns={ columns }
    expandRow={ expandRow }
    striped
    search
>
  {
    props => (
      <div>
        <h3>검색</h3>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }
        />
      </div>
    )
  }
</ToolkitProvider>
                    {/* <table>
                        <caption>운동 묶음 설정 테이블</caption>
                        <thead>
                            <tr>
                                <th>운동 부위</th>
                                <th>운동 이름</th>
                                <th>횟수 단위</th>
                                <th>강도</th>
                                <th>횟수/시간</th>
                                <th>휴식 시간</th>
                                <th>세트 갯수</th>
                                <th>순서 이동</th>
                                <th>제거</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>쉬움</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td>상체</td>
                                <td>미선택</td>
                                <td>횟수</td>
                                <td>보통</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td><button>up</button><button>down</button></td>
                                <td><button>X</button></td>
                            </tr>
                            <tr>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>어려움</td>
                                <td>회</td>
                                <td>초</td>
                                <td>개</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table> */}
                    <button>+</button>
                </div>
                <hr />
            </div>
        </div>
        );
    }
}

const PackageStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}

export default connect(PackageStateToProps, undefined)(PackageSetting);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고