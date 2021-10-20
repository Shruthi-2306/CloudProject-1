
import React, { Component } from "react";
import axios from 'axios'
var MAX_FILE_SIZE = 10 * 1024 * 1024; 
 


export default class UploadFile extends Component {
  constructor(props){
    super(props);
    this.state={
     selectedFile:"",
     desc:""
    }

    
  }
  componentDidMount(){
    console.log("update-->",this.props.location.state)
  }
  onFileChange = event => { 
    
    // Update the state 
    // if(event.target.files[0].size>500){
    //   alert("File must not exceed 10MB")
    // }
    // else{
    this.setState({ selectedFile: event.target.files[0] }); 
    //}
    

  }; 
  onFileUpload = () => {
    
    // Create an object of formData
    const formData = new FormData();
    console.log("selected",this.state.selectedFile)
  
    // Update the formData object
    formData.append("name",this.state.selectedFile.name);
    formData.append("user","suraj@gmail.com")
    formData.append("desc",)
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
    }).catch(err=>{
      console.log("Err",err)
    })
  };


render() { 
    console.log("selectedfile",this.state.selectedFile,MAX_FILE_SIZE )
    return ( 
      <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}> 
          <h1> 
            GeeksforGeeks 
          </h1> 
          <h3> 
            File Upload using React! 
          </h3> 
          
          <div> 
              <input type="file" onChange={this.onFileChange} /> 
              <button
               onClick={this.onFileUpload}
               > 
                Upload! 
              </button> 
          </div>  
         {/* {this.fileData()}  */}
        
      </div> 
   
    ); 
  } 
}