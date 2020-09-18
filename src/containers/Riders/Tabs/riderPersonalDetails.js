import React from 'react'
import DetailsCard from "../../../components/personalDetails/personslDetailsCard"
import{RiderContext} from "../RidersContainer"
import {translate} from "../../../utils/translate"
import profile from "../../../assets/FACEBOOK_LINE-01-512.png"
import classes from "./tabs.module.css"
import Avatar from '@material-ui/core/Avatar';
import { Paper } from '@material-ui/core'
import SummaryBookingCard from "../../../components/summaryBookingCard/summaryBookingCard";
import { theme } from '../../../config/theme'
import ActionsMenu from "../../../components/actionsMenu/actionsMenu"
const riderPersonalDetails = (prop) => {
    return (
        <RiderContext.Consumer>
            {props=>(
                <>
                <DetailsCard>
                <div className={classes.actionsMenu}>
                    <ActionsMenu
                        object={"RIDER"}
                        status={props.state.rider.personal.verification_status}
                        onActionClicked={prop.onActionClicked}/>
                    </div>
                    <div style={styles.profilePhoto}>
                        <Avatar src={props.state.rider&&props.state.rider.personal.profile_image?`http://api.ride-int.com/${props.state.rider&&props.state.rider.personal.profile_image}`:profile} alt="profile pic"  style={{width:75,height:75}}/>
                    </div>
                    <div className={classes.info}>
                        <div className={classes.part1}>
                        <div style={{display:"flex"}}>
                            <h4 style={{margin:0,fontWeight:"600"}}>{props.state.rider&&props.state.rider.personal.full_name}</h4>
                        </div>
                        <div style={{display:"flex",alignItems:"center"}}>
                                <h5 style={{margin:"0 3px"}}>{translate("THE_NUMBER")}:</h5>
                            <h5 style={{direction:"ltr",margin:0}}>{props.state.rider&&props.state.rider.personal.phone_number}</h5>
                        </div>
                        </div>
                        
                        <div style={styles.part2}>
                        <div style={{display:"flex",alignItems:"center"}}>
                                <h5 style={{margin:"0 3px"}}>{translate("RATING")}:</h5>
                            <h5 style={{margin:0}}>{props.state.rider&&props.state.rider.personal.rating}</h5>
                            </div>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <h5 style={{margin:"0 3px"}}>{translate("GENDER")}:</h5>
                            <h5 style={{margin:0}}>{translate(props.state.rider&&props.state.rider.personal.gender)}</h5>
                            </div>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <h5 style={{margin:"0 3px"}}>{translate("STATUS")}:</h5>
                            <h5 style={{margin:0}}>{translate(props.state.rider&&props.state.rider.personal.verification_status)}</h5>
                            </div>
                        </div>
                      
                    </div>
                </DetailsCard>
                <div className={classes.trips}>
                    {props.state.rider && !props.state.isLoadingRider && props.state.rider.rides.active_rides.length!==0?<div style={{padding:"20px"}}>
                    <Paper style={{background:theme().palette.primary.dark,padding:10,color:"#fff"}}>
                    <h4 style={{padding:0,margin:0}}>{translate("CURRENT_TRIPS")}:</h4>
                    </Paper>
                    {props.state.rider.rides.active_rides.map(ride=>{
                    
                        return <SummaryBookingCard geTrip={props.geTrip} id="rider" key={ride.id} trip={ride}/>
                    })}
                    </div>
                    :null}
                    {props.state.rider && !props.state.isLoadingRider && props.state.rider.rides.last_rides.length!==0?<div>
                    <Paper style={{background:theme().palette.primary.dark,padding:10,color:"#fff"}}>
                    <h4 style={{padding:0,margin:0}}>{translate("LAST_TRIPS")}:</h4>
                    </Paper>
                    {props.state.rider.rides.last_rides.map(ride=>{
                    return <SummaryBookingCard geTrip={props.geTrip} id="rider" key={ride.id} trip={ride}/>
                    })}
                    </div>
                    :null}
                </div>
                {props.state.rider && !props.state.isLoadingRider && props.state.rider.rides.active_rides.length===0 && props.state.rider.rides.last_rides.length===0?
               <div style={{
                display:"flex"
                ,alignItems:"center"
                ,justifyContent:"center"}}>
                <h3>{translate("NO_TRIPS")}</h3>
              </div>:null}
                </>
            )}
        </RiderContext.Consumer>
        
    )
}

const styles = {
    container:{
        display:"flex",
      
    },
    profilePhoto:{
        display:"flex",
        flexBasis:"15%",
    },
    info:{
        display:"flex",
        flexBasis:"85%"
    },
    part2:{
        display:"flex",
        justifyContent:"space-evenly",
        flexBasis:"64%",
        alignItems: "flex-end",
        flexWrap: "wrap"
    }
}

export default riderPersonalDetails
