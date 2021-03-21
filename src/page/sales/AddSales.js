import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
//import 'bootstrap/dist/css/bootstrap.min.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const userList = [
    {'num':1, 'userName':'김투진','phone':'000-0000-0000'},
    {'num':2, 'userName':'이투진','phone':'000-1111-0000'},
    {'num':3, 'userName':'박투진','phone':'000-2222-0000'},
    {'num':4, 'userName':'최투진','phone':'000-3333-0000'}
]

class AddSales extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fitness_no:this.props.userinfo.fitness_no,
            member_no:this.props.userinfo.member_no,
            //isChecked:false,
            paymentDate: new Date(),
            exerciseName:[],
            inputExercise:'',
            exercisePrice: 0,
            //locker:0,
            lockerPrice: 0,
            //sportswear:0,
            sportswearPrice: 0,
            //TotalPayment: 0,
            paymentTools:'',
            open:false,
            searchKeyword:'',
            userName:'회원'
        };
        //let checkArr;
        this.handleDateChange = this.handleDateChange.bind(this);
        this.toggleChange = this.toggleChange.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    };

    handleClickOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    toggleChange = (e) => {
        const target = e.target
        let value = target.id
        console.log(target.checked)
        if(target.checked === true){
            this.state.exerciseName[value] = value;
            this.setState({
                exerciseName : [...this.state.exerciseName, this.state.exerciseName[value]]
            })
            console.log('들어오는 값 )    ')
            console.log(this.state.exerciseName)
        }else {     
            console.log('들어오니')
            for(var i=0; i<this.state.exerciseName.length; i++){
                if(this.state.exerciseName[i] === value){
                    this.state.exerciseName.splice(i, 1)
                }
            }
            console.log(this.state.exerciseName)
        }

        // this.setState({
        //     isChecked: !this.state.isChecked,
        //     exerciseName:exerciseName.concat(e.target.id)
        // });
        // //alert(e.target.id)
        // console.log(this.state.exerciseName)
    }

    handleChange = (e) => { 
        if(e.target.name ==='paymentTools'){
            this.setState({ 
                [e.target.name]: e.target.id,
            }); 
        } else{
            this.setState({ 
                [e.target.id]: e.target.value,
                //TotalPayment : parseInt(this.state.TotalPayment) + parseInt(e.target.value)
            }); 
        }
    };


    handleDateChange(date) {
        this.setState({
            paymentDate: date
        })
    }

    handleOnClick = (e) => {
        //alert('운동목록 : ' + this.state.exerciseName + ', 운동금액 : '+  this.state.exercisePrice + ', 운동복여부: '+ this.state.sportswear +', 운동복 금액: '+ this.state.sportswearPrice + ', 락커여부: '+ this.state.locker +', 락커금액 : '+  this.state.lockerPrice + ', 결제도구 : '+this.state.paymentTools+', 전체금액 : '+this.state.TotalPayment);

        let ex='';
        console.log('---------------------------')
        for(var i=0; i<this.state.exerciseName.length;i++){
            if(this.state.exerciseName[i] === '기타'){
                ex = this.state.exerciseName[i] +'('+this.state.inputExercise +') /'+ex
            }
            else{
                ex = this.state.exerciseName[i] +'/ '+ex
            }
            
        }

        console.log(this.state);
        fetch("http://localhost:3000/sales", {
            method: "POST",
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
                fitness_no:this.state.fitness_no,
                member_no:this.state.member_no,
                exerciseName:ex,
                exercisePrice:this.state.exercisePrice,
                locker:this.state.locker,
                lockerPrice:this.state.lockerPrice,
                sportswear:this.state.sportswear,
                sportswearPrice:this.state.sportswearPrice,
                paymentTools:this.state.paymentTools,
                paymentDate:this.state.paymentDate
            })
          })
            .then(response => response.json())
            .then(response => {
                alert("등록되었습니다.");
            });
        
        
        this.props.history.push('/sales');
    }

    choiceUser=(e)=>{
        this.setState({
            userName : e.target.value,
            open:false
        })
        alert('선택하셨습니다.')
    }

    handleValueChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        const filteredComponents = (data) => {
            data = data.filter((c) => {
            return c.userName.indexOf(this.state.searchKeyword) > -1;
            });
            return data.map((c) => (
                <TableRow>
                    <TableCell>{c.num}</TableCell>
                    <TableCell>{c.userName}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>
                        <DialogActions>
                            <button type='button' onClick={this.choiceUser} value={c.userName}>선택</button>
                        </DialogActions>
                    </TableCell>
                </TableRow>
            ));
        }

        return (

            <div>
            <Header />
            <Navigation />
            <h2>상품 등록페이지</h2>
            <div>
            <button type='button' onClick={this.handleClickOpen}>
                회원검색
            </button>
            <Dialog open={this.state.open} onClose={this.handleClose} maxWidth='lg'>
                <DialogTitle>고객 검색</DialogTitle>
                <DialogContent>
                    <label>이름을 입력해주세요</label>
                    <input type="search" className="form-control" placeholder="김투진" name="searchKeyword" value={this.state.searchKeyword} onChange={this.handleValueChange}/>
                    
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>번호</TableCell>
                        <TableCell>이름</TableCell>
                        <TableCell>폰번호</TableCell>
                        <TableCell>선택</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList ?
                        filteredComponents(userList)
                        //     userList.map(c => (
                        //         <TableRow>
                        //             <TableCell>{c.num}</TableCell>
                        //             <TableCell>{c.userName}</TableCell>
                        //             <TableCell>{c.phone}</TableCell>
                        //         </TableRow>
                        // )) 
                        :
                        <TableRow>
                            <TableCell colSpan="6" align="center">
                            </TableCell>
                        </TableRow>
                        }
                    </TableBody>
                    </Table>


                </DialogContent>
                <DialogActions>
                    <button type='button' onClick={this.handleClose}>닫기</button>
                </DialogActions>
            </Dialog>
            </div>
            {/* <Link to="/sales">회원 검색</Link><br/> */}
            <form className="AddSalesForm" style={{flexDirection:'column'}}>
                <label>{this.state.userName}님 반갑습니다.</label>
                <h5 className="AddSalesHeader"> 운동 종목 </h5>
                <hr/>
                <label><input type="checkbox" id='PREMIUM 전종목' name='exerciseName' value='1' onChange={this.toggleChange}/>PREMIUM 전종목</label>
                <label><input type="checkbox" id='GX 2종목' name='exerciseName' value='2' onChange={this.toggleChange}/>GX 2종목</label>
                <label><input type="checkbox" id='GX 1종목' name='exerciseName' value='3' onChange={this.toggleChange}/>GX 1종목</label>
                <label><input type="checkbox" id='개인 PT' name='exerciseName' value='4'onChange={this.toggleChange}/>개인 PT</label><br/>
                <label><input type="checkbox" id='스피닝' name='exerciseName' value='5' onChange={this.toggleChange}/>스피닝</label>
                <label><input type="checkbox" id='기구 필라테스' name='exerciseName' value='6' onChange={this.toggleChange}/>기구 필라테스</label>
                <label><input type="checkbox" id='1:1 필라테스' name='exerciseName' value='7' onChange={this.toggleChange}/>1:1 필라테스</label>
                <label><input type="checkbox" id='헬스' name='exerciseName' value='8' onChange={this.toggleChange}/>헬스</label><br/>
                <label><input type="checkbox" id='기타' name='exerciseName' value='9' onChange={this.toggleChange}/>기타</label>
                <input type="text" id="inputExercise" className="form-control" placeholder="Exercise" name="Exercise" onChange={this.handleChange}/>
                <br/><br/>
                <h5> 결제 금액</h5>
                <hr/>
                <label><input type="radio" name='paymentTools' id='카드' onChange={this.handleChange}/>카드</label>
                <label><input type="radio" name='paymentTools' id='현금' onChange={this.handleChange}/>현금</label>
                <label><input type="radio" name='paymentTools' id='계좌이체' onChange={this.handleChange}/>계좌이체</label><br/>
                <label>운동 <input type="text" id="exercisePrice" className="form-control" placeholder="0" onChange={this.handleChange}/></label>
                <label>운동복 <input type="text" id="sportswearPrice" className="form-control" placeholder="0" onChange={this.handleChange}/></label>
                <label>개인 사물함 <input type="text" id="lockerPrice" className="form-control" placeholder="0" onChange={this.handleChange}/></label><br/>
                 
                <h5> 결제일</h5>
                 <DatePicker
                    selected={ this.state.paymentDate }
                    onChange={ this.handleDateChange }
                    name="paymentDate"
                    dateFormat="MM/dd/yyyy"
                />
                <h5>금액 합계</h5> 
                <input type="text" id="TotalPayment" className="form-control" readOnly value={parseInt(this.state.exercisePrice)+parseInt(this.state.sportswearPrice)+parseInt(this.state.lockerPrice)}/>
                
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleOnClick}> 등록하기 </button>
            </form>
        </div>
        );
    }
}

const SalesStateToProps = (state) => {
    return {
      userinfo : state.userinfo
    }
}

export default connect(SalesStateToProps, undefined)(AddSales);