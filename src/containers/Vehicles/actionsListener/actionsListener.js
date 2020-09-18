import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import { withWidth } from "@material-ui/core";
import ActionConformation from "../../../components/actionConformation/actionConformation";
import axios from "../../../axios";
import Alert from "../../../components/Alert/alert";
import AddRemoveService from "./addService";
import UpdateDocumentDate from "../../../components/actionUpdateDate/actionUpdateDate";
import moment from "moment";
import { UpdateVehicle } from "./update";
export class ActionsListener extends Component {
  state = {
    fullWidth: true,
    maxWidth: "sm",
    open: true,
    deleteAlert: false,
    date: this.props.documentDate,
    isLoading: false,
  };

  dateHandler = (date) => {
    console.log(date);
    this.setState({
      error: false,
      helperText: "",
      date,
    });
  };

  componentDidMount() {
    this.setState({ date: this.props.documentDate });
    console.log(this.props.documentDate);
    this.widthChanged();
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

  //actions handlers//////////////////
  updateVehicleRequest = (action) => {
    this.setState({ isLoading: true });
    let data = {
      driver_vehicle_id: this.props.vehicle.summary.id,
      comment: "VEHICLE_REJECTED",
    };
    if (action === "approve") {
      data = {
        id: this.props.vehicle.summary.id,
        comment: "VEHICLE_REJECTED",
      };
    }
    axios
      .put(`vehicles/${action}`, data)
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

  updateDocmentRequest = (action) => {
    this.setState({ isLoading: true });

    axios
      .put(`vehicles/documents/${action}`, {
        id: this.props.documentIdForActionListener,
        comment: "VEHICLE_REJECTED",
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

  UPDATE_DOCUMENT = () => {
    this.setState({ isLoading: true });
    axios
      .put("/vehicles/documents/update_expiry_date", {
        document_id: this.props.documentIdForActionListener,
        expire_date: moment(this.state.date).format("YYYY-MM-DD"),
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

  REJECT_VEHICLE_APPROVED = () => {
    this.updateVehicleRequest("reject");
  };
  APPROVE_VEHICLE_PENDING = () => {
    this.updateVehicleRequest("approve");
  };

  REJECT_DOCUMENT_PENDING = () => {
    this.updateDocmentRequest("reject");
  };
  APPROVE_DOCUMENT_PENDING = () => {
    this.updateDocmentRequest("approve");
  };

  render() {
    const { whatIsTheAction } = this.props;
    let actionView = null;

    switch (whatIsTheAction) {
      case "REJECT_VEHICLE_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.REJECT_VEHICLE_APPROVED}
            color="#980000"
          />
        );
        break;
      case "REJECT_VEHICLE_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.REJECT_VEHICLE_APPROVED}
            color="#980000"
          />
        );
        break;
      case "APPROVE_VEHICLE_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.APPROVE_VEHICLE_PENDING}
            color="green"
          />
        );
        break;
      case "APPROVE_VEHICLE_REJECTED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.APPROVE_VEHICLE_PENDING}
            color="green"
          />
        );
        break;
      case "REJECT_DOCUMENT_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.REJECT_DOCUMENT_PENDING}
            color="#980000"
          />
        );
        break;
      case "REJECT_DOCUMENT_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.REJECT_DOCUMENT_PENDING}
            color="#980000"
          />
        );
        break;
      case "APPROVE_DOCUMENT_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.APPROVE_DOCUMENT_PENDING}
            color="green"
          />
        );
        break;
      case "APPROVE_DOCUMENT_REJECTED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.APPROVE_DOCUMENT_PENDING}
            color="green"
          />
        );
        break;
      case "ADD-SERVICE-TYPE_VEHICLE_APPROVED":
        actionView = (
          <AddRemoveService
            cancelActionHandler={(flag) => this.props.onCloseAction(flag)}
            vehicle={this.props.vehicle.summary}
            id="add"
          />
        );
        break;
      case "REMOVE-SERVICE-TYPE_VEHICLE_APPROVED":
        actionView = (
          <AddRemoveService
            cancelActionHandler={(flag) => this.props.onCloseAction(flag)}
            vehicle={this.props.vehicle.summary}
            id="remove"
          />
        );
        break;
      case "UPDATE_DOCUMENT_NO-STATUS":
        actionView = (
          <UpdateDocumentDate
            actionName={whatIsTheAction}
            actionHandler={this.UPDATE_DOCUMENT}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            date={this.state.date}
            dateHandler={this.dateHandler}
          />
        );
        break;
      case "UPDATE_VEHICLE_NO-STATUS":
        actionView = (
          <UpdateVehicle
            _make={this.props.vehicle.summary.make}
            _model={this.props.vehicle.summary.model}
            _year={this.props.vehicle.summary.year}
            _id={this.props.vehicle.summary.id}
            onSave={this.props.onUpdate}
            onClose={() => this.props.onCloseAction(false)}
          />
        );
        break;
      default:
    }

    return (
      <>
        <Dialog
          onClose={() => this.props.onCloseAction(false)}
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          aria-labelledby="max-width-dialog-title"
        >
          {actionView}
        </Dialog>
      </>
    );
  }
}

export default withWidth()(connect()(ActionsListener));
