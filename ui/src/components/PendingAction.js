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
const PendingAction = (props) => {
  const classes = useStyles();
  const { request, handleClose, currentUserDetails } = props;
  let currStage = request.current_stage;
  // const templates = getTemplates();
  const [supervisor, setSupervisor] = React.useState([]);
  const [reload, setReload] = React.useState(false);

  const handleChange = (event) => {
    setTemplate(event.target.value);
  };

  const handleDeny = () => {
    return;
  };

  const handleApprove = () => {
    return;
  };

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
          ></Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper className={classes.paperSecond}>
              <Typography
                style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
              >
                Request Subject
              </Typography>
              <Typography style={{ margin: "15px" }}>
                {request.request_subject}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper
              className={classes.paperSecond}
              style={{ maxHeight: "34.5vh" }}
            >
              <Typography
                style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
              >
                Request Change Log
              </Typography>
              <Typography style={{ margin: "15px" }}>
                {request.change_log}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} style={{ margin: "15px" }}>
            <Paper className={classes.paperSecond}>
              <Typography
                style={{ fontWeight: 600, marginTop: 5, marginLeft: 5 }}
              >
                Request Documents
              </Typography>
              <Typography style={{ margin: "15px" }}>N/A</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <h3>{request.stages[currStage].stage_name}</h3>
          <TextField
            variant="outlined"
            id="request_name"
            label="Stage Name"
            // onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
            value={request.stages[currStage].stage_name}
            style={{
              marginBottom: 15,
              marginTop: 22.5,
              cursor: "not-allowed",
            }}
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
          >
            <MenuItem value="" disabled>
              <em>Measure of Time</em>
            </MenuItem>
            <MenuItem value={"Hours"}>Hours</MenuItem>
            <MenuItem value={"Days"}>Days</MenuItem>
            <MenuItem value={"Weeks"}>Weeks</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            id="request_name"
            label="Stage status"
            // onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
            value={request.stages[currStage].status}
            style={{
              marginBottom: 15,
              marginTop: 22.5,
              cursor: "not-allowed",
            }}
          />
          <Grid xs={12}>
            <TextField
              label="Stage Instructions"
              multiline
              rows={10}
              variant="outlined"
              value={request.stages[currStage].stage_instructions}
              style={{ marginTop: 10, width: 300 }}
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} className={classes.tabs}>
            <div className={classes.root}>
              <Paper style={{ padding: "30px" }}>
                <div>
                  <Typography className={classes.instructions}>
                    <TextField
                      label="Substage Notes"
                      multiline
                      rows={5}
                      variant="outlined"
                      style={{
                        marginTop: 10,
                        marginRight: 10,
                        width: 250,
                      }}
                      required
                    />
                    <TextField
                      label="Substage Documents"
                      multiline
                      rows={5}
                      variant="outlined"
                      style={{
                        marginBottom: 15,
                        marginTop: 10,
                        marginRight: 10,
                      }}
                      required
                    />
                  </Typography>
                  <Grid container>
                    <Grid item xs={4} style={{ marginTop: 10 }}>
                      <Button
                        onClick={handleDeny}
                        className={classes.button}
                        color="primary"
                        style={{
                          marginRight: "6.8vw",
                          position: "relative",
                          left: "5.8vw",
                        }}
                        variant="outlined"
                      >
                        Deny
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleApprove}
                        className={classes.button}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Paper>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={2} style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            component="label"
            color="secondary"
            onClick={handleClose}
          >
            Close Request
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PendingAction;
