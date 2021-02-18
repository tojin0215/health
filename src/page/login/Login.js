import React, {Component} from 'react';

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ID: "",
            Password: ""
        };
    };
    handleChange = (e) => { 
        this.setState({ 
            [e.target.name]: e.target.value
        }); 
    };
    handleOnClick = (e) => {
        console.log(this.state.ID, this.state.Password);
    }
    render(){
        return (
            <form className="LoginForm">
                <h2 className="LoginHeader"> 로그인 </h2>
                <input type="text" id="inputId" className="form-control" placeholder="ID" name="ID" onChange={this.handleChange}/>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="Password" onChange={this.handleChange}/>
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleOnClick}> 로그인 </button>
            </form>
        );
    };

}

export default Login;


 