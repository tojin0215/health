import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';


import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TextField } from '@material-ui/core';


const ip = '13.124.141.28';

class UpdateCustomer extends Component {


    constructor(props) {
        super(props);
        
        const search = location.search;
        //alert(search)

        this.state = {
            fitness_no:this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            member_no: (search.split('='))[1] ,
            name: "",
            sex: 1,
            startDate: new Date(),
            period: 0,
            phone: "",
            solar_or_lunar: true,
            address:"",
            join_route:[],
            uncollected:0,
            in_charge:"",
            note:"",
            resiNumber:"",
            joinRouteEXC:null,
            
            name_err:false,
            period_err:false,
            phone_err:false,
            address_err:false,
            resiNumber_err:false,

            radioGroup: {
                male: true,
                female: false,
            },
            radioGroup2: {
                solar: true,
                lunar: false,
            },

            customerList:[]

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.cusFetch();
    };
    goLogin = () => {
        this.props.history.push("/");
    }

    cusFetch = () => {
        //fetch("http://"+ip+":3003/customer?type=select&member_no="+this.state.member_no+"&fn="+this.props.userinfo.fitness_no, {
        fetch("http://localhost:3000/customer?type=select&member_no="+this.state.member_no+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
          })
            .then(response => response.json())
            .then(res => {
                this.setState({
                    customerList : res
                });

                this.state.customerList.map((c)=>{
                    let exc = ''
                    let route = ''
                    //console.log('1111',(c.join_route||'').split('(')[0])
                    if((c.join_route||'').split('(')[0] === '기타'){
                        let a = (c.join_route||'').split('(')[1];
                        exc = (a||'').split(')')[0];
                        route = '기타'
                        //console.log('################33',a,'  ',exc)
                    }else{
                        exc = null;
                        route = c.join_route
                    }
                    //console.log('11111111111111111111',route)
                    let radio = ''
                    if(c.sex === true){
                        radio = {male:true, female:false}
                    } else{
                        radio = {male:false, female:true}
                    }
                    let radio2 = ''
                    console.log('양음',c.solar_or_lunar )
                    if(c.solar_or_lunar === true){
                        radio2 = {solar:true, lunar:false}
                    } else{
                        radio2 = {solar:false, lunar:true}
                    }

                    //console.log('2222222222222222222',radio2)
                    
                    this.setState({
                        name : c.name,
                        sex : c.sex,
                        startDate : new Date(c.start_date),
                        phone: c.phone,
                        period:c.period,
                        solar_or_lunar: c.solar_or_lunar,
                        address:c.address,
                        join_route:route,
                        in_charge:c.in_charge,
                        note:c.note,
                        resiNumber:c.resi_no,
                        joinRouteEXC:exc,
                        radioGroup:radio,
                        radioGroup2:radio2
                    })
                })
            });
        
    }

    handleChange = (e) => { 
        if(e.target.name === 'join_route'){
            this.setState({ 
                [e.target.name]: e.target.id,
            }); 
        }else{
            this.setState({ 
                [e.target.id]: e.target.value,                
            }); 
        }
    };
    
