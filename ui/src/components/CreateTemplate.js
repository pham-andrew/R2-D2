import React, { useContext, useState, useEffect } from "react";
import TemplateContext from "../contexts/TemplateContext";
import AppContext from "../contexts/AppContext";
import { makeStyles, Typography, Paper } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Box, Divider } from "@material-ui/core";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import AlertDialog from "./helpers/AlertDialog";
import CustomTabs from "./helpers/Tabs";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
    marginBottom: 20,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//   };
// }

const CreateTemplate = (props) => {
  const classes = useStyles();

  const { reload, currentUserDetails, baseURL, setOpenAlert, setAlert, alert } =
    useContext(AppContext);
  const [groups, setGroups] = React.useState("");
  // const { children, value, index, ...other } = props;
  const [routeTemplate, setRouteTemplate] = useState({});

  useEffect(() => {
    fetch(`${baseURL}/groups/`)
      .then((resp) => resp.json())
      .then((data) => setGroups(data));
  }, [reload]);

  // function handleChange(event) {
  //   setRouteTemplate({
  //     ...routeTemplate,
  //     [event.target.id]: event.target.value,
  //   });
  // }

  // const checkStages = () => {
  //   for (let property in stages) {
  //     if (
  //       !property.stage_name ||
  //       !property.stage_instructions ||
  //       !property.substages
  //     ) {
  //       return true;
  //     } else return false;
  //   }
  // };

  const handleClick = async (event) => {
    event.preventDefault();

    if (
      !routeTemplate.group_id ||
      !routeTemplate.name ||
      !routeTemplate.instructions // && checkStages
    ) {
      await setAlert({
        title: "Submission Error",
        text: "Please fill out all the required fields in all of the template stages.",
        closeAction: "Okay",
      });
      await setOpenAlert(true);
    } else {
      console.log("posted template");
      // for (let property in stages) {
      //   // switch (property.time) {
      //   //   case "Hours":
      //   //     return setStages(
      //   //       (property.suspense_hours = property.suspense_integer)
      //   //     );
      //   //   case "Days":
      //   //     return setStages(
      //   //       (property.suspense_hours = property.suspense_integer * 24)
      //   //     );
      //   //   case "Weeks":
      //   //     return setStages(
      //   //       (property.suspense_hours = property.suspense_integer * 168)
      //   //     );
      //   // }
      //   setRouteTemplate(routeTemplate.stages.push(property));
      // }
      console.log(routeTemplate);
      //let  fetch(`${baseURL}/routes/templates/post`, {
      //  methood: "POST",
      //  headers: ,
      //  body: JSON.stringify(routeTemplate)
      //})
    }
  };

  // const [tab, setTab] = React.useState(0);

  // const handleTab = (event, newValue) => {
  //   setTab(newValue);
  // };

  return (
    <TemplateContext.Provider
      value={{
        groups,
        setGroups,
        routeTemplate,
        setRouteTemplate,
      }}
    >
      <div>
        <AlertDialog bodyAlert={alert} />
        <Grid container className={classes.root}>
          <Grid item xs={3}>
            <Paper style={{ padding: 20, marginRight: 20 }}>
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  style={{ marginBottom: 10, fontWeight: 600 }}
                >
                  Route Details
                </Typography>
                <Grid item xs={12}>
                  <Divider
                    orientation="horizontal"
                    style={{ marginBottom: 20 }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel required={true} shrink={true}>
                    Group
                  </InputLabel>
                  <Select
                    id="group_id"
                    // onChange={handleChange}
                  >
                    <MenuItem defaultValue="" disabled>
                      <em>Your Memberships</em>
                    </MenuItem>
                    {currentUserDetails.groups.map((group) => {
                      return (
                        <MenuItem value={group.group_id} key={uuidv4()}>
                          {group.group_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  label="Template Name"
                  // onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 30 }}>
                <TextField
                  id="instructions"
                  label="Template Instructions"
                  multiline
                  rows={4}
                  variant="outlined"
                  // onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <Button variant="contained" component="label" color="primary">
                  Upload Document
                  <input type="file" hidden />
                </Button>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Grid item xs={12} className={classes.tabs}>
              <Paper style={{ padding: 20, marginRight: 15 }}>
                <CustomTabs />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={11} />
          <Grid item xs={1} style={{ marginTop: 20 }}>
            <Button
              variant="contained"
              component="label"
              onClick={handleClick}
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </TemplateContext.Provider>
  );
};

export default CreateTemplate;
