import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
            resiNumber1:"",
            resiNumber2:"",


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

            allPremium:false,
            gxTwo:false,
            gxOne:false,
            pt:false,
            spinning:false,
            guigiPilates:false,
            health:false,
            etc2:false,

            card:false, cash:false, accountTransfer:false,

            payDate: new Date(),
            Exercise:"",
            ExercisePayment: 0,
            SportswearPayment: 0,
            LockerPayment: 0,
            TotalPayment:0,


        };
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handlePayDateChange = this.handlePayDateChange.bind(this);
    };


    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };
    handleChangeAndSum = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        }, () => {
            this.setState({
                TotalPayment:Number(this.state.ExercisePayment)+Number(this.state.SportswearPayment)+Number(this.state.LockerPayment)
            })
        })
    }
    handleOnClick = (e) => {
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
                sex:this.state.radioGroup.male?0:1,//0:'남', 1:'여'
                start_date:this.state.startDate,
                period:this.state.period,
                phone:this.state.phone,
                solar_or_lunar:this.state.radioGroup2.solar?0:1,//0:'양', 1:'음'
                address:this.state.address,
                join_route:aa+bb+cc+dd+ee+ff,
                //uncollected:this.state.uncollected,
                in_charge:this.state.in_charge,
                note:this.state.note,
                resi_no : String(this.state.resiNumber1)+"-"+String(this.state.resiNumber2),
            })
          })
            .then(response => response.json())
            .then(response => {
                // 서버에서 데이터 전달하면 여기서 json type으로 받게 됨
                alert("신규 회원이 등록되었습니다.");
                this.props.history.push('/customer');
            });
        
    }

    handleStartDateChange(date) {
        this.setState({
           startDate: date
        })
    }
    handlePayDateChange(date) {
        this.setState({
           payDate: date
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

    render() {        
        return (
            <div>
            <Header />
            <Navigation />
            <h2>신규 회원 등록</h2>
            <form className="AddSalesForm" style={{flexDirection:'column',display:'flex'}}>
                <hr/>
                <label>담당자 : <input type="text" id='in_charge' onChange={this.handleChange}/></label>
                <label>강습시작일 :  <DatePicker
                    selected={ this.state.startDate }
                    onChange={ this.handleStartDateChange }
                    name="startDate"
                    dateFormat="yyyy-MM-dd"
                /></label>
                <label><input type="number" id='period' onChange={this.handleChange}/>개월</label>
                <label>성명 : <input type="text" id='name' onChange={this.handleChange}/>
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
                </label>
                <label>핸드폰 : <input type="text" id='phone' onChange={this.handleChange}/></label><br/>
                <label>주민번호 : <input type="number" id='resiNumber1' onChange={this.handleChange}/>-<input type="number" id='resiNumber2' onChange={this.handleChange}/>
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
                <label>주소 : <input type="text" id='address' onChange={this.handleChange}/></label>
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
                <label><input type="checkbox" id='allPremium' checked={this.state.allPremium} onChange={this.toggleChange}/>PREMIUM 전종목</label>
                <label><input type="checkbox" id='gxTwo' checked={this.state.gxTwo} onChange={this.toggleChange}/>GX 2종목</label>
                <label><input type="checkbox" id='gxOne' checked={this.state.gxOne} onChange={this.toggleChange}/>GX 1종목</label>
                <label><input type="checkbox" id='pt' checked={this.state.pt} onChange={this.toggleChange}/>개인 PT</label>
                <label><input type="checkbox" id='spinning' checked={this.state.spinning} onChange={this.toggleChange}/>스피닝</label>
                <label><input type="checkbox" id='guigiPilates' checked={this.state.guigiPilates} onChange={this.toggleChange}/>기구 필라테스</label>
                <label><input type="checkbox" id='onePilates' checked={this.state.onePilates} onChange={this.toggleChange}/>1:1 필라테스</label>
                <label><input type="checkbox" id='health' checked={this.state.health} onChange={this.toggleChange}/>헬스</label>
                <label><input type="checkbox" id='etc2' checked={this.state.etc2} onChange={this.toggleChange}/>기타</label>
                <input type="text" id="inputExercise" className="form-control" placeholder="Exercise" name="Exercise" onChange={this.handleChange}/>
                <br/><br/>
                <h5> 결제 금액</h5>
                <hr/>
                <label><input type="checkbox" id='card' checked={this.state.card} onChange={this.toggleChange}/>카드</label>
                <label><input type="checkbox" id='cash' checked={this.state.cash} onChange={this.toggleChange}/>현금</label>
                <label><input type="checkbox" id='accountTransfer' checked={this.state.accountTransfer} onChange={this.toggleChange}/>계좌이체</label><br/>
                <label>운동 <input type="number" className="form-control" id="ExercisePayment" value={this.state.ExercisePayment} onChange={this.handleChangeAndSum}/></label>
                <label>운동복 <input type="number" className="form-control" id="SportswearPayment" value={this.state.SportswearPayment} onChange={this.handleChangeAndSum}/></label>
                <label>개인 사물함 <input type="number" className="form-control" id="LockerPayment" value={this.state.LockerPayment} onChange={this.handleChangeAndSum}/></label><br/>
                
                <h5> 결제일</h5>
                 <DatePicker
                    selected={ this.state.payDate }
                    onChange={ this.handlePayDateChange }
                    name="payDate"
                    dateFormat="yyyy-MM-dd"
                />
                <h5>금액 합계</h5>
                <label>{this.state.TotalPayment}</label>
                
                <label>비고 : <input type="text" id='note' onChange={this.handleChange}/></label>
                
                <button type="button" onClick={this.handleOnClick}> 등록하기 </button>
            </form>
        </div>
        );
    }
}

const CustomerStateToProps = (state) => {
    return {
      userinfo : state.userinfo
    }
}

export default connect(CustomerStateToProps, undefined)(AddCustomer);

