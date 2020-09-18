import React from 'react'
import styles from "./priceCard.module.css";
import { Paper} from '@material-ui/core';
import {translate} from "../../utils/translate";
import ActionsMenu from "../actionsMenu/actionsMenu"
const priceCard = (props) => {
    const {rate_scope,service_type,time_included,distance_included} = props.data
    return (
        <Paper  className={styles.priceCard}>
            <div className={styles.container}>
                <div className={styles.service_type}>
                    <p>{service_type.toUpperCase()}</p>
                    <ActionsMenu
                    object="PRICE-CARD"
                    status="NO-STATUS"
                    document_id={props.priceCardId}
                    onActionClicked={props.getPriceCard}/>
                </div>
                <div className={styles.info}>
                         <div className={styles.logo}>
                    <i className={rate_scope==="INSIDE"?`fas fa-city ${styles.logoSize}`:`fas fa-road ${styles.logoSize}`}></i>
                    </div>
               
                <div className={styles.details}>
                    <div className={styles.part1}>
                    <div className={styles.priceScope}>
                        <h5>${props.price}</h5>
                    </div>
                    <div className={styles.rateScope}>
                        <h5>{translate(rate_scope)}</h5>
                    </div>
                    </div>
                    <div className={styles.timeWrapper}>
                    <div className={styles.tim_distance}>
                       <p>الوقت:</p>
                      <p style={{margin:"0px 4px"}}>{time_included}</p>
                    </div>
                    <div className={styles.tim_distance}>
                    <p>المسافة:</p>
                        <p style={{margin:"0px 4px"}}>{distance_included}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </Paper>
      
    )
}

export default priceCard
