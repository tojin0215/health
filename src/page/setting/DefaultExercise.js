import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

// const ip = '13.124.141.28:3003';
const ip = 'localhost:3000';
const List = [
    {'no':1,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':2,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':3,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':4,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':5,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':6,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':7,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':8,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':9,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':10,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':11,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':12,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':13,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':14,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':15,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
]

class DefaultExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedList: [],
            selectedListId: [],
            exerciseList: [],
            show1:false,
            show2:false,
            show3:false,
            show4:false,
            show5:false,
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        
        this.search("상체");
    };


    goLogin = () => {
        this.props.history.push("/");
    }

    search = (part) =>{
        let it = '2'
        let search = part;
        let v = 0;
        if (/상체/.test(search)){search = search.replace("상체", ""); v = v + 1}
        if (/하체/.test(search)){search = search.replace("하체", ""); v = v + 2}
        if (/전신/.test(search)){search = search.replace("전신", ""); v = v + 4}
        if (/코어/.test(search)){search = search.replace("코어", ""); v = v + 8}
        if (/유산소/.test(search)){search = search.replace("유산소", ""); v = v + 16}

        if (v===0) {alert("부위를 입력바랍니다."); return;}
        search = v

        fetch("http://"+ip+"/exercise?type=search"+it+"&search="+search+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
            let arr = [];
            let arr2 = [];
            for(let i=(res.length-1) ; i>=0 ; i--){
                let part = ", ";
                let part_num = Number(res[i].part);
                if (part_num >= 16) {part = "유산소, " + part; part_num = part_num - 16}
                if (part_num >= 8) {part = "코어, " + part; part_num = part_num - 8}
                if (part_num >= 4) {part = "전신, " + part; part_num = part_num - 4}
                if (part_num >= 2) {part = "하체, " + part; part_num = part_num - 2}
                if (part_num === 1) {part = "상체, " + part;}
                part = part.slice(0, -2)

                arr.push({
                    "no": res[i].exercise_no,
                    "name": res[i].name,
                    "tool": res[i].machine,
                    "aa": part,
                    "set": res[i].default_set_count,
                    "bb": res[i].default_data,
                    "cc": res[i].default_rest_second,
                    "link": res[i].url,
                })
                if (res[i].is_default) {arr2.push(res[i].exercise_no)}
            }
            arr2.reverse();
            this.setState({
                selectedListId : arr2,
                exerciseList : arr,
            });
        });
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    onSelectRow(row, isSelected, e) {
        const exercise_no = row['no']

        this.setState({'selectedList': [...this.state.selectedList, [exercise_no, isSelected]]});

        console.log(this.state.selectedListId);
        if (isSelected) {
            this.setState({'selectedListId': [...this.state.selectedListId, exercise_no]})
        } else {
            this.setState({'selectedListId': this.state.selectedListId.filter(i => i!==exercise_no)})
        }
    }

    selectHandleOnClick(e){
        alert(e.target.id)
    }

    click1=(e)=>{ //상체
        e.preventDefault();
        this.search("상체")
        this.setState({
            show1: !this.state.show1,
            show2:false,
            show3:false,
            show4:false,
            show5:false
        });
    }
    
    click2=(e)=>{ //하체
        e.preventDefault();
        this.search("하체")
        this.setState({
            show2: !this.state.show2,
            show1:false,
            show3:false,
            show4:false,
            show5:false
        });
    }   

    click3=(e)=>{ //전신
        e.preventDefault();
        this.search("전신")
        this.setState({
            show3: !this.state.show3,
            show1:false,
            show2:false,
            show4:false,
            show5:false
        });
    }
    
    click4=(e)=>{ //코어
        e.preventDefault();
        this.search("코어")
        this.setState({
            show4: !this.state.show4,
            show1:false,
            show2:false,
            show3:false,
            show5:false
        });
    }
    
    click5=(e)=>{ //유산소
        e.preventDefault();
        this.search("유산소")
        this.setState({
            show5: !this.state.show5,
            show1:false,
            show2:false,
            show3:false,
            show4:false
        });
    }

    handleOnClick(){
        fetch("http://"+ip+"/exercise?fn="+this.props.userinfo.fitness_no, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({type: 'set_default', data: this.state.selectedList})
        })
        .then(res => res.json())
        .then(res => {
            alert('저장됨')
        })
        .catch(err => console.error(err));
    }
    handleRowSelectAll = (isSelected, rows) => {
        // const exercise_no = row['no']
        let arr = [];
        let arr2 = [];

        rows.forEach(row => {
            const exercise_no = row['no']
            arr.push([exercise_no, isSelected]);
            arr2.push(exercise_no);
        })
        this.setState({'selectedList': [...this.state.selectedList, ...arr]});
        
        if (isSelected) {
            this.setState({'selectedListId': [...this.state.selectedListId, ...arr2]})
        } else {
            this.setState({'selectedListId': this.state.selectedListId.filter(i => !arr2.includes(i))})
        }
    }

    render() {
        const { userinfo } = this.props;

        const options1 = {
            noDataText: '운동 기본값 설정 해주세요.',
            alwaysShowAllBtns: true,
            hideSizePerPage:true
        };

        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            // unselectable: [2],
            selected: this.state.selectedListId,
            onSelect: this.onSelectRow,
            onSelectAll: this.handleRowSelectAll,
            bgColor: 'mint'
          };

        return (
            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            <div className='title'>
                <div className='titleIn'>
                    <h2>운동 기본묶음 설정</h2><h4>설정{'>'}운동 기본묶음 설정</h4>
                </div>
            </div>
            <div className='container'>
                <NavLink exact to="/exercise">[운동 추가]</NavLink>
                <NavLink exact to="/setting/default">[운동 기본묶음 설정]</NavLink>

                <div>
                <button type="button" id="1" onClick={this.click1}>상체</button>
                <button type="button" id="2"onClick={this.click2}>하체</button>
                <button type="button" id="3" onClick={this.click3}>전신</button>
                <button type="button" id="4" onClick={this.click4}>코어</button>
                <button type="button" id="5" onClick={this.click5}>유산소</button>

                {this.state.show1?
                    <div>
                    <label>상체</label>
                        <BootstrapTable data={ this.state.exerciseList } hover 
                    pagination={ this.state.exerciseList.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    selectRow={selectRowProp}
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>no</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >운동이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동도구</TableHeaderColumn>
                    <TableHeaderColumn dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동부위</TableHeaderColumn>
                    <TableHeaderColumn dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >세트</TableHeaderColumn>
                    <TableHeaderColumn dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >횟수</TableHeaderColumn>
                    <TableHeaderColumn dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >휴식시간</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >링크</TableHeaderColumn>
                </BootstrapTable>   

                    </div>
                :null} 
                
                {this.state.show2?
                    <div>
                    <label>하체</label>
                        <BootstrapTable data={ this.state.exerciseList } hover 
                    pagination={ this.state.exerciseList.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    selectRow={selectRowProp}
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>no</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >운동이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동도구</TableHeaderColumn>
                    <TableHeaderColumn dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동부위</TableHeaderColumn>
                    <TableHeaderColumn dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >세트</TableHeaderColumn>
                    <TableHeaderColumn dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >횟수</TableHeaderColumn>
                    <TableHeaderColumn dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >휴식시간</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >링크</TableHeaderColumn>
                </BootstrapTable>   

                    </div>
                :null}
                {this.state.show3?
                    <div>
                    <label>전신</label>
                        <BootstrapTable data={ this.state.exerciseList } hover 
                    pagination={ this.state.exerciseList.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    selectRow={selectRowProp}
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>no</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >운동이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동도구</TableHeaderColumn>
                    <TableHeaderColumn dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동부위</TableHeaderColumn>
                    <TableHeaderColumn dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >세트</TableHeaderColumn>
                    <TableHeaderColumn dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >횟수</TableHeaderColumn>
                    <TableHeaderColumn dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >휴식시간</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >링크</TableHeaderColumn>
                </BootstrapTable>   

                    </div>
                :null}
                {this.state.show4?
                    <div>
                    <label>코어</label>
                        <BootstrapTable data={ this.state.exerciseList } hover 
                    pagination={ this.state.exerciseList.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    selectRow={selectRowProp}
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>no</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >운동이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동도구</TableHeaderColumn>
                    <TableHeaderColumn dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동부위</TableHeaderColumn>
                    <TableHeaderColumn dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >세트</TableHeaderColumn>
                    <TableHeaderColumn dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >횟수</TableHeaderColumn>
                    <TableHeaderColumn dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >휴식시간</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >링크</TableHeaderColumn>
                </BootstrapTable>   

                    </div>
                :null}
                {this.state.show5?
                    <div>
                    <label>유산소</label>
                        <BootstrapTable data={ this.state.exerciseList } hover 
                    pagination={ this.state.exerciseList.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    selectRow={selectRowProp}
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>no</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >운동이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='tool'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동도구</TableHeaderColumn>
                    <TableHeaderColumn dataField='aa'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >운동부위</TableHeaderColumn>
                    <TableHeaderColumn dataField='set' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >세트</TableHeaderColumn>
                    <TableHeaderColumn dataField='bb' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >횟수</TableHeaderColumn>
                    <TableHeaderColumn dataField='cc' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >휴식시간</TableHeaderColumn>
                    <TableHeaderColumn dataField='link' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                    >링크</TableHeaderColumn>
                </BootstrapTable>   

                    </div>
                :null}
                </div>
                
                <br/><button type="button" onClick={this.handleOnClick}>저장하기</button>
            </div>
        </div>
        );
    }
}

const PackageStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(PackageStateToProps, undefined)(DefaultExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고