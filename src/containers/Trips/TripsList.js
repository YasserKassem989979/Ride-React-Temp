import React from 'react'
import SummaryBookingCard from "../../components/summaryBookingCard/summaryBookingCard"
import { withRouter } from 'react-router-dom';
 const TripsList= (props) => {
    const trips = props.trips;
    return (
        <div style={{ width: props.fullWidth ? "100%": "unset" }}>
            {trips && trips.length > 0 &&trips.map((trip, index)=>{
                return <SummaryBookingCard 
                onClick={()=> props.getTrip? props.getTrip(trip.id) : props.history.push("/rides", { id: trip.id })}
                key={trip && `${trip.id} ${index}`}
                trip={trip}
                id="trip"
                disabled = {props.selectedTrip && props.selectedTrip.summary.id == trip.id}
                />
                
            })}
        </div>
    )
}

export default withRouter(TripsList)
// 