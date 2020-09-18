import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom"
import {theme} from "../../config/theme"
import {translate} from "../../utils/translate"
import styles from "./drawer.module.css";
import {useSelector} from "react-redux"
import { withWidth } from '@material-ui/core';


const MenuItems=(props)=> {
    const {width}=props
    const menu = props.menuItems;
    const currentPage = useSelector(state=>state.userPrefrence.path);

    const setItem = (item)=>{
       // just for improve the UX :P
       if(width==="md" || width==="sm" || width==="xs"){
        props.onClick()
       }  
    };
    
    return (
        <div className={styles.container} >
            <div className={styles.root}>
            <List>
                {menu.length>0?menu.map((item) => (
                    <Link key={item.title} to={item.page} style={{textDecoration:"none",color:theme().palette.primary.light}}>
                <ListItem 
                button 
                key={item.title}
                selected={currentPage === item.page}
                onClick={()=>setItem(item)}>
                    <ListItemIcon><i className={`fas fa-${item.icon}`} style={{fontSize:25,color:theme().palette.primary.dark}}></i></ListItemIcon>
                    <ListItemText style={{fontWeight:"bold",color:theme().palette.primary.dark}} primary={translate(item.title)} />
                   </ListItem>
                </Link>
                )):null}
            </List>
            </div>
            
        </div>
    )
}

export default withWidth()(MenuItems)
