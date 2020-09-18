import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, Tooltip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { translate } from "../../utils/translate";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AddCircleIcon from "@material-ui/icons/AddCircle";
export class actionsMenu extends Component {
    state = {
        anchorEl: null
    };

    // to generate icon for an action
    getIcon = action => {
        switch (action) {
            case "UPDATE":
                return "far fa-edit";
            case "CANCEL":
                return "fas fa-ban";
            case "CLOSE":
                return "fas fa-times-circle";
            case "DELETE":
                return "fas fa-trash";
            case "REJECT":
                return "far fa-thumbs-down";
            case "ACTIVATE":
                return "fas fa-user-check";
            case "DEACTIVATE":
                return "fas fa-user-times";
            default:
                return "fas fa-user";
        }
    };

    getPermissionsToDoOnObject = (objectName, statusName) => {
        // document_id props
        let id = this.props.document_id || null;
        let date = this.props.documentDate || null;
        let actionsList = [];
        // to get the allowed permissions on object with specefic status from redux
        if (this.props.permissions && this.props.permissions[objectName] && (this.props.permissions[objectName][statusName] || this.props.permissions[objectName]["NO-STATUS"])) {
            const permissionsList = [...(this.props.permissions[objectName][statusName] || []), ...(this.props.permissions[objectName]["NO-STATUS"] || [])];
            permissionsList.forEach(permission => {
                actionsList.push(
                    <MenuItem
                        key={permission.label}
                        onClick={() => {
                            this.props.onActionClicked(permission.label, id, date);
                            this.handleClose();
                        }}>
                        <i style={{ margin: "0px 5px" }} className={this.getIcon(permission.icon)}></i>
                        {translate(permission.label)}
                    </MenuItem>
                );
            });
        }

        return actionsList;
    };

    renderMenuList = () => {
        if (this.props.object && this.props.status) {
            return this.getPermissionsToDoOnObject(this.props.object, this.props.status);
        }
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const notificationPermissions = this.props.permissions && this.props.permissions["NOTIFICATION"];
        const promoPermissions = this.props.permissions && this.props.permissions["PROMO-CODE"];
        const priceCardPermissions = this.props.permissions && this.props.permissions["PRICE-CARD"];
        const serviceAreaPermissions = this.props.permissions && this.props.permissions["SERVICE-AREA"];
        const JVPermissions = this.props.permissions && this.props.permissions["JV"];
        let menuIcon = (
            <IconButton
                style={this.props.iconButtonStyle}
                aria-label='more'
                aria-controls='long-menu'
                aria-haspopup='true'
                onClick={this.handleClick}>
                <MoreVertIcon />
            </IconButton>
        );

        // to check if the user has permission to create new NOTIFICATION
        if (JVPermissions && JVPermissions["CREATE"] && this.props.object === "JV" && this.props.status === null) {
            return (
                <Tooltip title={translate("CREATE_JV")}>
                    <IconButton onClick={() => this.props.onActionClicked("CREATE_JV")}>
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        // to check if the user has permission to create new NOTIFICATION
        let createIcon = null;
        if (
            notificationPermissions &&
            notificationPermissions["CREATE"] &&
            (this.props.object === "DRIVER" || this.props.object === "RIDER" || this.props.object === "SERVICE-AREA")
        ) {
            createIcon = (
                <Tooltip title={translate("CREATE_NOTIFICATION")}>
                    <IconButton onClick={() => this.props.onActionClicked("CREATE_NOTIFICATION")}>
                        <NotificationsIcon />
                    </IconButton>
                </Tooltip>
            );
        }

        // to check if the user has permission to create new PROMO
        let createPromoIcon = null;
        if (promoPermissions && promoPermissions["CREATE"] && this.props.object === "PROMO-CODE" && this.props.status === "NO_STATUS") {
            createPromoIcon = (
                <Tooltip title={translate("CREATE_PROMO-CODE")}>
                    <IconButton onClick={() => this.props.onActionClicked("CREATE_PROMO-CODE")}>
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            );

            return createPromoIcon;
        }

        // to check if the user has permission to create new PRICE_CARD
        let createPriceCardIcon = null;
        if (priceCardPermissions && priceCardPermissions["CREATE"] && this.props.object === "PRICE-CARD" && this.props.status === null) {
            createPriceCardIcon = (
                <Tooltip title={translate("CREATE_PRICE-CARD")}>
                    <IconButton onClick={() => this.props.onActionClicked("CREATE_PRICE-CARD")}>
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>
            );

            return createPriceCardIcon;
        }

        // to check if the user has permission to create new Service_area
        let serviceAreaIcon = null;
        if (
            serviceAreaPermissions &&
            serviceAreaPermissions["CREATE"] &&
            this.props.object === "SERVICE-AREA" && this.props.status === null
        ) {
            serviceAreaIcon = (
                <Tooltip title={translate("CREATE_SERVICE-AREA")}>
                    <IconButton
                        style={{ fontFamily: "Cairo", fontSize: "1rem", borderRadius: "0", color: "#14588d", fontWeight: "bold" }}
                        onClick={() => this.props.onActionClicked("CREATE_SERVICE-AREA")}>
                        <AddCircleIcon color='primary' />
                        {translate("CREATE_SERVICE-AREA")}
                    </IconButton>
                </Tooltip>
            );

            return serviceAreaIcon;
        }

        return (
            <div style={{ display: "flex" }}>
                {this.props.status && this.props.object && this.renderMenuList().length > 0 ? menuIcon : null}
                {createIcon}
                <Menu anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.handleClose}>
                    {this.props.status && this.props.object && this.renderMenuList()}
                </Menu>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    permissions: state.permissions.permissions
});

export default connect(mapStateToProps)(actionsMenu);
