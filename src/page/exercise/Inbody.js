import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';

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

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");
const options = [
    '이름', '핸드폰'
];
const defaultOption = options[0];
let num = '';
class Inbody extends Component {
    
    constructor(props) {
        super(props);

        const search1 = location.search;
        num = (search1.split('='))[1];
        console.log('search1',search1)
        console.log('search1__',(search1.split('='))[1])
        this.state = {
            open:false,
            //member_no:member_no,
            member_no: (search1.split('='))[1],
            search:"",
            item:options[0],
            customerList:[],
            userName:'회원',
            sex:'',
            resi_no:'',
            inbodyList:[]
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
            
        this.cusFetch();
    };
    goLogin = () => {
        this.props.history.push("/");
    }

    cusFetch = () => {
        //alert('요기?',this.state.member_no)
        let url;
        alert(num)
        if(num === '0'){
            //url = "http://"+ip+":3001/inbody?type=all&fn="+this.props.userinfo.fitness_no
            this.setState({inbodyList : []});
        } else{
            url = "http://"+ip+":3001/inbody?type=customer&member_no="+num+"&fn="+this.props.userinfo.fitness_no
            fetch(url, {
                method: "GET",
                headers: {
                  'Content-type': 'application/json'
                },
                })
                .then(response => response.json())
                .then(res => {
                        let arr1 = [];
                        for(let i=(res.length-1) ; i>=0 ; i--){
                            arr1.push({"no":res[i].num,"member_no":res[i].member_no, "height":res[i].height, "measurementDate":moment(res[i].measurementDate).format("YYYY/MM/DD"), "bodyMoisture":res[i].bodyMoisture,"protein":res[i].protein, "mineral":res[i].mineral })
                        }
                        this.setState({inbodyList : arr1});

                        fetch("http://"+ip+":3001/customer?type=select&member_no="+num+"&fn="+this.props.userinfo.fitness_no, {
                            method: "GET",
                            headers: {
                            'Content-type': 'application/json'
                        }
                        })
                        .then(response => response.json())
                        .then(res => {
                            for(let i=0 ; i<res.length ; i++){
                                let sor = res[i].solar_or_lunar===true?"양":"음";
                                let s = res[i].sex===true?"남":"여";

                                this.setState({
                                    userName : res[i].name,
                                    member_no: num,
                                    phone:res[i].phone,
                                    sex:s,
                                    resi_no:res[i].resi_no,
                                })
                                //arr2.push({"no":res[i].member_no, "userName":res[i].name, "sex":s, "phone":res[i].phone, "resi_no":res[i].resi_no })
                            }
                        });
                    });
        }
        
    }

    handleClickOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    choiceUser=(e)=>{
        console.log('value',e.target.value)
        let values = e.target.value.split(',')

        console.log(this.state.inbodyList)

        this.setState({
            userName : values[0],
            member_no: e.target.id,
            phone:values[1],
            sex:values[2],
            resi_no:values[3],
            open:false
        })
        let url = "http://"+ip+":3001/inbody?type=customer&member_no="+num+"&fn="+this.props.userinfo.fitness_no
        fetch(url, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            })
            .then(response => response.json())
            .then(res => {
                    let arr1 = [];
                    for(let i=(res.length-1) ; i>=0 ; i--){
                        arr1.push({"no":res[i].num,"member_no":res[i].member_no, "height":res[i].height, "measurementDate":moment(res[i].measurementDate).format("YYYY/MM/DD"), "bodyMoisture":res[i].bodyMoisture,"protein":res[i].protein, "mineral":res[i].mineral })
                    }
                    this.setState({inbodyList : arr1});
                });
        alert('선택하셨습니다.'+e.target.id)
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    search = () =>{
        console.log('click')
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
                    let sor = res[i].solar_or_lunar===true?"양":"음";
                    let s = res[i].sex===true?"남":"여";
                    //arr.push({"no":res[i].member_no, "userName":res[i].name, "sex":s, "phone":res[i].phone, "resi_no":res[i].resi_no+ " ("+sor+")" })
                    arr.push({"no":res[i].member_no, "userName":res[i].name, "sex":s, "phone":res[i].phone, "resi_no":res[i].resi_no })
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

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        const textOptions = {
            noDataText: '인바디 정보가 없습니다.'
        };

        console.log(',,,,,',this.state.member_no)
        console.log('.....',this.state.inbodyList)
        return (
            <div className='inbody'>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <localNavigation />
                <div className="container">
                     <h2>인바디보기</h2>
                     
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
                        <TableCell>성별</TableCell>
                        <TableCell>생년월일</TableCell>
                        <TableCell>선택</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.customerList ?
                        this.state.customerList.map(c=>(
                            <TableRow>
                                <TableCell>{c.no}</TableCell>
                                <TableCell>{c.userName}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>{c.sex}</TableCell>
                                <TableCell>{c.resi_no}</TableCell>
                                <TableCell>
                                    <DialogActions>
                                        <button type='button' onClick={this.choiceUser} id={c.no} value={[c.userName,c.phone,c.sex,c.resi_no]}>선택</button>
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
                    <label>{this.state.userName}님 반갑습니다.</label><br/>
                    <label>성별 : {this.state.sex}</label><br/>
                    <label>폰번호 : {this.state.phone}</label><br/>
                    <label>생년월일 : {this.state.resi_no}</label>
                    <br/><br/>
                     <Link  to={{pathname:"/assign/add?member_no="+this.state.member_no}} className='btnCustomerNew'>
                        인바디정보추가
                    </Link>
                    <br/><br/>

                    <BootstrapTable data={ this.state.inbodyList } 
                        options={textOptions}
                        tableHeaderClass='tableHeader'
                        tableContainerClass='tableContainer'>
                        <TableHeaderColumn dataField='measurementDate' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } } isKey
                        >날짜</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >키</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체수분</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >단백질</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >무기질</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체지방</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >근육량</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체지방량1</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체중</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >골격근량</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체지방량2</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >BMI</TableHeaderColumn>
                        <TableHeaderColumn dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >체지방률</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}

const InbodyStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(InbodyStateToProps, undefined)(Inbody);