import React from 'react';
import { Paper } from '@material-ui/core';
import styles from "./tabs.module.css"

const  TabContent = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <Paper
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        classes={{root:styles.tabContainer}}
      >
        {children}
      </Paper>
    );
  }

  export default TabContent
  