import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

// const ip = '13.124.141.28';
const ip = '127.0.0.1';
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
            show1:false,
            show2:false,
            show3:false,
            show4:false,
            show5:false,
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        
    };

    goLogin = () => {
        this.props.history.push("/");
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    onSelectRow(row, isSelected, e) {
        const exercise_no = row['no']

        this.setState({'selectedList': [...this.state.selectedList, [exercise_no, isSelected]]})
        console.log(this.state.selectedList)
        if (isSelected) {
          alert(`You just selected '${row['name']}'`)
        }
    }

    selectHandleOnClick(e){
        alert(e.target.id)
    }

    click1=(e)=>{ //상체
        e.preventDefault();
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
        this.setState({
            show5: !this.state.show5,
            show1:false,
            show2:false,
            show3:false,
            show4:false
        });
    }

    handleOnClick(){
        fetch("http://"+ip+":3001/exercise",{
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({type: 'set_default', data: this.state.selectedList})
        })
        .then(res => res.json())
        .then(res => {
            alert('저장됨')
            // if (res['status'] === 200) {alert('저장됨')}
        })
        .catch(err => console.error(err));
        // this.state.selectedList.forEach(element => {
        //     console.log(element)
        //     fetch("http://"+ip+":3001/exercise",{
        //         method: "GET",
        //         headers: {
        //         'Content-type': 'application/json'
        //         },
        //         body: JSON.stringify()
        //     });
        // });
        // for(let i=(res.length-1) ; i>=0 ; i--){

        //     alert('저장')
        // }
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        const options1 = {
            noDataText: '운동 기본값 설정 해주세요.',
            alwaysShowAllBtns: true,
            hideSizePerPage:true
        };

        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            //unselectable: [2],
            //selected: [1],
            onSelect: this.onSelectRow,
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
                        <BootstrapTable data={ List } hover 
                    //pagination={ List.length > 1 }
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
                        <BootstrapTable data={ List } hover 
                    //pagination={ List.length > 1 }
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
                        <BootstrapTable data={ List } hover 
                    //pagination={ List.length > 1 }
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
                        <BootstrapTable data={ List } hover 
                    //pagination={ List.length > 1 }
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
                        <BootstrapTable data={ List } hover 
                    //pagination={ List.length > 1 }
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