import React from 'react'
import Card from "../../components/Card/card";
import {translate} from "../../utils/translate"


const DriversList = (props) => {
    const drivers = props.drivers;

    const statuses = (driver) => {
    const icons={"FREE":{icon:"user-check",text:driver && translate(driver.availability) },
        "BUSY":{icon:"user-clock",text:driver && translate(driver.availability)},
        "OFFLINE":{icon:"user-times",text:driver && translate(driver.availability),color:"#a7a9ac"},
        "LOGOUT":{icon:"user-slash",text:driver && translate(driver.availability),color:"#a7a9ac"}}
            
        return icons[driver.availability]?icons[driver.availability]:{icon:"user-slash",text:driver && translate(driver.availability),color:"#a7a9ac"}
    }
    
    return (
        <div>
        {drivers && drivers.length > 0 && drivers.map(driver=>{
            return <Card 
            onClick={()=>props.getDriver(driver?driver.id:"")}
            key={driver && driver.id}
            data={driver}
            img={driver && driver.profile_image}
            headerTitle={driver && driver.full_name}
            fileds={[
            {icon:"mobile-alt",text:driver && driver.phone_number},
            {icon:"venus-mars",text:driver && translate(driver.gender)},
            {icon:"star",text:driver && driver.rating},
            {icon:"suitcase",text:driver && driver.total_rides},
            {...statuses(driver)}]}
            />
            
        })}
    </div>
    )
}



export default DriversList
