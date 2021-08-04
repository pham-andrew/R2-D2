import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import TemplateContext from "../../contexts/TemplateContext";
import AppContext from "../../contexts/AppContext";
import AlertDialog from "./AlertDialog";
import {
  ListItemText,
  MenuItem,
  ListItemIcon,
  ListItem,
  List,
  Paper,
  FormControlLabel,
  Button,
  Checkbox,
  TextField,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginLeft: 5,
  },
  paper: {
    width: 220,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0.5),
  },
}));

function notOnSide(a, b) {
  let tmpArray = [];
  a.forEach((value) => {
    let found = false;
    b.forEach((group) => {
      if (group.id === value.id) {
        return (found = true);
      }
    });
    if (!found) tmpArray.push(value);
  });
  return tmpArray;
}

function notChecked(a, b) {
  let tmpArray = [];
  a.forEach((value) => {
    let found = false;
    b.forEach((group) => {
      if (group.id === value) {
        return (found = true);
      }
    });
    if (!found) tmpArray.push(value);
  });
  return tmpArray;
}

function intersection(a, b) {
  let tmpArray = [];
  a.forEach((value) => {
    b.forEach((group) => {
      if (group.id === value) {
        tmpArray.push(group);
        return;
      }
    });
  });
  return tmpArray;
}

const Stage = ({ tabValue }) => {
  const classes = useStyles();
  const { stages, handleStageSubmit, currentUserDetails, groups } =
    useContext(TemplateContext);
  const { setReload } = useContext(AppContext);
  const [supervisor, setSupervisor] = useState(null);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [stage, setStage] = useState({});
  // const [openAlert, setOpenAlert] = useState(false);
  // const [alert, setAlert] = useState({
  //   title: "Title",
  //   text: "Text",
  //   actions: "Actions",
  //   closeAction: "Close",
  // });

  // console.log("stage render");
  // console.log(stage);

  useEffect(() => {
    if (stages[tabValue]) {
      setStage({ ...stage, ...stages[tabValue] });
      if (stages[tabValue].substages && stages[tabValue].substages.length > 0) {
        // console.log(stages[tabValue].substages);
        setRight(stages[tabValue].substages);
        setLeft(notOnSide(groups, stages[tabValue].substages));
        setReload(false);
      } else if (groups) {
        if (stages[tabValue].substages.supervisor_id) {
          handleSupervisor();
        }
        setLeft(groups);
      }
    } else if (groups) {
      setLeft(groups);
    }
  }, [stages]);

  // function updateTransferList() {
  //   console.log(stage.substages);
  //   if (stage.substages && stage.substages.length !== 0) {
  //     console.log("Transferlist updated with substages")
  //   } else if (groups) {
  //     console.log("Transferlist updated with groups");
  //     setLeft(groups);
  //   }
  // }

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (supervisor) {
      setStage({ ...stage, substages: { supervisor_id: supervisor } });
    } else if (right.length !== 0) {
      setStage({ ...stage, substages: right });
    }
  }, [right, supervisor]);

  const handleStageChange = (event) => {
    let id = event.target.id;
    if (!id) id = "time";
    setStage({ ...stage, [id]: event.target.value });
    // console.log(stage);
  };

  const handleSubmit = async (e, stageObj) => {
    event.preventDefault();
    // console.log("Submitted in stage");
    if (!stage.substages) {
      // await setAlert({
      //   title: "Submission Error",
      //   text: "Please add groups to the stage.",
      //   closeAction: "Okay",
      // });
      // await setOpenAlert(true);
      return alert(`Please add groups or supervisor to ${stage.stage_name}`);
    } else if (stage.substages.length > 0 || supervisor) {
      handleStageSubmit(e, stageObj);
    } else {
      // console.log("Passed stage validation");
      return alert(`Please add groups or supervisor to ${stage.stage_name}`);
    }
  };

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (grpObj) => {
    const currentIndex = checked.indexOf(grpObj.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(grpObj.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(notOnSide(left, leftChecked));
    setChecked(notChecked(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(notOnSide(right, rightChecked));
    setChecked(notChecked(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleSupervisor = async () => {
    if (!supervisor) {
      await setSupervisor(currentUserDetails.supervisor_id);
    } else {
      await setSupervisor(null);
    }
  };

  const customList = (GpObjs) => (
    <Paper className={classes.paper} style={{ height: 232.5 }}>
      <List dense component="div" role="list">
        {GpObjs.map((group) => {
          const labelId = `transfer-list-item-${group.id}-label`;
          return (
            <ListItem
              key={uuidv4()}
              role="listitem"
              button
              onClick={() => handleToggle(group)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(group.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={group.name} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <>
      <form
        // noValidate
        style={{ marginTop: 20 }}
        onSubmit={(e) => handleSubmit(e, stage)}
      >
        <Grid container>
          <Grid item xs={4}>
            <TextField
              value={stage.stage_name || ""}
              label="Stage Name"
              required={true}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: 22, marginTop: 15 }}
              id="stage_name"
              onChange={handleStageChange}
            />

            <TextField
              value={stage.suspense_integer || ""}
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
              style={{ marginBottom: 22, width: 127 }}
              id="suspense_integer"
              onChange={handleStageChange}
            />
            <TextField
              value={stage.time || ""}
              select
              label="Time"
              required={true}
              id="time"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue=""
              onChange={handleStageChange}
            >
              <MenuItem value="" disabled>
                <em>Measure of Time</em>
              </MenuItem>
              <MenuItem value={"Hours"}>Hours</MenuItem>
              <MenuItem value={"Days"}>Days</MenuItem>
              <MenuItem value={"Weeks"}>Weeks</MenuItem>
            </TextField>

            <TextField
              value={stage.stage_instructions || ""}
              label="Stage Instructions"
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required={true}
              id="stage_instructions"
              onChange={handleStageChange}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    disabled={!currentUserDetails.supervisor_name}
                    checked={supervisor}
                    onClick={handleSupervisor}
                  />
                }
                labelPlacement="end"
                id="supervisor"
                value={currentUserDetails.supervisor_id}
                style={{ marginLeft: 5, marginBottom: 11 }}
                label={`Assign stage to supervisor: ${
                  currentUserDetails.supervisor_name || "N/A"
                }`}
              />
            </Grid>
            <Grid
              container
              spacing={0}
              justifyContent="center"
              alignItems="center"
              className={classes.root}
              style={supervisor ? { display: "none" } : {}}
            >
              <Grid item>{customList(left)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleAllRight}
                    disabled={left.length === 0}
                  >
                    ≫
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                  >
                    &gt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                  >
                    &lt;
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    className={classes.button}
                    onClick={handleAllLeft}
                    disabled={right.length === 0}
                  >
                    ≪
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList(right)}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              style={{ position: "relative", bottom: -25, left: 700 }}
            >
              Save Stage
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default Stage;
