import React, { Component } from 'react';
import styles from "../../Drivers/actionsListener/actionsListener.module.css";
import preview from "../../../assets/preview.png";
import {translate} from "../../../utils/translate"
import config from "../../../config/backendURLS";
import { Avatar, TextField, Select,InputLabel,FormControl, Button, CircularProgress } from '@material-ui/core';
export class UpdateRider extends Component {

    state={
        image:null,
        imagePreview:null,
        name:"",
        gender:"",
        phone_number:"",
        labelWidth:0,
        name_error:false,
        gender_error:false,
        phone_number_error:false,
        birth_date:new Date(),
        email:"",
        email_error:false
    }

    inputLabel = React.createRef(null);

    componentDidMount() {
        const {rider} = this.props
        this.setState({
            labelWidth:this.inputLabel.current.offsetWidth,
            imagePreview:rider.personal.profile_image?`${config.hostDomain}${rider.personal.profile_image}`:"",
            name:rider.personal.full_name,
            gender:rider.personal.gender,
            phone_number:rider.personal.phone_number,
            email:rider.personal.email?rider.personal.email:""  
        })
    };

    inputChangeHandler = (e)=>{
       
        this.setState({[e.target.name]:e.target.value,
        name_error:false,
        phone_number_error:false,
        gender_error:false,
        email_error:false})
    };
  
    
     // image upload handler and previewer
      uploadImage = (e)=>{
       this.setState({
           image:e.target.files[0]
       });

        if(e.target.files[0]){
            let reader = new FileReader();
            reader.onloadend = () => {
                    this.setState({imagePreview:reader.result})
                }
            reader.readAsDataURL(e.target.files[0])
        }
    };


    handleDateChange = date => {
        this.setState({birth_date:date.format("DD-MM-YYYY")})
     };
     



     updateRiderInfo = ()=>{
        if(this.state.name===""){
            this.setState({name_error:true})
            return
        }

        if(this.state.gender===""){
            this.setState({gender_error:true})
            return
        }
        if(this.state.phone_number===""){
            this.setState({phone_number_error:true})
            return
        }
       
        // create ford data to send it 
        let form = new FormData();
        form.append('full_name', this.state.name);
        form.append('gender', this.state.gender);
        form.append('phone', this.state.phone_number);
        form.append('email', this.state.email);
        form.append( 'profile_image', this.state.image);
        this.props.actionHandler(form);

    }

    render() {
        const {isLoading} = this.props;

        return (<>
           {!isLoading? <div className={styles.formWrapper}>
                <div className={styles.image}>
                <Avatar src={this.state.imagePreview||preview} className={styles.imagePreview}  alt="preview"/>
                </div>
                <div className={styles.labelWrapper}>
                <label className={styles.fileUploadLabel} htmlFor="notification_image">{translate("UPDATE_IMAGE")}</label>
                <input type='file' id='notification_image' className={styles.fileUpload} onChange={this.uploadImage} />
                {/* <DangerButton
                onClick={this.deleteImage} 
                style={{margin:"0px 5px "}}>{translate("DELETE_IMAGE")}
                </DangerButton> */}
                </div>
                <div className={styles.inputsWrapper}>
                    <div className={styles.inputElement}>
                        <TextField
                        error={this.state.name_error}
                        label={translate("NAME")}
                        variant="outlined"
                        name="name"
                        value={this.state.name}
                        onChange={this.inputChangeHandler}/>
                    </div>
                    <div className={styles.inputElement}>
                    <FormControl variant="outlined" className={styles.formControl}>
                    <InputLabel ref={this.inputLabel} id="demo-simple-select-outlined-label">
                    {translate("GENDER")}
                    </InputLabel>
                    <Select
                    error={this.state.gender_error}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.gender}
                    onChange={this.inputChangeHandler}
                    labelWidth={this.state.labelWidth}
                    name="gender"
                    >
                    <option style={{padding:"15px 0px"}} value={'FEMALE'}>Female</option>
                    <option value={'MALE'}>Male</option>
                    </Select>
                    </FormControl>
                    </div>
                    <div style={{direction:"ltr"}} className={styles.inputElement}>
                    <TextField
                    error={this.state.phone_number_error}
                    label={translate("PHONE_NUMBER")}
                        variant="outlined"
                        name="phone_number"
                        value={this.state.phone_number}
                        onChange={this.inputChangeHandler}/>
                    </div>
                    <div style={{direction:"ltr"}} className={styles.inputElement}>
                    <TextField
                    error={this.state.email_error}
                    label={translate("EMAIL")}
                        variant="outlined"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.inputChangeHandler}/>
                    </div>
                    {/* <div style={{maxWidth:222}} className={styles.inputElement}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            
                            disableToolbar
                            variant="inline"
                            inputVariant="outlined"
                            format="DD-MM-YYYY"
                            label={translate("DATE_OF_BIRTH")}
                            value={this.state.birth_date}
                            onChange={this.handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </div> */}
                </div>
                <div className={styles.confirmation}>
                    <div>
                        <Button
                        color="primary"
                        onClick={this.updateRiderInfo}
                        variant="contained">
                            {translate("refresh")}
                        </Button>
                    </div>
                </div>
            </div>:
            <div style={{display:"flex",justifyContent:"center",padding:15}}>
                    <CircularProgress />
            </div>}
            </>
        )
    }
}

export default UpdateRider


