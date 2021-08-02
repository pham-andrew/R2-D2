import React, { useContext, useState, useEffect } from "react";
import TemplateContext from "../contexts/TemplateContext";
import AppContext from "../contexts/AppContext";
import { makeStyles, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";
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

  const { currentUserDetails, baseURL, setOpenAlert, setAlert, alert } =
    useContext(AppContext);
  const [groups, setGroups] = React.useState("");
  // const { children, value, index, ...other } = props;
  const [routeTemplate, setRouteTemplate] = useState({});
  const [stages, setStages] = useState({});
  const [tabList, setTabList] = useState([
    {
      key: 0,
      id: 0,
    },
  ]);

  useEffect(() => {
    fetch(`${baseURL}/groups/`)
      .then((resp) => resp.json())
      .then((data) => setGroups(data));
  }, []);

  const handleGroupSelect = (event) => {
    let group_id = event.target.value;
    console.log(group_id);
    // setGroup(group_id);
    setRouteTemplate({ ...routeTemplate, group_id: group_id });
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setRouteTemplate({
      ...routeTemplate,
      [event.target.id]: event.target.value,
    });
  };

  const checkStages = () => {
    for (let property in stages) {
      if (
        !property.stage_name ||
        !property.stage_instructions ||
        !property.substages
      ) {
        return true;
        //alerts if any required stage fields are not filled out
      } else return false;
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();

    if (
      !routeTemplate.group_id ||
      !routeTemplate.name ||
      (!routeTemplate.instructions && checkStages)
    ) {
      await setAlert({
        title: "Submission Error",
        text: "Please fill out all the required fields in all of the template stages.",
        closeAction: "Okay",
      });
      await setOpenAlert(true);
    } else {
      console.log("posted template");
      for (let property in stages) {
        routeTemplate.stages.push(property);
      }
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
        stages,
        setStages,
        tabList,
        setTabList,
      }}
    >
      <div>
        <AlertDialog bodyAlert={alert} />
        <Grid container className={classes.root}>
          <Grid item xs={3}>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel>Group</InputLabel>
                <Select
                  id="group_id"
                  value={routeTemplate.group_id}
                  onChange={handleGroupSelect}
                  required
                >
                  {/* *TODO: map of user's group memberships */}
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
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />{" "}
              {/**TODO: Maps to name key for post */}
            </Grid>
            <Grid item xs={12} style={{ marginTop: "30px" }}>
              <TextField
                id="instructions"
                label="Template Instructions"
                multiline
                rows={4}
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: "20px" }}>
              <Button variant="contained" component="label" color="primary">
                Upload Document
                <input type="file" hidden />
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid item xs={12} className={classes.tabs}>
              <CustomTabs />
            </Grid>
          </Grid>
          <Grid item xs={10} />
          <Grid item xs={2} style={{ marginTop: "20px" }}>
            <Button variant="contained" component="label" onClick={handleClick}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </TemplateContext.Provider>
  );
};

export default CreateTemplate;
