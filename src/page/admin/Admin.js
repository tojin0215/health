import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';

import {getStatusRequest} from '../../action/authentication';

//const ip = '13.124.141.28:3002';
const ip = 'localhost:3000';

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:'',
            pwd:'',
            fitness_name:'',
            manager_name:'',
            
            id_err:false,
            pwd_err:false,
            fitness_name_err:false,
            manager_name_err:false
        };
        this.handleChange = this.handleChange.bind(this);
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

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    handleOnClick = (e) => {
        
        this.setState({
            id_err:false,
            pwd_err:false,
            fitness_name_err:false,
            manager_name_err:false
        });
    

        if( this.state.id==="") {
           this.setState({id_err:true});
        }
        if(this.state.pwd===""){
            this.setState({pwd_err:true});
        }
        if(this.state.fitness_name=== ""){
            this.setState({fitness_name_err:true});
        }
        if(this.state.manager_name===""){
            this.setState({manager_name_err:true});
        }

        if(this.state.id==="" || this.state.pwd==="" || this.state.fitness_name=== "" || this.state.manager_name==="" ){
            alert("빈칸을 채워주세요.")
        }
        else{
            // 서버 연결하는 부분
            fetch("http://"+ip+"/manager", {
                method: "POST",
                headers: {
                'Content-type': 'application/json'
            },
                body: JSON.stringify({
                    id:this.state.id,
                    password:this.state.pwd,
                    fitness_name:this.state.fitness_name,
                    manager_name:this.state.fitness_name
                })
            })
                .then(response => response.json())
                .then(response => {
                    alert("등록되었습니다.");
                    this.props.history.push('/home');
                });

        }
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        return (
            <div className='statistics'>
                <div className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin}/>
                    <div className='localNavigation'>
                        <div className='container'>
                            <h2>
                                관리자페이지
                            </h2>
                            <div className='breadCrumb'>
                                <Link to='/home'>HOME</Link>
                                <span>&#62;</span>
                                <Link to='/statistics'>관리자</Link>
                            </div>
                        </div>{/*.container */}
                    </div>{/*.localNavigation */}
                </div>{/*.header */}
                <div className="container">
                     <h2>관리자페이지</h2>
                     <form className="formAddCustomer">
                    <label>
                    <TextField
                            variant="outlined"
                            value={this.state.id}
                            onChange={this.handleChange}
                            id='id'
                            label="아이디"
                            error={this.state.id_err}
                            required
                            autoFocus
                        />
                    </label>{/*.customerName */}
                
                    <label>
                    <TextField
                            variant="outlined"
                            type="password"
                            value={this.state.pwd}
                            onChange={this.handleChange}
                            id='pwd'
                            label="비밀번호"
                            error={this.state.pwd_err}
                            required
                            autoFocus
                        />
                    </label>

                    <label>
                    <TextField
                            variant="outlined"
                            value={this.state.fitness_name}
                            onChange={this.handleChange}
                            id='fitness_name'
                            label="헬스장이름"
                            error={this.state.fitness_name_err}
                            required
                            autoFocus
                        />
                    </label>
                    
                    <label>
                    <TextField
                            variant="outlined"
                            value={this.state.manager_name}
                            onChange={this.handleChange}
                            id='manager_name'
                            label="담당자이름"
                            error={this.state.manager_name_err}
                            required
                            autoFocus
                        />
                    </label>

                     <button type="button" onClick={this.handleOnClick}>
                        등록하기
                    </button>
                </form>{/*.formAddCustomer */}
                </div>
                <div className='footer'>
                    <Footer />
                </div>{/*.footer */}
            </div>
        );
    }
}

const AdminStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo,
      status: state.authentication.status
    }
}

const AdminDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};

export default connect(AdminStateToProps, AdminDispatchToProps)(Admin);