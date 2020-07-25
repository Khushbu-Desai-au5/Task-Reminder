import React from "react";
import axios from "axios";
import { Message, Form } from "semantic-ui-react";
axios.defaults.withCredentials = true


class Login extends React.Component {
  state = {
    email: "",
    password: "",
    emailNotFound:false,
    passwordIncorrect:false,
    error:false
  };
  handleEmailChange = (event) => {
      this.setState({
          email:event.target.value
      })
  };

  handlePasswordChange =(event)=>{
    this.setState({
        password:event.target.value
    })

  }
  handleSignIn =()=>{
      this.setState({
        emailNotFound:false,
        passwordIncorrect:false,
        error:false
      

      })
      axios.post(process.env.REACT_APP_HOSTURL  + '/users/signin',{
        username:this.state.email,
        password:this.state.password
      }).then(res=>{
          //console.log(res.data.statusCode)
          if(res.data.statusCode === "200"){
              this.props.history.push("/task")
          }
          else if(res.data.statusCode === "202"){
                this.setState({
                    emailNotFound:true
                })
            }
          else if(res.data.statusCode === "206"){
                this.setState({
                passwordIncorrect:true
            })
        }
        else{
            this.setState({
                error:true
            })
        }
      })

  }
  


  render() {
    return (
        <div className="loginForm">
        <div>
      <Form >
          <label className="label"><b>Email</b></label>
          <Form.Input
            onChange={(event) => this.handleEmailChange(event)}
            type="email"
            placeholder="Enter your Email id" />
          <label className="label"><b>Password</b></label>
          <Form.Input onChange={(event) => this.handlePasswordChange(event)} type="password" placeholder="Enter your password" />
       
        <button onClick={this.handleSignIn} style={{"marginTop":"10px"}} type="submit" className="btn btn-warning">
          Submit
        </button>
          <div className="frogotSignupContainer">
          <p className="label" style={{"fontSize":"small","marginTop":"10px"}}><a href="/forget"><b>forgot password?</b></a></p>
          <p className="label" style={{"fontSize":"small","marginTop":"10px"}}><a href="/signup"><b>Don't Have an Account?<br/> Signup Here !!</b></a></p>
         
          </div>

      </Form>
      </div>
        <div style={{"marginTop":"10px"}}>  
                {this.state.emailNotFound ?
                <Message negative
                header='This Email is not registerd with us.'
                content="Please signup first" />:null}
        </div>
        <div style={{"marginTop":"10px"}}>  
        {this.state.passwordIncorrect ?
        <Message negative
        header='Your password is incorrect'/>
        :null}
        </div>
        <div style={{"marginTop":"10px"}}>  
        {this.state.error ?
        <Message negative
        header='Sorry!! Service is temporarily unavailable.'/>
        :null}
        </div>
        </div>

    )
  }
}

export default Login;
