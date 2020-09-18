import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from "./tabPanels"
import { Button, Toolbar, CircularProgress } from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import {translate} from "../../../utils/translate"
import {VehiclesContext} from "../VehiclesContainer"
import VehicleDetails from "./VehicleDetails"
import styles from "../../Riders/Tabs/tabs.module.css"
import VehicleDrivers from "./VehiclesDrivers"


const TabsContainer = (props) => {
    const [value, setValue] = React.useState(0);
    const {width} =props
    const handleChange = (event, newValue) => {
      setValue(newValue);
};

   
    return (
      <VehiclesContext.Consumer>
        {values=>(<>
          <AppBar 
          classes={{root:styles.appBarContainer}} 
          position="static" color="default">
          <Tabs 
          classes={{root:styles.tabsRoot}}  
          value={value} 
          variant={width==="xl" ?"fullWidth":"scrollable"}
          scrollButtons="on"
          onChange={handleChange} 
          aria-label="simple tabs example">
            <Tab label={translate("DETAILS")} {...a11yProps(0)} />
            <Tab label={translate("DRIVERS")} {...a11yProps(1)} />
          </Tabs>
          <Toolbar>
          {width==="xl" || width==="lg"?null:<Button 
            color="primary" 
            variant="outlined" 
            onClick={props.toggleTheMainSideView}>
              {translate("GO_BACK")}
            </Button>}
          
      </Toolbar>
        </AppBar>
        <TabContent  value={value} index={0}>
          <div style={{padding:"12px 2px"}}>
            {values.state.isLoadingVehicle?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.vehicle?
           <VehicleDetails
           onActionClicked={props.onActionClicked} 
           vehicle={values.state.vehicle} />:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        <TabContent  value={value} index={1}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingVehicle?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.vehicle?
           <VehicleDrivers vehicle={values.state.vehicle} />:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        </>)}
        </VehiclesContext.Consumer>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  export default withWidth()(TabsContainer)