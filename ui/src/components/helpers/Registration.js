// dependencies
import React, { useContext, useState, useEffect } from "react";
import { ValidateEmail, ValidatePassword } from "../../utils/regex";
import AppContext from "../../contexts/AppContext";

// components
import {
  TextField,
  makeStyles,
  Button,
  Typography,
  MenuItem,
} from "@material-ui/core";
import AlertDialog from "./AlertDialog";

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: 20,
    width: 400,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Registration() {
  const { baseURL } = useContext(AppContext);
  const { setOpenAlert } = useContext(AppContext);
  const { setOpenPrompt } = useContext(AppContext);
  const { alert, setAlert } = useContext(AppContext);

  const [validEmail, setValidEmail] = useState(false);
  const [validPass, setValidPass] = useState(false);
  const [validConfirm, setValidConfirm] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newPassError, setNewPassError] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState(false);
  const [emailHelper, setEmailHelper] = useState("");
  const [newPHelper, setNewPHelper] = useState("");
  const [confirmPHelper, setConfirmPHelper] = useState("");
  const [rank, setRank] = useState("");
  const [rankHelper, setRankHelper] = useState(null);

  const classes = useStyles();

  const handleRank = (e) => {
    let rank = e.target.value;
    setRank(rank);
    setRankHelper(null);
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

  const handleNewPassCheck = () => {
    let newP = document.getElementById("newPass").value;
    if (ValidatePassword(newP)) {
      setValidPass(false);
      setNewPassError(true);
      setNewPHelper("Please enter a valid password");
    } else {
      setValidPass(true);
      setNewPassError(false);
      setNewPHelper("");
      setConfirmPHelper("");
    }
  };

  const handleConfirmPassCheck = () => {
    let newP = document.getElementById("newPass").value;
    let confirmP = document.getElementById("confirmPass").value;
    if (newP !== confirmP) {
      setValidPass(false);
      setConfirmPassError(true);
      setConfirmPHelper("New password does not match confirmation");
    } else {
      setValidPass(true);
      setConfirmPassError(false);
      setValidConfirm(true);
      setNewPHelper("");
      setConfirmPHelper("");
    }
    if (!rank) {
      setRankHelper("Please choose your rank");
    }
  };

  const handleClick = async (e) => {
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
    let password = document.getElementById("newPass").value;
    await fetch(`${baseURL}/users/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: fname,
        lname: lname,
        rank: rank,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.message === "Success") {
          await setAlert({
            title: "Success!",
            text: `Your account was created! Please login to start using the app.`,
            actions: "",
            closeAction: "Okay",
          });
          await setOpenAlert(true);
          await setOpenPrompt(false);
        } else {
          await setAlert({
            title: "Registration Error",
            text: data.message,
            actions: "",
            closeAction: "Close",
          });
          await setOpenAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <AlertDialog bodyAlert={alert} />
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 500,
        }}
      >
        <form noValidate autoComplete="off">
          <TextField
            style={{ marginTop: 10 }}
            select
            className={classes.input}
            label="Rank"
            required={true}
            id="rank"
            defaultValue={rank}
            onChange={handleRank}
            onBlur={handleRank}
            error={rankHelper}
            helperText={rankHelper}
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
            <MenuItem value={"GS-1"}>GS-1</MenuItem>
            <MenuItem value={"GS-2"}>GS-2</MenuItem>
            <MenuItem value={"GS-3"}>GS-3</MenuItem>
            <MenuItem value={"GS-4"}>GS-4</MenuItem>
            <MenuItem value={"GS-5"}>GS-5</MenuItem>
            <MenuItem value={"GS-6"}>GS-6</MenuItem>
            <MenuItem value={"GS-7"}>GS-7</MenuItem>
            <MenuItem value={"GS-8"}>GS-8</MenuItem>
            <MenuItem value={"GS-9"}>GS-9</MenuItem>
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

          <TextField
            className={classes.input}
            id="newEmail"
            label="Email"
            variant="outlined"
            type="text"
            placeholder="Email"
            required={true}
            onBlur={handleEmailCheck}
            onChange={handleEmailCheck}
            error={emailError}
            helperText={emailHelper}
          />
          <TextField
            className={classes.input}
            id="newPass"
            label="New Password"
            variant="outlined"
            type="password"
            required={true}
            onBlur={handleNewPassCheck}
            onChange={handleNewPassCheck}
            error={newPassError}
            helperText={newPHelper}
          />
          <br />
          <TextField
            className={classes.input}
            id="confirmPass"
            label="Confirm Password"
            variant="outlined"
            type="password"
            required={true}
            onBlur={handleConfirmPassCheck}
            onChange={handleConfirmPassCheck}
            error={confirmPassError}
            helperText={confirmPHelper}
            style={{ marginBottom: 20 }}
          />
          <br />
          <Typography variant="caption">
            Passwords must adhere to the following:
            <ul
              style={{
                marginTop: 10,
                marginBottom: -12.5,
                textDecoration: "none",
              }}
            >
              <li>Contain at least 8 characters long</li>
              <li>Contain at least 1 uppercase letter</li>
              <li>Contain at least 1 lowercase letter</li>
              <li>Contain at least 1 number</li>
              <li>Contain at least 1 special character: @ $ ! % * ? &</li>
            </ul>
          </Typography>
          <br />
          <Button
            style={{ marginTop: 20, marginBottom: 0 }}
            variant="contained"
            color="primary"
            disabled={!rank || !validEmail || !validPass || !validConfirm}
            onClick={handleClick}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
