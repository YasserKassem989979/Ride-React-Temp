import en from "../config/dictionary/en"
import ar from "../config/dictionary/ar"

let  storage  = JSON.parse(localStorage.getItem("persist:root"))
     storage = storage && storage.userPrefrence ? JSON.parse(storage.userPrefrence):{lang:"ar"}

export const language = storage.lang;
     /**
      * Get the string caption in the app language
      * @param {String} code string code
      */
export const translate = (code) => {

    let _original = code;
    code = `${code}`.toUpperCase().replace(/ /g,"_")
    let caption = ar[code];
    if(storage.lang ==="en"){
        caption = en[code]
    }

    if(caption){
        return caption
    }else{
        console.log('%c{' + _original + "} NEED TRANSLATION <<<<<<<<<<<<<<< ", 'background: #eee; color: #444');
        return `${code}`.toLowerCase().replace(/_/g," ");
    }
}

