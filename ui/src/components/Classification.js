import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const Classification = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.classificationBar}>
            <Typography variant="h6">
            UNCLASSIFIED
            </Typography>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    classificationBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#007a33",
    },
}));

export default Classification;