import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';


class Customer extends Component {
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (
            <div>
            <Header />
            <Navigation />
            <h2>회원 목록</h2>
            <Link to="/customer/add">신규회원 등록</Link>
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