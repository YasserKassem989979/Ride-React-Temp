import React from 'react'
import { Button } from '@material-ui/core'
const dangerButton = (props) => {
    return (
       <Button
       variant="contained"
       onClick={props.onClick} 
       style={{backgroundColor:"#980000",color:"#fff"}}>
           {props.children}
       </Button>
    )
}

export default dangerButton
