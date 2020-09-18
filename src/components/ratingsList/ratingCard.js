import React from 'react'
import styles from "./ratingList.module.css";
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import config from "../../config/backendURLS";
import TodayIcon from '@material-ui/icons/Today';
import { Tooltip } from '@material-ui/core';
import moment from "moment";
import {useSelector} from "react-redux"
import { theme } from '../../config/theme';
const RatingCard = (props) => {
    const {rate}=props;
    let item  = rate && props.id === "driver"? rate.rider : rate.driver;
    const dir = useSelector(state=>state.userPrefrence.direction)
    return (
           <div className={styles.rateCard}>
               <div className={styles.nameStarsDate}>
                    <div className={styles.nameStars}>
                         <div className={styles.avatar}>
                            <Avatar src={item.is_placeholder?item.profile_image:`${config.hostDomain}${item.profile_image}`} alt="profile pic" style={{width:40,height:40}}/>
                         </div>
                         <div className={styles.name}>
                            <p style={{margin:0}}>{item&&item.full_name}</p>
                            <Rating name="read-only" value={item && item.rate?Number(item.rate):0} readOnly size="small" />
                         </div>
                    </div>
                    <div className={styles.date}>
                        <div className={styles.dateHolder}>
                            <TodayIcon style={{fontSize:20,margin:"0 2px"}}/>
                            <div>
                                <Tooltip title={rate.date}>
                                    <p style={{margin:0}}>{moment(rate.date).format("MMM Do")}</p>
                                </Tooltip>
                                
                            </div>
                        </div>
                        <div className={styles.bookingid}>
                             <i style={{margin:"0px 3px"}} className="fas fa-hashtag"></i>
                             <div>
                                 <p style={{margin:0}}>{String(rate.booking_id).slice(String(rate.booking_id).length-4)}</p>
                             </div>
                        </div>
                    </div>
               </div>

               <div style={{paddingRight:dir==="rtl"?55:0,paddingLeft:dir==="ltr"?55:0}} className={styles.comment}>
                    <p style={{margin:"2px 0",color:theme().palette.text.secondary}}>{item&&item.comment}</p>
               </div>
           </div>
      
    )
}

export default RatingCard
