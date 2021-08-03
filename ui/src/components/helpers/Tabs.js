//bug: deletion not working sometimes, stale state maybe?
import React, { useState, useContext, useMemo } from "react";
import { AppBar, Tabs, Tab, Grid, Button, Divider } from "@material-ui/core";
// import TemplateContext from "../../contexts/TemplateContext";
import { makeStyles } from "@material-ui/styles";
import TemplateContext from "../../contexts/TemplateContext";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { v4 as uuidv4 } from "uuid";
import Stage from "./Stage";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "60px",
    width: "100%",
    backgroundColor: "#fff",
  },
  appBar: {
    color: "inherit",
    backgroundColor: "a09b87",
    "& .myTab": {
      backgroundColor: "yellow",
      color: "white",
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const CustomTabs = (props) => {
  const classes = useStyles();
    const { user, groups } = props;
  const { tabValue, setTabValue } = useContext(TemplateContext);
  const [stages, setStages] = useState({})
  const [tabList, setTabList] = useState([
    {
      key: 0,
      id: 0,
    },
  ]);



  const handleTabChange = (event, value) => {
    setTabValue(value);
  };

  const addTab = (event) => {
    event.preventDefault();
    let id = tabList[tabList.length - 1].id + 1;
    setTabList([...tabList, { key: id, id: id }]);
  };

  const deleteTab = (e) => {
    e.stopPropagation();

    if (tabList.length === 1) {
      return;
    }
    let tabId = parseInt(e.target.id);
    let tabIDIndex = 0;

    let tabs = tabList.filter((value, index) => {
      if (value.id === tabId) {
        tabIDIndex = index;
      }
      return value.id !== tabId;
    });

    let curValue = parseInt(tabValue);
    if (curValue === tabId) {
      if (tabIDIndex === 0) {
        curValue = tabList[tabIDIndex + 1].id;
      } else {
        curValue = tabList[tabIDIndex - 1].id;
      }
    }
    setTabValue(curValue);
    setTabList(tabs);
  };

  let stageTabs = tabList.map((tab) =>{
  return (
        <TabPanel value={tabValue} index={tab.id} key={uuidv4()}>
          <Stage tabValue={tabValue} user={user}/>
        </TabPanel>
      )})

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" style={{ marginBottom: 10, fontWeight: 600 }}>
          Stage Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider orientation="horizontal" style={{ marginBottom: 20 }} />
      </Grid>
      <AppBar position="static" className={classes.appBar}>
        <Grid container alignItems="center" justify="center">
          <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabList.map((tab) => (
                <Tab
                  style={{ color: "white" }}
                  key={tab.key.toString()}
                  value={tab.id}
                  label={"Stage " + (tab.id + 1)}
                  icon={
                    <RemoveCircleOutlineIcon
                      id={tab.id}
                      onClick={deleteTab}
                      style={{ color: "white" }}
                    />
                  }
                  className="mytab"
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
            <Button onClick={addTab} style={{ right: "10px" }}>
              <AddCircleOutlineIcon style={{ color: "white" }} />
            </Button>
          </Grid>
        </Grid>
      </AppBar>
      {stageTabs}
    </>
  );
};

export default CustomTabs;
