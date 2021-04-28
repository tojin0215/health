import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
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

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/exercise/Inbody.css';

import {getStatusRequest} from '../../action/authentication';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
//import { Chart } from "react-google-charts";
import Chart from "react-apexcharts";

//const ip = '13.124.141.28:3002';
const ip = 'localhost:3000';

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

        const search1 = location.pathname;
        //num = (search1.split('/'))[3];
        num = Number(this.props.location.state.member_no)

        this.state = {
            open:false,
            member_no:Number(this.props.location.state.member_no),
            //member_no: (search1.split('/'))[3],
            inbody_no:'',
            inbody_noList:[],
            search:"",
            item:options[0],
            customerList:[],
            userName:'회원',
            sex:'',
            resi_no:'',
            inbodyList:[],
            age:'',
            startDate: new Date("2021-01-01"),
            endDate: new Date(),
            show:false,
            startNum:'',
            endNum:'',
            inbodySelect:[],
            //selectDate:[],
            showChart:false,

            series: [{
                name: "Session Duration",
                data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
              },
              {
                name: "Page Views",
                data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
              },
              {
                name: 'Total Visits',
                data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
              }
            ],
            chartOptions: {
              chart: {
                id:'인바디결과',
                height: 500,
                type: 'line',
                zoom: {
                  enabled: true
                },
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: 2,
                curve: 'straight',
                dashArray: 0
              },
              title: {
                text: '인바디 변화',
                align: 'left'
              },
              legend: {
                tooltipHoverFormatter: function(val, opts) {
                  return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                }
              },
              markers: {
                size: 0,
                hover: {
                  sizeOffset: 6
                }
              },
              xaxis: {
                categories: [
                   '체중','체수분','단백질','무기질','체지방','근육량','체지방량1','골격근량','체지방량2','BMI','체지방률'
                ],
              },
              tooltip: {
                y: [
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      }
                    }
                  }
                ]
              },
              grid: {
                borderColor: '#f1f1f1',
              }
            },
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);

        this.cusFetch();
    };
    goLogin = () => {
        this.props.history.push("/");
    }

    componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
   
        // get loginData from cookie
        let loginData = getCookie('key');
        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined"){
            this.props.history.push('/');
            return;
        } 
   
        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));
        // if not logged in, do nothing
        if(!loginData.isLoggedIn){
            this.props.history.push('/');
            return;
        } 
   
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        id: ''
                    };
   
                    document.cookie='key=' + btoa(JSON.stringify(loginData));
   
                    // and notify
                    alert("Your session is expired, please log in again")
                }
            }
        );
    }
    cusFetch = () => {
        let url;
        //alert(num)
        if(num === '0'){
            //url = "http://"+ip+":3003/inbody?type=all&fn="+this.props.userinfo.fitness_no
            this.setState({inbodyList : []});
        } else{
            url = "http://"+ip+"/inbody?type=customer&member_no="+num+"&fn="+this.props.userinfo.fitness_no
            fetch(url, {
                method: "GET",
                headers: {
                  'Content-type': 'application/json'
                },
                })
                .then(response => response.json())
                .then(res => {
                        let arr1 = [];
                        let inbody_no1 = [];
                        for(let i=(res.length-1) ; i>=0 ; i--){
                            arr1.push({"no":res[i].num,"member_no":res[i].member_no,"inbody_no":res[i].inbody_no, "height":res[i].height, "measurementDate":moment(res[i].measurementDate).format("YYYY/MM/DD"), "bodyMoisture":res[i].bodyMoisture,"protein":res[i].protein, "mineral":res[i].mineral, "bodyFat":res[i].bodyFat, "muscleMass":res[i].muscleMass, "bodyFatMass1":res[i].bodyFatMass1, "weight":res[i].weight, "skeletalMuscleMass":res[i].skeletalMuscleMass,"bodyFatMass2":res[i].bodyFatMass2, "BMI":res[i].BMI, "PercentBodyFat":res[i].PercentBodyFat});
                            inbody_no1.push(res[i].inbody_no)                  
                        }
                        this.setState({
                            inbodyList : arr1, 
                            inbody_no:inbody_no1,
                        });

                        fetch("http://"+ip+"/customer?type=select&member_no="+num+"&fn="+this.props.userinfo.fitness_no, {
                            method: "GET",
                            headers: {
                            'Content-type': 'application/json'
                        }
                        })
                        .then(response => response.json())
                        .then(res => {
                            for(let i=0 ; i<res.length ; i++){
                                let s = res[i].sex===true?"남":"여";
                                let age = this.calAge(res[i].resi_no) // 만나이

                                this.setState({
                                    userName : res[i].name,
                                    member_no: num,
                                    phone:res[i].phone,
                                    sex:s,
                                    resi_no:res[i].resi_no,
                                    age:age,
                                })
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

    calAge(data){ //만 나이 계산
        const today = new Date();
        let year = (data).substring(0,2)
        if(parseInt(year) >= '00' && parseInt(year) <=30){
            year = 20+year
        }else{
            year = 19+year
        }
        let month = (data).substring(2,4)-1
        let day = (data).substring(4,6)
        let birthday = new Date(year,month,day)
        
        let age = today.getFullYear()-birthday.getFullYear();
        let m = today.getMonth()-birthday.getMonth();

        if(m<0 || (m === 0 && today.getDate() < birthday.getDate())){
            age --;
        }
        return age;        
    }

    choiceUser=(e)=>{
        console.log('value',e.target.value)
        let values = e.target.value.split(',')

        let age = this.calAge(values[3]) // 만나이
        console.log(this.state.inbodyList)

        this.setState({
            userName : values[0],
            member_no: e.target.id,
            phone:values[1],
            sex:values[2],
            resi_no:values[3],
            age:age,
            open:false
        })
        let url = "http://"+ip+"/inbody?type=customer&member_no="+e.target.id+"&fn="+this.props.userinfo.fitness_no
        fetch(url, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            })
            .then(response => response.json())
            .then(res => {
                let arr = [];
                let inbody_no1 = [];
                for(let i=(res.length-1) ; i>=0 ; i--){
                    arr.push({"no":res[i].num,"member_no":res[i].member_no,"inbody_no":res[i].inbody_no, "height":res[i].height, "measurementDate":moment(res[i].measurementDate).format("YYYY/MM/DD"), "bodyMoisture":res[i].bodyMoisture,"protein":res[i].protein, "mineral":res[i].mineral, "bodyFat":res[i].bodyFat, "muscleMass":res[i].muscleMass, "bodyFatMass1":res[i].bodyFatMass1, "weight":res[i].weight, "skeletalMuscleMass":res[i].skeletalMuscleMass,"bodyFatMass2":res[i].bodyFatMass2, "BMI":res[i].BMI, "PercentBodyFat":res[i].PercentBodyFat})
                    inbody_no1.push(res[i].inbody_no)  
                }
                this.setState({
                    inbodyList : arr, 
                    inbody_no:inbody_no1[0],
                    inbody_noList:inbody_no1.reverse()});
            });
        alert('선택하셨습니다.')
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    handleOnClick = (e) => {
        if(this.state.member_no === '0'){
            alert('선택된 회원이 없습니다. 회원을 선택 해주세요.')
        }
        let startTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate())
        let endTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), (this.state.endDate.getDate()+1))
        console.log('clickclickclick')
        fetch('http://'+ip+'/inbody?type=select&startDate='+startTime+'&endDate='+endTime+'&member_no='+this.state.member_no+'&fn='+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
          })
            .then(response => response.json())
            .then(res => {
                //alert('res'+res)
                if(res.length ==0){
                    //alert('없음')                        
                    this.setState({
                        inbodyList:[],
                    })
                } else{
                    let arr1 = [];
                    for(let i=(res.length-1) ; i>=0 ; i--){
                        arr1.push({"no":res[i].num,"member_no":res[i].member_no,"inbody_no":res[i].inbody_no, "height":res[i].height, "measurementDate":moment(res[i].measurementDate).format("YYYY/MM/DD"), "bodyMoisture":res[i].bodyMoisture,"protein":res[i].protein, "mineral":res[i].mineral, "bodyFat":res[i].bodyFat, "muscleMass":res[i].muscleMass, "bodyFatMass1":res[i].bodyFatMass1, "weight":res[i].weight, "skeletalMuscleMass":res[i].skeletalMuscleMass,"bodyFatMass2":res[i].bodyFatMass2, "BMI":res[i].BMI, "PercentBodyFat":res[i].PercentBodyFat
                    })
                    }
                    this.setState({inbodyList : arr1});
                }
                
                //alert('조회완료')
            }); 
    }

    search = () =>{
        console.log('click')
        let it = '0'
        if(this.state.item === "이름"){
            it = '0'
        }else if(this.state.item === "핸드폰"){
            it = '1'
        }
        fetch("http://"+ip+"/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
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

    selectItem1 = (e) =>{
        this.setState({
            startNum:e.value
        })
    }

    selectItem2 = (e) =>{
        this.setState({
            endNum:e.value
        })
    }

    clickInbody=()=>{
        if(Number(this.state.startNum)>Number(this.state.endNum)){
            alert('회차를 다시 선택해주세요.')
        } else{
            //alert(this.state.startNum+'~'+this.state.endNum+' 인바디 정보 불러오기')
            let url = "http://"+ip+"/inbody?type=inbodySelect&startNum="+this.state.startNum+"&endNum="+this.state.endNum+"&member_no="+this.state.member_no+"&fn="+this.props.userinfo.fitness_no
            fetch(url, {
                method: "GET",
                headers: {
                  'Content-type': 'application/json'
                },
                })
                .then(response => response.json())
                .then(res => {
                        let arr = [];
                        let date = [];
                        //alert(res.length)
                        for(let i=0 ; i<res.length; i++){
                            arr.push({"name":res[i].inbody_no+'회, '+moment(res[i].measurementDate).format("YYYY/MM/DD"), "data":[res[i].weight, res[i].bodyMoisture, res[i].protein, res[i].mineral, res[i].bodyFat, res[i].muscleMass, res[i].bodyFatMass1, res[i].skeletalMuscleMass, res[i].bodyFatMass2, res[i].BMI, res[i].PercentBodyFat]});
                            date.push(moment(res[i].measurementDate).format("YYYY/MM/DD"))
                            //console.log(i,'여기',arr)
                        }
                        this.setState({
                            series : arr, 
                            showChart : true
                            //selectDate:['Day',date]
                        });

                    });
        }
    }

    handleClickAway=()=>{
        this.setState({
            show:false,
            showChart:false,
            series:[]
        })
    }

    clickOpen=()=>{
        if(this.state.member_no == '0'){
            alert('회원을 선택해주세요.')
        } else{
            this.setState({show:true})
            //(this.state.userName+'님의 인바디')
        }
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        const textOptions = {
            noDataText: '인바디 정보가 없습니다.',
            alwaysShowAllBtns: true,
            //hideSizePerPage:true
            sizePerPageList: [{
                text: '10', value: 10
              }, {
                text: '50', value: 50
              }, {
                text: '100', value: 100
            }]
        };

        console.log('inbodyList.....',this.state.inbodyList)
        return (
            <div className='inbody'>
                <div className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin}/>
                    <div className='localNavigation'>
                        <div className='container'>
                            <h2>
                                인바디 정보
                            </h2>
                            <div className='breadCrumb'>
                                <Link to='/home'>HOME</Link>
                                <span>&#62;</span>
                                <Link to='/assign'>운동 배정</Link>
                                <span>&#62;</span>
                                <Link to='#'>인바디 정보</Link>
                            </div>{/*.breadCrumb */}
                        </div>{/*.container */}
                    </div>{/*.localNavigation */}
                </div>{/*.header */}
                
            <ClickAwayListener onClickAway={this.handleClickAway}> 
                <div className="container">
                    <section className='inbodyCustomer'>
                        <div>
                            <button
                            type='button'
                            onClick={this.handleClickOpen}
                            >
                                회원검색
                            </button>
                            <Dialog
                            open={this.state.open}
                            onClose={this.handleClose}
                            maxWidth='lg'
                            >
                                <DialogTitle>
                                    고객 검색
                                </DialogTitle>
                                <DialogContent>
                                    <div className='customerSearch'>
                                        <Dropdown
                                        className='searchDrop'
                                        options={options}
                                        onChange={this.selectItem}
                                        value={this.state.item}
                                        placeholder="Select an option"
                                        />{/*.searchDrop */}
                                        <input
                                        type="text"
                                        id='search'
                                        checked={this.state.search}
                                        onChange={this.handleChange}
                                        />{/*#search */}
                                        <button
                                        type="button"
                                        onClick={this.search}
                                        >
                                            고객 검색
                                        </button>
                                    </div>{/*.customerSearch */}
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
                                                        <TableCell>
                                                            {c.no}
                                                        </TableCell>
                                                        <TableCell>
                                                            {c.userName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {c.phone}
                                                        </TableCell>
                                                        <TableCell>
                                                            {c.sex}
                                                        </TableCell>
                                                        <TableCell>
                                                            {c.resi_no}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DialogActions>
                                                                <button
                                                                type='button'
                                                                onClick={this.choiceUser}
                                                                id={c.no}
                                                                value={[c.userName,c.phone,c.sex,c.resi_no]}
                                                                >
                                                                    선택
                                                                </button>
                                                            </DialogActions>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            :
                                            <TableRow>
                                                <TableCell
                                                colSpan="6"
                                                align="center"
                                                >
                                                </TableCell>
                                            </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </DialogContent>
                                <DialogActions>
                                    <button type='button' onClick={this.handleClose}>
                                        닫기
                                    </button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <h3>
                            <span>
                                {this.state.userName}
                            </span>
                            님 인바디 정보입니다
                        </h3>
                        <div>
                            <label>
                                성별 : {this.state.sex}
                            </label>
                            <label>
                                폰번호 : {this.state.phone}
                            </label>
                            <label>
                                생년월일 : {this.state.resi_no}
                            </label>
                            <label>
                                나이 : 만 {this.state.age}세
                            </label>
                        </div>
                        <article className='waySub'>
                            <Link
                            to={{pathname:"/assign/add",
                            state: {
                                inbody_no: this.state.inbody_no,
                                member_no : this.state.member_no
                                },
                            }}
                            >
                                <button>
                                    인바디정보추가
                                </button>
                            </Link>{/*.btnCustomerNew */}
                                <button onClick={this.clickOpen}>
                                    인바디변화보기
                                </button>
                        </article>{/*.waySub */}
                    </section>{/*.inbodyCustomer */}
                    <div className='inbodyListUtill'>
                        <DatePicker
                        selected={ this.state.startDate }
                        selectsStart
                        maxDate={new Date()}
                        onChange={(date)=> this.setState({startDate : date})}
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                        />
                        <text>
                            ~ 
                        </text>
                        <DatePicker
                        selected={ this.state.endDate }
                        selectsEnd
                        minDate={this.state.startDate}
                        maxDate={new Date()}
                        onChange={(date)=> this.setState({endDate : date})}
                        name="endDate"
                        dateFormat="MM/dd/yyyy"
                        />
                        <button
                        type="button"
                        onClick={this.handleOnClick}
                        >
                            조회하기
                        </button>
                    </div>
                    <BootstrapTable
                    data={ this.state.inbodyList } 
                    options={textOptions}
                    pagination={ this.state.inbodyList.length > 1 }
                    tableHeaderClass='tableHeader'
                    tableContainerClass='tableContainer'>
                        <TableHeaderColumn
                        dataField='inbody_no'
                        thStyle={ { 'textAlign': 'center', 'width':'35px' } }
                        tdStyle={ { 'textAlign': 'center','width':'35px'  } }
                        isKey
                        >
                            no
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='measurementDate'
                        thStyle={ { 'textAlign': 'center', 'width':'100px' } }
                        tdStyle={ { 'textAlign': 'center','width':'100px'  } }
                        >
                            날짜
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='height' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            키
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='bodyMoisture' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체수분
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='protein' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            단백질
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='mineral' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            무기질
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='bodyFat' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체지방
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='muscleMass' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            근육량
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='bodyFatMass1' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체지방량1
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='weight' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체중
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='skeletalMuscleMass' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            골격근량
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='bodyFatMass2' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체지방량2
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='BMI' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            BMI
                        </TableHeaderColumn>
                        <TableHeaderColumn
                        dataField='PercentBodyFat' 
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >
                            체지방률
                        </TableHeaderColumn>
                    </BootstrapTable>
                    
                    {this.state.show?
                        <div>
                            <label>{this.state.userName}님의 인바디 변화 입니다.</label>
                            <button onClick={this.handleClickAway}>X</button>
                            <Dropdown
                                className='searchDrop'
                                options={this.state.inbody_noList}
                                onChange={this.selectItem1}
                                //value={this.state.item}
                                placeholder="선택"
                            />
                            <label>~</label>
                            <Dropdown
                                className='searchDrop'
                                options={this.state.inbody_noList}
                                onChange={this.selectItem2}
                                //value={this.state.item}
                                placeholder="선택"
                            />
                            <button onClick={this.clickInbody}>조회하기</button>
                            {/* <Chart
                                width={'600px'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={[
                                    [
                                    'Day',
                                    '2021.04.21',
                                    '2021.05.21',
                                    '2021.06.21',
                                    ],
                                    [1, 37.8, 80.8, 41.8],
                                    [2, 30.9, 69.5, 32.4],
                                    [3, 25.4, 57, 25.7],
                                    [4, 11.7, 18.8, 10.5],
                                    [5, 11.9, 17.6, 10.4],
                                    [6, 8.8, 13.6, 7.7],
                                    [7, 7.6, 12.3, 9.6],
                                    [8, 12.3, 29.2, 10.6],
                                    [9, 16.9, 42.9, 14.8],
                                    [10, 12.8, 30.9, 11.6],
                                    [11, 5.3, 7.9, 4.7],
                                    [12, 6.6, 8.4, 5.2],
                                    [13, 4.8, 6.3, 3.6],
                                    [14, 4.2, 6.2, 3.4],
                                ]}
                                options={{
                                    chart: {
                                    //title: 'Box Office Earnings in First Two Weeks of Opening',
                                    //subtitle: 'in millions of dollars (USD)',
                                    },
                                }}
                                rootProps={{ 'data-testid': '5' }}
                                /> */}
                                
                                {this.state.showChart?
                                    <Chart
                                        options={this.state.chartOptions}
                                        series={this.state.series}
                                        type="line"
                                        width="700"
                                    />
                            :null}
                                
                        </div>
                    :null
                    }
                    
                    {/*
                    <text>
                    </text>
                    */}
                </div>{/*.container */}
                </ClickAwayListener>
                <div className='footer'>
                    <Footer />
                </div>{/*.footer */}
            </div>/*.inbody */
        );
    }
}

const InbodyStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo,
      status: state.authentication.status
    }
}
const InbodyDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};

export default connect(InbodyStateToProps, InbodyDispatchToProps)(Inbody);