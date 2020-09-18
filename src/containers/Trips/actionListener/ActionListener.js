import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import {
  withWidth,
  Button,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  ListItemIcon,
  CircularProgress,
} from "@material-ui/core";
// import styles from "./actionsListener.module.css"
import axios from "../../../axios";
import Alert from "../../../components/Alert/alert";
import { translate } from "../../../utils/translate";
import AdminIcon from "@material-ui/icons/SupervisedUserCircle";
import DriverIcon from "@material-ui/icons/LocalTaxi";
import RiderIcon from "@material-ui/icons/Person";

export class ActionsListener extends Component {
  state = {
    fullWidth: true,
    maxWidth: "sm",
    open: true,
    deleteAlert: false,
    isLoading: false,
    cancellationReasons: [],
    selectedCancelReason: "",
    description: "",
    canceledBy: "",
  };

  componentDidMount() {
    this.widthChanged();
    this.getAdminCancelReasons();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width) {
      this.widthChanged();
    }
  }

  // ui change handler for the modal width
  widthChanged = () => {
    let max = "sm";
    if (
      this.props.width !== "xl" &&
      this.props.width !== "lg" &&
      this.props.width !== "md"
    ) {
      max = this.props.width;
    }
    this.setState({ maxWidth: max });
  };

  getAdminCancelReasons = () => {
    axios.get("/trips/cancel_reasons").then((response) => {
      this.setState({ cancellationReasons: response.data });
    });
  };

  _handleCancelReasonChange = ({ target: { value } }) => {
    let by = this.state.cancellationReasons.find(
      (reason) => reason.id === value
    ).for;
    this.setState({ selectedCancelReason: value, canceledBy: by });
  };

  _cancelTrip = () => {
    this.setState({ isLoading: true });
    axios
      .put("/trips/cancel", {
        booking_id: this.props.trip.summary.id,
        cancel_reason_id: this.state.selectedCancelReason,
        description: this.state.description,
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction(true);
          Alert.success("تمت العملية بنجاح");
        });
      })
      .catch((err) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction(false);
          Alert.error(err.data ? err.data.message : "ERROR");
        });
      });
  };

  render() {
    const {
      whatIsTheAction,
      trip: { summary, driver, rider },
    } = this.props;
    let actionView = null;
    switch (whatIsTheAction) {
      case "CANCEL_TRIP_ACTIVE":
        actionView = (
          <>
            <DialogTitle>{translate("CANCEL_TRIP_ACTIVE")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography>
                  {" "}
                  {translate("CANCEL_TRIP_ACTIVE")} {summary.id}{" "}
                </Typography>
              </DialogContentText>

              <InputLabel id="select-reason">{translate("REASON")}</InputLabel>
              <Select
                id="select-reason"
                fullWidth
                value={this.state.selectedCancelReason}
                onChange={this._handleCancelReasonChange}
              >
                {this.state.cancellationReasons.map((reason) => (
                  <MenuItem value={reason.id}>
                    <ListItemIcon>
                      {reason.for === "ADMIN" ? (
                        <AdminIcon fontSize="small" />
                      ) : reason.for === "DRIVER" ? (
                        <DriverIcon fontSize="small" />
                      ) : (
                        <RiderIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <Typography>{translate(reason.reason)}</Typography>
                  </MenuItem>
                ))}
              </Select>
              <TextField
                placeholder={translate("DESCRIPTION")}
                multiline
                fullWidth
                rows={3}
                value={this.state.description}
                onChange={({ target: { value } }) => {
                  this.setState({ description: value });
                }}
              />
            </DialogContent>
            <DialogActions>
              {this.state.isLoading ? <CircularProgress size={22} /> : null}
              <Button onClick={this._cancelTrip}>
                {" "}
                {translate("CONFIRM")}{" "}
              </Button>
              <Button onClick={this.props.onCloseAction}>
                {translate("CANCEL")}{" "}
              </Button>
            </DialogActions>
          </>
        );
        break;

      default:
        actionView = <div></div>;
    }

    return (
      <Dialog
        onClose={() => this.props.onCloseAction(false)}
        fullWidth={this.state.fullWidth}
        maxWidth={this.state.maxWidth}
        open={this.state.open}
        aria-labelledby="max-width-dialog-title"
      >
        {actionView}
      </Dialog>
    );
  }
}

export default withWidth()(connect()(ActionsListener));
