import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import { withWidth, Button } from "@material-ui/core";
// import styles from "./actionsListener.module.css"
import ActionConformation from "../../../components/actionConformation/actionConformation";
import axios from "../../../axios";
import Alert from "../../../components/Alert/alert";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import RejectionDriver from "./rejectDriverAction";
import CreateNotification from "../../../components/NotificationCreator/CreateNotification";
import UpdateDriver from "./updateDriver";
import UpdateDocumentDate from "../../../components/actionUpdateDate/actionUpdateDate";
import moment from "moment";

export class ActionsListener extends Component {
  state = {
    fullWidth: true,
    maxWidth: "sm",
    open: true,
    deleteAlert: false,
    error: false,
    helperText: "",
    note: "",
    isLoading: false,
    date: moment(),
  };

  noteHandler = (e) => {
    this.setState({
      error: false,
      helperText: "",
      note: e.target.value,
    });
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
  updateRequest = (action) => {
    const { driver } = this.props;
    this.setState({ isLoading: true });
    axios
      .put(`drivers/${action}/` + driver.personal.id)
      .then((res) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  DELETE_DRIVER_APPROVED = () => {
    this.setState({ deleteAlert: true, open: false });
  };

  continueDelete = () => {
    const { driver } = this.props;
    this.setState({ deleteAlert: false, isLoading: true }, () => {
      axios
        .delete("drivers/delete/" + driver.personal.id)
        .then((res) => {
          this.props.onCloseAction("delete");
          Alert.success("تمت العملية بنجاح");
        })
        .catch((err) => {
          this.props.onCloseAction(false);
          Alert.error(err.data ? err.data.message : "ERROR");
        });
    });
  };

  APPROVE_DRIVER_PENDING = () => {
    this.updateRequest("approve");
  };

  ACTIVATE_DRIVER_APPROVED = () => {
    this.updateRequest("activate");
  };

  DEACTIVATE_DRIVER_APPROVED = () => {
    this.updateRequest("deactivate");
  };

  APPROVE_DOCUMENT_PENDING = () => {
    this.setState({ isLoading: true });
    axios
      .put(`/drivers/documents/approve`, {
        id: this.props.documentIdForActionListener,
      })
      .then((res) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  REJECT_DOCUMENT_APPROVED = () => {
    if (this.state.note === "") {
      this.setState({ error: true, helperText: "FIELD_REQUIRED" });
      return;
    }
    this.setState({ isLoading: true });
    axios
      .put(`/drivers/documents/reject`, {
        document_id: [this.props.documentIdForActionListener],
        comment: this.state.note,
      })
      .then((res) => {
        this.setState({ open: false,isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  CREATE_NOTIFICATION = (data) => {
    this.setState({ isLoading: true });
    data.append("driver_id", this.props.driver.personal.id);
    this.setState({ isLoading: true });
    axios
      .post("/drivers/notify", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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
      .put("/drivers/documents/update_expiry_date", {
        document_id: this.props.documentIdForActionListener,
        expire_date: moment(this.state.date).format("YYYY-mm-DD"),
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  BLOCK_DRIVER_NO_STATUS = () => {
    this.setState({ isLoading: true });
    axios
      .put("/drivers/block", {
        driver_id: this.props.driver.personal.id,
        date: moment(this.state.date).format("YYYY-mm-DD"),
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  UNBLOCK_DRIVER_PENDING = () => {
    this.setState({ isLoading: true });
    axios
      .put("/drivers/unblock", {
        driver_id: this.props.driver.personal.id,
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  FORCE_OFFLINE_DRIVER_APPROVED = () => {
    this.setState({ isLoading: true });
    axios
      .put("/drivers/force_offline", {
        driver_id: this.props.driver.personal.id,
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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

  UPDATE_DRIVER_PENDING = (data) => {
    this.setState({ isLoading: true });
    data.append("id", this.props.driver.personal.id);
    axios
      .post("drivers/update", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      })
      .then((res) => {
        this.setState({ open: false, isLoading: false }, () => {
          this.props.onCloseAction("refresh");
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
    const { whatIsTheAction, driver } = this.props;
    let actionView = null;
    switch (whatIsTheAction) {
      case "APPROVE_DRIVER_PENDING":
      case "APPROVE_DRIVER_REJECTED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            name={driver.personal.full_name}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.APPROVE_DRIVER_PENDING}
            color="green"
          />
        );
        break;
      case "REJECT_DRIVER_PENDING":
        actionView = (
          <RejectionDriver
            driver={driver}
            actionName={whatIsTheAction}
            cancelActionHandler={() => {
              this.setState({ open: false,isLoading: false }, () => {
                this.props.onCloseAction(false);
              });
            }}
            successActionHandler={() => {
              this.setState({ open: false,isLoading: false }, () => {
                this.props.onCloseAction("refresh");
              });
            }}
          />
        );
        break;
      case "REJECT_DRIVER_APPROVED":
        actionView = (
          <RejectionDriver
            driver={driver}
            actionName={whatIsTheAction}
            cancelActionHandler={() => {
              this.setState({ open: false,isLoading: false }, () => {
                this.props.onCloseAction("refresh");
              });
            }}
            successActionHandler={() => {
              this.setState({ open: false,isLoading: false }, () => {
                this.props.onCloseAction("refresh");
              });
            }}
          />
        );
        break;
      case "DELETE_DRIVER_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            name={driver.personal.full_name}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.DELETE_DRIVER_APPROVED}
            color="#980000"
          />
        );
        break;
      case "ACTIVATE_DRIVER_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            name={driver.personal.full_name}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.ACTIVATE_DRIVER_APPROVED}
            color="green"
          />
        );
        break;
      case "DEACTIVATE_DRIVER_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            name={driver.personal.full_name}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.DEACTIVATE_DRIVER_APPROVED}
            color="#980000"
          />
        );
        break;
      case "UPDATE_DRIVER_PENDING":
        actionView = (
          <UpdateDriver
            isLoading={this.state.isLoading}
            driver={driver}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.UPDATE_DRIVER_PENDING}
          />
        );
        break;
      case "UPDATE_DRIVER_APPROVED":
        actionView = (
          <UpdateDriver
            isLoading={this.state.isLoading}
            driver={driver}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.UPDATE_DRIVER_PENDING}
          />
        );
        break;
      case "REJECT_DOCUMENT_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.REJECT_DOCUMENT_APPROVED}
            color="#980000"
            textField={true}
            error={this.state.error}
            helperText={this.state.helperText}
            noteHandler={this.noteHandler}
            note={this.state.note}
          />
        );
        break;
      case "REJECT_DOCUMENT_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.REJECT_DOCUMENT_APPROVED}
            color="#980000"
            textField={true}
            error={this.state.error}
            helperText={this.state.helperText}
            noteHandler={this.noteHandler}
            note={this.state.note}
          />
        );
        break;
      case "APPROVE_DOCUMENT_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
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
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.APPROVE_DOCUMENT_PENDING}
            color="green"
          />
        );
        break;
      case "CREATE_NOTIFICATION":
        actionView = (
          <CreateNotification
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(false)}
            actionHandler={this.CREATE_NOTIFICATION}
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
      case "BLOCK_DRIVER_APPROVED":
        actionView = (
          <UpdateDocumentDate
            actionName={whatIsTheAction}
            actionHandler={this.BLOCK_DRIVER_NO_STATUS}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            date={this.state.date}
            dateHandler={this.dateHandler}
            title="BLOCK_DRIVER_DATE"
            helperText="BLOCK_DRIVER_UNTIL_THE_DATE"
          />
        );
        break;
      case "UNBLOCK_DRIVER_PENDING":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction("refresh")}
            actionHandler={this.UNBLOCK_DRIVER_PENDING}
            color="green"
          />
        );
        break;
      case "FORCE-OFFLINE_DRIVER_APPROVED":
        actionView = (
          <ActionConformation
            isLoading={this.state.isLoading}
            actionName={whatIsTheAction}
            cancelActionHandler={() => this.props.onCloseAction(true)}
            actionHandler={this.FORCE_OFFLINE_DRIVER_APPROVED}
            color="green"
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
                حذف السائق
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
