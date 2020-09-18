import React from 'react'
import styles from "./smallCard.module.css"
import { Paper } from '@material-ui/core'

const smallCard = (props) => {
    return (
        <Paper elevation={0}  style={{margin:3}}>
            <div className={styles.container}>
            {props.children}
        </div>
        </Paper>
        
    )
}

export default smallCard
