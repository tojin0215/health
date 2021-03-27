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
import Select from 'react-select'

import './Sales.css'

const options = [
    { value: 'all', label: '전체' },
    { value: 'card', label: '카드' },
    { value: 'cash', label: '현금' },
    { value: 'transfer', label: '계좌이체' }
  ]


function dataFormatter(cell, row) {
    return ` ${cell}`.substring(0,11);
}

function PriceFormatter(cell, row){
    return ` ${cell}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")+'원';
}

// const totalSales = [
//     { "card": 325000, "cash": 100000, "transfer": 200000, "total" : 625000 },
//   ]

// const salesList = [
//     { "no": 1, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 2, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 3, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 4, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 5, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 6, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 7, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//     { "no": 8, "user": '김투진', "product": "필라테스", "paymentDate":"2021.02.22", "payment" : 1200000, "kinds":'카드' },
//   ]

class Sales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            salesLists:[],
            salesLists2:[],
            salesLists3:[],
            toolList:[],
            customerList:[],
            selectedOption: null
        };
    };
    goLogin = () => {
        this.props.history.push("/");
    }
    
    componentWillMount() {
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
                    arr.push({"num":res[i].member_no, "userName":res[i].name})
                }
                this.setState({customerList : arr});
        });

        fetch('http://localhost:3000/sales?type=all&fn='+this.props.userinfo.fitness_no, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          },
          })
            .then(data => {
                return data.json();
            }).then(data => {
                this.setState({
                    salesLists : data,
                })
                
                let card = 0
                let cash = 0
                let transfer = 0
                this.state.salesLists.map((data) => {
                    let total = data.exercisePrice+data.lockerPrice+data.sportswearPrice;
                    data = {...data, total}
                    this.state.customerList.map((c)=>{
                        if(data.member_no === c.num){
                            let userName = c.userName;
                            data = {...data, userName}
                        }
                    })
                    let date1 = new Date(data.paymentDate)
                    let startTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate())
                    let endTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), (this.state.endDate.getDate()+1))
                    
                    if(date1 >= startTime && date1 < endTime){
                        if(data.paymentTools === '카드'){
                            card = card + data.total
                        } else if(data.paymentTools === '현금'){
                            cash = cash + data.total
                        } else if(data.paymentTools === '계좌이체'){
                            transfer = transfer + data.total
                        } 
                    }
                    this.setState({
                        salesLists2 : [...this.state.salesLists2, data],
                        //toolList : [{'card':card, 'cash':cash,'transfer':transfer,'total':card+ cash+transfer}]
                        toolList : [{'card':1, 'cash':1,'transfer':1,'total':card+ cash+transfer}]
                    })
                })
                
            });  
    }

    handleChange =(selectedOption )=> {    
        //console.log('====',selectedOption.label)
        let url = ''
        if(selectedOption.label === '전체'){
            url = "http://localhost:3000/sales?type=all&fn="+this.props.userinfo.fitness_no
        } else{
            url = "http://localhost:3000/sales?type=tools&paymentTools="+selectedOption.label+"&fn="+this.props.userinfo.fitness_no
        }
        fetch(url, {
            method: "GET",
            headers: {
              'Content-type': 'application/json'
          }
        })
        .then(data => {
            return data.json();
        }).then(data => {
            this.setState({
                salesLists : data,
            })
            let list = []
            this.state.salesLists.map((data) => {
                let total = data.exercisePrice+data.lockerPrice+data.sportswearPrice;
                data = {...data, total}
                this.state.customerList.map((c)=>{
                    if(data.member_no === c.num){
                        let userName = c.userName;
                        data = {...data, userName}
                    }
                })
                list = [...list, data]
                
            })
            this.setState({
                salesLists2 : list,
                selectedOption: selectedOption
            })
        })
    }

    handleOnClick = (e) => {
        
        let lists = []
        let toolLists = []
        let card = 0
        let cash = 0
        let transfer = 0

        this.state.salesLists.map((data) => {
            //console.log(data)
            let date1 = new Date(data.paymentDate)
            let startTime = new Date(this.state.startDate.getFullYear(), this.state.startDate.getMonth(), this.state.startDate.getDate())
            let endTime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), (this.state.endDate.getDate()+1))
            console.log('****num',data.member_no,'data1__',date1,'*****start__',startTime,'end_--',endTime)
            if(date1 >= startTime && date1 < endTime){
                let total = data.exercisePrice+data.lockerPrice+data.sportswearPrice;
                data = {...data, total}
                this.state.customerList.map((c)=>{
                    if(data.member_no === c.num){
                        let userName = c.userName;
                        data = {...data, userName}
                    }
                })
                lists = [...lists, data]

                if(data.paymentTools === '카드'){
                    card = card + data.total
                } else if(data.paymentTools === '현금'){
                    cash = cash + data.total
                } else if(data.paymentTools === '계좌이체'){
                    transfer = transfer + data.total
                } 
                //toolLists =[{'card':card, 'cash':cash,'transfer':transfer,'total':card+cash+transfer}]
                toolLists =[{'card':1, 'cash':1,'transfer':1,'total':card+cash+transfer}]
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
        const { selectedOption } = this.state;

        return (
            <div>
                <Header />
                <Navigation goLogin={this.goLogin}/>
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
                                onChange={(date)=> this.setState({startDate : date})}
                                name="startDate"
                                dateFormat="MM/dd/yyyy"
                            />
                            <text> ~ </text>
                            <DatePicker
                                selected={ this.state.endDate }
                                selectsEnd
                                minDate={this.state.startDate}
                                maxDate={new Date()}
                                onChange={(date)=> this.setState({endDate : date})}
                                name="endDate"
                                dateFormat="MM/dd/yyyy"
                            />
                            <button type="button" onClick={this.handleOnClick}> 조회하기 </button>
                        </div>
                    </div>

                    <div>
                    <BootstrapTable data={ this.state.toolList } 
                        tableHeaderClass='tableHeader'
                        tableContainerClass='tableContainer'>
                        <TableHeaderColumn dataField='card' dataFormat={PriceFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >카드</TableHeaderColumn>
                        <TableHeaderColumn dataField='cash' dataFormat={PriceFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >현금</TableHeaderColumn>
                        <TableHeaderColumn dataField='transfer' dataFormat={PriceFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >계좌이체</TableHeaderColumn>
                        <TableHeaderColumn dataField='total' dataFormat={PriceFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                         isKey>총 매출</TableHeaderColumn>
                    </BootstrapTable>
                    <br/><br/>
                    <h5>전체 기록</h5>
                    <BootstrapTable data={ this.state.salesLists2 } hover 
                        tableHeaderClass='tableHeader'
                        tableContainerClass='tableContainer'
                        className="table2">
                        <TableHeaderColumn dataField='num'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                         isKey>No.</TableHeaderColumn>
                        <TableHeaderColumn dataField='userName'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >회원이름</TableHeaderColumn>
                        <TableHeaderColumn dataField='exerciseName'
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >상품</TableHeaderColumn>
                        <TableHeaderColumn dataField='paymentDate' dataFormat={dataFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >결제일</TableHeaderColumn>
                        <TableHeaderColumn dataField='total' dataFormat={PriceFormatter}
                        thStyle={ { 'textAlign': 'center' } }
                        tdStyle={ { 'textAlign': 'center' } }
                        >결제 금액</TableHeaderColumn>
                        <TableHeaderColumn dataField='paymentTools'
                        thStyle={ { 'textAlign': 'center'} }
                        tdStyle={ { 'textAlign': 'center'} }
                        >
                            <Select 
                                menuPortalTarget={document.querySelector('body')}
                                placeholder = '결제도구' 
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={options} 
                        />
                        </TableHeaderColumn>
                    </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}

const SalesStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(SalesStateToProps, undefined)(Sales);