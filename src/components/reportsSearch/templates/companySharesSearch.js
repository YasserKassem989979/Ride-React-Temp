import React, { Component } from 'react'
import styles from "../advance.module.css"
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/moment';
import { InputLabel, Button,Paper, Tooltip,FormControl,MenuItem,Select} from '@material-ui/core';
import Popover from '@material-ui/core/Popover';
import {translate} from "../../../utils/translate"
import ClearAllIcon from '@material-ui/icons/ClearAll';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HasPermissionToExtract from "../hasPermissionToExtract"


export class DriverClaimsSearch extends Component {

    initialState={
        date_from:new Date('October 28, 2019'),
        date_to:new Date(),
        flage:false,
        full_name:"",
        phone:"",
        trip_id:"",
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

    // to clear all filters for search operations
    clearFilters = ()=>{
        this.setState({...this.initialState},()=>{
                this.submitQuickFiltersAndSearch(true)
        })
      }


    // for quick search (chips search)
    submitQuickFiltersAndSearch =(clear)=>{
        if(clear){
            this.props.search(null,"clear")
            return
        }

        let quickFilters = {
            full_name:this.state.full_name,
            phone:this.state.phone,
            trip_id:this.state.trip_id,
            limit:this.state.limit
        };
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

       let advanceIcon =( <InputAdornment position="end">
                                <IconButton aria-describedby={"simple-popover"} onClick={this.handleSearchMenuClick}>
                                <ArrowDownwardIcon />
                                </IconButton>
                            </InputAdornment>)
        
        return (
            <>
            <div className={styles.inputsText}>
            <TextField
            onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitQuickFiltersAndSearch()}}}
            disabled={Boolean(this.state.phone) || Boolean(this.state.trip_id)}
            name="full_name"
            variant="outlined"
            InputProps={{endAdornment:advanceIcon}}
            onChange={this.changeTextHandler}
            value={this.state.full_name}
            className={styles.formControl}
            placeholder="بحث بالاسم">
             </TextField>
             <TextField
             onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitQuickFiltersAndSearch()}}}
             disabled={Boolean(this.state.full_name) || Boolean(this.state.trip_id)}
            className={styles.formControl}
             name="phone"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.phone}
            placeholder="بحث برقم الهاتف"
            >
            </TextField>
            <TextField
             onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitQuickFiltersAndSearch()}}}
             disabled={Boolean(this.state.full_name) || Boolean(this.state.phone) }
            className={styles.formControl}
             name="trip_id"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.trip_id}
            placeholder="بحث برقم الرحلة"
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


export default DriverClaimsSearch;
