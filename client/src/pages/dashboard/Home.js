
import React, { Component } from "react";
import axios from 'axios'
import moment  from "moment";
import Modal from 'react-modal';
import download from '../../assets/images/download.png';
import deleteimage from '../../assets/images/deleteimage.png'
import editimage from '../../assets/images/edit.png'




var MAX_FILE_SIZE = 10 * 1024 * 1024 ; 

 


export default class Home extends Component {
  constructor(props){
    super(props);
    this.state={
     selectedFile:{},
     desc:"",
     files:[],
     user:{},
     modalOpen:false,
     editFile:{},
     editText:""
    }

    
  }
  componentDidMount(){
   
   let user=JSON.parse(localStorage.getItem("user"));
   console.log("user-->",user)
   this.setState({user:user})
  //  if(!user){
  //    this.props.history.push("Login")
  //  }

   
    if(user){
   
    const params={
      email:user.data.data[0].email
    }
    axios.get("http://localhost:8081/getcdnfiles",{params}).then(res=>{
      console.log("cdn response",res)
      this.setState({files:res.data})
    }).catch(err=>{
      console.log("Err-->",err)
    })
  }
  
  }
  onFileChange = event => { 
    
    console.log("MAX LIMIT",MAX_FILE_SIZE)
    if(event.target.files[0].size>MAX_FILE_SIZE){
      alert("File must not exceed 10MB")
    }
    else{
      console.log("EVENTS FILE",event.target)
    this.setState({ selectedFile: event.target.files[0] }); 
    }
    

  }; 
  onFileUpload = () => {
    console.log(Object.keys(this.state.selectedFile))
    if(this.state.selectedFile && !this.state.selectedFile.name){
      alert("Please upload a file")

    }
    else{
    if(this.state.modalOpen){
      console.log("edit-->")
      const formData=new FormData();
      const date=moment().format("MM/DD/YYYY hh:mm A");
      formData.append("name",this.state.selectedFile.name);
      formData.append("user",this.state.user.data.data[0].email)
      formData.append("desc",this.state.editText)
      formData.append("updated_at",date);
      
      formData.append("fname",this.state.user.data.data[0].fname)
      formData.append("lname",this.state.user.data.data[0].lname)
      formData.append("file",this.state.selectedFile);
      formData.append("isEdit",true)
      axios.post("http://localhost:8081/upload",formData,
      {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
      
      
      ).then(res=>{
        console.log("Res after update",res)
        this.setState({modalOpen:false})
        alert("Updated Successfully")
        window.location.reload()

      }).catch(err=>{
        console.log("Err",err)
      })

    }
  
    
    // Create an object of formData
    else{
    const formData = new FormData();
    const date=moment().format("MM/DD/YYYY hh:mm A");
    console.log("selected",this.state.selectedFile)
  
    // Update the formData object
    formData.append("name",this.state.selectedFile.name);
    formData.append("user",this.state.user.data.data[0].email)
    formData.append("desc",this.state.desc)
    formData.append("updated_at",date);
    formData.append("created_at",date)
    formData.append("fname",this.state.user.data.data[0].fname)
    formData.append("lname",this.state.user.data.data[0].lname)
    formData.append("file",this.state.selectedFile);
  
    // Details of the uploaded file
    console.log("formdata",formData);
  
    // Request made to the backend api
    // Send formData object
    axios.post("http://localhost:8081/upload",formData,
    {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
    
    
    ).then(res=>{
      console.log("Res",res)
      alert("Uploaded Successfully")
      window.location.reload()
    }).catch(err=>{
      console.log("Err",err)
    })
  }
}
  };


render() { 
  console.log("this.state",this.state.selectedFile)
  let arr=[]
  if(this.state.files.length>0){
 this.state.files.forEach(ele=>{
   arr.push(
    
     <div style={{borderBottomWidth:1,borderColor:'black'}}>
    
     <div style={{flexDirection:'row',display:'flex'}}>
              <div style={{flex:0.25}}>
       <p style={{color:'black',fontFamily:'sans-serif',fontSize:14}}>{ele.user_fname}</p>
       </div>
       <div style={{flex:0.25}}>
       <p style={{color:'black',fontFamily:'sans-serif',fontSize:14}}>{ele.file_name}</p>
       </div>
       <div style={{flex:0.25}}>
       <p style={{color:'black',fontFamily:'sans-serif',fontSize:14}}>{ele.created_at}</p>
       </div>
       
       <div style={{flex:0.25}}>
       <p style={{color:'black',fontFamily:'sans-serif',fontSize:14}}>{ele.updated_at}</p>
       </div>
      
       <div style={{flex:0.1,alignItems:'center'}}>
         <a onClick={()=>window.location.href = ele.cdnLink}>
           <img src={download} height={20} width={20}/>

         </a>
       </div>
       <div style={{flex:0.1,alignItems:'center'}}>
         <a onClick={()=>{
           const key=ele.file_key
           axios.post("http://localhost:8081/delete",{key:key}).then(res=>{
             console.log("response from delete",res)
             alert("File succesfully deleted")
             window.location.reload()
           }).catch(err=>{
             console.log("err",err)
         })
        }
        }>
           <img src={deleteimage} height={22} width={22}/>

         </a>
       </div>

       <div style={{flex:0.1,alignItems:'center'}}>
         <a onClick={()=>{
          // this.props.history.push({ 
          //   pathname: '/upload',
          //   state: ele
          //  });
          if(this.state.user.data && this.state.user.data.data.length>0 && this.state.user.data.data[0].email!="admin@gmail.com"){
          this.setState({modalOpen:true})
          this.setState({editFile:ele})
          }
          else{
            alert("Admin cannot edit the files")
          }
         }}>
           <img src={editimage} height={20} width={20}/>

         </a>
       </div>
       </div>
       <div>
         <h6 style={{fontFamily:'serif',fontSize:16,fontWeight:'bold',color:'grey'}}>File description</h6>
         <p style={{color:'black',fontFamily:'sans-serif',fontSize:14}}>{ele.file_desc}</p>
       </div>
       <div style={{height:1,marginTop:10,backgroundColor:'black'}}/>
       </div>
     
       
       

     
      
   )
 })
}
console.log("files-->",this.state.user)
  return(
    
          
          <div style={{height:'100vx',width:'100%',display:'flex',flexDirection:'column'}}> 
          <div style={{height:100,alignItems:'center', backgroundColor:'purple',justifyContent:'center',display:'flex',width:'100%',flexDirection:'row'}}>
            <h4 style={{fontSize:30,fontFamily:'cursive',color:'white'}}>FILE DEPOT</h4>
           

          </div>
          <button style={{backgroundColor:'#24a0ed',height:40,width:'12%',alignSelf:'center',fontWeight:'bold',fontFamily:'sans-serif',alignSelf:'flex-end',borderRadius:5,borderColor:'transparent',color:'white'}} onClick={()=>{
            localStorage.clear();
            this.props.history.push("Login")
          }} >LOGOUT</button>
          
          
          {this.state.user.data && this.state.user.data.data.length>0 && this.state.user.data.data[0].email!="admin@gmail.com"?
          <div style={{flexDirection:'column',display:'flex',width:'60%',marginRight:10,marginLeft:10}}>
          <h3 style={{fontFamily:'serif'}}>Enter file description</h3>
          <input type="text" 
        
          onChange={(e)=>{
            this.setState({desc:e.target.value})
          }}
          style={{height:70,borderWidth:1,borderRadius:7,marginTop:10,marginBottom:10}}/>
              <input style={{marginBottom:10}} type="file" onChange={this.onFileChange} /> 
              <button
              
              style={{width:'15%'}}
               onClick={this.onFileUpload}
               > 
                Upload
              </button> 
              <div style={{height:50}}/></div>:null}
              {this.state.files.length>0?
            <div style={{marginRight:10,marginLeft:10}}>
              <h3 style={{marginBottom:10,fontFamily:'serif'}}>File Details</h3>
              <div style={{flexDirection:'row',display:'flex'}}>
              <div style={{flex:0.25}}>
       <p style={{color:'grey',fontFamily:'sans-serif',fontSize:14,fontWeight:'bold'}}>{"User name"}</p>
       </div>
       <div style={{flex:0.25}}>
       <p style={{color:'grey',fontFamily:'sans-serif',fontSize:14,fontWeight:'bold'}}>{"File Name"}</p>
       </div>
       <div style={{flex:0.25}}>
       <p style={{color:'grey',fontFamily:'sans-serif',fontSize:14,fontWeight:'bold'}}>{"Created At"}</p>
       </div>
       
       <div style={{flex:0.25}}>
       <p style={{color:'grey',fontFamily:'sans-serif',fontSize:14,fontWeight:'bold'}}>{"Updated At"}</p>
       </div>
       
       <div style={{flex:0.25}}>
      
       </div>
       </div>
{arr}
{this.state.modalOpen?

<Modal
isOpen={this.state.modalOpen}
onRequestClose={()=>{
  this.setState({modalOpen:false})
}}

// onAfterOpen={afterOpenModal}
// onRequestClose={closeModal}
// style={customStyles}
// contentLabel="Example Modal"
>
  <div style={{flex:1,display:'flex',flexDirection:'column',height:'100vh',justifyContent:'center',alignItems:'center'}}>
<h2  style={{textAlign:'center'}}>Edit File</h2>
<h5>File Name</h5>
<h6>{this.state.editFile.file_name}</h6>
<div style={{height:7}}/>
<h5>File Description</h5>
<input type="text" 
        
          onChange={(e)=>{
            this.setState({editText:e.target.value})
          }}/>
<div style={{height:7}}/>
<input style={{marginBottom:10}} type="file" onChange={this.onFileChange} /> 
<button style={{width:'20%'}} onClick={this.onFileUpload} >Submit</button>
</div>
</Modal>
 :null

}
              </div> :null 
            }
          </div>  
        
   
    ); 
  } 
}