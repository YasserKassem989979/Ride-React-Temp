import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress} from '@material-ui/core';
import {translate} from "../../utils/translate";
import RatingCard from "./ratingCard"
const RatingList = (props)=> {
    return (
        <div>
            <InfiniteScroll
                dataLength={props.state.ratings.length} 
                next={()=>props.getRatings(false)}
                hasMore={props.state.hasMoreRating}
                loader={<div style={{textAlign:"center"}}><CircularProgress size={20} /></div>}
                height={700}
                endMessage={
                    <p style={{textAlign: 'center'}}>
                    <b>{translate("NO_MORE_DATA")}</b>
                  </p>
                }>
               {props.state.ratings&&props.state.ratings.length>0&&props.state.ratings.map(rate=>{
                   if((rate.rider.rate&&props.id==="driver")||(rate.driver.rate&&props.id==="rider")){
                    return <RatingCard key={rate.booking_id} id={props.id} rate={rate}/>
                   }else{
                       return null
                   }
                  
               })}
            </InfiniteScroll>
        </div>
    )
}

export default RatingList
