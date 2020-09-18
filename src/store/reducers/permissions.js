import * as actions from "../actions/actionTypes"

const initialState = {
   permissions:null
};


 const permissions  = (state=initialState,action) =>{
    switch (action.type){
        case actions.SAVE_USER_PERMISSIONS:
            return {
                ...state,
                permissions:action.permissions
            }
        default :
        return state
    }
  
};


export default permissions