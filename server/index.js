const express = require('express')
var cors = require('cors')
const AWS=require('aws-sdk');
const fs=require('fs')
const fileType = require('file-type');
const multiparty = require('multiparty');
const bodyParser=require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const mysql = require('mysql');
const { response } = require('express');
var cf = require('aws-cloudfront-sign');

const app = express()
const port = 8081
app.use(cors());
app.use(express.json());
const upload=multer({dest:'uploads/'})
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

const privateKey = process.env.privateKey
//const privateKey=process.env.privateKey





const cloudFront = new AWS.CloudFront.Signer('PUBLIC_ACCESS_KEY', privateKey);




const con = mysql.createConnection({
  host: process.env.dbhost,
  user: "admin",
  password: process.env.dbpassword
});


AWS.config.update({
  accessKeyId:process.env.accessKeyId,
  secretAccessKey:process.env.accessSecretKeyId,
});
const s3=new AWS.S3();
const uploadFile = (buffer,fname) => {
 
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'shruthi-files',
    Key:fname
    
  };
  return s3.upload(params).promise();
};
// var upload = multer({
//   storage: multerS3({
//       s3: s3,
//       bucket: 'shruthi-files',
//       key: function (req, file, cb) {
//           console.log(file);
//           cb(null, file.originalname); //use Date.now() for unique file keys
//       }
//   })
// });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/upload',upload.single('file'), function(req,res){
 
  const path=req.file.path;

  const key=req.body.user+req.file.originalname
  const file_name=req.file.originalname;
  const buffer = fs.readFileSync(path);
   uploadFile(buffer,key).then(response=>{
     console.log("response from s3",response)
   
    //res.send("Success")
    if(req.body.isEdit=="true"){
      var new_key=response.key
      
      var sql=`update main.files set updated_at=?,file_desc=? where file_key=?`;
      con.query(sql,[req.body.updated_at,req.body.desc,key],function(err,result){
        if(err){
          console.log("update err",err)
        }
        console.log("update res",result)
        res.send({"message":"Updated succesfully"})
      })
    }
    else{
    
    con.connect(function(err) {
      
      const fname=req.body.fname
      const lname=req.body.lname
      const email=req.body.user;
      const desc=req.body.desc;
      const updated_at=req.body.updated_at
      const created_at=req.body.created_at
     
 

        con.query(`INSERT INTO main.files(file_desc,file_key,user_fname,user_lname,updated_at,email,file_name,created_at) VALUES ('${desc}', '${key}','${fname}','${lname}','${updated_at}','${email}','${file_name}','${created_at}')`, function(err, result, fields) {
            if (err) 
            {
              console.log("Err",err)
              res.send(err);
            }
            if (result)
            {
              console.log("upload db success----->",result)
             
              res.send({message:"Success"})
           
            }
            if (fields){

             console.log(fields);
            }
        });
      
    });
  
  
   
  }
  }).catch(Err=>{
    console.log("Err",Err)
    res.send("Error")
  });
 
 

})
app.get('/getfiles',(req,res)=>{

  res.send({message:"Success"})
  return res

})

app.post('/users', (req, res) => {
  // if (req.query.username && req.query.email && req.query.age) {
      
      const fname=req.body.fname
      const lname=req.body.lname
      const email=req.body.email
      const password=req.body.password
     
      //res.send({message:"Success"});
     
      if(fname.length>0 && lname.length>0 && email.length>0 && password.length>0){
      
     
          con.query(`INSERT INTO main.users(fname,lname,email,password) VALUES ('${fname}', '${lname}', '${email}','${password}')`, function(err, result, fields) {
              if (err) 
              {
                console.log("Err",err)
                res.send(err);
              }
              if (result)
              {
             
                const response=[{
                  fname:fname,
                  lname:lname,
                  email:email
                }
                ]
                res.send({message:"Success",data:response})
             
              }
              if (fields){

               console.log(fields);
              }
          });
     
    
    }
    

  else {
      console.log('Missing a parameter');
  }
});

