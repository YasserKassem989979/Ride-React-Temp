import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import {
  withWidth,
  Snackbar,
  SnackbarContent,
  Button,
} from "@material-ui/core";
// import styles from "./actionsListener.module.css"
import ActionConformation from "../../../components/actionConformation/actionConformation";
import axios from "../../../axios";
import Alert from "../../../components/Alert/alert";
import CreateNotification from "../../../components/NotificationCreator/CreateNotification";
import UpdateRider from "./updateRider";
import UpdateDocumentDate from "../../../components/actionUpdateDate/actionUpdateDate";
import moment from "moment";
export class ActionsListener extends Component {
  state = {
    fullWidth: true,
    maxWidth: "sm",
    open: true,
    deleteAlert: false,
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
  updateDocument = (action) => {
    this.setState({ isLoading: true });
    axios
      .put(`users/documents/${action}`, {
        id: this.props.documentIdForActionListener,
      })
      .then((res) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction(true);
          Alert.success("تمت العملية بنجاح");
        });
      })
      .catch((err) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction(false);
          Alert.error(err.data ? err.data.message : "ERROR");
        });
      });
  };

  updateStatus = (action) => {
    this.setState({ isLoading: true });
    axios
      .put(`users/${action}`, { user_id: this.props.rider.personal.id })
      .then((res) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction(true);
          Alert.success("تمت العملية بنجاح");
        });
      })
      .catch((err) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction(false);
          Alert.error(err.data ? err.data.message : "ERROR");
        });
      });
  };

  REJECT_DOCUMENT_PENDING = () => {
    this.updateDocument("reject");
  };

  APPROVE_DOCUMENT_PENDING = () => {
    this.updateDocument("approve");
  };

  ACTIVATE_RIDER = () => {
    this.updateStatus("activate");
  };

  DEACTIVATE_RIDER = () => {
    this.updateStatus("deactivate");
  };

  CREATE_NOTIFICATION = (data) => {
    this.setState({ isLoading: true });
    data.append("user_id", this.props.rider.personal.id);
    axios
      .post("/users/notify", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
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

  UPDATE_RIDER_VERIFIED = (data) => {
    this.setState({ isLoading: true });
    data.append("id", this.props.rider.personal.id);
    axios
      .post("/users/update", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
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

  DELETE_RIDER_PENDING = () => {
    this.setState({ deleteAlert: true, open: false });
  };

  continueDelete = () => {
    const { rider } = this.props;
    this.setState({ deleteAlert: false, isLoading: true }, () => {
      axios
        .delete("users" + rider.personal.id)
        .then((res) => {
          this.props.onCloseAction(true);
          Alert.success("تمت العملية بنجاح");
        })
        .catch((err) => {
          this.props.onCloseAction(false);
          Alert.error(err.data ? err.data.message : "ERROR");
        });
    });
  };

  UPDATE_DOCUMENT = () => {
    this.setState({ isLoading: true });
    axios
      .put("/drivers/documents/update_expiry_date", {
        document_id: this.props.documentIdForActionListener,
        expire_date: moment(this.state.date).format("YYYY-mm-DD"),
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
    const { whatIsTheAction, rider } = this.props;
    let actionView = null;
    switch (whatIsTheAction) {
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
      case "CREATE_NOTIFICATION":
        actionView = (
          <CreateNotification
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.CREATE_NOTIFICATION}
          />
        );
        break;
      case "ACTIVATE_RIDER_NO-STATUS":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.ACTIVATE_RIDER}
            color="green"
          />
        );
        break;
      case "DEACTIVATE_RIDER_NO-STATUS":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.DEACTIVATE_RIDER}
            color="#980000"
          />
        );
        break;
      case "UPDATE_RIDER_NOT-VERIFIED":
        actionView = (
          <UpdateRider
            isLoading={this.state.isLoading}
            rider={rider}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.UPDATE_RIDER_VERIFIED}
          />
        );
        break;
      case "UPDATE_RIDER_PENDING":
        actionView = (
          <UpdateRider
            isLoading={this.state.isLoading}
            rider={rider}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.UPDATE_RIDER_VERIFIED}
          />
        );
        break;
      case "UPDATE_RIDER_VERIFIED":
        actionView = (
          <UpdateRider
            isLoading={this.state.isLoading}
            rider={rider}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.UPDATE_RIDER_VERIFIED}
          />
        );
        break;

      case "DELETE_RIDER_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.DELETE_RIDER_PENDING}
            color="#980000"
          />
        );
        break;
      case "DELETE_RIDER_VERIFIED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.DELETE_RIDER_PENDING}
            color="#980000"
          />
        );
        break;
      case "DELETE_RIDER_NOT-VERIFIED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.DELETE_RIDER_PENDING}
            color="#980000"
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
      default:
        return null;
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
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={this.state.deleteAlert}
        >
          <SnackbarContent
            style={{ backgroundColor: "#D3392F" }}
            message={<p>لا يمكن التراجع عند القيام بالعملية</p>}
            action={[
              <Button
                style={{ color: "#D3392F", backgroundColor: "#fff" }}
                key="fkfkfkfkfkfk"
                size="small"
                onClick={this.continueDelete}
              >
                حذف الراكب
              </Button>,
              <Button
                style={{ color: "#fff" }}
                key="fkjkgifikfojf"
                size="small"
                onClick={() => this.props.onCloseAction(false)}
              >
                تراجع
              </Button>,
            ]}
          />
        </Snackbar>
      </>
    );
  }
}

export default withWidth()(connect()(ActionsListener));
