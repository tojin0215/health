import React, { Component } from 'react';
import { render } from 'react-dom';

import Navigation from '../../component/navigation/Navigation';
import Header from '../../component/header/Header';
import Footer from '../../component/footer/Footer';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import MegaMenu from '../../component/navigation/Menu';
import { SERVER_URL } from '../../const/settings';
const ip = SERVER_URL;

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reservation: [],
        }
        this.reservationSelect();
    }

    goLogin = () => {
        this.props.history.push('/');
    };

    reservationSelect = () => {
        fetch(ip + '/reservation/select',
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            })
            .then((result) => result.json())
            .then((result) => {
                this.setState({ reservation: result })
                console.log(result)
            })
    }

    render() {
        return (
            <div className='addCustomer'>
                <header className='header'>
                    <Header />
                    <Navigation goLogin={this.goLogin} />
                    <MegaMenu />
                    <div className='container'>
                        Reservation
                    </div>
                </header>
                <div className='footer'>
                    <Footer />
                </div>
            </div>
        )
    }
}

const ReservationStateToProps = (state) => {
    return {
        userinfo: state.authentication.userinfo,
        status: state.authentication.status,
    };
};

const ReservationDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
    };
};


export default connect(ReservationStateToProps, ReservationDispatchToProps)(Reservation);