//create request

// Dependencies
import React, { useMemo } from "react";

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
  Divider,
} from "@material-ui/core";

//icons
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
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
  // const templates = getTemplates();
  const [activeStep, setActiveStep] = React.useState(0);
  const [supervisor, setSupervisor] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState(null);
  const [requestGroups, setRequestGroups] = React.useState(null);
  // const stages = getStages();
  // const [template, setTemplate] = React.useState(0);
  // const [templates, setTemplates] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState(0);
  const [reload, setReload] = React.useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    setTemplate(event.target.value);
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
      console.log("set template groups", requestGroups);
    }
    setTimeout(() => {}, 1000);
  }, [allGroups]);

    function groupColor(group) {
      if (group.status === "Approved") return "lightGreen";
      if (group.status === "Denied") return "lightred";
      return "yellow";
    }

    function getStageIcon(stage) {
      if (stage.status === "Approved") return <CheckIcon />;
      if (stage.status === "Denied") return <BlockIcon />;
      return <CloseIcon />;
    }

  function getStageContent(stage) {
    let stageGroups = null;

    console.log("getStageContent", stage);

    if (stage.substages[0].supervisor_id) {
      fetch(`${baseURL}/users/${stage.substages[0].supervisor_id}`)
        .then((res) => res.json())
        .then((data) =>
          setSupervisor(`${data.fname} ${data.lname} (${data.rank})`)
        );
      console.log("I FIRED SUPERVISOR");
    }

    if (stage.substages[selectedGroup]) {
      if (requestGroups) {
        if (requestGroups[stage.stage_id]) {
          stageGroups = requestGroups[stage.stage_id];
          console.log(
            "stageGroups",
            stageGroups,
            "current stage in stageGroups",
            stageGroups[selectedGroup],
            "requestGroups",
            requestGroups,
            "stageId",
            stage.stage_id
          );
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
            <Grid xs={12}>
              <Grid xs={12}><h3>Selected Substage Information:</h3></Grid>
              <TextField
                label="Substage Status"
                multiline
                variant="outlined"
                value={stage.substages[selectedGroup].status}
                style={{
                  marginBottom: 15,
                  marginTop: 10,
                  marginRight: 10,
                  cursor: "not-allowed",
                }}
                required
              />
              <TextField
                label="Substage Notes"
                multiline
                rows={5}
                variant="outlined"
                value={stage.substages[selectedGroup].notes}
                style={{
                  marginTop: 10,
                  marginRight: 10,
                  width: 250,
                }}
                required
              />
              <TextField
                label="Substage Completed At:"
                multiline
                rows={5}
                variant="outlined"
                value={stage.substages[selectedGroup].completed_at}
                style={{
                  marginBottom: 15,
                  marginTop: 10,
                  cursor: "not-allowed",
                }}
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              id="request_name"
              label="Stage Name"
              // onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={stage.stage_name}
              style={{
                marginBottom: 15,
                marginTop: 22.5,
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
              // onChange={handleChange}
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
                rows={10}
                variant="outlined"
                value={stage.stage_instructions}
                style={{ marginTop: 10, width: 300 }}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  // previous createRequest function

  return (
    <div>
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
            <Paper
              className={classes.paperSecond}
              style={{ maxHeight: "34.5vh" }}
            >
              <Typography
                style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
              >
                Request Change Log
              </Typography>
              <Typography style={{ margin: "15px" }}>
                {request.change_log}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper className={classes.paperSecond}>
              <Typography
                style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
              >
                Request Documents
              </Typography>
              <Typography style={{ margin: "15px" }}>N/A</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} className={classes.tabs}>
            <div className={classes.root}>
              <Stepper activeStep={activeStep}>
                {request.stages.map((stage) => {
                  return (
                    <Step>
                      <StepLabel>{stage.stage_name}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <Paper style={{ padding: "30px" }}>
                <div>
                  <Typography className={classes.instructions}>
                    {getStageContent(request.stages[activeStep])}
                  </Typography>
                  <Grid container>
                    <Grid item xs={8} />
                    <Grid item xs={4} style={{ marginTop: 10 }}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                        color="primary"
                        style={{
                          marginRight: "6.8vw",
                          position: "relative",
                          left: "5.8vw",
                        }}
                        variant="outlined"
                      >
                        Back
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                        disabled={activeStep === request.stages.length - 1}
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
        <Grid item xs={2} style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            component="label"
            color="secondary"
            onClick={handleClose}
          >
            Close Request
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewRequest;
