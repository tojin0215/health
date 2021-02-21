import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navigation extends Component {
    render() {
        const activeStyle = {
            color: 'green',
            fontSize: '2rem'
        };
    
        return (
            <div className="Navigation">
                <li><NavLink exact to="/" activeStyle={activeStyle}>Home</NavLink></li>
                <li><NavLink to="/customer" activeStyle={activeStyle}>고객</NavLink></li>
                <li><NavLink to="/sales" activeStyle={activeStyle}>상품/매출</NavLink></li>
                <li><NavLink to="/exercise" activeStyle={activeStyle}>운동</NavLink></li>
                <hr/>
            </div>
        );
    }
}

export default Navigation;
