import React, { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import TemplateContext from "../../contexts/TemplateContext";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import {
  ListItemText,
  MenuItem,
  ListItemIcon,
  ListItem,
  List,
  Paper,
} from "@material-ui/core";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const Stage = () => {
  const classes = useStyles();
  const { tabList, stages, setStages, groups } = useContext(TemplateContext);
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(groups);
  const [right, setRight] = React.useState([]);
  console.log(groups);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
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
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

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
              onClick={handleToggle(group)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(group.checked) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
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
        <Grid
          container
          spacing={2}
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
          label="Stage Name"
          required={true}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginBottom: "20px" }}
        />
        <form noValidate style={{ marginBottom: "20px" }}>
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
            style={{ marginBottom: "20px", width: 159 }}
          />
          <TextField
            select
            label="Time"
            required={true}
            default
            id="time"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          >
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
        />
      </Grid>
    </Grid>
  );
};

export default Stage;
