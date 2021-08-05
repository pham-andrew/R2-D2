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
import TemplateManage from "./components/TemplateManage";
import CreateRequest from "./components/CreateRequest";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Archive from "./components/Archive";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Request from "./components/Request";

import {
  Drawer,
  List,
  Divider,
  ListItem,
  AppBar,
  Typography,
  Toolbar,
  Container,
  Paper,
  Badge,
  Tooltip,
} from "@material-ui/core";

// icons
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@material-ui/core/IconButton";
import NoteIcon from "@material-ui/icons/Note";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Icon as JediIcon } from "@iconify/react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ArchiveIcon from "@material-ui/icons/Archive";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";

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
    top: 23.5,
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
  const [allUsers, setAllUsers] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
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
            <Tooltip title="To Dashboard">
              <img
                src={process.env.PUBLIC_URL + "/favicon.png"}
                style={{
                  position: "flex",
                  marginTop: 2.5,
                  marginRight: 5,
                  height: 50,
                  paddingRight: 10,
                  filter: "drop-shadow(1px 1px 1px #2E2E2E)",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
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
                <Tooltip title="Dashboard" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Routing Dashboard" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Divider style={{ margin: 7.5 }} />
              <Link exact to="/template" className={classes.link}>
                <Tooltip title="Create Template" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <NoteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create Template" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Link exact to="/request" className={classes.link}>
                <Tooltip title="Create Request" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create Request" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Divider style={{ margin: 7.5 }} />
              <Link exact to="/template/manage" className={classes.link}>
                <Tooltip title="Manage Templates" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <CollectionsBookmarkIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Templates" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Link exact to="/archive" className={classes.link}>
                <Tooltip title="Request Archive" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Request Archive" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Divider style={{ margin: 7.5 }} />
              <Link exact to="/profile" className={classes.link}>
                <Tooltip title="Profile" placement="right">
                  <ListItem button>
                    <ListItemIcon>
                      <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText disabled={true} primary="Profile" />
                  </ListItem>
                </Tooltip>
              </Link>
              <Link exact to="/jedi-only" className={classes.link}>
                <Tooltip title="Jedi Only" placement="right">
                  <ListItem button>
                    <ListItemIcon
                      style={{ display: "flex", justifyContent: "start" }}
                    >
                      <JediIcon
                        icon="fa-solid:jedi"
                        style={{ fontSize: 21.5 }}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>
                </Tooltip>
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
        allUsers,
        setAllUsers,
        openSnack,
        setOpenSnack,
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

        <Route exact path="/template/manage">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                  <ProtectedRoute component={TemplateManage} />
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
                <Paper
                  className={classes.paper}
                  style={{ maxHeight: 900, overflow: "auto" }}
                >
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
                <Paper className={classes.paper}>
                  <ProtectedRoute component={Archive} />
                </Paper>
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
                <Paper className={classes.paper}>
                  <ProtectedRoute component={Admin} />
                </Paper>
              </Container>
            </main>
          </div>
        </Route>

        {/* for testing */}
        <Route exact path="/r">
          <div className={classes.root}>
            {nav}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Container maxWidth="lg" className={classes.container}>
                <Paper className={classes.paper}>
                  <ProtectedRoute component={Request} />
                </Paper>
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
