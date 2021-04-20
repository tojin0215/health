import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import '../../styles/customer/Customer.css';


const ip = '13.124.141.28';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");
const options = [
    '이름', '핸드폰', '담당자', '주민번호(앞자리)'
  ];
const defaultOption = options[0];

function dataFormatter(cell, row) {
    return ` ${cell}`.substring(0,11);
}

function PriceFormatter(cell, row){
    return ` ${cell}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+'원';
}

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList : [],
            isOpenPopup: false,
            search:"",
            item:options[0],
            userLists:[],
            userLists2:[],
            userSalesLists:[],
            userSalesLists2:[],
            name:'',
            member_no:'',
            info:'',
            addr:'',
            phone:'',
            startDate:'',
            trainer:'',
            note:'',
            show:false
        }
        
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.cusFetch();
    }
    goLogin = () => {
        this.props.history.push("/");
    }
    cusFetch = () => {
        //fetch("http://"+ip+":3001/customer?type=all&fn="+this.props.userinfo.fitness_no, {
        fetch("http://localhost:3000/customer?type=all&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
          })
            .then(response => response.json())
            .then(res => {
                let arr = [];
                for(let i=(res.length-1) ; i>=0 ; i--){
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
    handleClickAway=()=>{
        this.setState({
            show:false
        })
    }

    handleChange = (e) => { 
        this.setState({ 
            [e.target.id]: e.target.value,
        }); 
    };
    
    calAge(data){ //만 나이 계산
        const today = new Date();
        let year = (data).substring(0,2)
        if(parseInt(year) >= '00' && parseInt(year) <=30){
            year = 20+year
        }else{
            year = 19+year
        }
        let month = (data).substring(2,4)-1
        let day = (data).substring(4,6)
        let birthday = new Date(year,month,day)
        
        let age = today.getFullYear()-birthday.getFullYear();
        let m = today.getMonth()-birthday.getMonth();

        if(m<0 || (m === 0 && today.getDate() < birthday.getDate())){
            age --;
        }
        return age;        
    }


    onSelectRow=(row, isSelected, e)=> { //table row 클릭시
        if (isSelected) {
            //alert(row['no'])
            //fetch("http://"+ip+":3001/customer?type=select&member_no="+row['no']+"&fn="+this.props.userinfo.fitness_no, {
            fetch("http://localhost:3000/customer?type=select&member_no="+row['no']+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            })
            .then(response => response.json())
            .then(res => {
                this.setState({userLists : res});
                this.state.userLists.map((data)=>{
                    let age = this.calAge(data.resi_no) // 만나이
                    let sex = data.sex===true?"남":"여";
                    let info = sex+'/만'+age+'세/'+data.resi_no
                    let phone = data.phone.substring(0,3)+'-'+data.phone.substring(3,7)+'-'+data.phone.substring(7,11)
                    let date = moment(data.start_date).format("YYYY/MM/DD")
                    data = {...data,age}
                    this.setState({
                        //userLists2:data,
                        name : data.name,
                        member_no:data.member_no,
                        info : info,
                        addr : data.address,
                        phone : phone,
                        startDate : date,
                        trainer: data.in_charge,
                        note : data.note,
                    })
                    //alert('age : '+this.calAge(data.resi_no))
                })
            });
            //fetch("http://"+ip+":3001/sales?type=customer&member_no="+row['no']+"&fn="+this.props.userinfo.fitness_no, {
            fetch("http://localhost:3000/sales?type=customer&member_no="+row['no']+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
            },
            })
            .then(response => response.json())
            .then(res => {
                this.setState({userSalesLists : res});
                
                let arr = [];
                this.state.userSalesLists.map((data)=>{
                    let locker = '';
                    let sportswear = '';
                    if(data.lockerPrice !== 0){
                        locker = '개인 사물함'
                        arr.push({'product':locker,'date':data.paymentDate,'payment':data.lockerPrice})
                    } 
                    if(data.sportswearPrice !== 0){
                        sportswear = '운동복'
                        arr.push({'product':sportswear,'date':data.paymentDate,'payment':data.sportswearPrice})
                    }
                    arr.push({'product':data.exerciseName,'date':data.paymentDate,'payment':data.exercisePrice})
                })
                
                this.setState({
                    userSalesLists2:arr,
                    show:true
                })
            });
        }
      }

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
        //fetch("http://"+ip+":3001/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
        fetch("http://localhost:3000/customer?type=search"+it+"&search="+this.state.search+"&fn="+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(res => {
                let arr = [];
                for(let i=(res.length-1) ; i>=0 ; i--){
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
        
        const textOptions = {
            noDataText: '가입된 회원이 없습니다.',
            alwaysShowAllBtns: true,
            hideSizePerPage:true
        };

        const options1 = {
            alwaysShowAllBtns: true,
            hideSizePerPage:true,
            sizePerPage:5
        };


        const selectRowProp = {
            mode: 'checkbox',
            //bgColor: 'pink', // you should give a bgcolor, otherwise, you can't regonize which row has been selected
            hideSelectColumn: true,  // enable hide selection column.
            clickToSelect: true , // you should enable clickToSelect, otherwise, you can't select column.
            onSelect: this.onSelectRow,
          };

        console.log('table__',this.state.userSalesLists2)
        console.log('클릭,',this.state.show)
        return (
            <div className='customer'>
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
                
            <ClickAwayListener onClickAway={this.handleClickAway}>
               
                <div className='container'>
                    <div className='customerSearch'>
                        <Dropdown className='searchDrop' options={options} onChange={this.selectItem} value={this.state.item} placeholder="Select an option" />
                        <input type="text" id='search' checked={this.state.search} onChange={this.handleChange} />
                        <button type="button" onClick={this.search}> 고객 검색 </button>
                    </div>
                    <Link to="/customer/add" className='btnCustomerNew'>
                        신규회원 등록
                    </Link>
                    <div className='customerTable'>
                        <h5>회원 목록</h5>
                        <div>
                        <BootstrapTable data={ this.state.customerList } hover 
                            options={textOptions}
                            tableHeaderClass='tableHeader'
                            tableContainerClass='tableContainer'
                            pagination={ this.state.customerList.length > 1 }
                            selectRow={ selectRowProp }
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
                    </div><br/><br/><br/>
                    </div>
        
        {/* --------여기가 클릭하면 나와야하는 부분입니다 -------- -------- */}
                    {this.state.show?
                        <div>
                            <h5>상품 결제 내역</h5>
                            <Link to={{pathname:"/customer/update?member_no="+this.state.member_no}} className='btnCustomerNew'>
                                수정하기
                            </Link><br/><br/>
                            <button type="button" onClick={this.handleClickAway}>X</button><br/>
                            <label>이름</label><label>{ this.state.name }</label><br/>
                            <label>고객번호</label><label>{ this.state.member_no }</label><br/>
                            <label>정보</label><label>{ this.state.info }</label><br/>
                            <label>연락처</label><label>{ this.state.phone }</label><br/>
                            <label>주소</label><label>{ this.state.addr }</label><br/>
                            <label>등록일</label><label>{ this.state.startDate }</label><br/>
                            <label>담당자</label><label>{ this.state.trainer }</label><br/>
                            <label>비고</label><label>{ this.state.note }</label><br/>
                            <BootstrapTable data={ this.state.userSalesLists2 } hover 
                                pagination={ this.state.customerList.length > 1 }
                                options={options1}
                                tableHeaderClass='tableHeader'  
                                tableContainerClass='tableContainer'
                                className="table2">
                                <TableHeaderColumn dataField='product'
                                    thStyle={ { 'textAlign': 'center' } }
                                    tdStyle={ { 'textAlign': 'center' } }
                                    isKey>상품</TableHeaderColumn>
                                <TableHeaderColumn dataField='date' dataFormat={dataFormatter}
                                    thStyle={ { 'textAlign': 'center' } }
                                    tdStyle={ { 'textAlign': 'center' } }
                                    >결제일자</TableHeaderColumn>
                                <TableHeaderColumn dataField='payment' dataFormat={PriceFormatter}
                                    thStyle={ { 'textAlign': 'center' } }
                                    tdStyle={ { 'textAlign': 'center' } }
                                    >금액</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :null
                        }
                            
        {/* --------여기가 클릭하면 나와야하는 부분입니다 -------- -------- */}      
                    
                </div>    
                </ClickAwayListener>    
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