//dependencies
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AppContext from "../contexts/AppContext";
import auth from "../utils/auth";
import { ValidateEmail } from "../utils/regex";

// components
import Registration from "./helpers/Registration";
import {
  TextField,
  makeStyles,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import PromptDialog from "./helpers/PromptDialog";
import AlertDialog from "./helpers/AlertDialog";
import Robot from "./helpers/Robot";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2),
      width: "50chch",
    },
  },
}));

export default function Login() {
  const { setCurrentUser } = useContext(AppContext);
  const { setOpenAlert } = useContext(AppContext);
  const { setOpenPrompt } = useContext(AppContext);
  const { baseURL } = useContext(AppContext);
  const { alert, setAlert } = useContext(AppContext);

  const [validEmail, setValidEmail] = useState(false);
  const [validPass, setValidPass] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [emailHelper, setEmailHelper] = useState("");
  const [passHelper, setPassHelper] = useState("");
  const [prompt, setPrompt] = useState({});

  let history = useHistory();

  const classes = useStyles();

  const handleEmailCheck = () => {
    let email = document.getElementById("email").value;
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

  const handlePassCheck = () => {
    let password = document.getElementById("password").value;
    if (password.length < 1) {
      setValidPass(false);
      setPassError(true);
      setPassHelper("Please enter a valid password");
    } else {
      setValidPass(true);
      setPassError(false);
      setPassHelper("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    await fetch(`${baseURL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.user_id) {
          await setCurrentUser(data);
          await auth.login(() => {
            history.push("/dashboard");
          });
        } else {
          await setAlert({
            title: "Login Error",
            text: data.message,
            actions: "",
            closeAction: "Close",
          });
          await setOpenAlert(true);
        }
      })
      .catch(async () => {
        await setAlert({
          title: "Login Error",
          text: "The provided email or password does not match our records. Please try again or register as a new user.",
          actions: "",
          closeAction: "Close",
        });
        await setOpenAlert(true);
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let body = {
      title: "Register a New Account",
      text: <Registration />,
      actions: "",
      closeAction: "Cancel",
    };
    await setPrompt(body);
    await setOpenPrompt(true);
  };

  return (
    <>
      <PromptDialog bodyPrompt={prompt} />
      <AlertDialog bodyAlert={alert} />
      <div
        style={{
          display: "flex",
          marginTop: "22.5vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          style={{
            textAlign: "center",
            padding: 0,
            marginRight: 40,
            fontWeight: 600,
            letterSpacing: 1.5,
            filter: "drop-shadow(1px 1px 1px #5E5E5E)",
          }}
        >
          R2/D2
          <div style={{ marginTop: -40 }}>
            <Typography
              variant="caption"
              style={{
                textAlign: "center",
              }}
            >
              Rapid Routing and Decision-making Dashboard
            </Typography>
          </div>
        </Typography>

        <form
          className={classes.root}
          noValidate
          autoComplete="true"
          onSubmit={handleLogin}
        >
          <div>
            <TextField
              style={{ marginLeft: 10, marginTop: 10 }}
              id="email"
              label="Email"
              variant="outlined"
              placeholder="Email"
              autoFocus={true}
              required={true}
              onChange={handleEmailCheck}
              error={emailError}
              helperText={emailHelper}
            />
            <br />
            <TextField
              style={{ marginLeft: 10, marginTop: 20 }}
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              placeholder="Password"
              required={true}
              onBlur={(e) => {
                handlePassCheck(e);
                handleEmailCheck(e);
              }}
              onChange={handlePassCheck}
              error={passError}
              helperText={passHelper}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginLeft: 20, marginTop: 10 }}
              disabled={!validPass || !validEmail}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Tooltip title="New Account Registration">
              <Button
                variant="contained"
                color="default"
                style={{ marginLeft: 15, marginTop: 10 }}
                onClick={handleRegister}
              >
                Register
              </Button>
            </Tooltip>
          </div>
        </form>
        <Robot style={{ width: "100%" }} />
      </div>
    </>
  );
}
