import React from "react";
import DetailsCard from "../../../components/personalDetails/personslDetailsCard";
import { DriverContext } from "../DriversContainer";
import { translate } from "../../../utils/translate";
import profile from "../../../assets/FACEBOOK_LINE-01-512.png";
import classes from "../../Riders/Tabs/tabs.module.css";
import Avatar from "@material-ui/core/Avatar";
import { Paper, Hidden, Typography } from "@material-ui/core";
import SummaryBookingCard from "../../../components/summaryBookingCard/summaryBookingCard";
import { theme } from "../../../config/theme";
import config from "../../../config/backendURLS";
import "car-makes-icons/dist/style.css";
import ActionsMenu from "../../../components/actionsMenu/actionsMenu";
const driverPersonalDetails = prop => {
    return (
        <DriverContext.Consumer>
            {props => (
                <>
                    <DetailsCard>
                        <div className={classes.actionsMenu}>
                            <ActionsMenu
                                object={"DRIVER"}
                                status={props.state.driver.personal.verification_status}
                                onActionClicked={prop.onActionClicked}
                            />
                        </div>
                        <div className={classes.profilePhoto}>
                            <Avatar
                                src={
                                    props.state.driver && props.state.driver.personal.profile_image
                                        ? `${config.hostDomain}${props.state.driver.personal.profile_image}`
                                        : profile
                                }
                                alt='profile pic'
                                style={{ width: 75, height: 75 }}
                            />
                        </div>
                        <div className={classes.info}>
                            <div className={classes.part1}>
                                <div style={{ display: "flex" }}>
                                    <Typography component='h4' style={{ margin: 0, fontWeight: "600" }}>
                                        {props.state.driver && props.state.driver.personal.full_name}
                                    </Typography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography component='h5' style={{ margin: "0 3px" }}>
                                        {translate("THE_NUMBER")}:
                                    </Typography>
                                    <Typography component='h5' style={{ direction: "ltr", margin: 0 }}>
                                        {props.state.driver && props.state.driver.personal.phone_number}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.part2}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography component='h5' style={{ margin: "0 3px" }}>
                                        {translate("RATING")}:
                                    </Typography>
                                    <Typography component='h5' style={{ margin: 0 }}>
                                        {props.state.driver && props.state.driver.personal.rating}
                                    </Typography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography component='h5' style={{ margin: "0 3px" }}>
                                        {translate("GENDER")}:
                                    </Typography>
                                    <Typography component='h5' style={{ margin: 0 }}>
                                        {translate(props.state.driver && props.state.driver.personal.gender)}
                                    </Typography>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography component='h5' style={{ margin: "0 3px" }}>
                                        {translate("STATUS")}:
                                    </Typography>
                                    <Typography component='h5' style={{ margin: 0 }}>
                                        {translate(props.state.driver && props.state.driver.personal.verification_status)}
                                    </Typography>
                                </div>
                                {/* <div style={{ display: "flex", alignItems: "center" }}>
                                    <Typography component='h5' style={{ margin: "0 3px" }}>
                                        {translate("LTRC_NUMBER")}:
                                    </Typography>
                                    <Typography component='h5' style={{ margin: 0 }}>
                                        {
                                            props.state.driver
                                            && props.state.driver.vehicles
                                            && props.state.driver.vehicles[0]
                                            && props.state.driver.vehicles[0].documents
                                            ? props.state.driver.vehicles[0].documents.find(e => e.name.contains("LTRC")).number
                                            : "----"
                                        }
                                    </Typography>
                                </div> */}
                            </div>
                        </div>
                    </DetailsCard>
                    <div style={{ margin: "15px 0" }}>
                        <div className={classes.carDetails}>
                            <Paper style={{ background: theme().palette.primary.dark, padding: 5, color: "#fff" }}>
                                <Typography component='h4' style={{ padding: 0, margin: 0 }}>
                                    المركبات:
                                </Typography>
                            </Paper>
                            {props.state.driver.vehicles.map(vehicle => {
                                return (
                                    <div
                                        onClick={() => {
                                            props.navigation.history.push("/vehicles", { id: vehicle.id });
                                        }}
                                        key={vehicle.id}
                                        className={classes.carInfo}>
                                        <div className={classes.carInfoItem}>
                                            <p style={{ margin: "0 3px" }}>{translate("TYPE")}:</p>
                                            <Hidden xsDown>
                                                <p style={{ margin: 0, paddingTop: 4 }}>{vehicle.model}</p>
                                                <p style={{ margin: "0 4px", paddingTop: 4 }}>{vehicle.make}</p>
                                            </Hidden>
                                            <Hidden xsDown>
                                                <p style={{ margin: "0 2px", paddingTop: 4, fontSize: 17 }}>
                                                    <i className={`car-${vehicle.make.toLowerCase()}`}></i>
                                                </p>
                                            </Hidden>
                                        </div>
                                        <div className={classes.carInfoItem}>
                                            <p style={{ margin: "0 3px" }}>الرقم:</p>
                                            <p style={{ margin: 0 }}>{vehicle.number}</p>
                                        </div>
                                        <div className={classes.carInfoItem}>
                                            <Avatar
                                                src={`${config.hostDomain}${vehicle.image}`}
                                                alt='car pic'
                                                classes={{ root: classes.carAvatar }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={classes.trips}>
                        <Paper style={{ background: theme().palette.primary.dark, padding: 5, color: "#fff" }}>
                            <Typography component='h4' style={{ padding: 0, margin: 0 }}>
                                {translate("RIDES")}:
                            </Typography>
                        </Paper>
                        {props.state.driver && !props.state.isLoadingDriver && props.state.driver.rides.active_rides.length !== 0 ? (
                            <div>
                                {props.state.driver.rides.active_rides.map(ride => {
                                    return <SummaryBookingCard id='driver' key={ride.id} trip={ride} />;
                                })}
                            </div>
                        ) : null}
                        {props.state.driver && !props.state.isLoadingDriver && props.state.driver.rides.last_rides.length !== 0 ? (
                            <div>
                                {props.state.driver.rides.last_rides.map(ride => {
                                    return <SummaryBookingCard id='driver' key={ride.id} trip={ride} />;
                                })}
                            </div>
                        ) : null}
                    </div>
                    {props.state.driver &&
                    !props.state.isLoadingDriver &&
                    props.state.driver.rides.active_rides.length === 0 &&
                    props.state.driver.rides.last_rides.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <Typography component='h3'>{translate("NO_TRIPS")}</Typography>
                        </div>
                    ) : null}
                </>
            )}
        </DriverContext.Consumer>
    );
};

export default driverPersonalDetails;
