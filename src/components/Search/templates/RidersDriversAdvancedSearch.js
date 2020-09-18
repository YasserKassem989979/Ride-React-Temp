import React, { Component } from "react";
import styles from "../advance.module.css";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import {
  MenuItem,
  Select,
  InputLabel,
  Button,
  Paper,
  Chip,
  Tooltip,
  Menu,
  ListItem,
  ListItemIcon,
  Typography,
  TextField,
  Checkbox,
} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import Popover from "@material-ui/core/Popover";
import { translate } from "../../../utils/translate";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import SortIcon from "@material-ui/icons/Sort";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

// I dont know why is this (but material ui need it, sometimes I am lazy to read)
const valuetext = (value) => {
  return `${value}*`;
};

export class RidersDriversAdvanceSearch extends Component {
  initialState = {
    refreshRate: 10,
    date_type: "create-date",
    rate: [1, 5],
    verification_status: "",
    document_number: "",
    status: "",
    date_from: new Date("October 28, 2019"),
    date_to: new Date(),
    Colors:
      this.props.id === "riders"
        ? ["default", "default", "default", "default"]
        : ["default", "default", "default", "default", "default"],
    chipsFilters:
      this.props.id === "riders"
        ? [
            {
              key: 0,
              label: translate("VERIFIED"),
              value: "pink",
              disabled: false,
            },
            {
              key: 3,
              label: translate("PENDING"),
              value: "PENDING",
              disabled: false,
            },
            { key: 1, label: translate("1"), value: "1", disabled: false },
            { key: 2, label: translate("2"), value: "2", disabled: false },
          ]
        : [
            {
              key: 0,
              label: translate("REJECTED"),
              value: "REJECTED",
              disabled: false,
            },
            { key: 1, label: translate("1"), value: "1", disabled: false },
            { key: 2, label: translate("2"), value: "2", disabled: false },
            {
              key: 3,
              label: translate("APPROVED"),
              value: "APPROVED",
              disabled: false,
            },
            {
              key: 4,
              label: translate("PENDING"),
              value: "PENDING",
              disabled: false,
            },
            {
              key: 5,
              label: translate("BLOCKED"),
              value: "BLOCKED",
              disabled: false,
            },
          ],
    gender: "",
    service_type: "",
    flage: false,
    changed: false,
    sortDialogOpen: false,
    sortMenuAnchor: null,
    selectedSort: {},
    sortOptions: [
      { field: "created_at", way: "asc" },
      { field: "created_at", way: "desc" },
    ],
    expired_docs: false,
  };

  state = { ...this.initialState };

  // handlers
  handledateTypeChange = (e) => {
    this.setState({ date_type: e.target.value, changed: true });
  };

  handleDateFromChange = (date) => {
    this.setState({ date_from: date, changed: true });
  };

  handleDateToChange = (date) => {
    this.setState({ date_to: date, changed: true });
  };

  handleRateChange = (event, newValue) => {
    this.setState({ rate: newValue, changed: true });
  };
  //////////////////////////////////////

  // to clear all filters for search operations
  clearFilters = () => {
    this.setState(
      {
        ...this.initialState,
        chipsFilters:
          this.props.id === "riders"
            ? [
                {
                  key: 0,
                  label: translate("VERIFIED"),
                  value: "pink",
                  disabled: false,
                },
                { key: 1, label: translate("1"), value: "1", disabled: false },
                { key: 2, label: translate("2"), value: "2", disabled: false },
                {
                  key: 4,
                  label: translate("PENDING"),
                  value: "PENDING",
                  disabled: false,
                },
              ]
            : [
                {
                  key: 0,
                  label: translate("REJECTED"),
                  value: "REJECTED",
                  disabled: false,
                },
                { key: 1, label: translate("1"), value: "1", disabled: false },
                { key: 2, label: translate("2"), value: "2", disabled: false },
                {
                  key: 3,
                  label: translate("APPROVED"),
                  value: "APPROVED",
                  disabled: false,
                },
                {
                  key: 4,
                  label: translate("PENDING"),
                  value: "PENDING",
                  disabled: false,
                },
                {
                  key: 5,
                  label: translate("BLOCKED"),
                  value: "BLOCKED",
                  disabled: false,
                },
              ],
      },
      () => {
        this.submitQuickFiltersAndSearch(true);
      }
    );
  };

