import React from 'react'
import styles from "../Vehicles.module.css";
import { Hidden,Paper,Avatar } from '@material-ui/core';
import config from "../../../config/backendURLS"
import {translate} from "../../../utils/translate";
import 'car-makes-icons/dist/style.css';
import { theme } from '../../../config/theme';
import idCard from "../../../assets/idCard.png";
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import ActionsMenu from "../../../components/actionsMenu/actionsMenu"
import moment from 'moment';
//styles for popover
const useStyles = makeStyles(theme => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }));
const VehicleDetails = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [indexedImage,setIndex]=React.useState(false);
    const handlePopoverOpen = (event,index) => {
        setAnchorEl(event.currentTarget);
        setIndex(index)
      };
    
      const handlePopoverClose = () => {
        setAnchorEl(null);
        setIndex(false)
      };
    
    const open = Boolean(anchorEl);
    const {vehicle}=props
    return (
        <div className={styles.Vehicle_Details_Cont}>
            <div className={styles.Vehicle_Details_Info} >
                <Paper style={{display:"flex"}} square>
                    <div className={styles.Vehicle_Details__Info_makemodelnumbercolorstatus}>
                            <div  className={styles.Vehicle_Details_Info_Item}>
                            <p style={{margin:"0 3px"}}>{translate("TYPE")}:</p>
                            <Hidden xsDown>
                            <p style={{margin:0,paddingTop:4}}>{vehicle.summary.model}</p>
                            <p style={{margin:"0 4px",paddingTop:4}}>{vehicle.summary.make}</p>
                            </Hidden>
                            <Hidden smUp>
                            <p style={{margin:"0 2px",paddingTop:4,fontSize:17}}><i className={`car-${vehicle.summary.make.toLowerCase()}`}></i></p>
                            </Hidden>
                            </div>
                            <div className={styles.Vehicle_Details_Info_Item}>
                            <p style={{margin:"0 3px"}}>{translate("THE_NUMBER")}:</p>
                            <p style={{margin:0,paddingTop:4}}>{vehicle.summary.number}</p>
                            </div>
                            <div className={styles.Vehicle_Details_Info_Item}>
                            <p style={{margin:"0 3px"}}>{translate("THE_COLOR")}:</p>
                            <p style={{margin:0,paddingTop:4}}><span style={{backgroundColor:vehicle.summary.color}} className={styles.spanColor}></span></p>
                            </div>
                            <div className={styles.Vehicle_Details_Info_Item}>
                            <p style={{margin:"0 3px"}}>{translate("STATUS")}:</p>
                            <p style={{margin:0}}>{translate(vehicle.summary.verification_status)}</p>
                            </div>
                    </div>
                    <div className={styles.Vehicle_Details__Info_actionsMenu}>
                      <ActionsMenu
                      object="VEHICLE"
                      status={vehicle.summary.verification_status}
                      onActionClicked={props.onActionClicked}
                      />
                    </div>
                   
                </Paper>
            </div>
            <div className={styles.Vehicle_Details_Documents} >
                   <Paper style={{background:theme().palette.primary.dark,padding:5,color:"#fff"}}>
                    <h4 style={{padding:0,margin:0}}>الوثائق:</h4>
                  </Paper>
                {vehicle.summary.documents.map((document,index)=>{
                    return <div key={document.id} className={styles.Vehicle_Details_Document}>
                                <div className={styles.Vehicle_Details_Document_name}>
                                    <p style={{margin:5}}>{document.name}:</p>
                                </div>
                                <div className={styles.Vehicle_Details_Document_Info}>
                                    <div className={styles.Vehicle_Details_Document_Info_item}>
                                    <p style={{margin:"0 3px"}}>{translate("STATUS")}:</p>
                                    <p>{translate(document.verification_status)}</p>
                                    </div>
                                    <div className={styles.Vehicle_Details_Document_Info_item}>
                                    <p style={{margin:"0 3px"}}>{translate("EXPIRATION_DATE")}:</p>
                                    <p>{document.expiration_date}</p>
                                    </div>
                                    <div className={styles.Vehicle_Details_Document_Info_item}>
                                    <Avatar 
                                     aria-owns={open ? 'mouse-over-popover' : undefined}
                                     aria-haspopup="true"
                                     onMouseEnter={(e)=>handlePopoverOpen(e,index)}
                                     onMouseLeave={handlePopoverClose}
                                     src={document.image ?`${config.hostDomain}${document.image}`:idCard} />
                                         <Popover
                                      
                                            id="mouse-over-popover"
                                            className={classes.popover}
                                            classes={{
                                            paper: classes.paper,
                                            }}
                                            open={indexedImage===index}
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                            }}
                                            onClose={handlePopoverClose}
                                            disableRestoreFocus
                                        >
                                             <img  src={document.image ?`${config.hostDomain}${document.image}`:idCard} className={styles.Vehicle_Details_image_car} alt="car documents" />
                                            </Popover>
                                    </div>
                                    <div className={styles.Vehicle_Details_Document_Info_item}>
                                    <ActionsMenu
                                      object="DOCUMENT"
                                      status={document.verification_status}
                                      onActionClicked={props.onActionClicked}
                                      document_id={document.id}
                                      documentDate={moment(document.expiration_date)}/>
                                    </div>
                                </div>
                           </div>
                })}
                {vehicle.summary.documents && vehicle.summary.documents.length===0?
                <div style={{display:"flex",justifyContent:"center"}}>
                    <h4>لا يوجد وثائق</h4>
                </div>:null}
            </div>
            <div className={styles.Vehicle_Details_image} >
                    <img src={vehicle.summary && vehicle.summary.plate_image ?`${config.hostDomain}${ vehicle.summary.plate_image}`:""} alt="car" className={styles.Vehicle_Details_image_car} />
            </div>
            <div className={styles.Vehicle_Details_image} >
                    <img src={vehicle.summary && vehicle.summary.image ?`${config.hostDomain}${ vehicle.summary.image}`:""} alt="car" className={styles.Vehicle_Details_image_car} />
            </div>
           
        </div>
    )
}

export default VehicleDetails
