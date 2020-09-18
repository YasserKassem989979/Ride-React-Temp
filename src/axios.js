import axios from "axios";
import {store} from "./index"
import config from "./config/backendURLS"

// to get the localStorage and parse the the token 
  let  storage  = JSON.parse(localStorage.getItem("persist:root"));
  storage = storage && storage.auth ? JSON.parse(storage.auth):null

     
const instance = axios.create({
    baseURL: config.backendURL+'/api/admin/',
    headers: {
      'Accept': 'application/json',
    }
  });

  if(storage){
    instance.defaults.headers['Authorization'] = storage.token 
  }

  instance.interceptors.response.use( (response)=> {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  }, 
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if(error.response && error.response.data && error.response.data.message === "Unauthenticated"){
      store.dispatch({type:"LOGIN_FAILD"})
        };
        return Promise.reject(error.response?error.response:error);;
  });

  export default instance