app.post('/login',function(req,res){
  console.log("hit login")
  const email=req.body.email;
  const password=req.body.password;
  var sql_find="SELECT id, fname, lname, email FROM main.users WHERE email=?";
  con.query(sql_find,[email],function(err,results){
    console.log("Results from login",results)
    
      
      if(results && results.length>0){
        var sql="SELECT id, fname, lname, email FROM main.users WHERE email=? and password = ?"; 
        
        con.query(sql,[email,password], function(err, results){  
            
           if(results && results.length>0){
              // req.session.userId = results[0].id;
              // req.session.user = results[0];
              console.log(results[0].id);
              res.status(200).send({message:"Success",data:results})
              //res.redirect('/home/dashboard');
           }
           else{
            
             res.status(200).send({message:"Invalid Credentials"})
              // message = 'Wrong Credentials.';
              // res.render('index.ejs',{message: message});
           }
                   
        });

      }
      else{
        res.status(200).send({message:"User not found"})
      }
    

  })


})
app.get("/getAllFiles",function(req,res){
  var params = {
    Bucket: 'shruthi-files' /* required */
    //Prefix: 'STRING_VALUE'  // Can be your folder name
  };
  s3.listObjectsV2(params, function(err, data) {
    if (err)
    { console.log(err, err.stack);
      res.send("Failure")
     }
      // an error occurred
    else  
    {
       console.log("data in get",data); 
       res.send(data) 
             }         // successful response
  });
})
app.post("/delete",function(req,res){
  const key=req.body.key
  var params = {  Bucket: 'shruthi-files', Key: key };

s3.deleteObject(params, function(err, data) {
  if (err) console.log(err, err.stack);  // error
  else    
  { 
    console.log("object deleted",data)
    new Promise((resolve,reject)=>{
    var sql="DELETE FROM main.files WHERE file_key=?";
    con.query(sql,[key],function(err,results){
      if(err){
        console.log("err",err)
        res.send({message:"Delete unsuccessfull"})
        reject(err)
        
      }
      console.log(results);
      res.send({message:"Succesfully deleted"})

      resolve(results)

    })
    
    
                   
                                              // deleted
});
  }


})
})
app.get("/getcdnfiles", async function(req,res){
  console.log("getcdn")
 const email=req.query.email
 var links=[]
 var sql_find=""
 if(email=="admin@gmail.com"){
    sql_find="SELECT id, user_fname, user_lname,file_desc,updated_at,created_at,file_key,file_name,email FROM main.files";


 }
 else{

  sql_find="SELECT id, user_fname, user_lname,file_desc,updated_at,created_at,file_key,file_name,email FROM main.files WHERE email=?";
 }
  
  new Promise((resolve,reject)=>{
    con.query(sql_find,[email],function(err,results) {
      console.log("Results",results)
    if ( results && results.length==0){
      res.send({message:"No files found yet"})
      resolve()
    }
    if (results=='undefined'){
      res.send({message:"No files found yet"})
      resolve()
    }
      if(results && results.length>0){
        
       
        
        results.forEach((ele,index)=>{
         
          if(ele && ele.file_key){
            const filename= ele.file_key
            
            
            
            cloudFront.getSignedUrl({
              
              url: `https://d15iiwqe6w4br5.cloudfront.net/${filename}`,
              expires: new Date() + 5 // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)
            }, (err, url) => {
              if (err)
              {
              console.log("Err in cloudfront",err)
              }
              
              results[index].cdnLink=url
              
  
            });
            
  
          }
        })
        console.log("links-->",results)
        res.send(results)
        return resolve(results)
      }
      if(err){
        console.log("err while getting cdn",err)
      }
  
  
        });
        
        
       
    
  
  
   

  })
  
});

// con.connect(function(err) {
//   if (err) throw err;

//   con.query('CREATE DATABASE IF NOT EXISTS main;');
//   con.query('USE main;');
//   con.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, fname varchar(30),lname varchar(30), email varchar(255), password varchar(15), PRIMARY KEY(id));', function(error, result, fields) {
//       console.log('success',result);
//   });
//   con.end();
// });



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})