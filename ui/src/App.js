// dependencies
import React, { useState } from "react";
import { Switch, Link, Route } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "./contexts/AppContext";
import auth from "./utils/auth";
import ProtectedRoute from "./utils/protected";

// components
import CreateTemplate from "./components/CreateTemplate";
import CreateRequest from "./components/CreateRequest";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Archive from "./components/Archive";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// material-ui
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import NoteIcon from "@material-ui/icons/Note";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import ArchiveIcon from "@material-ui/icons/Archive";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Badge from "@material-ui/core/Badge";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    position: "absolute",
    top: 24,
    zIndex: theme.zIndex.drawer + 3,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontWeight: 500,
    letterSpacing: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "calc(100vh - 48px)",
    overflow: "none",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  link: {
    color: "black",
    textDecoration: "none",
  },
}));

const App = () => {
  const classes = useStyles();

  const [currentUser, setCurrentUser] = useState([]);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [reload, setReload] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [alert, setAlert] = useState({
    title: "Title",
    text: "Text",
    actions: "Actions",
    closeAction: "Close",
  });
  const [prompt, setPrompt] = useState({
    title: "Title",
    text: "Text",
    actions: "Actions",
    closeAction: "Close",
  });
  const [baseURL] = useState(
    process.env.NODE_ENV === "development"
      ? `http://localhost:8080`
      : `https://sdi05-05.staging.dso.mil/api`
  );

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const bar = (shift) => {
    return (
      <AppBar
        position="absolute"
        className={
          shift
            ? clsx(classes.appBar, drawerOpen && classes.appBarShift)
            : clsx(classes.appBar)
        }
      >
        <Toolbar className={classes.toolbar}>
          {shift ? (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                drawerOpen && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            ""
          )}
          <Link exact to="/dashboard" className={classes.link}>
            <img
              src="https://raw.githubusercontent.com/pham-andrew/SDI-Capstone-Group-5/main/ui/public/favicon.png"
              style={{
                position: "flex",
                marginTop: 2.5,
                marginRight: 5,
                height: 50,
                paddingRight: 10,
                filter: "drop-shadow(1px 1px 1px #2E2E2E)",
              }}
            />
          </Link>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.title}
          >
            R2/D2
          </Typography>
          {shift ? (
            <IconButton
              color="inherit"
              onClick={() =>
                auth.logout(async () => {
                  window.location.href = `${window.location.origin}/`;
                })
              }
            >
              <Badge color="secondary">
                <Link exact to="/" style={{ color: "white" }}>
                  <ExitToAppIcon />
                </Link>
              </Badge>
            </IconButton>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
    );
  };

  const nav = (
    <>
      <div className={classes.root}>
        {bar(true)}
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !drawerOpen && classes.drawerPaperClose
            ),
          }}
          open={drawerOpen}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <div>
              <Link exact to="/dashboard" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Routing Dashboard" />
                </ListItem>
              </Link>
              <Link exact to="/template" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <NoteIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Template" />
                </ListItem>
              </Link>
              <Link exact to="/request" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <AssignmentReturnedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Request" />
                </ListItem>
              </Link>
              <Link exact to="/archive" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <ArchiveIcon />
                  </ListItemIcon>
                  <ListItemText primary="Archive" />
                </ListItem>
              </Link>
              <Link exact to="/profile" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText disabled={true} primary="Profile" />
                </ListItem>
              </Link>
              <Link exact to="/jedi-only" className={classes.link}>
                <ListItem button>
                  <ListItemIcon>
                    <SupervisorAccountIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItem>
              </Link>
            </div>
          </List>
          <Divider />
        </Drawer>
      </div>
    </>
  );
  return (
    <AppContext.Provider
      value={{
        alert,
        setAlert,
        prompt,
        setPrompt,
        openPrompt,
        setOpenPrompt,
        openAlert,
        setOpenAlert,
        baseURL,
        currentUser,
        setCurrentUser,
        currentUserDetails,
        setCurrentUserDetails,
        reload,
        setReload,
      }}
    >
      <Switch>
        <Route exact path="/">
          {bar(false)}
          <Login />
        </Route>

        <Route exact path="/template">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                  <ProtectedRoute component={CreateTemplate} />
                </Paper>
              </Container>
            </main>
          </div>
        </Route>
        <Route exact path="/request">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                  <ProtectedRoute component={CreateRequest} />
                </Paper>
              </Container>
            </main>
          </div>
        </Route>
        <Route exact path="/dashboard">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                  <ProtectedRoute component={Dashboard} />
                </Paper>
              </Container>
            </main>
          </div>
        </Route>

        <Route exact path="/archive">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <ProtectedRoute component={Archive} />
              </Container>
            </main>
          </div>
        </Route>

        <Route exact path="/profile">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <ProtectedRoute component={Profile} />
              </Container>
            </main>
          </div>
        </Route>

        <Route exact path="/jedi-only">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <ProtectedRoute component={Admin} />
              </Container>
            </main>
          </div>
        </Route>

        <Route path="*">
          {bar(false)}
          <div
            style={{
              marginTop: 50,
              padding: 50,
              font: "14 px Lucida Grande, Helvetica, Arial, sans-serif",
            }}
          >
            <Typography variant="h3">404 Error: Path Not Found</Typography>{" "}
            <br />
            <Typography variant="body2">
              You weren't supposed to see this! Click on the R2/D2 icon at the
              top to return to the home screen.
            </Typography>
            <br />
            <iframe
              width="850"
              height="500"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ marginBottom: 10 }}
            />{" "}
            <br />
            <Typography variant="body2">
              You can thank your browser for forcing us to mute this video while
              autoplay is enabled.
            </Typography>
          </div>
        </Route>
      </Switch>
    </AppContext.Provider>
  );
};

export default App;
