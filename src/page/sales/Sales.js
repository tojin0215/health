import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import './Sales.css'

const totalSales = [
    { "card": 325000, "cash": 100000, "transfer": 200000, "total" : 625000 },
  ]

const salesList = [
    { "no": 1, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 2, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 3, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 4, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 5, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 6, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 7, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
    { "no": 8, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
  ]

class Sales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
        };
        this.handleDateChange = this.handleDateChange.bind(this);
    };

    handleDateChange(date) {
        this.setState({
            startDate: date,
            endDate : date
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
                <localNavigation />
                <div className="salesContainer">
                    <h2>상품등록 페이지</h2>
                    <div className="salesUtill">
                        <Link to="/sales/add">
                            <Button color="primary">
                                상품 등록
                            </Button>
                        </Link>
                        <div className="salesStatus">
                            <h5>매출 현황</h5>
                            <DatePicker
                                selected={ this.state.startDate }
                                selectsStart
                                maxDate={new Date()}
                                onChange={ this.handleDateChange }
                                name="startDate"
                                dateFormat="MM/dd/yyyy"
                            />
                            <text> ~ </text>
                            <DatePicker
                                selected={ this.state.endDate }
                                selectsEnd
                                minDate={this.state.startDate}
                                maxDate={new Date()}
                                onChange={ this.handleDateChange }
                                name="endDate"
                                dateFormat="MM/dd/yyyy"
                            />
                        </div>
                    </div>

                    <div>
                    <BootstrapTable data={ totalSales } 
                        tableHeaderClass='tableHeader'
                        tableContainerClass='tableContainer'>
                        <TableHeaderColumn dataField='card'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >카드</TableHeaderColumn>
                        <TableHeaderColumn dataField='cash'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >현금</TableHeaderColumn>
                        <TableHeaderColumn dataField='transfer'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >계좌이체</TableHeaderColumn>
                        <TableHeaderColumn dataField='total'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                         isKey>총 매출</TableHeaderColumn>
                    </BootstrapTable>
                    <br/><br/>
                    <h5>전체 기록</h5>
                    <BootstrapTable data={ salesList } hover 
                        tableHeaderClass='tableHeader'
                        tableContainerClass='tableContainer'
                        className="table2">
                        <TableHeaderColumn dataField='no'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                         isKey>No.</TableHeaderColumn>
                        <TableHeaderColumn dataField='user'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >회원이름</TableHeaderColumn>
                        <TableHeaderColumn dataField='product'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >상품</TableHeaderColumn>
                        <TableHeaderColumn dataField='paymentDate'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >결제일</TableHeaderColumn>
                        <TableHeaderColumn dataField='payment'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >결제 금액</TableHeaderColumn>
                        <TableHeaderColumn dataField='kinds'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >종류</TableHeaderColumn>
                    </BootstrapTable>
                    </div>
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