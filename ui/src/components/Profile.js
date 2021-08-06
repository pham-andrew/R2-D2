//dependencies
import React, { useContext, useState, useEffect } from "react";
import AppContext from "../contexts/AppContext";
import auth from "../utils/auth";
import { ValidateEmail, ValidatePassword } from "../utils/regex";
import { v4 as uuidv4 } from "uuid";

// styles
import "../styles/loading.css";

// components
import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Tooltip,
  MenuItem,
} from "@material-ui/core";
import AlertDialog from "./helpers/AlertDialog";
import SnackBar from "./helpers/SnackBar";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: "80vh",
    maxHeight: "80vh",
    overflowX: "hidden",
    overflowY: "auto",
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.primary,
  },
  paperDesc: {
    padding: theme.spacing(2.5),
    textAlign: "left",
    color: theme.palette.text.primary,
  },
  paperHead: {
    padding: theme.spacing(2.5),
    textAlign: "left",
    color: theme.palette.text.primary,
  },
  paperText: {
    padding: theme.spacing(2.5),
    textAlign: "left",
    color: theme.palette.text.primary,
  },
  type: {
    fontWeight: 600,
  },
  input: {
    margin: -8,
  },
  inputPass: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: -6,
    marginLeft: 20,
    marginBottom: -6,
  },
  buttonEdit: {
    marginTop: -6,
    marginBottom: -6,
  },
}));

