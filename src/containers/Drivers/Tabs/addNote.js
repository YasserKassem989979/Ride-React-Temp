import React, { Component } from "react";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { translate } from "../../../utils/translate";
import axios from "../../../axios";
import InfiniteScroll from "react-infinite-scroll-component";
import NoteCard from "../../../components/Notes/noteCard";
import Alert from "../../../components/Alert/alert";
export class addNote extends Component {
  state = {
    note: "",
    note_error: false,
    isLoading: false,
  };

  onAddNote = () => {
    const { note } = this.state;
    const { personal } = this.props.driver;
    if (!note) {
      this.setState({ note_error: true });
      return;
    }
    this.setState({ isLoading: true });
    axios
      .post("/drivers/add_note", {
        driver_id: personal.id,
        note: note,
      })
      .then((res) => {
        Alert.success(translate("SUCCESS_REQUEST"));
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        Alert.error(err.data ? err.data.message : "ERROR");
      })
      .finally((fin) => {
        this.props.getDriver(personal.id);
      });
  };
  render() {
    const { notes } = this.props;
    const { note, note_error, isLoading } = this.state;
    return (
      <div style={styles.container}>
        <div style={{ marginBottom: 8 }}>
          <TextField
            label={translate("ADD_NOTE")}
            multiline
            style={{ display: "flex", flex: 1 }}
            rowsMax={6}
            rows={2}
            value={note}
            error={note_error}
            onChange={(e) =>
              this.setState({ note: e.target.value, note_error: false })
            }
            variant="outlined"
          />
        </div>
        <div style={styles.buttonBox}>
          <Button
            style={{ minHeight: 36 }}
            variant="contained"
            color="primary"
            onClick={this.onAddNote}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              translate("ADD")
            )}
          </Button>
        </div>
        {notes ? (
          <div>
            <div style={{ padding: 5 }}>
              <InfiniteScroll
                dataLength={notes.length}
                height={550}
                style={{ padding: "0 5px" }}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>{translate("NO_MORE_DATA")}</b>
                  </p>
                }
              >
                {notes &&
                  notes.length > 0 &&
                  notes.map((note) => {
                    return <NoteCard item={note} />;
                  })}
              </InfiniteScroll>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default addNote;

const styles = {
  container: {
    padding: "2px 10px",
  },
  label: {
    marginBottom: 5,
  },
  buttonBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
};
