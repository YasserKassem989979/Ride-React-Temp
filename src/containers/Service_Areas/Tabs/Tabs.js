import React,{useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from "./tabPanels"
import { Button, Toolbar, CircularProgress} from '@material-ui/core';
import styles from "../../Riders/Tabs/tabs.module.css"
import withWidth from '@material-ui/core/withWidth';
import {translate} from "../../../utils/translate"
import AreaDetails from "./areaDetails"
import {AreasContext} from "../ServiceAreasContainer"
import PriceCards from "./priceCards"
import PromoCodes from "./promoCodes"


const TabsContainer = (props) => {

    const [value, setValue] = React.useState(0);
    const {width} =props;

    // tabs chabge handler
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    // to reset the tabs to zero if a new service_area is requested
    useEffect(()=>{
      setValue(0);
    },[props.area])

    
  
    return (
      <AreasContext.Consumer>
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
            <Tab label={translate("MAP")} {...a11yProps(0)} />
            <Tab label={translate("PRICE_CARDS")} {...a11yProps(1)} />
            <Tab label={translate("PROMOCODES")} {...a11yProps(2)} />
          </Tabs>
          <Toolbar>
          {width==="xl" || width==="lg"?null:<Button //if the width is less than medium show the back button on the appBar
            color="primary" 
            variant="outlined" 
            onClick={props.toggleTheMainSideView}>
              {translate("GO_BACK")}
            </Button>}
          
      </Toolbar>
        </AppBar>
        <TabContent value={value} index={0}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingArea?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.area?
            <AreaDetails onActionClicked={values.onActionClicked}  area={values.state.area}/>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>

        <TabContent value={value} index={1}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingArea?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.area?
            <PriceCards 
            onActionClicked={values.onActionClicked} 
            getPriceCard={values.getPriceCard} 
            area={values.state.area}/>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        <TabContent value={value} index={2}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingArea?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.area?
            <PromoCodes  area={values.state.area}/>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        </>)}
        </AreasContext.Consumer>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  export default withWidth()(TabsContainer)