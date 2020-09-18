import React, { useState } from "react";
import { TripContext } from "../TripsContainer";
import { translate } from "../../../utils/translate";
import styles from "./trips.module.css";
import {
    Paper,
    Modal,
    Card,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    Tooltip,
    colors,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import profile from "../../../assets/FACEBOOK_LINE-01-512.png";
import config from "../../../config/backendURLS";
// import AnnouncementIcon from '@material-ui/icons/Announcement';
import TodayIcon from "@material-ui/icons/Today";
import RoomIcon from "@material-ui/icons/Room";
import NavigationOutlinedIcon from "@material-ui/icons/NavigationOutlined";
import CancelIcon from "@material-ui/icons/Cancel";
import TripTimeLine from "./TripTimeline.js";
import TripMap from "./tripMap";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import DeviceUnknownIcon from "@material-ui/icons/DeviceUnknown";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import DetailsIcon from "@material-ui/icons/Details";
import { PersonDialog } from "../../../components/PersonDialog/PersonDialog";
import { withRouter } from "react-router-dom";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";

const TripDetails = props => {
    const decodeRequestStatusToIcon = status => {
        switch (status) {
            case 1:
                return (
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "1em 0px", fontSize: 11 }}> {translate("WAITING")}</div>
                        <HourglassEmptyIcon />
                    </div>
                );
            case 2:
                return (
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "1em 0px", fontSize: 11 }}> {translate("ACCEPTED")}</div>
                        <DoneAllIcon />
                    </div>
                );
            case 3:
                return (
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "1em 0px", fontSize: 11 }}> {translate("REJECTED")}</div>
                        <ThumbDownIcon />
                    </div>
                );
            default:
                return (
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "1em 0px", fontSize: 11 }}> {translate("NOT_RECEIVED")}</div>
                        <DeviceUnknownIcon />
                    </div>
                );
        }
    };

    const formatDistanceToReadable = distance => {
        return Math.round(parseFloat(distance) * 100) / 100 + "KM";
    };

    const [route, setRoute] = useState("/drivers");
    const [openPersonDialog, setOpenPersonDialog] = useState(false);
    const [person, setPerson] = useState({});

    const [open, setOpen] = useState(false);
    const _openModal = () => {
        setOpen(true);
    };
    const _closeModal = () => {
        setOpen(false);
    };

    const _onRiderClick = person => {
        console.log(person);
        setPerson({
            id: person.id,
            fullName: person.full_name,
            rating: person.rating,
            totalTrips: person.total_rides,
            phoneNumber: person.phone_number,
            email: person.email,
            image: person.profile_image,
            status: person.verification_status
        });
        setOpenPersonDialog(true);
        setRoute("/riders");
    };

    const _onDriverClick = person => {
        setPerson({
            id: person.id,
            fullName: person.full_name,
            rating: person.rating,
            totalTrips: person.total_rides,
            phoneNumber: person.phone_number,
            email: person.email,
            image: person.profile_image,
            status: person.verification_status
        });
        setOpenPersonDialog(true);
        setRoute("/drivers");
    };

    return (
        <TripContext.Consumer>
            {({ state }) => (
                <>
                    <Paper elevation={2} style={{ marginBottom: state.trip.time_line ? 0 : 15 }} square>
                        <div style={{ padding: "0 3px", display: "flex", justifyContent: "space-between" }}>
                            <h3 style={{ margin: 0 }}>{translate("معلومات الرحلة:")}</h3>
                            {state.trip.driver_request.length ? (
                                <Tooltip title={translate("DRIVERS_REQUEST")} style={{ cursor: "pointer" }}>
                                    <Badge color='secondary' onClick={_openModal} badgeContent={state.trip.driver_request.length}>
                                        <AssignmentIndIcon color='primary' />
                                    </Badge>
                                </Tooltip>
                            ) : null}
                        </div>
                        <PersonDialog
                            {...person}
                            open={openPersonDialog}
                            onClose={() => {
                                setOpenPersonDialog(false);
                            }}
                            onNameClick={() => {
                                props.history.push(route, { id: person.id });
                            }}
                        />

                        <div className={styles.tripContainer}>
                            <div className={styles.part1}>
                                {state.trip && state.trip.summary && state.trip.summary.id ? (
                                    <div className={styles.driver}>
                                        <div className={styles.tripNumber}>
                                            <i className='fas fa-hashtag'></i>
                                        </div>
                                        <label style={{ margin: "0 9px" }} className={styles.driverLabel}>
                                            {translate("THE_NUMBER")}:
                                        </label>

                                        <p style={{ margin: 0 }}>{state.trip.summary.id}</p>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.driver ? (
                                    <div className={styles.driver} onClick={() => _onDriverClick(state.trip.driver)}>
                                        <Avatar
                                            src={
                                                state.trip.driver.profile_image
                                                    ? `http://api.ride-int.com/${state.trip.driver.profile_image}`
                                                    : profile
                                            }
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <label className={styles.driverLabel}>{translate("DRIVER")}:</label>

                                        <p style={{ margin: 0 }}>{state.trip.summary.driver.full_name}</p>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.rider ? (
                                    <div
                                        className={styles.driver}
                                        onClick={() => {
                                            _onRiderClick(state.trip.rider);
                                        }}>
                                        <Avatar
                                            src={
                                                state.trip.rider.profile_image
                                                    ? `${config.hostDomain}${state.trip.rider.profile_image}`
                                                    : profile
                                            }
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <label className={styles.driverLabel}>{translate("RIDER")}:</label>
                                        <p style={{ margin: 0 }}>{state.trip.summary.rider.full_name}</p>
                                    </div>
                                ) : null}
                            </div>
                            <div className={styles.part2}>
                                {state.trip && state.trip.summary && state.trip.summary.date ? (
                                    <div className={styles.driver}>
                                        <TodayIcon style={{ color: "#317e9e" }} />
                                        <label className={styles.driverLabel}>{translate("DATE")}:</label>
                                        <p style={{ margin: 0 }}>{state.trip.summary.date}</p>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.pickup_location ? (
                                    <div className={styles.driver}>
                                        <NavigationOutlinedIcon color='error' />
                                        <label className={styles.driverLabel}>{translate("PICK_UP")}:</label>
                                        <a
                                            href={state.trip.summary.pickup_location_url}
                                            style={{ margin: 0, textDecoration: "none", color: "black" }}
                                            target='_blank'
                                            rel='noopener noreferrer'>
                                            {state.trip.summary.pickup_location}
                                        </a>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.drop_location ? (
                                    <div className={styles.driver}>
                                        <RoomIcon style={{ color: "green" }} />
                                        <label className={styles.driverLabel}>{translate("DROP_LOCATION")}:</label>
                                        <a
                                            href={state.trip.summary.drop_location_url}
                                            style={{ margin: 0, textDecoration: "none", color: "black" }}
                                            target='_blank'
                                            rel='noopener noreferrer'>
                                            {state.trip.summary.drop_location}
                                        </a>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.cancel_reason ? (
                                    <div className={styles.driver}>
                                        <CancelIcon />
                                        <label className={styles.driverLabel}>{translate("CANCEL_REASON")}:</label>
                                        <p style={{ margin: 0, textDecoration: "none" }}>{translate(state.trip.summary.cancel_reason)}</p>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.status ? (
                                    <div className={styles.driver}>
                                        <DetailsIcon color={colors.deepOrange[500]} />
                                        <label className={styles.driverLabel}>{translate("STATUS")}:</label>
                                        <p style={{ margin: 0, textDecoration: "none" }}>{translate(state.trip.summary.status)}</p>
                                    </div>
                                ) : null}
                                {state.trip && state.trip.summary && state.trip.summary.ride_later_date ? (
                                    <div className={styles.driver}>
                                        <AccessAlarmIcon color={colors.deepOrange[500]} />
                                        <label className={styles.driverLabel}>{translate("DUE_DATE")}:</label>
                                        <p style={{ margin: 0, textDecoration: "none" }}>{translate(state.trip.summary.ride_later_date)}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Paper>
                    {state.trip.time_line ? (
                        <Paper square elevation={2} style={{ margin: "30px 0", overflow: "hidden" }}>
                            <div style={{ padding: "0 3px" }}>
                                <h3 style={{ margin: 0 }}>{translate("TIMELINE")}:</h3>
                            </div>
                            <div style={{ minHeight: 100, display: "flex" }}>
                                <TripTimeLine steps={state.trip.time_line} />
                            </div>
                        </Paper>
                    ) : null}

                    <Paper square elevation={2} style={{ overflow: "hidden" }}>
                        <TripMap path={state.trip.way_points} />
                    </Paper>

                    <Modal
                        open={open}
                        onClose={_closeModal}
                        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", outline: 0 }}>
                        <Card style={{ width: 500, outline: 0, maxHeight: "100vh", overflow: "scroll" }}>
                            <CancelIcon onClick={_closeModal} color='error' />
                            <List style={{ height: "100%" }}>
                                {state.trip.driver_request.map(driver => (
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={config.hostDomain + "/" + driver.image} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={driver.full_name}
                                            secondary={formatDistanceToReadable(driver.distance_from_pickup)}
                                        />
                                        <ListItemIcon>{decodeRequestStatusToIcon(driver.request_status)}</ListItemIcon>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Modal>
                </>
            )}
        </TripContext.Consumer>
    );
};

export default withRouter(TripDetails);
