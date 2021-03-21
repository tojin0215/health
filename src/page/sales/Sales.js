import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function dataFormatter(cell, row) {
    return ` ${cell}`.substring(0,11);
}

function PriceFormatter(cell, row){
    return ` ${cell}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+'원';
}

class Sales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            salesLists:[],
            salesLists2:[],
            salesLists3:[],
            toolList:[]
        };
        //this.handleOnClick = this.handleOnClick.bind(this);
    };

    componentWillMount() {
        fetch('http://localhost:3000/sales')
            .then(data => {
                return data.json();
            }).then(data => {
                this.setState({
                    salesLists : data,
                })
                this.state.salesLists.map((data) => {
                    let total = data.exercisePrice+data.lockerPrice+data.sportswearPrice;
                    data = {...data, total}
                    this.setState({
                        salesLists2 : [...this.state.salesLists2, data]
                    })
                })
                
                let card = 0
                let cash = 0
                let transfer = 0
                this.state.salesLists2.map((data) => {
                    if(data.paymentTools === '카드'){
                        card = card + data.total
                    } else if(data.paymentTools === '현금'){
                        cash = cash + data.total
                    } else if(data.paymentTools === '계좌이체'){
                        transfer = transfer + data.total
                    } 
                    this.setState({
                        toolList : [{'card':card, 'cash':cash,'transfer':transfer,'total':card+ cash+transfer}]
                    })
                })
                console.log(this.state.toolList)
            });  
    }

    handleOnClick = (e) => {
        //alert(this.state.startDate + '~' + this.state.endDate + ' 조회하기')
        //console.log(this.state.startDate, this.state.endDate)
        
        let lists = []
        let toolLists = []
        let card = 0
        let cash = 0
        let transfer = 0

        this.state.salesLists.map((data) => {
            //console.log(data)
            let date1 = new Date(data.paymentDate)
            if(date1 >= this.state.startDate && date1 <= this.state.endDate){
                let total = data.exercisePrice+data.lockerPrice+data.sportswearPrice;
                data = {...data, total}
                lists = [...lists, data]

                if(data.paymentTools === '카드'){
                    card = card + data.total
                } else if(data.paymentTools === '현금'){
                    cash = cash + data.total
                } else if(data.paymentTools === '계좌이체'){
                    transfer = transfer + data.total
                } 
                toolLists =[{'card':card, 'cash':cash,'transfer':transfer,'total':card+cash+transfer}]
            }
        })

        this.setState({
            salesLists2 : lists,
            toolList : toolLists
        })
        
  
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        return (
            <div>
                <Header />
                <Navigation />
                <h2>상품등록 페이지</h2>
                <Link to="/sales/add">상품 등록</Link>
                <h5>매출 현황</h5>
                <DatePicker
                    selected={ this.state.startDate }
                    selectsStart
                    maxDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date)=> this.setState({startDate : date})}
                    name="startDate"
                />
                <text>~</text>
                <DatePicker
                    selected={ this.state.endDate }
                    selectsEnd
                    minDate={this.state.startDate}
                    maxDate={new Date()}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date)=> this.setState({endDate : date})}
                    name="endDate"
                />
                <button type="button" onClick={this.handleOnClick}> 조회하기 </button>

                <div>
                <BootstrapTable data={ this.state.toolList }>
                    <TableHeaderColumn dataField='card'>카드</TableHeaderColumn>
                    <TableHeaderColumn dataField='cash'>현금</TableHeaderColumn>
                    <TableHeaderColumn dataField='transfer'>계좌이체</TableHeaderColumn>
                    <TableHeaderColumn dataField='total' isKey>총 매출</TableHeaderColumn>
                </BootstrapTable>
                <br/><br/>
                <h5>전체 기록</h5>
                <BootstrapTable data={ this.state.salesLists2} hover>
                    <TableHeaderColumn dataField='num' isKey>No.</TableHeaderColumn>
                    <TableHeaderColumn dataField='member_no'>회원이름</TableHeaderColumn>
                    <TableHeaderColumn dataField='exerciseName'>상품</TableHeaderColumn>
                    <TableHeaderColumn dataField='paymentDate' dataFormat={dataFormatter}>결제일</TableHeaderColumn>
                    <TableHeaderColumn dataField='total' dataFormat={PriceFormatter}>결제 금액</TableHeaderColumn>
                    <TableHeaderColumn dataField='paymentTools'>종류</TableHeaderColumn>
                </BootstrapTable>

                </div>
            </div>
        );
    }
}

const SalesStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}

export default connect(SalesStateToProps, undefined)(Sales);