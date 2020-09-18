import React from "react";
import {
    Card,
    Typography,
    CardContent,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Box,
    Divider,
    Grid,
    Paper
} from "@material-ui/core";
import moment from "moment";
import "moment/locale/ar";
import { translate } from "../../utils/translate";
import { store } from "../../";

function getHumanizedTime(startDate, endDate) {
    let language = store.getState().userPrefrence.lang; // ar, en
    moment.locale(language);

    let prefix = translate("ENDED") + " ";
    let humanizedTime = moment(endDate).fromNow();
    if (moment(startDate).diff(moment()) > 0) {
        prefix = translate("STARTS") + " ";
        humanizedTime = moment(startDate).fromNow();
    } else if (moment(endDate).diff(moment()) > 0) {
        prefix = translate("ENDS") + " ";
    }
    return `${prefix} ${humanizedTime}`;
}

export const PromoSummaryCard = ({ promo, amount, startDate, endDate, usedByNormal, usedByPink }) => {
    return (
        <Card style={{ height: "100%", maxHeight: 200 }}>
            <CardContent>
                <Typography variant='subtitle2' color='textSecondary' component={"sup"}>
                    {translate("PROMOCODE")}
                </Typography>
                <Box style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "space-between" }}>
                    <Typography color={"secondary"} gutterBottom>
                        {getHumanizedTime(startDate, endDate)}
                    </Typography>
                    <Typography variant='h4' component='h2'>
                        {promo} {amount}%
                    </Typography>
                </Box>
                <Divider />
                <Box style={{ display: "flex", justifyContent: "space-between", padding: "0px 2em" }}>
                    <Box  md={6} lg={6} sm={5} style={{ textAlign: "center", color: "#1458d8" }}>
                        <Typography variant='h2' component='h2'>
                            {usedByNormal}
                        </Typography>
                        <Typography variant='h5' component='h4'>
                            {"NORMAL"}
                        </Typography>
                    </Box>
                    <Box  md={6} lg={6} sm={5} style={{ textAlign: "center", color: "#a5a" }}>
                        <Typography variant='h2' component='h2'>
                            {usedByPink}
                        </Typography>
                        <Typography variant='h5' component='h4'>
                            {"PINK"}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
