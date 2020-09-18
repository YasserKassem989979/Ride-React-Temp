import React,{useEffect,useState} from 'react'
import Drawer from '@material-ui/core/Drawer';
import MenuItems from "./MenuItems"
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import axios from "../../axios"
import CircularProgress from '@material-ui/core/CircularProgress';
import {logoutAction} from "../../store/actions/loginAction"
import {useDispatch,useSelector} from "react-redux";
import imgProfile from "../../assets/FACEBOOK_LINE-01-512.png"
import Divider from '@material-ui/core/Divider';
import styles from "./drawer.module.css";
import {translate} from "../../utils/translate"
import Alert from "../../components/Alert/alert"
 const DrawerSide =(props) =>{

  //constants
   const classes = useStyles();
   const theme = useTheme();
   const [menuItems,setMenuItems]=useState([])
   const [isLoading,setIsLoading] =useState(false)
   const dispatch =useDispatch()
   const email = useSelector(state=>state.auth.email)


   // to get the menu items
   useEffect(()=>{
     if(props.isDrawerOpen){
      setIsLoading(true)
   axios.get("/navigation")
   .then(res=>{
    setMenuItems(res.data)
    setIsLoading(false)
   })
   .catch((err)=>{
     Alert.error(err.data?err.data.message:"ERROR")
     setIsLoading(false)
   })
     }  
  },[props.isDrawerOpen]);


    
    // to log out from the system 
    const logout = ()=>{
      dispatch(logoutAction())
    }



    return (
       <Drawer 
       className={styles.root}
       variant="persistent"
       classes={{
         paper: styles.drawerPaper,
       }}
       open={props.isDrawerOpen}
       onClose={props.isDrawerOpenHandler}>

       <div className={classes.drawerHeader}>
       <div className={classes.drawerProfile}>
       <div>
          <img src ={imgProfile} style={{width:"65px",height:"65px"}} alt="admin user profile"/>
        </div>
             <div>
               {email}
             </div>
             
        </div>
         <div>
         <IconButton onClick={props.isDrawerOpenHandler}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
         </div>
          
        </div>
        <Divider/>
           {!isLoading?<MenuItems onClick={props.isDrawerOpenHandler} menuItems={menuItems}/>:<div className={classes.drawerIndcator}><CircularProgress/></div>}
           <Divider/>
           <div  className={classes.drawerFooter}>
            <Button 
            variant="contained" 
            style={{backgroundColor:"#980000",color:"#F2F2F2"}}
             onClick={logout}>
               {translate("LOG_OUT")}
              </Button>
           </div>
       </Drawer>
    )
};

// styles for drawer
const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    paddingTop:15,
    paddingBottom:15
  },
  drawerProfile:{
    display:"flex",
    flexGrow:1,
    justifyContent:"center",
    alignItems:"center",
    flexWrap:"wrap"
  },
  drawerIndcator:{
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    flexDirection:"colmun",
    height:"90%"
  },
  drawerFooter:{
   display: 'flex',
   alignItems: 'flex-start',
   padding: theme.spacing(0, 1),
   ...theme.mixins.toolbar,
   justifyContent: 'center',
   paddingTop:15
  }
}));


export default DrawerSide;
