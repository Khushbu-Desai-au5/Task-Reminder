import React from 'react';
import { Form,Message } from 'semantic-ui-react';
import axios from 'axios'
axios.defaults.withCredentials = true


class Reset extends React.Component{
    state ={
        newPassowrd :'',
        confirmPassword:'',
        isMatch : true,
        isError:false,
        message:'',
        isSuccess : false,
        tokenExpire: false
    }
    componentDidMount(){
        const token = this.props.match.params.token
        //console.log(token)
        axios.get(process.env.REACT_APP_HOSTURL + '/users/reset/' + token)
        .then(res =>{
           // console.log(res)

            if(res.data.statusCode !=="200"){
                this.setState({tokenExpire:true})    
            }
        })
        .catch(res =>{
            //console.log(res)
            this.setState({tokenExpire:true})    
        })

    }
    handleSubmitAction = () =>{

        if(this.state.newPassowrd !== this.state.confirmPassword){
            this.setState({isError:true,message:'New Password and Confirm Password does not match.'})
            return
        }
        const token = this.props.match.params.token
       axios.post(process.env.REACT_APP_HOSTURL + '/users/reset/' + token,{
           password:this.state.newPassowrd
       })
       .then(res =>{
            if(res.data.statusCode ==='201'){
                this.setState({isSuccess:true})
            }else{
                this.setState({isError:true,message:'We Could not reset your password. Try again After Some time.'})
            }
       }).catch(res =>{
                this.setState({isError:true,message:'We Could not reset your password. Try again After Some time.'})

       })
    }
    matchPassowrd = (confirmPassword) =>{
        if(confirmPassword === this.state.newPassowrd){
            this.setState({isMatch:true})
        }else{
            this.setState({isMatch:false})
        }
      
    }
    render() {
    
            const cssConfPass = this.state.isMatch ? 'success':'error'
     if(this.state.tokenExpire){
         return (
             <div>
                 <p>Token has expired. Please click <a href="/login">Here</a> and Try again.</p>

             </div>
         )
     }
      return (
        <div className="signupContainer">
            <div style= {{"width":"min-content"}}>

            
            <Form>
            <label className="label"><b>New Password</b></label>
          <Form.Input onChange={(event) => this.setState({newPassowrd:event.target.value})} type="password" placeholder="Enter your New password" />
          <label className="label"><b>Confirm Password</b></label>
          <Form.Input className={cssConfPass} onKeyUp={(event) =>{this.matchPassowrd(event.target.value)}} onChange={(event) =>this.setState({confirmPassword:event.target.value})} type="password" placeholder="Rewrite New Password" />
         
        <button onClick={this.handleSubmitAction} style={{"marginTop":"10px"}} type="submit" className="btn btn-warning">
          Submit
        </button>
        {
        this.state.isError ?
            <Message negative
            content={this.state.message}/>
            :null
        }{
            this.state.isSuccess ? 
            <div>
            <Message positive style={{"marginTop":"10px"}}
            content='Your Password has successfully changed.'/>
            <p className="label" style={{"fontSize":"small","marginTop":"10px"}}><a href="/login">Click here to Login !</a></p> </div> : null
        }
        </Form>
        </div>
        </div>
      )
    };
}

export default Reset;