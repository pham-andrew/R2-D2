//bug: expanded accordions mess up the styling cause they're longer than the page
// dependencies
import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import AppContext from "../contexts/AppContext";

// components
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Paper,
  Tooltip,
} from "@material-ui/core";

function getPending() {
  return [
    {
      name: "Promotion Package",
      ao: "Anakin Skywalker",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "SSS Package",
      ao: "Andrew Pham",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
  ];
}

function getEnRoute() {
  return [
    {
      name: "Promotion Package",
      ao: "Anakin Skywalker",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
  ];
}

function getCompleted() {
  return [
    {
      name: "Promotion Package",
      ao: "Anakin Skywalker",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2", "Group 3"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: ["Group 4"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "SSS Package",
      ao: "Andrew Pham",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2", "Group 3"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: ["Group 4"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "Engineering Change Request",
      ao: "Jacob Joy",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2", "Group 3"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: ["Group 4"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "Engineering Change Request 2",
      ao: "Jacob Joy",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2", "Group 3"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: ["Group 4"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
  ];
}

function getCanceled() {
  return [
    {
      name: "Promotion Package",
      ao: "Anakin Skywalker",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "SSS Package",
      ao: "Andrew Pham",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
    {
      name: "Engineering Change Request",
      ao: "Jacob Joy",
      stages: [
        {
          label: "Stage 1",
          groups: ["Group 1"],
          done: ["Group 1"],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
        {
          label: "Stage 2",
          groups: ["Group 2", "Group 3"],
          done: ["Group 2"],
          suspense: "2014-08-18T21:11:54",
          instructions: "execute order 66",
        },
        {
          label: "Stage 3",
          groups: ["Group 4"],
          done: [],
          suspense: "2014-08-18T21:11:54",
          instructions: "dew it",
        },
      ],
      done: [],
    },
  ];
}

function completed(stages) {
  var i;
  for (i = 0; i < stages.length; i++)
    if (stages[i].groups.length != stages[i].done.length) break;
  return i;
}

function groupColor(group, stage) {
  if (stage.done.includes(group)) return "#77DD77";
  return "#FDFD96";
}

// may be useful later
// function getStageIcon(stage) {
//   if (stage.groups.length === stage.done.length) return <CheckIcon />;
//   return <CloseIcon />;
// }

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxHeight: "75vh",
    minWidth: 900,
    overflow: "auto",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: 2.5,
  },
  divider: {
    background: "black",
  },
  button: {
    position: "relative",
    top: "5.25vh",
  },
}));

export default function Dashboard() {
  const { currentUserDetails } = useContext(AppContext);

  const classes = useStyles();

  // may be useful later
  // const [activeStep, setActiveStep] = React.useState(0);

  return (
    <div className={classes.root}>
      <Tooltip
        title={`Welcome back, ${currentUserDetails.fname}!`}
        placement="top-start"
      >
        <Typography
          variant="h4"
          style={{ fontWeight: 600, margin: 10, cursor: "pointer" }}
        >
          {`${currentUserDetails.fname}'s`} Dashboard
        </Typography>
      </Tooltip>
      <Accordion defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={getPending().length}
            color="secondary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              Pending Action
            </Typography>
          </Badge>
        </AccordionSummary>
        <div style={{ maxHeight: 800, overflow: "auto" }}>
          {getPending().map((request) => {
            return (
              <Paper style={{ margin: "5px" }} elevation={2} key={uuidv4()}>
                <AccordionDetails>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography
                        style={{
                          fontWeight: 600,
                          filter: "drop-shadow(1px 1px 1px lightgray)",
                        }}
                        variant="h6"
                      >
                        {request.name}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: 600,
                          display: "flex",
                        }}
                      >
                        AO:{" "}
                        <Typography
                          style={{
                            marginLeft: 5,
                          }}
                        >
                          {request.ao}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Stepper activeStep={completed(request.stages)}>
                        {request.stages.map((stage) => {
                          return (
                            <Step key={uuidv4()}>
                              <StepLabel>{stage.label}</StepLabel>
                              {stage.groups.map((group) => (
                                <Typography
                                  style={{
                                    marginLeft: "32px",
                                    backgroundColor: groupColor(group, stage),
                                    borderRadius: 5,
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                  }}
                                  key={uuidv4()}
                                >
                                  {group}
                                </Typography>
                              ))}
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                      >
                        Open
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Paper>
            );
          })}
        </div>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={getEnRoute().length}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              En Route
            </Typography>
          </Badge>
        </AccordionSummary>
        <div style={{ maxHeight: 800, overflow: "auto" }}>
          {getEnRoute().map((request) => {
            return (
              <Paper style={{ margin: "5px" }} elevation={2} key={uuidv4()}>
                <AccordionDetails>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography
                        style={{
                          fontWeight: 600,
                          filter: "drop-shadow(1px 1px 1px lightgray)",
                        }}
                        variant="h6"
                      >
                        {request.name}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: 600,
                          display: "flex",
                        }}
                      >
                        AO:{" "}
                        <Typography
                          style={{
                            marginLeft: 5,
                          }}
                        >
                          {request.ao}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Stepper activeStep={completed(request.stages)}>
                        {request.stages.map((stage) => {
                          return (
                            <Step key={uuidv4()}>
                              <StepLabel>{stage.label}</StepLabel>
                              {stage.groups.map((group) => (
                                <Typography
                                  key={uuidv4()}
                                  style={{
                                    marginLeft: "32px",
                                    backgroundColor: groupColor(group, stage),
                                    borderRadius: 5,
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                  }}
                                >
                                  {group}
                                </Typography>
                              ))}
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                      >
                        Open
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Paper>
            );
          })}
        </div>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={getCompleted().length}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              Completed
            </Typography>
          </Badge>
        </AccordionSummary>
        <div style={{ maxHeight: 800, overflow: "auto" }}>
          {getCompleted().map((request) => {
            return (
              <Paper style={{ margin: "5px" }} elevation={2} key={uuidv4()}>
                <AccordionDetails>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography
                        style={{
                          fontWeight: 600,
                          filter: "drop-shadow(1px 1px 1px lightgray)",
                        }}
                        variant="h6"
                      >
                        {request.name}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: 600,
                          display: "flex",
                        }}
                      >
                        AO:{" "}
                        <Typography
                          style={{
                            marginLeft: 5,
                          }}
                        >
                          {request.ao}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Stepper activeStep={completed(request.stages)}>
                        {request.stages.map((stage) => {
                          return (
                            <Step key={uuidv4()}>
                              <StepLabel>{stage.label}</StepLabel>
                              {stage.groups.map((group) => (
                                <Typography
                                  key={uuidv4()}
                                  style={{
                                    marginLeft: "32px",
                                    backgroundColor: groupColor(group, stage),
                                    borderRadius: 5,
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                  }}
                                >
                                  {group}
                                </Typography>
                              ))}
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                      >
                        Open
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Paper>
            );
          })}
        </div>
      </Accordion>
      <Accordion
        style={{
          marginBottom: 5,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={getCanceled().length}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              Canceled
            </Typography>
          </Badge>
        </AccordionSummary>
        <div style={{ maxHeight: 800, overflow: "auto" }}>
          {getCanceled().map((request) => {
            return (
              <Paper style={{ margin: "5px" }} elevation={2} key={uuidv4()}>
                <AccordionDetails>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography
                        style={{
                          fontWeight: 600,
                          filter: "drop-shadow(1px 1px 2px lightgray)",
                        }}
                        variant="h6"
                      >
                        {request.name}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: 600,
                          display: "flex",
                        }}
                      >
                        AO:{" "}
                        <Typography
                          style={{
                            marginLeft: 5,
                          }}
                        >
                          {request.ao}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Stepper activeStep={completed(request.stages)}>
                        {request.stages.map((stage) => {
                          return (
                            <Step key={uuidv4()}>
                              <StepLabel>{stage.label}</StepLabel>
                              {stage.groups.map((group) => (
                                <Typography
                                  key={uuidv4()}
                                  style={{
                                    marginLeft: "32px",
                                    backgroundColor: groupColor(group, stage),
                                    borderRadius: 5,
                                    paddingTop: 1,
                                    paddingBottom: 2,
                                    paddingLeft: 4,
                                    paddingRight: 4,
                                  }}
                                >
                                  {group}
                                </Typography>
                              ))}
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>
                      <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                      >
                        Open
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Paper>
            );
          })}
        </div>
      </Accordion>
    </div>
  );
}
