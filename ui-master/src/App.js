
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import NoteIcon from '@material-ui/icons/Note';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import ArchiveIcon from '@material-ui/icons/Archive';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));


const App = () => {
  const classes = useStyles();

  const [page, setPage] = useState("Home")
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  
  const handleDrawerOpen = () => {
      setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
      setDrawerOpen(false);
  };

  const nav = <>
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <img src="https://raw.githubusercontent.com/pham-andrew/SDI-Capstone-Group-5/main/docs/icon.png" style={{position: 'flex', top: '10px', height:'45px', paddingRight: "10px"}}></img>
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          R2D2
        </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
          variant="permanent"
          classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
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
                <ListItem button onClick={()=>setPage("create")}>
                <ListItemIcon>
                  <NoteIcon />
                </ListItemIcon>
                <ListItemText primary="Create Template" />
                </ListItem>
                <ListItem button onClick={()=>setPage("initial")}>
                <ListItemIcon>
                  <AssignmentReturnedIcon />
                </ListItemIcon>
                <ListItemText primary="Initial Routing" />
                </ListItem>
                <ListItem button onClick={()=>setPage("dashboard")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Routing Dashboard" />
                </ListItem>
                <ListItem button onClick={()=>setPage("archive")}>
                <ListItemIcon>
                  <ArchiveIcon />
                </ListItemIcon>
                <ListItemText primary="Archive" />
                </ListItem>
                <ListItem button onClick={()=>setPage("profile")}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={()=>setPage("admin")}>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
                </ListItem>
              </div>
            </List>
          <Divider />
      </Drawer>
    </div>
  </>

  if(page==='create')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Create
            </Paper>
          </Container>
        </main>
      </div>
    )

  if(page==='routing')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Initial Routing
            </Paper>
          </Container>
        </main>
      </div>
    )

  if(page==='dashboard')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Dashboard
            </Paper>
          </Container>
        </main>
      </div>
    )
  
  if(page==='archive')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Archive
            </Paper>
          </Container>
        </main>
      </div>
    )
  
  if(page==='profile')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Profile
            </Paper>
          </Container>
        </main>
      </div>
    )

  if(page==='admin')
    return (
      <div className={classes.root}>
        {nav}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Paper className={classes.paper}>
              Admin
            </Paper>
          </Container>
        </main>
      </div>
    )
  
  return (
    <div className={classes.root}>
      {nav}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.paper}>
            Homepage
          </Paper>
        </Container>
      </main>
    </div>
  )
};

export default App;