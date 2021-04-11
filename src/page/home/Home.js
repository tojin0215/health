import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import {getStatusRequest} from '../../action/authentication';
class Home extends Component {
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
            }
        );
    }
    
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        return (
            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            <h2>Home</h2>
            <Link to="/customer" className='btnCustomerNew'>
                고객
            </Link>
            <Link to="/sales" className='btnCustomerNew'>
                상품매출
            </Link>
            <Link to="/exercise" className='btnCustomerNew'>
                설정
            </Link>
            <Link to="/assign" className='btnCustomerNew'>
                운동
            </Link>
            <Link to="/statistics" className='btnCustomerNew'>
                통계
            </Link>
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