    handleOnClick = (e) => {
        
        //alert('수정수정')
        this.setState({
            name_err:false,
            period_err:false,
            phone_err:false,
            address_err:false,
            resiNumber_err:false,
        });

        let ex2='';
        if(this.state.join_route === '기타'){
            ex2 = this.state.join_route +'('+this.state.joinRouteEXC +')'
        } else{
            ex2 = this.state.join_route
        }

        if( this.state.name==="") {
           this.setState({name_err:true});
        }
        if(this.state.period===0){
            this.setState({period_err:true});
        }
        if(this.state.phone=== ""){
            this.setState({phone_err:true});
        }
        if(this.state.address===""){
            this.setState({address_err:true});
        }
        if(this.state.resiNumber===""){
            this.setState({resiNumber_err:true});
        }

        if(this.state.name==="" || this.state.period===0 || this.state.phone=== "" || this.state.address==="" || this.state.resiNumber==="" ){
            alert("빈칸을 채워주세요.")
        }
        else{
            // 서버 연결하는 부분
            //fetch("http://"+ip+":3003/customer?fn="+this.props.userinfo.fitness_no, {
            fetch("http://localhost:3000/customer?fn="+this.props.userinfo.fitness_no, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    member_no:this.state.member_no,
                    name:this.state.name,
                    sex:this.state.radioGroup.male?true:false,//true:'남', false:'여'
                    start_date:this.state.startDate,
                    period:this.state.period,
                    phone:this.state.phone,
                    solar_or_lunar:this.state.radioGroup2.solar?true:false,//true:'양', false:'음'
                    address:this.state.address,
                    join_route:ex2,
                    //uncollected:this.state.uncollected,
                    in_charge:this.state.in_charge,
                    note:this.state.note,
                    resi_no : String(this.state.resiNumber),
                })
            })
                .then(response => response.json())
                .then(response => {
                    alert("회원 정보가 수정되었습니다.");
                    this.props.history.push('/customer');
                });
        }
    }

    handleStartDateChange(date) {
        this.setState({
           startDate: date
        })
    }

    handleRadio = (event) => {
        console.log('event.target.id',event.target.id)
        let obj = {
            male: false,
            female: false,
        }
        obj[event.target.id] = event.target.checked // true
        console.log('obj?',obj);
        this.setState({
            radioGroup: obj
        })
    }
    handleRadio2 = (event) => {
        let obj = {
            solar: false,
            lunar: false,
        }
        obj[event.target.id] = event.target.checked // true
        console.log(obj);
        this.setState({
            radioGroup2: obj
        })
    }


    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        console.log('*************8',this.state.join_route)

        return (

            <div className='updateCustomer'>
            <div className='header'>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                          회원 정보 수정
                        </h2>
                    </div>
                </div>
            </div>
            <div className='container'>
                <h3>
                    회원 정보 수정 
                </h3>
                
                <form className="formAddCustomer">
                    <label className='customerName'>
                    <TextField
                            variant="outlined"
                            value={this.state.name}
                            onChange={this.handleChange}
                            id='name'
                            label="성명"
                            error={this.state.name_err}
                            required
                            autoFocus
                        />
                        <label className='labelCheck'>
                            <input className='btnRadio' type="radio" name="radioGroup" id='male'
                            checked={this.state.radioGroup['male']} onChange={this.handleRadio}/>
                            <span>남</span>
                        </label>{/*.labelCheck */}
                        <label className='labelCheck'>
                            <input className='btnRadio' type="radio" name="radioGroup" id='female' 
                            checked={this.state.radioGroup['female']} onChange={this.handleRadio}/>
                            <span>여</span>
                        </label>{/*.labelCheck */}
                    </label>{/*.customerName */}
                    <label className='customerPeriod'>강습시작일
                        <DatePicker
                        selected={ this.state.startDate }
                        onChange={ this.handleStartDateChange }
                        name="startDate"
                        dateFormat="yyyy-MM-dd"
                        />
                        <TextField
                            variant="outlined"
                            value={this.state.period}
                            onChange={this.handleChange}
                            type='number'
                            id='period'
                            label="개월"
                            error={this.state.period_err}
                            required
                        />
                    </label>{/*.customerPeriod */}
                    <label className='customerPhone'>
                        <TextField
                            variant="outlined"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            type='number'
                            id='phone'
                            className='numberControlNone'
                            label="핸드폰(-제외)"
                            error={this.state.phone_err}
                            required
                        />
                    </label>{/*.customerPhone */}
                    <label className='customerResi'>
                        <TextField
                            variant="outlined"
                            value={this.state.resiNumber}
                            onChange={this.handleChange}
                            type='number'
                            id='resiNumber'
                            label="주민번호 앞자리(6자리)"
                            error={this.state.resiNumber_err}
                            required
                        />{/*#resiNumber */}
                        <label className='labelCheck'>
                            <input className='btnRadio' type="radio" name="radioGroup2" id='solar'
                            checked={this.state.radioGroup2['solar']} onChange={this.handleRadio2}/>
                            <span>양</span>
                        </label>{/*.labelCheck */}
                        <label className='labelCheck'>
                            <input className='btnRadio' type="radio" name="radioGroup2" id='lunar' 
                            checked={this.state.radioGroup2['lunar']} onChange={this.handleRadio2}/>{/*.btnRadio */}
                            <span>음</span>
                        </label>{/*.labelCheck */}
                    </label>{/*.customerResi */}
                    <label className='customerAddress'>
                        <TextField
                            variant="outlined"
                            value={this.state.address}
                            onChange={this.handleChange}
                            id='address'
                            label="주소"
                            error={this.state.address_err}
                            required
                        />{/*#address */}
                    </label>{/*.customerAddress */}
                    <label className='customerIncharge'>
                        <TextField
                            variant="outlined"
                            value={this.state.in_charge}
                            onChange={this.handleChange}
                            id='in_charge'
                            label="담당자"    
                        />{/*#in_charge */}
                    </label>{/*.customerIncharge */}
                    <label className='customerRoute'>
                        <h5> 가입 경로 </h5>
                        {/* <label>{this.state.join_route}</label> */}
                        <div>
                            <label><input type="radio" id='간판' value='1' name='join_route' checked={this.state.join_route === '간판' ? true : false} onChange={this.handleChange}/>간판</label>
                            <label><input type="radio" id='홈페이지' value='2' name='join_route' checked={this.state.join_route === '홈페이지'? true : false} onChange={this.handleChange}/>홈페이지</label>
                            <label><input type="radio" id='전단지' value='3' name='join_route' checked={this.state.join_route === '전단지'? true : false} onChange={this.handleChange}/>전단지</label>
                            <label><input type="radio" id='지인소개' value='4' name='join_route' checked={this.state.join_route === '지인소개'? true : false} onChange={this.handleChange}/>지인소개</label>
                            <label><input type="radio" id='SNS' value='5' name='join_route' checked={this.state.join_route === 'SNS'? true : false} onChange={this.handleChange}/>SNS</label>
                            <label><input type="radio" id='기타' value='6' name='join_route' checked={this.state.join_route === '기타'? true : false} onChange={this.handleChange}/>기타</label>
                            <input type="text" id="joinRouteEXC" className="form-control" placeholder="기타 가입경로" name="joinexc" defaultValue={this.state.joinRouteEXC} onChange={this.handleChange}/>
                            
                        </div>
                    </label>
                <label>비고 : <input type="text" id='note' onChange={this.handleChange}/></label>
                
                <button type="button" onClick={this.handleOnClick}> 수정하기 </button>
            </form>
            </div>
        </div>
        );
    }
}


const CustomerStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo
    }
}


export default connect(CustomerStateToProps, undefined)(UpdateCustomer);