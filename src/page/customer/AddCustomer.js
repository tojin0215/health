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
            sex: 111,
            startDate: new Date(),
            period: 0,
            phone: "",
            solar_or_lunar: true,
            address:"",
            join_route:0,
            uncollected:0,
            in_charge:"",
            note:"",
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    };


    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };

    handleOnClick = (e) => {
        console.log(this.state);
        // 서버 연결하는 부분
        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
              'Content-type': 'application/json'
          },
            body: JSON.stringify({
                fitness_no:this.state.fitness_no,
                name:this.state.name,
                sex:this.state.sex,
                start_date:this.state.startDate,
                period:this.state.period,
                phone:this.state.phone,
                solar_or_lunar:this.state.solar_or_lunar,
                address:this.state.address,
                join_route:this.state.join_route,
                uncollected:this.state.uncollected,
                in_charge:this.state.in_charge,
                note:this.state.note
            })
          })
            .then(response => response.json())
            .then(response => {
                // 서버에서 데이터 전달하면 여기서 json type으로 받게 됨
                alert("신규 회원이 등록되었습니다.");
            });
        this.props.history.push('/customer');
    }

    handleDateChange(date) {
        this.setState({
           startDate: date
        })
    }

    render() {        
        return (
            <div>
            <Header />
            <Navigation />
            <h2>신규 회원 등록 페이지</h2>
            <form className="AddSalesForm">
                <hr/>
                <label>담당자 : <input type="text" id='in_charge' onChange={this.handleChange}/></label>
                <label>강습시작일 :  <DatePicker
                    selected={ this.state.startDate }
                    onChange={ this.handleDateChange }
                    name="startDate"
                    dateFormat="yyyy-MM-dd"
                /></label>
                <label>성명 : <input type="text" id='name' onChange={this.handleChange}/></label>
                <label>핸드폰 : <input type="text" id='phone' onChange={this.handleChange}/></label><br/>
                <label>주소 : <input type="text" id='address' onChange={this.handleChange}/></label>
                <label>비고 : <input type="text" id='note' onChange={this.handleChange}/></label>
                <br/><br/>
                
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleOnClick}> 등록하기 </button>
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

