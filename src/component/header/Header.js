import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFitness } from '../../action/userinfo';

class Header extends Component {
  render() {
    const { userinfo } = this.props;

    return (
      <div>
          
      </div>
    );
  }
}
const headerStateToProps = (state) => {
  return {
    userinfo: state.userinfo
  }
}
export default connect(headerStateToProps, undefined)(Header);


/*class Header extends Component {

  render() {
    let input;
    const {onClick} = this.props;
    

    return (
      <div>
          <input ref={node => {
            input = node;
          }}/>

          <button onClick={() =>{
            onClick(input.value);
            input.value = "";
          }}>Add</button>
      </div>
    );
  }
}

const headerDispatchToProps = (dispatch) => {
    return {
        onClick(txt){
          dispatch(addTodo(txt))
        }
    }
}

export default connect(undefined, headerDispatchToProps)(Header);
*/