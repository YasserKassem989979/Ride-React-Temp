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
import { CircularProgress, Button } from '@material-ui/core';
import Alert from '../../../components/Alert/alert';
import native from "axios";
import fileDownload from "js-file-download";

// to create cancel Token 
const CancelToken = native.CancelToken;
let cancel;

function formatSeconds(sec){
    let sec_num = parseInt(sec, 10)
    let days   = Math.floor(sec_num / (3600 * 24))
    let hours   = Math.floor(sec_num / 3600) % 24
    let minutes = Math.floor(sec_num / 60) % 60
    let seconds = sec_num % 60

    return (days || "") + "-" + ([ hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":"))
}
export class DriverReport extends Component {

    state ={
        drivers:[],
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

 // to search in drivers W/O filters  
 search = (data={},search)=>{
    const {report_link} = this.props;
    // if there is more data and is not a new search operation don't do any thing
    if(!this.state.hasMore && !search){
        return
    }
    // filter
    let filter={};

    if(data.full_name){
        filter.full_name = data.full_name
    }
    if(data.phone){
        filter.phone = data.phone
    }
    if(data.date_from){
        filter.date_from = moment(data.date_from).format("YYYY-MM-DD")
    }
    if(data.date_to){
        filter.date_to = moment(data.date_to).format("YYYY-MM-DD")
    }
    if(data.rate){
        filter.rate_from = data.rate[0]
    }
    if(data.rate){
        filter.rate_to = data.rate[1]
    }
    if(data.status){
        filter.status = data.status
    }
     //////////////
    // if it is search operation, take the new filter
    if(search){
        this.setState({filter})
    }

    this.setState({
        isLoading:true,
        currentPage:search ? 1 :this.state.currentPage, //is search operation reset the current page and the drivers array
        drivers:search?[]:this.state.drivers,
        hasMore:search?false:this.state.hasMore
    },()=>{
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
            drivers:this.state.drivers.concat(res.data.data),
            isLoading:false,
            hasMore:this.state.currentPage < res.data.last_page,
            currentPage:this.state.currentPage + 1,
            total:res.data.total
        })
       })
       .catch(err=>{
        this.setState({isLoading:false})
        Alert.error(err.data?err.data.message:err.message?err.message:"ERROR");
       })
    });
   
}

    // to cancel request 
    cancelRequest = () => {
        cancel(translate("CANCELD_BY_USER"));
    }

    extractReport =() =>{
        const {direction,report_excel} = this.props;
        this.setState({isLoadingReportExcel:true});
        let params={
         title :translate("DRIVERS"),
         columns : JSON.stringify([
            {"caption": ("DRIVER"), "align": "center"},
            {"caption": ("THE_NUMBER"), "align": "center"},
            {"caption": ("EMAIL"), "align": "center", "width" : 40},
            {"caption": ("DRIVER_CREATE_DATE"), "align": "center"},
            {"caption": ("GENDER"), "align": "center"},
            {"caption": ("CITY"), "align": "center"},
            {"caption": ("STATUS"), "align": "center"},
            {"caption": ("EARNINGS"), "align": "center"},
            {"caption": ("VEHICLE_NUMBER"), "align": "center"},
            {"caption": ("VEHICLE_MAKE"), "align": "center"},
            {"caption": ("VEHICLE_MODEL"), "align": "center"},
            {"caption": ("VEHICLE_TYPE"), "align": "center"},
            {"caption": ("SERVICE_TYPE"), "align": "center"},
            {"caption": ("TOTLA_ACCEPTED_REQUESTS"), "align": "center"},
            {"caption": ("TOTLA_REJECTED_REQUESTS"), "align": "center"},
            {"caption": ("ACCEPTANCE_RATE"), "align": "center"},
            {"caption": ("REJECTION_RATE"), "align": "center"},
            {"caption": ("TOTAL_TRIPS_COMPLETED"), "align": "center"},
            {"caption": ("RATING"), "align": "center"}]),
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
                fileDownload(new Blob([res.data]), 'drivers-report.xlsx');
                this.setState({isLoadingReportExcel:false});
            })
            .catch(err=>{
                this.setState({isLoadingReportExcel:false})
                Alert.error(err.data?err.data.message:err.message?err.message:"ERROR");
            })

    }

    render() {
        return (
            <Grow in={true}>
            <div className={styles.reportWrapper}>
             
                    <div>
                    <Search
                    advanced="drivers"
                    submitsearch={this.search}
                    extractReport={this.extractReport}
                    isLoadingReportExcel={this.state.isLoadingReportExcel}
                        />
                    </div>   
               {this.state.drivers.length>0?<div>
               <Paper className={styles.paper}>
               <InfiniteScroll
                        dataLength={this.state.drivers.length} 
                        next={()=>this.search(this.state.filter,false)}
                        hasMore={this.state.hasMore}
                        loader={this.state.drivers.length>0?<div style={{textAlign:"center",padding:3}}><CircularProgress  /></div>:null}
                        height={700}
                        endMessage={
                            !this.state.isLoading?<p style={{textAlign: 'center'}}>
                            <b>{translate("NO_MORE_DATA")}</b>
                        </p>:null
                        }>
                    <Table stickyHeader size="small" className={styles.table} >
                    <TableHead>
                        <TableRow>
                        <TableCell>{translate("DRIVER")}</TableCell>
                        <TableCell>{translate("THE_NUMBER")}</TableCell>
                        <TableCell>{translate("EMAIL")}</TableCell>
                        <TableCell>{translate("DRIVER_CREATE_DATE")}</TableCell>
                        <TableCell>{translate("GENDER")}</TableCell>
                        <TableCell>{translate("CITY")}</TableCell>
                        <TableCell>{translate("RATING")}</TableCell>
                        <TableCell>{translate("STATUS")}</TableCell>
                        <TableCell>{translate("ONLINE_TIME")}</TableCell>
                        <TableCell>{translate("OFFLINE_TIME")}</TableCell>
                        <TableCell>{translate("VEHICLE_NUMBER")}</TableCell>
                        <TableCell>{translate("VEHICLE_MODEL")}</TableCell>
                        <TableCell>{translate("VEHICLE_MAKE")}</TableCell>
                        <TableCell>{translate("VEHICLE_TYPE")}</TableCell>
                        <TableCell>{translate("SERVICE_TYPE")}</TableCell>
                        <TableCell>{translate("TOTLA_ACCEPTED_REQUESTS")}</TableCell>
                        <TableCell>{translate("TOTLA_REJECTED_REQUESTS")}</TableCell>
                        <TableCell>{translate("TOTAL_TRIPS_COMPLETED")}</TableCell>
                        <TableCell>{translate("REJECTION_RATE")}</TableCell>
                        <TableCell>{translate("ACCEPTANCE_RATE")}</TableCell>
                        <TableCell>{translate("EARNINGS")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.drivers.map(driver => (
                        <TableRow hover key={driver.id+Math.random()}>
                            <TableCell component="th" scope="row">
                                {driver.full_name?driver.full_name:""}
                            </TableCell>
                            <TableCell style={{direction:"ltr"}} component="th" scope="row">
                            {driver.phone_number?driver.phone_number:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.email?driver.email:""}
                            </TableCell>
                            <TableCell style={{minWidth:100}} component="th" scope="row">
                            {driver.driver_create_date?driver.driver_create_date:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.driver_gender?driver.driver_gender:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.area_name?driver.area_name:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.avg_ratings?driver.avg_ratings:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.driver_status?translate(driver.driver_status):""}
                            </TableCell>
                            <TableCell style={{minWidth:100}} component="th" scope="row">
                            {driver.online_time?formatSeconds(driver.online_time):""}
                            </TableCell>
                            <TableCell style={{minWidth:100}} component="th" scope="row">
                            {driver.offline_time?formatSeconds(driver.offline_time):""}
                            </TableCell>
                            <TableCell style={{minWidth:100}} component="th" scope="row">
                            {driver.vehicle_number?driver.vehicle_number:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.vehicle_model?driver.vehicle_model:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.vehicle_make?driver.vehicle_make:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.vehicle_type?driver.vehicle_type:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.service_name?driver.service_name:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.total_accepted_requests?driver.total_accepted_requests:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.total_rejected_requests?driver.total_rejected_requests:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.total_completed?driver.total_completed:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.rejection_rate?driver.rejection_rate:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.acceptance_rate?driver.acceptance_rate:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {driver.earnings?driver.earnings:""}
                            </TableCell>   
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
              {this.state.drivers.length===0 && !this.state.isLoading?
              <div style={{display:"flex",justifyContent:"center"}}>
                <h4>{translate("NO_DATA")}</h4>
              </div>:null}
            </div>
            </Grow>
        )
    }
}

export default DriverReport;
