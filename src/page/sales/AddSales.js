import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import '../../styles/AddSales.css'

//import 'bootstrap/dist/css/bootstrap.min.css';


// const ExerciseList = [
//     "PREMIUM 전종목", 
//     "GX 2종목", 
//     "GX 1종목",
//     "개인 PT", 
//     "스피닝", 
//     "기구 필라테스",
//     "1:1 필라테스", 
//     "헬스",
//     "기타", 
// ];

class AddSales extends Component {
    goLogin = () => {
        this.props.history.push("/");
    }
    constructor(props) {
        super(props);
        this.state = {
            isChecked:false,
            startDate: new Date(),
            Exercise:"",
            ExercisePayment: "0",
            SportswearPayment: "0",
            LockerPayment: "0",
            TotalPayment:"0",
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    };

    toggleChange = (e) => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
        alert(e.target.id)
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.name]: e.target.value,
        }); 
    };

    handleOnClick = (e) => {
        console.log(this.state.Exercise +' '+  this.state.ExercisePayment +' '+ this.state.SportswearPayment +' '+  this.state.LockerPayment);
        alert(this.state.Exercise +' '+  this.state.ExercisePayment +' '+ this.state.SportswearPayment +' '+  this.state.LockerPayment);
        this.props.history.push('/sales');
    }

    handleDateChange(date) {
        this.setState({
           startDate: date
        })
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (

            <div>
            <Header />
            <Navigation goLogin={goLogin}/>
            <h2>상품 등록페이지</h2>
            <Link to="/sales">회원 검색</Link><br/>
            <form className="AddSalesForm">
                <h5 className="AddSalesHeader"> 운동 종목 </h5>
                <hr/>
                <label><input type="checkbox" id='PREMIUM 전종목' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>PREMIUM 전종목</label>
                <label><input type="checkbox" id='GX 2종목' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>GX 2종목</label>
                <label><input type="checkbox" id='GX 1종목' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>GX 1종목</label>
                <label><input type="checkbox" id='개인 PT' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>개인 PT</label><br/>
                <label><input type="checkbox" id='스피닝' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>스피닝</label>
                <label><input type="checkbox" id='기구 필라테스' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>기구 필라테스</label>
                <label><input type="checkbox" id='1:1 필라테스' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>1:1 필라테스</label>
                <label><input type="checkbox" id='헬스' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>헬스</label><br/>
                <label><input type="checkbox" id='기타' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>기타</label>
                <input type="text" id="inputExercise" className="form-control" placeholder="Exercise" name="Exercise" onChange={this.handleChange}/>
                <br/><br/>
                <h5> 결제 금액</h5>
                <hr/>
                <label><input type="checkbox" id='카드' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>카드</label>
                <label><input type="checkbox" id='현금' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>현금</label>
                <label><input type="checkbox" id='계좌이체' defaultChecked={this.state.isChecked} onChange={this.toggleChange}/>계좌이체</label><br/>
                <label>운동 <input type="text" id="inputExercisePayment" className="form-control" placeholder="0" name="ExercisePayment" onChange={this.handleChange}/></label>
                <label>운동복 <input type="text" id="inputSportswearPayment" className="form-control" placeholder="0" name="SportswearPayment" onChange={this.handleChange}/></label>
                <label>개인 사물함 <input type="text" id="inputLockerPayment" className="form-control" placeholder="0" name="LockerPayment" onChange={this.handleChange}/></label><br/>
                
                <h5> 결제일</h5>
                 <DatePicker
                    selected={ this.state.startDate }
                    onChange={ this.handleDateChange }
                    name="startDate"
                    dateFormat="MM/dd/yyyy"
                />
                <h5>금액 합계</h5>
                <input type="text" id="inputTotalPayment" className="form-control" name="TotalPayment" onChange={this.handleChange} value={this.state.ExercisePayment+this.state.SportswearPayment+this.state.LockerPayment}/>
                
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleOnClick}> 등록하기 </button>
            </form>
        </div>
        );
    }
}

const SalesStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo
    }
}

export default connect(SalesStateToProps, undefined)(AddSales);