export default function Login() {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const { currentUserDetails } = useContext(AppContext);
  const { setOpenSnack } = useContext(AppContext);
  const { allUsers, setAllUsers } = useContext(AppContext);
  const { setOpenAlert } = useContext(AppContext);
  const { baseURL } = useContext(AppContext);
  const { alert, setAlert } = useContext(AppContext);

  const [editEmail, setEditEmail] = useState(false);
  const [editRank, setEditRank] = useState(false);
  const [supervisor, setSupervisor] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [editSupervisor, setEditSupervisor] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPass, setValidPass] = useState(false);
  const [validConfirm, setValidConfirm] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [emailHelper, setEmailHelper] = useState("");
  const [oldPHelper, setOldPHelper] = useState("");
  const [newPHelper, setNewPHelper] = useState("");
  const [confirmPHelper, setConfirmPHelper] = useState("");
  const [seePass, setSeePass] = useState(false);
  const [newRank, setNewRank] = useState("");

  const classes = useStyles();

  useEffect(() => {
    fetch(`${baseURL}/users`)
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, [editRank]);

  useEffect(() => {
    fetch(`${baseURL}/users`)
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, [editEmail]);

  const handleChange = (e) => {
    setNewRank(e.target.value);
  };

  const handleEmailCheck = () => {
    let email = document.getElementById("newEmail").value;
    if (ValidateEmail(email)) {
      setValidEmail(false);
      setEmailError(true);
      setEmailHelper("Please enter a valid email");
    } else {
      setValidEmail(true);
      setEmailError(false);
      setEmailHelper("");
    }
  };

  const handleOldPassCheck = () => {
    let oldP = document.getElementById("oldPass").value;
    if (oldP !== currentUser.password) {
      setValidPass(false);
      setPassError(true);
      setOldPHelper("Incorrect password");
    } else {
      setValidPass(true);
      setPassError(false);
      setOldPHelper("");
    }
  };

  const handleNewPassCheck = () => {
    let newP = document.getElementById("newPass").value;
    if (ValidatePassword(newP)) {
      setValidPass(false);
      setPassError(true);
      setNewPHelper("Please enter a valid password");
    } else {
      setValidPass(true);
      setPassError(false);
      setOldPHelper("");
      setNewPHelper("");
      setConfirmPHelper("");
    }
  };

  const handleConfirmPassCheck = () => {
    let newP = document.getElementById("newPass").value;
    let confirmP = document.getElementById("confirmPass").value;
    if (newP !== confirmP) {
      setValidPass(false);
      setPassError(true);
      setConfirmPHelper("Passwords do not match");
    } else {
      setValidPass(true);
      setPassError(false);
      setValidConfirm(true);
      setOldPHelper("");
      setNewPHelper("");
      setConfirmPHelper("");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    switch (e.target.querySelector("p").innerText) {
      case "email":
        setEditEmail(true);
        break;
      case "rank":
        setEditRank(true);
        break;
      case "password":
        setEditPass(true);
        break;
      case "supervisor":
        setEditSupervisor(true);
        break;
      default:
        alert("Something went wrong! Please reload the page.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    switch (e.target.querySelector("p").innerText) {
      case "email":
        await editEmailHandler(e);
        await setEditEmail(false);
        break;
      case "rank":
        await editRankHandler(e);
        await setEditRank(false);
        break;
      case "password":
        await editPassHandler(e);
        await setEditPass(false);
        break;
      case "supervisor":
        await editSupervisorHandler(e);
        await setEditSupervisor(false);
        break;
      default:
        alert("Something went wrong! Please reload the page.");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    switch (e.target.querySelector("p").innerText) {
      case "email":
        setEditEmail(false);
        break;
      case "rank":
        setEditRank(false);
        break;
      case "password":
        setEditPass(false);
        break;
      case "supervisor":
        setEditSupervisor(false);
        break;
      default:
        alert("Something went wrong! Please reload the page.");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await setAlert({
      title: "Delete Account",
      text: "Are you sure you want to delete your account and all associated data?",
      actions: (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{ marginBottom: -5, marginRight: 5 }}
          onClick={async (e) => {
            e.preventDefault();
            await fetch(`${baseURL}/users/delete`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user_id: currentUser.user_id }),
            });

            await auth.logout(() => {
              window.location.href = `${window.location.origin}/`;
            });
          }}
        >
          Confirm
        </Button>
      ),
    });
    await setOpenAlert(true);
  };

  const editEmailHandler = async (e) => {
    e.preventDefault();
    let email = document.getElementById("newEmail").value;
    let indexOfDot = email.indexOf(".");
    let indexOfAt = email.indexOf("@");
    let fname =
      email.substr(0, 1).toUpperCase() + email.substr(1, indexOfDot - 1);
    let lname =
      email.substr(indexOfDot + 1, 1).toUpperCase() +
      email
        .substr(indexOfDot + 2, indexOfAt - indexOfDot - 2)
        .replace(".", "")
        .replace(/[0-9]/g, "");
    console.log(fname, lname);
    await fetch(`${baseURL}/users/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        user_id: currentUser.user_id,
        rank: currentUser.rank,
        fname: fname,
        lname: lname,
        password: currentUser.password,
        role: currentUser.role,
        supervisor_id: currentUser.supervisor_id,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Success") {
          await setAlert({
            title: "Success!",
            text: `Your email was changed to ${email}!`,
            actions: "",
          });
          await setOpenAlert(true);
          await setCurrentUser({
            email: email,
            user_id: currentUser.user_id,
            rank: currentUser.rank,
            fname: fname,
            lname: lname,
            password: currentUser.password,
            role: currentUser.role,
            supervisor_id: currentUser.supervisor_id,
          });
        } else {
          await setAlert({
            title: "Edit Error",
            text: data.message,
            actions: "",
          });
          await setOpenAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const editRankHandler = async (e) => {
    e.preventDefault();

    await fetch(`${baseURL}/users/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser.email,
        user_id: currentUser.user_id,
        rank: newRank,
        fname: currentUser.fname,
        lname: currentUser.lname,
        password: currentUser.password,
        role: currentUser.role,
        supervisor_id: currentUser.supervisor_id,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Success") {
          await setAlert({
            title: "Success!",
            text: `Your rank was changed to ${newRank}!`,
            actions: "",
          });
          await setOpenAlert(true);
          await setCurrentUser({
            email: currentUser.email,
            user_id: currentUser.user_id,
            rank: newRank,
            fname: currentUser.fname,
            lname: currentUser.lname,
            password: currentUser.password,
            role: currentUser.role,
            supervisor_id: currentUser.supervisor_id,
          });
        } else {
          await setAlert({
            title: "Edit Error",
            text: data.message,
            actions: "",
          });
          await setOpenAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const editPassHandler = async (e) => {
    e.preventDefault();
    let password = document.getElementById("newPass").value;
    await fetch(`${baseURL}/users/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser.email,
        user_id: currentUser.user_id,
        rank: currentUser.rank,
        fname: currentUser.fname,
        lname: currentUser.lname,
        role: currentUser.role,
        supervisor_id: currentUser.supervisor_id,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Success") {
          await setAlert({
            title: "Success!",
            text: `Your password was successfully changed!`,
            actions: "",
          });
          await setOpenAlert(true);
          await setCurrentUser({
            email: currentUser.email,
            user_id: currentUser.user_id,
            rank: currentUser.rank,
            fname: currentUser.fname,
            lname: currentUser.lname,
            role: currentUser.role,
            supervisor_id: currentUser.supervisor_id,
            password: password,
          });
        } else {
          await setAlert({
            title: "Edit Error",
            text: data.message,
            actions: "",
          });
          await setOpenAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const editSupervisorHandler = async (e) => {
    e.preventDefault();
    let newSuperName = document.getElementById("newSupervisor").innerText;
    await fetch(`${baseURL}/users/patch`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: currentUser.email,
        user_id: currentUser.user_id,
        rank: currentUser.rank,
        fname: currentUser.fname,
        lname: currentUser.lname,
        role: currentUser.role,
        supervisor_id: supervisor === "N/A" ? null : supervisor,
        password: currentUser.password,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Success") {
          currentUserDetails.supervisor_name = newSuperName;
          await setAlert({
            title: "Success!",
            text: `Your supervisor was successfully changed to ${currentUserDetails.supervisor_name}!`,
            actions: "",
          });
          await setOpenAlert(true);
          await setCurrentUser({
            email: currentUser.email,
            user_id: currentUser.user_id,
            rank: currentUser.rank,
            fname: currentUser.fname,
            lname: currentUser.lname,
            role: currentUser.role,
            supervisor_id: supervisor,
            password: currentUser.password,
          });
        } else {
          await setAlert({
            title: "Edit Error",
            text: data.message,
            actions: "",
          });
          await setOpenAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  if (!currentUser || !currentUserDetails || !allUsers) {
    return (
      <>
        <main>
          <div className="svg-loader">
            <svg
              className="svg-container"
              height="100"
              width="100"
              viewBox="0 0 100 100"
            >
              <circle className="loader-svg bg" cx="50" cy="50" r="45"></circle>
              <circle
                className="loader-svg animate"
                cx="50"
                cy="50"
                r="45"
              ></circle>
            </svg>
          </div>
        </main>
      </>
    );
  } else {
    return (
      <>
        <main>
          <SnackBar bodySnackBar={"Successfully copied email"} />
          <AlertDialog bodyAlert={alert} />
          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography variant="h4" className={classes.type}>
                    {
                      <Tooltip
                        title={`Thank you for using the app, ${
                          currentUser.fname + " " + currentUser.lname
                        }!`}
                      >
                        <span>
                          {currentUser.fname +
                            " " +
                            currentUser.lname +
                            " (" +
                            currentUser.rank +
                            ")"}
                        </span>
                      </Tooltip>
                    }
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Grid container spacing={2} style={{ marginBottom: 20 }}>
                    <Grid item>
                      <Paper
                        className={classes.paperDesc}
                        style={{ paddingRight: 30, paddingLeft: 30 }}
                      >
                        <Typography className={classes.type}>
                          Description
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs>
                      <Paper className={classes.paperDesc}>
                        <Typography className={classes.type}>
                          Your Information
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item>
                      <Paper className={classes.paperDesc}>
                        <Typography
                          style={{ paddingLeft: 64, paddingRight: 64 }}
                          className={classes.type}
                        >
                          Actions
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item>
                      <Paper className={classes.paperHead}>
                        <Typography
                          className={classes.type}
                          style={{ paddingRight: 32.5, paddingLeft: 32.5 }}
                        >
                          Name
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs style={{ overflow: "hidden" }}>
                      <Paper
                        className={classes.paperText}
                        style={{ overflow: "hidden" }}
                      >
                        <Typography id="username">
                          {currentUser.fname + " " + currentUser.lname}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item>
                      <Paper className={classes.paperHead}>
                        <Typography
                          style={{ paddingRight: 34, paddingLeft: 34 }}
                          className={classes.type}
                        >
                          Rank
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs style={{ overflow: "hidden" }}>
                      <Paper
                        className={classes.paperText}
                        style={{ overflow: "hidden" }}
                      >
                        {editRank ? (
                          <TextField
                            style={{ padding: 0, width: 200 }}
                            size="small"
                            select
                            className={classes.input}
                            label="Rank"
                            required={true}
                            id="newRank"
                            defaultValue={`${currentUser.rank}`}
                            onChange={handleChange}
                            variant="outlined"
                          >
                            <MenuItem value="" disabled>
                              <em>Enlisted</em>
                            </MenuItem>
                            <MenuItem value={"E-1"}>E-1</MenuItem>
                            <MenuItem value={"E-2"}>E-2</MenuItem>
                            <MenuItem value={"E-3"}>E-3</MenuItem>
                            <MenuItem value={"E-4"}>E-4</MenuItem>
                            <MenuItem value={"E-5"}>E-5</MenuItem>
                            <MenuItem value={"E-6"}>E-6</MenuItem>
                            <MenuItem value={"E-7"}>E-7</MenuItem>
                            <MenuItem value={"E-8"}>E-8</MenuItem>
                            <MenuItem value={"E-9"}>E-9</MenuItem>
                            <MenuItem value="" disabled>
                              <em>Officer</em>
                            </MenuItem>
                            <MenuItem value={"O-1"}>O-1</MenuItem>
                            <MenuItem value={"O-2"}>O-2</MenuItem>
                            <MenuItem value={"O-3"}>O-3</MenuItem>
                            <MenuItem value={"O-4"}>O-4</MenuItem>
                            <MenuItem value={"O-5"}>O-5</MenuItem>
                            <MenuItem value={"O-6"}>O-6</MenuItem>
                            <MenuItem value={"O-7"}>O-7</MenuItem>
                            <MenuItem value={"O-8"}>O-8</MenuItem>
                            <MenuItem value={"O-9"}>O-9</MenuItem>
                            <MenuItem value={"O-10"}>O-10</MenuItem>
                            <MenuItem value="" disabled>
                              <em>Civilian</em>
                            </MenuItem>
                            <MenuItem value={"GS-01"}>GS-01</MenuItem>
                            <MenuItem value={"GS-02"}>GS-02</MenuItem>
                            <MenuItem value={"GS-03"}>GS-03</MenuItem>
                            <MenuItem value={"GS-04"}>GS-04</MenuItem>
                            <MenuItem value={"GS-05"}>GS-05</MenuItem>
                            <MenuItem value={"GS-06"}>GS-06</MenuItem>
                            <MenuItem value={"GS-07"}>GS-07</MenuItem>
                            <MenuItem value={"GS-08"}>GS-08</MenuItem>
                            <MenuItem value={"GS-09"}>GS-09</MenuItem>
                            <MenuItem value={"GS-10"}>GS-10</MenuItem>
                            <MenuItem value={"GS-11"}>GS-11</MenuItem>
                            <MenuItem value={"GS-12"}>GS-12</MenuItem>
                            <MenuItem value={"GS-13"}>GS-13</MenuItem>
                            <MenuItem value={"GS-14"}>GS-14</MenuItem>
                            <MenuItem value={"GS-15"}>GS-15</MenuItem>
                            <MenuItem value={"SES-V"}>SES-V</MenuItem>
                            <MenuItem value={"SES-IV"}>SES-IV</MenuItem>
                            <MenuItem value={"SES-III"}>SES-III</MenuItem>
                            <MenuItem value={"SES-II"}>SES-II</MenuItem>
                            <MenuItem value={"SES-I"}>SES-I</MenuItem>
                            <MenuItem value="" disabled>
                              <em>Contractor</em>
                            </MenuItem>
                            <MenuItem value={"CTR"}>CTR</MenuItem>
                          </TextField>
                        ) : (
                          <Typography id="email" style={{ marginRight: -25 }}>
                            {currentUser.rank}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item>
                      {editRank ? (
                        <>
                          <Paper className={classes.paperText}>
                            <Tooltip title="Submit New Email">
                              <span>
                                <Button
                                  onClick={handleSubmit}
                                  variant="contained"
                                  color="secondary"
                                  className={classes.buttonEdit}
                                  style={{ marginRight: 10 }}
                                >
                                  Submit
                                  <p style={{ display: "none" }}>rank</p>
                                </Button>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel Changes">
                              <Button
                                onClick={(e) => {
                                  handleCancel(e);
                                }}
                                variant="contained"
                                color="default"
                                className={classes.buttonEdit}
                              >
                                Cancel
                                <p style={{ display: "none" }}>rank</p>
                              </Button>
                            </Tooltip>
                          </Paper>
                        </>
                      ) : (
                        <Paper
                          className={classes.paperText}
                          style={{
                            paddingRight: 81,
                            paddingLeft: 81,
                          }}
                        >
                          <Tooltip title="Edit Rank">
                            <Button
                              onClick={handleEdit}
                              variant="contained"
                              color="primary"
                              className={classes.buttonEdit}
                            >
                              Edit
                              <p style={{ display: "none" }}>rank</p>
                            </Button>
                          </Tooltip>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item>
                      <Paper
                        className={classes.paperHead}
                        style={{ marginLeft: 1 }}
                      >
                        <Typography
                          style={{ paddingRight: 32.5, paddingLeft: 32.5 }}
                          className={classes.type}
                        >
                          Email
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs style={{ overflow: "hidden" }}>
                      <Paper
                        className={classes.paperText}
                        style={{ overflow: "hidden" }}
                      >
                        {editEmail ? (
                          <TextField
                            id="newEmail"
                            variant="outlined"
                            type="text"
                            defaultValue={currentUser.email}
                            size="small"
                            className={classes.input}
                            autoFocus={true}
                            required={true}
                            onBlur={handleEmailCheck}
                            onChange={handleEmailCheck}
                            error={emailError}
                            helperText={emailHelper}
                          />
                        ) : (
                          <Typography id="email" style={{ marginRight: -25 }}>
                            {currentUser.email}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item>
                      {editEmail ? (
                        <>
                          <Paper className={classes.paperText}>
                            <Tooltip title="Submit New Email">
                              <span>
                                <Button
                                  onClick={handleSubmit}
                                  variant="contained"
                                  color="secondary"
                                  className={classes.buttonEdit}
                                  style={{ marginRight: 10 }}
                                  disabled={!validEmail}
                                >
                                  Submit
                                  <p style={{ display: "none" }}>email</p>
                                </Button>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel Changes">
                              <Button
                                onClick={(e) => {
                                  handleCancel(e);
                                  setValidEmail(true);
                                  setEmailError(false);
                                  setEmailHelper("");
                                }}
                                variant="contained"
                                color="default"
                                className={classes.buttonEdit}
                              >
                                Cancel
                                <p style={{ display: "none" }}>email</p>
                              </Button>
                            </Tooltip>
                          </Paper>
                        </>
                      ) : (
                        <Paper
                          className={classes.paperText}
                          style={{
                            paddingRight: 81,
                            paddingLeft: 81,
                          }}
                        >
                          <Tooltip title="Edit Email">
                            <Button
                              onClick={handleEdit}
                              variant="contained"
                              color="primary"
                              className={classes.buttonEdit}
                            >
                              Edit
                              <p style={{ display: "none" }}>email</p>
                            </Button>
                          </Tooltip>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item>
                      <Paper
                        className={classes.paperHead}
                        style={{ marginLeft: 2 }}
                      >
                        <Typography
                          className={classes.type}
                          style={{ paddingRight: 15, paddingLeft: 16 }}
                        >
                          Password
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs>
                      <Paper className={classes.paperText}>
                        {editPass ? (
                          <>
                            <TextField style={{ display: "none" }} />
                            <TextField
                              id="oldPass"
                              label="Current Password"
                              variant="outlined"
                              type="password"
                              size="small"
                              required={true}
                              className={classes.inputPass}
                              onBlur={handleOldPassCheck}
                              onChange={handleOldPassCheck}
                              error={passError}
                              helperText={oldPHelper}
                            />
                            <br />
                            <TextField
                              id="newPass"
                              label="New Password"
                              variant="outlined"
                              type="password"
                              size="small"
                              required={true}
                              className={classes.inputPass}
                              onBlur={handleNewPassCheck}
                              onChange={handleNewPassCheck}
                              error={passError}
                              helperText={newPHelper}
                            />
                            <br />
                            <TextField
                              id="confirmPass"
                              label="Confirm Password"
                              variant="outlined"
                              type="password"
                              size="small"
                              required={true}
                              className={classes.inputPass}
                              onBlur={handleConfirmPassCheck}
                              onChange={handleConfirmPassCheck}
                              error={passError}
                              helperText={confirmPHelper}
                            />{" "}
                            <br />
                            <Typography
                              variant="body2"
                              style={{ marginTop: 20 }}
                            >
                              Passwords must adhere to the following:
                              <ul style={{ marginTop: 5, marginBottom: -5 }}>
                                <li>Contain at least 8 characters long</li>
                                <li>Contain at least 1 uppercase letter</li>
                                <li>Contain at least 1 lowercase letter</li>
                                <li>Contain at least 1 number</li>
                                <li>
                                  Contain at least 1 special character: @ $ ! %
                                  * ? &
                                </li>
                              </ul>
                            </Typography>
                          </>
                        ) : (
                          <TextField
                            variant="outlined"
                            type={seePass ? "text" : "password"}
                            placeholder="Password"
                            size="small"
                            value={currentUser.password}
                            className={classes.input}
                          />
                        )}
                      </Paper>
                    </Grid>

                    <Grid item>
                      {editPass ? (
                        <>
                          <Paper className={classes.paperText}>
                            <Tooltip title="Submit New Password">
                              <span>
                                <Button
                                  onClick={handleSubmit}
                                  variant="contained"
                                  color="secondary"
                                  className={classes.buttonEdit}
                                  style={{ marginRight: 10 }}
                                  disabled={!validPass || !validConfirm}
                                >
                                  Submit
                                  <p style={{ display: "none" }}>password</p>
                                </Button>
                              </span>
                            </Tooltip>
                            <Tooltip title="Cancel Change">
                              <Button
                                onClick={(e) => {
                                  handleCancel(e);
                                  setValidPass(true);
                                  setPassError(false);
                                  setOldPHelper("");
                                  setNewPHelper("");
                                  setConfirmPHelper("");
                                }}
                                variant="contained"
                                color="default"
                                className={classes.buttonEdit}
                              >
                                Cancel
                                <p style={{ display: "none" }}>password</p>
                              </Button>
                            </Tooltip>
                          </Paper>
                        </>
                      ) : (
                        <Paper
                          className={classes.paperText}
                          style={{ paddingRight: 30, paddingLeft: 30 }}
                        >
                          <Tooltip title="Toggle Show/Hide Password">
                            <Button
                              variant="contained"
                              color="primary"
                              style={{
                                marginRight: 10,
                                marginTop: -6,
                                marginLeft: 0,
                                marginBottom: -6,
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                setSeePass(!seePass);
                              }}
                            >
                              Toggle
                            </Button>
                          </Tooltip>
                          <Tooltip title="Edit Password">
                            <Button
                              id="password"
                              onClick={handleEdit}
                              variant="contained"
                              color="primary"
                              className={classes.buttonEdit}
                            >
                              Edit
                              <p style={{ display: "none" }}>password</p>
                            </Button>
                          </Tooltip>
                        </Paper>
                      )}
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Paper
                          className={classes.paperHead}
                          style={{ marginLeft: 10 }}
                        >
                          <Typography
                            className={classes.type}
                            style={{ paddingRight: 12.1, paddingLeft: 12.1 }}
                          >
                            Supervisor
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs style={{ overflow: "hidden" }}>
                        <Paper
                          className={classes.paperText}
                          style={{ overflow: "hidden" }}
                        >
                          {editSupervisor ? (
                            <TextField
                              id="newSupervisor"
                              variant="outlined"
                              select
                              defaultValue={currentUser.supervisor_id || "N/A"}
                              size="small"
                              className={classes.input}
                              autoFocus={true}
                              required={true}
                              style={{ width: 225 }}
                              onChange={(e) => setSupervisor(e.target.value)}
                              onBlur={(e) => setSupervisor(e.target.value)}
                            >
                              <MenuItem value="" disabled>
                                <em>Available Supervisors</em>
                              </MenuItem>
                              <MenuItem value="N/A">N/A</MenuItem>
                              {allUsers.map((user) => {
                                return (
                                  <MenuItem
                                    key={uuidv4()}
                                    value={user.id}
                                    disabled={
                                      user.id === currentUserDetails.user_id
                                    }
                                  >{`${user.fname} ${user.lname} (${user.rank})`}</MenuItem>
                                );
                              })}
                            </TextField>
                          ) : (
                            <Typography
                              id="supervisor"
                              style={{ marginRight: -25 }}
                            >
                              {currentUserDetails.supervisor_name || "N/A"}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                      <Grid item>
                        {editSupervisor ? (
                          <>
                            <Paper
                              className={classes.paperText}
                              style={{ marginRight: 7 }}
                            >
                              <Tooltip title="Submit Supervisor">
                                <span>
                                  <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="secondary"
                                    className={classes.buttonEdit}
                                    style={{ marginRight: 10 }}
                                    disabled={!supervisor}
                                  >
                                    Submit
                                    <p style={{ display: "none" }}>
                                      supervisor
                                    </p>
                                  </Button>
                                </span>
                              </Tooltip>
                              <Tooltip title="Cancel Changes">
                                <Button
                                  onClick={(e) => {
                                    handleCancel(e);
                                  }}
                                  variant="contained"
                                  color="default"
                                  className={classes.buttonEdit}
                                >
                                  Cancel
                                  <p style={{ display: "none" }}>supervisor</p>
                                </Button>
                              </Tooltip>
                            </Paper>
                          </>
                        ) : (
                          <Paper
                            className={classes.paperText}
                            style={{
                              paddingRight: 81,
                              paddingLeft: 81,
                              marginRight: 8,
                            }}
                          >
                            <Tooltip title="Change Supervisor">
                              <Button
                                onClick={handleEdit}
                                variant="contained"
                                color="primary"
                                className={classes.buttonEdit}
                              >
                                Edit
                                <p style={{ display: "none" }}>supervisor</p>
                              </Button>
                            </Tooltip>
                          </Paper>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} style={{ marginTop: 10 }}>
                    <Grid item style={{ width: 167, marginLeft: 1 }}>
                      <Paper className={classes.paper}>
                        <Typography className={classes.type}>
                          Subordinates
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs>
                      <Paper
                        className={classes.paper}
                        style={{ maxHeight: 65, overflow: "auto" }}
                      >
                        {allUsers.map((user) => {
                          if (user.supervisor_id === currentUser.user_id) {
                            return (
                              <Grid
                                container
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  key={uuidv4()}
                                  style={{
                                    cursor: "pointer",
                                    marginRight: 20,
                                  }}
                                >
                                  {user.fname +
                                    " " +
                                    user.lname +
                                    " (" +
                                    user.rank +
                                    ")"}
                                </Typography>

                                <Tooltip
                                  title={`${user.email}`}
                                  id={`${user.email}`}
                                >
                                  <Button
                                    style={{ marginTop: -2, marginBottom: 8 }}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => {
                                      navigator.clipboard
                                        .writeText(user.email)
                                        .then(setOpenSnack(true));
                                    }}
                                  >
                                    Copy Email
                                  </Button>
                                </Tooltip>
                              </Grid>
                            );
                          }
                        })}
                        <div style={{ marginBottom: 0.5, marginTop: 0.5 }}>
                          <Typography
                            key={uuidv4()}
                            variant="caption"
                            style={{ color: "lightgray" }}
                          >
                            End of List
                          </Typography>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs>
                      <Paper className={classes.paper}>
                        <Typography className={classes.type}>
                          <Tooltip title="Delete Your Account">
                            <Button
                              id="password"
                              onClick={handleDelete}
                              variant="contained"
                              color="secondary"
                              className={classes.buttonEdit}
                              style={{ margin: -50 }}
                            >
                              Delete Your Account
                            </Button>
                          </Tooltip>
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </main>
      </>
    );
  }
}
