import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function Profile() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="uuid"
            name="uuid1"
            label="uuid"
            fullWidth
            autoComplete="uuid"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="rank"
            name="rank"
            label="Rank/Grade"
            fullWidth
            autoComplete="rank"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            fullWidth
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField id="email2" name="email2" label="Re-Type Email" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pass"
            name="pass"
            label="Password"
            fullWidth
            autoComplete="pass"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="pass"
            name="pass"
            label="Re-Type Password"
            fullWidth
            autoComplete="pass"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveEmailAddress" value="yes" />}
            label="Use this address"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}


// body {
//   margin: 0;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//     'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//     sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   background-image: url('https://c4.wallpaperflare.com/wallpaper/565/524/843/star-wars-r2-d2-minimalism-wallpaper-preview.jpg');
//   color: white;
//   background-repeat:no-repeat;
//   background-color: black;

// }
