import React from "react";
import DetailsCard from "../../../components/personalDetails/personslDetailsCard";
import { translate } from "../../../utils/translate";
import profile from "../../../assets/FACEBOOK_LINE-01-512.png";
import classes from "../../Riders/Tabs/tabs.module.css";
import Avatar from "@material-ui/core/Avatar";
import config from "../../../config/backendURLS";
import { ButtonBase, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
const VehiclesDrivers = props => {
    const { drivers } = props.vehicle;
    return (
        <>
            {drivers &&
                drivers.length > 0 &&
                drivers.map(driver => {
                    return (
                        <ButtonBase  style={{  width: "100%" }} key={driver.id} onClick={()=>{ props.history.push("/drivers", { id: driver.id }); }}>
                            <DetailsCard  style={{ margin: "5px 0", width: "100%" }}>
                                <div style={styles.profilePhoto}>
                                    <Avatar
                                        src={driver && driver.profile_image ? `${config.hostDomain}${driver.profile_image}` : profile}
                                        alt='profile pic'
                                        style={{ width: 75, height: 75 }}
                                    />
                                </div>
                                <div className={classes.info}>
                                    <div className={classes.part1}>
                                        <div style={{ display: "flex" }}>
                                            <Typography variant="body1" component="h4" style={{ margin: 0, fontWeight: "600" }}>{driver && driver.full_name}</Typography>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" component="h5" style={{ margin: "0 3px" }}>{translate("THE_NUMBER")}:</Typography>
                                            <Typography variant="body1" component="h5" style={{ direction: "ltr", margin: 0 }}>{driver && driver.phone_number}</Typography>
                                        </div>
                                    </div>

                                    <div style={styles.part2}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" component="h5" style={{ margin: "0 3px" }}>{translate("RATING")}:</Typography>
                                            <Typography variant="body1" component="h5" style={{ margin: 0 }}>{driver && driver.rating}</Typography>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" component="h5" style={{ margin: "0 3px" }}>{translate("GENDER")}:</Typography>
                                            <Typography variant="body1" component="h5" style={{ margin: 0 }}>{translate(driver && driver.gender)}</Typography>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Typography variant="body1" component="h5" style={{ margin: "0 3px" }}>{translate("STATUS")}:</Typography>
                                            <Typography variant="body1" component="h5" style={{ margin: 0 }}>{translate(driver && driver.verification_status)}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </DetailsCard>
                        </ButtonBase>
                    );
                })}
            {drivers && drivers.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h4>لا يوجد سائقين.</h4>
                </div>
            ) : null}
        </>
    );
};

const styles = {
    container: {
        display: "flex"
    },
    profilePhoto: {
        display: "flex",
        flexBasis: "15%"
    },
    info: {
        display: "flex",
        flexBasis: "85%"
    },
    part2: {
        display: "flex",
        justifyContent: "space-evenly",
        flexBasis: "64%",
        alignItems: "flex-end",
        flexWrap: "wrap"
    }
};

export default withRouter(VehiclesDrivers);