  // to handle the quick filters
  handleChipClick = (item, id) => {
    // to check wich chip color should i change
    const colorsOfChips = [...this.state.Colors];
    colorsOfChips[item.key] = "primary";
    this.setState({ Colors: colorsOfChips });
    ///////////////////////////////////////////////////////////////

    // to check wich chips for gender is checked
    const newBadgesArray = [...this.state.chipsFilters];
    let gender = this.state.gender;
    let verfied = this.state.service_type;
    let verification_status = this.state.verification_status;
    let status = this.state.status;
    if (item.value === "pink") {
      // newBadgesArray[1]["disabled"] = true;
      verfied = item.value;
    }
    if (item.value === "1") {
      // newBadgesArray[0]["disabled"] = true;
      gender = 1;
    }
    if (item.value === "2") {
      // newBadgesArray[1]["disabled"] = true;
      gender = 2;
    }
    if (item.value === "REJECTED") {
      // newBadgesArray[3]["disabled"] = true;
      // newBadgesArray[4]["disabled"] = true;
      verification_status = item.value;
    }
    if (item.value === "APPROVED") {
      // newBadgesArray[0]["disabled"] = true;
      // newBadgesArray[4]["disabled"] = true;
      verification_status = item.value;
    }
    if (item.value === "PENDING") {
      // newBadgesArray[0]["disabled"] = true;
      // newBadgesArray[3]["disabled"] = true;
      verification_status = item.value;
      status = item.value;
    }
    if (item.value === "BLOCKED") {
      // newBadgesArray[0]["disabled"] = true;
      // newBadgesArray[3]["disabled"] = true;
      verification_status = item.value;
    }
    this.setState(
      {
        chipsFilters: newBadgesArray,
        gender: gender,
        service_type: verfied,
        verification_status,
        status,
      },
      () => {
        this.submitQuickFiltersAndSearch();
      }
    );
    ////////////////////////////////////////////////////
  };

  // to handle uncheck the chips(the quick filters)
  handleChipDelete = (item, id) => {
    // to check wich chip color should i change
    const colorsOfChips = [...this.state.Colors];
    colorsOfChips[item.key] = "default";
    this.setState({ Colors: colorsOfChips });
    ///////////////////////////////////////////////////////////////

    // to check wich chips for gender is checked (don't be mad :p )
    const newBadgesArray = [...this.state.chipsFilters];
    let gender = this.state.gender;
    let verfied = this.state.service_type;
    let verification_status = this.state.verification_status;
    let flag = false;

    if (item.value === "pink") {
      verfied = "";
      if (gender !== 2) {
        newBadgesArray[1]["disabled"] = false;
      }
    }
    if (item.value === "1") {
      newBadgesArray[0]["disabled"] = false;
      newBadgesArray[2]["disabled"] = false;
      gender = "";
    }
    if (item.value === "2") {
      if (!verfied) {
        newBadgesArray[1]["disabled"] = false;
      }
      gender = "";
    }

    if (
      item.value === "REJECTED" ||
      item.value === "APPROVED" ||
      item.value === "PENDING"
    ) {
      verification_status = "";
      newBadgesArray[0]["disabled"] = false;
      newBadgesArray[3]["disabled"] = false;
      if (newBadgesArray[4]) newBadgesArray[4]["disabled"] = false;
    }

    // to check if something changed to invoke the search function
    if (
      gender !== this.state.gender ||
      verfied !== this.state.service_type ||
      verification_status !== this.state.verification_status
    ) {
      flag = true;
    }

    this.setState(
      {
        chipsFilters: newBadgesArray,
        gender: gender,
        service_type: verfied,
        verification_status,
      },
      () => {
        if (flag) {
          this.submitQuickFiltersAndSearch();
        }
      }
    );
    ////////////////////////////////////////////////////
  };

  // for full filters search (quick filter and full filter)
  submitFiltersAndSearch = () => {
    let filter = {
      gender: this.state.gender,
      service_type: this.state.service_type,
      verification_status: this.state.verification_status,
      document_number: this.state.document_number,
    };
    if (this.state.changed) {
      filter = this.state;
    }
    this.props.search(filter, false, this.state.selectedSort);
    this.props.handleClose();
  };

  // for quick search (chips search)
  submitQuickFiltersAndSearch = (clear) => {
    if (clear) {
      this.props.search(null, "clear");
      return;
    }

    let quickFilters = {
      gender: this.state.gender,
      service_type: this.state.service_type,
      verification_status: this.state.verification_status,
    };
    if (this.state.changed) {
      quickFilters = this.state;
    }
    this.props.search(quickFilters);
  };



  _openSortDialog = (event) => {
    this.setState({
      sortDialogOpen: true,
      sortMenuAnchor: event.currentTarget,
    });
  };


  _closeSortDialog = () => {
    this.setState({ sortDialogOpen: false });
  };

