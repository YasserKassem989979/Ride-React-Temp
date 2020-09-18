import React,{useState,useEffect} from 'react'
import NavBar from "../components/header/NavBar"
import Drawer from "../components/Drawer/Drawer"
import Grid from '@material-ui/core/Grid';
import { withWidth } from '@material-ui/core';
import AlertProvider from "../components/Alert/AlertComponent" 
import ScrollUpButton from "react-scroll-up-button"; //Add this line Here


const  MainLayout = (props)=> {
const {width}=props
const [isDrawerOpen,setIsDrawerOpen] = useState(true)
const isDrawerOpenHandler = ()=>{
        setIsDrawerOpen(!isDrawerOpen)
    }

    useEffect(()=>{
        // just for improve the UX :P
        if(width==="md" || width==="sm" || width==="xs"){
            setIsDrawerOpen(false)
        }
    },[width])
   

    return (
        
        <Grid container style={{backgroundColor:"#F5F5F5",overflow:"hidden",minHeight:"100vh"}} >
            
                <NavBar 
                isDrawerOpen={isDrawerOpen} 
                isDrawerOpenHandler={isDrawerOpenHandler}/>
              
            <Grid style={{marginTop:"65px"}} container>
                <Grid style={{maxWidth:isDrawerOpen?"16.666667%":0}} item xs={12} sm={12} md={12} lg={isDrawerOpen?2:12} >
                <Drawer 
                isDrawerOpenHandler={isDrawerOpenHandler} 
                isDrawerOpen={isDrawerOpen}/>
                </Grid>
                <Grid item style={{padding:isDrawerOpen?(width === "md" || width === "sm" || width === "xs"?10:"0 3px"):(width==="md" || width==="sm" || width==="xs"?10:"0 25px")}} xs={12} sm={12} md={12} lg={isDrawerOpen?10:12}>
                {props.children}

                </Grid>
            </Grid>  
            <AlertProvider/>
            <ScrollUpButton/>
            </Grid>
      
    )
}

export default withWidth()(MainLayout)
