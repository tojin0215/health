import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';

const ip = '13.124.141.28';
class Statistics extends Component {

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
            <div className='statistics'>
                <div className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin}/>
                    <div className='localNavigation'>
                        <div className='container'>
                            <h2>
                                통계
                            </h2>
                            <div className='breadCrumb'>
                                <Link to='/home'>HOME</Link>
                                <span>&#62;</span>
                                <Link to='/statistics'>통계</Link>
                            </div>
                        </div>{/*.container */}
                    </div>{/*.localNavigation */}
                </div>{/*.header */}
                <div className="container">
                     <h2>통계페이지</h2>
                </div>
                <div className='footer'>
                    <Footer />
                </div>{/*.footer */}
            </div>
        );
    }
}

const StatisticsStateToProps = (state) => {
    return {
      userinfo: state.authentication.userinfo
    }
}

export default connect(StatisticsStateToProps, undefined)(Statistics);