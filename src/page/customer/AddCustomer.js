import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

class AddCustomer extends Component {
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (
            <div>
            <Header />
            <Navigation />
            <h2>신규회원 등록</h2>
            <Link to="/customer">등록하기</Link>
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