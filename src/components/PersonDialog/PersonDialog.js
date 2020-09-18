import React from "react";
import {
    Avatar,
    Dialog,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    DialogTitle,
    ButtonBase,
    colors,
    LinearProgress
} from "@material-ui/core";
import { translate } from "../../utils/translate";
import { EmailOutlined, PhoneAndroidRounded, VerifiedUserOutlined, StarBorderOutlined, LocalTaxiOutlined } from "@material-ui/icons";
import backendURLS from "../../config/backendURLS";
import { withRouter } from "react-router-dom";


const _PersonDialog = ({
    fullName,
    rating,
    totalTrips,
    phoneNumber,
    email,
    image,
    open,
    onClose,
    onNameClick,
    onPhoneClick,
    status,
    loading
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            {loading && <LinearProgress/>}
            <ButtonBase onClick={onNameClick} style={{ background: "#eee", display: "flex", justifyContent: "center" }}>
                <DialogTitle>
                    <ListItem key={"PERSON_DIALOG_NAME"}>
                        <ListItemAvatar>
                            <Avatar src={backendURLS.hostDomain + image} />
                        </ListItemAvatar>
                        <ListItemText primary={fullName}/>
                    </ListItem>
                </DialogTitle>
            </ButtonBase>

            <DialogContent>
                <List>
                    {phoneNumber && (
                        //  Phone Number
                        <ListItem key={"PERSON_DIALOG_PHONE"} button component="a" href={"tel:" + phoneNumber}>
                            <ListItemAvatar>
                                <Avatar style={{ background: colors.green[500] }}>
                                    <PhoneAndroidRounded />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={phoneNumber} secondary={translate("PHONE_NUMBER")} />
                        </ListItem>
                    )}

                    {email && (
                        //  Email
                        <ListItem key={"PERSON_DIALOG_EMAIL"}>
                            <ListItemAvatar>
                                <Avatar style={{ background: colors.blue[500] }}>
                                    <EmailOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} secondary={translate("EMAIL")} />
                        </ListItem>
                    )}

                    {rating && (
                        //  Rating
                        <ListItem key={"PERSON_DIALOG_RATING"}>
                            <ListItemAvatar>
                                <Avatar style={{ background: colors.deepOrange[500] }}>
                                    <StarBorderOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={rating} secondary={translate("RATING")} />
                        </ListItem>
                    )}

                    {totalTrips && (
                        //  Total Trips
                        <ListItem key={"PERSON_DIALOG_TRIPS"}>
                            <ListItemAvatar>
                                <Avatar style={{ background: colors.indigo[500] }}>
                                    <LocalTaxiOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={totalTrips} secondary={translate("TOTAL_TRIPS")} />
                        </ListItem>
                    )}

                    {status && (
                        //  Status
                        <ListItem key={"PERSON_DIALOG_STATUS"}>
                            <ListItemAvatar>
                                <Avatar style={{ background: colors.red[500] }}>
                                    <VerifiedUserOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={translate(status)} secondary={translate("STATUS")} />
                        </ListItem>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export const PersonDialog = withRouter(_PersonDialog);