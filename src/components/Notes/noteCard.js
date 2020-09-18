import React from 'react'
import styles from "../ratingsList/ratingList.module.css";
import Avatar from '@material-ui/core/Avatar';
import config from "../../config/backendURLS";
import TodayIcon from '@material-ui/icons/Today';
import { Tooltip } from '@material-ui/core';
import moment from "moment";
import {useSelector} from "react-redux"
import { theme } from '../../config/theme';

const NoteCard = (props) => {
    const {item}=props;
    const dir = useSelector(state=>state.userPrefrence.direction)
    return (
           <div className={styles.rateCard}>
               <div style={JSstyles.nameStarsDate}>
                    <div style={JSstyles.nameStars}>
                         <div className={styles.avatar}>
                            <Avatar src={item.profile_image?item.profile_image:``} alt="profile pic" style={{width:40,height:40}}/>
                         </div>
                         <div className={styles.name}>
                            <p style={{margin:0}}>{item&&item.admin_name}</p>
                         </div>
                    </div>
                    <div className={styles.date}>
                        <div className={styles.dateHolder}>
                            <TodayIcon style={{fontSize:20,margin:"0 2px"}}/>
                            <div>
                                <Tooltip title={item.created_at}>
                                    <p style={{margin:0}}>{moment(item.created_at).format("MMM Do")}</p>
                                </Tooltip>
                                
                            </div>
                        </div>
                    </div>
               </div>

               <div style={{paddingRight:dir==="rtl"?55:0,paddingLeft:dir==="ltr"?55:0}} className={styles.comment}>
                    <p style={{margin:"2px 0",color:theme().palette.text.secondary}}>{item&&item.note}</p>
               </div>
           </div>
      
    )
}

export default NoteCard
const JSstyles = {
    nameStarsDate:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
    },
    nameStars:{
        display:'flex',
        alignItems: 'center',
    }
}
