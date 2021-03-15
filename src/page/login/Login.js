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
        fetch("http://localhost:3000/manager", {
            method: "POST",
            headers: {
              'Content-type': 'application/json'
          },
            body: JSON.stringify({
                id:this.state.ID,
                password:this.state.Password,
            })
          })
            .then(response => response.json())
            .then(response => {
                if(response == ""){
                    alert("ID 혹은 비밀번호가 잘못 입력되었습니다. 다시 로그인 해주세요.");
                }else{
                    this.props.history.push('/');
                }
            })
            .catch(e =>{
                alert("서버 점검 중입니다.");
            });
        

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


 