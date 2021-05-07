import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import {getStatusRequest} from '../../action/authentication';
import '../../styles/home/home.css';

import mainVisual1 from '../../images/mainVisual1.png';
import mainVisual2 from '../../images/mainVisual2.png';

const ip = '13.124.141.28:3002';
//const ip = 'localhost:3000';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCustomer:0,
            todayCustomer:0,
            monthSales:0,
            todaySales:0,
            admin:this.props.userinfo.manager_name
        }
        this.cusFetch();
    }

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
        console.log('get cookie by name / get loginData from cookie : ',loginData)
        //eyJpc0xvZ2dlZEluIjp0cnVlLCJpZCI6InRvamluIn0=
   
        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));
        // if not logged in, do nothing
        if(!loginData.isLoggedIn){
            this.props.history.push('/');
            return;
        } 
        console.log('get loginData from cookie / decode base64 & parse json : ',loginData)
        //{isLoggedIn:true, id:"tojin"}
   
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                console.log('????',this.props.status.valid)
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
                else{
                    this.cusFetch();
                }
            }
        );
    }

    cusFetch=()=>{
        fetch("http://"+ip+"/customer?type=all&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
        })
            .then(response => response.json())
            .then(res => {
                //alert(res.length)
                this.setState({totalCustomer:res.length})
                // let arr = [];
                // for(let i=(res.length-1) ; i>=0 ; i--){
                //     let sor = res[i].solar_or_lunar===true?"양":"음";
                //     let s = res[i].sex===true?"남":"여";
                //     arr.push({"no":res[i].member_no, "name":res[i].name, "sex":s, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
                // }
                // this.setState({customerList : arr});
        });
        fetch('http://'+ip+'/sales?type=all&fn='+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
            let sum = 0;
            for(let i=0; i<res.length;i++){
                sum = Number(sum) + Number(res[i].lockerPrice)+Number(res[i].sportswearPrice)+Number(res[i].exercisePrice)
            }
            this.setState({todaySales:sum})
        })

        let today = new Date();
        let startTime = new Date(today.getFullYear(),today.getMonth(),1)
        let endTime = new Date(today.getFullYear(),today.getMonth()+1,0)
        //alert(today)
        fetch('http://'+ip+'/sales?type=select&startDate='+startTime+'&endDate='+endTime+'&fn='+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
            let sum = 0;
            for(let i=0; i<res.length;i++){
                sum = Number(sum) + Number(res[i].lockerPrice)+Number(res[i].sportswearPrice)+Number(res[i].exercisePrice)
            }
            this.setState({monthSales:sum})
        })
    }

    fommat=(num)=>{
        if(Number(num)>=1000){
            return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        } else {
            return num
        }
    }
    
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        console.log('오늘매출',this.state.todaySales)

        return (
        <div className='wrap home'>
            <div className='header'>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            Home
                        </h2>
                    </div>{/*.container */}
                </div>{/*.localNavigation */}
            </div>{/*.header */}
            <div className='container'>
                <div className='dashboard'>
                    <label>
                        <p>전체고객</p>
                        <p><span>{this.fommat(this.state.totalCustomer)}</span>명</p>
                    </label>
                    <label>
                        <p>오늘 방문고객</p>
                        <p><span>{this.fommat(this.state.todayCustomer)}</span>명</p>
                    </label>
                    <label>
                        <p>월매출</p>
                        <p><span>{this.fommat(this.state.monthSales)}</span>원</p>
                    </label>
                    <label>
                        <p>일매출</p>
                        <p><span>{this.fommat(this.state.todaySales)}</span>원</p>
                    </label>
                </div>{/*.dashboard */}

                <div className='mainVisual'>
                    메인 이미지
                </div>
                <div className='homeIcon'>
                    <ul>
                        <li>
                            <Link to="/customer" className='btnCustomerNew btnCustomer'>
                            </Link>
                            <p>고객</p>
                        </li>
                        <li>
                            <Link to="/exercise" className='btnCustomerNew btnSetting'>
                            </Link>
                            <p>운동 설정</p>
                        </li>
                        <li>
                            <Link to="/assign" className='btnCustomerNew btnExercise'>
                            </Link>
                            <p>운동 배정</p>
                        </li>
                        <li>
                            <Link to="/sales" className='btnCustomerNew btnSales'>
                            </Link>
                            <p>상품매출</p>
                        </li>
                        <li>
                            <Link to="/statistics" className='btnCustomerNew btnStatic'>
                            </Link>
                            <p>통계</p>
                        </li>
                        <li>
                            <Link to="/statistics" className='btnCustomerNew btnStatic'>
                                <p>관리자</p>
                            </Link>
                        </li>
                        
                    </ul>
                </div>
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
        );
    }
}

const HomeStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo,
      status: state.authentication.status
    }
}
const HomeDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};

export default connect(HomeStateToProps, HomeDispatchToProps)(Home);