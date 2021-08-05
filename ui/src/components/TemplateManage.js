//create request

// Dependencies
import React from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../contexts/AppContext";

// Components
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Paper,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import AlertDialog from "./helpers/AlertDialog";

//icons
// import CheckIcon from "@material-ui/icons/Check";
// import CloseIcon from "@material-ui/icons/Close";
import AttachmentIcon from "@material-ui/icons/Attachment";

// import "../styles/loading.css";
import { v4 as uuidv4 } from "uuid";

//BaseUrl
const baseURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:8080`
    : `https://sdi05-05.staging.dso.mil/api`;

//2nd
const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    marginTop: -10,
    marginLeft: -5,
    maxHeight: "75vh",
    maxWidth: "90vw",
    overflowY: "auto",
    overflowX: "none",
  },
  formControl: {
    maxWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
  paperSecond: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  attachments: {
    display: "flex",
    justifyContent: "start",
    alignContent: "center",
    cursor: "pointer",
    marginBottom: 5,
    marginLeft: 10,
    width: "90%",
  },
}));

const TemplateManage = () => {
  const classes = useStyles();
  const { currentUserDetails, alert, setAlert, setOpenAlert } =
    React.useContext(AppContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [supervisor, setSupervisor] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState(null);
  const [templateGroups, setTemplateGroups] = React.useState(null);
  const [template, setTemplate] = React.useState(0);
  const [templates, setTemplates] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState(0);

  const history = useHistory();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    setTemplate(event.target.value);
  };

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await setAlert({
      title: `Delete ${templates[template].route_name}`,
      text: `Are you sure you want to delete ${templates[template].route_name}?`,
      actions: (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginBottom: -5, marginRight: 5 }}
          onClick={async (e) => {
            let response = await fetch(`${baseURL}/routes/templates/delete`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                route_template_id: templates[template].route_id,
              }),
            })
              .then((resp) => resp)
              .catch((err) => err);
            if (response.status === 200) {
              await handleClose();
              await setAlert({
                title: "Delete Template Successful",
                text: `The template, ${templates[template].route_name}, was successfully deleted.`,
                closeAction: "Okay",
              });
              await setOpenAlert(true);
              history.push("/dashboard");
            } else {
              let message = await response.json();
              await setAlert({
                title: "Deletion Error",
                text: message.message,
                closeAction: "Roger Roger",
              });
              await setOpenAlert(true);
            }
          }}
        >
          Confirm
        </Button>
      ),
    });
    await setOpenAlert(true);
  };

  React.useEffect(async () => {
    let response = await fetch(`${baseURL}/routes/templates/get/all/details`);
    if (response.status === 200) {
      let data = await response.json();
      setTemplates([...data]);
    } else {
      let err = await response.json();
      return console.log(err);
    }

    await fetch(`${baseURL}/groups/?include_users=true`)
      .then((res) => res.json())
      .then((data) => {
        setAllGroups(data);
      })
      .catch((err) => console.log(err));

    if (templates && allGroups) {
      let tmpArray = {};
      templates[template].stages.forEach((stage) => {
        tmpArray[stage.stage_id] = [];
        stage.substages.forEach((substage) => {
          allGroups.forEach((group) => {
            if (group.group_id === substage.substage_id) {
              tmpArray[stage.stage_id].push(group);
              return;
            }
          });
        });
      });
      setTemplateGroups(tmpArray);
    }
  }, []);

  React.useEffect(() => {
    if (templates && allGroups) {
      let tmpArray = {};
      templates[template].stages.forEach((stage) => {
        tmpArray[stage.stage_id] = [];
        stage.substages.forEach((substage) => {
          allGroups.forEach((group) => {
            if (group.group_id === substage.group_id) {
              tmpArray[stage.stage_id].push(group);
              return;
            }
          });
        });
      });
      setTemplateGroups(tmpArray);
    }
    setTimeout(() => {}, 1000);
  }, [templates, template, allGroups]);

  function getStageContent(step, stage) {
    let stageGroups = null;

    if (stage.substages[0].supervisor_id) {
      fetch(`${baseURL}/users/${stage.substages[0].supervisor_id}`)
        .then((res) => res.json())
        .then((data) =>
          setSupervisor(`${data.fname} ${data.lname} (${data.rank})`)
        );
    }

    if (stage.substages[selectedGroup]) {
      if (templateGroups) {
        if (templateGroups[stage.stage_id]) {
          stageGroups = templateGroups[stage.stage_id];
        }
      }

      return (
        <Grid container>
          <Grid item xs={8}>
            {stage.label}
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item style={{ marginLeft: -40 }}>
                <Typography style={{ fontWeight: 600 }}>Substages</Typography>
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {stage.substages.map((group, index) => {
                      return (
                        <ListItem
                          key={uuidv4()}
                          role="listitem"
                          button
                          onClick={() => setSelectedGroup(index)}
                        >
                          {stage.substages[0].supervisor_id ? (
                            `Supervisor`
                          ) : (
                            <>
                              {" "}
                              {stageGroups
                                ? stageGroups[index].group_name
                                : `${group.group_id}`}{" "}
                            </>
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Grid>
              <Grid item style={{ marginLeft: 20 }}>
                <Typography style={{ fontWeight: 600 }}>Member List</Typography>
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {stage.substages[0].supervisor_id ? (
                      <ListItem key={uuidv4()} role="listitem">
                        {supervisor}
                      </ListItem>
                    ) : (
                      <>
                        {stageGroups ? (
                          stageGroups[selectedGroup].users.map((member) => (
                            <ListItem key={uuidv4()} role="listitem" button>
                              <ListItemText
                                primary={`${member.fname} ${member.lname} (${member.rank})`}
                              />
                            </ListItem>
                          ))
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                    <ListItem />
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              id="template_name"
              label="Stage Name"
              // onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={stage.stage_name}
              style={{
                marginBottom: 30,
                marginTop: 40,
                cursor: "not-allowed",
              }}
            />
            <TextField
              value={
                stage.suspense_hours > 24 &&
                !(stage.suspense_hours / 24).toString().includes(".")
                  ? stage.suspense_hours > 168 &&
                    !(stage.suspense_hours / 168).toString().includes(".")
                    ? stage.suspense_hours / 168
                    : stage.suspense_hours / 24
                  : stage.suspense_hours
              }
              label="Suspense"
              required={true}
              variant="outlined"
              type="number"
              min={1}
              onInput={(e) => {
                if (e.target.value < 1) {
                  e.target.value = 1;
                }
              }}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: 30 }}
              id="suspense_integer"
            />
            <TextField
              value={
                stage.suspense_hours > 24 &&
                !(stage.suspense_hours / 24).toString().includes(".")
                  ? stage.suspense_hours > 168 &&
                    !(stage.suspense_hours / 168).toString().includes(".")
                    ? "Weeks"
                    : "Days"
                  : "Hours"
              }
              select
              label="Time"
              required={true}
              id="time"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue=""
              style={{ marginBottom: 30 }}
            >
              <MenuItem value="" disabled>
                <em>Measure of Time</em>
              </MenuItem>
              <MenuItem
                value={"Hours"}
                disabled={
                  (stage.suspense_hours > 24 &&
                  !(stage.suspense_hours / 24).toString().includes(".")
                    ? stage.suspense_hours > 168 &&
                      !(stage.suspense_hours / 168).toString().includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Hours"
                    ? true
                    : false
                }
              >
                Hours
              </MenuItem>
              <MenuItem
                value={"Days"}
                disabled={
                  (stage.suspense_hours > 24 &&
                  !(stage.suspense_hours / 24).toString().includes(".")
                    ? stage.suspense_hours > 168 &&
                      !(stage.suspense_hours / 168).toString().includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Days"
                    ? true
                    : false
                }
              >
                Days
              </MenuItem>
              <MenuItem
                value={"Weeks"}
                disabled={
                  (stage.suspense_hours > 24 &&
                  !(stage.suspense_hours / 24).toString().includes(".")
                    ? stage.suspense_hours > 168 &&
                      !(stage.suspense_hours / 168).toString().includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Weeks"
                    ? true
                    : false
                }
              >
                Weeks
              </MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Stage Instructions"
              multiline
              rows={10}
              variant="outlined"
              value={stage.stage_instructions}
              style={{ marginTop: 10, marginLeft: 45, width: "22.65vw" }}
              required
            />
          </Grid>
        </Grid>
      );
    } else {
      let stageGroups2 = null;

      if (templateGroups) {
        if (templateGroups[stage.stage_id]) {
          stageGroups2 = templateGroups[stage.stage_id];
        }
      }

      return (
        <Grid container>
          <Grid item xs={8}>
            {stage.label}
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item>
                Substages
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {stage.substages.map((group, index) => {
                      return (
                        <ListItem
                          key={uuidv4()}
                          role="listitem"
                          button
                          onClick={() => setSelectedGroup(index)}
                        >
                          {stage.substages[0].supervisor_id ? (
                            `Supervisor`
                          ) : (
                            <>
                              {" "}
                              {stageGroups2
                                ? stageGroups2[index].group_name
                                : `${group.group_id}`}
                            </>
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Grid>
              <Grid item>
                Member List
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {stageGroups2 ? (
                      stageGroups2[0].users.map((member) => (
                        <ListItem key={uuidv4()} role="listitem" button>
                          <ListItemText
                            primary={`${member.fname} ${member.lname} (${member.rank})`}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <></>
                    )}
                    <ListItem />
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TextField disabled label={stage.stage_name} />
          </Grid>
        </Grid>
      );
    }
  }
  // previous createRequest function

  if (templates) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (
        document.getElementById("subject").value.length < 1 ||
        document.getElementById("comments").value.length < 1
      ) {
        await setAlert({
          title: "Request Error",
          text: "Please fill out all the required fields before submitting the request",
          closeAction: "Okay",
        });
        await setOpenAlert(true);
      } else {
        let response = await fetch(`${baseURL}/routes/requests/post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: document.getElementById("subject").value,
            initiator_id: currentUserDetails.user_id,
            rank: currentUserDetails.rank,
            lname: currentUserDetails.lname,
            route_template_id: templates[template].route_id,
            comments: document.getElementById("comments").value,
            route_template: templates[template],
          }),
        })
          .then((resp) => resp)
          .catch((err) => err);
        if (response.status === 200) {
          await handleClose();
          await setAlert({
            title: "Initiate Request Successful",
            text: `Your request, ${
              document.getElementById("subject").value
            }, was successfully submitted.`,
            closeAction: "Okay",
          });
          await setOpenAlert(true);
          history.push("/dashboard");
        } else {
          let message = await response.json();
          await setAlert({
            title: "Submission Error",
            text: message.message,
            closeAction: "Roger Roger",
          });
          await setOpenAlert(true);
        }
      }
    };

    const handlePaste = async (e) => {
      e.preventDefault();
      let suggestion = `${new Date()
        .toString()
        .substr(4, 11)
        .replace(" ", "-")
        .replace(" ", "-")} ${templates[template].route_name} – ${
        currentUserDetails.lname
      } `;
      document.getElementById("subject").value = suggestion;
    };

    return (
      <div>
        <AlertDialog bodyAlert={alert} />
        <Grid container className={classes.root}>
          <Grid item xs={3}>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
                marginTop: 40,
              }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel variant="outlined">Chosen Template</InputLabel>
                <Select
                  variant="outlined"
                  value={template}
                  onChange={handleChange}
                  label="Chosen Template"
                >
                  {templates.map((template, index) => {
                    return (
                      <MenuItem key={uuidv4()} value={index}>
                        {template.route_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{
                    fontWeight: 600,
                    marginTop: 5,
                    marginLeft: 5,
                    overflowX: "auto",
                  }}
                  noWrap
                >
                  Template Title
                </Typography>
                <Typography style={{ margin: "15px" }} noWrap>
                  {templates[template].route_name}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper
                className={classes.paperSecond}
                style={{ maxHeight: "34vh" }}
              >
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                >
                  Template Instructions
                </Typography>
                <Typography style={{ margin: "15px" }}>
                  {templates[template].route_instructions}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                  noWrap
                >
                  Template Documents
                </Typography>
                <div style={{ maxHeight: "8.75vh", overflow: "auto" }}>
                  <ListItem className={classes.attachments} button>
                    <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                    <Typography style={{ margin: "15px" }}>
                      <a href="/documents/SacredJedi.txt" download>
                        The Sacred Jedi Texts Volume 1
                      </a>
                    </Typography>
                  </ListItem>
                  <ListItem className={classes.attachments} button>
                    <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                    <Typography style={{ margin: "15px" }}>
                      <a href="/documents/HitchhikersGuide.txt" download>
                        Hitchhiker's Guide to the Galaxy
                      </a>
                    </Typography>
                  </ListItem>
                  <ListItem className={classes.attachments} button>
                    <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                    <Typography style={{ margin: "15px" }}>
                      <a href="/documents/ZappBrannigan.txt" download>
                        Zapp Brannigan Quotes
                      </a>
                    </Typography>
                  </ListItem>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid item xs={12} className={classes.tabs}>
              <div className={classes.root} style={{ maxHeight: 900 }}>
                <Stepper activeStep={activeStep}>
                  {templates[template].stages.map((stage) => {
                    return (
                      <Step key={uuidv4()}>
                        <StepLabel>{stage.stage_name}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <Paper style={{ padding: "30px" }}>
                  <div>
                    <Typography className={classes.instructions}>
                      {getStageContent(
                        activeStep,
                        templates[template].stages[activeStep]
                      )}
                    </Typography>
                    <Grid container>
                      <Grid item xs={8} />
                      <Grid item xs={4} style={{ marginTop: -30 }}>
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          color="primary"
                          variant="outlined"
                          style={{ marginLeft: 115 }}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleNext}
                          disabled={
                            activeStep === templates[template].stages.length - 1
                          }
                          style={{ marginLeft: 15 }}
                        >
                          Next
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Paper>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={10} />
          <Grid item xs={2}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              style={{ marginTop: "-5vh", marginBottom: 0, marginRight: 15 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              style={{ marginTop: "-5vh", marginBottom: 0 }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </div>
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

export default TemplateManage;
