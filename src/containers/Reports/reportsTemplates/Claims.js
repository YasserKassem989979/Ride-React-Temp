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

export class DriverClaims extends Component {
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

    componentDidUpdate(prevProps) {
        if(this.props.id !== prevProps.id){
            this.search({},true)
        }
    }
    

 // to search in drivers/riders W/O filters  
 search = (data={},search)=>{
     const {report_link} = this.props;
     console.log(report_link)
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
   
    if(data.balance_from){
        filter.balance_from = data.balance_from
    }
    if(data.balance_to){
        filter.balance_to = data.balance_to
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
        const {direction,report_excel,id} = this.props;
        this.setState({isLoadingReportExcel:true});
        let params={
         title :translate(id === "drivers_claims" ?"DRIVERS_CLAIMS":"RIDERS_CLAIMS"),
         columns : JSON.stringify([
            {"caption": ("NAME"), "align": "center"},
            {"caption": ("THE_NUMBER"), "align": "center"},
            {"caption": ("EMAIL"), "align": "center", "width" : 40},
            {"caption": ("GENDER"), "align": "center"},
            {"caption": ("BALANCE"), "align": "center"},
            {"caption": ("ACCOUNT_CREATE_DATE"), "align": "center"},
            {"caption": ("MINIMUM_BALANCE"), "align": "center"},
            {"caption": ("MAXIMUM_BALANCE"), "align": "center"},
            {"caption": ("CURRENCY"), "align": "center"}]),
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
                fileDownload(new Blob([res.data]), 'claims-report.xlsx');
                this.setState({isLoadingReportExcel:false});
            })
            .catch(err=>{
                this.setState({isLoadingReportExcel:false})
                Alert.error(err.data?err.data.message:err.message?err.message:"ERROR");
            })
    
    }


    render() {
        const{id}=this.props;
        return (
            <Grow in={true}>
            <div className={styles.reportWrapper}>
                <div>
                <Search
                    advanced={this.props.id === "drivers_claims"?"DRIVER":"RIDER"}
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
                    <TableCell>{translate(id==="drivers_claims"?"DRIVER":"RIDER")}</TableCell>
                    <TableCell>{translate("THE_NUMBER")}</TableCell>
                    <TableCell>{translate("EMAIL")}</TableCell>
                    <TableCell>{translate("BALANCE")}</TableCell>
                    <TableCell>{translate("ACCOUNT_CREATE_DATE")}</TableCell>
                    <TableCell>{translate("MINIMUM_BALANCE")}</TableCell>
                    <TableCell>{translate("MAXIMUM_BALANCE")}</TableCell>
                    <TableCell>{translate("CURRENCY")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.drivers.map(driver => (
                    <TableRow hover key={driver.full_name+Math.random()}>
                        <TableCell component="th" scope="row">
                            {driver.full_name?driver.full_name:""}
                        </TableCell>
                        <TableCell style={{direction:"ltr"}} component="th" scope="row">
                        {driver.phone_number?driver.phone_number:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {driver.email?driver.email:""}
                        </TableCell>
                        <TableCell style={{direction:"ltr"}} component="th" scope="row">
                        {driver.balance?driver.balance:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {driver.account_create_datetime?driver.account_create_datetime:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {driver.minimum_balance?driver.minimum_balance:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {driver.maximum_balance?driver.maximum_balance:""}
                        </TableCell>
                        <TableCell component="th" scope="row">
                        {driver.currency?driver.currency:""}
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

export default DriverClaims
