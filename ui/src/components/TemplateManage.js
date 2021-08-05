// dependencies
import React, { useState, useEffect, useContext } from "react";
import AppContext from "../contexts/AppContext";
import { v4 as uuidv4 } from "uuid";

// components
import { makeStyles, Typography, Paper, Grid } from "@material-ui/core";
import AlertDialog from "./helpers/AlertDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const TemplateManage = () => {
  const { baseURL, setOpenAlert } = useContext(AppContext);
  const [templates, setTemplates] = useState([]);
  const [alert, setAlert] = useState({
    title: "Title",
    text: "Text",
    actions: "Actions",
    closeAction: "Close",
  });

  const classes = useStyles();

  useEffect(() => {
    fetch(`${baseURL}/routes/templates/get/all/details`)
      .then((res) => res.json())
      .then((data) => data);
  }, []);

  return (
    // <>
    //   <AlertDialog bodyAlert={alert}/>
    //   <Grid container className={classes.root}>
    //       <Typography variant="h5">Route Templates</Typography>
    //   </Grid>
    // </>
    <>
      <main>
        <div className="svg-loader">
          <svg
            className="svg-container"
            height="100"
            width="100"
            viewBox="0 0 100 100"
          >
            <circle className="loader-svg bg" cx="50" cy="50" r="45"></circle>
            <circle
              className="loader-svg animate"
              cx="50"
              cy="50"
              r="45"
            ></circle>
          </svg>
        </div>
      </main>
    </>
  );
};

//<Typography></Typography>
export default TemplateManage;
