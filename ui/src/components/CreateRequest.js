// Dependencies
import React from "react";

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
} from "@material-ui/core";

import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { ListItemIcon } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";

import Checkbox from "@material-ui/core/Checkbox";

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { v4 as uuidv4 } from "uuid";

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
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
}));


//TODO BACKEND HOOKUP
function getStages() {
  return [
    { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"] },
    { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"] },
    { label: "Stage 3", groups: ["Group 4"], done: [] },
  ];
}

function currentStage(stages){
  var i;
  for(i=0;i<stages.length;i++)
    if(stages[i].groups.length!=stages[i].done.length)
      break
  return i
}

function groupColor(group, stage){
  if(stage.done.includes(group))
    return "lightGreen"
  return "yellow"
}

function getStepIcon(stage){
  if(stage.groups.length===stage.done.length)
    return <CheckIcon />
  return <CloseIcon />
}

function getStepContent(step, stage) {

  const classes = useStyles();

  const left = React.useState([0, 1, 2, 3]);
  const right = React.useState([4, 5, 6, 7]);

  switch (step) {
    case 0:
      return <Grid container>
          <Grid item xs={8}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              className={classes.root}
            >
              <Grid item>
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {left.map((value) => (
                        <ListItem
                          key={uuidv4()}
                          role="listitem"
                          button
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={true}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText primary={`Group ${value + 1}`} />
                        </ListItem>
                      )
                    )}
                    <ListItem />
                  </List>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>
                  <List dense component="div" role="list">
                    {right.map((value) => (
                        <ListItem
                          key={uuidv4()}
                          role="listitem"
                          button
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={true}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText primary={`Group ${value + 1}`} />
                        </ListItem>
                      )
                    )}
                    <ListItem />
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <TextField label="Stage Name" />
            <form noValidate style={{ marginBottom: "20px" }}>
              <TextField
                label="Suspense"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <TextField
              label="Stage Instructions"
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
  }
}

const CreateRequest = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getStages();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={3}>
          <Grid item xs={12}>
            <Typography>Title</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: "30px" }}>
            <Typography>Instructions</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: "30px" }}>
            <Typography>Documents</Typography>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} className={classes.tabs}>
            <div className={classes.root}>
              <Stepper activeStep={currentStage(getStages())}>
                {steps.map((stage) => {
                  return (
                    <Step >
                      <StepLabel icon={getStepIcon(stage)}>{stage.label}</StepLabel>
                      {stage.groups.map((group) => (
                        <Typography style={{ marginLeft: "32px", backgroundColor: groupColor(group, stage)}}>
                          {group}
                        </Typography>
                      ))}
                    </Step>
                  );
                })}
              </Stepper>
              <div>
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep)}
                  </Typography>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                      disabled={activeStep === steps.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={10} />
        <Grid item xs={2} style={{ marginTop: "20px" }}>
          <Button variant="contained" component="label">
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateRequest;
