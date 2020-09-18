import React, { Component,Suspense } from 'react'
import { connect } from 'react-redux'
import { withWidth, Grid, Slide, CircularProgress } from '@material-ui/core';
import styles from "./Reports.module.css"
import {changeCurrentPageName} from "../../store/actions/userPreference";
import ReportList from "./ReportsList"
import { translate } from '../../utils/translate';
import axios from "../../axios"
import Alert from '../../components/Alert/alert';
const DriverReport = React.lazy(()=> import ("./reportsTemplates/DriverReport")); 
const PartnersReport = React.lazy(()=> import ("./reportsTemplates/PartnersReport")); 
const RidersReport = React.lazy(()=> import ("./reportsTemplates/RidersReport")); 
const VehicleReport = React.lazy(()=> import ("./reportsTemplates/VehiclesReport"));
const TripVariance = React.lazy(()=> import ("./reportsTemplates/TripVariance"));
const Claims = React.lazy(()=> import ("./reportsTemplates/Claims"));
const CompanyShares = React.lazy(()=> import ("./reportsTemplates/CompanyShares"));
const Activities = React.lazy(()=> import ("./reportsTemplates/Activities"));
export class ReportsContainer extends Component {

    state={
        reportsList:[],
        whichReport:null,
        isLoading:false,
        report_link:"",
        report_excel:""
    };

    componentDidMount() {

            this.getReportsList();   
            this.props.changeCurrentPageName(this.props.location.pathname);
    }
    
    // to get Reports List
    getReportsList = () =>{
        this.setState({isLoading:true})
        axios.get('reports')
        .then(res=>{
            this.setState({
                reportsList:res.data,
                isLoading:false,
            })
        })
        .catch(err=>{
            this.setState({
                isLoading:false
            });
            Alert.error(err.data?err.data.message:"ERROR")
        })
    };

    whichReportToShow = (report,link,excel) =>{
        this.setState({
            whichReport:report
            ,report_link:link,
            report_excel:excel})
    }

    render() {

        let report=null;
        const {direction} = this.props;
        
        if(this.state.whichReport){
            switch (this.state.whichReport){
                case "DRIVERS":
                    report = (<DriverReport
                        direction={direction}
                        report_link={this.state.report_link}
                        report_excel={this.state.report_excel}/>)
                    break;
                case "PARTNERS":
                    report = (<PartnersReport
                        direction={direction}
                        report_link={this.state.report_link}
                        report_excel={this.state.report_excel}/>)
                    break;
                case "RIDERS":
                    report = (<RidersReport 
                        direction={direction}
                        report_link={this.state.report_link}
                        report_excel={this.state.report_excel}/>)
                    break;
                case "VEHICLES":
                    report = (<VehicleReport 
                        direction={direction}
                        report_link={this.state.report_link}
                        report_excel={this.state.report_excel}/>);
                    break;
                case "TRIPS_VARIANCE":
                    report = (<TripVariance 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         id="trips_variance"/>);
                    break;
                case "TRIPS_TIME":
                    report = (<TripVariance 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         id="trips_time"/>);
                    break;
                case "DRIVERS_CLAIMS":
                    report = (<Claims 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         id="drivers_claims"/>);
                    break;
                case "RIDERS_WALLETS":
                    report = (<Claims 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         id="riders_claims"/>);
                    break;
                case "COMPANY_SHARE":
                    report = (<CompanyShares 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         />);
                    break;
                case "ACTIVITIES":
                    report = (<Activities 
                        direction={direction}
                         report_link={this.state.report_link}
                        report_excel={this.state.report_excel}
                         />);
                    break;
                default:
                    report =(<div></div>)
            }
        }


        return (
            <Slide direction="down" in={true} timeout={200} mountOnEnter unmountOnExit>
              
            <Grid style={{marginTop:20}} container>
                {this.props.width ==="sm" || this.props.width==="xs" || this.props.width==="md" ? 
                <Grid item xs={12}>
                    <div className={styles.smallScreenError}>
                        <h3>
                            لا يمكنك مشاهدة التقارير من خلال الشاشات الصغيرة.
                        </h3>
                    </div>
                </Grid>:
                <>
                <Grid item xs={2}>
                    <div className={styles.listHeader}>
                    <h4>{translate("REPORTS")}:</h4>
                    </div>
                  { !this.state.isLoading?
                  <ReportList
                   onClick={this.whichReportToShow} 
                    reportsList={this.state.reportsList}/>:
                    <div style={{display:"flex",justifyContent:"center"}}>
                        <CircularProgress/>
                    </div>}
                </Grid>
                <Grid item xs={10}>
                    {this.state.whichReport?
                   <Suspense fallback={
                    <div style={{display:"flex",justifyContent:"center",padding:"20px"}}>
                            <CircularProgress/>
                    </div>}>
                    {report}
                    </Suspense>
                    :
                    <div style={{
                        display:"flex"
                        ,alignItems:"center"
                        ,justifyContent:"center"}}>
                        <h3>{translate("PLEASE_CHOOSE_FROM_LIST")}</h3>
                      </div>}
                </Grid>
                </>}
            </Grid>
            </Slide>
        )
    }
}

const mapStateToProps = (state) => ({
    direction:state.userPrefrence.direction
})

const mapDispatchToProps = dispatch => {
    return {
        changeCurrentPageName:(name)=>dispatch(changeCurrentPageName(name))
    }
}

export default withWidth()(connect(mapStateToProps, mapDispatchToProps)(ReportsContainer));
