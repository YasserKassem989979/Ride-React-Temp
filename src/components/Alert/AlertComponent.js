import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import {useSelector,useDispatch} from "react-redux";
import SnackbarContent from '@material-ui/core/SnackbarContent';



const Alert = () => {
  const {openAlert,error_message,color}= useSelector(state=>state.alert);
  const direction = useSelector(state=>state.userPrefrence.direction)
  const dispatch=useDispatch()

  const handleClose = () => {
      dispatch({type:"CLOSE_ERROR"})
    };
    
    
    return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal:direction==="ltr"?"right":'left',
          }}
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleClose}
        >
        <SnackbarContent
        style={{backgroundColor:color}}
        message={
          <span>{error_message}</span>
        }
      />
      </Snackbar>
    );
}

export default Alert
