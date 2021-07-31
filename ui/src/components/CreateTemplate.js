import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";
import PropTypes from "prop-types";

import CustomTabs from "./helpers/Tabs";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
  };
}

const CreateTemplate = (props) => {
  const classes = useStyles();

  const [role, setRole] = React.useState("");
  const { children, value, index, ...other } = props;
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const [tab, setTab] = React.useState(0);
  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item xs={3}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel>Role</InputLabel>
              <Select value={role} onChange={handleChange}>
                <MenuItem value={10}>Role 1</MenuItem>
                <MenuItem value={20}>Role 2</MenuItem>
                <MenuItem value={30}>Role 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Template Title" />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "30px" }}>
            <TextField
              label="Template Instructions"
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "20px" }}>
            <Button variant="contained" component="label">
              Upload Document
              <input type="file" hidden />
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12} className={classes.tabs}>
            <CustomTabs />
          </Grid>
        </Grid>
        <Grid item xs={10} />
        <Grid item xs={2} style={{ marginTop: "20px" }}>
          <Button variant="contained" component="label">
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateTemplate;
