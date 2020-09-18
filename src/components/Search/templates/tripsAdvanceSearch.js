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
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Popover from "@material-ui/core/Popover";
import { translate } from "../../../utils/translate";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";

export class TripsAdvanceSearch extends Component {
  initialState = {
    refreshRate: 60,
    category: "",
    status: "",
    type: "",
    date: new Date("October 28, 2019"),
    Colors: ["default", "default", "default"],
    chipsFilters: [
      {
        key: 0,
        label: translate("COMPLETED"),
        value: "COMPLETED",
        disabled: false,
      },
      {
        key: 1,
        label: translate("CANCELED"),
        value: "CANCELED",
        disabled: false,
      },
      { key: 2, label: translate("ACTIVE"), value: "ACTIVE", disabled: false },
    ],
    flage: false,
    changed: false,
  };

  state = { ...this.initialState };

  // handlers

  handleDateChange = (date) => {
    this.setState({ date: date, changed: true });
  };
  handleStatusChange = (event) => {
    this.setState({ status: event.target.value, changed: true });
  };
  //////////////////////////////////////

  // to clear all filters for search operations
  clearFilters = () => {
    this.setState(
      {
        ...this.initialState,
        chipsFilters: [
          {
            key: 0,
            label: translate("COMPLETED"),
            value: "COMPLETED",
            disabled: false,
          },
          {
            key: 1,
            label: translate("CANCELED"),
            value: "CANCELED",
            disabled: false,
          },
          {
            key: 2,
            label: translate("ACTIVE"),
            value: "ACTIVE",
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
    let category = this.state.category;
    if (item.value === "COMPLETED") {
      newBadgesArray[1]["disabled"] = true;
      newBadgesArray[2]["disabled"] = true;
      category = item.value;
    }
    if (item.value === "CANCELED") {
      newBadgesArray[0]["disabled"] = true;
      newBadgesArray[2]["disabled"] = true;
      category = item.value;
    }
    if (item.value === "ACTIVE") {
      newBadgesArray[0]["disabled"] = true;
      newBadgesArray[1]["disabled"] = true;
      category = item.value;
    }

    this.setState(
      {
        chipsFilters: newBadgesArray,
        category,
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
    let category = this.state.category;
    let flag = false;

    if (item.value === "COMPLETED") {
      category = "";
      newBadgesArray[1]["disabled"] = false;
      newBadgesArray[2]["disabled"] = false;
    }
    if (item.value === "CANCELED") {
      newBadgesArray[0]["disabled"] = false;
      newBadgesArray[2]["disabled"] = false;
      category = "";
    }
    if (item.value === "ACTIVE") {
      newBadgesArray[0]["disabled"] = false;
      newBadgesArray[1]["disabled"] = false;
      category = "";
    }

    // to check if something changed to invoke the search function
    if (category !== this.state.category) {
      flag = true;
    }

    this.setState(
      {
        chipsFilters: newBadgesArray,
        category,
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
      category: this.state.category,
      type: this.state.type,
    };
    if (this.state.changed) {
      filter = this.state;
    }
    this.props.search(filter, false);
    this.props.handleClose();
  };

  // for quick search (chips search)
  submitQuickFiltersAndSearch = (clear) => {
    if (clear) {
      this.props.search(null, "clear");
      return;
    }

    let quickFilters = {
      category: this.state.category,
      type: this.state.type,
    };

    if (this.state.changed) {
      quickFilters = this.state;
    }

    this.props.search(quickFilters);
  };

  $refreshInterval = null;
  componentDidUpdate(prevProps, pervState) {
    if (pervState.refreshRate != this.state.refreshRate) {
      clearInterval(this.$refreshInterval);
      if (this.state.refreshRate == "STOP") return;
      this.$refreshInterval = setInterval(
        this.submitFiltersAndSearch,
        this.state.refreshRate * 1000
      );
    }
  }
  componentWillUnmount() {
    clearInterval(this.$refreshInterval);
  }

  render() {
    let badgesArray = this.state.chipsFilters;

    let tripsBadgesFilters = (
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
            {tripsBadgesFilters}
            <ToggleButtonGroup
              size="medium"
              classes={{ root: styles.toggleButton }}
              exclusive
              value={this.state.type}
              onChange={(event, value) => {
                this.setState(
                  { type: value },
                  this.submitQuickFiltersAndSearch
                );
              }}
            >
              <ToggleButton
                classes={{ root: styles.toggleButton }}
                key={1}
                value="NOW"
              >
                {translate("NOW")}
              </ToggleButton>
              <ToggleButton
                classes={{ root: styles.toggleButton }}
                key={2}
                value="LATER"
              >
                {translate("LATER")}
              </ToggleButton>
            </ToggleButtonGroup>
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
            <Tooltip title={translate("refresh_rate")}>
              <Select
                value={this.state.refreshRate}
                onChange={({ target: { value } }) => {
                  this.setState({ refreshRate: value });
                }}
              >
                <MenuItem value={30}>30 {translate("SEC")}</MenuItem>
                <MenuItem value={60}>1 {translate("MIN")}</MenuItem>
                <MenuItem value={120}>2 {translate("MINS")}</MenuItem>
                <MenuItem value={"STOP"}>{translate("STOP")}</MenuItem>
              </Select>
            </Tooltip>
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
            <div
              className={styles.container}
              style={{ minHeight: 200, minWidth: 200 }}
            >
              <div
                className={styles.rateingContainer}
                style={{ justifyContent: "space-evenly" }}
              >
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
                    style={{ maxWidth: 200 }}
                    disableToolbar
                    variant="inline"
                    format="DD-MM-YYYY"
                    margin="normal"
                    id="date-picker-inline"
                    value={this.state.date}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div
                className={styles.rateingContainer}
                style={{ justifyContent: "space-evenly" }}
              >
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
                    {translate("STATUS")}:
                  </InputLabel>
                </div>
                <Select
                  value={this.state.status}
                  onChange={this.handleStatusChange}
                  style={{ minWidth: 200 }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {translate(status)}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div className={styles.Button}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.submitFiltersAndSearch(false)}
                >
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

const statuses = [
  "NEW",
  "ACCEPTED",
  "ARRIVED",
  "STARTED",
  "ENDED",
  "CANCELED_BY_USER",
  "CANCELED_BY_DRIVER",
  "CANCELED_BY_ADMIN",
  "CANCELED",
  "PARTIALLY_ACCEPTED",
  "REJECTED",
  "REJECTED_BY_ALL_DRIVERS",
  "COMPLETED",
];
export default TripsAdvanceSearch;
