import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { makeStyles, } from '@material-ui/core/styles';
import {useDispatch,useSelector} from "react-redux"
import {translate} from "../../utils/translate"
import styles from "./navBar.module.css"


const  NavBar = (props)=> {
    const classes = useStyles();
    const dispatch = useDispatch()
    const direction = useSelector(state=>state.userPrefrence.direction)
    const currentPageName = useSelector(state=>state.userPrefrence.currentPage)
    // to convert the app to the selected language
    const setLanguage = ()=>{
       dispatch({type:"CHANGE_LANGUAGE"});
       setTimeout(()=>{
        window.location.reload();
       },0)
     
    }


    return (
      <div className={classes.root}>
        <AppBar
        position="fixed"
        classes={{
          root:props.isDrawerOpen?(direction==="rtl"?styles.MuiAppBarRootShiftRight:styles.MuiAppBarRootShiftLeft):styles.MuiAppBarRoot
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.isDrawerOpenHandler}
            edge="start"
            className={clsx(classes.menuButton,  props.isDrawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
          {currentPageName?currentPageName:"RIDE"}
          </Typography>
          <div style={{display:"flex",justifyContent:"flex-end",flexGrow:1}}>
            <h4 style={{cursor:"pointer",fontFamily:"Cairo"}} onClick={setLanguage}>{translate("lang")}</h4>
          </div>
        </Toolbar>
      </AppBar>
      </div>
    );
}

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  root: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  }
}));


export default NavBar
