import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

class AddInbody extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    };

    goLogin = () => {
        this.props.history.push("/");
    }

    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo);
        
        return (

            <div>
            <Header />
            <Navigation goLogin={this.goLogin}/>
            <h2>인바디 추가페이지</h2>
          
            </div>
        );
    }
}

const InbodyStateToProps = (state) => {
    return {
      userinfo : state.authentication.userinfo
    }
}

export default connect(InbodyStateToProps, undefined)(AddInbody);