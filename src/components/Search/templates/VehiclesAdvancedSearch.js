import React, { Component } from 'react'
import styles from "../advance.module.css"
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { MenuItem, Select, InputLabel, Button,Paper,Chip, Tooltip} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import {translate} from "../../../utils/translate"
import ClearAllIcon from '@material-ui/icons/ClearAll';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

export class VehiclesAdvancedSearch extends Component {
    initialState={
        verification_status:"",
        service_type:"",
        date_from:new Date('October 28, 2019'),
        date_to:new Date(),
        Colors:["default","default","default"],
        chipsFilters:[
            {key:0,label:translate("APPROVED"),value:"APPROVED",disabled:false},
            {key:1,label:translate("PENDING"),value:"PENDING",disabled:false},
            {key:2,label:translate("REJECTED"),value:"REJECTED",disabled:false},
        ],
        flage:false,
        changed:false
    }
    
    state={...this.initialState};

    // handlers
    
    handleDateFromChange = date => {
            
        this.setState({date_from:date,changed:true});
      };

    handleDateToChange = date => {
        this.setState({date_to:date,changed:true});
     };

      handleStatusChange = event => {
            
        this.setState({service_type:event.target.value,changed:true});
      };
      //////////////////////////////////////

    // to clear all filters for search operations
    clearFilters = ()=>{
        this.setState({...this.initialState,
            chipsFilters : [
                {key:0,label:translate("APPROVED"),value:"APPROVED",disabled:false},
                {key:1,label:translate("PENDING"),value:"PENDING",disabled:false},
                {key:2,label:translate("REJECTED"),value:"REJECTED",disabled:false},
            ]},()=>{
                this.submitQuickFiltersAndSearch(true)
        })
        
      }

     // to handle the quick filters 
    handleChipClick = (item,id) => {
        // to check wich chip color should i change  
        const colorsOfChips = [...this.state.Colors];
        colorsOfChips[item.key] ="primary"
        this.setState({Colors:colorsOfChips})
        ///////////////////////////////////////////////////////////////
      

        // to check wich chips for gender is checked
        const newBadgesArray = [...this.state.chipsFilters]
        let verification_status=this.state.verification_status;
        if(item.value ==="APPROVED" ){
            newBadgesArray[1]["disabled"]= true
            newBadgesArray[2]["disabled"]= true
            verification_status = item.value
        }
        if(item.value ==="PENDING"){
            newBadgesArray[0]["disabled"]= true
            newBadgesArray[2]["disabled"]= true
            verification_status = item.value
        }
        if(item.value ==="REJECTED"){
            newBadgesArray[0]["disabled"]= true
            newBadgesArray[1]["disabled"]= true
            verification_status = item.value
        }
        
        this.setState({
            chipsFilters:newBadgesArray,
            verification_status
            },()=>{
                this.submitQuickFiltersAndSearch()
            })
        ////////////////////////////////////////////////////
     };

     // to handle uncheck the chips(the quick filters)
     handleChipDelete = (item,id)=>{
        // to check wich chip color should i change  
        const colorsOfChips = [...this.state.Colors];
        colorsOfChips[item.key] ="default"
        this.setState({Colors:colorsOfChips})
        ///////////////////////////////////////////////////////////////
      

        // to check wich chips for gender is checked (don't be mad :p )
        const newBadgesArray = [...this.state.chipsFilters]
        let verification_status=this.state.verification_status;
        let flag = false
       
        if(item.value ==="APPROVED"){
            verification_status = "";
            newBadgesArray[1]["disabled"]= false    
            newBadgesArray[2]["disabled"]= false 
        }
        if(item.value ==="PENDING"){
            newBadgesArray[0]["disabled"]= false
            newBadgesArray[2]["disabled"]= false
            verification_status =""
        }
        if(item.value ==="REJECTED"){
            newBadgesArray[0]["disabled"]= false
            newBadgesArray[1]["disabled"]= false
            verification_status =""
        }

            // to check if something changed to invoke the search function
        if(verification_status !== this.state.verification_status){
            flag =true
        }

        this.setState({
            chipsFilters:newBadgesArray, 
            verification_status
            },()=>{
                if(flag){
                    this.submitQuickFiltersAndSearch()
                }
            })
     ////////////////////////////////////////////////////

     }

