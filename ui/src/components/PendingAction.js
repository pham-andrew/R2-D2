//create request

// Dependencies
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../contexts/AppContext";

// Components
import {
  makeStyles,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@material-ui/core";
import PromptDialog from "./helpers/PromptDialog";

//icons
import AttachmentIcon from "@material-ui/icons/Attachment";

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
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

//2nd CreateRequest location
const PendingAction = (props) => {
  const { setPrompt, prompt, setOpenPrompt } = useContext(AppContext);
  const history = useHistory();
  const classes = useStyles();
  const { request, handleClose, currentUserDetails } = props;
  const [currStage, setCurrentStage] = useState(0);
  const [reload, setReload] = React.useState(false);
  const [comments, setComments] = useState("");

  React.useEffect(() => {
    if (request.current_stage !== -1) {
      setCurrentStage(request.current_stage);
    }
  });

  const handleChange = (e) => {
    setComments(e.target.value);
  };

  const handleDeny = async () => {
    let data = {
      rank: currentUserDetails.rank,
      lname: currentUserDetails.lname,
      user_id: currentUserDetails.user_id,
      notes: comments,
      request_stage_id: request.stages[currStage].stage_id,
      request_id: request.request_id,
      change_log: request.change_log,
      current_stage: request.current_stage,
      substage_id: request.substage[0].substage_id,
    };
    if (comments.length < 1) {
      await setPrompt({
        title: "Submission Error",
        text: "Please provide comments before submitting your response",
        closeAction: "Okay",
      });
      await setOpenPrompt(true);
    } else {
      let response = await fetch(
        `${baseURL}/routes/requests/patch/substage/deny`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setReload(!reload);
        history.push("/profile");
        history.push("/dashboard");
        return handleClose(false);
      } else {
        let err = await response.json();
        return console.log(err);
      }
    }
  };

  const handleApprove = async () => {
    if (comments.length < 1) {
      await setPrompt({
        title: "Submission Error",
        text: "Please provide comments before submitting your response",
        closeAction: "Okay",
      });
      await setOpenPrompt(true);
    } else {
      if (request.current_stage === -1) {
        let data = {
          rank: currentUserDetails.rank,
          lname: currentUserDetails.lname,
          notes: comments,
          request_stage_id: request.stages[currStage].stage_id,
          request_id: request.request_id,
          change_log: request.change_log,
          current_stage: request.current_stage,
        };

        console.log(data);

        let response = await fetch(`${baseURL}/routes/requests/resubmit`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.status === 200) {
          setReload(!reload);
          history.push("/profile");
          history.push("/dashboard");
          return handleClose(false);
        } else {
          let err = await response.json();
          return console.log(err);
        }
      } else {
        let final_stage =
          currStage === request.stages.length - 1 ? true : false;
        let next_stage_id = !final_stage
          ? request.stages[currStage + 1].stage_id
          : null;

        let data = {
          rank: currentUserDetails.rank,
          lname: currentUserDetails.lname,
          user_id: currentUserDetails.user_id,
          notes: comments,
          substage_id: request.substage[0].substage_id,
          request_stage_id: request.stages[currStage].stage_id,
          request_id: request.request_id,
          change_log: request.change_log,
          final_stage: final_stage,
          current_stage: request.current_stage,
          next_stage_id: next_stage_id,
        };
        console.log(data);

        let response = await fetch(
          `${baseURL}/routes/requests/patch/substage/approve`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (response.status === 200) {
          setReload(!reload);
          history.push("/profile");
          history.push("/dashboard");
          return handleClose(false);
        } else {
          let err = await response.json();
          return console.log(err);
        }
      }
    }
  };

  return (
    <div>
      <PromptDialog bodyPrompt={prompt} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Pending Action Dialog</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", marginLeft: 5 }}>
            <DialogContentText style={{ marginRight: 5 }}>
              Request Subject:
            </DialogContentText>
            <Typography style={{ fontWeight: 600 }}>
              {request.request_subject}
            </Typography>
          </div>
          <Grid direction="row" xs={6}>
            <TextField
              variant="outlined"
              id="request_name"
              label="Stage Name"
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={request.stages[currStage].stage_name}
              style={{
                marginTop: 20,
                marginBottom: 15,
              }}
            />
            <TextField
              variant="outlined"
              id="request_name"
              label="Stage status"
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={request.stages[currStage].status}
              style={{
                marginBottom: 15,
              }}
            />
          </Grid>
          <Grid item xs={6} style={{ display: "flex" }}>
            <TextField
              value={
                request.stages[currStage].suspense_hours > 24 &&
                !(request.stages[currStage].suspense_hours / 24)
                  .toString()
                  .includes(".")
                  ? request.stages[currStage].suspense_hours > 168 &&
                    !(request.stages[currStage].suspense_hours / 168)
                      .toString()
                      .includes(".")
                    ? request.stages[currStage].suspense_hours / 168
                    : request.stages[currStage].suspense_hours / 24
                  : request.stages[currStage].suspense_hours
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
              fullWidth
            />
            <TextField
              value={
                request.stages[currStage].suspense_hours > 24 &&
                !(request.stages[currStage].suspense_hours / 24)
                  .toString()
                  .includes(".")
                  ? request.stages[currStage].suspense_hours > 168 &&
                    !(request.stages[currStage].suspense_hours / 168)
                      .toString()
                      .includes(".")
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
              fullWidth
            >
              <MenuItem value="" disabled>
                <em>Measure of Time</em>
              </MenuItem>
              <MenuItem
                value={"Hours"}
                disabled={
                  (request.stages[currStage].suspense_hours > 24 &&
                  !(request.stages[currStage].suspense_hours / 24)
                    .toString()
                    .includes(".")
                    ? request.stages[currStage].suspense_hours > 168 &&
                      !(request.stages[currStage].suspense_hours / 168)
                        .toString()
                        .includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Hours"
                    ? true
                    : false
                }
              >
                Hours
              </MenuItem>
              <MenuItem
                value={"Days"}
                disabled={
                  (request.stages[currStage].suspense_hours > 24 &&
                  !(request.stages[currStage].suspense_hours / 24)
                    .toString()
                    .includes(".")
                    ? request.stages[currStage].suspense_hours > 168 &&
                      !(request.stages[currStage].suspense_hours / 168)
                        .toString()
                        .includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Days"
                    ? true
                    : false
                }
              >
                Days
              </MenuItem>
              <MenuItem
                value={"Weeks"}
                disabled={
                  (request.stages[currStage].suspense_hours > 24 &&
                  !(request.stages[currStage].suspense_hours / 24)
                    .toString()
                    .includes(".")
                    ? request.stages[currStage].suspense_hours > 168 &&
                      !(request.stages[currStage].suspense_hours / 168)
                        .toString()
                        .includes(".")
                      ? "Weeks"
                      : "Days"
                    : "Hours") !== "Weeks"
                    ? true
                    : false
                }
              >
                Weeks
              </MenuItem>
            </TextField>
            {/* </span> */}
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Stage Instructions"
              multiline
              rows={10}
              variant="outlined"
              value={request.stages[currStage].stage_instructions}
              style={{ marginTop: 10, width: 300, whiteSpace: "pre-line" }}
              required
            />
            <Paper className={classes.paperSecond} style={{ overflow: "auto" }}>
              <Typography
                style={{
                  fontWeight: 600,
                  marginTop: 5,
                  marginLeft: 7.5,
                  overflow: "auto",
                }}
              >
                Request Change Log
              </Typography>
              <Typography
                style={{
                  margin: "15px",
                  whiteSpace: "pre-line",
                  overflow: "auto",
                  maxHeight: 150,
                }}
              >
                {request.change_log}
              </Typography>
            </Paper>
          </Grid>

          <div
            style={{
              border: "1px solid lightgray",
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                color="default"
                size="small"
                style={{
                  marginBottom: 15,
                  marginTop: -20,
                  marginLeft: 10,
                }}
              >
                Download All
                <input type="file" hidden />
              </Button>
              <Button
                variant="contained"
                component="label"
                color="default"
                size="small"
                style={{
                  marginBottom: 15,
                  marginTop: -20,
                  marginLeft: 10,
                }}
              >
                Upload Document
                <input type="file" hidden />
              </Button>
            </Grid>
            <div style={{ maxHeight: 134, overflow: "auto" }}>
              <ListItem className={classes.attachments} button>
                <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                <Typography style={{ margin: "15px" }}>
                  <a href="/documents/SacredJedi.txt" download>
                    The Sacred Jedi Texts Volume 1
                  </a>
                </Typography>
              </ListItem>
              <ListItem className={classes.attachments} button>
                <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                <Typography style={{ margin: "15px" }}>
                  <a href="/documents/HitchhikersGuide.txt" download>
                    Hitchhiker's Guide to the Galaxy
                  </a>
                </Typography>
              </ListItem>
              <ListItem className={classes.attachments} button>
                <AttachmentIcon style={{ fontSize: 20, marginRight: 5 }} />
                <Typography style={{ margin: "15px" }}>
                  <a href="/documents/ZappBrannigan.txt" download>
                    Zapp Brannigan Quotes
                  </a>
                </Typography>
              </ListItem>
            </div>
          </div>
          <Typography
            variant="caption"
            style={{ color: "#9E9C9C", marginLeft: 15 }}
          >
            Download documents to review them, and upload them back here
          </Typography>
          <TextField
            style={{ marginTop: 20, marginBottom: 10 }}
            multiline
            rows={4}
            autoFocus
            margin="dense"
            onChange={handleChange}
            label="Comments"
            id="comments"
            fullWidth
            variant="outlined"
            required
            helperText={`Comments for the reviewers that are earlier or later in the chain`}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          {request.current_stage === -1 ? (
            <Button onClick={handleApprove} color="primary" variant="contained">
              Resubmit
            </Button>
          ) : (
            <>
              <Button
                onClick={handleDeny}
                color="secondary"
                variant="contained"
              >
                Deny
              </Button>
              <Button
                onClick={handleApprove}
                color="primary"
                variant="contained"
              >
                Approve
              </Button>
            </>
          )}
          <Button
            onClick={() => {
              handleClose();
            }}
            color="default"
            variant="contained"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PendingAction;
