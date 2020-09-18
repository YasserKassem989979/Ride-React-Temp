import React, { Component } from 'react'
import {Dialog,DialogContent,TextField,DialogActions,Button,RadioGroup,Radio,FormControl,InputLabel, CircularProgress} from '@material-ui/core';
import { withWidth } from '@material-ui/core';
import styles from "./actionsListener.module.css";
import {translate} from "../../../utils/translate"
import DateFnsUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import axios from "../../../axios"
import Alert from '../../../components/Alert/alert';

const days_format = (day)=>{
  switch (day){
          case "1":
          return "Mon";
          case "2":
          return "Tue"
          case "3":
          return "Wen"
          case "4":
          return "Thu"
          case "5":
          return "Fri"
          case "6":
          return "Sat"
          case "7":
          return "Sun"
          default:
            return "none"

  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export class PriceCardForm extends Component {

    
    state={
        fullWidth:true,
        maxWidth:"md",
        open:true,
        deleteAlert:false,
        values: [{pricing_id: 34,"label":"DISTANCE_CHARGES","value":0,"included":0},
                 {pricing_id: 35,"label":"WAITING_TIME_CHARGES","value":0,"included":0},
                 {pricing_id: 36,"label":"RIDE_TIME_CHARGES","value":0,"included":0}],
        extra_charges:[],
        type:'',
        commision:"",
        base_fare:0,
        time_included:0,
        distance_included:0,
        cashChecked:false,
        WalletChecked:false,
        isLoading:false,
        rate_scope:"",
        service_type:""
    };

    componentDidMount() { 
        const {priceCard} =this.props;
        this.widthChanged();

        if(priceCard){
           // to format the base fares
        let newValues = [...this.state.values];
        
        priceCard.values.forEach((value)=>{
          if(value.pricing_id === 34){
            let  distanceCharge = {...newValues[0]};
            distanceCharge.value = value.price;
            distanceCharge.included = value.included;
            newValues[0] = distanceCharge;
          }else if(value.pricing_id === 35){
            let  waitingCharge = {...newValues[1]};
            waitingCharge.value = value.price;
            waitingCharge.included = value.included;
            newValues[1] = waitingCharge;
          }else if(value.pricing_id === 36) {
            let  rideCharge = {...newValues[2]};
            rideCharge.value = value.price;
            rideCharge.included = value.included;
            newValues[2] = rideCharge;
          }
        });
       
        // to format the extra charges
        let new_extra_charges = priceCard.extra_charges.map(charge=>{
            return{...charge,
              name:charge.name === "وقت الذروة - Peak Time"?"High Demand":"Night",
              end_time: new Date(`2014-08-18T${charge.end_time}:54`),
              start_time:new Date(`2014-08-18T${charge.start_time}:54`),
            week_days:charge.week_days.split(",").map(day=>{
                return {label:days_format(day),
                        value:day,
                        checked:true}
            }),
          id:Math.random()}
        });

        this.setState({
            base_fare:priceCard.summary.base_fare,
            time_included:priceCard.summary.time_included,
            distance_included:priceCard.summary.distance_included,
            values:newValues,
            extra_charges:new_extra_charges,
            type:priceCard.commission.type,
            commision:priceCard.commission.commission,
            cashChecked:priceCard.payment_method.some(value=>value.id === 1),
            WalletChecked:priceCard.payment_method.some(value=>value.id === 3),
            rate_scope:priceCard.summary.rate_scope,
            service_type:priceCard.summary.service_type
          })
        }
    };

    rateScopeServiceTypeChangeHandler = (e) => {
      this.setState({[e.target.name]:e.target.value})
    }

    summaryChangeHandler = (e)=>{
      this.setState({
        [e.target.name]:e.target.value
      })
    }

    changeValuesHandler = (value,index) =>{
      let newValues = [...this.state.values];
      let newValue = {...newValues[index]}
      newValue['value'] = value;
      newValues[index] = newValue
      this.setState({values:newValues})
    }
    changeValuesIncludedHandler= (value,index) =>{
        let newValues = [...this.state.values];
        let newValue = {...newValues[index]}
        newValue['included'] = value;
        newValues[index] = newValue
        this.setState({values:newValues})
    }

    handleWeekDays =(index,insideIndex)=>{
      let new_extra_charges = [...this.state.extra_charges];
      let newCharge = {...new_extra_charges[index]};
      newCharge['week_days'][insideIndex]['checked'] = !newCharge['week_days'][insideIndex]['checked'];
      new_extra_charges[index]=newCharge
      this.setState({extra_charges:new_extra_charges});
    };

    addPeakSlot = () =>{
      let newChargesArray=[...this.state.extra_charges];
      if(newChargesArray.some(value=>value.name==="High Demand")){
        return;
      }
     let slot = {
      charges: "0",
      end_time: new Date(`2014-08-18T23:59:54`),
      name: "High Demand",
      start_time: new Date(`2014-08-18T00:01:54`),
      timing_type: "SAME_DAY",
      type: "MULTIPLIER",
      week_days: "1,2,3,4,5,6,7".split(",").map(day=>{
        return {label:days_format(day),
                value:day,
                checked:true}
    }),
     }
       newChargesArray.push(slot);
       this.setState({extra_charges:newChargesArray})
    }

    addNightSlot = () =>{
      let newChargesArray=[...this.state.extra_charges];
      if(newChargesArray.some(value=>value.name==="Night")){
        return;
      }
     let slot = {
      charges: "0",
      end_time: new Date(`2014-08-18T23:59:54`),
      name: "Night",
      start_time: new Date(`2014-08-18T00:01:54`),
      timing_type: "SAME_DAY",
      type: "MULTIPLIER",
      week_days: "1,2,3,4,5,6,7".split(",").map(day=>{
        return {label:days_format(day),
                value:day,
                checked:true}
    }),
     }
       newChargesArray.push(slot);
       this.setState({extra_charges:newChargesArray})
}

    changeExtraChargesHandler = (e,index) =>{
      let new_extra_charges = [...this.state.extra_charges];
      let newCharge = {...new_extra_charges[index]};
      newCharge[`${e.target.name}`] = e.target.value;
      new_extra_charges[index]=newCharge;
      this.setState({extra_charges:new_extra_charges})
     
    }

    changeExtraChargesStartTimeHandler = (e,index) => {
      let new_extra_charges = [...this.state.extra_charges];
      let newCharge = {...new_extra_charges[index]};
      newCharge[`start_time`] = e;
      new_extra_charges[index]=newCharge;
      this.setState({extra_charges:new_extra_charges})
     
    }

    changeExtraChargesEndTimeHandler = (e,index) => {
      let new_extra_charges = [...this.state.extra_charges];
      let newCharge = {...new_extra_charges[index]};
      newCharge[`end_time`] = e;
      new_extra_charges[index]=newCharge;
      this.setState({extra_charges:new_extra_charges})
     
    }

    handleRadioTypesChange = (e,index)=>{
        let newValues = [...this.state.extra_charges];
        let newCharge = {...newValues[index]};
        newCharge['timing_type'] = e.target.value;
        newValues[index]=newCharge
        this.setState({extra_charges:newValues})
    }

    changeCommisionHandler =(e)=>{
      this.setState({commision:e.target.value})
    };

    handleCommisionTypeChange = (e)=>{
      this.setState({type:e.target.value})
    };

    componentDidUpdate(prevProps) {
        if(prevProps.width !==this.props.width){
            this.widthChanged()
        }
    }

    // ui change handler for the modal width 
    widthChanged = () =>{
        let max="md";
        if(this.props.width!=="xl" && this.props.width!=="lg"){
            max=this.props.width
        };
        this.setState({maxWidth:max})
    }
    
    onClose = () => {
        this.setState({open:false},()=>{
            setTimeout(()=>{
                this.props.onCloseAction(false)
            },10)   
        })
    }

    onSubmitPriceCardForm = () => {
      const {area,priceCard}= this.props;
      const state = this.state;

      let distance_fare="";
      let waiting_time_fare = "";
      let waiting_time_fare_free = "";
      let ride_time_fare = "";

      state.values.forEach(value=>{
        if(value && value.label === "DISTANCE_CHARGES"){
          distance_fare = value.value;
        }else if (value && value.label === "WAITING_TIME_CHARGES"){
          waiting_time_fare = value.value;
          waiting_time_fare_free = value.included
        }else if(value && value.label === "RIDE_TIME_CHARGES"){
          ride_time_fare = value.value;
        }
      })
      let highDeamandCharge =false;
      let highDeamandChargeindex="";
      let NightCharge = false;
      let NightChargeIndex = "";
      state.extra_charges.forEach((value,index)=>{
        if(value.name ==="High Demand"){
          highDeamandCharge =true;
          highDeamandChargeindex = index;
        }else if (value.name ==="Night"){
          NightCharge =true;
          NightChargeIndex = index;
        }  
      });

      let highDeamandChargeWeekDays = [];
      let highDeamandChargeStartTime ="";
      let highDeamandChargeEndTime = "";
      let highDeamandChargeCharge = "";
      let highDeamandChargeTimeType = "";

      let NightChargeWeekDays = [];
      let NightChargeStartTime ="";
      let NightChargeEndTime = "";
      let NightChargeCharge = "";
      let NightChargeTimeType = "";
      
      if(highDeamandCharge){
        let highDeamandChargeSlot= state.extra_charges[highDeamandChargeindex];

        highDeamandChargeSlot.week_days.forEach(day=>{
          if(day.checked){
            highDeamandChargeWeekDays.push(day.value)
          }
        });

        highDeamandChargeStartTime = moment(highDeamandChargeSlot.start_time).format("HH:MM");
        highDeamandChargeEndTime = moment(highDeamandChargeSlot.end_time).format("HH:MM");
        highDeamandChargeCharge = highDeamandChargeSlot.charges;
        highDeamandChargeTimeType = highDeamandChargeSlot.timing_type
      };

      if(NightCharge){
        let NightChargeSlot= state.extra_charges[NightChargeIndex];

        NightChargeSlot.week_days.forEach(day=>{
          if(day.checked){
            NightChargeWeekDays.push(day.value)
          }
        });

        NightChargeStartTime = moment(NightChargeSlot.start_time).format("HH:MM");
        NightChargeEndTime = moment(NightChargeSlot.end_time).format("HH:MM");
        NightChargeCharge = NightChargeSlot.charges;
        NightChargeTimeType = NightChargeSlot.timing_type
      }

      const payment_method =[];

      if(state.cashChecked){
        payment_method.push(1)
      }

      if(state.WalletChecked){
        payment_method.push(3)
      }

      let params = {
        "area":area.summary.id,
        "service":state.service_type,
        "rate_card_scope":state.rate_scope,
        "price_type":1,
        "basefareArray[33]":33,
        "base_fare":state.base_fare,
        "free_distance":state.distance_included,
        "free_time":state.time_included,
        "checkboxArray[34]":34,
        "check_box_values[34]":distance_fare,
        "checkboxArray[35]":35,
        "check_box_values[35]":waiting_time_fare ,
        "checkboxFreeArray[35]":waiting_time_fare_free,
        "checkboxArray[36]":36,
        "check_box_values[36]":ride_time_fare, 
        "checkboxArray[37]":37, 
        "check_box_values[37]":0,
        commission_type: 1, 
        commission_method: 2, 
        percentage_commission: state.commision,
        payment_method: payment_method,
        all_vehile_type: 1,
      }

      if(highDeamandCharge){
        params = { ...params,
          "week_days[0]": highDeamandChargeWeekDays,
          "parametername[0]": "High Demand",
          "begintime[0]":   highDeamandChargeStartTime,
          "endtime[0]": highDeamandChargeEndTime,
          "optradio[0]": highDeamandChargeTimeType,
          "slot_charges[0]": highDeamandChargeCharge,
          "charge_type[0]": "2",
        }
      }

      if(NightCharge){
        params = { ...params,
          "week_days[1]": NightChargeWeekDays,
          "parametername[1]": "Night",
          "begintime[1]":   NightChargeStartTime,
          "endtime[1]": NightChargeEndTime,
          "optradio[1]": NightChargeTimeType,
          "slot_charges[1]": NightChargeCharge,
          "charge_type[1]": "2",
        }
      };

      this.setState({isLoading:true});

      if(this.props.create){
        axios.post(`/price_cards`,{},{
          params
        })
        .then(res=>{
          this.setState({isLoading:false},()=>{
            this.onClose();
            Alert.success("تمت العملية بنجاح")
          })
        })
        .catch(err=>{
          this.setState({isLoading:false})
          Alert.error(err.data?err.data.message:"ERROR")
        });

        return
      }


      axios.put(`/price_cards/${priceCard.summary.id}`,{},{
        params
      })
      .then(res=>{
        this.setState({isLoading:false},()=>{
          this.onClose();
          Alert.success("تمت العملية بنجاح")
        })
      })
      .catch(err=>{
        this.setState({isLoading:false})
        Alert.error(err.data?err.data.message:"ERROR")
      })

    }

    render() {
        const {area}=this.props;
        return (
            <>
            <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.onClose}
            TransitionComponent={Transition}>
                 <AppBar style={{display:"flex",flexDirection:"row"}}>
                 <div className={styles.DialogTitle}>
                    <p>{area.summary.name}</p>
                    <FormControl style={{background:"#FFF",padding:3,borderRadius:3, margin:"3px"}}>
                    <InputLabel htmlFor="rate_scop+fghj">{translate("RATE_SCOPE")}</InputLabel>
                    <Select
                    style={{minWidth:130}}
                    native
                    id="rate_scop+fghj"
                    value={this.state.rate_scope}
                    onChange={this.rateScopeServiceTypeChangeHandler}
                    name="rate_scope"
                                >
                    <option value="" />
                    <option value={1}>INSIDE</option>
                    <option value={2}>OUTSIDE</option>
                    </Select>
                </FormControl>
                        <FormControl style={{background:"#FFF",padding:3,borderRadius:3, margin:"3px"}}>
                          <InputLabel htmlFor="rate_scop+fghjf">{translate("SERVICE_TYPE")}</InputLabel>
                          <Select
                          style={{minWidth:130}}
                          native
                          id="rate_scop+fghjf"
                          value={this.state.service_type}
                          onChange={this.rateScopeServiceTypeChangeHandler}
                          name="service_type"
                                      >
                          <option value="" />
                          <option value={6}>Pink</option>
                          <option value={1}>Normal</option>
                          </Select>
                      </FormControl>
                    </div>
          <Toolbar>
            <IconButton 
            edge="start" 
            color="inherit" 
            onClick={this.onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>    
       {!this.state.isLoading?<DialogContent className={styles.DialogContentWrapper}>
            <div className={styles.DialogContent}>
              <div className={styles.formWrapper}>  
          <TextField
          onChange={this.summaryChangeHandler} 
          style={{margin:'7px 24px'}}
            name="base_fare"
            label={translate('BASE_FARE')}
            type="number"
            value={this.state.base_fare}
          />
           <TextField
           onChange={this.summaryChangeHandler} 
           style={{margin:'7px 24px'}}
            label={translate('DISTANCE_INCLUDED')}
            type="text"
            name="distance_included"
            value={this.state.distance_included}
          />
           <TextField 
           onChange={this.summaryChangeHandler}
           style={{margin:'7px 24px'}}
            label={translate('TIME_INCLUDED')}
            type="text"
            value={this.state.time_included}
            name="time_included"
          />
          </div>
          {this.state.values.map((value,index)=>{
              if(value===null) return null;
              return  <div key={value.label} className={styles.formWrapper}>
              <TextField 
              style={{margin:'7px 24px'}}
              label={value.label}
              type="text"
              value={value.value}
              onChange={(e)=>this.changeValuesHandler(e.target.value,index)}
            />
            <TextField 
            style={{margin:'7px 24px'}}
            key={value.label+"_INCLUDED"}
            label={value.label +"_INCLUDED"}
            type="text"
            value={value.included}
            onChange={(e)=>this.changeValuesIncludedHandler(e.target.value,index)}
          /></div>
          })}
          </div>
          <div className={styles.slotsContainer}>
            <div className={styles.slotsHeader}>
                <div className={styles.titleSlot}>
                    <h4> Night/Peak Time Structure</h4>
                </div>
                <div className={styles.addSlot}>
                    <Button 
                    variant="contained" 
                    color="primary"
                    style={{margin:"3px 5px"}}
                    onClick={this.addNightSlot}>
                        Add Night
                    </Button>
                    <Button 
                    variant="contained" 
                    color="primary"
                    style={{margin:"0 5px"}}
                    onClick={this.addPeakSlot}>
                        Add Day Surge
                    </Button>
                </div>

            </div>
            <div className={styles.slotsForm}>
            {this.state.extra_charges.map((charge,index)=>{
                return <div className={styles.slot} key={charge.pricing_id}> 
                    <div className={styles.weekdays}>
                    <FormGroup row>
                        {charge.week_days.map((day,insideIndex)=>{
                            return  <FormControlLabel
                            key={day.label}
                            control={
                            <Checkbox 
                            checked={day.checked} 
                            onChange={()=>this.handleWeekDays(index,insideIndex)} 
                            value={day.value} />
                            }
                            label={day.label}
                        />
                        })}
                       
                        </FormGroup>
                    </div>
                    <div className={styles.datePakers}> 
                    <TextField 
                    style={{margin:'5px 0'}}
                    label={translate("NAME")}
                    type="text"
                    value={charge.name}
                    name="name"
                    onChange={(e)=>this.changeExtraChargesHandler(e,index)}
                  />
              <MuiPickersUtilsProvider key={Math.random()} utils={DateFnsUtils}>
                <KeyboardTimePicker
                  key={Math.random()}
                  margin="normal"
                  label={translate('START_TIME')}
                  name="start_time"
                  value={charge.start_time}
                  onChange={(e)=>this.changeExtraChargesStartTimeHandler(e,index)}
                />
                <KeyboardTimePicker
                key={Math.random()}
                  margin="normal"
                  label={translate('END_TIME')}
                  name="end_time"
                  value={charge.end_time}
                  onChange={(e)=>this.changeExtraChargesEndTimeHandler(e,index)}
                />
            </MuiPickersUtilsProvider>
            <TextField 
                style={{margin:'5px 0'}}
                label={translate("CHARGES")}
                type="text"
                value={charge.charges}
                onChange={(e)=>this.changeExtraChargesHandler(e,index)}
                name="charges"
              />
                </div>
                <div>
                        
                <RadioGroup 
                value={charge.timing_type} 
                onChange={(e)=>this.handleRadioTypesChange(e,index)} 
                row>
                <FormControlLabel
                value="SAME_DAY"
                control={<Radio color="primary" />}
                label="SAME_DAY"
                labelPlacement="start"
                />
                 <FormControlLabel
                value="NEXT_DAY"
                control={<Radio color="primary" />}
                label="NEXT_DAY"
                labelPlacement="start"
                />
                </RadioGroup>
                </div>
                        
          </div>
            })}
            
            </div>

            <div className={styles.CommissionForm}>
            <TextField 
                style={{margin:'7px 5px'}}
                    name="base_fare"
                    label={translate('Enter Commission')}
                    type="number"
                    onChange={this.changeCommisionHandler}
                    value={this.state.commision}
                />
                 <FormControl style={{margin:"3px 0"}}>
                    <InputLabel htmlFor="age-native-simple">commision type</InputLabel>
                    <Select
                    style={{minWidth:130}}
                    native
                    id="age-native-simple"
                    value={this.state.type}
                    onChange={this.handleCommisionTypeChange}
                                >
                    <option value="" />
                    <option value={'PREPAID'}>Prepaid</option>
                    <option value={'POSTPAID'}>Postpaid</option>
                    </Select>
                </FormControl>

                <FormControlLabel
                            control={
                            <Checkbox 
                            checked={this.state.cashChecked} 
                            onChange={()=>this.setState({cashChecked:!this.state.cashChecked})} 
                            value={1} />
                            }
                            label={"Cash"}
                        />

                <FormControlLabel
                            control={
                            <Checkbox 
                            checked={this.state.WalletChecked} 
                            onChange={()=>this.setState({WalletChecked:!this.state.WalletChecked})} 
                            value={3} />
                            }
                            label={"Wallet"}
                        />
               
            </div>
          </div>
        </DialogContent>:
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:70,flexGrow:1,flexDirection:"column",width:"100%"}}>
          <CircularProgress />
        </div>}
        <DialogActions>
          <Button 
          onClick={this.onClose} 
          color="primary"
          variant="contained">
            Cancel
          </Button>
          <Button 
          onClick={this.onSubmitPriceCardForm} 
          color="primary"
          variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
            </>
        )
    }
}

export default withWidth()(PriceCardForm);
