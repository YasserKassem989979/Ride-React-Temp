import * as actionTypes from "../actions/actionTypes"


const initialState ={
    isLogged:false,
    email:"",
    token:null,
    isLoading:false,
    error_message:""
}



const auth =(state=initialState,action)=>{
    switch(action.type){
       case actionTypes.START_LOGIN:
           return {
               ...state,
               isLoading:true,
               error_message:""
           }
        case actionTypes.LOGIN_SUCCESS:
            return{
                ...state,
                isLoading:false,
                email:action.email,
                token:action.token,
                isLogged:true,
                error_message:""

            }
        case actionTypes.LOGIN_FAILD:
            return{
                ...state,
                isLogged:false,
                isLoading:false,
                token:null,
                email:"",
                error_message:action.error_message
            }
        default:
                return state
    }
   
}


export default auth