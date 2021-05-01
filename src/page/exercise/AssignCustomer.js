import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {getStatusRequest} from '../../action/authentication';

const ip = '13.124.141.28:3002';
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");

class AssignCustomer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fitness_no: this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            member_no: Number(this.props.location.state.member_no),
            userName: this.props.location.state.userName,
            startDate: new Date("2021-01-01"),
            endDate: new Date(),
            assignExerciseList:[],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
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

    cusFetch=()=>{
        if(this.state.member_no == '0'){
            alert('선택된 회원이 없습니다. 회원을 선택 해주세요.')
            this.props.history.push({
                pathname: "/assign",
                state:{member_no:0}
            })
        }else{
            let startTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate())
            let endTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), (this.state.endDate.getDate()+1))
        
            fetch('http://'+ip+'/assignexercise?type=customer&startDate='+startTime+'&endDate='+endTime+'&member_no='+this.state.member_no+'&fn='+this.props.userinfo.fitness_no, {
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
                            assignExerciseList:[],
                        })
                    } else{
                        let arr1 = [];
                        for(let i=(res.length-1) ; i>=0 ; i--){
                            arr1.push({"member_no":res[i].member_no,"exercise_no":res[i].exercise_no, "name":res[i].name, "createAt":moment(res[i].createAt).format("YYYY/MM/DD"), "part":res[i].part,"machine":res[i].machine, "data":res[i].data, "rest_second":res[i].rest_second, "set_count":res[i].set_count
                        })
                        }
                        this.setState({assignExerciseList : arr1});
                    }
    
                    //alert('조회완료')
                });
        }
    }

    handleOnClick=()=>{
        if(this.state.member_no == '0'){
            alert('선택된 회원이 없습니다. 회원을 선택 해주세요.')
        }
        let startTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate())
        let endTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), (this.state.endDate.getDate()+1))
    
        fetch('http://'+ip+'/assignexercise?type=customer&startDate='+startTime+'&endDate='+endTime+'&member_no='+this.state.member_no+'&fn='+this.props.userinfo.fitness_no, {
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
                        assignExerciseList:[],
                    })
                } else{
                    let arr1 = [];
                    for(let i=(res.length-1) ; i>=0 ; i--){
                        arr1.push({"member_no":res[i].member_no,"exercise_no":res[i].exercise_no, "name":res[i].name, "createAt":moment(res[i].createAt).format("YYYY/MM/DD"), "part":res[i].part,"machine":res[i].machine, "data":res[i].data, "rest_second":res[i].rest_second, "set_count":res[i].set_count
                    })
                    }
                    this.setState({assignExerciseList : arr1});
                }

                //alert('조회완료')
            });
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        const textOptions = {
            noDataText: '배정된 운동이 없습니다.',
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

        return (
            <div className='assignCustomer'>
                <div className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin}/>
                    <div className='localNavigation'>
                        <div className='container'>
                            <h2>
                                운동배정목록
                            </h2>
                            <div className='breadCrumb'>
                                <Link to='/home'>HOME</Link>
                                <span>&#62;</span>
                                <Link to='/assign/customer'>고객운동배정</Link>
                            </div>
                        </div>{/*.container */}
                    </div>{/*.localNavigation */}
                </div>{/*.header */}
                <div className="container">
                     <h2>고객운동배정목록</h2>
                        <Link
                            to={{ pathname: '/assign',
                                state:{member_no:this.state.member_no} }}
                        >
                            <button type="button">운동배정하기</button>
                        </Link>
                        {/* <label>{this.state.member_no}</label> */}
                        <div>
                            <label>{this.state.userName}님의 운동배정 목록입니다.</label>
                            {/* <div>
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
                            data={ this.state.assignExerciseList }
                            options={textOptions}
                            pagination={ this.state.assignExerciseList.length > 1 }
                            tableHeaderClass='tableHeader'
                            tableContainerClass='tableContainer'>
                                <TableHeaderColumn
                                dataField='createAt'
                                thStyle={ { 'textAlign': 'center', 'width':'100px' } }
                                tdStyle={ { 'textAlign': 'center','width':'100px' } }
                                isKey
                                >
                                    날짜
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='name'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center'  } }
                                >
                                    운동이름
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='machine'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center' } }
                                >
                                    운동도구
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='part'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center' } }
                                >
                                    운동부위
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='data'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center' } }
                                >
                                    횟수
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='rest_second'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center' } }
                                >
                                    휴식시간
                                </TableHeaderColumn>
                                <TableHeaderColumn
                                dataField='set_count'
                                thStyle={ { 'textAlign': 'center' } }
                                tdStyle={ { 'textAlign': 'center' } }
                                >
                                    세트
                                </TableHeaderColumn>
                            </BootstrapTable>*/}
                        </div> 
                </div>
                <div className='footer'>
                    <Footer />
                </div>{/*.footer */}
            </div>
        );
    }
}

const AssignCustomerStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo,
      status: state.authentication.status
    }
}

const AssignCustomerDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};

export default connect(AssignCustomerStateToProps, AssignCustomerDispatchToProps)(AssignCustomer);