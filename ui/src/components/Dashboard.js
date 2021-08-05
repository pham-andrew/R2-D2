//dashboard
//bug: expanded accordions mess up the styling cause they're longer than the page

import React from "react";
import ViewRequest from "./ViewRequest";
import AppContext from "../contexts/AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Badge from "@material-ui/core/Badge";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";
import Popover from '@material-ui/core/Popover';

export default function Dashboard() {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    divider: {
      background: "black",
    },
    typography: {
    padding: theme.spacing(2),
  },
  }));

  const {
    reload,
    setReload,
    currentUserDetails,
    baseURL,
    alert,
    setAlert,
    setOpenAlert,
  } = React.useContext(AppContext);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [pending, setPending] = React.useState([]);
  const [enRoute, setEnRoute] = React.useState([]);
  const [completed, setCompleted] = React.useState([]);
  const [cancelled, setCancelled] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(async () => {
    if (currentUserDetails) {
      let response = await fetch(`${baseURL}/routes/requests/get/all/details`);
      if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        let groups = await fetch(`${baseURL}/groups/?include_users=true`)
          .then((res) => res.json())
          .catch((err) => console.log(err));
        sortRequests(data, groups);
      } else {
        let err = await response.json();
        console.log(err);
      }
    }
  }, []);

    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function sortRequests(requestArray, groups) {
    requestArray.forEach((request) => {
      request.stages.forEach((stage) => {
        stage.substages.forEach((substage) => {
          if (substage.supervisor_id) {
            return;
          } else {
            for (let i = 0; i < groups.length; i++) {
              if (substage.group_id === groups[i].group_id) {
                return (substage.group_name = groups[i].group_name);
              }
            }
          }
        });
      });
    });

    let user_id = currentUserDetails.user_id;
    let userGroups = currentUserDetails.groups;
    requestArray.forEach((request) => {
      let currStage = request.current_stage;
      if (request.status !== "Completed" || "Cancelled") {
        if (currStage === -1 && request.initiator_id === user_id) {
          // request.ao = `${currentUserDetails.fname} ${currentUserDetails.lname} (${currentUserDetails.rank})`;
          return enRoute.push(request);
        } else if (request.initiator_id !== user_id) {
          console.log(currStage);
          let currSubstages = request.stages[currStage].substages;
          for (let i = 0; i < userGroups.length; i++) {
            for (let j = 0; j < currSubstages.length; j++) {
              if (userGroups[i].group_id === currSubstages[j].group_id) {
                request.ao = userGroups[i].group_name;
                return pending.push(request);
              }
              if (user_id === currSubstages[j].supervisor_id) {
                return pending.push(request);
              }
            }
          }
        } else {
          return enRoute.push(request);
        }
      } else if (
        request.status !== "Completed" &&
        request.user_id === user_id
      ) {
        return completed.push(request);
      }
      // else if (
      //   request.status !== "Cancelled" &&
      //   request.user_id === user_id
      // ) {
      //   return cancelled.push(request);
      // }
    });

    console.log("Pending", pending);
    console.log("EnRoute", enRoute);
    console.log("Completed", completed);
    console.log("Cancelled", cancelled);
    setReload(!reload);
  }

  function completedStages(stages) {
    var i;
    for (let i = 0; i < stages.length; i++)
      if (stages[i].status !== "Approved") break;
    return i;
  }

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

  return (
    <div className={classes.root}>
      <Typography variant="h3">Dashboard</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={pending.length}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              Pending Action
            </Typography>
          </Badge>
        </AccordionSummary>
        {pending.map((request) => {
          return (
            <Paper style={{ margin: "5px" }} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>{request.request_subject}</Typography>
                    {/* <Typography>AO: {request.ao}</Typography> */}
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                }}
                              >
                                {group.supervisor_id
                                  ? group.supervisor_id
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={1}>
                    <Button color="primary" variant="contained">
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          );
        })}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={enRoute.length}
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
        {enRoute.map((request) => {
          return (
            <Paper style={{ margin: "5px" }} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>{request.request_subject}</Typography>
                    {/* <Typography>AO: {request.ao}</Typography> */}
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                }}
                              >
                                {group.supervisor_id
                                  ? group.supervisor_id
                                  : group.group_name}
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
                      onClick={handleClick}
                    >
                      Open
                    </Button>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <ViewRequest request={request} handleClose={handleClose}/>
                    </Popover>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          );
        })}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={completed.length}
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
        {completed.map((request) => {
          return (
            <Paper style={{ margin: "5px" }} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>{request.request_subject}</Typography>
                    {/* <Typography>AO: {request.ao}</Typography> */}
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                }}
                              >
                                {group.supervisor_id
                                  ? group.supervisor_id
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={1}>
                    <Button color="primary" variant="contained">
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          );
        })}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={cancelled.length}
            color="primary"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              className={classes.heading}
              style={{ paddingRight: "10px" }}
            >
              Cancelled
            </Typography>
          </Badge>
        </AccordionSummary>
        {cancelled.map((request) => {
          return (
            <Paper style={{ margin: "5px" }} elevation={2}>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography>{request.request_subject}</Typography>
                    {/* <Typography>AO: {request.ao}</Typography> */}
                  </Grid>
                  <Grid item xs={7}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                }}
                              >
                                {group.supervisor_id
                                  ? group.supervisor_id
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={1}>
                    <Button color="primary" variant="contained">
                      Open
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Paper>
          );
        })}
      </Accordion>
    </div>
  );
}

