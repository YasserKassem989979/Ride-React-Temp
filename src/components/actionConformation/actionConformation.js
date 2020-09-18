import React from "react";
import { Button, TextField, CircularProgress } from "@material-ui/core";
import styles from "./actionConformation.module.css";
import { translate } from "../../utils/translate";
// this component is the content of confomatin alert for actios, it takes actionName,name,cancelActionHandler, actionHandler as props
const ActionConformation = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.confirmationText}>
        <p>
          {translate("ARE_YOU_SURE")} {translate(props.actionName)} {props.name}
          ؟
        </p>
      </div>
      {props.textField ? (
        <div className={styles.confirmationText}>
          <TextField
            error={props.error}
            helperText={translate(props.helperText)}
            label="ملاحظات"
            value={props.note}
            variant="outlined"
            onChange={props.noteHandler}
          />
        </div>
      ) : null}
      <div className={styles.confirmationButtons}>
        <div className={styles.button}>
          <Button color="primary" onClick={props.cancelActionHandler}>
            {translate("GO_BACK")}
          </Button>
        </div>
        <div className={styles.button}>
          <Button
            variant="contained"
            style={{ backgroundColor: props.color, color: "#F2F2F2" }}
            onClick={props.actionHandler}
          >
            {translate(props.actionName)}{" "}
            {props.isLoading ? (
              <CircularProgress
                style={{ margin: "0 5px" }}
                size={12}
                color="#fff"
              />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionConformation;
