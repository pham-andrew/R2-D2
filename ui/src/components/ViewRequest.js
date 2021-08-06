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
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  Divider,
} from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import PromptDialog from "./helpers/PromptDialog";

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
  },
  formControl: {
    minWidth: 200,
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
}));

//2nd CreateRequest location
const ViewRequest = (props) => {
  const classes = useStyles();
  const { request, handleClose } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [supervisor, setSupervisor] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState(null);
  const [requestGroups, setRequestGroups] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState(0);
  const [reload, setReload] = React.useState(false);
  const { setPrompt, prompt, setOpenPrompt } = React.useContext(AppContext);

  const history = useHistory();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  React.useEffect(async () => {
    await fetch(`${baseURL}/groups/?include_users=true`)
      .then((res) => res.json())
      .then((data) => {
        setAllGroups(data);
      })
      .catch((err) => console.log(err));

    if (allGroups) {
      let tmpArray = {};
      request.stages.forEach((stage) => {
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
      setRequestGroups(tmpArray);
    }
  }, []);

  React.useEffect(() => {
    if (allGroups) {
      let tmpArray = {};
      request.stages.forEach((stage) => {
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
      setRequestGroups(tmpArray);
    }
    setTimeout(() => {}, 1000);
  }, [allGroups]);

  function groupColor(group) {
    if (group.status === "Approved") return "#77DD77";
    if (group.status === "Denied") return "#FF6961";
    return "#FDFD96";
  }

  async function handleCancel(e) {
    e.preventDefault();

    await setPrompt({
      title: `Delete Request`,
      text: `Are you sure you want to delete this request?`,
      actions: (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginBottom: -5, marginRight: 5 }}
          onClick={async () => {
            let response = await fetch(`${baseURL}/routes/requests/patch`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "Cancelled",
                request_id: request.request_id,
              }),
            })
              .then((resp) => resp)
              .catch((err) => err);
            if (response.status === 200) {
              await handleClose(false);
              await setPrompt({
                title: "Cancel Request Successful",
                text: `The request was successfully deleted.`,
                closeAction: "Okay",
              });
              await setOpenPrompt(true);
              await setReload(!reload);
              history.push("/profile");
              history.push("/dashboard");
            } else {
              let message = await response.json();
              await setPrompt({
                title: "Cancellation Error",
                text: message.message,
                closeAction: "Roger Roger",
              });
              await setOpenPrompt(true);
            }
          }}
        >
          Confirm
        </Button>
      ),
    });
    await setOpenPrompt(true);
  }

  function getStageContent(stage) {
    let stageGroups = null;

    if (stage.substages[0].supervisor_id) {
      fetch(`${baseURL}/users/${stage.substages[0].supervisor_id}`)
        .then((res) => res.json())
        .then((data) =>
          setSupervisor(`${data.fname} ${data.lname} (${data.rank})`)
        );
    }

    if (stage.substages[selectedGroup]) {
      if (requestGroups) {
        if (requestGroups[stage.stage_id]) {
          stageGroups = requestGroups[stage.stage_id];
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
                          style={{ backgroundColor: groupColor(group) }}
                          onClick={() => setSelectedGroup(index)}
                        >
                          {stage.substages[0].supervisor_id ? (
                            `Supervisor`
                          ) : (
                            <>
                              {stageGroups
                                ? stageGroups[index].group_name
                                : `${group.group_id}`}
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
            <Divider style={{ margin: 30 }} />
            <Grid xs={12} style={{ marginLeft: 80 }}>
              <Grid xs={12}>
                <Typography
                  style={{ fontWeight: 600, marginTop: 30, marginBottom: 15 }}
                >
                  Selected Stage Information
                </Typography>
              </Grid>
              <TextField
                label="Substage Status"
                multiline
                rows={5}
                variant="outlined"
                value={stage.substages[selectedGroup].status}
                style={{
                  marginBottom: 15,
                  marginTop: 10,
                  marginRight: 10,
                }}
                required
              />
              <TextField
                label="Substage Notes"
                multiline
                rows={5}
                variant="outlined"
                value={stage.substages[selectedGroup].notes || ""}
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 250,
                }}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Substage Completed At:"
                multiline
                rows={5}
                variant="outlined"
                value={stage.substages[selectedGroup].completed_at || ""}
                style={{
                  marginBottom: 15,
                  marginTop: 10,
                  cursor: "not-allowed",
                }}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              id="request_name"
              label="Stage Name"
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={stage.stage_name}
              style={{
                marginBottom: 15,
                marginTop: 28,
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
              style={{ marginBottom: 15 }}
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
              style={{ marginBottom: 15 }}
            >
              <MenuItem value="" disabled>
                <em>Measure of Time</em>
              </MenuItem>
              <MenuItem value={"Hours"}>Hours</MenuItem>
              <MenuItem value={"Days"}>Days</MenuItem>
              <MenuItem value={"Weeks"}>Weeks</MenuItem>
            </TextField>
            <TextField
              variant="outlined"
              id="request_name"
              label="Stage status"
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={stage.status}
              style={{
                marginBottom: 15,
                marginTop: 22.5,
                cursor: "not-allowed",
              }}
            />
            <Grid xs={12}>
              <TextField
                label="Stage Instructions"
                multiline
                rows={11}
                variant="outlined"
                value={stage.stage_instructions}
                style={{
                  marginTop: 10,
                  width: 300,
                  whiteSpace: "pre-line",
                }}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  // previous createRequest function

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="true"
    >
      <PromptDialog bodyPrompt={prompt} />
      <DialogContent>
        <Grid container className={classes.root}>
          <Grid item xs={3}>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 50,
              }}
            ></Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                >
                  Request Subject
                </Typography>
                <Typography style={{ margin: "15px" }}>
                  {request.request_subject}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                >
                  Request Status
                </Typography>
                <Typography style={{ margin: "15px" }}>
                  {request.status}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper
                className={classes.paperSecond}
                style={{ maxHeight: "34.5vh", overflow: "auto" }}
              >
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                >
                  Request Change Log
                </Typography>
                <Typography
                  style={{
                    margin: "15px",
                    whiteSpace: "pre-line",
                    maxHeight: 168,
                    overflow: "auto",
                  }}
                >
                  {request.change_log}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{
                    fontWeight: 600,
                    marginTop: 5,
                    marginLeft: 5,
                  }}
                  noWrap
                >
                  Request Documents
                </Typography>
                <div
                  style={{ minHeight: 203, maxHeight: 203, overflow: "auto" }}
                >
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
              <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                  {request.stages.map((stage) => {
                    return (
                      <Step key={uuidv4()}>
                        <StepLabel>{stage.stage_name}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 30,
                      marginTop: 15,
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      color="primary"
                      variant="outlined"
                      style={{ marginLeft: 0 }}
                    >
                      Back
                    </Button>
                    <Typography style={{ margin: 10 }}>
                      Stage Controls
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleNext}
                      disabled={activeStep === request.stages.length - 1}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>

                <Paper style={{ padding: "30px" }}>
                  <div>
                    <Typography className={classes.instructions}>
                      {getStageContent(request.stages[activeStep])}
                    </Typography>
                  </div>
                </Paper>
              </div>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
            }}
          >
            {request.status === "Cancelled" ||
            request.status === "Completed" ? (
              <></>
            ) : (
              <Button
                variant="contained"
                component="label"
                color="secondary"
                style={{ marginLeft: "76vw", textAlign: "center" }}
                onClick={handleCancel}
              >
                Cancel Request
              </Button>
            )}
            <Button
              variant="contained"
              component="label"
              color="primary"
              size="large"
              style={{ marginLeft: 15, textAlign: "center" }}
              onClick={() => {
                handleClose();
              }}
            >
              Close Review
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRequest;
