import 'date-fns';
import React from 'react'
import { Button } from '@material-ui/core';
import styles from "./actionUpdateDate.module.css";
import {translate} from "../../utils/translate";
import {  KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
moment.locale("en")
// this component is the content of confomatin alert for actios, it takes actionName,name,cancelActionHandler, actionHandler as props
const ActionUpdateDate = ({ actionHandler, actionName, name, helperText, error, date, cancelActionHandler, color, textField=true, dateHandler, title="UPDATE_EXPIRY_DATE"}) => {
    return (
        <div className={styles.container}>
        <div className={styles.confirmationText}>
            <p>{translate(title)}</p>
        </div>
       {textField?<div className={styles.confirmationText} dir="lrt">
       <MuiPickersUtilsProvider utils={DateFnsUtils}>

        <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            id="date-picker-inline"
            label={translate(title)}
            helperText={translate(helperText)}
            value={date}
            onChange={value => { dateHandler(value); console.log({value}) }}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            />
            </MuiPickersUtilsProvider>
        </div>:null} 
        <div className={styles.confirmationButtons}>
        <div className={styles.button}>
        <Button 
         color="primary"
         onClick={cancelActionHandler}>
            {translate("GO_BACK")}
        </Button>
        </div>
        <div className={styles.button}>
        <Button 
        variant="contained" 
        onClick={actionHandler}>
        {translate(actionName)}
        </Button>
        </div>
        </div>
    </div>
    )
}

export default ActionUpdateDate
