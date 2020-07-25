import React from 'react';
import {Form,Message}from 'semantic-ui-react';
import axios from 'axios'
axios.defaults.withCredentials = true

class Signup extends React.Component{
    state = {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        message:'',
        signupSuccess:false,
        signupError:false
    }
   

    hadleSignupProcess =() =>{
        axios.post(process.env.REACT_APP_HOSTURL  +'/users/create',{
        "firstName":this.state.email,
        "lastName":this.state.lastName,
        "email":this.state.email,
        "password":this.state.password
        }).then(res =>{
           // console.log(res)
            if(res.data.statusCode === "201"){
                this.setState({signupSuccess:true, message:'Your Account has been created with id:' + res.data.message})
            }else if(res.data.statusCode==="206"){
                this.setState({signupError:true, message:res.data.message})
            }else{
                this.setState({signupError:true, message:res.data.message})
            }
        }).catch(res =>{
            this.setState({signupError:true, message:'Sorry!! Service is temporarily unavailable.'})

            
        })
    }
    render(){
        return(
               
            <div className="signupContainer">
                <div>
                <Form>
                    <label className="label"><b>First Name</b></label>
                    <Form.Input required value={this.state.firstName} onChange={(event)=>this.setState({firstName:event.target.value})} fluid placeholder='First name'/>
                    <label className="label"><b>Last Name</b></label>

                    <Form.Input required value={this.state.lastName} onChange={(event)=>this.setState({lastName:event.target.value})} fluid placeholder='Last name' />
                    <label className="label"><b>Email</b></label>

                    <Form.Input required value={this.state.email} onChange={(event)=>this.setState({email:event.target.value})} type='email' placeholder='joe@schmoe.com' />
                    <label className="label"><b>Password</b></label>

                    <Form.Input required value={this.state.password} onChange={(event)=>this.setState({password:event.target.value})} fluid type='password' placeholder='Enter Password' />

                    <button  onClick={this.hadleSignupProcess} className="btn btn-warning">Signup</button>
                    <br/>
                    <p className="label" style={{"fontSize":"small","marginTop":"10px"}}><a href="/login"><b>Already Have an Account?<br/> Login Here !!</b></a></p>

            
                </Form> 
                </div>
                <div style={{"marginTop":"10px"}}>  
                {this.state.signupSuccess ?
                <Message
                success
                header='Your registration was successful'
                content={this.state.message}
                  />:null}

                {this.state.signupError?
                  <Message
                  negative
                  header={this.state.message}
                
                    />:null
                    }
            </div>
            </div>
           
        )

    }

}

export default Signup;