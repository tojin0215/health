import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import {getStatusRequest} from '../../action/authentication';

const ip = '13.124.141.28:3002';
//const ip = 'localhost:3000';
class AssignCustomer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fitness_no: this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            member_no: Number(this.props.location.state.member_no),
        };
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
            alert('Hey!')
        }
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

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
                        <label>{this.state.member_no}</label>
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