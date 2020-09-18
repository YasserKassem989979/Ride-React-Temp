import { store } from "..";

/**
 * Checks whether the user can do some action
 * @param {String} permission permission code
 * @example canI("DELETE_ROLE_NO-STATUS")
 * @returns {Boolean}
 */
export function canI(permission){
    return flattenPermissions().includes(permission)
}


/**
 * Get all permissions as one flat array
 * @returns {String[]}
 */
function flattenPermissions(){
    let raw=[];const $=store.getState().permissions.permissions;
    Object.values($).forEach(e=>{Object.values(e).forEach(l=>{l.forEach(p=>raw.push(p.label))})})
    return raw;
}