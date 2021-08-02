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
} from "@material-ui/core";

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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


//TODO BACKEND HOOKUP
function getStages() {
  return [
    { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"] },
    { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"] },
    { label: "Stage 3", groups: ["Group 4"], done: [] },
  ];
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

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Stage 1 Details";
    case 1:
      return "Stage 2 Details";
    case 2:
      return "Stage 3 Details";
    default:
      return "Error";
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
              <Stepper activeStep={activeStep}>
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
