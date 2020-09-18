import React,{useState} from 'react'
import { Paper } from '@material-ui/core'
import styles from "./Reports.module.css"
import {translate} from "../../utils/translate";



const ReportsList = (props) => {
    const [checkItem,setCheckedItem] = useState(false)
    const {reportsList}= props;
    const temp = reportsList

    const itemClicked = (report,link,excel) =>{
        props.onClick(report,link,excel);
        setCheckedItem(report)
    };
    return (
        <div>
            <div className={styles.list}>
            {temp.map((report)=>{
                    return <Paper
                                key={report.title} 
                                onClick={()=>itemClicked(report.title,report.link,report.extract_link)} 
                                className={report.title===checkItem? styles.reportCardBlue:styles.reportCard}>
                                <div className={styles.reportName}>
                                    <p>{translate(report.title)}</p>
                                </div>
                           </Paper>
                })
            }
            {temp.length===0?
            <h4>لا يوجد تقارير</h4>
            :null}
            </div>   
        </div>
    )
}

export default ReportsList