  _selectSortOption = (option) => {
    this.setState(
      {
        selectedSort: option,
      },
      this.submitFiltersAndSearch
    );
  };
  //////////////////////////////////////////////////////////////////////////////
  //render//
  //////////////////////////////////////////////////////////////////////////////
  render() {
    // quick filters for riders
    let badgesArray = this.state.chipsFilters;
    let id = this.props.id;
    let ridersBadgesFilters = (
      <>
        {badgesArray.map((item) => {
          return (
            <Chip
              key={item.key}
              onDelete={() => this.handleChipDelete(item, this.props.id)}
              disabled={item.disabled}
              classes={{ root: styles.badge }}
              label={item.label}
              color={this.state.Colors[item.key]}
              onClick={() => this.handleChipClick(item, this.props.id)}
            />
          );
        })}
      </>
    );

    return (
      <>
        <div className={styles.badgesFilter}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {ridersBadgesFilters}
          </div>
          <div style={{ display: "flex" }}>
            <Tooltip title={translate("clearFilters")}>
              <IconButton onClick={this.clearFilters}>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={translate("refresh")}>
              <IconButton onClick={this.submitFiltersAndSearch}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={this._openSortDialog}>
              <SortIcon />
            </IconButton>
            <Menu
              anchorEl={this.state.sortMenuAnchor}
              onClose={this._closeSortDialog}
              open={this.state.sortDialogOpen}
            >
              {this.state.sortOptions.map((option, index) => (
                <MenuItem
                  key={"SORT_OPTION_" + index}
                  onClick={() => {
                    this._selectSortOption(option);
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      {option.way === "asc" ? (
                        <ArrowDownwardIcon fontSize={"small"} />
                      ) : (
                        <ArrowUpwardIcon fontSize={"small"} />
                      )}
                    </ListItemIcon>
                    <Typography variant="inherit">
                      {translate(option.field)}
                    </Typography>
                  </ListItem>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
        <Popover
          id={"simple-popover"}
          open={Boolean(this.props.anchorElement)}
          anchorEl={this.props.anchorEl}
          onClose={this.props.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: this.props.direction === "ltr" ? "right" : "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: this.props.direction === "ltr" ? "right" : "left",
          }}
        >
          <Paper style={{ padding: 10, ...this.props.modalStyle }}>
            <div className={styles.container}>
              <div className={styles.rateingContainer}>
                <div style={{ paddingTop: 14 }}>
                  <InputLabel
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 0,
                      color: "#000",
                    }}
                    shrink
                  >
                    {translate("DATE_TYPE")}:
                  </InputLabel>
                </div>
                <Select
                  value={this.state.date_type}
                  onChange={this.handledateTypeChange}
                  style={{ minWidth: 200 }}
                >
                  <MenuItem value={"create-date"}>
                    {translate("CREATE_DATE")}
                  </MenuItem>
                </Select>
              </div>
              <div className={styles.rateingContainer}>
                <div style={{ paddingTop: 14 }}>
                  <InputLabel
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 0,
                      color: "#000",
                    }}
                    shrink
                  >
                    {translate("FROM")}:
                  </InputLabel>
                </div>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    style={{ maxWidth: 201 }}
                    disableToolbar
                    variant="inline"
                    format="DD-MM-YYYY"
                    margin="normal"
                    id="date-picker-inline"
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
                  <InputLabel
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 0,
                      color: "#000",
                    }}
                    shrink
                  >
                    {translate("TO")}:
                  </InputLabel>
                </div>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    style={{ maxWidth: 201 }}
                    disableToolbar
                    variant="inline"
                    format="DD-MM-YYYY"
                    margin="normal"
                    value={this.state.date_to}
                    onChange={this.handleDateToChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>

              {/* Driver document name */}
              {id == "drivers" && (
                <div
                  className={styles.rateingContainer}
                  style={{ alignItems: "flex-end" }}
                >
                  <div>
                    <InputLabel
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginTop: 0,
                        color: "#000",
                      }}
                      shrink
                      id="demo-simple-select-label"
                    >
                      {translate("DOCUMENT_NUMBER")}:
                    </InputLabel>
                  </div>

                  <div>
                    <TextField
                      value={this.state.document_number}
                      onChange={({ target: { value } }) => {
                        this.setState({ document_number: value });
                      }}
                    />
                  </div>
                </div>
              )}

              {id === "drivers" ? (
                <div className={styles.rateingContainer}>
                  <div>
                    <InputLabel
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginTop: 0,
                        color: "#000",
                      }}
                      shrink
                      id="demo-simple-select-label"
                    >
                      {translate("EXPIRED_DOCUMENTS")}:
                    </InputLabel>
                  </div>
                  <div style={{ display: "flex", flex: 1 }}>
                    <Checkbox
                      checked={this.state.expired_docs}
                      onChange={() =>
                        this.setState((prevState) => ({
                          expired_docs: !prevState.expired_docs,
                          changed:true
                        }))
                      }
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </div>
                </div>
              ) : null}
              <div className={styles.rateingContainer}>
                <div>
                  <InputLabel
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginTop: 0,
                      color: "#000",
                    }}
                    shrink
                    id="demo-simple-select-label"
                  >
                    {translate("RATING")}:
                  </InputLabel>
                </div>
                <div style={{ width: "200px", marginTop: 10 }}>
                  <Slider
                    max={5}
                    min={1}
                    value={this.state.rate}
                    onChange={this.handleRateChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    getAriaValueText={valuetext}
                  />
                </div>
              </div>
              <div className={styles.Button}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.submitFiltersAndSearch(false)}
                >
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

export default RidersDriversAdvanceSearch;
