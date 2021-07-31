//hold that thought: change checkmarks and icons. highlight done groups with backgroundColor

// Dependencies
import { v4 as uuidv4 } from "uuid";
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

function getStages() {
  return [
    { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"] },
    { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"] },
    { label: "Stage 3", groups: ["Group 4"], done: [] },
  ];
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
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getStages();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={uuidv4()} {...stepProps}>
                      <StepLabel {...labelProps}>{stage.label}</StepLabel>
                      {stage.groups.map((group) => (
                        <Typography
                          style={{ marginLeft: "32px" }}
                          key={uuidv4()}
                        >
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
