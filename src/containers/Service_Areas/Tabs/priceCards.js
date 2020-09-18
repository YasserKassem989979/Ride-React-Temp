import React from 'react'
import styles from "../ServiceAreas.module.css";
import PriceCard from "../../../components/priceCard/priceCard";
import ActionsMenu from "../../../components/actionsMenu/actionsMenu"
const PriceCards = (props) => {
    const {price_cards} = props.area;

    return (
        <div style={{maxHeight:730,overflow:"auto"}}>
             <ActionsMenu 
                object="PRICE-CARD"
                status={null}
                onActionClicked={props.onActionClicked}
                />
            <div className={styles.priceCardsContainer}>
            <div className={styles.priceCardsList}>
            {price_cards && price_cards.length>0 && price_cards.map(card =>{
                return <PriceCard
                priceCardId = {card.id}
                getPriceCard={props.getPriceCard}
                key={card.id+Math.random()}
                price={card.base_fare}
                data={card}/>
            })}
            </div>
            </div>
        </div>
    )
}

export default PriceCards
