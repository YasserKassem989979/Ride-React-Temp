import React,{useState,useEffect} from 'react'
import styles from "./actionsListener.module.css";
import axios from "../../../axios";
import Alert from "../../../components/Alert/alert";
import {Chip,CircularProgress,Button,Snackbar,SnackbarContent} from '@material-ui/core';
import {translate}from "../../../utils/translate"
import nativeAxios from "axios";

const AddRemoveService = (props) => {
    const vehicleServices= props.vehicle.service_types;
    const {id}=props
    const [services,setServices]=useState([]);
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState("#000");
    const [deleteAlert,setDeleteAlert] = useState(false);
    // to get available services for a vehicle
    useEffect(()=>{
        setIsLoading(true);
        axios.get("/service_types/")
        .then(res=>{
            let servicesArr=res.data.map((element,index) => {
                if(vehicleServices.some(ele=>element.name===ele.name)){
                 return {...element,disabled:id==="add"?true:false,checked:false,color:id==="add"?"default":"primary"}
                }else{
                    return {...element,disabled:id==="add"?false:true,checked:false,color:"default"}
                }
            });
            setServices(servicesArr);
            setIsLoading(false)
        })
        .catch(err=>{
            setIsLoading(false);
            Alert.error(err.data?err.data.message:"ERROR");
            props.cancelActionHandler()
        })
    },[id,vehicleServices,props]);

    const handleServiceClicked = (index)=>{
        let servicesChecked = [...services];
        let item = {...servicesChecked[index]};
        item.checked = !item.checked;
        item.color = item.color ==="default" ?"primary":"default";
        servicesChecked[index] = item;
        setServices(servicesChecked);
        setError("#000")
    };

    // to add and remove  services to vehicle
    const submitServices = () => {
        // to check if there is  service selected
        let isThereServiceToAddRemove = services.some(item=>item.checked);
        if(!isThereServiceToAddRemove ){
            setError("#f20");
            return
        };

        // if it is remove action show alert
        if(id==="remove"){
            setDeleteAlert(true);
            return
        };

        // get the services he/she want to add
        let servicesToAddRemove =[];
        services.forEach(service=>{
            if(service.checked){
                servicesToAddRemove.push(axios.post(`/vehicles/add_service_type`,
                {
                    service_type_id:service.id,
                    vehicle_id:props.vehicle.id
                }))
            }
        });

        setIsLoading(true);
        nativeAxios.all(servicesToAddRemove)
        .then(res=>{
            setIsLoading(false)
            Alert.success(translate("SUCCESS_REQUEST"));
            props.cancelActionHandler(true)
        })
        .catch(err=>{
            setIsLoading(false);
            Alert.error(err.data?err.data.message:"ERROR");
        })
    }


    // if the alert dismissed  handler 
    const nextStepDelete = ()=>{
        setDeleteAlert(false);
        let servicesToAddRemove =[];
        services.forEach(service=>{
            if(service.checked){
                servicesToAddRemove.push(axios.post(`/vehicles/remove_service_type`,
                {
                    service_type_id:service.id,
                    vehicle_id:props.vehicle.id
                }))
            }
        });
        setIsLoading(true);
        nativeAxios.all(servicesToAddRemove)
        .then(res=>{
            setIsLoading(false)
            Alert.success(translate("SUCCESS_REQUEST"));
            props.cancelActionHandler(true)
        })
        .catch(err=>{
            setIsLoading(false);
            Alert.error(err.data?err.data.message:"ERROR");
        })
    }
    

    // to check if there are services you can add to vehicle
    const whatServices = services.every(service=>service.disabled)

    return (
        <>
        {isLoading?
        <div style={{display:"flex",padding:15,justifyContent:"center",alignItems:"center"}}>
            <CircularProgress/>
        </div>:
        <div className={styles.ServiceType}>
        <div className={styles.header}>
            <h4 style={{margin:0,color:error}}>{whatServices?(id==="add"?translate("NO_SERVICE_YOU_CAN_ADD"):translate("NO_SERVICE_YOU_CAN_REMOVE")):(id==="add"?translate("PLEASE_CHOOSE_SERVICE_TO_ADD"):translate("PLEASE_CHOOSE_SERVICE_TO_REMOVE"))}:</h4>
        </div>
        <div className={styles.services}>
            {services.map((service,index) =>{
                return <Chip
                        key={service.name}
                        // onDelete={()=>this.handleChipDelete(item,this.props.id)}
                        classes={{root:styles.badge}}
                        label={service.name} 
                        color={service.color}
                        disabled={service.disabled}
                        onClick={()=>handleServiceClicked(index)}
                         />
            })}
        </div>
        <div className={styles.confirmation}>
            <Button
            onClick={()=>props.cancelActionHandler(false)}
            variant="text"
            color="primary">
            {translate("GO_BACK")}
            </Button>
            <Button
            onClick={submitServices}
            variant="contained"
            style={{
                margin:"0px 3px",
                color:'#fff',
                backgroundColor:id==="add"?"#4479a5":"#980000"}}>
                {id==="add"?translate("ADD"):translate("REMOVE")}
            </Button>
        </div>
    </div>
 }
          <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={deleteAlert}
                >
                <SnackbarContent
                style={{backgroundColor:"#D3392F"}}
                message={
                <p>هذه العملية قد تؤثر على عمل السائق, هل تريد الإستمرار؟</p>
                }
                action={[
                    <Button 
                    style={{color:"#D3392F",backgroundColor:"#fff"}}
                    key="fkfkfkfkfkfk"
                    size="small"
                    onClick={nextStepDelete}>
                   حذف الخدمة
                </Button>,
                <Button
                style={{color:"#fff"}}
                key="fkjkgifikfojf"
                size="small"
                onClick={props.cancelActionHandler}>
                تراجع
            </Button>]}
            />
             </Snackbar>
        </>
    )
}

export default AddRemoveService
