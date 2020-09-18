import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RidersAdvanceSearch from "./templates/RidersDriversAdvancedSearch"
import { connect } from "react-redux"
import TripsAdvanceSearch from "./templates/tripsAdvanceSearch"
import VehiclesAdvancedSearch from "./templates/VehiclesAdvancedSearch"



export class Search extends Component {

        state={
            anchorElement:null,
            text:"",
            data:null
        }
    
     // to select wich element will be the anchor for search filters menu
    handleSearchMenuClick = (event)=>{
        this.setState({anchorElement:event.currentTarget})
    }

    handleClose = ()=>{
        this.setState({anchorElement:null})
    }

    // to handle the change in text field
    changeTextHandler = (e) => {
        this.setState({text:e.target.value})
    }

    // on search submit
    search = (data,clear, sort) =>{
        // if there is filters, get all filters and send them to the containers  
        this.setState({data},()=>{
            if(data){
                const fullData = {...this.state.data,text:this.state.text.trim()}
                this.props.submitsearch(fullData,true, sort);
                return
            }else if(clear==="clear"){
                // if it is clear filters operations ,clear all filters :P
                this.setState({text:""})
                this.props.submitsearch({},true, sort)
                return
            }else{
                // if its normal search send the text as it
                this.props.submitsearch({text:this.state.text.trim()},true, sort)
            }
        });       
   
    }


    
     

    // template
    render() {
        const advanced = this.props.advanced;
        let advanceIcon = null;

        
        
        if(advanced){
            advanceIcon =( <InputAdornment position="end">
            <IconButton aria-describedby={"simple-popover"} onClick={this.handleSearchMenuClick}>
            <ArrowDownwardIcon />
           </IconButton>
        </InputAdornment>)
        }
       
        return (
          <>
        <TextField
            onKeyPress={(e)=>{if(e.key === 'Enter'){this.search(this.state.data,false)}}}
            variant="outlined"
            InputProps={{endAdornment:advanceIcon}}
            onChange={this.changeTextHandler}
            value={this.state.text}
            {...this.props.inputProps}>
        </TextField>
        {advanced ==="riders" ||advanced ==="drivers"? <RidersAdvanceSearch
                    id={advanced}
                    search={this.search}
                    anchorElement={Boolean(this.state.anchorElement)}
                    anchorEl={this.state.anchorElement}
                    handleClose={this.handleClose}
                    direction={this.props.direction}/>:null}
        {advanced ==="trips" ? <TripsAdvanceSearch
                    id={advanced}
                    search={this.search}
                    anchorElement={Boolean(this.state.anchorElement)}
                    anchorEl={this.state.anchorElement}
                    handleClose={this.handleClose}
                    direction={this.props.direction}/>:null}
        {advanced ==="vehicles" ? <VehiclesAdvancedSearch
                    id={advanced}
                    search={this.search}
                    anchorElement={Boolean(this.state.anchorElement)}
                    anchorEl={this.state.anchorElement}
                    handleClose={this.handleClose}
                    direction={this.props.direction}/>:null} 
                    
     
          </>
        )
    }
}


const mapStateToProps = (state)=>{
    return{
        direction:state.userPrefrence.direction
    }
}

export default connect(mapStateToProps)(Search)
