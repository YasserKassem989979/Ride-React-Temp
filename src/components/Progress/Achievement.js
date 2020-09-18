import React from 'react';
import { Typography, Box } from '@material-ui/core'

export const Achievement = ({ icon, title, caption, color }) => {

    return (
        <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", margin: "0.3em" }}>
            <Box> <i className={`fas fa-${icon}`} style={{ color: color }}/> </Box>
            <Box>
                <Typography variant="body1" component={"p"}>{title}</Typography>
            </Box>
        </Box>
    )
}