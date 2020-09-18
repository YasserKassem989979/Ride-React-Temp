import React, { Component } from 'react'
import {AreasContext} from "../ServiceAreasContainer";
import styles from "./actionsListener.module.css";
import { TextField, Button,FormControlLabel,InputLabel, CircularProgress } from '@material-ui/core';
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import { translate } from '../../../utils/translate';
import DangerButton from "../../../components/dangerButton/dangerButton";
import moment from 'moment';
import axios from "../../../axios";
import Alert from '../../../components/Alert/alert';
moment.locale("en");
export class PromoCodeForm extends Component {

    state={
        isLoading:false,
        promoCode:"",
        promo_code_description:"",
        promo_code_value:"",
        promo_code_value_type:2,
        promo_code_limit:"",
        promo_code_limit_per_user:"",
        applicable_for:2,
        start_date:new Date(),
        end_date:new Date(),
        promo_code_validity:2,
        service_type_id:[],
        new_users:false,
        pinkChecked:false,
        normalChecked:false,
        validity:false,
        promo_percentage_maximum_discount: ""
    };

    componentDidMount() {
        if(!this.props.create){
            const {promoDetails} = this.props;
            let servicesArray=[];
    
            if(promoDetails && promoDetails.service_type && promoDetails.service_type.length>0){
                promoDetails.service_type.forEach(service=>{
                    servicesArray.push(service.id)
                })
            };
            this.setState({
                promoCode:promoDetails.promoCode,
                promo_code_description:promoDetails.promo_code_description,
                promo_code_value:promoDetails.promo_code_value,
                promo_code_limit:promoDetails.promo_code_limit,
                promo_code_limit_per_user:promoDetails.promo_code_limit_per_user,
                applicable_for:promoDetails.applicable_for,
                new_users:promoDetails.applicable_for === 1 ? true : false,
                start_date:promoDetails.start_date,
                end_date:promoDetails.end_date,
                validity:promoDetails.promo_code_validity === 1 ? true:false,
                promo_code_validity:promoDetails.promo_code_validity,
                pinkChecked:servicesArray.includes(6),
                normalChecked:servicesArray.includes(1),
                promo_percentage_maximum_discount:promoDetails.promo_percentage_maximum_discount
            })
        }
    }
    

    changeTextHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    };

    handleNewUsersChange = () =>{
        this.setState({new_users:!this.state.new_users,
            applicable_for:this.state.applicable_for===2?1:2})
    }

    handlePinkChange = () =>{
        this.setState({
            pinkChecked:!this.state.pinkChecked,
        })
    };

    handleNormalChange = () =>{
        this.setState({
            normalChecked:!this.state.normalChecked,
        })
    };

    handleValidityChange = () => {
        this.setState({
            validity:!this.state.validity,
            promo_code_validity: this.state.promo_code_validity === 2 ? 1 :2})
    };

    handleStartDateChange = (date) =>{
        this.setState({start_date:date})
    }
    handleEndDateChange = (date) => {
        this.setState({end_date:date})
    }


    onSubmitForm = () => {
        
      const {promoDetails,area} = this.props;
      let id=null;
      if(!this.props.create){
        id = promoDetails.id;
      } 
      const areaId = area.id;
      const startDateFormated = moment(this.state.start_date).format("YYYY-MM-DD");
      const endDateFormated = moment(this.state.end_date).format("YYYY-MM-DD");
      const  service_type_id=[];

      if(this.state.pinkChecked){
        service_type_id.push(6)
      }

      if(this.state.normalChecked){
        service_type_id.push(1)
      }

      const form = {
        area:areaId,
        promocode:this.state.promoCode,
        promo_code_description:this.state.promo_code_description,
        promo_code_value:this.state.promo_code_value,
        promo_code_value_type:this.state.promo_code_value_type,
        promo_code_validity:this.state.promo_code_validity,
        promo_code_limit:this.state.promo_code_limit,
        promo_code_limit_per_user:this.state.promo_code_limit_per_user,
        applicable_for:this.state.applicable_for,
        start_date:startDateFormated,
        end_date:endDateFormated,
        service_type_id:service_type_id,
        promo_percentage_maximum_discount: this.state.promo_percentage_maximum_discount
      };

      this.setState({isLoading:true});

      if(this.props.create){
        axios.post(`/promo_codes`,form)
        .then(res=>{
            this.setState({isLoading:false},()=>{
              Alert.success("تمت العملية بنجاح");
              this.props.onClose(true)
            });
           
        })
        .catch(err=>{
            this.setState({isLoading:false});
            Alert.error(err.data?err.data.message:"ERROR")
        });

        return;
      }
      axios.put(`/promo_codes/${id}`,form)
      .then(res=>{
          this.setState({isLoading:false},()=>{
            Alert.success("تمت العملية بنجاح");
            this.props.onClose(true)
          });
         
      })
      .catch(err=>{
          this.setState({isLoading:false});
          Alert.error(err.data?err.data.message:"ERROR")
      })
    }

    render() {
        return (
            <AreasContext.Consumer>
                {values=>(
                <>
                   {!this.state.isLoading?<div className={styles.promoCodeForm}>
                        <div className={styles.nameDescription}> 
                        <div>
                        <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("NAME")}:</InputLabel>
                        <TextField
                            name="promoCode"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promoCode}
                            placeholder={translate("NAME")}
                            />
                        </div>
                            <div>
                            <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("DESCRIPTION")}:</InputLabel>
                            <TextField
                            name="promo_code_description"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promo_code_description}
                            placeholder={translate("DESCRIPTION")}
                            />
                            </div>
                           
                        </div>
                        <div className={styles.discountLimituser}>
                            <div style={{marginTop:12}}>
                            <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("DISCOUNT_AMOUNT")}:</InputLabel>
                            <TextField
                            name="promo_code_value"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promo_code_value}
                            placeholder={translate("DISCOUNT_AMOUNT")}
                            />
                            </div>
                       <div style={{marginTop:12}}>
                       <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("USES_PER_SYSTEM")}:</InputLabel>
                       <TextField
                            name="promo_code_limit"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promo_code_limit}
                            placeholder={translate("USES_PER_SYSTEM")}
                            />
                       </div>
                           <div style={{marginTop:12}}>
                           <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("USES_PER_USER")}:</InputLabel>
                           <TextField
                            name="promo_code_limit_per_user"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promo_code_limit_per_user}
                            placeholder={translate("USES_PER_USER")}
                            />
                           </div>
                           <div style={{marginTop:12}}>
                           <InputLabel style={{fontSize:18,marginBottom:5,color:"#000"}} shrink >{translate("MAX_DISCOUNT")}:</InputLabel>
                           <TextField
                            name="promo_percentage_maximum_discount"
                            variant="outlined"
                            onChange={this.changeTextHandler}
                            value={this.state.promo_percentage_maximum_discount}
                            placeholder={translate("MAX_DISCOUNT")}
                            />
                           </div>
                        </div>
                        <div className={styles.checkboxese}>
                             <div className={styles.checkbox}>
                             <FormControlLabel
                                control={
                                <Switch 
                                checked={this.state.new_users}
                                onChange={this.handleNewUsersChange}
                                value={1} />
                                }
                                label={translate("NEW_USERS")}
                            />
                             </div>
                             <div className={styles.checkbox}>
                             <FormControlLabel
                                    control={
                                    <Switch 
                                    checked={this.state.validity} 
                                    onChange={this.handleValidityChange}
                                    value={1}/>
                                    }
                                    label={translate("PERMENANT")}
                                />
                             </div>
                             <div className={styles.checkbox}>
                             <FormControlLabel
                                    control={
                                    <Checkbox 
                                    checked={this.state.pinkChecked} 
                                    onChange={this.handlePinkChange} 
                                    value={1} />
                                    }
                                    label="Pink"
                                />
                             </div>
                             <div className={styles.checkbox}>
                             <FormControlLabel
                                    control={
                                    <Checkbox 
                                    checked={this.state.normalChecked} 
                                    onChange={this.handleNormalChange}
                                    value={6}/>
                                    }
                                    label="Normal"
                                />
                             </div>
                           
                        </div>
                        <div className={styles.datePromoForm}>
                        <div className={styles.dateInputForm}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink >{translate("FROM")}:</InputLabel>
                        <KeyboardDatePicker
                            disabled={this.state.validity}
                            style={{maxWidth:200}}
                            disableToolbar
                            variant="inline"
                            format="YYYY-MM-DD"
                            margin="normal"
                            id="date-picker-start_time"
                            value={this.state.start_date}
                            onChange={this.handleStartDateChange}
                            />
                        </MuiPickersUtilsProvider>
                        </div>
                        <div className={styles.dateInputForm}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink >{translate("TO")}:</InputLabel>
                        <KeyboardDatePicker
                        disabled={this.state.validity}
                            style={{maxWidth:200}}
                            disableToolbar
                            variant="inline"
                            format="YYYY-MM-DD"
                            margin="normal"
                            id="date-picker-end_time"
                            value={this.state.end_date}
                            onChange={this.handleEndDateChange}
                            />
                        </MuiPickersUtilsProvider>
                        </div>

                        </div>

                        <div className={styles.confirmation}>
                             <Button
                             style={{margin:"0 15px"}}
                             variant="contained"
                             color="primary"
                             onClick={this.onSubmitForm}>
                                 {this.props.create?translate("CREATE"):translate("refresh")}
                             </Button>
                             <DangerButton
                             onClick={()=>this.props.onClose(false)}>
                                 إلغاء
                             </DangerButton>
                        </div>
                    </div>:<div style={{display:"flex",justifyContent:"center",padding:15}}><CircularProgress/></div>}
                </>)}
            </AreasContext.Consumer>
           
        )
    }
}


export default PromoCodeForm
