import React, { Component } from 'react'
import styles from "../advance.module.css"
import {  Button, Tooltip,FormControl,Select,MenuItem} from '@material-ui/core';
import {translate} from "../../../utils/translate"
import ClearAllIcon from '@material-ui/icons/ClearAll';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import TextField from '@material-ui/core/TextField';
import axios from "../../../axios"
import Alert from '../../Alert/alert';
import HasPermissionToExtract from "../hasPermissionToExtract"

// for styling the items of the menu
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



export class VehiclesReportSearch extends Component {

    initialState={
        full_name:"",
        phone:"",
        vehicle_number:"",
        vehicle_make:'',
        vehicle_model:"",
        anchorElement:null,
        labelWidth:0,
        make_id:"",
        models:[]
    }
    
    state={
        ...this.initialState,
        makes:[],
    };

    componentDidMount() {
        this.getMakes()
    }
    

    // to get the make types of available cars
    getMakes = () => {
        axios.get("vehicles/makes")
        .then(res=>{
            this.setState({
                makes:res.data
            });
        })
        .catch(err=>{
            Alert.error("error")
        })
    }

    // to get models of specific make
    getModels = () =>{
        const id = this.state.make_id
        axios.get("vehicles/models/" + id )
        .then(res=>{
            this.setState({
                models:res.data
            });
        })
        .catch(err=>{
            Alert.error("error")
        })
    }



    // to handle the change in text field
    changeTextHandler = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    // to clear all filters for search operations
    clearFilters = ()=>{
        this.setState({...this.initialState},()=>{
                this.submitQuickFiltersAndSearch() 
            })
      }

     // for full filters search (quick filter and full filter)
    submitFiltersAndSearch=()=>{
        let filter = this.state
        this.props.search(filter,false);
    };

    // for quick search (chips search)
    submitQuickFiltersAndSearch =()=>{
        this.props.search(null,"clear")
    }

    changeMakeHandler = (e) => {
        const id = e.target.value;
        let make_name= "";
        this.state.makes.forEach(make=>{
            if(make.id===id){
                make_name = make.name
            }
        })
        this.setState({vehicle_make:make_name,make_id:id},()=>{
            this.getModels()
        })
    }
    //////////////////////////////////////////////////////////////////////////////
                        //render//
    //////////////////////////////////////////////////////////////////////////////
    render() {
        
        return (
            <>
            <div className={styles.inputsText}>
            <TextField
            onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitFiltersAndSearch()}}}
            disabled={Boolean(this.state.phone)}
            className={styles.formControl}
            name="full_name"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.full_name}
            placeholder="بحث بالاسم">
             </TextField>
             <TextField
             onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitFiltersAndSearch()}}}
             disabled={Boolean(this.state.full_name)}
             className={styles.formControl}
             name="phone"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.phone}
            placeholder="بحث برقم الهاتف"
            >
            </TextField>
            <TextField
            onKeyPress={(e)=>{if(e.key === 'Enter'){this.submitFiltersAndSearch()}}}
            className={styles.formControl}
             name="vehicle_number"
            variant="outlined"
            onChange={this.changeTextHandler}
            value={this.state.vehicle_number}
            placeholder="بحث برقم المركبة"
            >
            </TextField>
            <FormControl variant="outlined" className={styles.formControl}>
                    <Select
                    displayEmpty
                    MenuProps={MenuProps}
                    value={this.state.make_id}
                    onChange={(this.changeMakeHandler)}
                    >
                        <MenuItem disabled value="">
                            <p style={{margin:"0 4px"}}>نوع المركبة</p>
                        </MenuItem>
                    {this.state.makes.map(make=>{
                        return <MenuItem 
                        key={make.id} 
                        value={make.id}
                        style={{margin:"7px 0"}}>{make.name}</MenuItem>
                    })}
                    </Select>
            </FormControl>
            <FormControl variant="outlined" className={styles.formControl}>
                    <Select
                    displayEmpty
                    MenuProps={MenuProps}
                    value={this.state.vehicle_model}
                    onChange={this.changeTextHandler}
                    name="vehicle_model"
                    >
                        <MenuItem disabled value="">
                            <p style={{margin:"0 4px"}}>موديل المركبة</p>
                        </MenuItem>
                    {this.state.models.map(make=>{
                        return <MenuItem 
                        key={make.id} 
                        value={make.name}
                        style={{margin:"7px 0"}}>{make.name}</MenuItem>
                    })}
                    </Select>
                    </FormControl>
            <Button
            onClick={this.submitFiltersAndSearch}
            style={{maxHeight:40,alignSelf:"center"}}
            variant="contained"
            color="primary">
                {translate("SEARCH")}
            </Button>
            </div>
            <div className={styles.badgesFilter}>
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
            <HasPermissionToExtract id={this.props.id}/>
            </div>
            </div>
          
            </>
        )
    }
}


export default VehiclesReportSearch;
