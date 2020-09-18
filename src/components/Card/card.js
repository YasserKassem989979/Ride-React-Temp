import React from "react";
import styles from "./card.module.css";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import img from "../../assets/FACEBOOK_LINE-01-512.png";
import config from "../../config/backendURLS";
import { translate } from "../../utils/translate";
import { Typography } from "@material-ui/core";
import moment from "moment";
const card = props => {
    return (
        <Paper>
            <div onClick={props.onClick} className={styles.card} style={props.style}>
                <div className={styles.photo}>
                    <Avatar alt='profile' src={props.img ? `${config.hostDomain}${props.img}` : img} className={styles.avatar} />
                </div>
                <div className={styles.content}>
                    <div className={styles.headerContent}>
                        <h4 style={{ margin: 0, color: "#14588d", fontWeight: "normal" }}>
                            {props.headerTitle ? props.headerTitle : "Name"}
                        </h4>
                    </div>
                    <div className={styles.bodyContent}>
                        {props.fileds ? (
                            props.fileds.map(filed => {
                                return (
                                    <div key={Math.random()} style={{ margin: "0 1px" }}>
                                        {filed && filed.text ? (
                                            <>
                                                <i
                                                    className={`fas fa-${filed && filed.icon ? filed.icon : "question"}`}
                                                    style={{
                                                        padding: "1px 3px",
                                                        fontSize: 16,
                                                        color: filed.color ? filed.color : "#4479a5"
                                                    }}></i>
                                                {filed && filed.text ? (
                                                    <span style={{ display: "inline-block", direction: "ltr" }}>{filed.text}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                );
                            })
                        ) : (
                            <h4>{translate("NO_DATA")}</h4>
                        )}
                    </div>
                </div>
                <div className={styles.extraContent}>
                    <div style={{ position: "relative" }}>
                        {props.status && props.status === "VERIFIED" ? (
                            <>
                                {" "}
                                <i className={`fas fa-certificate`} style={{ fontSize: 35, color: "#F683AC", position: "relative" }}></i>
                                <p className={styles.pink_certificate}>pink</p>
                            </>
                        ) : null}
                    </div>
                    <Typography variant='subtitle1' component='p' color="textSecondary" style={{ fontSize: 12 }}>
                        {moment(props.data.create_datetime).format("YYYY-MM-DD")}
                    </Typography>
                </div>
            </div>
        </Paper>
    );
};

export default card;
