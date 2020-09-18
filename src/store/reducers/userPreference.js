import * as actions from "../actions/actionTypes"

const initialState = {
    lang:"ar",
    direction:"rtl",
    currentPage:"",
    path:""
};


 const userPrefrence  = (state=initialState,action) =>{
    switch (action.type){
        case actions.CHANGE_LANGUAGE:
            
            if(state.lang==="ar"){
                return {
                    ...state,
                    lang:"en",
                    direction:"ltr"
                }
            }else{
                return {
                    ...state,
                    lang:"ar",
                    direction:"rtl"
                }
            }
        case actions.CHANGE_CURRENT_PAGE_NAME:
            return{
                ...state,
                currentPage:action.currentPage,
                path:action.path
            }
        default :
        return state
    }
  
};


export default userPrefrence