import React,{useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContent from "./tabPanels"
import { Button, Toolbar, CircularProgress } from '@material-ui/core';
import styles from "./tabs.module.css"
import withWidth from '@material-ui/core/withWidth';
import RiderPersonalDetails from "./riderPersonalDetails"
import{RiderContext} from "../RidersContainer"
import {translate} from "../../../utils/translate"
import RiderFinancialDetails from "../../../components/financialDetails/FinancialDetails"
import UserDocuments from "../../../components/userDocuments/UserDocuments"
import RatingList from "../../../components/ratingsList/ratingList"




const TabsContainer = (props) => {
    const [value, setValue] = React.useState(0);
    const {width} =props;

    const handleChange = (event, newValue) => {
      setValue(newValue);
      // if the tab is ratings tab call getRatings with newSearch =true
      if(newValue ===3){
        props.getRatings(true)
      }
    };

    // to reset the tabs to zero if a new rider is requested
    useEffect(()=>{
      setValue(0);
    },[props.rider])


   
    return (
      <RiderContext.Consumer>
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
            <Tab label={translate("الوثائق")} {...a11yProps(2)} />
            <Tab label={translate("التقييم")} {...a11yProps(3)} />
          </Tabs>
          <Toolbar>
          {width==="xl" || width==="lg"?null:<Button  //if the width is less than medium show the back button on the appBar
            color="primary" 
            variant="outlined" 
            onClick={props.toggleTheMainSideView}>
              {translate("GO_BACK")}
            </Button>}
          
      </Toolbar>
        </AppBar>
        <TabContent  value={value} index={0}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingRider?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.rider?
            <RiderPersonalDetails
            onActionClicked={props.onActionClicked}/>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        <TabContent 
        value={value} 
        index={1}>
          <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingRider?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.rider?
          <RiderFinancialDetails 
          id="rider" 
          state={values.state} 
          confirmTransaction={values.onConfirmTransactionClick}
          geTransactions={values.geTransactions}/>:
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
            {values.state.isLoadingRider?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.rider&&values.state.rider.personal&&values.state.rider.personal.documents.length>0?
             <UserDocuments
             onActionClicked={props.onActionClicked} 
             documents={values.state.rider.personal.documents}/>:(values.state.rider&&values.state.rider.personal&&values.state.rider.personal.documents.length===0?
             <div style={{
            display:"flex"
            ,alignItems:"center"
            ,justifyContent:"center"}}>
            <h3>{translate("NO_DOCUMENTS")}</h3>
          </div>:<div style={{
            display:"flex"
            ,alignItems:"center"
            ,justifyContent:"center"}}>
            <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
          </div>)
            }
           </div>
        </TabContent>
        <TabContent value={value} index={3}>
        <div style={{padding:"15px 5px"}}>
            {values.state.isLoadingRider?
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center"}}>
                <CircularProgress/>
            </div>:values.state.rider?
            <div>
              <div style={{display:"flex",alignItems:"baseline",padding:10}}>
                <i className="fas fa-user-tie"></i>
                 <h4 style={{margin:"0 2px"}}>{translate("RIDER")}:</h4>
                 <h4 style={{margin:"0 2px"}}>{values.state.rider.personal.full_name}</h4>
              </div>
            <RatingList 
            id="rider" 
            state={values.state} 
            getRatings={values.getRatings}/>
            </div>:
            <div style={{
              display:"flex"
              ,alignItems:"center"
              ,justifyContent:"center"}}>
              <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
            </div>}
           </div>
        </TabContent>
        </>)}
        </RiderContext.Consumer>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  export default withWidth()(TabsContainer)