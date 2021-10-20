import React,{Component} from 'react';
import {Route,Switch,BrowserRouter} from 'react-router-dom';
import Login from "../pages/authentication/login";
import SignUp from '../pages/authentication/signup';
import Home from '../pages/dashboard/Home';
import UploadFile from '../pages/uploads/uploadfile';

export default class  Routes extends Component {
    render(){
        return(
            <BrowserRouter>
           
           
            
            
            <Switch>
                 
                <Route  path='/login' component={Login}  ></Route>
                <Route  path='/signup' component={SignUp}  ></Route>
                <Route  path='/home' component={Home}  ></Route>
                <Route  path='/upload' component={UploadFile}  ></Route>
               

            </Switch>
            </BrowserRouter>
            
                
                
             
        )
    }


}