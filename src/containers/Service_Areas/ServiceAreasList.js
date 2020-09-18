import React from 'react'
import {translate} from "../../utils/translate";
import {AreasContext} from "./ServiceAreasContainer";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from "./ServiceAreas.module.css";
import { Button } from '@material-ui/core';

const ServiceAreasList = (props) => {
const [clickedItem,setclickedItem]=React.useState('')
const clicked = (id,index)=>{
    setclickedItem(index);
    props.getArea(id);
}
    return (
        <AreasContext.Consumer>
        {values=>(
            <div className={styles.listWrapper}>
                 {values.state.areas.map((area,index)=>{
                    return <ExpansionPanel 
                    style={{
                        borderBottom:index===clickedItem ? '2px solid #17568d':'none',
                    transition:'all 0.2s'}}
                    defaultExpanded={index===0 ||index===1?true:false} 
                    key={area.id}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id={area.name}
                    >
                    <Typography style={{display:"flex",flexBasis:"33%",fontWeight:"bold"}}>{area.name}</Typography>
                    <Typography style={{color:"#a2a2a2"}} >{translate(area.activation_status)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding:'2px 20px'}}>
                        <div className={styles.wrapperForScoreCards}>
                        <div className={styles.scoreCardsCont}>
                            <div className={styles.scoreCard}>
                                <div className={styles.scoreCircle}>
                                    {area.total_trips}
                                </div>
                                <div className={styles.scoreTilte}>
                                    <Typography className={styles.text}>{translate('TRIPS')}</Typography>
                                </div>
                            </div>
                            <div className={styles.scoreCard}>
                                <div className={styles.scoreCircle}>
                                    {area.total_active_drivers}
                                </div>
                                <div className={styles.scoreTilte}>
                                <Typography className={styles.text}>{translate('DRIVERS')}</Typography>
                                </div>
                            </div>
                            <div className={styles.scoreCard}>
                                <div className={styles.scoreCircle}>
                                    {area.active_promo_codes}
                                </div>
                                <div className={styles.biggerScoreTilte}>
                                <Typography className={styles.text}> البروموكود الفعالة</Typography>
                                </div>
                            </div>
                        </div>
                            </div>
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions style={{padding:4}}>
                        <Button 
                        size="small" 
                        color="primary"
                        onClick={()=>clicked(area.id,index)} >
                            {translate('DETAILS')}
                        </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
                })}    
        </div>
        )}
             
        </AreasContext.Consumer>
    )
}

export default ServiceAreasList
