import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import '../../styles/customer/Customer.css';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");
const options = [
    '이름', '핸드폰', '담당자', '주민번호(앞자리)'
  ];
const defaultOption = options[0];

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList : [],
            isOpenPopup: false,
            search:"",
            item:options[0],
        }
        
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
    
        this.cusFetch();
    }
    goLogin = () => {
        this.props.history.push("/");
    }
    cusFetch = () => {
        fetch("http://localhost:3000/customer?type=all&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
          })
            .then(response => response.json())
            .then(res => {
                let arr = [];
                for(let i=0 ; i<res.length ; i++){
                    let sor = res[i].solar_or_lunar===true?"양":"음";
                    let s = res[i].sex===true?"남":"여";
                    arr.push({"no":res[i].member_no, "name":res[i].name, "sex":s, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
                }
                this.setState({customerList : arr});
            });
        
    }
    openPopup = () => {
        this.setState({
            isOpenPopup: true,
        })
    }
    closePopup = () => {
        this.setState({
            isOpenPopup: false,
        })
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };
    search = () =>{
        let it = '0'
        if(this.state.item === "이름"){
            it = '0'
        }else if(this.state.item === "핸드폰"){
            it = '1'
        }else if(this.state.item === "담당자"){
            it = '2'
        }else if(this.state.item === "주민번호(앞자리)"){
            it = '3'
        }
        fetch("http://localhost:3000/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
                let arr = [];
                for(let i=0 ; i<res.length ; i++){
                    let sor = res[i].solar_or_lunar===true?"양":"음";
                    let s = res[i].sex===true?"남":"여";
                    arr.push({"no":res[i].member_no, "name":res[i].name, "sex":s, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
                }
                this.setState({customerList : arr});
            });
    }
    selectItem = (e) =>{
        if(e.value == "이름"){
            this.setState({item:"이름"})
        }
        else if(e.value == "핸드폰"){
            this.setState({item:"핸드폰"})
        }else if(e.value == "담당자"){
            this.setState({item:"담당자"})
        }else if(e.value == "주민번호(앞자리)"){
            this.setState({item:"주민번호(앞자리)"})
        }
    }
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (
            <div>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <div className='localNavigation'>
                    <div className='container'>
                        <h2>
                            고객 관리
                        </h2>
                        <div className='breadCrumb'>
                            <Link to='#'>HOME</Link>
                            <span>&#60;</span>
                            <Link to='#'>고객 관리</Link>
                        </div>
                    </div>
                </div>
                <Link to="/customer/add">신규회원 등록</Link>
                <Dropdown options={options} onChange={this.selectItem} value={this.state.item} placeholder="Select an option" />
                <input type="text" id='search' checked={this.state.search} onChange={this.handleChange}/>
                <button type="button" onClick={this.search}> 고객 검색 </button>
                <h5>회원 목록</h5>
                <BootstrapTable data={ this.state.customerList } hover 
                    tableHeaderClass='tableHeader'
                    tableContainerClass='tableContainer'
                    className="table2">
                    <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                         isKey>No.</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >회원이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='sex'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >성별</TableHeaderColumn>
                    <TableHeaderColumn dataField='phone'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >핸드폰</TableHeaderColumn>
                    <TableHeaderColumn dataField='in_charge'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >담당자</TableHeaderColumn>
                    <TableHeaderColumn dataField='start_date'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >강습시작일</TableHeaderColumn>
                    <TableHeaderColumn dataField='resi_no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >주민번호</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

const CustomerStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo
    }
}

export default connect(CustomerStateToProps, undefined)(Customer);