//create request
//wishlist: an edit button that undisables the stage inputs and saves edits

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
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";


//icons
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';


import { v4 as uuidv4 } from "uuid";

//hookup backend here in these functions!
function getStages() {
  return [
    { label: "Stage 1", groups: ["Group 1"], done: ["Group 1"], suspense: "2014-08-18T21:11:54", instructions: "dew it"},
    { label: "Stage 2", groups: ["Group 2", "Group 3"], done: ["Group 2"], suspense: "2014-08-18T21:11:54", instructions: "execute order 66" },
    { label: "Stage 3", groups: ["Group 4"], done: [], suspense: "2014-08-18T21:11:54", instructions: "dew it" },
  ];
}
function getGroupMembers(group){
  if(group==="Group 1")
    return ["palpatine", "darth vader", "storm trooper"]
  if(group==="Group 2")
    return ["andrew", "jack", "brandon"]
  if(group==="Group 3")
    return ["kirk", "data"]
  if(group==="Group 4")
    return ["baby yoda", "admiral ackbar"]
}
//returns if member has completed their submission. testing for dashboard
// function memberDone(member){
//   if(member==="palpatine"||member==="darth vader"||member==="storm trooper")
//     return true
//   if(member==="andrew"||member==="jack"||member==="brandon")
//     return true
//   if(member==="kirk")
//     return true
//   return false
// }

function getTemplates(){
  return [
    {name: "eSSS", instructions: "dew it", documents: "iono how this will work..."},
    {name: "Engineering Change Request", instructions: "execute order 66", documents: "like literally however you pull documents"},
    {name: "Award Package", instructions: "dew it", documents: "like some kind of link probably?"}
  ]
}

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

function completed(stages){

  var i;
  for (i = 0; i < stages.length; i++)
    if (stages[i].groups.length != stages[i].done.length) break;
  return i;
}

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

function getStageIcon(stage){
  if(stage.groups.length===stage.done.length)
    return <CheckIcon />
  return <CloseIcon />
}

function getStageContent(step, stage) {


  const classes = useStyles();
  const [selectedGroup, setSelectedGroup] = React.useState(0)

  if(stage.groups[selectedGroup])
    return <Grid container>
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
              Groups
              <Paper className={classes.paper}>
                <List dense component="div" role="list">
                  {stage.groups.map((group, index) => {
                    return(
                      <ListItem
                        key={uuidv4()}
                        role="listitem"
                        button
                        onClick={()=>setSelectedGroup(index)}
                      >
                        <ListItemText primary={group} />
                      </ListItem>
                    )
                  })}
                </List>
              </Paper>
            </Grid>
            <Grid item>
              Members of {stage.groups[selectedGroup].name}
              <Paper className={classes.paper}>
                <List dense component="div" role="list">
                  {getGroupMembers(stage.groups[selectedGroup]).map((member) => (
                      <ListItem
                        key={uuidv4()}
                        role="listitem"
                        button
                      >
                        <ListItemText primary={member} />
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
          <TextField 
          label="Stage Name" 
          disabled
          label={stage.label}
          />
          <form noValidate style={{ marginBottom: "20px" }}>
            <TextField
              disabled
              label="Suspense"
              type="datetime-local"
              value={stage.suspense}
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
            disabled
            value={stage.instructions}
          />
        </Grid>
      </Grid>

  //default render in case of stale state
  //janky fix here's how to recreate the bug if you want to refactor into better fix
  //delete below return, select a new group, then click next stage
  //the selected group doesnt go back to 0, thus asking for name of group # something which is undef
  return <Grid container>
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
          Groups
          <Paper className={classes.paper}>
            <List dense component="div" role="list">
              {stage.groups.map((group, index) => {
                return(
                  <ListItem
                    key={uuidv4()}
                    role="listitem"
                    button
                    onClick={()=>setSelectedGroup(index)}
                    style={{backgroundColor: groupColor(group, stage)}}
                  >
                    <ListItemText primary={group} />
                  </ListItem>
                )
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item>
          Members of {stage.groups[0].name}
          <Paper className={classes.paper}>
            <List dense component="div" role="list">
              {getGroupMembers(stage.groups[0]).map((member) => (
                  <ListItem
                    key={uuidv4()}
                    role="listitem"
                    button
                    style={{backgroundColor: memberColor(member)}}
                  >
                    <ListItemText primary={member} />
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
      <TextField 
      label="Stage Name" 
      disabled
      label={stage.label}
      />
      <form noValidate style={{ marginBottom: "20px" }}>
        <TextField
          disabled
          label="Suspense"
          type="datetime-local"
          value={stage.suspense}
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
        disabled
        value={stage.instructions}
      />
    </Grid>
  </Grid>

}

const CreateRequest = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const stages = getStages();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [template, setTemplate] = React.useState(0);

  const handleChange = (event) => {
    setTemplate(event.target.value);
  };

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={3}>
          <Grid item xs={12} style={{marginBottom: "50px"}}>
            <FormControl className={classes.formControl}>
              <InputLabel>Template</InputLabel>
              <Select
                value={getTemplates()[0].name}
                onChange={handleChange}
              >
                {getTemplates().map((template, index) => {
                  return (
                    <MenuItem value={index}>{template.name}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px"}}>
            <Paper>
              <Typography style={{margin: "15px"}}>Title: {getTemplates()[template].name}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper>
              <Typography style={{margin: "15px"}}>Instructions: {getTemplates()[template].instructions}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper>
              <Typography style={{margin: "15px"}}>Documents: {getTemplates()[template].documents}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} className={classes.tabs}>
            <div className={classes.root}>
              <Stepper activeStep={completed(getStages())}>
                {stages.map((stage) => {
                  return (

                    <Step >
                      <StepLabel icon={getStageIcon(stage)}>{stage.label}</StepLabel>
                      {stage.groups.map((group) => (
                        <Typography style={{ margingroups: "32px"}}>
                          {group}
                        </Typography>
                      ))}
                    </Step>
                  );
                })}
              </Stepper>
              <Paper style={{padding: "30px"}}>
                <div>
                  <Typography className={classes.instructions}>
                    {getStageContent(activeStep, getStages()[activeStep])}
                  </Typography>
                  <Grid container>
                    <Grid item xs={9} />
                    <Grid item xs={2}> 
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
                        disabled={activeStep === stages.length - 1}
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
        <Grid item xs={11} />
        <Grid item xs={1} style={{ marginTop: "20px" }}>
          <Button variant="contained" component="label">
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateRequest;
