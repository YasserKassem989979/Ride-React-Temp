import React from "react";
import styles from "./summaryBookingCard.module.css";
import { Paper, Hidden, Typography } from "@material-ui/core";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import { translate } from "../../utils/translate";
import { withWidth } from "@material-ui/core";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

const SummaryBookingCard = props => {
    const { trip } = props;

    const direction = useSelector(state => state.userPrefrence.direction);
    return (
        <Paper
            square
            style={{
                background: props.disabled ? "rgba(238, 238, 238, 0.81)" : "#fff" ,
                padding: "5px",
                margin: "7px 0",
                borderRight:
                    direction === "rtl"
                        ? `4px solid ${
                              trip && trip.category === "COMPLETED" ? "green" : trip.category === "ACTIVE" ? "#F8C445" : "#980000"
                          }`
                        : "none",
                borderLeft:
                    direction === "ltr"
                        ? `4px solid ${
                              trip && trip.category === "COMPLETED" ? "green" : trip.category === "ACTIVE" ? "#F8C445" : "#980000"
                          }`
                        : "none"
            }}
            onClick={() => (props.onClick ? props.onClick() : props.history.push("/rides", { id: trip.id }))}>
            <div className={styles.container} >
                <div className={styles.iconsPart}>
                    <div className={styles.element}>
                        <span style={{ margin: "0 3px" }}>
                            <i style={{ color: "#4479a5" }} className='fas fa-hashtag'></i>
                        </span>
                        <div>
                            <span style={{ margin: "0 3px" }}>{trip.id.toString().slice(trip.id.toString().length - 3)}</span>
                        </div>
                    </div>
                    {trip.date ? (
                        <Tooltip style={{ display: "flex" }} title={trip.date} placement='top'>
                            <div style={{ flexShrink: 1 }} className={styles.element}>
                                <span style={{ margin: "0 3px" }}>
                                    <i style={{ color: "#28AABF" }} className='fas fa-calendar-day'></i>
                                </span>
                                <div>
                                    <span style={{ margin: "0 3px" }}>{moment(trip.date).format("MM-DD")}</span>
                                </div>
                            </div>
                        </Tooltip>
                    ) : null}
                    {translate(trip.type)}
                </div>
                <div className={styles.infoPart}>
                    <div className={styles.nameInfo}>
                        {(trip.driver && props.id === "rider") || (trip.driver && props.id === "trip") ? (
                            <div className={styles.driver}>
                                <span style={{ margin: "0 3px" }}>
                                    <i style={{ color: "#4479a5" }} className='fas fa-user-tie'></i>
                                </span>
                                <Typography variant='subtitle1' component='summary' color='textSecondary'>
                                    {translate("DRIVER")}:{" "}
                                </Typography>
                                <div>
                                    <span style={{ margin: "0 3px" }}>{trip.driver.full_name}</span>
                                </div>
                            </div>
                        ) : null}
                        {(trip.rider && props.id === "driver") || (trip.rider && props.id === "trip") ? (
                            <div className={styles.driver}>
                                <span style={{ margin: "0 3px" }}>
                                    <i style={{ color: "#4479a5" }} className='fas fa-user'></i>
                                </span>
                                <Typography variant='subtitle1' component='summary' color='textSecondary'>
                                    {translate("RIDER")}:{" "}
                                </Typography>
                                <div>
                                    <span style={{ margin: "0 3px" }}>{trip.rider.full_name}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <Hidden xsDown>
                        <div className={styles.tripInfo}>
                            {trip.pickup_location ? (
                                <div className={styles.element2}>
                                    <span style={{ margin: "0 4px" }}>
                                        <i style={{ color: "#EA4335" }} className='fas fa-location-arrow'></i>
                                    </span>
                                    <Typography variant='subtitle1' component='summary' color='textSecondary'>
                                        {translate("PICK_UP")}:{" "}
                                    </Typography>
                                    <div>
                                        <span>
                                            {props.id !== "trip" ? (
                                                <a
                                                    className={styles.link}
                                                    href={trip.pickup_location_url ? trip.pickup_location_url : "#"}
                                                    style={{ textDecoration: "none", margin: "0 3px" }}
                                                    target='_blank'
                                                    rel='noopener noreferrer'>
                                                    {trip.pickup_location}
                                                </a>
                                            ) : (
                                                <p style={{ margin: 0 }}>{trip.pickup_location}</p>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                            {trip.drop_location ? (
                                <div className={styles.element2}>
                                    <span style={{ margin: "0 5px" }}>
                                        <i style={{ color: "#469615" }} className='fas fa-map-marker-alt'></i>
                                    </span>
                                    <Typography variant='subtitle1' component='summary' color='textSecondary'>
                                        {translate("DROP_LOCATION")}:{" "}
                                    </Typography>
                                    <div>
                                        <span>
                                            {props.id !== "trip" ? (
                                                <a
                                                    className={styles.link}
                                                    href={trip.drop_location_url ? trip.drop_location_url : "#"}
                                                    style={{ textDecoration: "none", margin: "0 3px" }}
                                                    target='_blank'
                                                    rel='noopener noreferrer'>
                                                    {trip.drop_location}
                                                </a>
                                            ) : (
                                                <p style={{ margin: 0 }}>{trip.drop_location}</p>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Hidden>
                </div>
            </div>
            <span style={{ width: "100%" }}>
                {translate("STATUS")} : {translate(trip.status)} {"   "}
            </span>
            <span style={{ float: "left" }}>
                {translate("SERVICE_TYPE")} : {translate(trip.service_type)}
            </span>
        </Paper>
    );
};

export default withWidth()(withRouter(SummaryBookingCard));
