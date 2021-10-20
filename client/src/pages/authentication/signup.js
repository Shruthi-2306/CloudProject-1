import axios from "axios";
import React, { Component } from "react";

export default class SignUp extends Component {
  constructor(props){
    super(props);
    this.state={
      email:"",
      password:"",
      fname:"",
      lname:""
    }

    
  }
  _callApi=()=>{
    console.log("CallApi")
    // const res=await fetch("https://jsonplaceholder.typicode.com/posts")
    // console.log("Res-->",res)
  }
  
    render() {
      console.log("this.state",this.state.email)
        return (
          <div style={{height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:"#24a0ed",flexDirection:'column'}}>
            
            <div>
            <form style={{backgroundColor:"white",borderRadius:7,paddingTop:20,paddingBottom:20,paddingLeft:20,paddingRight:20}}>
                <h3 style={{textAlign:'center',fontFamily:'-moz-initial'}}>Sign Up</h3>

                <div style={{marginTop:10}} className="form-group">
                    <label style={{fontFamily:'-moz-initial'}}>First Name </label>
                    <input 
                    style={{height:30,fontFamily:'-moz-initial',fontSize:12}}
                    onChange={(e)=>{
                      this.setState({fname:e.target.value})
                    }}
                    
                    type="text"
                    aria-label="Username" className="form-control"  />
                </div>
                <div style={{marginTop:10}} className="form-group">
                    <label style={{fontFamily:'-moz-initial'}}>Last Name </label>
                    <input 
                    style={{height:30,fontFamily:'-moz-initial',fontSize:12}}
                    onChange={(e)=>{
                      this.setState({lname:e.target.value})
                    }}
                    
                    type="text"
                    aria-label="Username" className="form-control"  />
                </div>

                <div style={{marginTop:10}} className="form-group">
                    <label style={{fontFamily:'-moz-initial'}}>Email </label>
                    <input 
                    style={{height:30,fontFamily:'-moz-initial',fontSize:12}}
                    onChange={(e)=>{
                      this.setState({email:e.target.value})
                    }}
                    
                    type="email" className="form-control"  />
                </div>

                <div style={{marginTop:10}} className="form-group" >
                    <label style={{fontFamily:'-moz-initial'}}>Password</label>
                    <input 
                    style={{height:30}}
                     onChange={(e)=>{
                      this.setState({password:e.target.value})
                    }}
                    
                    type="password" className="form-control" />
                </div>
                <div class='row justify-content-center' style={{marginTop:14}}>

     

                <button type={"button"}
                
                style={{backgroundColor:'#24a0ed',height:40,width:'45%',alignSelf:'center',fontWeight:'bold',fontFamily:'sans-serif'}}
                onClick={()=>{
                  console.log("onclick press")
                
                  axios.post("http://localhost:8081/users",
                 

                
                  
                  {
                    fname:this.state.fname,
                    lname:this.state.lname,
                    email:this.state.email,
                    password:this.state.password

                  }).then(res=>{
                    if( res && res.data && res.data.code=="ER_DUP_ENTRY"){
                      alert("User already exist")
                    }
                    else{
                      alert("User registered succesfully")
                      localStorage.setItem("user",JSON.stringify(res))
                      //console.log("JSON.PARSE",JSON.parse(localStorage.getItem('user')))
                      this.props.history.push("Home");
                     
                    }
                  }).catch(err=>{
                    
                    console.log("Error-->",err)
                  })
                }
                 
                  
                
                  
                }
                style={{alignSelf:'center',width:'40%',backgroundColor
                :'#24a0ed',color:'white',borderRadius:5,borderColor:'transparent'}} >SignUp</button>
                {/* <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p> */}
                </div>
                
            </form>
           
            </div>
            {/* <div style={{flexDirection:'row',justifyContent:'space-between',display:'flex',marginTop:10}}>
            <p>New User?</p>
            <a href="#" class="link-primary">Sign Up</a>
            

            </div> */}
           
            </div>
        );
    }
}