import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import TemplateContext from "../../contexts/TemplateContext";
import AppContext from "../../contexts/AppContext";
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
    marginLeft: -20,
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
  const { groups } = useContext(TemplateContext);
  const { currentUserDetails, reload } = useContext(AppContext);
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [stages, setStages] = useState({ id: tabValue });

  useEffect(() => {
    if (groups) {
      setLeft(groups);
    }
  }, [reload]);

  useEffect(() => {
    if (right.length !== 0) {
      setStages({ ...stages, substages: right });
    }
  }, [right]);

  const handleChange = (event) => {
    setStages({ ...stages, [event.target.id]: event.target.value });
    console.log(stages);
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

  // const handleSupervisor = (e) => {
  //   e.preventDefault();
  //   if (supervisor) {
  //     setSupervisor(null);
  //   } else {
  //     setSupervisor(e.target.value);
  //   }
  // };

  const customList = (GpObjs) => (
    <Paper className={classes.paper}>
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
    <Grid container>
      <Grid item xs={8}>
        <Grid item>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            labelPlacement="end"
            id="supervisor"
            value={currentUserDetails.supervisor_id}
            style={{ marginLeft: 5, marginBottom: 11 }}
            label={`Add your supervisor: ${currentUserDetails.supervisor_name}`}
          />
        </Grid>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="center"
          className={classes.root}
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
      <Grid item xs={4}>
        <TextField
          value={stages.stage_name || ""}
          label="Stage Name"
          required={true}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginBottom: 20 }}
          id="stage_name"
          onChange={handleChange}
        />
        <form noValidate style={{ marginBottom: 20 }}>
          <TextField
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
            style={{ marginBottom: 20, width: 159 }}
            id="suspense_integer"
            onChange={handleChange}
          />
          <TextField
            select
            label="Time"
            required={true}
            id="time"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue=""
            onChange={handleChange}
          >
            <MenuItem value="" disabled>
              <em>Measure of Time</em>
            </MenuItem>
            <MenuItem value={"Hours"}>Hours</MenuItem>
            <MenuItem value={"Days"}>Days</MenuItem>
            <MenuItem value={"Weeks"}>Weeks</MenuItem>
          </TextField>
        </form>
        <TextField
          label="Stage Instructions"
          multiline
          rows={4}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          required={true}
          id="stage_instructions"
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default Stage;
