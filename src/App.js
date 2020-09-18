import React,{Component} from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, ThemeProvider } from '@material-ui/core/styles';
import {theme} from "./config/theme"
import MainLayout from "./layout/MainLayout"
import {BrowserRouter as Router} from "react-router-dom";
import { connect } from 'react-redux'
import { CircularProgress } from '@material-ui/core';
import axios from "./axios"
import  {whatCanIDo} from "./utils/whatCanIDo";
import * as actionTypes from "./store/actions/actionTypes"
import Pages from"./containers/Router/Router"
import HomePage from './containers/HomePage/HomePage'
import mapboxgl from 'mapbox-gl';

// to config rtl direction
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
// add token and rtl support to the map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1yLXJpZGUiLCJhIjoiY2sxaHQ2M295MDdwZTNwcnBlYWNneXNmZyJ9.d53qwDFOZZKS3aipjTeN2Q';
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js'
  );


 class App extends Component {

  state={
    isLoading:true
  }


  componentDidMount() {
    //if the user authenticated get the permissions for him/her
    if(this.props.isLogged && this.props.token){
     this.getPermissions()
    };
   
  }


  componentDidUpdate(prevProps) {
    // to check if there is change in the token and get permissions again and the the token exist
    if(prevProps.token !==this.props.token && this.props.token){
      this.getPermissions()
    }
  }


  // get permissions for the user 
  getPermissions = ()=>{
      // to inject the token for the first time 
      axios.defaults.headers['Authorization'] = this.props.token
      axios.get("/roles/permissions")
      .then(res=>{
        // save the permissions in redux
        this.props.savePermissions(whatCanIDo(res.data))
        this.setState({
          isLoading:false,
        })
      })
      .catch(err=>{
        this.setState({
          isLoading:false
        })
      })
  }
  
  
    

  render(){
    // is the user authnticated
    const isLogged = this.props.isLogged;
    // get the local storage and check user prefences
    let  storage  = JSON.parse(localStorage.getItem("persist:root"))
    if(storage && storage.userPrefrence){
      storage = JSON.parse(storage.userPrefrence)
    }

    //loading View
    const isLoadingView = (
      <div style={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <CircularProgress/>
      </div>
    )
     

    // check if the user logged render admin app else login screen
    let whatToShow =(
            <Router basename="/modirate">
            <MainLayout>
               <Pages/>
             </MainLayout>
            </Router>
                    )
  
    if(!isLogged){
      whatToShow=(<HomePage/>)
    }

    if(this.state.isLoading && isLogged){
      whatToShow = isLoadingView
    }

    return (
       <StylesProvider jss={jss}>
        <ThemeProvider theme={theme(storage?storage.direction:"rtl")}>
          {whatToShow}
        </ThemeProvider>
       </StylesProvider>
    );
  }
};


const mapStateToProps = (state) => {
  return {
    isLogged:state.auth.isLogged,
    token:state.auth.token,
    pathname:state.userPrefrence.path
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {
    savePermissions:(permissions)=>dispatch({type:actionTypes.SAVE_USER_PERMISSIONS,permissions})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
