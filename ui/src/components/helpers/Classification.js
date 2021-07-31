import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  classificationBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    backgroundColor: "#007a33",
  },
  classification: {
    fontWeight: 600,
    color: "white",
  },
}));

const Classification = () => {
  const classes = useStyles();
  return (
    <div className={classes.classificationBar}>
      <Typography variant="body1" className={classes.classification}>
        UNCLASSIFIED
      </Typography>
    </div>
  );
};

export default Classification;
