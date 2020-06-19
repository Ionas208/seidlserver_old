import React from "react"

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {emailValue: null, passwordValue: null}
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>E-Mail</label>
                <input value={this.state.emailValue} onChange={this.handleEmailChange} type="text"></input>
                <label>Password</label>
                <input value={this.state.passwordValue} onChange={this.handlePasswordChange} type="password"></input>
                <input type="submit" value="Login"></input>
            </form>
        );
    }

    handleEmailChange(event){
        this.setState({emailValue: event.target.value});
        
    }

    handlePasswordChange(event){
        this.setState({passwordValue: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.login();
    }

    login(){
        var x = {user: {
            email: this.state.emailValue,
            password: this.state.passwordValue
        }}
        console.log(x)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(x)
        };
        fetch('http://localhost:4002/auth/login', requestOptions)
            .then(res => res.json())
            .then(json => {
                console.log(json)
            }).catch(() => {
                alert("Login failed!");
            });
    }
}

export default Login;