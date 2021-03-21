import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

require('moment-timezone');
var moment = require('moment');

moment.tz.setDefault("Asia/Seoul");

/*const salesList = [
    { "no": 1, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 2, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 3, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 4, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 5, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' ,"d":"d"},
    { "no": 6, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 7, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
    { "no": 8, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드',"d":"d" },
  ]
*/
class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList : [],
        }
        this.cusFetch();
    }

    cusFetch = () => {
        fetch("http://localhost:3000/customer", {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
            
          })
            .then(response => response.json())
            .then(res => {
                let arr = [];
                for(let i=0 ; i<res.length ; i++){
                    let sor = res[i].solar_or_lunar===0?"양":"음";
                    arr.push({"no":res[i].member_no, "name":res[i].name, "sex":res[i].sex, "phone":res[i].phone, "in_charge":res[i].in_charge,"start_date":moment(res[i].start_date).format("YYYY/MM/DD")+"~ ("+res[i].period+"개월)", "resi_no":res[i].resi_no+ " ("+sor+")" })
                }
                this.setState({customerList : arr});
            });
        
    }
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (
            <div>
                <Header />
                <Navigation />
                <Link to="/customer/add">신규회원 등록</Link>
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
      userinfo : state.userinfo
    }
}

export default connect(CustomerStateToProps, undefined)(Customer);