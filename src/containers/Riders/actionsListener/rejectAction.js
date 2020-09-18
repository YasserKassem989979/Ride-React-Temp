import React,{useEffect} from 'react'
import styles from "./actionsListener.module.css";
import { Button, FormControlLabel, CircularProgress } from '@material-ui/core';
import {translate} from "../../../utils/translate";
import axios from "../../../axios";
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Alert from "../../../components/Alert/alert";

const RejectAction = (props) => {

    // state and props
    const {driver} =props;
    const [documents, setDocuments] = React.useState([]);
    const [notes, setNotes] = React.useState("");
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(()=>{
        setIsLoading(true)
        axios.get("/drivers/documents/rejectables/"+driver.personal.id)
        .then(res=>{
            setDocuments(res.data.map(item=>{
             return{
                 document:item,
                 checked:false,
                 label:item.parent.name
                }
            }
            ));
            setIsLoading(false)
        })
        .catch(err=>{
          Alert.error(err.data?err.data.message:"ERROR");
          setIsLoading(false)
        })
    },[]);

    // checkboxes handler
    const handleChange =(index)=>{
        let tempArray = [...documents];
        tempArray[index]['checked'] = !tempArray[index]['checked'];
        setDocuments(tempArray);
    };

    // notes handler
    const noteHandler =(event)=>{
        setError(false);
        setHelperText("")
        setNotes(event.target.value)
    }

    const submitDocuments = () => {

            if(notes===""){
                setHelperText("هذا الحقل مطلوب")
                setError(true);
                return
            }
            // check which document is checked and sent it's id
            let document_id=[];
            let vehicle_documents=[];
            documents.forEach(item=>{
                if(item.checked && item.label==="DriverVehicle"){
                    vehicle_documents.push(item.document.id)
                }
                if(item.checked && item.label==="Driver"){
                    document_id.push(item.document.id)
                }
            });

            // parmas to send with the request
            let params={
                comment:notes,
                driver_id:driver.personal.id
            };

            if(document_id.length>0){
                params.document_id = document_id
            }
            if(vehicle_documents.length>0){
                params.vehicle_documents = vehicle_documents
            }
            
            axios.put("/drivers/documents/reject",{...params})
            .then(res=>{
                Alert.success(translate("SUCCESS_REQUEST"))
                props.successActionHandler()
            })
            .catch(err=>{
                Alert.error(err.data?err.data.message:"ERROR");
                props.cancelActionHandler()
            })
    };

    return (
        <div className={styles.container}>
       
      {!isLoading?<><div className={styles.confirmationText}>
      
            {documents.map((item,index)=>{
                return  <FormControlLabel
                            key={item.document.id}
                            control={
                            <Checkbox
                                checked={item.checked}
                                onChange={()=>handleChange(index)}
                                value={item.document.id}
                                color="primary"
                            />
                            }
                            label={item.document.name?item.document.name:""}
                        />
                                        }
                        )
            }
            <FormControlLabel
                            key={driver.personal.id}
                            control={
                            <Checkbox
                                checked={true}
                                color="primary"
                            />
                            }
                            label={translate("DRIVER")}
                        />
            <TextField
            error={error}
            helperText={helperText}
            label="Notes" 
            variant="outlined"
            onChange={noteHandler} />

                        
        </div>
        <div className={styles.confirmationButtons}>
        <div className={styles.button}>
        <Button 
         color="primary"
         onClick={props.cancelActionHandler}>
            {translate("GO_BACK")}
        </Button>
        </div>
        <div className={styles.button}>
        <Button 
        variant="contained" 
        style={{backgroundColor:"#980000",color:"#F2F2F2"}}
        onClick={submitDocuments}>
        {translate("رفض")}
        </Button>
        </div>
        </div>
        </>:
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <CircularProgress/>    
        </div>}
    </div>
    )
};


export default RejectAction
