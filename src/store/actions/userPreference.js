import * as actionTypes from "./actionTypes"
import {translate} from "../../utils/translate"
export const changeCurrentPageName = (pageName) => dispatch=>{
    const slicedName = translate(pageName.slice(1,pageName.length).toUpperCase())
        return dispatch({
            type:actionTypes.CHANGE_CURRENT_PAGE_NAME,
            currentPage:slicedName,
            path:pageName})
}