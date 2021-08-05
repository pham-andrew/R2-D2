//dependencies
import React from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

// styles
import "../styles/loading.css";

export default function Admin() {
  const placeholderMemberInfo =
    "UUID\nRank\nFirst Name\nLast Name\nEmail\nMemberships\nRoute Templates\nCurrent Requests\n";
  const placeholderGroupInfo = "UUID\nName\nMembers";
  const users = ["anakin", "andrew", "yoda", "palpatine"];
  const groups = ["jedi", "star fleet", "storm troopers", "red shirts"];

  return (
    <>
      <Grid container>
        <Grid xs={7}>
          Users
          {users.map((user) => {
            return (
              <Paper style={{ margin: "5px", padding: "5px" }}>
                <Grid container>
                  <Grid xs={10}>{user}</Grid>
                  <Grid xs={2}>
                    <IconButton size={"small"}>
                      <DeleteIcon />
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
        <Grid xs={5}>
          <TextField
            disabled
            label="Member Information"
            multiline
            rows={7}
            value={placeholderMemberInfo}
            variant="outlined"
            style={{ margin: "10px", width: "400px", marginTop: "20px" }}
          />
        </Grid>
        <Grid xs={7}>
          Groups
          {groups.map((group) => {
            return (
              <Paper style={{ margin: "5px", padding: "5px" }}>
                <Grid container>
                  <Grid xs={10}>{group}</Grid>
                  <Grid xs={2}>
                    <IconButton size={"small"}>
                      <DeleteIcon />
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
        <Grid xs={5}>
          <TextField
            disabled
            label="Group Information"
            multiline
            rows={4}
            value={placeholderGroupInfo}
            variant="outlined"
            style={{ margin: "10px", width: "400px", marginTop: "20px" }}
          />
        </Grid>
      </Grid>
    </>
  );
}
