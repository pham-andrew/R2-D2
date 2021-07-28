import React from "react";
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from "@material-ui/core";


const Stage = () => {

    const [state, setState] = React.useState({
        g1: true,
        g2: false,
        g3: false,
    });
    const handleCheck = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    const { g1, g2, g3 } = state;

    return(
        <Grid container>
            <Grid item xs={4}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Add Groups To This Stage</FormLabel>
                    <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox 
                            checked={g1} 
                            onChange={handleCheck} 
                            name="g1" 
                            />
                        }
                        label="Group 1"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox 
                            checked={g2} 
                            onChange={handleCheck} 
                            name="g2" 
                            />
                        }
                        label="Group 2"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox 
                            checked={g3} 
                            onChange={handleCheck} 
                            name="g3" 
                            />
                        }
                        label="Group 3"
                    />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid item xs={7}>
                <TextField label="Stage Name" />
                <form noValidate style={{marginBottom: '20px'}}>
                    <TextField
                        label="Suspense"
                        type="datetime-local"
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>
                <TextField
                    label="Stage Instructions"
                    multiline
                    rows={4}
                    variant="outlined"
                />
            </Grid>
        </Grid>
    )
}


export default Stage;