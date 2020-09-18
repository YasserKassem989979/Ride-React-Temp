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


export class CompanyShares extends Component {

    state ={
        shares:[],
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
    

 // to search in shares W/O filters  
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

    if(data.trip_id){
        filter.trip_id= data.trip_id
    }

     //////////////
    // if it is search operation, take the new filter
    if(search){
        this.setState({filter})
    }

    this.setState({
        isLoading:true,
        currentPage:search ? 1 :this.state.currentPage, //is search operation reset the current page and the shares array
        shares:search?[]:this.state.shares,
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
            shares:this.state.shares.concat(res.data.data),
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
};


extractReport =() =>{
    const {direction,report_excel} = this.props;
    this.setState({isLoadingReportExcel:true});
    let params={
     title :translate("COMPANY_SHARE"),
     columns : JSON.stringify([
        {"caption": ("PAYMENT_METHODE"), "align": "center"},
        {"caption": ("DRIVER"), "align": "center"},
        {"caption": ("THE_NUMBER"), "align": "center"},
        {"caption": ("EMAIL"), "align": "center", "width" : 40},
        {"caption": ("GENDER"), "align": "center"},
        {"caption": ("CITY"), "align": "center"},
        {"caption": ("TRIP_ID"), "align": "center"},
        {"caption": ("TOTAL_AMOUNT"), "align": "center"},
        {"caption": ("DRIVER_SHARE"), "align": "center"},
        {"caption": ("COMPANY_SHARES"), "align": "center"},
        {"caption": ("PROMO_DISCOUNT"), "align": "center"},
        {"caption": ("COMPANY_SHARE_PERCENTAGE"), "align": "center"},
        {"caption": ("TRIP_STATUS"), "align": "center"},
        {"caption": ("TRIP_DATE"), "align": "center"}]),
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
            fileDownload(new Blob([res.data]), 'company-share-report.xlsx');
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
                advanced="company_share"
                submitsearch={this.search}
                extractReport={this.extractReport}
                isLoadingReportExcel={this.state.isLoadingReportExcel}
            />
            </div>
           {this.state.shares.length>0?<div>
           <Paper className={styles.paper}>
           <InfiniteScroll
                    dataLength={this.state.shares.length} 
                    next={()=>this.search(this.state.filter,false)}
                    hasMore={this.state.hasMore}
                    loader={this.state.shares.length>0?<div style={{textAlign:"center",padding:3}}><CircularProgress  /></div>:null}
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
                    <TableCell>{translate("GENDER")}</TableCell>
                    <TableCell>{translate("CITY")}</TableCell>
                    <TableCell>{translate("PAYMENT_METHODE")}</TableCell>
                    <TableCell>{translate("TOTAL_AMOUNT")}</TableCell>
                    <TableCell>{translate("DRIVER_SHARE")}</TableCell>
                    <TableCell>{translate("COMPANY_SHARES")}</TableCell>
                    <TableCell>{translate("PROMO_DISCOUNT")}</TableCell>
                    <TableCell>{translate("COMPANY_SHARE_PERCENTAGE")}</TableCell>
                    <TableCell>{translate("TRIP_STATUS")}</TableCell>
                    <TableCell>{translate("TRIP_DATE")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.shares.map(share => (
                    <TableRow hover key={share.trip_id+Math.random()}>
                        <TableCell style={{minWidth:130}} component="th" scope="row">
                            {share.full_name?share.full_name:""}
                        </TableCell>
                        <TableCell style={{direction:"ltr"}} component="th" scope="row">
                        {share.phone_number?share.phone_number:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.email?share.email:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.driver_gender?share.driver_gender:""}
                        </TableCell>
                        <TableCell style={{minWidth:100}} component="th" scope="row">
                        {share.area_number?share.area_number:""}
                        </TableCell>
                        <TableCell style={{direction:"ltr"}} component="th" scope="row">
                        {share.payment_method?share.payment_method:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.total_amount?share.total_amount:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.driver_share?share.driver_share:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.company_share?share.company_share:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.promo_discount?share.promo_discount:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.company_share_percentage?share.company_share_percentage:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {share.trip_status?share.trip_status:""}
                        </TableCell>
                        <TableCell style={{minWidth:150}} component="th" scope="row">
                        {share.trip_create_datetime?share.trip_create_datetime:""}
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
          {this.state.shares.length===0 && !this.state.isLoading?
          <div style={{display:"flex",justifyContent:"center"}}>
            <h4>{translate("NO_DATA")}</h4>
          </div>:null}
        </div>
        </Grow>
    )
}
}

export default CompanyShares