     // for full filters search (quick filter and full filter)
    submitFiltersAndSearch=()=>{
        let filter = {
            verification_status:this.state.verification_status,
        };
        if(this.state.changed){
            filter = this.state
        }
        this.props.search(filter,false);
        this.props.handleClose()
       
    };

    // for quick search (chips search)
    submitQuickFiltersAndSearch =(clear)=>{
        if(clear){
            this.props.search(null,"clear")
            return
        }

        let quickFilters = {
            verification_status:this.state.verification_status,
        }

        if(this.state.changed){
            quickFilters = this.state
        }

        this.props.search(quickFilters)
    }

    render() {
        let badgesArray = this.state.chipsFilters;
        
        let tripsBadgesFilters = (
            <>
            {badgesArray.map(item=>{
                return  <Chip
                        key={item.key}
                        onDelete={()=>this.handleChipDelete(item,this.props.id)}
                        disabled={item.disabled}
                        classes={{root:styles.badge}}
                        label={item.label} 
                        color={this.state.Colors[item.key]}
                        onClick={()=>this.handleChipClick(item,this.props.id)}
                        />
            })}
        
            </>)
        return (
            <>
            <div className={styles.badgesFilter}>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                {tripsBadgesFilters}
                </div>
            <div style={{display:"flex"}}>
                <Tooltip title={translate("clearFilters")}>
                 <IconButton onClick={this.clearFilters}>
                     <ClearAllIcon/>
                 </IconButton>
                </Tooltip>
                <Tooltip title={translate("refresh")}>
            <IconButton onClick={this.submitFiltersAndSearch}>
                <RefreshIcon/>
            </IconButton>
            </Tooltip>
            </div>
            </div>
            <Popover
            id={"simple-popover"}
            open={Boolean(this.props.anchorElement)}
            anchorEl={this.props.anchorEl}
            onClose={this.props.handleClose} 
            anchorOrigin={{
            vertical: 'bottom',
            horizontal:this.props.direction ==="ltr" ?"right":"left" ,
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: this.props.direction ==="ltr" ?"right":"left" ,
            }}
            >
                 <Paper style={{padding:10,...this.props.modalStyle}}>
            <div className={styles.container} style={{minHeight:200,minWidth:200}}>
            <div className={styles.rateingContainer}>
                        <div style={{paddingTop:14}}>
                        <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink >{translate("FROM")}:</InputLabel>
                        </div>
                   
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        
                        <KeyboardDatePicker
                            style={{maxWidth:201}}
                            disableToolbar
                            variant="inline"
                            format="DD-MM-YYYY"
                            margin="normal"
                            id="date-picker-inline"
                            value={this.state.date_from}
                            onChange={this.handleDateFromChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className={styles.rateingContainer}>
                        <div style={{paddingTop:14}}>
                        <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink >{translate("TO")}:</InputLabel>
                        </div>
                    
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                             <KeyboardDatePicker
                              style={{maxWidth:201}}
                            disableToolbar
                            variant="inline"
                            format="DD-MM-YYYY"
                            margin="normal"
                            value={this.state.date_to}
                            onChange={this.handleDateToChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            />
                        </MuiPickersUtilsProvider>
                  
                    
                </div>
                    <div className={styles.rateingContainer} style={{justifyContent:"space-evenly"}}>
                            <div style={{paddingTop:14}}>
                            <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink >{translate("STATUS")}:</InputLabel>
                            </div>
                            <Select
                                value={this.state.service_type}
                                onChange={this.handleStatusChange}
                                style={{minWidth:200}}
                            >
                                
                            <MenuItem value={"Normal"}>Normal</MenuItem>
                            <MenuItem value={"PINK"}>Pink</MenuItem>
                            </Select>
                    </div>
              
                <div className={styles.Button}>
                    <Button 
                    variant="contained" 
                    color="secondary"
                        onClick={()=>this.submitFiltersAndSearch(false)}> {translate("SEARCH")}</Button>
                </div>
            </div>
            </Paper>
            </Popover>
            </>
        )
    }
}



export default VehiclesAdvancedSearch
