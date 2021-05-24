import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

import NumberFormat from 'react-number-format';
import { TextField } from '@material-ui/core';

import {getStatusRequest} from '../../action/authentication';

import {SERVER_URL} from '../../const/settings';
import { NavItem } from 'react-bootstrap';

import '../../styles/login/Register.css';

const ip = SERVER_URL;
//const ip = 'localhost:3000';


class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            password:'',
            password_confirm:'',
            fitness_name :'',
            fitness_addr:'',
            manager_name :'',
            phone :'',
            business_number :'',
            business_phone:'',

            
            id_err:false,
            password_err:false,
            password_confirm_err:false,
            fitness_name_err :false,
            fitness_addr_err:false,
            manager_name_err :false,
            phone_err :false,
            business_number_err :false,
            business_phone_err:false,

            check:0
        };
    };

    
    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    idCheck =()=>{
        //alert(this.state.id)
        let url = "http://"+ip+"/manager?type=idCheck&id="+this.state.id
            fetch(url, {
                method: "GET",
                headers: {
                  'Content-type': 'application/json'
                },
            })
            .then(response => response.json())
            .then((response) => {
                console.log(response)
                //console.log(response.length)
                if(response.length == 0){
                    alert('사용가능합니다.')
                    this.setState({
                        check:1
                    })
                } else{
                    alert('존재하는 아이디입니다. 다시 입력해주세요.')
                    this.setState({
                        check:0,
                        id:""
                    })
                }
                
            });
                 
    }
    

    handleOnClick = (e) => {
        
        this.setState({
            id_err:false,
            password_err:false,
            password_confirm_err:false,
            fitness_name_err:false,
            fitness_addr_err:false,
            manager_name_err:false,
            phone_err:false,
            business_number_err:false,
            business_phone_err:false,
        });


        if( this.state.id==="") {
           this.setState({id_err:true});
        }
        if(this.state.password===""){
            this.setState({password_err:true});
        }
        if(this.state.password_confirm===""){
            this.setState({password_confirmm_err:true});
        }
        if(this.state.fitness_name=== ""){
            this.setState({fitness_name_err:true});
        }
        if(this.state.fitness_addr===""){
            this.setState({fitness_addr_err:true});
        }
        if(this.state.manager_name===""){
            this.setState({manager_name_err:true});
        }
        if(this.state.phone===""){
            this.setState({phone_err:true});
        }
        if(this.state.business_number===""){
            this.setState({business_number_err:true});
        }
        if(this.state.business_phone===""){
            this.setState({business_phone_err:true});
        }

        if(this.state.id==="" || this.state.password===""|| this.state.password_confirm==="" || this.state.fitness_name=== ""  || this.state.fitness_addr==="" || this.state.manager_name==="" || this.state.phone===""  || this.state.business_number === "" || this.state.business_phone=== ""  ){
            alert("빈칸을 채워주세요.")
        }
        if(this.state.password != this.state.password_confirm){
            alert("비밀번호가 다릅니다. 다시 입력해주세요.")
        }
        else if(this.state.check == 0){
            alert("아이디 중복체크 해주세요.")
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
                    password:this.state.password,
                    fitness_name:this.state.fitness_name,
                    fitness_addr:this.state.fitness_addr,
                    manager_name:this.state.fitness_name,
                    phone:this.state.phone,
                    business_number:this.state.business_number,
                    business_phone:this.state.business_phone,
                    permit :0,
                })
            })
                .then(response => response.json())
                .then(response => {
                    alert("가입되었습니다.");
                    this.setState({
                        open:false,
                        id:"",
                        password:"",
                        fitness_name:"",
                        fitness_addr_err:"",
                        manager_name:"",
                        phone:"",
                        business_number_err :"",
                        business_phone_err:""
                    })
                    this.props.history.push('/');
                });
        }
    }
    

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (
            <div className='wrap loginWrap register'>
                <div className='header'>
                    <Header />
                    <Navigation />
                </div>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            <div className='parallelogram'></div>
                            회원가입
                            <span>.</span>
                        </h2>
                    </div>
                </div>
                <div className='container'>
                    <form className="AddSalesForm productPay">
                        {/* <div className='registerId'> */}
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
                            <button className='overlapCheck' type="button" onClick={this.idCheck}>아이디 중복체크</button>
                            {this.state.check == 0?
                                <label></label>
                                :
                                <label>사용가능한 아이디입니다.</label>
                            }
                        
                        <TextField
                            variant="outlined"
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            id='password'
                            label="비밀번호"
                            error={this.state.password_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.password_confirm}
                            onChange={this.handleChange}
                            type="password"
                            id='password_confirm'
                            label="비밀번호확인"
                            error={this.state.password_confirm_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.fitness_name}
                            onChange={this.handleChange}
                            id='fitness_name'
                            label="헬스장 이름"
                            error={this.state.fitness_name_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.fitness_addr}
                            onChange={this.handleChange}
                            id='fitness_addr'
                            label="헬스장 주소"
                            error={this.state.fitness_addr_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.manager_name}
                            onChange={this.handleChange}
                            id='manager_name'
                            label="대표 이름"
                            error={this.state.manager_name_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            id='phone'
                            label="대표 연락처(-제외)"
                            error={this.state.phone_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.business_number}
                            onChange={this.handleChange}
                            id='business_number'
                            label="사업자 등록번호"
                            error={this.state.business_number_err}
                            required
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.business_phone}
                            onChange={this.handleChange}
                            id='business_phone'
                            label="사업장 연락처(-제외)"
                            error={this.state.business_phone_err}
                            required
                        />

                        
                        <button
                            className="btnSolid" type="button" onClick={this.handleOnClick}>
                            등록하기
                        </button>
                    </form>{/*.AddSalesForm productPay */}
                </div>
                <div className='footer'>
                    <Footer />
                </div>
            </div>
        );
    }
}

const RegisterStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo,
      //status: state.authentication.status
    }
}

// const RegisterDispatchToProps = (dispatch) => {
//     return {
//         getStatusRequest: () => {
//             return dispatch(getStatusRequest());
//         },
//     };
// };


export default connect(RegisterStateToProps,null)(Register);