// dependencies
import React, { useContext, useState, useEffect } from "react";
import TemplateContext from "../contexts/TemplateContext";
import AppContext from "../contexts/AppContext";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

// components
import {
  makeStyles,
  Typography,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Grid,
  Button,
  TextField,
  Box,
  Divider,
  ListItem,
} from "@material-ui/core";
import AlertDialog from "./helpers/AlertDialog";
import CustomTabs from "./helpers/Tabs";
import AttachmentIcon from "@material-ui/icons/Attachment";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    height: "800",
    maxHeight: "73vh",
    overflow: "auto",
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
  attachments: {
    display: "flex",
    justifyContent: "start",
    alignContent: "center",
    cursor: "pointer",
    marginBottom: 10,
    marginLeft: 10,
    width: "90%",
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

const CreateTemplate = () => {
  const classes = useStyles();
  let history = useHistory();

  const { reload, currentUserDetails, baseURL, alert, setAlert, setOpenAlert } =
    useContext(AppContext);
  const [groups, setGroups] = React.useState("");
  // const { children, value, index, ...other } = props;
  const [routeTemplate, setRouteTemplate] = useState({});
  const [stages, setStages] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [submitFlag, setSubmitFlag] = useState(false);

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

  const handleStageSubmit = (event, stageObj) => {
    event.preventDefault();

    switch (stageObj.time) {
      case "Hours":
        stageObj.suspense_hours = stageObj.suspense_integer;
        break;
      case "Days":
        stageObj.suspense_hours = stageObj.suspense_integer * 24;
        break;
      case "Weeks":
        stageObj.suspense_hours = stageObj.suspense_integer * 168;
        break;
      default:
        alert("Something went wrong! Please reload the page.");
    }

    setStages({ ...stages, [tabValue]: stageObj });
    // console.log(stages);
  };

  const setTemplateObject = async (e) => {
    e.preventDefault();
    let group_name = await document.getElementById("template_group_id")
      .childNodes[0].data;
    let group_id = currentUserDetails.groups.filter(
      (group) => group.group_name === group_name
    )[0].group_id;
    let name = await document.getElementById("template_name").value;
    let instructions = await document.getElementById("template_instructions")
      .value;

    await setRouteTemplate({
      group_id: group_id,
      name: name,
      instructions: instructions,
      stages: [],
    });

    setSubmitFlag(true);
  };

  const handleSubmit = async () => {
    if (
      !routeTemplate.group_id ||
      !routeTemplate.name ||
      !routeTemplate.instructions ||
      !stages
    ) {
      await setAlert({
        title: "Template Error",
        text: "Please fill out all the required fields before submitting the route template",
        closeAction: "Okay",
      });
      await setOpenAlert(true);
    } else {
      for (let property in stages) {
        routeTemplate.stages.push(stages[property]);
      }

      let response = await fetch(`${baseURL}/routes/templates/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeTemplate),
      })
        .then((resp) => resp)
        .catch((err) => err);
      console.log(response);
      if (response.status === 200) {
        history.push("/dashboard");
      } else {
        let message = await response.json();
        await setAlert({
          title: "Submission Error",
          text: message,
          closeAction: "Roger Roger",
        });
        await setOpenAlert(true);
      }
    }
  };

  if (submitFlag) {
    handleSubmit();
  }
  if (groups) {
    return (
      <TemplateContext.Provider
        value={{
          groups,
          setGroups,
          stages,
          setStages,
          tabValue,
          setTabValue,
          handleStageSubmit,
          currentUserDetails,
        }}
      >
        <AlertDialog bodyAlert={alert} />
        <div>
          <Grid container className={classes.root}>
            <Grid item xs={3}>
              <Paper style={{ padding: 20, marginRight: 20, height: 525 }}>
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
                    <InputLabel required shrink={true}>
                      Group
                    </InputLabel>
                    <Select
                      id="template_group_id"
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
                    id="template_name"
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
                    id="template_instructions"
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
                <div
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: 5,
                    marginTop: 40,
                  }}
                >
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      component="label"
                      color="default"
                      size="small"
                      style={{
                        marginBottom: 15,
                        marginTop: -20,
                        marginLeft: 10,
                      }}
                    >
                      Upload Document
                      <input type="file" hidden />
                    </Button>
                  </Grid>
                  <div style={{ maxHeight: 134, overflow: "auto" }}>
                    <ListItem className={classes.attachments} button>
                      <AttachmentIcon
                        style={{ fontSize: 20, marginRight: 5 }}
                      />
                      <Typography style={{ margin: "15px" }}>
                        <a href="/documents/SacredJedi.txt" download>
                          The Sacred Jedi Texts Volume 1
                        </a>
                      </Typography>
                    </ListItem>
                    <ListItem className={classes.attachments} button>
                      <AttachmentIcon
                        style={{ fontSize: 20, marginRight: 5 }}
                      />
                      <Typography style={{ margin: "15px" }}>
                        <a href="/documents/HitchhikersGuide.txt" download>
                          Hitchhiker's Guide to the Galaxy
                        </a>
                      </Typography>
                    </ListItem>
                    <ListItem className={classes.attachments} button>
                      <AttachmentIcon
                        style={{ fontSize: 20, marginRight: 5 }}
                      />
                      <Typography style={{ margin: "15px" }}>
                        <a href="/documents/ZappBrannigan.txt" download>
                          Zapp Brannigan Quotes
                        </a>
                      </Typography>
                    </ListItem>
                  </div>
                </div>
              </Paper>
              <Grid item xs={1} style={{ marginTop: 50 }}>
                <Button
                  variant="contained"
                  component="label"
                  color="secondary"
                  type="submit"
                  style={{
                    width: 170,
                    position: "relative",
                    top: -10,
                    left: 1000,
                  }}
                  onClick={(e) => {
                    setTemplateObject(e);
                  }}
                >
                  Save Template
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={9}>
              <Grid item xs={12} className={classes.tabs}>
                <Paper style={{ padding: 20, marginRight: 15 }}>
                  <CustomTabs />
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={11} />
          </Grid>
        </div>
      </TemplateContext.Provider>
    );
  } else {
    return (
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
  }
};

export default CreateTemplate;
