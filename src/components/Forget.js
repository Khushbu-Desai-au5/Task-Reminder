import React from 'react';
import {Form, Message} from 'semantic-ui-react'
import axios from 'axios'
axios.defaults.withCredentials = true

class Forget extends React.Component{

    state ={
        email:'',
        isError:false,
        isSuccess:false,
        message:''
    }
    handleSubmitAction = () =>{
        axios.post(process.env.REACT_APP_HOSTURL + "/users/forget",{
            username:this.state.email
        })
        .then(res=>{
            if(res.data.statusCode==='200'){
            this.setState({isSuccess:true,message:'Email Has been Successfully Sent to your email id.'})
            }else{ 
             this.setState({isError:true,message:res.data.message})   
            }
        }).catch(res =>{
            this.setState({isError:true,message:'There was a problem resetting your password. Please try again later.'})

        })
    }
    render() {


      return (
        <div className="signupContainer">
            <div style={{"width":"min-content"}}>
            <Form>
            <label className="label"><b>Email</b></label>
            <Form.Input
            onChange={(event) => this.setState({email:event.target.value})}
            type="email"
            placeholder="Enter your Email id" />
            <button type="submit" className="btn btn-warning"
            onClick={this.handleSubmitAction}>Submit</button>
            {
                this.state.isSuccess ? 
                <Message positive
                header={this.state.message}/>
                :null
            }
            {
                this.state.isError ? 
                <Message negative 
                content={this.state.message}/>
                :null
            }
         </Form>
            </div>
        </div>
      )
    };
}


export default Forget;
