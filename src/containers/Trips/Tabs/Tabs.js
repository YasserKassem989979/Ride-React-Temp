import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from "./tabPanels"
import { Button, Toolbar, CircularProgress } from '@material-ui/core';
import styles from "../../Riders/Tabs/tabs.module.css"
import withWidth from '@material-ui/core/withWidth';
import {translate} from "../../../utils/translate"
import ActionsMenu from "../../../components/actionsMenu/actionsMenu"  
import {TripContext} from "../TripsContainer"
import TripDetails from "./tripDetails"
import Financial from "./financial"



const TabsContainer = (props) => {
    const [value, setValue] = React.useState(0);
    const {width} =props
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    //  // to reset the tabs to zero if a new trip is requested
    //  useEffect(()=>{
    //   setValue(0);
    // },[props.trip])
   
    return (
      <TripContext.Consumer>
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
            <Tab label={translate("FINANCIAL_DETAILS")} {...a11yProps(1)} />
          </Tabs>
          <Toolbar>
          {width==="xl" || width==="lg"?null:<Button 
            color="primary" 
            variant="outlined" 
            onClick={props.toggleTheMainSideView}>
              {translate("GO_BACK")}
            </Button>}
          <ActionsMenu
          object="TRIP"
          status={values.state && values.state.trip?values.state.trip.summary.category:null}
          onActionClicked={props.onActionClicked}
          />
          
      </Toolbar>
        </AppBar>
        <TabContent  value={value} index={0}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingTrip?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.trip?
           <TripDetails/>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        <TabContent  value={value} index={1}>
          <div style={{padding:"30px 25px"}}>
            {values.state.isLoadingTrip?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.trip?
           (values.state.trip.receipt?<Financial payment_method={values.state.trip.payment_method} receipt={values.state.trip.receipt} tripId={values.state.trip.summary.id}/>:
           <div style={{textAlign:"center"}}>
             <h4>{translate("NO_DATA")}</h4>
           </div>):
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        </>)}
        </TripContext.Consumer>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  export default withWidth()(TabsContainer)