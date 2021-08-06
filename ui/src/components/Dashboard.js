//bug: expanded accordions mess up the styling cause they're longer than the page
// dependencies
import React from "react";
import { v4 as uuidv4 } from "uuid";
import AppContext from "../contexts/AppContext";

import AlertDialog from "./helpers/AlertDialog";
import ViewRequest from "./ViewRequest";
import PendingAction from "./PendingAction";

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
  makeStyles,
} from "@material-ui/core";

// icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

export default function Dashboard() {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxHeight: "75vh",
      minWidth: 900,
      overflowY: "auto",
      overflowX: "hidden",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: 2.5,
    },
    divider: {
      background: "black",
    },
    typography: {
      padding: theme.spacing(2),
    },
    button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }));

  const {
    setAllUsers,
    allUsers,
    reload,
    currentUserDetails,
    baseURL,
    alert,
    setAlert,
    setOpenAlert,
  } = React.useContext(AppContext);
  const classes = useStyles();

  const [dashReload, setDashReload] = React.useState(false);
  const [pending] = React.useState([]);
  const [enRoute] = React.useState([]);
  const [completed] = React.useState([]);
  const [cancelled] = React.useState([]);

  React.useEffect(async () => {
    if (currentUserDetails) {
      let response = await fetch(`${baseURL}/routes/requests/get/all/details`);
      if (response.status === 200) {
        let data = await response.json();
        let groups = await fetch(`${baseURL}/groups/?include_users=true`)
          .then((res) => res.json())
          .catch((err) => console.log(err));
        sortRequests(data, groups);
      } else {
        let err = await response.json();
        console.log(err);
      }
    }
  }, [reload]);

  React.useEffect(() => {
    fetch(`${baseURL}/users`)
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, []);

  async function sortRequests(requestArray, groups) {
    requestArray.forEach((request) => {
      request.stages.forEach((stage) => {
        stage.substages.forEach((substage) => {
          if (substage.supervisor_id) {
            request.substage_id = substage.substage_id;
            return; //need to find a way to populate user with GET
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

    requestArray.forEach((request) => {
      if (request.current_stage === -1) {
        return;
      } else {
        let currStage = request.current_stage;
        request.substage = request.stages[currStage].substages.filter(
          (substage) => {
            if (substage.supervisor_id) {
              return true;
            } else {
              for (let i = 0; i < currentUserDetails.groups.length; i++) {
                if (
                  substage.group_id === currentUserDetails.groups[i].group_id
                ) {
                  return true;
                }
              }
            }
          }
        );
      }
    });

    let user_id = currentUserDetails.user_id;
    let userGroups = currentUserDetails.groups;

    requestArray.forEach((request) => {
      let currStage = request.current_stage;

      if (request.status === "Completed" || request.status === "Cancelled") {
        if (request.initiator_id === user_id) {
          if (request.status === "Completed") {
            return completed.push(request);
          } else {
            return cancelled.push(request);
          }
        }
      } else {
        if (currStage === -1 && request.initiator_id === user_id) {
          return pending.push(request);
        } else if (request.initiator_id !== user_id && currStage !== -1) {
          let currSubstages = request.stages[currStage].substages;
          for (let i = 0; i < userGroups.length; i++) {
            for (let j = 0; j < currSubstages.length; j++) {
              if (
                userGroups[i].group_id === currSubstages[j].group_id &&
                currSubstages[j].status !== "Approved"
              ) {
                request.ao = userGroups[i];
                return pending.push(request);
              }
              if (user_id === currSubstages[j].supervisor_id) {
                return pending.push(request);
              }
            }
          }
        } else if (currStage !== -1) {
          return enRoute.push(request);
        }
      }
    });
    setDashReload(true);
    setDashReload(!dashReload);
  }

  // function completedStages(stages) {
  //   var i;
  //   for (let i = 0; i < stages.length; i++)
  //     if (stages[i].status !== "Approved") break;
  //   return i;
  // }

  function groupColor(group) {
    if (group.status === "Approved") return "#77DD77";
    if (group.status === "Denied") return "#FF6961";
    return "#FDFD96";
  }

  function getStageIcon(stage) {
    if (stage.status === "Approved") return <CheckIcon />;
    if (stage.status === "Denied") return <BlockIcon />;
    return <CloseIcon />;
  }

  return (
    <div className={classes.root}>
      <AlertDialog bodyAlert={alert} />
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Badge
            badgeContent={pending.length}
            color="secondary"
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
            <Paper
              style={{ margin: 5, marginBottom: 15 }}
              elevation={2}
              key={uuidv4()}
            >
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        filter: "drop-shadow(1px 1px 1px lightgray)",
                      }}
                      variant="body1"
                    >
                      {request.request_subject}
                    </Typography>
                    <Typography
                      style={{
                        marginTop: 5,
                      }}
                      variant="caption"
                    >
                      Initiator:{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).rank
                      }{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).lname
                      }
                    </Typography>
                    <Tooltip title="Group that you are representing for this action">
                      <Typography
                        style={{
                          marginTop: 5,
                          display: "flex",
                          cursor: "pointer",
                        }}
                        variant="caption"
                      >
                        Requires Action From:{" "}
                        {request.ao ? request.ao.group_name : "Initiator"}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={9}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step key={uuidv4()}>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                key={uuidv4()}
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                  borderRadius: 5,
                                  paddingTop: 1,
                                  paddingBottom: 2,
                                  paddingLeft: 4,
                                  paddingRight: 4,
                                }}
                                variant="body2"
                              >
                                {group.supervisor_id
                                  ? `${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).rank
                                    } ${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).lname
                                    }`
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1} className={classes.button}>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={async () => {
                        await setAlert({
                          title: "Pending Action",
                          text: (
                            <PendingAction
                              request={request}
                              handleClose={setOpenAlert}
                              currentUserDetails={currentUserDetails}
                            />
                          ),
                          closeAction: "Close Request",
                        });
                        await setOpenAlert(true);
                      }}
                    >
                      Take Action
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
            <Paper
              style={{ margin: 5, marginBottom: 15 }}
              elevation={2}
              key={uuidv4()}
            >
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        filter: "drop-shadow(1px 1px 1px lightgray)",
                      }}
                      variant="body1"
                    >
                      {request.request_subject}
                    </Typography>
                    <Typography
                      style={{
                        marginTop: 5,
                      }}
                      variant="caption"
                    >
                      Initiator:{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).rank
                      }{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).lname
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step key={uuidv4()}>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                key={uuidv4()}
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                  borderRadius: 5,
                                  paddingTop: 1,
                                  paddingBottom: 2,
                                  paddingLeft: 4,
                                  paddingRight: 4,
                                }}
                                variant="body2"
                              >
                                {group.supervisor_id
                                  ? `${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).rank
                                    } ${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).lname
                                    }`
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1} className={classes.button}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={async () => {
                        await setAlert({
                          title: "Pending Action",
                          text: (
                            <ViewRequest
                              request={request}
                              handleClose={setOpenAlert}
                            />
                          ),
                          closeAction: "Close Request",
                        });
                        await setOpenAlert(true);
                      }}
                    >
                      Review
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
            <Paper
              style={{ margin: 5, marginBottom: 15 }}
              elevation={2}
              key={uuidv4()}
            >
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        filter: "drop-shadow(1px 1px 1px lightgray)",
                      }}
                      variant="body1"
                    >
                      {request.request_subject}
                    </Typography>
                    <Typography
                      style={{
                        marginTop: 5,
                      }}
                      variant="caption"
                    >
                      Initiator:{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).rank
                      }{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).lname
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step key={uuidv4()}>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                key={uuidv4()}
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                  borderRadius: 5,
                                  paddingTop: 1,
                                  paddingBottom: 2,
                                  paddingLeft: 4,
                                  paddingRight: 4,
                                }}
                                variant="body2"
                              >
                                {group.supervisor_id
                                  ? `${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).rank
                                    } ${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).lname
                                    }`
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1} className={classes.button}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={async () => {
                        await setAlert({
                          title: "Pending Action",
                          text: (
                            <ViewRequest
                              request={request}
                              handleClose={setOpenAlert}
                            />
                          ),
                          closeAction: "Close Request",
                        });
                        await setOpenAlert(true);
                      }}
                    >
                      Review
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
            <Paper
              style={{ margin: 5, marginBottom: 15 }}
              elevation={2}
              key={uuidv4()}
            >
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        filter: "drop-shadow(1px 1px 1px lightgray)",
                      }}
                      variant="body1"
                    >
                      {request.request_subject}
                    </Typography>
                    <Typography
                      style={{
                        marginTop: 5,
                      }}
                      variant="caption"
                    >
                      Initiator:{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).rank
                      }{" "}
                      {
                        allUsers.find(
                          (user) => request.initiator_id === user.id
                        ).lname
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Stepper activeStep={request.current_stage}>
                      {request.stages.map((stage) => {
                        return (
                          <Step key={uuidv4()}>
                            <StepLabel>
                              {stage.stage_name}
                              {getStageIcon(stage)}
                            </StepLabel>
                            {stage.substages.map((group) => (
                              <Typography
                                key={uuidv4()}
                                style={{
                                  marginLeft: "32px",
                                  backgroundColor: groupColor(group),
                                  borderRadius: 5,
                                  paddingTop: 1,
                                  paddingBottom: 2,
                                  paddingLeft: 4,
                                  paddingRight: 4,
                                }}
                                variant="body2"
                              >
                                {group.supervisor_id
                                  ? `${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).rank
                                    } ${
                                      allUsers.find(
                                        (user) =>
                                          group.supervisor_id === user.id
                                      ).lname
                                    }`
                                  : group.group_name}
                              </Typography>
                            ))}
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Grid>
                  <Grid item xs={1} className={classes.button}>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={async () => {
                        await setAlert({
                          title: "Pending Action",
                          text: (
                            <ViewRequest
                              request={request}
                              handleClose={setOpenAlert}
                            />
                          ),
                          closeAction: "Close Request",
                        });
                        await setOpenAlert(true);
                      }}
                    >
                      Review
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
