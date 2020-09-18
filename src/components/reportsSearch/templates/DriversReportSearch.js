import React, { Component } from 'react'
import styles from "../advance.module.css"
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { InputLabel, Button,Paper,Chip, Tooltip,FormControl,MenuItem,Select} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Popover from '@material-ui/core/Popover';
import {translate} from "../../../utils/translate"
import ClearAllIcon from '@material-ui/icons/ClearAll';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HasPermissionToExtract from "../hasPermissionToExtract"


// I dont know why is this (but material ui need it, sometimes I am lazy to read)
const valuetext = (value)=> {
    return `${value}*`;
  }


export class DriversAdvanceSearch extends Component {

    initialState={
        rate:[1,5],
        status:"",
        date_from:new Date('October 28, 2019'),
        date_to:new Date(),
        Colors:["default","default","default"],
        chipsFilters:[
            {key:0,label:translate("REJECTED"),value:"REJECTED",disabled:false},
            {key:1,label:translate("APPROVED"),value:"APPROVED",disabled:false},
            {key:2,label:translate("PENDING"),value:"PENDING",disabled:false}],
        flage:false,
        full_name:"",
        phone:"",
        anchorElement:null,
        limit:0,
        dateChanged:false
    }
    
    state={...this.initialState};

      // to select wich element will be the anchor for search filters menu
      handleSearchMenuClick = (event)=>{
        this.setState({anchorElement:event.currentTarget})
    }

    handleClose = ()=>{
        this.setState({anchorElement:null})
    }

    // to handle the change in text field
    changeTextHandler = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    handleLimitChange= (e) =>{
        this.setState({limit:e.target.value})
    }

    handleDateFromChange = date => {
        this.setState({date_from:date,dateChanged:true});
      };

    handleDateToChange = date => {
        this.setState({date_to:date,dateChanged:true});
     };

    handleRateChange = (event, newValue)=>{
        this.setState({rate:newValue})
      }

