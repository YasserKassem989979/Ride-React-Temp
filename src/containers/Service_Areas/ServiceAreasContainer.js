import React, { Component,Suspense } from 'react'
import { connect } from 'react-redux'
import {changeCurrentPageName} from "../../store/actions/userPreference";
import { Grid, Hidden,Slide, CircularProgress } from '@material-ui/core';
import AreasList from "./ServiceAreasList";
import axios from "../../axios"
import Alert from "../../components/Alert/alert";
import styles from "./ServiceAreas.module.css";
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tabs from "./Tabs/Tabs";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import ActionsMenu from "../../components/actionsMenu/actionsMenu";
import { translate } from '../../utils/translate';
const  ActiosListener = React.lazy(()=> import("./actionsListener/actionsListener")) 
export const AreasContext = React.createContext("state");


export class ServiceAreas extends Component {

    state={
        isLoading:false,
        areas:[],
        toggleTheMainView:false,
        toggleTheSideView:true,
        isLoadingArea:false,
        area:null,
        priceCard:null,
        whatIsTheAction:"",
        isActionClicked:false,
        promoDetails:null,
        documentIdForActionListener:"",
        areaId:""
    };

    componentDidMount() {
        this.getAreas()
        this.props.changeCurrentPageName(this.props.location.pathname);
    };

     // when action completed or canceld
   onCloseAction=(refresh)=>{
    this.setState({isActionClicked:false},()=>{
        if(refresh){
            this.getArea(this.state.areaId);
        }
    })
    }

    //
    onActionClicked = (action,id)=>{
        this.setState({
            isActionClicked:true,
            whatIsTheAction:action,
            documentIdForActionListener:id
        })
    }
    // to get single area
    getArea = (id) => {
        this.setState({
            isLoadingArea:true,
            areaId:id,
            toggleTheMainView:!this.state.toggleTheMainView,
            toggleTheSideView:!this.state.toggleTheSideView,})
        axios.get("/service_areas/"+id)
        .then(res=>{
            this.setState({
                area:res.data,
            isLoadingArea:false})
        })
        .catch(err=>{
            this.setState({isLoadingArea:false})
            Alert.error(err.data?err.data.message:"ERROR")
        });
    }
    


    // to toggle between the main and side view on small screens
    toggleTheMainSideView = ()=>{
        this.setState({
            toggleTheMainView:!this.state.toggleTheMainView,
            toggleTheSideView:!this.state.toggleTheSideView
        })
    };


    // to get the list of available areas
    getAreas  = () =>{
        this.setState({isLoading:true,areas:[],area:null})
        axios.get("/service_areas")
        .then(res=>{
            this.setState({
                areas:res.data,
            isLoading:false})
        })
        .catch(err=>{
            this.setState({isLoading:false})
            Alert.error(err.data?err.data.message:"ERROR")
        });
            
    };

    
    getPriceCard=(actionName,id)=>{
        this.setState({isLoadingPriceCard:true,priceCard:null})
        axios.get("price_cards/details/" + id)
        .then(res=>{
            this.setState({
                priceCard:res.data,
                isLoadingPriceCard:false,
                isActionClicked:true,
                whatIsTheAction:actionName})
        })
        .catch(err=>{
            this.setState({isLoadingPriceCard:false})
            Alert.error(err.data?err.data.message:"ERROR")
        });
    };


    // get the details of a promo code
    getPromoDetails = (actionName,id) => {
        this.setState({promoDetails:null,isLoadingPromo:true})
        axios.get("promo_codes/" + id)
        .then(res=>{
            this.setState({
                promoDetails:res.data,
                isActionClicked:true,
                whatIsTheAction:actionName,
                documentIdForActionListener:id,
                isLoadingPromo:false})
        })
        .catch(err=>{
            this.setState({isLoadingPromo:false})
            Alert.error(err.data?err.data.message:"ERROR")
        });
    }

    render() {
        return (
            <AreasContext.Provider value={{
            state:this.state,
            getPriceCard:this.getPriceCard,
            getPromoDetails:this.getPromoDetails,
            onActionClicked:this.onActionClicked}}>
            <Grid  container>
                <Hidden mdDown={this.state.toggleTheMainView}>
                <Slide direction="down" in={true} timeout={200} mountOnEnter unmountOnExit>
                  <Grid  item xs={12} sm={12} md={12} lg={6}>
                  <div className={styles.titleList}>
                    <h4>{translate("SERVICE_AREAS")}</h4>
                        <h4>{translate("COUNT")}: {this.state.areas.length}</h4>
                    <IconButton style={{fontFamily:"Cairo",fontSize:"1rem",borderRadius:"0",color:"#14588d",fontWeight:"bold"}} onClick={this.getAreas}>
                        <RefreshIcon color="primary"/>
                        {translate("REFRESH")}
                    </IconButton>
                    <ActionsMenu
                    object="SERVICE-AREA"
                    status={null}
                    onActionClicked={this.onActionClicked} />

                </div>  
                  {this.state.isLoading && this.state.areas.length<1?
                <div style={{display:"flex",justifyContent:"center",height:700}}>
                <CircularProgress  />
                </div>:null}
                {!this.state.isLoading?<div >
                <AreasList
                getArea={this.getArea}/>
                </div>:null}
               
                  </Grid>
                  </Slide>
                </Hidden>
                 <Hidden mdDown={this.state.toggleTheSideView}>
                 <Slide direction="up" in={true} timeout={200} mountOnEnter unmountOnExit>
                  <Grid style={{
                      padding:"9px",
                      marginTop:15}} 
                      item 
                      xs={12} 
                      sm={12} 
                      md={12} 
                      lg={6}>
                <Tabs
                area={this.state.area}
                toggleTheMainSideView={this.toggleTheMainSideView}/>
                  </Grid>
                  </Slide>
                 </Hidden>
                 {this.state.isActionClicked?
                        <Suspense fallback={<div style={{display:"none"}}></div>}>
                                 <ActiosListener
                                    promoDetails={this.state.promoDetails}
                                    area={this.state.area}
                                    priceCard={this.state.priceCard}
                                    whatIsTheAction={this.state.whatIsTheAction}
                                    onCloseAction={this.onCloseAction}
                                    onActionClicked={this.onActionClicked}
                                    documentIdForActionListener={this.state.documentIdForActionListener}/>
                        </Suspense>
                      
               :null}
            </Grid>
            </AreasContext.Provider>
        )
    }
}



const mapDispatchToProps = (dispatch)=>{
    return {
        changeCurrentPageName:(name)=>dispatch(changeCurrentPageName(name))
    }
};

export default connect(null, mapDispatchToProps)(ServiceAreas)
