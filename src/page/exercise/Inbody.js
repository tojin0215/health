import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import { connect } from 'react-redux';

class Inbody extends Component {

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
        console.log(userinfo); // 나중에 DB에서 불러올 때 사용, 로그인된 ID, fitness 정보 들어있음

        return (
            <div className='inbody'>
                <Header />
                <Navigation goLogin={this.goLogin}/>
                <localNavigation />
                <div className="container">
                     <h2>인바디보기</h2>

                     <Link to="/assign/add" className='btnCustomerNew'>
                        신규회원 등록
                    </Link>
                </div>
            </div>
        );
    }
}

const InbodyStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(InbodyStateToProps, undefined)(Inbody);