//Testing Data

// function getPending() {
// return [
//   {
//     name: "Promotion Package",
//     ao: "Anakin Skywalker",
//     stages: [
//       {
//         label: "Stage 1",
//         groups: ["Group 1"],
//         done: ["Group 1"],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "dew it",
//       },
//       {
//         label: "Stage 2",
//         groups: ["Group 2", "Group 3"],
//         done: ["Group 2"],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "execute order 66",
//       },
//       {
//         label: "Stage 3",
//         groups: ["Group 4"],
//         done: [],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "dew it",
//       },
//     ],
//     done: [],
//   },
//   {
//     name: "SSS Package",
//     ao: "Andrew Pham",
//     stages: [
//       {
//         label: "Stage 1",
//         groups: ["Group 1"],
//         done: ["Group 1"],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "dew it",
//       },
//       {
//         label: "Stage 2",
//         groups: ["Group 2", "Group 3"],
//         done: ["Group 2"],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "execute order 66",
//       },
//       {
//         label: "Stage 3",
//         groups: ["Group 4"],
//         done: [],
//         suspense: "2014-08-18T21:11:54",
//         instructions: "dew it",
//       },
//     ],
//     done: [],
//   },
// ];
// }

// function getEnRoute() {
//   return [
//     {
//       name: "Promotion Package",
//       ao: "Anakin Skywalker",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: [],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//   ];
// }

// function getCompleted() {
//   return [
//     {
//       name: "Promotion Package",
//       ao: "Anakin Skywalker",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2", "Group 3"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: ["Group 4"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//     {
//       name: "SSS Package",
//       ao: "Andrew Pham",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2", "Group 3"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: ["Group 4"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//     {
//       name: "Engineering Change Request",
//       ao: "Jacob Joy",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2", "Group 3"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: ["Group 4"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//     {
//       name: "Engineering Change Request 2",
//       ao: "Jacob Joy",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2", "Group 3"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: ["Group 4"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//   ];
// }

// function getCanceled() {
//   return [
//     {
//       name: "Promotion Package",
//       ao: "Anakin Skywalker",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: [],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//     {
//       name: "SSS Package",
//       ao: "Andrew Pham",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: [],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//     {
//       name: "Engineering Change Request",
//       ao: "Jacob Joy",
//       stages: [
//         {
//           label: "Stage 1",
//           groups: ["Group 1"],
//           done: ["Group 1"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//         {
//           label: "Stage 2",
//           groups: ["Group 2", "Group 3"],
//           done: ["Group 2"],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "execute order 66",
//         },
//         {
//           label: "Stage 3",
//           groups: ["Group 4"],
//           done: [],
//           suspense: "2014-08-18T21:11:54",
//           instructions: "dew it",
//         },
//       ],
//       done: [],
//     },
//   ];
// }
