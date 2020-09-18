import React from 'react'
import styles from "./Vehicles.module.css"
import { Avatar, Paper, Hidden } from '@material-ui/core';
import config from "../../config/backendURLS"
import 'car-makes-icons/dist/style.css';
import {translate} from "../../utils/translate";
const VehiclesList = (props) => {
    const vehicles = props.vehicles;
    return (<>
        {vehicles.map(vehicle=>{
         return <Paper 
         style={{margin:"10px 0"}} 
         key={vehicle.id}
         onClick={()=>props.getVehicle(vehicle.id)}>
          <div className={styles.carInfo}>
                    <div className={styles.carInfoItem}>
                            <p style={{margin:"0 3px"}}>{translate("TYPE")}:</p>
                            <Hidden xsDown>
                            <p style={{margin:0,paddingTop:4}}>{vehicle.model}</p>
                            <p style={{margin:"0 4px",paddingTop:4}}>{vehicle.make}</p>
                            </Hidden>
                            <Hidden smUp>
                            <p style={{margin:"0 2px",paddingTop:4,fontSize:17}}><i className={`car-${vehicle.make.toLowerCase()}`}></i></p>
                            </Hidden>
                            
                    </div>
                    <div className={styles.carInfoItem}>
                            <p style={{margin:"0 3px"}}>{translate("THE_NUMBER")}:</p>
                            <p style={{margin:0,paddingTop:4}}>{vehicle.number}</p>
                    </div>
                    {vehicle.service_types && vehicle.service_types.length>0?<div className={styles.carInfoItem}>
                        <p style={{margin:"0 3px"}}>{translate("SERVICES")}:</p>
                        <p style={{margin:0,paddingTop:4}}>{vehicle.service_types.map((item,index)=>{
                            if(index===vehicle.service_types.length-1){
                                return" "+item.name+""
                            }
                            return" "+item.name+","
                            })}</p>
                    </div>: 
                    <div className={styles.carInfoItem}>
                    <p style={{margin:"0 3px"}}>{translate("SERVICES")}:</p>
                    <p style={{margin:0}}>{translate("NO_SERVICES")}</p>
                    </div>}
                    <div className={styles.carInfoItem}>
                        <Avatar src={`${config.hostDomain}${vehicle.image}`} alt="car pic"  classes={{root:styles.carAvatar}}/>
                    </div>
                  
                </div>
                </Paper>
                   
        })}
        </>
    )
}



export default VehiclesList
