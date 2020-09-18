import React, { Component } from "react";
import styles from "../advance.module.css";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import { InputLabel, Button, Paper, Tooltip, FormControl, MenuItem, Select, Box, Typography } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import { translate } from "../../../utils/translate";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import axios from "../../../axios";

export class ActivitiesSearch extends Component {
    initialState = {
        date_from: new Date("October 28, 2019"),
        date_to: new Date(),
        flage: false,
        full_name: "",
        details: "",
        action: "",
        anchorElement: null,
        limit: 0,
        dateChanged: false,
        admins: [],
        actions: [],
    };

    state = { ...this.initialState };

    // to select wich element will be the anchor for search filters menu
    handleSearchMenuClick = (event) => {
        this.setState({ anchorElement: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorElement: null });
    };

    // to handle the change in text field
    changeTextHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleLimitChange = (e) => {
        this.setState({ limit: e.target.value });
    };

    handleDateFromChange = (date) => {
        this.setState({ date_from: date, dateChanged: true });
    };

    handleDateToChange = (date) => {
        this.setState({ date_to: date, dateChanged: true });
    };

    // to clear all filters for search operations
    clearFilters = () => {
        this.setState({ ...this.initialState }, () => {
            this.submitQuickFiltersAndSearch(true);
        });
    };

    // for quick search (chips search)
    submitQuickFiltersAndSearch = (clear) => {
        if (clear) {
            this.props.search(null, "clear");
            return;
        }

        let quickFilters = {
            full_name: this.state.full_name,
            details: this.state.details,
            action: this.state.action,
            balance_from: this.state.balance_from,
            balance_to: this.state.balance_to,
            limit: this.state.limit,
        };
        if (this.state.dateChanged) {
            quickFilters = this.state;
        }
        this.props.search(quickFilters);
        this.handleClose();
    };

    componentDidMount() {
        axios.get("/admins").then((response) => {
            this.setState({ admins: response.data.subadmins.data });
        });
        axios.get("/logged_actions").then((response) => {
            this.setState({ actions: response.data });
        });
    }
    //////////////////////////////////////////////////////////////////////////////
    //render//
    //////////////////////////////////////////////////////////////////////////////
    render() {
        let advanceIcon = (
            <InputAdornment position='end'>
                <IconButton aria-describedby={"simple-popover"} onClick={this.handleSearchMenuClick}>
                    <ArrowDownwardIcon />
                </IconButton>
            </InputAdornment>
        );

        return (
            <>
                <div className={styles.inputsText}>
                    <Box style={{ margin: "0px 15px", minWidth: "20%" }}>
                        <Typography component='label' color='textSecondary'>
                            {translate("admins")}
                        </Typography>
                        <Select
                            key='search_by_name'
                            fullWidth
                            variant='outlined'
                            placeholder='by admin name'
                            value={this.state.full_name}
                            onChange={this.changeTextHandler}
                            name='full_name'>
                            <MenuItem key='names_all' value={""}>
                                {translate("ALL")}
                            </MenuItem>

                            {this.state.admins.map((admin) => {
                                return (
                                    <MenuItem
                                        key={"name_" + admin.id}
                                        value={`${admin.merchantFirstName} ${admin.merchantLastName}`}>{`${admin.merchantFirstName} ${admin.merchantLastName}`}</MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                    <Box style={{ margin: "0px 15px", minWidth: "20%" }}>
                        <Typography component='label' color='textSecondary'>
                            {translate("ACTION")}
                        </Typography>
                        <Select
                            key='search_by_action'
                            fullWidth
                            variant='outlined'
                            placeholder='by action'
                            value={this.state.action}
                            onChange={this.changeTextHandler}
                            name='action'>
                            <MenuItem key='actions_all' value={""}>
                                {translate("ALL")}
                            </MenuItem>

                            {this.state.actions.map((action, i) => {
                                return (
                                    <MenuItem key={"action_" + i} value={action.action}>
                                        {translate(action.action)}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                    <Box style={{ margin: "1.5em 15px", minWidth: "20%" }}>
                      
                        <TextField
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    this.submitQuickFiltersAndSearch();
                                }
                            }}
                            style={{ margin: "0 15px" }}
                            name='details'
                            variant='outlined'
                            onChange={this.changeTextHandler}
                            value={this.state.details}
                            InputProps={{ endAdornment: advanceIcon }}
                            placeholder='بحث بالتفاصيل'></TextField>
                    </Box>
                    <Button
                        onClick={() => this.submitQuickFiltersAndSearch()}
                        style={{ maxHeight: 40, alignSelf: "center" }}
                        variant='contained'
                        color='primary'>
                        {translate("SEARCH")}
                    </Button>
                </div>
                <div className={styles.badgesFilter}>
                    <div style={{ margin: "0 70px" }}>
                        <FormControl className={styles.formControl}>
                            <Select value={this.state.limit} onChange={this.handleLimitChange}>
                                <MenuItem value={0}>{translate("LIMIT")}</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={10000}>{translate("ALL")}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ display: "flex" }}>
                        <Tooltip title={translate("clearFilters")}>
                            <IconButton onClick={this.clearFilters}>
                                <ClearAllIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={translate("refresh")}>
                            <IconButton onClick={() => this.submitQuickFiltersAndSearch()}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Popover
                    id={"simple-popover"}
                    open={Boolean(this.state.anchorElement)}
                    anchorEl={this.state.anchorElement}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: this.props.direction === "ltr" ? "right" : "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: this.props.direction === "ltr" ? "right" : "left",
                    }}>
                    <Paper style={{ padding: 10, ...this.props.modalStyle }}>
                        <div className={styles.container}>
                            <div className={styles.rateingContainer}>
                                <div style={{ paddingTop: 14 }}>
                                    <InputLabel style={{ fontSize: 18, fontWeight: "600", marginTop: 0, color: "#000" }} shrink>
                                        {translate("FROM")}:
                                    </InputLabel>
                                </div>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        style={{ maxWidth: 201 }}
                                        disableToolbar
                                        variant='inline'
                                        format='DD-MM-YYYY'
                                        margin='normal'
                                        id='date-picker-inline'
                                        value={this.state.date_from}
                                        onChange={this.handleDateFromChange}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div className={styles.rateingContainer}>
                                <div style={{ paddingTop: 14 }}>
                                    <InputLabel style={{ fontSize: 18, fontWeight: "600", marginTop: 0, color: "#000" }} shrink>
                                        {translate("TO")}:
                                    </InputLabel>
                                </div>

                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        style={{ maxWidth: 201 }}
                                        disableToolbar
                                        variant='inline'
                                        format='DD-MM-YYYY'
                                        margin='normal'
                                        value={this.state.date_to}
                                        onChange={this.handleDateToChange}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date",
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>

                            <div className={styles.Button}>
                                <Button variant='contained' color='secondary' onClick={() => this.submitQuickFiltersAndSearch()}>
                                    {" "}
                                    {translate("SEARCH")}
                                </Button>
                            </div>
                        </div>
                    </Paper>
                </Popover>
            </>
        );
    }
}

export default ActivitiesSearch;
