import React from "react";
import styles from "./trips.module.css";
import { Paper, Link } from "@material-ui/core";
import { translate } from "../../../utils/translate";
import backendURLS from "../../../config/backendURLS";
const Financial = (props) => {
  const { receipt, tripId, payment_method } = props;
  return (
    <Paper elevation={2} square>
      <div className={styles.invoiceWrraper}>
        <Link href={`${backendURLS.backendURL}/api/invoiceToPdf/${tripId}`}>
          {translate("PRINT")}
        </Link>

        <div className={styles.invoiceHeader}>
          <h4>{translate("BILL_DETAILS")}</h4>
        </div>
        <div className={styles.invoice}>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("STARTING_FARE")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.starting_fare}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("TOTAL_DISTANCE_FARE")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.total_distance_fare}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("TOTAL_TIME_FARE")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.total_time_fare}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("COMPENSATION")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.fare_compensation}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("SURGE_FARE")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.surge_fare}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("NIGHT_FARE")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.night_fare}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("SUB_TOTAL")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.total_fare3}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("PROMO_DISCOUNT")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{receipt && receipt.promo_discount}</p>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.elementName}>
              <p>{translate("PAYMENT_METHOD")}</p>
            </div>
            <div className={styles.elementValue}>
              <p>{payment_method ? payment_method : ""}</p>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.grandTotal}>
            <p>{translate("TOTAL_AMOUNT")}</p>
            <p className={styles.grandTotlaText}>
              {receipt && receipt.grand_total}
            </p>
          </div>
        </div>

        <div className={styles.notes}>
          <div style={{ margin: "3px 0" }}>
            {receipt &&
              receipt.arguments_used &&
              parseFloat(
                (receipt.arguments_used.total_travel_time +
                  receipt.arguments_used.total_waiting_time) /
                  60
              ).toFixed(0)}
            Min
          </div>
          <div>
            {receipt &&
              receipt.arguments_used &&
              receipt.arguments_used.distance &&
              (
                parseFloat(
                  receipt.arguments_used.distance
                    .split(",")
                    .reduce((acc, val) => acc + val)
                ) / 1000
              ).toFixed(3)}
            KM
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Financial;
