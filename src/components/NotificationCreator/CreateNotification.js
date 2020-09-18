import React,{useState} from 'react';
import styles from "./notification.module.css";
import { TextField,Checkbox,FormControlLabel,Button, CircularProgress} from '@material-ui/core';
import DateFnsUtils from '@date-io/moment';
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import {translate} from "../../utils/translate"
import preview from "../../assets/preview.png"


const CreateNotification = (props) => {
    const [errorTilte,setErrorTitle]=useState(false);
    const [helperTextTitle,setHelperTextTitle]=useState("");
    const [errorTilteBody,setErrorTitleBody]=useState(false);
    const [helperTextTitleBody,setHelperTextTitleBody]=useState("");
    const [title,setTitle]=useState("");
    const [textBody,setTextBody]=useState("");
    const [expir_date,setExpirDate]=useState(new Date())
    const [promotion,setPromotion] = useState(false)
    const [imagePreview,setImagePreview]=useState(null)
    const [image,setImage]=useState(null);

    // title handler
    const handleTitleChange = (e)=>{
        setTitle(e.target.value);
        setErrorTitle(false);
        setHelperTextTitle("");
    }

    //textBody handler
    const handletTextBodyChange = (e)=>{
        setTextBody(e.target.value);
        setErrorTitleBody(false);
        setHelperTextTitleBody("");
    }

    const handlePromotionChangeChange = ()=>{
        setPromotion(!promotion)
    };

    const handleDateChange = date =>{
        setExpirDate(date.format("YYYY-DD-MM"))
    };

    // image upload handler and previewer
    const uploadImage = (e)=>{
        setImage(e.target.files[0]);
        if(e.target.files[0]){
            let reader = new FileReader();
            reader.onloadend = () => {
                    setImagePreview(reader.result)
                }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const submitNotification = (e)=>{
        e.preventDefault();
        if(title===""){
            setErrorTitle(true);
            setHelperTextTitle(translate("FIELD_REQUIRED"));
            return
        }

        if(textBody===""){
            setErrorTitleBody(true);
            setHelperTextTitleBody(translate("FIELD_REQUIRED"));
            return
        }
       
        
        // create ford data to send it 
        let form = new FormData();
        form.append('title', title);
        form.append('message', textBody);
        if(promotion){
        form.append('expiry_date', expir_date);
        form.append('show_promotion', promotion);
        }
        if(image){
            form.append( 'image', image );
        }

        props.actionHandler(form)
    }
    const {isLoading} = props;
    return (
        <>
        {!isLoading?
        <div className={styles.container}>
            <form  onSubmit={submitNotification} autoComplete="off">
            <div>
            <TextField
            helperText={helperTextTitle}
            error={errorTilte}
            onChange={handleTitleChange}
            classes={{root:styles.title}}
            label={translate("TITLE")} 
            variant="outlined"
            value={title}/>
            </div>
            <div className={styles.body}>
            <TextField
             helperText={helperTextTitleBody}
             error={errorTilteBody}
                onChange={handletTextBodyChange}
                label={translate("BODY_MESSSAGE")} 
                multiline
                rows="5"
                className={styles.textarea}
                margin="normal"
                variant="outlined"
                value={textBody}
                />
            </div>
            <div className={styles.promotion}>
            <FormControlLabel
                control={
                <Checkbox 
                checked={promotion} 
                onChange={handlePromotionChangeChange}
                />
                }
                label={translate("PROMOTION")} 
            />
            </div>
            <div className={styles.date}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        
                        <KeyboardDatePicker
                            disabled={!promotion}
                            style={{maxWidth:200}}
                            disableToolbar
                            variant="inline"
                            format="DD-MM-YYYY"
                            margin="normal"
                            label={translate("EXPIRATION_DATE")}
                            value={expir_date}
                            onChange={handleDateChange}
                            />
                        </MuiPickersUtilsProvider>
            </div>
            
            <div className={styles.image}>
            <label className={styles.fileUploadLabel} htmlFor="notification_image">{translate("ADD_IMAGE")}</label>
            <input type='file' id='notification_image' className={styles.fileUpload} onChange={uploadImage} /> 
            <img src={imagePreview||preview} className={styles.imagePreview}  alt="preview"/>
            </div>
            <div className={styles.confirm}>
                <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                >
                    {translate("SEND")}
                </Button>
            </div>
            </form>
        </div>:
        <div style={{display:"flex",justifyContent:"center",padding:15}}>
        <CircularProgress />
        </div>}
        </>
    )
}

export default CreateNotification
