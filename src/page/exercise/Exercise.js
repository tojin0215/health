import React, { Component } from 'react';
import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

class Exercise extends Component {
    render() {
        const { userinfo } = this.props;
        console.log("userinfo : ");
        console.log(userinfo); //나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음
        
        return (
            <div>
            <Header />
            <Navigation />
            <h2>Exercise</h2>
        </div>
        );
    }
}

const ExerciseStateToProps = (state) => {
    return {
      userinfo: state.userinfo
    }
}

export default connect(ExerciseStateToProps, undefined)(Exercise);