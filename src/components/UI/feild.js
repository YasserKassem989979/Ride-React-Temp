import React from "react";
import { Paper, Typography } from "@material-ui/core";
export const Field = ({ title, value, paperProps }) => {
    console.log({ title, value, paperProps });
    return (
        <Paper elevation={0} square style={{ padding: 2, display: "flex", justifyContent: "space-between", margin: 2 }} {...paperProps}>
            <Typography variant={"body1"}>{title}</Typography>
            <Typography variant={"body2"}>{value}</Typography>
        </Paper>
    );
};
