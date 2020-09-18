import * as actions from "../actions/actionTypes"

/// this reducer is just for alert component
const initialState = {
   openAlert:false,
   error_message:"",
   color:"#333333"
};


 const alert  = (state=initialState,action) =>{
    switch (action.type){
        case actions.ALERT_MESSAGE:
            return {
                ...state,
                openAlert:true,
                error_message:action.message,
                color:action.color
            };
        case "CLOSE_ERROR":
            return {
                ...state,
                openAlert:false,
                error_message:"",
                color:"#333333"
                };
        default :
        return state
    }
  
};


export default alert;