    // to clear all filters for search operations
    clearFilters = ()=>{
        this.setState({...this.initialState,
            chipsFilters :[
                {key:0,label:translate("REJECTED"),value:"REJECTED",disabled:false},
                {key:1,label:translate("APPROVED"),value:"APPROVED",disabled:false},
                {key:2,label:translate("PENDING"),value:"PENDING",disabled:false},
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
      
        // to check wich chips for gender is checked
        const newBadgesArray = [...this.state.chipsFilters]
        let status = this.state.status
        if(item.value ==="REJECTED"){
            newBadgesArray[1]["disabled"]= true
            newBadgesArray[2]["disabled"]= true
            status = item.value
        }
        if( item.value ==="APPROVED" ){
            newBadgesArray[0]["disabled"]= true
            newBadgesArray[2]["disabled"]= true
            status = item.value
        }
        if( item.value ==="PENDING"){
            newBadgesArray[0]["disabled"]= true
            newBadgesArray[1]["disabled"]= true
            status = item.value
        }
        this.setState({
            chipsFilters:newBadgesArray,
            status
            },()=>{
                this.submitQuickFiltersAndSearch()
            })
     };

     // to handle uncheck the chips(the quick filters)
     handleChipDelete = (item,id)=>{
        // to check wich chip color should i change  
        const colorsOfChips = [...this.state.Colors];
        colorsOfChips[item.key] ="default"
        this.setState({Colors:colorsOfChips})

        // to check wich chips for gender is checked (don't be mad :p )
        const newBadgesArray = [...this.state.chipsFilters]
        let status = this.state.status
        let flag = false

        if(item.value ==="REJECTED" || item.value ==="APPROVED" || item.value ==="PENDING"){
            status = "";
            newBadgesArray[0]["disabled"]= false
            newBadgesArray[1]["disabled"]= false
            newBadgesArray[2]["disabled"]= false
        }


            // to check if something changed to invoke the search function
        if(status !==this.state.status){
            flag =true
        }

        this.setState({
            chipsFilters:newBadgesArray,
            status
            },()=>{
                if(flag){
                    this.submitQuickFiltersAndSearch()
                }
            })
     }

    // for quick search (chips search)
    submitQuickFiltersAndSearch =(clear)=>{
        if(clear){
            this.props.search(null,"clear")
            return
        }

        let quickFilters = {
            status:this.state.status,
            full_name:this.state.full_name,
            phone:this.state.phone,
            rate:this.state.rate,
            limit:this.state.limit
        }
        if(this.state.dateChanged){
            quickFilters = this.state
        }
        this.props.search(quickFilters);
        this.handleClose();
    }


    //////////////////////////////////////////////////////////////////////////////
                        //render//
    //////////////////////////////////////////////////////////////////////////////
    render() {
       // quick filters for riders
       let badgesArray = this.state.chipsFilters;
        

       let advanceIcon =( <InputAdornment position="end">
                                <IconButton aria-describedby={"simple-popover"} onClick={this.handleSearchMenuClick}>
                                <ArrowDownwardIcon />
                                </IconButton>
                            </InputAdornment>)

        let ridersBadgesFilters = (
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
            <div className={styles.inputsText}>
            <TextField
            onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitQuickFiltersAndSearch()}}}
            disabled={Boolean(this.state.phone)}
            name="full_name"
            variant="outlined"
            InputProps={{endAdornment:advanceIcon}}
            onChange={this.changeTextHandler}
            value={this.state.full_name}
            placeholder="بحث بالاسم">
             </TextField>
             <TextField
             onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitQuickFiltersAndSearch()}}}
             disabled={Boolean(this.state.full_name)}
            style={{margin:"0 15px"}}
             name="phone"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.phone}
            placeholder="بحث برقم الهاتف"
            >
            </TextField>
            <Button
            onClick={()=>this.submitQuickFiltersAndSearch()}
            style={{maxHeight:40,alignSelf:"center"}}
            variant="contained"
            color="primary">
                {translate("SEARCH")}
            </Button>
            </div>
            <div className={styles.badgesFilter}>
                <div style={{display:"flex",flexWrap:"wrap"}}>
                {ridersBadgesFilters}
                </div>
                <div style={{margin:"0 70px"}}>
                <FormControl className={styles.formControl}>
                <Select
                value={this.state.limit}
                onChange={this.handleLimitChange}
                >
                <MenuItem value={0}>{translate("LIMIT")}</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={10000}>{translate("ALL")}</MenuItem>
                </Select>
            </FormControl>
                </div>
            <div style={{display:"flex"}}>
                <Tooltip title={translate("clearFilters")}>
                 <IconButton onClick={this.clearFilters}>
                     <ClearAllIcon/>
                 </IconButton>
                </Tooltip>
                <Tooltip title={translate("refresh")}>
            <IconButton onClick={()=>this.submitQuickFiltersAndSearch()}>
                <RefreshIcon/>
            </IconButton>
            </Tooltip>
            <HasPermissionToExtract id={this.props.id}/>
            </div>
            </div>
            <Popover
            id={"simple-popover"}
            open={Boolean(this.state.anchorElement)}
            anchorEl={this.state.anchorElement}
            onClose={this.handleClose} 
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
            <div className={styles.container}>
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
                <div className={styles.rateingContainer}>
                        <div>
                        <InputLabel style={{fontSize:18,fontWeight:"600",marginTop:0,color:"#000"}} shrink id="demo-simple-select-label">{translate("RATING")}:</InputLabel>
                        </div>
                            <div style={{width:"200px",marginTop:10}}>
                             <Slider
                                max={5}
                                min={1}
                                value={this.state.rate}
                                onChange={this.handleRateChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext}  
                            />
                            </div>
                </div>
              
                <div className={styles.Button}>
                    <Button 
                    variant="contained" 
                    color="secondary"
                        onClick={()=>this.submitQuickFiltersAndSearch()}> {translate("SEARCH")}</Button>
                </div>
            </div>
            </Paper>
            </Popover>
            </>
        )
    }
}


export default DriversAdvanceSearch;
