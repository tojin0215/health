import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';


class AddCustomer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fitness_no:this.props.userinfo.fitness_no, //Redux를 통해 받은 값
            name: "",
            sex: 0,
            startDate: new Date(),
            period: 0,
            phone: "",
            solar_or_lunar: true,
            address:"",
            join_route:0,
            uncollected:0,
            in_charge:"",
            note:"",
            resiNumber:"",
            
            name_err:false,
            period_err:false,
            phone_err:false,
            address_err:false,
            resiNumber_err:false,

            signboard:false,
            homepage:false,
            flyers:false,
            friend:false,
            sns:false,
            etc:false,

            radioGroup: {
                male: true,
                female: false,
            },
            radioGroup2: {
                solar: true,
                lunar: false,
            },

            // allPremium:false,
            // gxTwo:false,
            // gxOne:false,
            // pt:false,
            // spinning:false,
            // guigiPilates:false,
            // health:false,
            // etc2:false,

            // card:false, cash:false, accountTransfer:false,

            // payDate: new Date(),
            // Exercise:"",
            // ExercisePayment: 0,
            // SportswearPayment: 0,
            // LockerPayment: 0,
            // TotalPayment:0,

            member_no: '',
            paymentDate: new Date(),
            exerciseName:[],
            inputExercise:'',
            exercisePrice: 0,
            lockerPrice: 0,
            sportswearPrice: 0,
            paymentTools:'',
            open:false,
            searchKeyword:'',
            userName:'회원',
            customerList:[],
            value:''
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
    };
    goLogin = () => {
        this.props.history.push("/");
    }

    handleChange = (e) => { 
        if(e.target.name ==='paymentTools'){
            this.setState({ 
                [e.target.name]: e.target.id,
            }); 
        }else{
            this.setState({ 
                [e.target.id]: e.target.value,
                //TotalPayment : parseInt(this.state.TotalPayment) + parseInt(e.target.value)
                
            }); 
        }
    };
    
    handleOnClick = (e) => {
        
        this.setState({
            name_err:false,
            period_err:false,
            phone_err:false,
            address_err:false,
            resiNumber_err:false,
        });
    
        let ex='';
        for(var i=0; i<this.state.exerciseName.length;i++){
            if(this.state.exerciseName[i] === '기타'){
                ex = this.state.exerciseName[i] +'('+this.state.inputExercise +') /'+ex
            }
            else{
                ex = this.state.exerciseName[i] +'/ '+ex
            }
            
        }
        console.log('start___',this.state.startDate)
        console.log('payment',this.state.paymentDate)

        let exercisePrice1 = parseInt((this.state.exercisePrice).toString().replace(/[^(0-9)]/gi,""));
        let lockerPrice1 = parseInt((this.state.lockerPrice).toString().replace(/[^(0-9)]/gi,""));
        let sportswearPrice1 = parseInt((this.state.sportswearPrice).toString().replace(/[^(0-9)]/gi,""))

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
            let aa = (this.state.signboard?"1":"0");
            let bb = (this.state.homepage?"1":"0");
            let cc = (this.state.flyers?"1":"0");
            let dd = (this.state.friend?"1":"0");
            let ee = (this.state.sns?"1":"0");
            let ff = (this.state.etc?"1":"0");
            // 서버 연결하는 부분
            fetch("http://localhost:3000/customer", {
                method: "POST",
                headers: {
                'Content-type': 'application/json'
            },
                body: JSON.stringify({
                    fitness_no:this.state.fitness_no,
                    name:this.state.name,
                    sex:this.state.radioGroup.male?true:false,//true:'남', false:'여'
                    start_date:this.state.startDate,
                    period:this.state.period,
                    phone:this.state.phone,
                    solar_or_lunar:this.state.radioGroup2.solar?true:false,//true:'양', false:'음'
                    address:this.state.address,
                    join_route:aa+bb+cc+dd+ee+ff,
                    //uncollected:this.state.uncollected,
                    in_charge:this.state.in_charge,
                    note:this.state.note,
                    resi_no : String(this.state.resiNumber),
                })
            })
                .then(response => response.json())
                .then(response => {
                    console.log('111___________',response)
                    let m_no = ''
                    for(let i=0 ; i<response.length ; i++){
                        m_no = response[i].member_no
                        console.log('333___________',m_no)
                    }
                    // 서버에서 데이터 전달하면 여기서 json type으로 받게 됨
                    fetch("http://localhost:3000/sales", {
                        method: "POST",
                        headers: {
                          'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            fitness_no:this.state.fitness_no,
                            member_no:m_no,
                            exerciseName:ex,
                            exercisePrice:exercisePrice1,
                            lockerPrice:lockerPrice1,
                            sportswearPrice:sportswearPrice1,
                            paymentTools:this.state.paymentTools,
                            paymentDate:this.state.paymentDate
                        })
                      })
                        .then(response => response.json())
                        .then(response => {
                        });

                    alert("신규 회원이 등록되었습니다.");
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
        let obj = {
            male: false,
            female: false,
        }
        obj[event.target.id] = event.target.checked // true
        console.log(obj);
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

    handleDateChange(date) {
        this.setState({
            paymentDate: date
        })
    }
  

    toggleChange = (e) => {
        if(this.state[e.target.id]===false){
            this.setState({ 
                [e.target.id]: true,
            }); 
        }
        else if(this.state[e.target.id]===true){
            this.setState({ 
                [e.target.id]: false,
            }); 
        }
    }

    toggleChange1 = (e) => {
        const target = e.target
        let value = target.id
        //console.log(target.checked)
        if(target.checked === true){
            this.state.exerciseName[value] = value;
            this.setState({
                exerciseName : [...this.state.exerciseName, this.state.exerciseName[value]]
            })
        }else {     
            for(var i=0; i<this.state.exerciseName.length; i++){
                if(this.state.exerciseName[i] === value){
                    this.state.exerciseName.splice(i, 1)
                }
            }
            //console.log(this.state.exerciseName)
        }
    }

    render() {     
        console.log('11111',this.state.exercisePrice)   
        return (
            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            
            <h2>신규 회원 등록</h2>
            <form className="AddSalesForm" style={{flexDirection:'column',display:'flex'}}>
                <hr/><label>
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
                    </label>
                    <label className='labelCheck'>
                        <input className='btnRadio' type="radio" name="radioGroup" id='female' 
                        checked={this.state.radioGroup['female']} onChange={this.handleRadio}/>
                        <span>여</span>
                    </label>
                </label><br/>
                <label>강습시작일<br/><DatePicker
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
                </label>
                
                <br />
                <TextField
                    variant="outlined"
                    value={this.state.phone}
                    onChange={this.handleChange}
                    type='number'
                    id='phone'
                    label="핸드폰(-제외)"
                    error={this.state.phone_err}
                    required
                />
                <br />
                <label>
                <TextField
                    variant="outlined"
                    value={this.state.resiNumber}
                    onChange={this.handleChange}
                    type='number'
                    id='resiNumber'
                    label="주민번호 앞자리(6자리)"
                    error={this.state.resiNumber_err}
                    required
                />
                <label className='labelCheck'>
                    <input className='btnRadio' type="radio" name="radioGroup2" id='solar'
                        checked={this.state.radioGroup2['solar']} onChange={this.handleRadio2}/>
                        <span>양</span>
                    </label>
                    <label className='labelCheck'>
                        <input className='btnRadio' type="radio" name="radioGroup2" id='lunar' 
                        checked={this.state.radioGroup2['lunar']} onChange={this.handleRadio2}/>
                        <span>음</span>
                    </label>
                </label><br/>
                <TextField
                    variant="outlined"
                    value={this.state.address}
                    onChange={this.handleChange}
                    id='address'
                    label="주소"
                    error={this.state.address_err}
                    required
                />
                <br />
                <TextField
                    variant="outlined"
                    value={this.state.in_charge}
                    onChange={this.handleChange}
                    id='in_charge'
                    label="담당자"    
                />
                <br/><br/>
                <h5> 가입 경로 </h5>
                <hr/>
                <label><input type="checkbox" id='signboard' checked={this.state.signboard} onChange={this.toggleChange}/>간판</label>
                <label><input type="checkbox" id='homepage' checked={this.state.homepage} onChange={this.toggleChange}/>홈페이지</label>
                <label><input type="checkbox" id='flyers' checked={this.state.flyers} onChange={this.toggleChange}/>전단지</label>
                <label><input type="checkbox" id='friend' checked={this.state.friend} onChange={this.toggleChange}/>지인소개</label>
                <label><input type="checkbox" id='sns' checked={this.state.sns} onChange={this.toggleChange}/>SNS</label>
                <label><input type="checkbox" id='etc' checked={this.state.etc} onChange={this.toggleChange}/>기타</label>
                
                <input type="text" id="inputExercise" className="form-control" placeholder="Exercise" name="Exercise" onChange={this.handleChange}/>
                <br/><br/>

                <h5 className="AddSalesHeader"> 운동 종목 </h5>
                <hr/>
                <label><input type="checkbox" id='PREMIUM 전종목' name='exerciseName' value='1' onChange={this.toggleChange1}/>PREMIUM 전종목</label>
                <label><input type="checkbox" id='GX 2종목' name='exerciseName' value='2' onChange={this.toggleChange1}/>GX 2종목</label>
                <label><input type="checkbox" id='GX 1종목' name='exerciseName' value='3' onChange={this.toggleChange1}/>GX 1종목</label>
                <label><input type="checkbox" id='개인 PT' name='exerciseName' value='4'onChange={this.toggleChange1}/>개인 PT</label><br/>
                <label><input type="checkbox" id='스피닝' name='exerciseName' value='5' onChange={this.toggleChange1}/>스피닝</label>
                <label><input type="checkbox" id='기구 필라테스' name='exerciseName' value='6' onChange={this.toggleChange1}/>기구 필라테스</label>
                <label><input type="checkbox" id='1:1 필라테스' name='exerciseName' value='7' onChange={this.toggleChange1}/>1:1 필라테스</label>
                <label><input type="checkbox" id='헬스' name='exerciseName' value='8' onChange={this.toggleChange1}/>헬스</label><br/>
                <label><input type="checkbox" id='기타' name='exerciseName' value='9' onChange={this.toggleChange1}/>기타</label>
                <input type="text" id="inputExercise" className="form-control" placeholder="Exercise" name="Exercise" onChange={this.handleChange}/><br/><br/>
                <h5> 결제 금액</h5>
                <hr/>
                <label><input type="radio" name='paymentTools' id='카드' onChange={this.handleChange}/>카드</label>
                <label><input type="radio" name='paymentTools' id='현금' onChange={this.handleChange}/>현금</label>
                <label><input type="radio" name='paymentTools' id='계좌이체' onChange={this.handleChange}/>계좌이체</label><br/>
                <label>운동 <NumberFormat thousandSeparator={true} id="exercisePrice" placeholder="0" onChange={this.handleChange}/></label>
                <label>운동복 <NumberFormat thousandSeparator={true} id="sportswearPrice" placeholder="0" onChange={this.handleChange}/></label>
                <label>개인 사물함 <NumberFormat thousandSeparator={true} id="lockerPrice" placeholder="0" onChange={this.handleChange}/></label><br/>

                <h5> 결제일</h5>
                 <DatePicker
                    selected={ this.state.paymentDate }
                    onChange={ this.handleDateChange }
                    name="paymentDate"
                    dateFormat="MM/dd/yyyy"
                />
                <h5>금액 합계</h5>
                <NumberFormat thousandSeparator={true} name="payment" id="TotalPayment" readOnly value={parseInt((this.state.exercisePrice).toString().replace(/[^(0-9)]/gi,""))+parseInt((this.state.sportswearPrice).toString().replace(/[^(0-9)]/gi,""))+parseInt((this.state.lockerPrice).toString().replace(/[^(0-9)]/gi,""))}/>
                
                <label>비고 : <input type="text" id='note' onChange={this.handleChange}/></label>
                
                <button type="button" onClick={this.handleOnClick}> 등록하기 </button>
            </form>
        </div>
        );
    }
}

const CustomerStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo
    }
}

export default connect(CustomerStateToProps, undefined)(AddCustomer);

