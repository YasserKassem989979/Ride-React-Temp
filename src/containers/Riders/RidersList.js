import React from 'react'
import Card from "../../components/Card/card"
import {translate} from "../../utils/translate"
 const RidersList= (props) => {

    const riders = props.riders;
    return (
        <div>
            {riders && riders.length > 0 &&riders.map(rider=>{
                return <Card 
                onClick={()=>props.getRider(rider.id)}
                key={rider && rider.id}
                data={rider}
                img={rider && rider.profile_image}
                headerTitle={rider && rider.full_name}
                fileds={[
                {icon:"mobile-alt",text:rider && rider.phone_number},
                {icon:"envelope",text:rider && rider.email},
                {icon:"venus-mars",text:rider && translate(rider.gender)},
                {icon:"star",text:rider && rider.rating},
                {icon:"car",text:rider && rider.total_trips},
            ]}
                status={rider && rider.verification_status}/>
                
            })}
        </div>
    )
}

export default RidersList
