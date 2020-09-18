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


export class DriverReport extends Component {

    state ={
        riders:[],
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

  // to search in riders W/O filters  
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
        hasMore:search?false:this.state.hasMore,
        currentPage:search ? 1 :this.state.currentPage, //is search operation reset the current page and the riders array
        riders:search?[]:this.state.riders},
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
            riders:this.state.riders.concat(res.data.data),
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
    }

    extractReport =() =>{
        const {direction,report_excel} = this.props;
        this.setState({isLoadingReportExcel:true});
        let params={
         title :translate("RIDERS"),
         columns : JSON.stringify([
            {"caption": ("NAME"), "align": "center"},
            {"caption": ("THE_NUMBER"), "align": "center"},
            {"caption": ("EMAIL"), "align": "center", "width" : 40},
            {"caption": ("CITY"), "align": "center"},
            {"caption": ("GENDER"), "align": "center"},
            {"caption": ("STATUS"), "align": "center"},
            {"caption": ("DRIVER_CREATE_DATE"), "align": "center"},
            {"caption": ("TOTAL_TRIPS"), "align": "center"},
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
                fileDownload(new Blob([res.data]), 'riders-report.xlsx');
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
                    advanced="riders"
                    submitsearch={this.search}
                    extractReport={this.extractReport}
                    isLoadingReportExcel={this.state.isLoadingReportExcel}
                />  
                </div>
               {this.state.riders.length>0?<div>
               <Paper className={styles.paper}>
               <InfiniteScroll
                        dataLength={this.state.riders.length} 
                        next={()=>this.search(this.state.filter,false)}
                        hasMore={this.state.hasMore}
                        loader={this.state.riders.length>0?<div style={{textAlign:"center",padding:3}}><CircularProgress size={20} /></div>:null}
                        height={700}
                        endMessage={
                            !this.state.isLoading?<p style={{textAlign: 'center'}}>
                            <b>{translate("NO_MORE_DATA")}</b>
                        </p>:null
                        }>
                    <Table stickyHeader size="small" className={styles.table} >
                    <TableHead>
                        <TableRow>
                        <TableCell>{translate("NAME")}</TableCell>
                        <TableCell>{translate("THE_NUMBER")}</TableCell>
                        <TableCell>{translate("EMAIL")}</TableCell>
                        <TableCell>{translate("GENDER")}</TableCell>
                        <TableCell>{translate("RATING")}</TableCell>
                        <TableCell>{translate("TOTAL_TRIPS")}</TableCell>
                        <TableCell>{translate("DRIVER_CREATE_DATE")}</TableCell>
                        <TableCell>{translate("STATUS")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.riders.map(rider => (
                        <TableRow hover key={rider.id}>
                            <TableCell component="th" scope="row">
                                {rider.full_name?rider.full_name:""}
                            </TableCell>
                            <TableCell style={{direction:"ltr"}} component="th" scope="row">
                            {rider.phone_number?rider.phone_number:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.email?rider.email:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.user_gender?rider.user_gender:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.avg_rating?rider.avg_rating:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.total_completed}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.user_create_date?rider.user_create_date:""}
                            </TableCell>
                            <TableCell component="th" scope="row">
                            {rider.gender_verification?translate(rider.gender_verification):""}
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
              {this.state.riders.length === 0 && !this.state.isLoading?
              <div style={{display:"flex",justifyContent:"center"}}>
                <h4>{translate("NO_DATA")}</h4>
              </div>:null}
            </div>
            </Grow>
        )
    }
}

export default DriverReport;
