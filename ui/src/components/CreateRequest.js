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
const CreateRequest = () => {
  const classes = useStyles();
  // const templates = getTemplates();
  const [activeStep, setActiveStep] = React.useState(0);
  const [supervisor, setSupervisor] = React.useState([]);
  const [allGroups, setAllGroups] = React.useState(null);
  const [templateGroups, setTemplateGroups] = React.useState(null);
  // const stages = getStages();
  const [template, setTemplate] = React.useState(0);
  const [templates, setTemplates] = React.useState(null);
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

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

    await fetch(`${baseURL}/groups//?include_users=true`)
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
      console.log("set template groups", templateGroups);
    }
    setTimeout(() => {}, 1000);
  }, [templates, template, allGroups]);

  //hookup backend here in these functions!
  // function getStages() {
  //   Already part of /get/all/details
  //   return [
  //     {
  //       label: "Stage 1",
  //       groups: ["Group 1"],
  //       done: ["Group 1"],
  //       suspense: "2014-08-18T21:11:54",
  //       instructions: "dew it",
  //     },
  //     {
  //       label: "Stage 2",
  //       groups: ["Group 2", "Group 3"],
  //       done: ["Group 2"],
  //       suspense: "2014-08-18T21:11:54",
  //       instructions: "execute order 66",
  //     },
  //     {
  //       label: "Stage 3",
  //       groups: ["Group 4"],
  //       done: [],
  //       suspense: "2014-08-18T21:11:54",
  //       instructions: "dew it",
  //     },
  //   ];
  // }

  // function getGroupMembers(group) {
  //   // GET group w/ members
  //   if (group.name === "loading")
  //     return ["palpatine", "darth vader", "storm trooper"];
  //   if (group === "Group 2") return ["andrew", "jack", "brandon"];
  //   if (group === "Group 3") return ["kirk", "data"];
  //   if (group === "Group 4") return ["baby yoda", "admiral ackbar"];
  // }

  //returns if member has completed their submission
  // function memberDone(member){
  //   if(member==="palpatine"||member==="darth vader"||member==="storm trooper")
  //     return true
  //   if(member==="andrew"||member==="jack"||member==="brandon")
  //     return true
  //   if(member==="kirk")
  //     return true
  //   return false
  // }

  // async function getTemplates() {
  //   //GET /get/all/details
  //   let response = await fetch(
  //     `${baseURL}/routes/templates/get/all/details`
  //   );
  //   if (response.status === 200) {
  //     let data = await response.json();
  //     console.log(data);
  //     return data;
  //   } else {
  //     let err = await response.json();
  //     return console.log(err);
  //   }
  // }

  // return [
  //   {
  //     name: "eSSS",
  //     instructions: "dew it",
  //     documents: "iono how this will work...",
  //   },
  //   {
  //     name: "Engineering Change Request",
  //     instructions: "execute order 66",
  //     documents: "like literally however you pull documents",
  //   },
  //   {
  //     name: "Award Package",
  //     instructions: "dew it",
  //     documents: "like some kind of link probably?",
  //   },
  // ];
  // }

  //Previous useStyles location

  // function completed(stages){

  //   var i;
  //   for (i = 0; i < stages.length; i++)
  //     if (stages[i].groups.length != stages[i].done.length) break;
  //   return i;
  // }

  // function groupColor(group, stage){
  //   if(stage.done.includes(group))
  //     return "lightGreen"
  //   return "yellow"
  // }

  // function memberColor(member){
  //   if(memberDone(member)===true)
  //     return "lightGreen"
  //   return "yellow"
  // }

  // function getStageIcon(stage){
  //   if(stage.groups.length===stage.done.length)
  //     return <CheckIcon />
  //   return <CloseIcon />
  // }

  function getStageContent(step, stage) {
    // const classes = useStyles(); at top level
    // const [selectedGroup, setSelectedGroup] = React.useState(0);
    // console.log("getStageContent", step);
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
      if (templateGroups) {
        if (templateGroups[stage.stage_id]) {
          stageGroups = templateGroups[stage.stage_id];
          console.log(
            "stageGroups",
            stageGroups,
            "current stage in stageGroups",
            stageGroups[selectedGroup],
            "templateGroups",
            templateGroups,
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
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Stage Instructions"
              multiline
              rows={10}
              variant="outlined"
              value={stage.stage_instructions}
              style={{ marginTop: 10, marginLeft: 50, width: 440 }}
              required
            />
          </Grid>
        </Grid>
      );
    } else {
      //default render in case of stale state. defaults selected group to 0
      //janky fix. here's how to recreate the bug if you want to refactor into better fix
      //delete below return, select a new group, then click next stage
      //the selected group doesnt go back to 0, thus asking for name of group # something which is undef
      let stageGroups2 = null;

      if (templateGroups) {
        if (templateGroups[stage.stage_id]) {
          stageGroups2 = templateGroups[stage.stage_id];
          console.log(
            "stageGroups",
            stageGroups2,
            "current stage in stageGroups",
            stageGroups2[0],
            "templateGroups",
            templateGroups,
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
            <TextField label="Stage Name" disabled label={stage.stage_name} />
          </Grid>
        </Grid>
      );
    }
  }

  // previous createRequest function

  if (templates) {
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
            >
              <FormControl className={classes.formControl}>
                <InputLabel>Template</InputLabel>
                <Select value={template} onChange={handleChange}>
                  {templates.map((template, index) => {
                    return (
                      <MenuItem value={index}>{template.route_name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond}>
                <Typography
                  style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
                >
                  Template Title
                </Typography>
                <Typography style={{ margin: "15px" }}>
                  {templates[template].route_name}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} style={{ margin: "15px" }}>
              <Paper className={classes.paperSecond} style={{ maxHeight: "34.5vh" }}>
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
                >
                  Template Documents
                </Typography>
                <Typography style={{ margin: "15px" }}>N/A</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid item xs={12} className={classes.tabs}>
              <div className={classes.root}>
                <Stepper activeStep={activeStep}>
                  {templates[template].stages.map((stage) => {
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
                      {getStageContent(
                        activeStep,
                        templates[template].stages[activeStep]
                      )}
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
                          disabled={
                            activeStep === templates[template].stages.length - 1
                          }
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
              onClick={handleClickOpen}
            >
              Initiate Request
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>Initiate Request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Selected Route Template: {templates[template].name}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Subject"
              fullWidth
            />
            <TextField
              multiline
              rows={4}
              autoFocus
              margin="dense"
              label="Comments"
              fullWidth
              variant="outlined"
            />
            <Divider style={{ margin: "10px" }} />
            <Button variant="contained" component="label" color="primary">
              Upload Supporting Documents
              <input type="file" hidden />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
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

export default CreateRequest;
