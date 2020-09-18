import styles from "./detailsCard.module.css"
import React from 'react'

const personslDetailsCard = (props) => {
    return (
        <div style={props.style} className={styles.cardContainer}>
            {props.children}
        </div>
    )
}

export default personslDetailsCard
