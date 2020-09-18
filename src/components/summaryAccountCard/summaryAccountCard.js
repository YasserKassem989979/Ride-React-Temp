import React from 'react';
import styles from "./summaryAccountCard.module.css";
import {translate} from "../../utils/translate"
const summaryAccountCard = (props) => {
  const account ={...props.account}

    return (
        <div onClick={()=>props.onClick(account)} className={styles.card}>
            {account.currency&&<div className={styles.currency}>
                <p className={styles.currencyText}>{account.currency}</p>
            </div>}
            {account.balance&&<div className={styles.mainBalance}>
                <p className={styles.mainBalanceText}style={{margin:0,color:account.maximum_balance&&account.balance>account.maximum_balance && account.type==="CLAIM"?"#980000":"#14588d"}}>
                    {account.balance.toString().slice(0,account.balance.toString().length-2)}
                </p>
            </div>}
            {account.type&&<div className={styles.type}>
                <p style={{margin:"2px 0px"}}>{translate(account.type)}</p>
            </div>}
           { account.maximum_balance &&<div className={styles.maxBalance}>
                <p className={styles.typeText}>{translate("MAXIMUM_BALANCE")}:{account.maximum_balance.toString().slice(0,account.maximum_balance.toString().length-2)}</p>
            </div>}
        </div>
    )
}

export default summaryAccountCard
