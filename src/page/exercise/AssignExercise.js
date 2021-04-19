import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const ip = '13.124.141.28';

function onChangeHandler(a,e){
    [e.target.a]=e.target.value
}


let List = [
    {'no':1,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':2,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':3,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':4,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':5,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':6,'name':'CCC','tool':'바벨','aa':'전신','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':7,'name':'AAA','tool':'바벨','aa':'상체','set':'3','bb':'10','cc':'10분','link':'www.www.www'},
    {'no':8,'name':'BBB','tool':'바벨','aa':'하체','set':'3','bb':'10','cc':'10분','link':'www.www.www'}
]

const options = [
    '이름', '핸드폰'
];
const defaultOption = options[0];

class AssignExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            member_no:'',
            open:false,
            search:"",
            item:options[0],
            userName:'회원',
            customerList:[],
            show1:false,
            show2:false,
            show3:false,
            show4:false,
            show5:false,
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        //this.handleChange = this.handleChange.bind(this);
    };

    goLogin = () => {
        this.props.history.push("/");
    }

    handleClickOpen() {
        this.setState({
            open: true
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

    choiceUser=(e)=>{
        console.log('value',e.target.value)
        let values = e.target.value.split(',')
        
        this.setState({
            userName : values[0],
            member_no: e.target.id,
            open:false
        })
        alert('선택하셨습니다.')
    }

    search = () =>{
        let it = '0'
        if(this.state.item === "이름"){
            it = '0'
        }else if(this.state.item === "핸드폰"){
            it = '1'
        }
        fetch("http://"+ip+":3001/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
                let arr = [];
                for(let i=0 ; i<res.length ; i++){
                    arr.push({"no":res[i].member_no, "userName":res[i].name, "phone":res[i].phone})
                }
                this.setState({customerList : arr});
            });
    }

    selectItem = (e) =>{
        if(e.value == "이름"){
            this.setState({item:"이름"})
        }
        else if(e.value == "핸드폰"){
            this.setState({item:"핸드폰"})
        }
    }
    selectHandleOnClick(e){
        alert(e.target.id)
    }

    onSelectRow(row, isSelected, e) {
        if (isSelected) {
          alert(`You just selected '${row['name']}'`)
        }
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

    loadExerciseList() {
        let url = 'http://' + ip + ":3001" + "/assignexercise"
        + "?type=" + "member"
        + "&fitness_no=" + this.props.userinfo.fitness_no
        + "&member_no=" + this.props.userinfo.member_no

        let inits = {
            methods: "GET",
            headers: {
                'Content-type': 'application/json'
            }
        }

        fetch(url, inits)
        .then(res => {
            last_group_id = res[res.length - 1].group_id;
            
            let arr = [];
            for(let i=0 ; i<res.length ; i++){
                console.log(res[i]);
                arr.push(res[i]);
                // arr.push({
                //     "no": res[i].member_no,
                //     "name": res[i].name,
                //     "part": res[i].part
                // })
            }
            this.setState({exerciseList : arr});
        });
    }

    handleOnClick(){
        alert('선택')
        
        // let it = '0'
        // if(this.state.item === "이름"){
        //     it = '0'
        // }else if(this.state.item === "핸드폰"){
        //     it = '1'
        // }
        // let url = 'http://' + ip + ":3001" + "/assignexercise"
        // + "?type=" + "member"
        // + "&fitness_no=" + this.props.userinfo.fitness_no
        // + "&member_no=" + this.props.userinfo.member_no

        // let inits = {
        //     methods: "GET",
        //     headers: {
        //         'Content-type': 'application/json'
        //     }
        // }

        // let last_group_id = -1;

        // fetch(url, inits)
        // .then(res => {
        //     last_group_id = res[res.length - 1].group_id;
        // });
        
        // fetch(url, inits)
        // .then(res => {
        //     let arr = [];
        //     for(let i=0 ; i<res.length ; i++){
        //         arr.push({
        //             "no": res[i].member_no,
        //             "userName": res[i].name,
        //             "phone": res[i].phone
        //         })
        //     }
        //     this.setState({customerList : arr});
        // });
        
        //this.props.history.push("/assign/check")
    }

    render() {
        const { userinfo } = this.props;
        this.loadExerciseList();
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        const options1 = {
            noDataText: '추가된 운동이 없습니다.',
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
                    <h2>운동 배정</h2><h4>운동 {'>'} 운동 배정</h4>
                </div>
            </div>
            <div className='container'>
                <NavLink exact to="/assign">[운동 배정 설정]</NavLink>
                <Link to={{pathname:"/assign/inbody?member_no="+0}}>[고객인바디]</Link>
            
                <div>
            <button type='button' onClick={this.handleClickOpen}>
                회원검색
            </button>
            <Dialog open={this.state.open} onClose={this.handleClose} maxWidth='lg'>
                <DialogTitle>고객 검색</DialogTitle>
                <DialogContent>
                    <div className='customerSearch'>
                        <Dropdown className='searchDrop' options={options} onChange={this.selectItem} value={this.state.item} placeholder="Select an option" />
                        <input type="text" id='search' checked={this.state.search} onChange={this.handleChange} />
                        <button type="button" onClick={this.search}> 고객 검색 </button>
                    </div>
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>폰번호</TableCell>
                            <TableCell>선택</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.customerList ?
                            //filteredComponents(this.state.customerList)
                                this.state.customerList.map(c => (
                                    <TableRow>
                                        <TableCell>{c.no}</TableCell>
                                        <TableCell>{c.userName}</TableCell>
                                        <TableCell>{c.phone}</TableCell>
                                        <TableCell>
                                        <DialogActions>
                                            <button type='button' onClick={this.choiceUser} id={c.no} value={[c.userName,c.phone]}>선택</button>
                                        </DialogActions>
                                    </TableCell>
                                    </TableRow>
                            )) 
                            :
                            <TableRow>
                                <TableCell colSpan="6" align="center">
                                </TableCell>
                            </TableRow>
                            }
                        </TableBody>
                        </Table>


                    </DialogContent>
                    <DialogActions>
                        <button type='button' onClick={this.handleClose}>닫기</button>
                    </DialogActions>
                </Dialog>
                </div>
                <label>{this.state.userName}님 운동배정입니다.</label>
                <br />
                
                <hr></hr>
                <div>
                <label>{this.state.userName}인바디</label><br/>
                <label>키 : </label><br/>
                <label>체중 : </label><br/>
                <label>체지방 : </label><br/>
                <label>근육량 : </label><br/>
                </div>
                <hr></hr>

                <h3>운동배정</h3>
                <hr></hr>
                <h5>운동 묶음 선택(기본값)</h5>
                <div style={{flexDirection:'row'}}>
                <label><input type="checkBox" id="1" name="defaultExercise" value="상체" onClick={this.selectHandleOnClick}/>상체</label>
                <label><input type="checkBox" id="2" name="defaultExercise" value="하체" onClick={this.selectHandleOnClick}/>하체</label>
                <label><input type="checkBox" id="3" name="defaultExercise" value="전신" onClick={this.selectHandleOnClick}/>전신</label>
                <label><input type="checkBox" id="4" name="defaultExercise" value="코어" onClick={this.selectHandleOnClick}/>코어</label>
                <label><input type="checkBox" id="5" name="defaultExercise" value="유산소" onClick={this.selectHandleOnClick}/>유산소</label>
                </div>

                <h5>운동 개별 선택</h5>
                <div>
                <button type="button" id="1" onClick={this.click1}>상체</button>
                {this.state.show1?
                    <div>
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

                <div>
                <button type="button" id="2"onClick={this.click2}>하체</button>
                {this.state.show2?
                    <div>
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
                
                <div>
                <button type="button" id="3" onClick={this.click3}>전신</button>
                {this.state.show3?
                    <div>
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
                
                <div>
                <button type="button" id="4" onClick={this.click4}>코어</button>
                {this.state.show4?
                    <div>
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
                
                <div>
                <button type="button" id="5" onClick={this.click5}>유산소</button>
                {this.state.show5?
                    <div>
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

                <br/><br/>
                <Link to={{pathname:"/assign/check?member_no="+1}}>
                <button type="button" onClick={this.handleOnClick}>배정 확인하기</button>
                </Link>
            </div>
        </div>
        );
    }
}

const AssignExerciseStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(AssignExerciseStateToProps, undefined)(AssignExercise);
//새 page 추가 시 guide : 이 폴더 안에 페이지 하나 더 만든 후, src/component/app.js && src/page/index 함께 변경해주세요
//잘 모르겠으면 customer폴더 참고