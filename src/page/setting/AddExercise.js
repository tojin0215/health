import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Dropdown from 'react-dropdown';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../styles/exercise/Exercise.css';

const ip = '13.124.141.28';
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


require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");
const options = [
    '이름', '운동기구', '운동부위'
  ];
const defaultOption = options[0];

class AddExercise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search:"",
            item:options[0],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        
    };

    goLogin = () => {
        this.props.history.push("/");
    }

    handleOnClick(){
        alert('운동 저장');
        this.setState({
            open: false
        });
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };
    
    search = () =>{
        let it = '0'
        if(this.state.item === "이름"){
            it = '0'
        }else if(this.state.item === "운동기구"){
            it = '1'
        }else if(this.state.item === "운동부위"){
            it = '2'
        }
        //customer 참고해서 검색기능 넣기

        // fetch("http://"+ip+":3001/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
        //     method: "GET",
        //     headers: {
        //       'Content-type': 'application/json'
        //   }
        // })
        // .then(response => response.json())
        // .then(res => {
        //         // let arr = [];
        //         // for(let i=(res.length-1) ; i>=0 ; i--){
        //         //     let sor = res[i].solar_or_lunar===true?"양":"음";
        //         //     let s = res[i].sex===true?"남":"여";
        //         //     arr.push({"no":res[i].member_no, "name":res[i].name, "sex":s, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
        //         // }
        //         // this.setState({customerList : arr});
        //     });
    }
    selectItem = (e) =>{
        if(e.value == "이름"){
            this.setState({item:"이름"})
        }
        else if(e.value == "운동기구"){
            this.setState({item:"운동기구"})
        }else if(e.value == "운동부위"){
            this.setState({item:"운동부위"})
        }
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        const options1 = {
            noDataText: '등록된 운동이 없습니다.',
            alwaysShowAllBtns: true,
            hideSizePerPage:true,
            sizePerPage:5
        };

        return (
            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            <div className='title'>
                <div className='titleIn'>
                    <h2>운동 추가</h2><h4>운동 {'>'} 운동 추가</h4>
                </div>
            </div>
            <div className='container'>
                {/* <NavLink exact to="/exercise">[운동 추가]</NavLink>
                <NavLink exact to="/setting/default">[운동 기본묶음 설정]</NavLink> */}
            
                <div className='subTitle'>운동 정보 입력</div>
                <hr /> 
                <form style={{flexDirection:'column'}}>
                <div className="input-row">
                                <label className="label-description">운동 이름</label>
                                <input id="name" placeholder="name" onChange={this.handleChange} />
                            </div>
                            
                            <div className="input-row">
                                <label className="label-description">운동 기구</label>
                                <input id="tool" placeholder="machine" onChange={this.handleChange} />
                            </div>
                            
                            <div className="input-row">
                                <label className="label-description">부위</label>
                                <div className="part">
                                   <label><input type="checkBox" value='1' onChange={this.handleChange}/>상체</label>
                                   <label><input type="checkBox" value='2' onChange={this.handleChange}/>하체</label>
                                   <label><input type="checkBox" value='3' onChange={this.handleChange}/>전신</label>
                                   <label><input type="checkBox" value='4' onChange={this.handleChange}/>코어</label>
                                   <label><input type="checkBox" value='5' onChange={this.handleChange}/>유산소</label>
                                </div>
                            </div>

                            <div className="input-row">
                                <label>세트</label>
                                <input id="세트" placeholder="machine" onChange={this.handleChange}/>
                                <label>횟수</label>
                                <input id="횟수" placeholder="machine" onChange={this.handleChange}/>
                                <label>휴식시간</label>
                                <input id="휴식시간" placeholder="machine" onChange={this.handleChange}/>
                            </div>
                            <div className="input-row">
                                <label className="label-description">영상 링크</label>
                                <input id="link" placeholder="link" onChange={this.handleChange} />
                            </div>
                            
                            <button type="button" onClick={this.handleOnClick}>저장하기</button>
                </form>
                <br></br>
                <div className='customerSearch'>
                        <Dropdown className='searchDrop' options={options} onChange={this.selectItem} value={this.state.item} placeholder="Select an option" />
                        <input type="text" id='search' checked={this.state.search} onChange={this.handleChange} />
                        <button type="button" onClick={this.search}> 운동 검색 </button>
                    </div>
                <BootstrapTable data={ List } hover 
                    pagination={ List.length > 1 }
                    options={options1}
                    tableHeaderClass='tableHeader'  
                    tableContainerClass='tableContainer'
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        isKey>번호</TableHeaderColumn>
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
                <br />
            </div>
            
            <Link to="/setting/default">
                            <Button color="primary">
                            운동 묶음 설정
                            </Button>
                        </Link>
        </div>
        );
    }
}

const AddExerciseStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(AddExerciseStateToProps, undefined)(AddExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고

//와 멋져요