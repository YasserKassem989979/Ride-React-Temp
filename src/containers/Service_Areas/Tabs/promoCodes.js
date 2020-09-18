import React from 'react'
import styles from "../ServiceAreas.module.css";
import {AreasContext} from "../ServiceAreasContainer";
import ActionsMenu from "../../../components/actionsMenu/actionsMenu" 
import { translate } from '../../../utils/translate';

const PromoCodes = (props) => {
    const {promo_codes}=props.area
    return (
        <AreasContext.Consumer>
      {values=>(
          <>
                  <ActionsMenu
                    object="PROMO-CODE"
                    status="NO_STATUS"
                    onActionClicked={values.onActionClicked}/>
          <div style={{maxHeight:730,overflow:"auto",padding:"0 5px"}}>
            <div className={styles.promoWrapper}>
            {promo_codes && promo_codes.length>0 && promo_codes.map(promo=>{
                return <div className={styles.dontKnow} key={promo.id}>
                    <div className={styles.actionsDiv}>
                    <div style={{display:"flex",order:1}}>
                    <ActionsMenu
                    iconButtonStyle={{padding:"0px"}}
                    object="PROMO-CODE"
                    status={promo.status}
                    document_id={promo.id}
                    onActionClicked={values.getPromoDetails}/>
                    </div>
                    <div style={{display:"flex",flexGrow:1}}>
                        <p style={{color:promo.status == "ACTIVE" ? "#590" : "#a2a2a2"}}>{translate( promo.status)}</p>
                    </div>
                    </div>
                    <div className={styles.promoCont}>
                    <div className={styles.promoName}>
                        <p>الاسم</p>
                    </div>
                    <div  className={styles.promoDes}>
                        الوصف
                    </div>
                    <div className={styles.promoUsage}>
                        الاستعمال
                    </div>
                    <div className={styles.promoUsage}>
                        الخصم
                    </div>
                    </div>
                    <div className={styles.promoCont}>

                    <div className={styles.promoName}>
                        <p>{promo.promo_code}</p>
                    </div>
                    <div  className={styles.promoDes}>
                        {promo.description}
                    </div>
                    <div className={styles.promoUsage}>
                        {promo.total_usage}
                    </div>
                    <div className={styles.promoUsage}>
                        {promo.discount}%
                    </div>
                    </div>
                </div>
            })}
            {promo_codes && promo_codes.length===0 ?
            <h4>لا يوجد بروموكود</h4>:null}
            </div>
        </div>
        </>
      )}
        </AreasContext.Consumer>
    )
}

export default PromoCodes
