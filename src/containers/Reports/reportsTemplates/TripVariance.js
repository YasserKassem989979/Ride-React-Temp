import React, { Component } from 'react'
import Search from "../../../components/reportsSearch/SearchContainer";
import styles from "../Reports.module.css";
import { translate } from '../../../utils/translate';
import Grow from '@material-ui/core/Grow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "../../../axios";
import moment from 'moment';
import { CircularProgress,Button } from '@material-ui/core';
import Alert from '../../../components/Alert/alert';
import native from "axios";
import fileDownload from "js-file-download";
// to create cancel Token 
const CancelToken = native.CancelToken;
let cancel;


export class TripVariance extends Component {
    state ={
        trips:[],
        isLoading:false,
        hasMore:true,
        currentPage:1,
        filter:{},
        total:"",
        isLoadingReportExcel:false
    };

    componentDidMount() {
        this.search()
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.id !== prevProps.id){
            this.search({},true)
        }
    }
    

  // to search in trips W/O filters  
  search = (data={},search)=>{
    const {report_link} = this.props;
    // if there is more data and is not a new search operation don't do any thing
    if(!this.state.hasMore && !search){
        return
    }
    // filter
    let filter={};
    if(data.driver_name){
        filter.driver_name = data.driver_name
    }
    if(data.rider_name){
        filter.rider_name = data.rider_name 
    }
    if(data.driver_phone){
        filter.driver_phone = data.driver_phone
    }
    if(data.date_from){
        filter.date_from = moment(data.date_from).format("YYYY-MM-DD")
    }
    if(data.date_to){
        filter.date_to = moment(data.date_to).format("YYYY-MM-DD")
    }
    if(data.driver_city){
        filter.driver_city = data.driver_city
    }
    if(data.trip_id){
        filter.trip_id = data.trip_id
    }
    if(data.vehicle_number){
        filter.vehicle_number = data.vehicle_number
    }
    //////////////
    // if it is search operation, take the new filter
    if(search){
        this.setState({filter})
    }
   
    this.setState({
        isLoading:true,
        hasMore:search?false:this.state.hasMore,
        currentPage:search ? 1 :this.state.currentPage, //is search operation reset the current page and the trips array
        trips:search?[]:this.state.trips},
        ()=>{
        axios.get(`${report_link}?page=${this.state.currentPage}`,{
            params:{
                filters:this.state.filter,
                limit: data.limit || undefined

            },
            cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
              })
        })
       .then(res=>{
        this.setState({
            trips:this.state.trips.concat(res.data.data),
            isLoading:false,
            hasMore:this.state.currentPage < res.data.last_page,
            currentPage:this.state.currentPage + 1,
            total:res.data.total
        })
       })
       .catch(err=>{
        this.setState({isLoading:false});
        Alert.error(err.data?err.data.message:err.message?err.message:"ERROR");
       })
    });
   
}


        // to cancel request 
    cancelRequest = () => {
            cancel(translate("CANCELD_BY_USER"));
    };

    extractReport =() =>{
        const {direction,report_excel} = this.props;
        this.setState({isLoadingReportExcel:true});
        let columns = [
            {"caption": ("RIDER"), "align": "center"},
            {"caption": ("USER_NUMBER"), "align": "center"},
            {"caption": ("USER_EMAIL"), "align": "center", "width" : 40},
            {"caption": ("USER_GENDER"), "align": "center"},
            {"caption": ("USER_CITY"), "align": "center"},
            {"caption": ("DRIVER_NAME"), "align": "center"},
            {"caption": ("DRIVER_GENDER"), "align": "center"},
            {"caption": ("DRIVER_CITY"), "align": "center"},
            {"caption": ("DRIVER_PHONE"), "align": "center"},
            {"caption": ("DRIVER_EMAIL"), "align": "center"},
            {"caption": ("VEHICLE_NUMBER"), "align": "center"},
            {"caption": ("VEHICLE_MAKE"), "align": "center"},
            {"caption": ("VEHICLE_MODEL"), "align": "center"},
            {"caption": ("VEHICLE_TYPE"), "align": "center"},
            {"caption": ("TRIP_DATE"), "align": "center"},
            {"caption": ("PICK_UP"), "align": "center"},
            {"caption": ("DROP_LOCATION"), "align": "center"}];

            if(this.props.id === "trips_variance") {
                let varinaceFields = [
                    {"caption": ("ACTUAL_BILL"), "align": "center"},
                    {"caption": ("ESTIMATE_BILL"), "align": "center"},
                    {"caption": ("ACTUAL_DISTANCE"), "align": "center", "width" : 40},
                    {"caption": ("ESTIMATE_DISTANCE"), "align": "center"},
                    {"caption": ("ACTUAL_TIME"), "align": "center"},
                    {"caption": ("ESTIMATE_TIME"), "align": "center"},
                   ]
                   varinaceFields.forEach(ele=>{columns.push(ele)})
            }

            if(this.props.id === "trips_time") {
                let varinaceFields = [
                    {"caption": ("TOTAL_AMOUNT"), "align": "center"},
                    {"caption": ("ACCEPT_DATETIME"), "align": "center"},
                    {"caption": ("ARRIVE_DATETIME"), "align": "center", "width" : 40},
                    {"caption": ("START_DATETIME"), "align": "center"},
                    {"caption": ("END_DATETIME"), "align": "center"},
                   ]
                   varinaceFields.forEach(ele=>{columns.push(ele)})
            }

        let params={
         title :translate("TRIPS"),
         columns : JSON.stringify(columns),
         rtl : direction === "rtl"? 1 : 0,
         filters: this.state.filter
        }


            axios.get(report_excel,{
                params,
                responseType:"blob",
                headers:{
                    'Accept': 'application/octet-stream'
                }
            })
            .then(res =>{
                // to create blob and save it 
                fileDownload(new Blob([res.data]), 'trips-report.xlsx');
                this.setState({isLoadingReportExcel:false});
            })
            .catch(err=>{
                this.setState({isLoadingReportExcel:false})
                Alert.error(err.data?err.data.message:err.message?err.message:"ERROR");
            })

    }

    render() {
        const {id} = this.props
        return (
            <Grow in={true}>
            <div className={styles.reportWrapper}>
                <div>
                <Search
                isLoadingReportExcel={this.state.isLoadingReportExcel}
                extractReport={this.extractReport}
                advanced="trips"
                submitsearch={this.search}
                />
                </div>
               {this.state.trips.length>0?<div>
               <Paper className={styles.paper}>
               <InfiniteScroll
                        dataLength={this.state.trips.length} 
                        next={()=>this.search(this.state.filter,false)}
                        hasMore={this.state.hasMore}
                        loader={this.state.trips.length>0?<div style={{textAlign:"center",padding:3}}><CircularProgress size={20} /></div>:null}
                        height={700}
                        endMessage={
                            !this.state.isLoading?<p style={{textAlign: 'center'}}>
                            <b>{translate("NO_MORE_DATA")}</b>
                        </p>:null
                        }>
                    <Table stickyHeader size="small" className={styles.table} >
                    <TableHead>
                        <TableRow>
                        <TableCell>{translate("RIDER")}</TableCell>
                        <TableCell>{translate("USER_NUMBER")}</TableCell>
                        <TableCell>{translate("USER_EMAIL")}</TableCell>
                        <TableCell>{translate("USER_GENDER")}</TableCell>
                        <TableCell>{translate("USER_CITY")}</TableCell>
                        <TableCell>{translate("DRIVER_NAME")}</TableCell>
                        <TableCell>{translate("DRIVER_PHONE")}</TableCell>
                        <TableCell>{translate("DRIVER_GENDER")}</TableCell>
                        <TableCell>{translate("DRIVER_CITY")}</TableCell>
                        <TableCell>{translate("DRIVER_EMAIL")}</TableCell>
                        <TableCell>{translate("VEHICLE_TYPE")}</TableCell>
                        <TableCell>{translate("VEHICLE_NUMBER")}</TableCell>
                        <TableCell>{translate("VEHICLE_MODEL")}</TableCell>
                        <TableCell>{translate("VEHICLE_MAKE")}</TableCell>
                        <TableCell>{translate("VEHICLE_TYPE")}</TableCell>
                        <TableCell>{translate("TRIP_DATE")}</TableCell>
                        <TableCell>{translate("PICK_UP")}</TableCell>
                        <TableCell>{translate("DROP_LOCATION")}</TableCell>
                        {id==="trips_variance"?<>
                        <TableCell>{translate("ACTUAL_BILL")}</TableCell>
                        <TableCell>{translate("ESTIMATE_BILL")}</TableCell>
                        <TableCell>{translate("ACTUAL_DISTANCE")}</TableCell>
                        <TableCell>{translate("ESTIMATE_DISTANCE")}</TableCell>
                        <TableCell>{translate("ACTUAL_TIME")}</TableCell>
                        <TableCell>{translate("ESTIMATE_TIME")}</TableCell>
                        </>:<>
                        <TableCell>{translate("TOTAL_AMOUNT")}</TableCell>
                        <TableCell>{translate("ACCEPT_DATETIME")}</TableCell>
                        <TableCell>{translate("ARRIVE_DATETIME")}</TableCell>
                        <TableCell>{translate("START_DATETIME")}</TableCell>
                        <TableCell>{translate("END_DATETIME")}</TableCell></>
                        }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.trips.map(trip => (
                        <TableRow hover key={trip.trip_id}>
                            <TableCell style={{minWidth:150}} component="th" scope="row">
                                {trip.rider_name?trip.rider_name:""}
                            </TableCell>
                            <TableCell style={{direction:"ltr"}} component="th" scope="row">
                            {trip.user_phone?trip.user_phone:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.user_email?trip.user_email:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.user_gender?trip.user_gender:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.user_area?trip.user_area:""}
                            </TableCell>
                            <TableCell style={{minWidth:130}} component="th" scope="row">
                            {trip.driver_name?trip.driver_name:""}
                            </TableCell>
                            <TableCell  style={{direction:"ltr"}} component="th" scope="row">
                            {trip.driver_phone?trip.driver_phone:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.driver_gender?trip.driver_gender:""}
                            </TableCell>
                            <TableCell style={{minWidth:100}} component="th" scope="row">
                            {trip.driver_city?trip.driver_city:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.driver_email?trip.driver_email:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.vehicle_type?trip.vehicle_type:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.vehicle_number?trip.vehicle_number:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.vehicle_model?trip.vehicle_model:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.vehicle_make?trip.vehicle_make:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.vehicle_type?trip.vehicle_type:""}
                            </TableCell>
                            <TableCell style={{minWidth:300}} component="th" scope="row">
                            {trip.trip_create_datetime?trip.trip_create_datetime:""}
                            </TableCell>
                            <TableCell style={{minWidth:300}} component="th" scope="row">
                            {trip.pickup_location?trip.pickup_location:""}
                            </TableCell>
                            <TableCell style={{minWidth:300}} component="th" scope="row">
                            {trip.drop_location?trip.drop_location:""}
                            </TableCell>
                           {id==="trips_variance"?
                           <>
                           <TableCell component="th" scope="row">
                            {trip.actual_bill?trip.actual_bill:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.estimate_bill?trip.estimate_bill:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.actual_distance?trip.actual_distance:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.estimate_distance?trip.estimate_distance:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {trip.actual_time?trip.actual_time:""}
                            </TableCell>
                            <TableCell style={{minWidth:55}} component="th" scope="row">
                            {trip.estimate_time?trip.estimate_time:""}
                            </TableCell>
                            </>:
                            <>
                            <TableCell component="th" scope="row">
                            {trip.total_amount?trip.total_amount:""}
                            </TableCell>
                            <TableCell style={{minWidth:150}} component="th" scope="row">
                            {trip.accept_datetime?trip.accept_datetime:""}
                            </TableCell>
                            <TableCell style={{minWidth:150}} component="th" scope="row">
                            {trip.arrive_datetime?trip.arrive_datetime:""}
                            </TableCell>
                            <TableCell style={{minWidth:150}} component="th" scope="row">
                            {trip.start_datetime?trip.start_datetime:""}
                            </TableCell>
                            <TableCell style={{minWidth:150}} component="th" scope="row">
                            {trip.end_datetime?trip.end_datetime:""}
                            </TableCell>
                            </>
                            }
                            
                        </TableRow>
                        ))}  
                    </TableBody>
                    </Table>
                    </InfiniteScroll>
                </Paper>
               </div>:(this.state.isLoading?
                <div style={{display:"flex",justifyContent:"center"}}>
                <CircularProgress/>  
                <Button
                style={{margin:"0 7px"}}
                variant="text"
                color="primary"
                onClick={this.cancelRequest}>{translate("CANCEL_REQUEST")}</Button>    
                </div>:null
               )
              }
              {this.state.trips.length === 0 && !this.state.isLoading?
              <div style={{display:"flex",justifyContent:"center"}}>
                <h4>{translate("NO_DATA")}</h4>
              </div>:null}
            </div>
            </Grow>
        )
    }
}

export default TripVariance
