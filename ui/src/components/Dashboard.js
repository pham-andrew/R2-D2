//dashboard
//bug: expanded accordions mess up the styling cause they're longer than the page


import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';

function getPending(){
  return [
    {
      name: "Promotion Package", 
      ao: "Anakin Skywalker", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "SSS Package", 
      ao: "Andrew Pham", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
  ]
}

function getEnRoute(){
  return [
    {
      name: "Promotion Package", 
      ao: "Anakin Skywalker", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    }
  ]
}

function getCompleted(){
  return [
    {
      name: "Promotion Package", 
      ao: "Anakin Skywalker", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2", "Group 3"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: ["Group 4"], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "SSS Package", 
      ao: "Andrew Pham", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2", "Group 3"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: ["Group 4"], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "Engineering Change Request", 
      ao: "Jacob Joy", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2", "Group 3"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: ["Group 4"], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "Engineering Change Request 2", 
      ao: "Jacob Joy", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2", "Group 3"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: ["Group 4"], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
  ]
}

function getCanceled(){
  return [
    {
      name: "Promotion Package", 
      ao: "Anakin Skywalker", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "SSS Package", 
      ao: "Andrew Pham", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
    {
      name: "Engineering Change Request", 
      ao: "Jacob Joy", 
      stages: [
        { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
        { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
        { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" }
      ],
      done: []
    },
  ]
}

function completed(stages){
  var i;
  for (i = 0; i < stages.length; i++)
    if (stages[i].groups.length != stages[i].done.length) break;
  return i;
}

function groupColor(group, stage){
  if(stage.done.includes(group))
    return "lightGreen"
  return "yellow"
}


function getStageIcon(stage){
  if(stage.groups.length===stage.done.length)
    return <CheckIcon />
  return <CloseIcon />
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  divider: {
    background: 'black',
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <div className={classes.root}>
        <Typography variant="h3">Dashboard</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={getPending().length} color="primary" anchorOrigin={{vertical: 'top', horizontal: 'right'}} >
              <Typography className={classes.heading} style={{paddingRight: '10px'}}>Pending Action</Typography>
            </Badge>
          </AccordionSummary>
          {getPending().map((request) => {
            return <Paper style={{margin: '5px'}} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>
                      {request.name}
                    </Typography>
                    <Typography>
                      AO: {request.ao}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={completed(request.stages)}>
                      {request.stages.map((stage) => {
                        return (
                          <Step >
                            <StepLabel>{stage.label}</StepLabel>
                            {stage.groups.map((group) => (
                              <Typography style={{ marginLeft: "32px", backgroundColor: groupColor(group, stage) }}>
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
                    <Button color='primary' variant='contained'>
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          })}
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={getEnRoute().length} color="primary" anchorOrigin={{vertical: 'top', horizontal: 'right'}} >
              <Typography className={classes.heading} style={{paddingRight: '10px'}}>En Route</Typography>
            </Badge>
          </AccordionSummary>
          {getEnRoute().map((request) => {
            return <Paper style={{margin: '5px'}} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>
                      {request.name}
                    </Typography>
                    <Typography>
                      AO: {request.ao}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={completed(request.stages)}>
                      {request.stages.map((stage) => {
                        return (
                          <Step >
                            <StepLabel>{stage.label}</StepLabel>
                            {stage.groups.map((group) => (
                              <Typography style={{ marginLeft: "32px", backgroundColor: groupColor(group, stage) }}>
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
                    <Button color='primary' variant='contained'>
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          })}
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={getCompleted().length} color="primary" anchorOrigin={{vertical: 'top', horizontal: 'right'}} >
              <Typography className={classes.heading} style={{paddingRight: '10px'}}>Completed</Typography>
            </Badge>
          </AccordionSummary>
          {getCompleted().map((request) => {
            return <Paper style={{margin: '5px'}} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>
                      {request.name}
                    </Typography>
                    <Typography>
                      AO: {request.ao}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={completed(request.stages)}>
                      {request.stages.map((stage) => {
                        return (
                          <Step >
                            <StepLabel>{stage.label}</StepLabel>
                            {stage.groups.map((group) => (
                              <Typography style={{ marginLeft: "32px", backgroundColor: groupColor(group, stage) }}>
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
                    <Button color='primary' variant='contained'>
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          })}
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Badge badgeContent={getCanceled().length} color="primary" anchorOrigin={{vertical: 'top', horizontal: 'right'}} >
              <Typography className={classes.heading} style={{paddingRight: '10px'}}>Canceled</Typography>
            </Badge>
          </AccordionSummary>
          {getCanceled().map((request) => {
            return <Paper style={{margin: '5px'}} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>
                      {request.name}
                    </Typography>
                    <Typography>
                      AO: {request.ao}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={completed(request.stages)}>
                      {request.stages.map((stage) => {
                        return (
                          <Step >
                            <StepLabel>{stage.label}</StepLabel>
                            {stage.groups.map((group) => (
                              <Typography style={{ marginLeft: "32px", backgroundColor: groupColor(group, stage) }}>
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
                    <Button color='primary' variant='contained'>
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          })}
        </Accordion>
    </div>
  );
}