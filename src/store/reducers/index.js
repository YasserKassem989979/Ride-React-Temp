import {combineReducers} from "redux";
// importing reducers 
import auth from "./Auth"
import userPrefrence from "./userPreference"
import permissions from "./permissions"
import alert from "./alert"
// combining the reducers
const rootReducer = combineReducers({
    auth,
    userPrefrence,
    permissions,
    alert
});


export default rootReducer
