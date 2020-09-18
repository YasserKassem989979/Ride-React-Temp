import React,{useState,useEffect} from "react"
import {useSelector} from "react-redux"
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from '@material-ui/core/IconButton';
import {Tooltip} from '@material-ui/core';
import {translate} from "../../utils/translate";
import {SearchContext} from "./SearchContainer"
 const HasPermissionToExtract = (props) => {
     
    const objectName= props.id
    // get list of permissions of redux
    const permission = useSelector(state=>state.permissions.permissions);
    // permissions for object like "DRIVER" with NO-STATUS
    const list = permission[objectName]['NO-STATUS'];
    //is Has permission?
    const [hasPermission,setHasPermission] = useState(false);
    let flag = false;

    // check if there is permission for extract report 
    if(list.length>0){
        list.forEach(element => {
            if(element.label === `EXTRACT-REPORTS_${objectName}_NO-STATUS`){
                flag= true;
                return;
            }
        });
    };

    useEffect(()=>{
        if(flag){
            setHasPermission(true);
        }
    },[objectName,flag])


    return(
        <SearchContext.Consumer>
            {valus=>(<>
                {hasPermission?<Tooltip title={translate("EXTRACT-REPORTS")}>
                 <IconButton onClick={valus.extractReport}>
                     <DescriptionIcon/>
                 </IconButton>
                 </Tooltip>:null}
                 </>
            )}
        </SearchContext.Consumer>
    )
};

export default HasPermissionToExtract;