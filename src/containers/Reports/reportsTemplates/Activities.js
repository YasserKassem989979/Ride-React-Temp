import React, { Component } from "react";
import Search from "../../../components/reportsSearch/SearchContainer";
import styles from "../Reports.module.css";
import { translate } from "../../../utils/translate";
import Grow from "@material-ui/core/Grow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../../../axios";
import moment from "moment";
import { CircularProgress, Button } from "@material-ui/core";
import Alert from "../../../components/Alert/alert";
import native from "axios";
// to create cancel Token
const CancelToken = native.CancelToken;
let cancel;

export class Activities extends Component {
    state = {
        activities: [],
        isLoading: false,
        hasMore: true,
        currentPage: 1,
        filter: {},
        total: "",
        isLoadingReportExcel: false,
        objects: [],
        admins: [],
        selectedObject: "",
        selectedAdmins: "",
    };

    componentDidMount() {
        this.search();

        axios.get("/logged_objects").then((response) => {
            this.setState({ objects: response.data });
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.id !== prevProps.id) {
            this.search({}, true);
        }
    }

    // to search in activities W/O filters
    search = (data = {}, search) => {
        const { report_link } = this.props;
        // if there is more data and is not a new search operation don't do any thing
        if (!this.state.hasMore && !search) {
            return;
        }
        // filter
        let filter = {};
        if (data.full_name) {
            filter.full_name = data.full_name;
        }

        if (data.action) {
            filter.action = data.action;
        }
        if (data.details) {
            filter.object_details = data.details;
        }
        if (data.date_from) {
            filter.date_from = moment(data.date_from).format("YYYY-MM-DD");
        }
        if (data.date_to) {
            filter.date_to = moment(data.date_to).format("YYYY-MM-DD");
        }

        //////////////
        // if it is search operation, take the new filter
        if (search) {
            this.setState({ filter });
        }

        this.setState(
            {
                isLoading: true,
                hasMore: search ? false : this.state.hasMore,
                currentPage: search ? 1 : this.state.currentPage, //is search operation reset the current page and the activities array
                activities: search ? [] : this.state.activities,
            },
            () => {
                axios
                    .get(`${report_link}?page=${this.state.currentPage}`, {
                        params: {
                            filters: this.state.filter,
                        },
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function receives a cancel function as a parameter
                            cancel = c;
                        }),
                    })
                    .then((res) => {
                        this.setState({
                            activities: this.state.activities.concat(res.data.data),
                            isLoading: false,
                            hasMore: this.state.currentPage < res.data.last_page,
                            currentPage: this.state.currentPage + 1,
                            total: res.data.total,
                        });
                    })
                    .catch((err) => {
                        this.setState({ isLoading: false });
                        Alert.error(err.data ? err.data.message : err.message ? err.message : "ERROR");
                    });
            }
        );
    };

    // to cancel request
    cancelRequest = () => {
        cancel(translate("CANCELD_BY_USER"));
    };

    render() {
        return (
            <Grow in={true}>
                
                <div className={styles.reportWrapper}>
                <div>
                <Search
                    advanced={"activities"}
                    submitsearch={this.search}
                    extractReport={this.extractReport}
                isLoadingReportExcel={this.state.isLoadingReportExcel}
            />
            </div>
                    {this.state.activities.length > 0 ? (
                        <div>
                            <Paper className={styles.paper}>
                                <InfiniteScroll
                                    dataLength={this.state.activities.length}
                                    next={() => this.search(this.state.filter, false)}
                                    hasMore={this.state.hasMore}
                                    loader={
                                        this.state.activities.length > 0 ? (
                                            <div style={{ textAlign: "center", padding: 3 }}>
                                                <CircularProgress size={20} />
                                            </div>
                                        ) : null
                                    }
                                    height={700}
                                    endMessage={
                                        !this.state.isLoading ? (
                                            <p style={{ textAlign: "center" }}>
                                                <b>{translate("NO_MORE_DATA")}</b>
                                            </p>
                                        ) : null
                                    }>
                                    <Table stickyHeader size='small' className={styles.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate("ADMIN")}</TableCell>
                                                <TableCell>{translate("ACTION")}</TableCell>
                                                <TableCell>{translate("OBJECT")}</TableCell>
                                                <TableCell>{translate("DETAILS")}</TableCell>
                                                <TableCell>{translate("OLD_STATUS")}</TableCell>
                                                <TableCell>{translate("NEW_STATUS")}</TableCell>
                                                <TableCell>{translate("DATE")}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.activities.map((activity, i) => (
                                                <TableRow hover key={"row" +i}>
                                                    <TableCell style={{ minWidth: 150 }} component='th' scope='row'>
                                                        {activity.full_name ? activity.full_name : ""}
                                                    </TableCell>
                                                    <TableCell style={{ direction: "ltr" }} component='th' scope='row'>
                                                        {activity.action ? translate(activity.action) : ""}
                                                    </TableCell>
                                                    <TableCell component='th' scope='row'>
                                                        {activity.object ? translate(activity.object) : ""}
                                                    </TableCell>
                                                    <TableCell component='th' scope='row'>
                                                        {activity.object_details ? activity.object_details : ""}
                                                    </TableCell>
                                                    <TableCell component='th' scope='row'>
                                                        {activity.old_status ? translate(activity.old_status) : ""}
                                                    </TableCell>
                                                    <TableCell component='th' scope='row'>
                                                        {activity.new_status ? translate(activity.new_status) : ""}
                                                    </TableCell>
                                                    <TableCell style={{ minWidth: 130 }} component='th' scope='row'>
                                                        {activity.create_datetime ? activity.create_datetime : ""}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </InfiniteScroll>
                            </Paper>
                        </div>
                    ) : this.state.isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                            <Button style={{ margin: "0 7px" }} variant='text' color='primary' onClick={this.cancelRequest}>
                                {translate("CANCEL_REQUEST")}
                            </Button>
                        </div>
                    ) : null}
                    {this.state.activities.length === 0 && !this.state.isLoading ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h4>{translate("NO_DATA")}</h4>
                        </div>
                    ) : null}
                </div>
            </Grow>
        );
    }
}

export default Activities;
