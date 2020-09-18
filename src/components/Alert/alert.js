import {store} from "../../index";
import * as actionTypes from "../../store/actions/actionTypes"



export default {
    success :(message)=>{
        store.dispatch({type:actionTypes.ALERT_MESSAGE,message,color:"#43A047"})
    },
    error:(message)=>{
        store.dispatch({type:actionTypes.ALERT_MESSAGE,message,color:"#D3392F"})
    },
    warning:(message)=>{
        store.dispatch({type:actionTypes.ALERT_MESSAGE,message,color:"#FDA129"})
    }
} 

