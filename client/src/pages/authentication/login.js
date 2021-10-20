import axios from "axios";

import React, { Component } from "react";
import { useHistory } from "react-router-dom";


export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      email:"",
      password:""
    }

    
  }
  
    render() {
      //const history=useHistory()
      
        return (
          <div style={{height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:"#24a0ed",flexDirection:'column'}}>
            
            <div>
            <form style={{backgroundColor:"white",borderRadius:7,paddingTop:20,paddingBottom:20,paddingLeft:20,paddingRight:20}}>
                <h3 style={{textAlign:'center',fontFamily:'-moz-initial'}}>Sign In</h3>

                <div className="form-group">
                    <label style={{fontFamily:'-moz-initial'}}>Email </label>
                    <input 
                    style={{height:30,fontFamily:'-moz-initial',fontSize:12}}
                    onChange={(e)=>{
                      this.setState({email:e.target.value})
                    }}
                    
                    type="email" className="form-control"  />
                </div>

                <div style={{marginTop:5}} className="form-group" >
                    <label style= {{fontFamily:'-moz-initial'}}>Password</label>
                    <input 
                    style={{height:30}}
                     onChange={(e)=>{
                      this.setState({password:e.target.value})
                    }}
                    
                    type="password" className="form-control" />
                </div>
                <div class='row justify-content-center' style={{marginTop:8}}>

     

                <button style={{alignSelf:'center'}} 
                onClick={()=>
                  {
                  axios.post("http://localhost:8081/login",{
                    email:this.state.email,
                    password:this.state.password
                  }).then(res=>{
                    console.log("Res",res)
                    if(res && res.data && res.data.message=="Success"){
                      
                      localStorage.setItem("user",JSON.stringify(res))
                    
                   this.props.history.push("Home")
                  
                    }
                    else if(res && res.data && res.data.message=="User not found"){
                      alert("User not found")
                    }
                    else if(res && res.data && res.data.message=="Invalid Credentials"){
                      alert("Invalid Credentials")
                    }

                  }).catch(err=>{
                   alert("Invalid Credentials")
                  })
                }}
                type="button" 
                style={{backgroundColor:'#24a0ed',height:40,width:'45%',alignSelf:'center',color:'white',borderRadius:5,borderColor:'transparent',fontFamily:'sans-serif',fontWeight:'bold'}}
                //className="btn btn-primary btn-block"
                >Submit</button>
                {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
                </div>
                
            </form>
           
            </div>
            <div style={{flexDirection:'row',justifyContent:'space-between',display:'flex',marginTop:10}}>
            <p style={{color:'white',fontFamily:'serif'}}>New User?</p>
            <a  style={{color:'white',fontFamily:'serif'}} href="#" href="/signup" class="link-primary">Sign Up</a>
            

            </div>
           
            </div>
        );
    }
}